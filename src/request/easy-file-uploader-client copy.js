// 这个函数是对 easy-file-uploader-client 的修改. 修改目的是为了获取切片的进度
import SparkMD5 from 'spark-md5'
import axios from 'axios'
import { SERVER_HOST } from '@/constants/index'

function getBlobSlice() {
  return File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
}

const DEFAULT_CHUNK_SIZE = 1 * 1024 * 1024 // 1M

export default class FileUploaderClient {
  md5
  chunkList
  fileName
  beginId = -1
  finishId = 0

  /**
   * 将file对象进行切片，然后根据切片计算md5
   * @param file 要上传的文件
   * @param totalSliceFunc 回调函数, 传入切片数量
   * @param sliceProgressFunc 回调函数, 跟踪切片进度
   * @param finishSliceFunc 回调函数, 完成切片
   * @returns {}
   */
  async startSlice(file, totalSliceFunc, sliceProgressFunc, finishSliceFunc) {
    if (file === undefined || !totalSliceFunc || !sliceProgressFunc || !finishSliceFunc) {
      throw Error('invalid request options, need file, totalSliceFunc, sliceProgressFunc and finishSliceFunc')
    }
    this.beginId++

    return new Promise((resolve, reject) => {
      let currentChunk = 0
      const chunkSize = DEFAULT_CHUNK_SIZE
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const blobSlice = getBlobSlice()
      const chunkList /* : Blob[] */ = []

      totalSliceFunc(chunks)

      fileReader.onload = e => {
        if (e?.target?.result instanceof ArrayBuffer) {
          spark.append(e.target.result)
        }
        currentChunk++

        sliceProgressFunc(currentChunk)

        // 这种方法有概率出现解析停止的情况
        if (this.beginId != this.finishId) {
          this.md5 = undefined
          this.chunkList = undefined
          this.fileName = undefined
          // setTimeout(() => {
          this.finishId++
          // })
        } else if (currentChunk < chunks) {
          loadNextChunk()
        } else {
          const computedHash = spark.end()
          this.md5 = computedHash
          this.chunkList = chunkList
          this.fileName = file.name
          finishSliceFunc()
          this.finishId++
          resolve()
        }
      }

      fileReader.onerror = e => {
        console.warn('read file error', e)
        reject(e)
      }

      function loadNextChunk() {
        const start = currentChunk * chunkSize
        const end = start + chunkSize >= file.size ? file.size : start + chunkSize

        const chunk = blobSlice.call(file, start, end)
        chunkList.push(chunk)
        fileReader.readAsArrayBuffer(chunk)
      }

      loadNextChunk()
    })
  }

  // 中断解析过程
  stopSlice() {
    this.beginId++
  }

  /**
   * 上传文件方法，当FileUploaderClient的配置项中传入了requestOptions才能使用
   * 会依次执行getChunkListAndFileMd5、配置项中的initFilePartUploadFunc、配置项中的uploadPartFileFunc、配置项中的finishFilePartUploadFunc
   * 执行完成后返回上传结果，若有分片上传失败，则会自动重试
   * @param file 要上传的文件
   * @returns finishFilePartUploadFunc函数Promise resolve的值
   */
  async uploadFile(retryTimes, initFilePartUploadFunc, uploadPartFileFunc, finishFilePartUploadFunc) {
    if (retryTimes === undefined || !initFilePartUploadFunc || !uploadPartFileFunc || !finishFilePartUploadFunc) {
      throw Error('invalid request options, need retryTimes, sumSliceSumFunc, sliceProgressFunc, initFilePartUploadFunc, uploadPartFileFunc and finishFilePartUploadFunc')
    }

    const md5 = this.md5
    const chunkList = this.chunkList
    const fileName = this.fileName
    const retryList = []

    // 当连续 10 个上传都失败时, 就没必要继续了
    const maxContinueErr = 10
    let continueErr = 0
    let successChunkNums = 0

    let uploadId
    // try {
    const { data } = await axios.post(`${SERVER_HOST}api/initUpload`, { name: fileName })
    uploadId = data.uploadId
    initFilePartUploadFunc()
    // } catch (error) {
    //   // 初始化失败时就直接退出吧
    //   throw error
    // }

    for (let index = 0; index < chunkList.length; index++) {
      try {
        await this.uploadPartFile(uploadId, index, chunkList)
        continueErr = 0
        successChunkNums++
        uploadPartFileFunc(successChunkNums)
      } catch (e) {
        continueErr++
        if (continueErr >= maxContinueErr) throw e
        console.warn(`${index} part upload failed`)
        retryList.push(index)
      }
    }

    for (let retry = 0; retry < this.retryTimes; retry++) {
      if (retryList.length > 0) {
        console.log(`retry start, times: ${retry}`)
        for (let a = 0; a < retryList.length; a++) {
          const blobIndex = retryList[a]
          try {
            await this.uploadPartFileFunc(chunkList[blobIndex], blobIndex)
            retryList.splice(a, 1)
            continueErr = 0
            successChunkNums++
            uploadPartFileFunc(successChunkNums)
          } catch (e) {
            continueErr++
            if (continueErr >= maxContinueErr) throw e
            console.warn(`${blobIndex} part retry upload failed, times: ${retry}`)
          }
        }
      }
    }

    if (retryList.length === 0) {
      const { data } = await axios.post(`${SERVER_HOST}api/finishUpload`, {
        name: fileName,
        uploadId,
        md5,
      })
      const url = `${SERVER_HOST}${data.path}`
      finishFilePartUploadFunc(url)
      this.chunkList = undefined
    } else {
      throw Error(`upload failed, some chunks upload failed: ${JSON.stringify(retryList)}`)
    }
  }

  clear() {
    this.chunkList = undefined
    this.md5 = undefined
    this.fileName = undefined
  }

  async uploadPartFile(uploadId, index, chunkList) {
    const formData = new FormData()
    formData.append('uploadId', uploadId)
    formData.append('partIndex', index.toString())
    formData.append('partFile', chunkList[index])
    await axios.post(`${SERVER_HOST}api/uploadPart`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
  }
}

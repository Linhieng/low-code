// 这个函数是对 easy-file-uploader-client 的修改. 修改目的是为了获取切片的进度
import SparkMD5 from 'spark-md5'

function getBlobSlice() {
  return File.prototype.slice || File.prototype.mozSlice || File.prototype.webkitSlice
}

const DEFAULT_CHUNK_SIZE = 5 * 1024 * 1024
const DEFAULT_OPTIONS = {
  chunkSize: DEFAULT_CHUNK_SIZE,
}

export class FileUploaderClient {
  /*
  fileUploaderClientOptions 类型要求, 不在这里校验, 校验在 fileUploadClient.js 中
    chunkSize: number;
    requestOptions?: {
      retryTimes: number;
      sumChunksCallback: (chunks: number) => any;
      sliceProgressCallback: (currentChunk: number, index: number) => any;
      initFilePartUploadFunc: () => Promise<any>;
      uploadPartFileFunc: (chunk: Blob, index: number) => Promise<any>;
      finishFilePartUploadFunc: (md5: string) => Promise<any>;
    };
  */
  fileUploaderClientOptions

  constructor(options) {
    this.fileUploaderClientOptions = Object.assign(DEFAULT_OPTIONS, options)
  }

  /**
   * 将file对象进行切片，然后根据切片计算md5
   * @param file 要上传的文件
   * @param sumChunksCallback 回调函数, 传入切片数量
   * @param sliceProgressCallback 回调函数, 跟踪切片进度
   * @returns 返回md5和切片列表
   */
  async getChunkListAndFileMd5(file, sumChunksCallback, sliceProgressCallback) {
    return new Promise((resolve, reject) => {
      let currentChunk = 0
      const chunkSize = this.fileUploaderClientOptions.chunkSize
      const chunks = Math.ceil(file.size / chunkSize)
      const spark = new SparkMD5.ArrayBuffer()
      const fileReader = new FileReader()
      const blobSlice = getBlobSlice()
      const chunkList /* : Blob[] */ = []

      sumChunksCallback(chunks)

      fileReader.onload = function (e) {
        if (e?.target?.result instanceof ArrayBuffer) {
          spark.append(e.target.result)
        }
        currentChunk++

        sliceProgressCallback(currentChunk)

        if (currentChunk < chunks) {
          loadNextChunk()
        } else {
          const computedHash = spark.end()
          resolve({ md5: computedHash, chunkList })
        }
      }

      fileReader.onerror = function (e) {
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

  /**
   * 上传文件方法，当FileUploaderClient的配置项中传入了requestOptions才能使用
   * 会依次执行getChunkListAndFileMd5、配置项中的initFilePartUploadFunc、配置项中的uploadPartFileFunc、配置项中的finishFilePartUploadFunc
   * 执行完成后返回上传结果，若有分片上传失败，则会自动重试
   * @param file 要上传的文件
   * @returns finishFilePartUploadFunc函数Promise resolve的值
   */
  async uploadFile(file) {
    const requestOptions = this.fileUploaderClientOptions.requestOptions

    if (requestOptions?.retryTimes === undefined || !requestOptions?.sumSliceSumFunc || !requestOptions?.sliceProgressFunc || !requestOptions?.initFilePartUploadFunc || !requestOptions?.uploadPartFileFunc || !requestOptions?.finishFilePartUploadFunc) {
      throw Error('invalid request options, need retryTimes, sumSliceSumFunc, sliceProgressFunc, initFilePartUploadFunc, uploadPartFileFunc and finishFilePartUploadFunc')
    }

    const { md5, chunkList } = await this.getChunkListAndFileMd5(file, requestOptions.sumSliceSumFunc, requestOptions.sliceProgressFunc)
    const retryList = []

    await requestOptions.initFilePartUploadFunc()

    for (let index = 0; index < chunkList.length; index++) {
      try {
        await requestOptions.uploadPartFileFunc(chunkList[index], index)
      } catch (e) {
        console.warn(`${index} part upload failed`)
        retryList.push(index)
      }
    }

    for (let retry = 0; retry < requestOptions.retryTimes; retry++) {
      if (retryList.length > 0) {
        console.log(`retry start, times: ${retry}`)
        for (let a = 0; a < retryList.length; a++) {
          const blobIndex = retryList[a]
          try {
            await requestOptions.uploadPartFileFunc(chunkList[blobIndex], blobIndex)
            retryList.splice(a, 1)
          } catch (e) {
            console.warn(`${blobIndex} part retry upload failed, times: ${retry}`)
          }
        }
      }
    }

    if (retryList.length === 0) {
      return await requestOptions.finishFilePartUploadFunc(md5)
    } else {
      throw Error(`upload failed, some chunks upload failed: ${JSON.stringify(retryList)}`)
    }
  }
}

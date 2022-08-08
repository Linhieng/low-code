import axios from 'axios'
import { FileUploaderClient } from './easy-file-uploader-client'
import { SERVER_HOST } from '@/constants/index'

/**
 * 对 easy-file-uploader-client 进行自己的封装
 * @param file 要上传的文件
 * @param sumSliceSumCallback (可选) 上传前执行, 传入一个总切片数量 chunks
 * @param sliceCallback (可选) 切片过程中执行, 传入一个 currentChunks 获取切片进度
 * @param initCallback (可选) 切片完成, 开始上传, 传入一个 uploadId
 * @param partCallback (可选) 每上传成功一个切片, 传入当前切片的 index
 * @param finishCallback (可选) 上传成功时, 传入文件路径
 * @param options (可选) 可配置切片大小和重试次数
 * @returns
 */
export default async function (file, { controlUploadCallback, sumSliceSumCallback, sliceProgressCallback, initCallback, partCallback, finishCallback }, options) {
  if (!file instanceof File) throw new Error('file 参数不是 File')
  if (typeof finishCallback !== 'function') throw new Error('未提供 controlUploadCallback ')

  typeof sumSliceSumCallback === 'function' || (sumSliceSumCallback = () => {})
  typeof sliceProgressCallback === 'function' || (sliceProgressCallback = () => {})
  typeof initCallback === 'function' || (initCallback = () => {})
  typeof partCallback === 'function' || (partCallback = () => {})
  typeof finishCallback === 'function' || (finishCallback = () => {})

  const chunkSize = options?.chunkSize || 2 * 1024 * 1024 // 2MB
  const retryTimes = options?.retryTimes || 2

  const controlUpload = () =>
    new Promise((res, rej) => {
      controlUploadCallback(res, rej)
    })

  let uploadId
  const fileUploaderClient = new FileUploaderClient({
    chunkSize,
    requestOptions: {
      retryTimes,
      sumSliceSumFunc: chunks => {
        sumSliceSumCallback(chunks)
      },
      sliceProgressFunc: currentChunks => {
        sliceProgressCallback(currentChunks)
      },
      initFilePartUploadFunc: async () => {
        await controlUpload()

        const fileName = file.name
        const { data } = await axios.post(`${SERVER_HOST}api/initUpload`, { name: fileName })
        uploadId = data.uploadId
        initCallback(uploadId)
      },
      uploadPartFileFunc: async (chunk /* Blob */, index /* number */) => {
        const formData = new FormData()
        formData.append('uploadId', uploadId)
        formData.append('partIndex', index.toString())
        formData.append('partFile', chunk)

        await axios.post(`${SERVER_HOST}api/uploadPart`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        partCallback(index)
      },
      finishFilePartUploadFunc: async (md5 /* string */) => {
        const fileName = file.name
        const { data } = await axios.post(`${SERVER_HOST}api/finishUpload`, {
          name: fileName,
          uploadId,
          md5,
        })
        finishCallback(`${SERVER_HOST}${data.path}`)
      },
    },
  })

  return fileUploaderClient.uploadFile(file)
}

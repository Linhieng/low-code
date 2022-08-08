import axios from 'axios'
import { FileUploaderClient } from 'easy-file-uploader-client'
import { SERVER_HOST } from '@/constants/index'

/**
 * 对 easy-file-uploader-client 进行自己的封装
 * @param file 要上传的文件
 * @param initCallback (可选) 初始化上传成功时, 会传入一个 uploadId
 * @param partCallback (可选) 每上传成功一个切片, 就传入一个当前切片的 index
 * @param finishCallback (可选) 上传成功时, 就传入文件所在路径
 * @param options (可选) 可配置切片大小和重试次数
 * @returns
 */
export default function (file, initCallback, partCallback, finishCallback, options) {

  if (!file instanceof File) return 'file 不是 File'

  const chunkSize = options?.chunkSize || 2 * 1024 * 1024 // 2MB
  const retryTimes = options?.retryTimes || 2

  let uploadId

  return new FileUploaderClient({
    chunkSize,
    requestOptions: {
      retryTimes,
      initFilePartUploadFunc: async () => {
        const fileName = file.name
        const { data } = await axios.post(`${SERVER_HOST}api/initUpload`, { name: fileName })
        uploadId = data.uploadId
        typeof initCallback === 'function' && initCallback(uploadId)
      },
      uploadPartFileFunc: async (chunk /* Blob */, index /* number */) => {
        const formData = new FormData()
        formData.append('uploadId', uploadId)
        formData.append('partIndex', index.toString())
        formData.append('partFile', chunk)

        await axios.post(`${SERVER_HOST}api/uploadPart`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        typeof partCallback === 'function' && partCallback(index)
      },
      finishFilePartUploadFunc: async (md5 /* string */) => {
        const fileName = file.name
        const { data } = await axios.post(`${SERVER_HOST}api/finishUpload`, {
          name: fileName,
          uploadId,
          md5,
        })
        typeof finishCallback === 'function' && finishCallback(`${SERVER_HOST}${data.path}`)
      },
    },
  }).uploadFile(file)
}

<template>
  <div className="App">
    <h1>easy-file-uploader-demo</h1>
    <h3>选择文件后点击“上传文件”按钮即可</h3>
    <div className="App">
      <input type="file" name="file" ref="fileInput" />
      <input type="button" value="上传文件" @click="upload" />
    </div>
    <h3>已上传的文件地址: {{url}}</h3>
  </div>
</template>

<script>
import axios from 'axios'
import { FileUploaderClient } from 'easy-file-uploader-client'
import { SERVER_HOST } from '@/constants/index'
const HOST = SERVER_HOST

export default {
  data() {
    let url
    return {
      url,
    }
  },

  methods: {
    upload() {
      const files = this.$refs.fileInput.files
      if (files.length > 0) {
        let uploadId = ''
        const setUrl = (url) => {
          this.url = url
        }
        const fileUploaderClient = new FileUploaderClient({
          chunkSize: 2 * 1024 * 1024, // 2MB
          requestOptions: {
            retryTimes: 2,
            initFilePartUploadFunc: async () => {
              const fileName = files[0].name
              const { data } = await axios.post(`${HOST}api/initUpload`, {
                name: fileName,
              })
              uploadId = data.uploadId
              console.log('初始化上传完成')
              setUrl('')
            },
            uploadPartFileFunc: async (chunk /* Blob */, index /* number */) => {
              const formData = new FormData()
              formData.append('uploadId', uploadId)
              formData.append('partIndex', index.toString())
              formData.append('partFile', chunk)

              await axios.post(`${HOST}api/uploadPart`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
              })
              console.log(`上传分片${index}完成`)
            },
            finishFilePartUploadFunc: async (md5 /* string */) => {
              const fileName = files[0].name
              const { data } = await axios.post(`${HOST}api/finishUpload`, {
                name: fileName,
                uploadId,
                md5,
              })
              console.log(`上传完成，存储地址为：${HOST}${data.path}`)
              setUrl(`${HOST}${data.path}`)
            },
          },
        })
        fileUploaderClient.uploadFile(files[0])
      }
    },
  },
}
</script>

<style></style>

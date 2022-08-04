<template>
  <div className="App">
    <h1>easy-file-uploader-demo</h1>
    <h3>选择文件后点击“上传文件”按钮即可</h3>
    <div className="App">
      <input type="file" name="file" ref="fileInput" />
      <input type="button" value="上传文件" @click="upload" />
    </div>
    <h3>已上传的文件地址: {{ url }}</h3>
    <br>
    <hr>
    <br>
    <div className="App">
      <input type="file" name="file" ref="fileInput2" />
      <input type="button" value="上传文件" @click="upload2" />
    </div>
    <h3>已上传的文件地址: {{ url2 }}</h3>
  </div>
</template>

<script>
import uploadFile from '@/request/fileUploaderClient'

export default {
  data() {
    return {
      url: '',
      url2: ''
    }
  },

  methods: {
    upload() {
      const files = this.$refs.fileInput.files
      if (files.length > 0) {
        uploadFile(
          files[0],
          id => {
            console.log('uploadId', id)
          },
          index => {
            console.log(`第 ${index} 个切片上传完成`)
          },
          url => {
            this.url = url
          },
        )
      }
    },
    upload2() {
      const files = this.$refs.fileInput2.files
      if (files.length > 0) {
        uploadFile(
          files[0],
          id => {
            console.log('uploadId', id)
          },
          index => {
            console.log(`第 ${index} 个切片上传完成`)
          },
          url => {
            this.url2 = url
          },
        )
      }
    },
  },
}
</script>

<style></style>

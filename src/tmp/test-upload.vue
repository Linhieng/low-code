<template>
  <div className="App">
    <h1>easy-file-uploader-demo</h1>
    <h3>选择文件后点击“上传文件”按钮即可</h3>
    <div className="App">
      <input type="file" name="file" ref="fileInput" />
      <button @click="upload" class="btn-submit" title="上传文件">上传文件</button>
    </div>
    <h3>已上传的文件地址: {{ url }}</h3>
    <br />
    <hr />
    <br />
    <div className="App">
      <input type="file" name="file" ref="fileInput2" />
      <button @click="upload2" class="btn-submit" title="上传文件">上传文件</button>
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
      url2: '',
    }
  },

  methods: {
    upload() {
      const files = this.$refs.fileInput.files
      if (files.length > 0) {
        uploadFile(files[0], {
          sumSliceSumCallback: chunks => {
            console.log('debugger: ', chunks)
          },
          sliceProgressCallback: currentChunk => {
            console.log('debugger: ', currentChunk)
          },
          initCallback: id => {
            console.log('uploadId', id)
          },
          partCallback: index => {
            console.log(`第 ${index} 个切片上传完成`)
          },
          finishCallback: url => {
            this.url = url
          },
        })
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

<template>
  <div className="App">
    <!-- <h1>easy-file-uploader-demo</h1>
    <h3>选择文件后点击“上传文件”按钮即可</h3> -->
    <div className="App">
      <input style="padding: 40px" @change="parseFile" type="file" name="file" ref="fileInput" />

      <!-- <button style="padding: 40px" @click="upload" class="btn-submit" title="上传文件"></button> -->
      <button style="padding: 40px" @click="startBtn" class="btn-submit" title="上传文件">上传</button>
    </div>
    <h3>文件：{{ $refs.fileInput?.files.length }}</h3>
    <h3>总切片数量{{ chunks }}</h3>
    <h3>解析文件: {{ parse }}</h3>
    <h3>上传文件: {{ progress }}</h3>
    <h3>已上传的文件地址: {{ url }}</h3>
    <!-- <br />
    <hr />
    <br />
    <div className="App">
      <input type="file" name="file" ref="fileInput2" />
      <button @click="upload2" class="btn-submit" title="上传文件">上传文件</button>
    </div>
    <h3>已上传的文件地址: {{ url2 }}</h3> -->
  </div>
</template>

<script>
import upload from '@/request/fileUploaderClient'

export default {
  data() {
    return {
      url: '',
      url2: '',
      chunks: 0,
      parse: 0,
      progress: 0,
      startBtn: null,
      rej: null,
    }
  },

  methods: {
    parseFile() {
      if (this.rej) {
        this.rej('取消上传')
        this.rej = null
      }
      const files = this.$refs.fileInput.files
      console.log('debugger: ', files)
      if (files.length > 0) {
        upload(files[0], {
          controlUploadCallback: (resolve, rej) => {
            this.startBtn = resolve
            this.rej = rej
          },
          sumSliceSumCallback: chunks => {
            this.chunks = chunks
          },
          sliceProgressCallback: currentChunk => {
            this.parse = currentChunk
          },
          initCallback: id => {
            console.log('uploadId', id)
          },
          partCallback: index => {
            this.progress = index + 1
          },
          finishCallback: url => {
            this.url = url
          },
        }).catch(error => {
          console.warn('捕获 upload 错误: ', error?.message || error)
        })
      }
    },
    upload2() {
      const files = this.$refs.fileInput2.files
      if (files.length > 0) {
        upload(
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

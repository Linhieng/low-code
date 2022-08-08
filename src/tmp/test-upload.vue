<template>
  <div>
    <input style="padding: 40px" @change="startSlice" type="file" name="file" ref="fileInput" />
    <button style="padding: 40px" @click="upload" class="btn-submit" title="上传文件">上传</button>
    <button style="padding: 40px" @click="stopSlice" class="btn-submit" title="上传文件">中断</button>
    <h3>文件：{{ $refs.fileInput?.files.length }}</h3>
    <h3>总切片数量{{ totalSlice }}</h3>
    <h3>解析文件: {{ sliceProgress }}</h3>
    <h3>解析状态: {{ finishSlice }}</h3>
    <h3>上传切片数量: {{ uploadProgress }}</h3>
    <h3>上传状态: {{ finishUpload }}</h3>
    <h3>已上传的文件地址: {{ url }}</h3>
  </div>
  <hr />
  <br />
  <hr />
  <br />
  <div>
    <input style="padding: 40px" @change="startSlice1" type="file" name="file" ref="fileInput1" />
    <button style="padding: 40px" @click="upload1" class="btn-submit" title="上传文件">上传</button>
    <h3>文件：{{ $refs.fileInput1?.files.length }}</h3>
    <h3>总切片数量{{ totalSlice1 }}</h3>
    <h3>解析文件: {{ sliceProgress1 }}</h3>
    <h3>解析状态: {{ finishSlice1 }}</h3>
    <h3>上传切片数量: {{ uploadProgress1 }}</h3>
    <h3>上传状态: {{ finishUpload1 }}</h3>
    <h3>已上传的文件地址: {{ url1 }}</h3>
  </div>
</template>

<script>
import FileUploaderClient from '@/request/easy-file-uploader-client'

export default {
  data() {
    return {
      stuck: false,
      stop: false,

      totalSlice: 0,
      sliceProgress: 0,
      finishSlice: false,
      startUpload: false,
      uploadProgress: 0,
      finishUpload: false,
      url: '',

      totalSlice1: 0,
      sliceProgress1: 0,
      finishSlice1: false,
      startUpload1: false,
      uploadProgress1: 0,
      finishUpload1: false,
      url1: '',
    }
  },
  methods: {
    stopSlice() {
      this.stop = true
      this.fileUploaderClient.stopSlice()
      console.log('debugger: ', '停止！！！！')
    },
    startSlice() {
      const file = this.$refs.fileInput.files[0]
      this.file = file
      this.finishSlice = false
      this.startUpload = false
      this.finishUpload = false
      this.totalSlice = 0
      this.sliceProgress = 0
      this.uploadProgress = 0
      this.url = ''
      if (this.stuck === null && file === undefined) {
        this.fileUploaderClient.clear()
        return
      }

      this.fileUploaderClient.startSlice(
        file,
        totalSlice => {
          this.stop = false
          clearTimeout(this.stuck)
          this.stuck = null
          this.totalSlice = totalSlice
        },
        sliceProgress => {
          console.log('debugger: ', '我就不')
          clearTimeout(this.stuck)
          this.stuck = null
          this.sliceProgress = sliceProgress
          this.stop || (this.stuck = setTimeout(this.startSlice, 500))
        },
        () => {
          clearTimeout(this.stuck)
          this.stuck = null
          this.finishSlice = true
        },
      )
    },
    async upload() {
      const file = this.file
      if (!(file instanceof File)) return
      if (!this.finishSlice) return
      if (this.startUpload) return
      if (this.finishUpload) return

      try {
        await this.fileUploaderClient.uploadFile(
          0,
          () => {
            this.startUpload = true
          },
          num => {
            this.uploadProgress = num
          },
          url => {
            this.url = url
            this.finishUpload = true
          },
        )
      } catch (error) {
        console.warn('捕获 upload 错误: ', error?.message || error)
      }
    },

    startSlice1() {
      const file = this.$refs.fileInput1.files[0]
      this.file1 = file
      this.finishSlice1 = false
      this.startUpload1 = false
      this.finishUpload1 = false
      this.totalSlice1 = 0
      this.sliceProgress1 = 0
      this.uploadProgress1 = 0
      this.url1 = ''
      if (file === undefined) {
        this.fileUploaderClient1.clear()
        return
      }

      this.fileUploaderClient1.startSlice(
        file,
        totalSlice => {
          this.totalSlice1 = totalSlice
        },
        sliceProgress => {
          this.sliceProgress1 = sliceProgress
        },
        () => {
          this.finishSlice1 = true
        },
      )
    },
    async upload1() {
      const file = this.file1
      if (!(file instanceof File)) return
      if (!this.finishSlice1) return
      if (this.startUpload1) return
      if (this.finishUpload1) return

      try {
        await this.fileUploaderClient1.uploadFile(
          0,
          () => {
            this.startUpload1 = true
          },
          num => {
            this.uploadProgress1 = num
          },
          url => {
            this.url1 = url
            this.finishUpload1 = true
          },
        )
      } catch (error) {
        console.warn('捕获 upload 错误: ', error?.message || error)
      }
    },
  },
  mounted() {
    this.fileUploaderClient = new FileUploaderClient()
    this.fileUploaderClient1 = new FileUploaderClient()
  },
}
</script>

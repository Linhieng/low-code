<template>
  <div ref="updateImage" class="update-image" @click.stop>
    <div class="btn" @click="show = true">选择图片</div>
    <div v-show="show" ref="updateBox" class="update-box">
      <div class="area">
        <img v-show="previewSrc !== ''" :src="previewSrc" alt="图片预览" />
        <span v-show="totalSlice === 0">
          点击上传图片
          <br />
          或者拖拽图片到这里来
        </span>
        <div class="parse-status" v-show="totalSlice !== 0 && !finishSlice">
          <span class="cover"></span>
          <p class="status-value">正在解析中...</p>
          <div class="parse-progress">
            <span class="thumb" :style="{ width: sliceProgress + '%', filter: `brightness(${1 + sliceProgress * 0.002})` }"></span>
          </div>
        </div>
        <input ref="input" @change="selectFile" type="file" accept="image/*" />
      </div>

      <div class="config">
        <button class="btn-submit" :class="{ forbidden: this.statusInfo !== '待上传' }" @click="submit">点击上传</button>
        <div class="status">
          <p class="status-value" :style="{ color: statusValueColor }">{{ statusInfo }}</p>
          <div class="upload-progress">
            <span class="thumb" :style="{ backgroundColor: finishUpload ? 'deepskyblue' : '', width: uploadProgress + '%', filter: `brightness(${1 + uploadProgress * 0.002})` }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAinB } from '@/utils'
import FileUploaderClient from '@/request/easy-file-uploader-client'

export default {
  emits: ['update:modelValue'],
  props: ['modelValue'],
  data() {
    return {
      previewSrc: '',
      show: true,

      fileUploaderClient: null,
      totalSlice: 0,
      sliceProgress: 0 /* 0-100 */,
      finishSlice: false,
      startUpload: false,
      uploadProgress: 0 /* 0-100 */,
      finishUpload: false,
      url: '',
      uploadError: false,
    }
  },
  computed: {
    statusInfo() {
      if (this.uploadError) return '出错了'
      if (this.totalSlice === 0) return '未选择'
      if (this.sliceProgress < 100) return '解析中'
      if (this.finishSlice && this.uploadProgress === 0) return '待上传'
      if (this.uploadProgress <= 100 && !this.finishUpload) return '上传中'
      if (this.finishUpload) return '已上传'
    },
    statusValueColor() {
      if (this.statusInfo === '出错了') return '#F00'
      if (this.statusInfo === '未选择') return '#000'
      if (this.statusInfo === '解析中') return '#ddd'
      if (this.statusInfo === '待上传') return '#00F'
      if (this.statusInfo === '上传中') return 'skyblue'
      if (this.statusInfo === '已上传') return '#aaa'
    },
  },
  methods: {
    selectFile() {
      const file = this.$refs.input.files[0]
      this.totalSlice = 0
      this.sliceProgress = 0
      this.finishSlice = false
      this.startUpload = false
      this.uploadProgress = 0
      this.finishUpload = false
      this.url = ''
      this.uploadError = false
      if (file === undefined) {
        this.fileUploaderClient.clear()
        return
      }

      this.previewSrc = window.URL.createObjectURL(file)
      this.fileUploaderClient.startSlice(
        file,
        totalSlice => {
          this.totalSlice = totalSlice
        },
        sliceNum => {
          this.sliceProgress = (sliceNum * 100) / this.totalSlice
        },
        () => {
          this.finishSlice = true
        },
      )
    },
    async submit() {
      // TODO:
      const file = this.$refs.input.files[0]
      if (!(file instanceof File)) return
      if (!this.finishSlice) return
      if (this.startUpload) return
      if (this.finishUpload) return

      try {
        await this.fileUploaderClient.uploadFile(
          1,
          () => {
            this.startUpload = true
          },
          num => {
            this.uploadProgress = (num * 100) / this.totalSlice
          },
          url => {
            this.$emit('update:modelValue', url)
            this.url = url
            this.finishUpload = true
          },
        )
      } catch (error) {
        console.warn('捕获 upload 错误: ', error?.message || error)
        this.uploadError = true
      }
    },
  },
  watch: {
    show() {
      if (this.$refs.input.files[0] === undefined) this.previewSrc = ''
    },
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!isAinB(e.target, this.$refs.updateImage)) this.show = false
    })
    // 该组件只会上传一个文件, 所以直接在这里初始化
    this.fileUploaderClient = new FileUploaderClient()
  },
}
</script>

<style lang="scss">
.update-image {
  width: 150px;
  height: 40px;
  position: absolute;

  .btn {
    width: 100%;
    height: 100%;
    display: grid;
    place-content: center;
    font-size: 16px;
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid #d1d1d1;
    cursor: pointer;
  }

  .update-box {
    width: 350px;
    height: 280px;

    position: absolute;
    z-index: 1;

    bottom: calc(100% + 10px);
    left: -100px;
    padding: 20px;
    box-sizing: border-box;
    background-color: #fff;
    box-shadow: 0 0 10px 0 #aaa;

    .area {
      width: 100%;
      height: 200px;
      display: grid;
      place-content: center;
      border: 1px dashed skyblue;
      position: relative;
      > span {
        text-align: center;
        font-size: 20px;
        color: #999;
      }
      > input[type='file'] {
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        position: absolute;
        z-index: 2;
      }
      > img {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        object-fit: cover;
      }
      .parse-status {
        position: absolute;
        z-index: 1;
        // z-index: 10; 直接覆盖可以解决需要解析中的 “新” “旧” 共存问题
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: grid;
        place-content: center;
        font-size: 20px;
        font-weight: bold;
        .cover {
          position: absolute;
          width: 100%;
          height: 100%;
          display: block;
          box-shadow: 0 0.3px 0.7px #00000012, 0 0.9px 1.7px #00000017, 0 1.8px 3.5px #00000022, 0 10px 7.3px #00000004;
          backdrop-filter: blur(10px);
        }
        .status-value {
          position: relative;
          text-align: center;
          margin-bottom: 10px;
          // color: #fff;
          // text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;
          color: #000;
          text-shadow: -1px -1px 0 #fff, 1px -1px 0 #fff, -1px 1px 0 #fff, 1px 1px 0 #fff;
        }
        .parse-progress {
          width: 200px;
          height: 10px;
          border-radius: 10px;
          border: 1px solid #d1d1d1;
          position: relative;
          overflow: hidden;
          .thumb {
            display: block;
            height: 10px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: skyblue;
            transition: 0.3s;
          }
        }
      }
    }
    .config {
      width: 100%;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      button {
        flex: none;
        width: 100px;
        height: 34px;
        &.forbidden {
          cursor: not-allowed;
          filter: brightness(0.8);
        }
      }

      .status {
        width: 200px;
        display: flex;
        align-items: center;

        .status-value {
          width: 50px;
          margin: 0 10px;
        }
        .upload-progress {
          width: 100px;
          height: 10px;
          border-radius: 10px;
          border: 1px solid #d1d1d1;
          position: relative;
          overflow: hidden;
          .thumb {
            display: block;
            height: 10px;
            position: absolute;
            top: 0;
            left: 0;
            background-color: skyblue;
            transition: 0.3s;
          }
        }
      }
    }
  }
}
</style>

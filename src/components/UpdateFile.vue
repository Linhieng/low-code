<template>
  <div ref="updateEle" class="update-wrapper" @click.stop>
    <div class="btn" @click="show = true">选择{{ typeValue }}</div>
    <div v-show="show" ref="updateBox" class="update-box">
      <div class="area">
        <video v-if="type === 'video'" class="area-preview" v-show="previewSrc !== ''" :src="previewSrc" muted autoplay>错误</video>
        <img v-else-if="type === 'image'" class="area-preview" v-show="previewSrc !== ''" :src="previewSrc" alt="图片预览" />
        <span v-show="totalSlice === 0">
          点击上传{{ typeValue }}
          <br />
          或者拖拽{{ typeValue }}这里来
        </span>
        <div class="parse-status" v-show="totalSlice !== 0 && !finishSlice">
          <span class="cover"></span>
          <p class="status-value">正在解析中...</p>
          <div class="parse-progress">
            <span class="thumb" :style="{ width: sliceProgress + '%', filter: `brightness(${1 + sliceProgress * 0.002})` }"></span>
          </div>
        </div>
        <input ref="input" @change="selectFile" type="file" :accept="`${type}/*`" />
      </div>

      <div class="config">
        <button class="btn-submit" :class="btnClass" @click="submit">
          <span>{{ this.uploadError ? '重新上传' : '点击上传' }}</span>
          <span class="retry">
            <svg t="1660002083572" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1556" width="200" height="200"><path d="M972.8 102.4c-30.72 0-51.2 20.48-51.2 51.2v51.2c-51.2-71.68-122.88-128-204.8-158.72C460.8-66.56 158.72 51.2 46.08 307.2S51.2 865.28 307.2 977.92 865.28 972.8 977.92 716.8H972.8c0-30.72-20.48-51.2-51.2-51.2s-51.2 20.48-51.2 51.2h-5.12c-46.08 76.8-112.64 138.24-199.68 174.08-209.92 87.04-445.44-15.36-532.48-225.28S148.48 215.04 358.4 133.12c189.44-81.92 404.48 0 506.88 174.08H768c-30.72 0-51.2 20.48-51.2 51.2s20.48 51.2 51.2 51.2h204.8c30.72 0 51.2-20.48 51.2-51.2V153.6c0-30.72-20.48-51.2-51.2-51.2z" p-id="1557"></path></svg>
          </span>
        </button>
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
  props: ['modelValue', 'type', 'typeValue'],
  data() {
    return {
      previewSrc: '',
      show: false,

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
    btnClass() {
      if (this.statusInfo === '待上传') return
      if (this.statusInfo === '出错了') return ['uploadError']
      return ['forbidden']
    },
    statusInfo() {
      if (this.uploadError) return '出错了'
      if (this.totalSlice === 0) return '未选择'
      if (this.sliceProgress < 100) return '解析中'
      if (this.finishSlice && !this.startUpload) return '待上传'
      if (this.uploadProgress <= 100 && this.startUpload) return '上传中'
      if (this.finishUpload) return '已上传'
    },
    statusValueColor() {
      if (this.statusInfo === '出错了') return '#F00'
      if (this.statusInfo === '未选择') return '#000'
      if (this.statusInfo === '解析中') return '#ddd'
      if (this.statusInfo === '待上传') return '#00F'
      if (this.statusInfo === '上传中') return 'skyblue'
      if (this.statusInfo === '已上传') return 'deepskyblue'
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
      // 出错时, 可以再次点击上传按钮
      const file = this.$refs.input.files[0]
      if (!(file instanceof File)) return
      if (!this.finishSlice) return
      if (this.startUpload) return
      if (this.finishUpload) return
      this.uploadError = false

      try {
        this.startUpload = true
        await this.fileUploaderClient.uploadFile(
          1,
          () => {
            // 当出错时，不会到达这一步, 视觉效果上会导致从 ”待上传“ —— ”出错了“ 的瞬变
            // this.startUpload = true
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
      if (!isAinB(e.target, this.$refs.updateEle)) this.show = false
    })
    // 该组件只会上传一个文件, 所以直接在这里初始化
    this.fileUploaderClient = new FileUploaderClient()
  },
}
</script>

<style lang="scss">
.update-wrapper {
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
      > .area-preview {
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
        display: flex;
        align-items: center;
        justify-content: center;
        > span {
          font-weight: bold;
        }
        .retry {
          width: 14px;
          height: 14px;
          margin-left: 4px;
          display: none;
          svg {
            width: 100%;
            height: 100%;
          }
        }
        &.forbidden {
          cursor: not-allowed;
          filter: brightness(0.8);
        }
        &.uploadError {
          > span {
            color: #f00;
          }
          .retry {
            display: block;
            svg {
              fill: #f00;
            }
          }
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

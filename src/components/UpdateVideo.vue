<template>
  <div ref="updateVideo" class="update-video" @click.stop>
    <div class="btn" @click="show = true">选择视频</div>
    <div v-show="show" ref="updateBox" class="update-box">
      <div class="area">
        <video v-show="previewSrc !== ''" :src="previewSrc" muted autoplay>错误</video>
        <span v-show="totalSlice === 0">
          点击上传视频
          <br />
          或者拖拽视频这里来
        </span>
        <div class="parse-status" v-show="totalSlice !== 0 && !finishSlice">
          <span class="cover"></span>
          <p class="status-value">正在解析中...</p>
          <div class="parse-progress">
            <span class="thumb" :style="{ width: sliceProgress + '%', filter: `brightness(${1 + sliceProgress * 0.002})` }"></span>
          </div>
        </div>
        <input ref="input" @change="selectFile" type="file" accept="video/*" placeholder="上传图片到这里来" />
      </div>
      <div class="config">
        <button class="btn-submit" @click="submit">点击上传</button>
        <div class="status">
          <!-- <p class="status-value" :style="{ color: submitProgress >= 100 ? 'skyblue' : '' }">{{ statusInfo }}</p> -->
          <p class="status-value">{{ statusInfo }}</p>
          <div class="upload-progress">
            <!-- <span class="thumb" :style="{ width: submitProgress + 'px', filter: `brightness(${1 + submitProgress * 0.002})` }"></span> -->
            <span class="thumb"></span>
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

      fileUpload: null,
      totalSlice: 0,
      sliceProgress: 0 /* 0-100 */,
      finishSlice: false,
      startUpload: false,
      uploadProgress: 0 /* 0-100 */,
      finishUpload: false,
      url: '',
    }
  },
  computed: {
    statusInfo() {
      // if (parseProgress === 0) return '未上传'
      // if (parseProgress < 100) return '解析中'
      // if (parseProgress === 100) return '上传中'
      // if (submitProgress === 100) return '已上传'
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
      if (file === undefined) {
        this.fileUploaderClient.clear()
        return
      }

      this.previewSrc = window.URL.createObjectURL(file)
      this.fileUpload.startSlice(
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
      // try {
      //   uploadFile(this.$refs.input.files[0])
      // } catch (error) {
      //   console.error(error.message)
      // }
      // this.$emit('update:modelValue', this.previewSrc)
    },
  },
  watch: {
    show() {
      if (this.$refs.input.files[0] === undefined) this.previewSrc = ''
    },
  },
  mounted() {
    document.addEventListener('click', e => {
      if (!isAinB(e.target, this.$refs.updateVideo)) this.show = false
    })
    // 该组件只会上传一个文件, 所以直接在这里初始化
    this.fileUpload = new FileUploaderClient()
  },
}
</script>

<style lang="scss">
.update-video {
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
      > video {
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
        // z-index: 10;
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
      }
      .status {
        width: 200px;
        display: flex;
        align-items: center;

        .status-value {
          width: 50px;
          margin: 0 10px;
        }
        .progress {
          flex: none;
          width: 100px;
          height: 10px;
          border-radius: 5px;
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

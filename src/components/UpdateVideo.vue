<template>
  <div ref="updateVideo" class="update-video" @click.stop>
    <div class="btn" @click="show = true">选择视频</div>
    <div v-show="show" ref="updateBox" class="update-box">
      <div class="area">
        <video v-show="previewSrc !== ''" :src="previewSrc" muted autoplay>错误</video>
        <span>
          点击上传视频
          <br />
          或者拖拽视频这里来
        </span>
        <input ref="input" @change="change" type="file" accept="video/*" placeholder="上传图片到这里来" />
      </div>
      <div class="config">
        <button class="btn-submit" @click="submit">点击上传</button>
        <div class="status">
          <p class="status-value" :style="{ color: submitProgress >= 100 ? 'skyblue' : '' }">{{ statusInfo }}</p>
          <div class="progress">
            <span class="thumb" :style="{ width: submitProgress + 'px', filter: `brightness(${1 + submitProgress * 0.002})` }"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { isAinB } from '@/utils'
import uploadFile from '@/request/fileUploaderClient'

export default {
  emits: ['update:modelValue'],
  props: ['modelValue'],
  data() {
    return {
      previewSrc: '',
      show: false,
      submitProgress: 0,
      parseProgress: 0,
      chunks: -1,
    }
  },
  computed: {
    statusInfo() {
      if (parseProgress === 0) return '未上传'
      if (parseProgress < 100) return '解析中'
      if (parseProgress === 100) return '上传中'
      if (submitProgress === 100) return '已上传'
    },
  },
  methods: {
    uploadVideo() {
      uploadFile(files[0], {
        sumSliceSumCallback: chunks => {
          this.chunks = chunks
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
    },
    change() {
      this.previewSrc = window.URL.createObjectURL(this.$refs.input.files[0])
    },
    async submit() {
      if (this.submitProgress > 0) {
        console.log('debugger: ', '正在上传...')
        return
      }

      uploadVideo()
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
      span {
        text-align: center;
        font-size: 20px;
        color: #999;
      }
      input[type='file'] {
        width: 100%;
        height: 100%;
        opacity: 0;
        cursor: pointer;
        position: absolute;
        z-index: 2;
      }

      video {
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: 0;
        top: 0;
        left: 0;
        object-fit: cover;
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

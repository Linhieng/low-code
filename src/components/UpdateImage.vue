<template>
  <div class="update-image" @click.stop>
    <div class="btn" @click="show = true">选择图片</div>
    <div v-show="show" ref="updateBox" class="update-box">
      <div class="area">
        <img v-show="previewSrc !== ''" :src="previewSrc" alt="图片预览" />
        <span>
          点击选择图片
          <br />
          或者拖拽图片这里来
        </span>
        <input ref="input" @change="change" type="file" accept="image/*" placeholder="上传图片到这里来" />
      </div>
      <div class="config">
        <button class="btn-submit" @click="submit">点击上传</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  emits: ['update:modelValue'],
  props: ['modelValue'],
  data() {
    return {
      previewSrc: '',
      show: false,
    }
  },
  methods: {
    change() {
      this.previewSrc = window.URL.createObjectURL(this.$refs.input.files[0])
    },
    submit() {
      console.log('debugger: ', this.previewSrc)
      // TODO: 上传服务器并获取图片链接(此链接应为上传到服务器的缓存区)
      this.$emit('update:modelValue', this.previewSrc)
    },
  },
  watch: {
    show() {
      if (this.$refs.input.files[0] === undefined) this.previewSrc = ''
    },
  },
}
</script>

<style lang="scss">
.update-image {
  width: 150px;
  height: 40px;
  position: absolute;
  z-index: 1;

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

      img {
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
      button {
        width: 100px;
        height: 34px;
      }
    }
  }
}
</style>

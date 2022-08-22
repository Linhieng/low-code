<template>
  <div id="top">
    <div class="switch-item" @click="drawConfig.toggleAutoHeight">
      <input type="checkbox" id="autoHeight" :checked="drawConfig.autoHeight" />
      <div class="switch-btn"><span class="thumb"></span></div>
      <label>开启高度自适应</label>
    </div>
    <button class="btn-item btn-submit" @click="drawConfig.togglePreview">
      {{drawConfig.isPreview? '取消预览' : '预览'}}
    </button>
    <button class="btn-item btn-submit" @click="publish">发布</button>
  </div>
</template>

<script>
import { useDrawConfig, useDrawData } from '@/stores/index'

export default {
  data() {
    return {
      drawConfig: useDrawConfig(),
      drawData: useDrawData(),
    }
  },
  methods: {
    async publish() {
      try {
        const data = await this.drawData.publish()
        const url = `${window.location.origin}/page/${data.id}`
        window.open(url)
      } catch (error) {
        // NOTE: 这里的 error 只有文本
        this.$msg(error, 'error')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.switch-item {
  height: 50px;
  padding: 0 10px;

  display: var(--switch-display);
  align-items: center;

  border-radius: 4px;
  box-shadow: 0 0 4px 0px #ddd;

  overflow: hidden;
  cursor: pointer;

  input {
    width: 20px;
    height: 20px;
    cursor: inherit;
    opacity: 0;
  }
  label {
    margin-left: 6px;
    font-size: 20px;
    cursor: inherit;
  }
  .switch-btn {
    width: 40px;
    height: 20px;
    padding: 1px;
    background-color: #FFF;
    border-radius: 20px;
    box-shadow: 0 0 10px 0 #d1d1d1;
    position: relative;
    .thumb {
      display: block;
      width: 18px;
      height: 18px;
      border-radius: 100%;
      background-color: #d4d4d4;
      position:absolute;
      top: 2px;
      left: 3px;
      transition: .2s;
    }
  }
  input:checked + .switch-btn{
    background-color: skyblue;
      .thumb {
        left: 20px;
        background-color: #FFF;
      }
  }
}
.btn-item {
  width: 100px;
  height: 34px;
  font-size: 18px;
  color: #FFF;
}
</style>

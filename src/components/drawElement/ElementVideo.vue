<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">
    <!-- 这里不自动播放 -->
    <video :poster="configTemp.poster" :src="configTemp.videoSrc" muted>错误</video>
    <!-- <video :poster="configTemp.poster">
      <source :src="configTemp.videoSrc" />
      无法播放视频，请手动点击
      <a :href="configTemp.videoSrc">此链接</a>
      进行观看
    </video> -->
  </div>
  <div v-else @click="modify" class="ele-item" :style="style">
    <video :poster="config.poster" :src="config.videoSrc" muted autoplay>错误</video>
    <!-- <video :poster="config.poster">
      <source :src="config.videoSrc" />
      无法播放视频，请手动点击
      <a :href="config.videoSrc">此链接</a>
      进行观看
    </video> -->
  </div>
</template>

<script>
import { useDrawData, useConfigOptionsTemp } from '@/stores/index'

export default {
  props: {
    id: Number,
  },
  data() {
    return {
      drawData: useDrawData(),
      configOptions: useConfigOptionsTemp(),
    }
  },
  computed: {
    style() {
      return JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].style))
    },
    styleTemp() {
      return JSON.parse(JSON.stringify(this.configOptions.style))
    },
    config() {
      console.log('debugger: ', JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].config)))
      return JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].config))
    },
    configTemp() {
      return JSON.parse(JSON.stringify(this.configOptions.config))
    },
  },
  methods: {
    modify() {
      this.configOptions.open(this.id)
    },
  },
}
</script>

<style lang="scss">
video {
  width: 100%;
  height: 100%;
}
</style>

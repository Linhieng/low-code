<template>
  <div :style="style" class="ele-item" :class="{'ele-active': cacheConfig.id === id}">
    <video :poster="config.poster" :src="config.videoSrc" muted autoplay>
      <source :src="config.videoSrc" />
      无法播放视频，请手动点击 <a :href="config.videoSrc">此链接</a> 进行观看
    </video>
  </div>
</template>

<script>
import { useDrawData, useDataCacheConfig } from '@/stores/index'

export default {
  props: {
    id: Number,
  },
  data() {
    return {
      drawData: useDrawData(),
      cacheConfig: useDataCacheConfig(),
    }
  },
  computed: {
    style() {
      if (this.cacheConfig.id === this.id)  return JSON.parse(JSON.stringify(this.cacheConfig.style))
      else return JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].style))
    },
    config() {
      if (this.cacheConfig.id === this.id) return JSON.parse(JSON.stringify(this.cacheConfig.config))
      return JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].config))
    },
  },
}
</script>

<style lang="scss" scoped>
video {
  width: 100%;
  height: 100%;
}
</style>

<template>
  <div :style="style" class="ele-item" :class="{'ele-active': cacheConfig.id === id}">
    <img draggable="false" :src="config.src" :alt="config.alt" :style="{ objectFit: style.objectFit, objectPosition: style.objectPosition }" />
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
img {
  width: 100%;
  height: 100%;
}
</style>

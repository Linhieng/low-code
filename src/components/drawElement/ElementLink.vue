<template>
  <div :style="style" class="ele-item" :class="{'ele-active': cacheConfig.id === id}">
    <a draggable="false" @click="e => e.preventDefault()" :href="config.href">{{ config.innerText }}</a>
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
a {
  font-size:inherit;
  text-align:inherit;
  color:inherit;
  line-height:inherit;
  background-color:inherit;
  text-decoration:inherit;
  user-select: none;
}
</style>
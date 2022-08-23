<template>
  <div :style="style" class="ele-item" :class="{'ele-active': cacheConfig.id === id}">{{ config.innerText }}</div>
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
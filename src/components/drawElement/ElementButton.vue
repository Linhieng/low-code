<template>
<div class="ele-item" :class="{'ele-active': cacheConfig.id === id}" :style="style">
  <button :title="config.title">{{ config.innerText }}</button>
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
button {
  width: 100%;
  height: 100%;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  cursor: pointer;
}
</style>

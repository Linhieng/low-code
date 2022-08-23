<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">
    <a draggable="false" @click="e => e.preventDefault()" :href="configTemp.href">{{ configTemp.innerText }}</a>
  </div>
  <div v-else @click="modify" class="ele-item" :style="style">
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
      configOptions: useDataCacheConfig(),
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
      return JSON.parse(JSON.stringify(this.drawData.elementConfig[this.id].config))
    },
    configTemp() {
      return JSON.parse(JSON.stringify(this.configOptions.config))
    },
  },
  methods: {
    modify() {
      // this.configOptions.open(this.id)
    },
  },
}
</script>

<style scoped>

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
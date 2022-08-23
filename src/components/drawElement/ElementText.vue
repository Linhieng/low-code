<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">{{ configTemp.innerText }}</div>
  <div v-else @click="modify" class="ele-item" :style="style">{{ config.innerText }}</div>
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

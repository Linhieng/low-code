<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">图片</div>
  <div v-else @click="modify" class="ele-item" :style="style">图片</div>
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

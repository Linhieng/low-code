<template>
  <div @click="modify" :class="configOptions.id === id ? 'ele-active' : ''" class="ele-item ele-video" :style="style">按钮组件{{ id }}</div>
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
  },
  methods: {
    modify() {
      this.configOptions.open(this.id)
    },
  },
}
</script>

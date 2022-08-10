<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">
    <button :title="configTemp.title">{{ configTemp.innerText }}</button>
  </div>
  <div v-else @click="modify" class="ele-item" :style="style">
    <button :title="config.title">{{ config.innerText }}</button>
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

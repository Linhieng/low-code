<template>
  <div v-if="configOptions.id === id" @click="modify" class="ele-item ele-active" :style="styleTemp">
    <img draggable="false" :src="configTemp.src" :alt="configTemp.alt" :style="{ objectFit: styleTemp.objectFit, objectPosition: styleTemp.objectPosition }" />
  </div>
  <div v-else @click="modify" class="ele-item" :style="style">
    <img draggable="false" :src="config.src" :alt="config.alt" :style="{ objectFit: style.objectFit, objectPosition: style.objectPosition }" />
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
      // this.configOptions.open(this.id)
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

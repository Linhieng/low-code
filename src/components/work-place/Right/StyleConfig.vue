<template>
  <div class="modify-style">
    <div v-if="styleList.width" class="modify-item">
      <p class="property">width: {{ styleList.width }}</p>
      <input @input="modifyNumber('width', $event.currentTarget.value)" class="value" type="range" :value="Number.parseFloat(styleList.width)" :min="styleLimit.width.min" :max="styleLimit.width.max" />
    </div>
    <div v-if="styleList.height" class="modify-item">
      <p class="property">height: {{ styleList.height }}</p>
      <input @input="modifyNumber('height', $event.currentTarget.value)" class="value" type="range" :value="Number.parseFloat(styleList.height)" :min="styleLimit.height.min" :max="styleLimit.height.max" />
    </div>
    <div v-if="styleList.top" class="modify-item">
      <p class="property">top: {{ styleList.top }}</p>
      <input @input="modifyNumber('top', $event.currentTarget.value)" class="value" type="range" :value="Number.parseFloat(styleList.top)" :min="styleLimit.top.min" :max="styleLimit.top.max" />
    </div>
    <div v-if="styleList.left" class="modify-item">
      <p class="property">left: {{ styleList.left }}</p>
      <input @input="modifyNumber('left', $event.currentTarget.value)" class="value" type="range" :value="Number.parseFloat(styleList.left)" :min="styleLimit.left.min" :max="styleLimit.left.max" />
    </div>
  </div>
</template>

<script>
import { useConfigOptionsTemp } from '@/stores/index'

export default {
  data() {
    return {
      configOption: useConfigOptionsTemp(),
    }
  },
  computed: {
    styleList() {
      return this.configOption.style
    },
    styleLimit() {
      return this.configOption.styleLimit
    },
  },
  methods: {
    // 只需要修改数值部分的（使用进度条的）, 就代表该函数。
    modifyNumber(property, value) {
      this.configOption.modifyNumber(property, value)
      // console.log('debugger: ', property, value)
    },
  },
}
</script>

<style lang="scss">
.modify-item {
  width: 100%;
  margin-top: 20px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .property {
    margin-bottom: 6px;
  }
  .value {
    width: 100%;
  }
}
</style>

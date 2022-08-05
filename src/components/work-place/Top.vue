<template>
  <div id="top">
    <div class="item">
      <input @click="drawConfig.toggleAutoHeight" type="checkbox" id="autoHeight" :checked="drawConfig.autoHeight" />
      <label @click="drawConfig.toggleAutoHeight">开启高度自适应</label>
    </div>
  </div>
</template>

<script>
import { useDrawConfig } from '@/stores/index'

export default {
  data() {
    return {
      drawConfig: useDrawConfig(),
    }
  },
}
</script>

<style lang="scss" scoped>
.item {
  height: 50px;
  padding: 0 10px;
  margin-top: 10px;

  display: flex;
  align-items: center;

  border-radius: 4px;
  box-shadow: 0 0 4px 0px #ddd;
  cursor: pointer;

  input {
    width: 20px;
    height: 20px;
    cursor: inherit;
  }
  label {
    margin-left: 6px;
    font-size: 20px;
    cursor: inherit;
  }
}
</style>

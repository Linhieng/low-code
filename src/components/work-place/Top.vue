<template>
  <div id="top">
    <div>
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

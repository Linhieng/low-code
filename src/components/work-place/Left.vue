<template>
  <div id="left">
    <div class="btn-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" draggable="true" :data-type="elementType.value" @dragstart="dragstart($event, elementType.value)">{{ elementType.description }}</div>
  </div>
</template>

<script>
import { ELEMENT_TYPES } from '@/constants/index'
import { useDragTempStyleStore } from '@/stores/index'

export default {
  data() {
    return {
      dragStyle: useDragTempStyleStore(),
      ELEMENT_TYPES,
    }
  },
  methods: {
    dragstart(e, elementType) {
      console.log('debugger: 点击拖拽')
      this.dragStyle.dragStart(elementType, e.target, e.offsetX, e.offsetY)
    },
  },
}
</script>

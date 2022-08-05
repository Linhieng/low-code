<template>
  <div ref="left" id="left">
    <div class="btn-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" draggable="true" :data-type="elementType.value" @dragstart="dragstart($event, elementType.value)">{{ elementType.description }}</div>
  </div>
</template>

<script>
import { ELEMENT_TYPES } from '@/constants/index'
import { useDragTempStyleStore, useWorkPlaceRefs } from '@/stores/index'

export default {
  data() {
    return {
      dragStyle: useDragTempStyleStore(),
      workPlaceRefs: useWorkPlaceRefs(),
      ELEMENT_TYPES,
    }
  },
  methods: {
    dragstart(e, elementType) {
      console.log('debugger: 点击拖拽')
      this.dragStyle.dragStart(elementType, e.target, e.offsetX, e.offsetY)
    },
  },
  mounted() {
    this.workPlaceRefs.addLeft(this.$refs.left)
  },
}
</script>

<style lang="scss">
.btn-item {
  // 宽高在 id.scss 中配置
  margin: 20px auto;
  display: flex;
  justify-content: center;
  align-items: center;

  border: 1px solid #ccc;
  border-radius: 4px;
  color: #666;
  font-size: 14px;
  text-align: center;

  cursor: grab;
  &:active {
    cursor: grabbing;
  }
}
</style>

<template>
  <div ref="left" id="left" :class="open ? '' : 'close'">
    <h2>组件添加栏</h2>
    <div class="btn_toggle">
      <button class="open" @click="open = true">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-arrow_left_line"><path d="M15.994 21a1 1 0 01-.708-.293L7.292 12.7a.999.999 0 01.001-1.413l7.994-7.994a.999.999 0 111.414 1.414l-7.287 7.287 7.288 7.299A1.001 1.001 0 0115.994 21" fill-rule="evenodd"></path></svg>
      </button>
      <button class="close" @click="open = false">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-arrow_left_line"><path d="M15.994 21a1 1 0 01-.708-.293L7.292 12.7a.999.999 0 01.001-1.413l7.994-7.994a.999.999 0 111.414 1.414l-7.287 7.287 7.288 7.299A1.001 1.001 0 0115.994 21" fill-rule="evenodd"></path></svg>
      </button>
    </div>
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
      open: true,
    }
  },
  methods: {
    dragstart(e, elementType) {
      console.log('hook: 点击拖拽')
      this.dragStyle.dragStart(elementType, e.target, e.offsetX, e.offsetY)
    },
  },
  mounted() {
    this.workPlaceRefs.addLeft(this.$refs.left)
  },
}
</script>

<style lang="scss">
#left.close {
  transform: translateX(-100%);
  .btn_toggle button.open {
    right: -14px;
    transform: rotate(180deg);
  }
}
h2 {
  margin-left: 20px;
}
.btn_toggle {
  button {
    box-shadow: 0 0 4px 0 #ddd;
    cursor: pointer;
    width: 16px;
    position: absolute;
    top: 19px;
    right: -4px;
    line-height: 40px;
    border-radius: 0 4px 4px 0;
    background: #fff;
    svg {
      width: 16px;
      height: 16px;
      vertical-align: middle;
      margin-top: -3px;
      fill: #999999;
    }
    &:hover svg {
      fill: #0f6bff;
    }
  }
}

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

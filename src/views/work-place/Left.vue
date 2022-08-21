<template>
  <div ref="left" id="left" :class="open ? '' : 'close'">
    <h2 @mousedown="isDownLeft = true" >组件添加栏</h2>
    <div class="btn_toggle"  @click="open = !open">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-arrow_left_line"><path d="M15.994 21a1 1 0 01-.708-.293L7.292 12.7a.999.999 0 01.001-1.413l7.994-7.994a.999.999 0 111.414 1.414l-7.287 7.287 7.288 7.299A1.001 1.001 0 0115.994 21" fill-rule="evenodd"></path></svg>
    </div>
    <div class="btn-wrapper">
      <div class="btn-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" draggable="true" :data-type="elementType.value" @dragstart="dragstart($event, elementType.value)">{{ elementType.description }}</div>
    </div>
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
      isDownLeft: false,
      leftX: 0,
      leftY: 0,
    }
  },
  methods: {
    dragstart(e, elementType) {
      console.log('hook: 点击拖拽')
      this.dragStyle.dragStart(elementType, e)
    },
  },
  mounted() {
    this.workPlaceRefs.addLeft(this.$refs.left)

    document.addEventListener('mousemove', e => {
      if (this.isDownLeft) {
        this.leftX += e.movementX / window.devicePixelRatio
        this.leftY += e.movementY / window.devicePixelRatio
        this.$refs.left.style.transform = `translate(${this.leftX}px, ${this.leftY}px)`
      } else if (this.dragStyle.dragging) {
        const div = this.workPlaceRefs.draggingDiv
        div.style.top = e.pageY + 'px'
        div.style.left = e.pageX + 'px'
      }
    })

    document.addEventListener('mouseup', () => {
      this.isDownLeft = false
      if (this.dragStyle.dragging) {
        this.dragStyle.drop()
      }
    })
  },
}
</script>

<style lang="scss" scoped>

#left.close .btn_toggle svg {
  transform: rotate(-90deg);
}
#left.close .btn-wrapper{
  height: 0;
}

.btn_toggle {
  position: absolute;
  top: 12px;
  right: 8px;

  width: 30px;
  height: 20px;
  display: grid;
  place-content: center;

  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-top: -3px;
    fill: #999999;
    transform: rotate(90deg);
  }
  &:hover svg {
    fill: #0f6bff;
  }
}
h2 {
  user-select: none;
  margin-left: 12px;
  &:active {
    cursor: move;
  }
}
.btn-wrapper {
  height: 500px;
  overflow: hidden;
  transition: .3s;

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
}

</style>

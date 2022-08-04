<template>
  <div id="left">
    <div class="btn-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" draggable="true" :data-type="elementType.value" @dragstart="dragstart($event, elementType.value)">{{ elementType.description }}</div>
  </div>
  <div id="draw" ref="drawWrapper" @drop="drop($event)" @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave">
    <div ref="shadowComponent" id="shadow-component"></div>
  </div>
</template>

<script>
import { ELEMENT_TYPES } from '@/constants/index'
import { useDragTempStyleStore, useDrawData } from '@/stores/index'

export default {
  data() {
    return {
      dragStyle: useDragTempStyleStore(),
      drawData: useDrawData(),
      ELEMENT_TYPES,
    }
  },

  methods: {
    getTop(pageY) {
      let Y = pageY - this.dragStyle.topTmp
      if (Y < 0) Y = 0
      return Y + 'px'
    },
    getLeft(pageX) {
      let X = pageX - this.dragStyle.leftTmp
      if (X < 0) X = 0
      if (X >= this.dragStyle.limitLeft) X = this.dragStyle.limitLeft
      return X + 'px'
    },
    dragstart(e, elementType) {
      console.log('debugger: 点击拖拽')
      this.dragStyle.dragStart(elementType, e.target, this.$refs.drawWrapper, e.offsetX, e.offsetY)
    },
    drop(e) {
      console.log('debugger: 放下')
      this.$refs.shadowComponent.removeAttribute('style')

      const type = this.dragStyle.type
      const width = this.dragStyle.width
      const height = this.dragStyle.height
      const top = this.getTop(e.pageY)
      const left = this.getLeft(e.pageX)

      const div = document.createElement('div')
      div.classList.add('component-item')
      div.style.width = width
      div.style.height = height
      div.style.top = top
      div.style.left = left
      this.$refs.drawWrapper.appendChild(div)

      this.drawData.add(type, width, height, top, left)
    },
    dragenter(e) {
      console.log('debugger: 进入')
      const shadowComponent = this.$refs.shadowComponent
      shadowComponent.style.opacity = 1
      shadowComponent.style.width = this.dragStyle.width
      shadowComponent.style.height = this.dragStyle.height
      shadowComponent.style.top = this.getTop(e.pageY)
      shadowComponent.style.left = this.getLeft(e.pageX)
    },
    dragover(e) {
      e.preventDefault()
      this.$refs.shadowComponent.style.top = this.getTop(e.pageY)
      this.$refs.shadowComponent.style.left = this.getLeft(e.pageX)
    },
    dragleave() {
      console.log('debugger: 离开')
      this.$refs.shadowComponent.removeAttribute('style')
    },
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
.component-item {
  // 宽高在 id.scss 中配置
  position: absolute;
  box-shadow: 0 0 10px 0px #ddd;
}
</style>

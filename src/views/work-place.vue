<template>
  <div id="left">
    <div class="component-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" draggable="true" @dragstart="dragstart($event, elementType.value)">{{ elementType.description }}</div>
    <!-- <div id="text" draggable="true" @dragstart="dragstart">文本组件</div> -->
  </div>
  <div id="draw" ref="drawWrapper" @drop="drop" @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave">
    <div ref="shadowComponent" id="shadow-component"></div>
  </div>
</template>

<script>
import { ELEMENT_TYPES } from '@/constants/index'
import { useDragTempStyleStore } from '@/stores/index'

export default {
  data() {
    const dragStyle = useDragTempStyleStore()
    return {
      dragStyle,
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
      console.log('debugger: 点击拖拽', e.offsetX, e.offsetY)
      this.dragStyle.dragStart(elementType, e.target, this.$refs.drawWrapper, e.offsetX, e.offsetY)
    },
    drop(e) {
      console.log('debugger: 放下')
      this.$refs.shadowComponent.removeAttribute('style')

      // const div = document.createElement('div')
      // div.classList.add('text')
      // div.style.top = e.clientY - 70 + 'px'
      // div.style.left = e.clientX - 300 + 'px'
      // this.$refs.drawWrapper.appendChild(div)
    },
    dragenter(e) {
      console.log('debugger: 进入')
      this.$refs.shadowComponent.style.opacity = 1
      this.$refs.shadowComponent.style.width = this.dragStyle.width
      this.$refs.shadowComponent.style.height = this.dragStyle.height
      this.$refs.shadowComponent.style.top = this.getTop(e.pageY)
      this.$refs.shadowComponent.style.left = this.getLeft(e.pageX)
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

<style lang="scss" scoped>

.component-item {
  // 宽高在 id.scss 中配置
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 20px auto;

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

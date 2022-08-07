<template>
  <div id="draw" ref="drawWrapper" @drop="drop($event)" @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave">
    <div ref="shadowComponent" id="shadow-component"></div>
    <!-- TODO: 这两个可用作提示, 先简单处理 -->
    <div id="upBox"></div>
    <div id="downBox"></div>
    <!-- NOTE: id 是数字类型, 如果后面改了, 记得修改子组件中 props 中的验证 -->
    <component v-for="ele in drawData.elementArr" :id="ele.id" :key="ele.id" :is="ele.type"></component>
  </div>
</template>

<script>
import { useDragTempStyleStore, useDrawData, useWorkPlaceRefs, useDrawConfig } from '@/stores/index'

import ElementText from '@/components/drawElement/ElementText.vue'
import ElementButton from '@/components/drawElement/ElementButton.vue'
import ElementImage from '@/components/drawElement/ElementImage.vue'
import ElementLink from '@/components/drawElement/ElementLink.vue'
import ElementVideo from '@/components/drawElement/ElementVideo.vue'

export default {
  components: { ElementText, ElementButton, ElementImage, ElementLink, ElementVideo },
  data() {
    return {
      dragStyle: useDragTempStyleStore(),
      drawData: useDrawData(),
      drawConfig: useDrawConfig(),
      workPlaceRefs: useWorkPlaceRefs(),
      scrollTime: null,
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
    checkDrawTop(pageY) {
      if (!this.drawConfig.autoHeight) return

      // NOTE: 此处 shadowTop 就算为负数也不影响
      const shadowTop = pageY - this.dragStyle.topTmp
      const shadowHeight = Number.parseFloat(this.dragStyle.height)
      const drawTop = Number.parseFloat(this.dragStyle.drawTop)
      const drawHeight = this.dragStyle.drawHeight
      //影子离画布底部的距离
      const drawBottom = drawHeight - shadowTop - shadowHeight
      const pageTop = shadowTop - window.scrollY
      //影子离页面底部的距离
      const pageBottom = window.innerHeight - drawTop - pageTop - shadowHeight

      if (pageBottom <= 100) {
        if (drawBottom <= 100) {
          this.$refs.drawWrapper.style.height = drawHeight + 100 + 'px'
          this.dragStyle.updateDrawHeight(drawHeight + 100)
        }
        window.scrollTo(0, window.scrollY + 10)
      } else if (pageTop <= 100) {
        window.scrollTo(0, window.scrollY - 10)
      }
    },
    dragenter(e) {
      console.log('hook: 进入')
      const shadowComponent = this.$refs.shadowComponent
      shadowComponent.style.opacity = 1
      shadowComponent.style.zIndex = 99
      shadowComponent.style.width = this.dragStyle.width
      shadowComponent.style.height = this.dragStyle.height
      shadowComponent.style.top = this.getTop(e.pageY)
      shadowComponent.style.left = this.getLeft(e.pageX)
    },
    dragover(e) {
      e.preventDefault()
      this.$refs.shadowComponent.style.top = this.getTop(e.pageY)
      this.$refs.shadowComponent.style.left = this.getLeft(e.pageX)
      this.checkDrawTop(e.pageY)
    },
    dragleave(e) {
      console.log('hook: 离开', e.target.id)
      // NOTE: 该判断条件用于判断鼠标是否离开画布区域。此处不保证无 bug
      if (e.target.id === 'shadow-component') this.$refs.shadowComponent.removeAttribute('style')
    },
    drop(e) {
      console.log('hook: 放下')
      this.$refs.shadowComponent.removeAttribute('style')
      // const type = this.dragStyle.type
      // const width = this.dragStyle.width
      // const height = this.dragStyle.height
      // const top = this.getTop(e.pageY)
      // const left = this.getLeft(e.pageX)
      // const div = document.createElement('div')
      // div.classList.add('component-item')
      // div.style.width = width
      // div.style.height = height
      // div.style.top = top
      // div.style.left = left
      // this.$refs.drawWrapper.appendChild(div)
      // this.drawData.add(type, width, height, top, left, div)
      this.drawData.add(this.dragStyle.type, this.getTop(e.pageY), this.getLeft(e.pageX))
    },
  },
  mounted() {
    this.workPlaceRefs.addDrawWrapper(this.$refs.drawWrapper)
    this.workPlaceRefs.addShadowComponent(this.$refs.shadowComponent)
  },
}
</script>

<style lang="scss">
// 不要使用 scoped, 因为 .ele-item 用于子组件中

.ele-item {
  // 宽高在 id.scss 中配置
  position: absolute;
  box-shadow: 0 0 10px 0px #ddd;
  cursor: pointer;
}

// 选中某个元素（修改配置）
.ele-active {
  box-shadow: 0 0 10px 0px skyblue;
}
</style>

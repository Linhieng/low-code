<template>
  <!-- TODO: 高度自适应部分，有时候会卡顿, 可能是高度自适应的 “方法” 不对 -->
  <div id="draw" ref="drawWrapper" @drop="drop($event)" @dragover="dragover" @dragenter="dragenter" @dragleave="dragleave">
    <!-- NOTE: id 是数字类型, 如果后面改了, 记得修改子组件中 props 中的验证 -->
    <component v-for="ele in drawData.elementArr" :id="ele.id" :key="ele.id" :is="ele.type" @mousedown="mousedown($event, ele.id)" @dblclick="modifyConfig(ele.id)" ></component>
  </div>
</template>

<script>
import { useDragTempStyleStore, useDrawData, useWorkPlaceRefs, useDrawConfig, useConfigOptionsTemp } from '@/stores/index'

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
      configOptions: useConfigOptionsTemp(),

      scrollTime: null,

      isMouseDown: false,
      dragElement: null,
      dragId: -1,
      dragX: 0,
      dragY: 0,
    }
  },
  methods: {
    mousedown(e, id) {
      // TODO: if (正在编辑) return
      this.dragElement = e.currentTarget
      this.dragId = id
      this.isMouseDown = true
      // this.dragStyle.dragging = true
    },
    modifyConfig(id) {
      this.configOptions.open(id)
    },
    // getTop(pageY) {
    //   let Y = pageY - this.dragStyle.topTmp
    //   if (Y < 0) Y = 0
    //   return Y + 'px'
    // },
    // getLeft(pageX) {
    //   let X = pageX - this.dragStyle.leftTmp
    //   if (X < 0) X = 0
    //   if (X >= this.dragStyle.limitLeft) X = this.dragStyle.limitLeft
    //   return X + 'px'
    // },
    // checkDrawTop(pageY) {
    //   if (!this.drawConfig.autoHeight) return

    //   // NOTE: 此处 shadowTop 就算为负数也不影响
    //   const shadowTop = pageY - this.dragStyle.topTmp
    //   const shadowHeight = Number.parseFloat(this.dragStyle.height)
    //   const drawTop = Number.parseFloat(this.dragStyle.drawTop)
    //   const drawHeight = this.dragStyle.drawHeight
    //   //影子离画布底部的距离
    //   const drawBottom = drawHeight - shadowTop - shadowHeight
    //   const pageTop = shadowTop - window.scrollY
    //   //影子离页面底部的距离
    //   const pageBottom = window.innerHeight - drawTop - pageTop - shadowHeight

    //   if (pageBottom <= 200) {
    //     this.$refs.downBox.style.display = 'block'
    //     this.$refs.upBox.style.display = 'none'
    //   } else if (pageTop <= 200) {
    //     this.$refs.upBox.style.display = 'block'
    //     this.$refs.downBox.style.display = 'none'
    //   } else {
    //     this.$refs.upBox.style.display = 'none'
    //     this.$refs.downBox.style.display = 'none'
    //   }

    //   if (pageBottom <= 100) {
    //     if (drawBottom <= 100) {
    //       this.$refs.drawWrapper.style.height = drawHeight + 100 + 'px'
    //       this.dragStyle.updateDrawHeight(drawHeight + 100)
    //     }
    //     window.scrollTo(0, window.scrollY + 10)
    //   } else if (pageTop <= 100) {
    //     window.scrollTo(0, window.scrollY - 10)
    //   }
    // },
    // dragstart(e, id) {
    //   console.log('hook: 点击拖拽(画布组件)', id)
    //   // this.dragStyle.drawDragStart(id, e.offsetX, e.offsetY)
    // },
    // dragenter(e) {
    //   console.log('hook: 进入')
    //   if (this.dragStyle.id !== -1) return
    //   const shadowComponent = this.$refs.shadowComponent
    //   shadowComponent.style.opacity = 1
    //   shadowComponent.style.zIndex = 99
    //   shadowComponent.style.width = this.dragStyle.width
    //   shadowComponent.style.height = this.dragStyle.height
    //   shadowComponent.style.top = this.getTop(e.pageY)
    //   shadowComponent.style.left = this.getLeft(e.pageX)
    // },
    // dragover(e) {
    //   e.preventDefault()
    //   if (this.dragStyle.id === -1) {
    //     this.$refs.shadowComponent.style.top = this.getTop(e.pageY)
    //     this.$refs.shadowComponent.style.left = this.getLeft(e.pageX)
    //     this.checkDrawTop(e.pageY)
    //   } else {
    //     this.drawData.dragUpdate(this.dragStyle.id, this.getTop(e.pageY), this.getLeft(e.pageX))
    //     this.checkDrawTop(e.pageY)
    //   }
    // },
    // dragleave(e) {
    //   console.log('hook: 离开', e.target.id)
    //   // NOTE: 该判断条件用于判断鼠标是否离开画布区域。此处不保证无 bug
    //   if (e.target.id === 'shadow-component')  {
    //     this.$refs.upBox.style.display = 'none'
    //     this.$refs.downBox.style.display = 'none'
    //     this.$refs.shadowComponent.removeAttribute('style')
    //   }
    // },
    // drop(e) {
    //   console.log('hook: 放下')
    //   // this.$refs.shadowComponent.removeAttribute('style')
    //   // this.$refs.upBox.style.display = 'none'
    //   // this.$refs.downBox.style.display = 'none'
    //   // if (this.dragStyle.id === -1) {
    //   //   this.drawData.add(this.dragStyle.type, this.getTop(e.pageY), this.getLeft(e.pageX))
    //   // } else {
    //   //   this.drawData.dragUpdate(this.dragStyle.id, this.getTop(e.pageY), this.getLeft(e.pageX))
    //   // }
    // },
  },
  mounted() {
    this.workPlaceRefs.addDrawWrapper(this.$refs.drawWrapper)
    // this.workPlaceRefs.addShadowComponent(this.$refs.shadowComponent)

    document.addEventListener('mouseup', () => {
      if (this.isMouseDown) {
        const top = Number.parseFloat(this.dragElement.style.top) + this.dragY + 'px'
        const left = Number.parseFloat(this.dragElement.style.left) + this.dragX + 'px'
        this.drawData.dragUpdate(this.dragId,top,left)

        this.dragX = 0
        this.dragY = 0
        this.isMouseDown = false
        this.dragElement.style.transform = ''
      }
    })
    document.addEventListener('mousemove', (e) => {
      if (this.isMouseDown) {
        this.dragX += e.movementX / window.devicePixelRatio
        this.dragY += e.movementY / window.devicePixelRatio
        this.dragElement.style.transform = `translate(${this.dragX}px, ${this.dragY}px)`
      }
    })

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

<style lang="scss" scoped>
.tip-box {
  display: none;
  .svg {
    display: block;
    width: 200px;
    height: 100px;
    margin: auto;
    opacity: 0.1;

    svg {
      width: 100%;
      height: 100%;
      fill: #ddd;
    }
  }
}

#upBox .svg {
  margin-top: 10px;
  @include tip-up-up;
}

#downBox .svg {
  margin-top: -15px;
  @include tip-down-down;

  svg {
    transform: rotate(-180deg);
  }
}
</style>

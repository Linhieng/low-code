<template>
  <div id="draw" ref="drawWrapper">
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

      scrollTimer: null,
      scrollSpeed: 10,

      isMouseDown: false,
      dragElement: null,
      dragId: -1,
      dragX: 0,
      dragY: 0,
    }
  },
  methods: {
    mousedown(e, id) {
      if (this.configOptions.show) return
      if (this.drawConfig.isPreview) return
      this.dragElement = e.currentTarget
      this.dragId = id
      this.isMouseDown = true
      // this.dragStyle.dragging = true
    },
    modifyConfig(id) {
      this.configOptions.open(id)
    },
    clearScroll(){
      clearInterval(this.scrollTimer)
      this.scrollTimer = null
    },
    scroll() {
      if (this.scrollTimer) return
      this.scrollTimer = setInterval(() => {
        const main = this.workPlaceRefs.main
        const drawWrapper = this.$refs.drawWrapper
        // 通过 speed 的正负判断是上滑还是下滑
        if (this.speed < 0 && main.scrollTop + this.speed <= 0) {
          main.scrollBy(0, 0)
          this.clearScroll()
          return
        }
        if (this.speed > 0 && main.scrollHeight - main.scrollTop - this.speed - main.clientHeight < 100) {
          drawWrapper.style.height = Number.parseFloat(getComputedStyle(drawWrapper).height) + 100 + 'px'
        }
        main.scrollBy(0, this.speed)
        this.dragY += this.speed
        this.dragElement.style.transform = `translate(${this.dragX}px, ${this.dragY}px)`
      }, 10)
    },
    checkWheel(e) {
      if (e.y < 200) { // 上滑
        this.speed = -4
        this.scroll()
      } else if(window.innerHeight - e.y < 200) { // 下滑
        this.speed = 4
        this.scroll()
      } else {
        this.clearScroll()
      }
    },
  },
  mounted() {
    this.workPlaceRefs.addDrawWrapper(this.$refs.drawWrapper)

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
        if (this.drawConfig.autoHeight) this.checkWheel(e)
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

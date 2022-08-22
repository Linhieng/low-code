<template>
  <div id="draw" ref="drawWrapper">
    <component v-for="ele in drawData.elementArr" :id="ele.id" :key="ele.id" :is="ele.type" @mousedown="mousedown($event, ele.id)" @dblclick="modifyConfig(ele.id)" ></component>
  </div>
</template>

<script>
import { useDragDataCache, useDrawData, useWorkPlaceRefs, useDrawConfig, useConfigOptionsTemp } from '@/stores/index'
import ElementText from '@/components/drawElement/ElementText.vue'
import ElementButton from '@/components/drawElement/ElementButton.vue'
import ElementImage from '@/components/drawElement/ElementImage.vue'
import ElementLink from '@/components/drawElement/ElementLink.vue'
import ElementVideo from '@/components/drawElement/ElementVideo.vue'

export default {
  components: { ElementText, ElementButton, ElementImage, ElementLink, ElementVideo },
  data() {
    return {
      drawData: useDrawData(),
      drawConfig: useDrawConfig(),
      workPlaceRefs: useWorkPlaceRefs(),
      configOptions: useConfigOptionsTemp(),
      dragDataCache: useDragDataCache(),
    }
  },
  methods: {
    modifyConfig(id) {
      this.configOptions.open(id)
    },
    mousedown(e, id) {
      if (this.configOptions.show) return
      if (this.drawConfig.isPreview) return
      this.dragDataCache.pointerdownDraw(e.currentTarget, id)
    },
  },
  mounted() {
    this.workPlaceRefs.addDrawWrapper(this.$refs.drawWrapper)
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

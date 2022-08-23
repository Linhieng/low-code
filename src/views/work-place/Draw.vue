<template>
  <div id="draw" ref="drawWrapper">
    <!-- :id  是 prop，不是样式 id 名 -->
    <component v-for="ele in drawData.elementArr" :key="ele.id" :is="ele.type" :id="ele.id" @mousedown="mousedown($event, ele.id)" @dblclick="modifyConfig(ele.id)" ></component>
  </div>
</template>

<script>
import { useDataCacheDragging, useDrawData, useWorkPlaceRefs, useDrawConfig, useDataCacheConfig } from '@/stores/index'
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
      configOptions: useDataCacheConfig(),
      cacheDragging: useDataCacheDragging(),
    }
  },
  methods: {
    modifyConfig(id) {
      this.configOptions.open(id)
    },
    mousedown(e, id) {
      if (this.configOptions.show) return
      if (this.drawConfig.isPreview) return
      this.cacheDragging.pointerdownDraw(e.currentTarget, id)
    },
  },
  mounted() {
    this.workPlaceRefs.addDrawWrapper(this.$refs.drawWrapper)
  },
}
</script>

<style lang="scss">
// 不要使用 scoped, 因为 .ele-item 和 .ele-active 用于子组件中

.ele-item {
  position: absolute;
  box-shadow: 0 0 10px 0px #ddd;
  cursor: pointer;
}

// 选中某个元素（修改配置）
.ele-active {
  box-shadow: 0 0 10px 0px skyblue;
}
</style>

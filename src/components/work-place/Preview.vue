<template>
  <div id="preview">
    <button @click="show" class="dialog-btn">预览</button>
    <Dialog :title="'Preview'" v-if="visible" :change="change">
      <component v-for="ele in drawData.elementArr" :id="ele.id" :key="ele.id" :is="ele.type"></component>
    </Dialog>
  </div>
</template>

<script>
import { useDrawData } from '@/stores/index'
import ElementText from '@/components/drawElement/ElementText.vue'
import ElementButton from '@/components/drawElement/ElementButton.vue'
import ElementImage from '@/components/drawElement/ElementImage.vue'
import ElementLink from '@/components/drawElement/ElementLink.vue'
import ElementVideo from '@/components/drawElement/ElementVideo.vue'
import Dialog from '../Dialog/Dialog.vue'

export default {
  components: { ElementText, ElementButton, ElementImage, ElementLink, ElementVideo, Dialog },
  data() {
    return {
      drawData: useDrawData(),
      scrollTime: null,
      visible: false
    }
  },
  methods: {
    change(e) {
      this.visible = e
    },
    show() {
      this.visible = true
    }
  }
}
</script>

<style lang="scss" scoped>
#preview {
  .ele-item {
    position: absolute;
    box-shadow: none;
    cursor: pointer;
  }

  .ele-active {
    box-shadow: 0 0 10px 0px skyblue;
  }
  .dialog-btn {
    position: absolute;
    top: 40px;
    left: 500px;
    z-index: 99999;
  }
}
</style>
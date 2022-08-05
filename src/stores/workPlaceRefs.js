// 存储创建的组件内容
import { defineStore } from 'pinia'

export default defineStore('workPlaceRefs', {
  state: () => ({
    left: null,
    right: null,
    drawWrapper: null,
    shadowComponent: null,
  }),
  actions: {
    addDrawWrapper(ref) {
      this.drawWrapper = ref
    },
    addShadowComponent(ref) {
      this.shadowComponent = ref
    },
    addLeft(ref) {
      this.left = ref
    },
    addRight(ref) {
      this.right = ref
    },
  },
})

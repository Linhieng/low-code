// 存储创建的组件内容
import { defineStore } from 'pinia'

export default defineStore('workPlaceRefs', {
  state: () => ({
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
  },
})

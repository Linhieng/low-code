// 存储创建的组件内容
import { defineStore } from 'pinia'

export default defineStore('drawConfig', {
  state: () => ({
    autoHeight: true,
    isPreview: false,
  }),
  actions: {
    toggleAutoHeight() {
      this.autoHeight = !this.autoHeight
    },
    togglePreview() {
      this.isPreview = !this.isPreview
    }
  },
})

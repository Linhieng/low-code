// 存储创建的组件内容
import { defineStore } from 'pinia'

export default defineStore('drawData', {
  state: () => ({
    data: [],
  }),
  actions: {
    add(type, width, height, top, left, elementRef) {
      const id = this.data.length
      this.data.push({ id, type, width, height, top, left, elementRef })
    },
  },
})

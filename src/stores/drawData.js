// 存储创建的组件内容
import { defineStore } from 'pinia'
export default defineStore('drawData', {
  state: () => ({
    data: [],
  }),
  actions: {
    add(type, width, height, top, left) {
      this.data.push({
        id: this.data.length,
        type,
        width,
        height,
        top,
        left,
      })
    },
  },
})

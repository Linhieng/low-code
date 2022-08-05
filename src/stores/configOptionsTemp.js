import { defineStore } from 'pinia'

// 存储当前正在修改配置的可配置项
export default defineStore('configOptionsTemp', {
  // 这些值都会带上单位
  state: () => ({
    show: false,
    id: -1,
    config: {}, // 可配置项
  }),
  actions: {
    open(id) {
      this.show = true
      this.id = id
      // TODO:
    },
    close() {
      this.show = false
      this.id = -1
    },
  },
})

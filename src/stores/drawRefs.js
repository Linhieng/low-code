// 存储创建的组件内容
import { defineStore } from 'pinia'
export default defineStore('drawRefs', {
  state: () => ({
    refs: [],
  }),
  actions: {
    add(id, element) {
      this.refs.push({ id, element })
    },
  },
})

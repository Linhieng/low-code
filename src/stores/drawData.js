// 存储创建的组件内容
import { defineStore } from 'pinia'
import { useDrawRefs } from '@/stores/index'

export default defineStore('drawData', {
  state: () => ({
    data: [],
  }),
  actions: {
    add(type, width, height, top, left, ref) {
      const id = this.data.length
      const drawRefs = useDrawRefs()
      this.data.push({ id, type, width, height, top, left })
      drawRefs.add(id, ref)
    },
  },
})

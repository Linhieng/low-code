// src/stores/totalNum.js
import { defineStore } from 'pinia'
import { useWorkPlaceRefs } from '@/stores/index'

// 页面滚动式，就会更新该值, 并同步更新两侧容器的高度，确保效果和 fix 一样
export default defineStore('appScrollTop', {
  state: () => ({ top: '0' }),
  actions: {
    update(top) {
      const refs = useWorkPlaceRefs()
      const t = top + 'px'
      this.top = t
      refs.left.style.top = t
      refs.right.style.top = t
    },
  },
})

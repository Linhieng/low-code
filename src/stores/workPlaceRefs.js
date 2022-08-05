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
      // 页面滚动时，就会更新容器的高度，确保效果和 fix 一样
      window.addEventListener('scroll', _ => {
        ref.style.top = window.scrollY + 'px'
      })
    },
    addRight(ref) {
      this.right = ref
      // 页面滚动时，就会更新容器的高度，确保效果和 fix 一样
      window.addEventListener('scroll', _ => {
        ref.style.top = window.scrollY + 'px'
      })
    },
  },
})

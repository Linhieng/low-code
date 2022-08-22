// 存储创建的组件内容
import { defineStore } from 'pinia'

export default defineStore('workPlaceRefs', {
  state: () => ({
    workPlace: null,
    header: null,
    main: null,
    left: null,
    right: null,
    drawWrapper: null,
    // shadowComponent: null,
    draggingDiv: null,
  }),
  actions: {
    addMain(ref) {
      this.main = ref
    },
    addHeader(ref) {
      this.header = ref
    },
    addWorkPlace(ref) {
      this.workPlace = ref
    },
    addDrawWrapper(ref) {
      this.drawWrapper = ref
    },
    // addShadowComponent(ref) {
    //   this.shadowComponent = ref
    // },
    addDraggingDiv(ele) {
      this.draggingDiv = ele
    },
    addLeft(ref) {
      this.left = ref
      // // 页面滚动时，就会更新容器的高度，确保效果和 fix 一样
      // window.addEventListener('scroll', _ => {
      //   ref.style.top = window.scrollY + 'px'
      // })
    },
    addRight(ref) {
      this.right = ref
      // // 页面滚动时，就会更新容器的高度，确保效果和 fix 一样
      // window.addEventListener('scroll', _ => {
      //   ref.style.top = window.scrollY + 'px'
      // })
    },
  },
})

// 新建组件，拖拽时的临时的数据会保存这里
import { defineStore } from 'pinia'
import { ELEMENT_LAYOUT } from '@/constants/index'
import { useWorkPlaceRefs } from '@/stores/index'

export default defineStore('dragTempStyle', {
  // 这些值都会带上单位
  state: () => ({
    // 当前拖拽元素类型
    type: '',
    // 影子的宽高
    width: '',
    height: '',
    // 画图的边距和宽度
    drawTop: '',
    drawLeft: '',
    drawWidth: '',
    // 鼠标距离 “组件按钮” 的边距
    offsetX: '',
    offsetY: '',
    // “组件按钮” 的宽高
    btnWidth: '',
    btnHeight: '',
    // pageX: '', // 这个值经常变化, 不存入 stores 中
    // pageY: '', // 这个值经常变化, 不存入 stores 中
    // top: '', // 这个值经常变化, 不存入 stores 中
    // left: '', // 这个值经常变化, 不存入 stores 中

    // 不带单位, 因为它不会单独使用, 而是会参与计算
    topTmp: 0,
    leftTmp: 0,
    limitLeft: 0,
  }),
  actions: {
    dragStart(elementType, componentElement, x, y) {
      const drawWrapper = useWorkPlaceRefs().drawWrapper

      this.type = elementType

      const { width, height } = ELEMENT_LAYOUT[elementType]
      this.width = width
      this.height = height

      const { top: drawTop, left: drawLeft, width: drawWidth } = window.getComputedStyle(drawWrapper)
      this.drawTop = drawTop
      this.drawLeft = drawLeft
      this.drawWidth = drawWidth

      const { width: btnWidth, height: btnHeight } = window.getComputedStyle(componentElement)
      this.btnWidth = btnWidth
      this.btnHeight = btnHeight

      this.offsetX = x + 'px'
      this.offsetY = y + 'px'

      this.topTmp = Number.parseFloat(drawTop) + y + (Number.parseFloat(height) - Number.parseFloat(btnHeight)) / 2
      this.leftTmp = Number.parseFloat(drawLeft) + x + (Number.parseFloat(width) - Number.parseFloat(btnWidth)) / 2
      this.limitLeft = Number.parseFloat(drawWidth) - Number.parseFloat(width)
    },
  },
})

// 新建组件，拖拽时的临时的数据会保存这里
import { defineStore } from 'pinia'
import { ELEMENT_LAYOUT } from '@/constants/index'
import { useWorkPlaceRefs, useDrawData } from '@/stores/index'

export default defineStore('dragTempStyle', {
  // 这些值都会带上单位
  state: () => ({
    // 如果拖拽的是画布内的元素, 则会有 id
    id: -1,
    // 当前拖拽元素类型
    type: '',
    // 影子的宽高
    width: '',
    height: '',
    // 画图的边距和宽度
    drawTop: '',
    drawLeft: '',
    drawWidth: '',
    drawHeight: 0, // 当高度不够时会自动增加, 该值不会直接使用, 所以不带单位
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
    drawDragStart(id, x, y) {
      const drawWrapper = useWorkPlaceRefs().drawWrapper
      const drawData = useDrawData()

      this.id = id
      this.width = drawData.elementConfig[id].style.width
      this.height = drawData.elementConfig[id].style.height

      const { top: drawTop, left: drawLeft, width: drawWidth, height: drawHeight } = window.getComputedStyle(drawWrapper)
      this.drawTop = drawTop
      this.drawLeft = drawLeft
      this.drawWidth = drawWidth
      this.drawHeight = Number.parseFloat(drawHeight)

      this.offsetX = x + 'px'
      this.offsetY = y + 'px'

      this.topTmp = Number.parseFloat(drawTop) + y
      this.leftTmp = Number.parseFloat(drawLeft) + x
      this.limitLeft = Number.parseFloat(drawWidth) - Number.parseFloat(this.width)
    },
    dragStart(elementType, componentElement, x, y) {
      const drawWrapper = useWorkPlaceRefs().drawWrapper

      this.id = -1
      this.type = elementType

      const { width, height } = ELEMENT_LAYOUT[elementType]
      this.width = width
      this.height = height

      const { top: drawTop, left: drawLeft, width: drawWidth, height: drawHeight } = window.getComputedStyle(drawWrapper)
      this.drawTop = drawTop
      this.drawLeft = drawLeft
      this.drawWidth = drawWidth
      this.drawHeight = Number.parseFloat(drawHeight)

      const { width: btnWidth, height: btnHeight } = window.getComputedStyle(componentElement)
      this.btnWidth = btnWidth
      this.btnHeight = btnHeight

      this.offsetX = x + 'px'
      this.offsetY = y + 'px'

      this.topTmp = Number.parseFloat(drawTop) + y + (Number.parseFloat(height) - Number.parseFloat(btnHeight)) / 2
      this.leftTmp = Number.parseFloat(drawLeft) + x + (Number.parseFloat(width) - Number.parseFloat(btnWidth)) / 2
      this.limitLeft = Number.parseFloat(drawWidth) - Number.parseFloat(width)
    },
    updateDrawHeight(height) {
      this.drawHeight = height
    },
  },
})

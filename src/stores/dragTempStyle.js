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

        dragging: false,
        dragDiv: null,
    }),
    actions: {
        dragStart(elementType, event) {
            this.dragging = true
            this.type = elementType

            const { width, height } = ELEMENT_LAYOUT[elementType]
            const drawWrapper = useWorkPlaceRefs()
            const div = document.createElement('div')

            drawWrapper.drawWrapper.appendChild(div)
            drawWrapper.addDraggingDiv(div)

            this.dragDiv = div

            div.classList.add('dragging-box')
            div.style.width = width
            div.style.height = height
            div.style.top = event.pageY + 'px'
            div.style.left = event.pageX + 'px'

        },

        drop() {
            this.dragging = false

            const { width, height } = ELEMENT_LAYOUT[this.type]
            const drawData = useDrawData()
            const drawStyle = useWorkPlaceRefs().drawWrapper.getBoundingClientRect()
            const div = this.dragDiv

            const top = Number.parseFloat(div.style.top)  - Number.parseFloat(height) / 2 - drawStyle.top + 'px'
            const left = Number.parseFloat(div.style.left)  - Number.parseFloat(width) / 2 - drawStyle.left + 'px'
            drawData.add(this.type, top, left)

            div.parentElement.removeChild(div)
        },
        updateDrawHeight(height) {
            this.drawHeight = height
        },
    },
})
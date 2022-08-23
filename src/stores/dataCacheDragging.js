// 拖拽时的临时的数据会保存这里
import { defineStore } from 'pinia'
import { ELEMENT_LAYOUT } from '@/constants/index'
import { useWorkPlaceRefs, useDrawData, useDrawConfig } from '@/stores/index'

export default defineStore('dragDataCache', {
    // 这些值都会带上单位
    state: () => ({
        down: false,
        // 当前是否在拖拽
        dragging: false,
        // 拖拽的元素。如果是新建组件，则会创建一个元素
        dragElement: null,

        // 拖拽画布的元素时才用到
        transitionX: 0,
        transitionY: 0,


        // 如果拖拽的是画布内的元素, 则会有 id
        id: -1,
        // 如果是新建组件，则会获取元素类型
        type: '',

        // 用于滚动条
        scrollTimer: null,
        scrollSpeed: 0,
    }),
    actions: {
        /* 使用 fixed 方案。注意只改变 scrollTop、增加画布的高度。不负责改变拖拽元素 */
        clearScroll() {
            clearInterval(this.scrollTimer)
            this.scrollTimer = null
        },
        scroll() {
            if (this.scrollTimer) return
            this.scrollTimer = setInterval(() => {
                const main = useWorkPlaceRefs().main
                const drawWrapper = useWorkPlaceRefs().drawWrapper
                const speed = this.scrollSpeed
                // 通过 speed 的正负判断是上滑还是下滑
                if (speed < 0 && main.scrollTop + speed <= 0) {
                    main.scrollBy(0, 0)
                    this.clearScroll()
                    return
                }
                if (speed > 0 && main.scrollHeight - main.scrollTop - speed - main.clientHeight < 100) {
                    drawWrapper.style.height = Number.parseFloat(getComputedStyle(drawWrapper).height) + 100 + 'px'
                }
                main.scrollBy(0, speed)
                // this.dragY += speed
                // this.dragElement.style.transform = `translate(${this.dragX}px, ${this.dragY}px)`
            }, 10)
        },
        checkWheel(e) {
            if (e.y < 200) { // 上滑
                this.scrollSpeed = -4
                this.scroll()
            } else if (window.innerHeight - e.y < 200) { // 下滑
                this.scrollSpeed = 4
                this.scroll()
            } else {
                this.scrollSpeed = 0
                this.clearScroll()
            }
        },
        createElement(mouseEvent) {
            const { width, height } = ELEMENT_LAYOUT[this.type]
            const ele = document.createElement('div')
            // 该类里面有 transform: translate(-50%, -50%), top 不需要再计算 width 和 height 了
            ele.classList.add('dragging-box')
            ele.style.width = width
            ele.style.height = height
            ele.style.top = mouseEvent.y + 'px'
            ele.style.left = mouseEvent.x + 'px'
            document.body.appendChild(ele)
            this.dragElement = ele
        },
        /* ====== 分割线 ====== */
        pointermove(e) {
            if (this.down && !this.dragging) {
                this.dragging = true
                if (!this.dragElement) this.createElement(e)
            }

            this.dragElement.style.top = e.y + 'px'
            this.dragElement.style.left = e.x + 'px'
            if (useDrawConfig().autoHeight) this.checkWheel(e)
        },
        pointerup() {
            if (!this.dragging) { // 处理单击的清楚
                this.clearScroll()
                document.removeEventListener('pointermove', this.pointermove)
                document.removeEventListener('pointerup', this.pointerup)
                return
            }
            this.down = false
            this.dragging = false

            // 绝对定位, 不包含边框
            const drawWrapper = useWorkPlaceRefs().drawWrapper
            const drawBounding = drawWrapper.getBoundingClientRect()
            const drawStyle = getComputedStyle(drawWrapper)
            const drawTop = drawBounding.top + Number.parseFloat(drawStyle.borderTopWidth)
            const drawLeft = drawBounding.left + Number.parseFloat(drawStyle.borderLeftWidth)
            const t = Number.parseFloat(this.dragElement.style.top)
            const l = Number.parseFloat(this.dragElement.style.left)
            const w = Number.parseFloat(this.dragElement.style.width)
            const h = Number.parseFloat(this.dragElement.style.height)
            const top = t - h/2 - drawTop  + 'px'
            const left = l - w/2 - drawLeft + 'px'

            useDrawData().add(this.type, top, left)
            document.body.removeChild(this.dragElement)

            this.dragElement = null
            this.clearScroll()
            document.removeEventListener('pointermove', this.pointermove)
            document.removeEventListener('pointerup', this.pointerup)
        },
        pointermove2(e) {
            if (this.down && !this.dragging) {
                this.dragging = true

                const dragStyle = this.dragElement.getBoundingClientRect()
                const y = e.y - Number.parseFloat(dragStyle.top)
                const x = e.x - Number.parseFloat(dragStyle.left)
                this.dragElement.style.position = 'fixed'
                this.dragElement.style.transform = `translate(-${x}px, -${y}px)`
                this.transitionX = x
                this.transitionY = y
            }

            this.dragElement.style.top = e.y  + 'px'
            this.dragElement.style.left = e.x  + 'px'
            if (useDrawConfig().autoHeight) this.checkWheel(e)
        },
        pointerup2() {
            if (!this.dragging) {
                this.clearScroll()
                document.removeEventListener('pointermove', this.pointermove2)
                document.removeEventListener('pointerup', this.pointerup2)
                return
            }
            this.down = false
            this.dragging = false

            const drawWrapper = useWorkPlaceRefs().drawWrapper
            const drawBounding = drawWrapper.getBoundingClientRect()
            const drawStyle = getComputedStyle(drawWrapper)
            const drawTop = drawBounding.top + Number.parseFloat(drawStyle.borderTopWidth)
            const drawLeft = drawBounding.left + Number.parseFloat(drawStyle.borderLeftWidth)
            const t = Number.parseFloat(this.dragElement.style.top)
            const l = Number.parseFloat(this.dragElement.style.left)
            const w = Number.parseFloat(this.dragElement.style.width)
            const h = Number.parseFloat(this.dragElement.style.height)
            const left = l - this.transitionX - drawLeft  + 'px'
            const top = t - this.transitionY - drawTop  + 'px'

            useDrawData().dragUpdate(this.id, top, left)

            this.dragElement.style.position = 'absolute'
            this.dragElement.style.transform = ''
            this.dragElement = null
            this.clearScroll()
            document.removeEventListener('pointermove', this.pointermove2)
            document.removeEventListener('pointerup', this.pointerup2)
        },
        pointerdownLeft(type) {
            this.type = type
            this.down = true

            document.addEventListener('pointermove', this.pointermove)
            document.addEventListener('pointerup', this.pointerup)
        },
        pointerdownDraw(ele, id) {
            this.id = id
            this.dragElement = ele
            this.down = true
            document.addEventListener('pointermove', this.pointermove2)
            document.addEventListener('pointerup', this.pointerup2)
        }
    },
})

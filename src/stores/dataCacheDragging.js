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
        // 拖拽元素偏移量
        transitionX: 0,
        transitionY: 0,
        // 可用于判断是 新建组件还是画布组件
        id: -1,
        // 可用于判断是 新建组件还是画布组件
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

        /* ====== 分割线 ====== */

        pointermove(e) {
            if (this.down && !this.dragging) {
                this.dragging = true

                // 区分新建组件和已有组件
                if (!this.dragElement) {
                    const { width, height } = ELEMENT_LAYOUT[this.type]
                    const ele = document.createElement('div')
                    ele.style.width = width
                    ele.style.height = height
                    document.body.appendChild(ele)

                    this.dragElement = ele
                    this.transitionX = Number.parseFloat(width) / 2
                    this.transitionY = Number.parseFloat(height) / 2
                } else {
                    const dragStyle = this.dragElement.getBoundingClientRect()
                    this.transitionX = e.x - Number.parseFloat(dragStyle.left)
                    this.transitionY = e.y - Number.parseFloat(dragStyle.top)
                }

                this.dragElement.style.zIndex = 9999
                this.dragElement.style.position = 'fixed'
                this.dragElement.style.boxShadow = '0 0 10px 0 #DDD'
                console.log('debugger: ', this.transitionX,this.transitionY)
                this.dragElement.style.transform = `translate(-${this.transitionX}px, -${this.transitionY}px)`
            }

            this.dragElement.style.top = e.y + 'px'
            this.dragElement.style.left = e.x + 'px'
            if (useDrawConfig().autoHeight) this.checkWheel(e)
        },
        pointerup() {
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
            const left = l - this.transitionX - drawLeft + 'px'
            const top = t - this.transitionY - drawTop + 'px'

            // 区分新建组件而已有组件
            if (this.id === -1) {
                useDrawData().add(this.type, top, left)
                document.body.removeChild(this.dragElement)
            } else {
                useDrawData().dragUpdate(this.id, top, left)
                this.dragElement.style.position = 'absolute'
                this.dragElement.style.transform = ''
            }

            this.id = -1
            this.dragElement = null
            this.clearScroll()
            document.removeEventListener('pointermove', this.pointermove)
            document.removeEventListener('pointerup', this.pointerup)
        },
        pointerdown({ele = null, id = -1, type = ''}) {
            this.type = type
            this.id = id
            this.dragElement = ele
            this.down = true
            document.addEventListener('pointermove', this.pointermove)
            document.addEventListener('pointerup', this.pointerup)
        },
    },
})

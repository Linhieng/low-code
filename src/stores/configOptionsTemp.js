import { defineStore } from 'pinia'
import { useDrawData, useDragTempStyleStore } from '@/stores/index'

// TODO: 对相关值进行限制，这里先简单处理一下。
// limitFunction 对象的属性均为函数，并且该函数名与样式属性名对应，返回值也不是乱写的，他们和 @/components/work-place/Right/StyleConfig.vue 中的限制一一对应
const limitFunction = {
    // 数值的限制

  width(style, dragStyle) {
    const widthMax = Number.parseFloat(dragStyle.drawWidth) - Number.parseFloat(style.left) - 1
    return { min: 100, max: widthMax }
  },
  height(style, dragStyle) {
    const heightMax = Number.parseFloat(dragStyle.drawHeight) - Number.parseFloat(style.top) - 1
    return { min: 30, max: heightMax }
  },
  top(style) {
    // const top = Number.parseFloat(style.top)
    // const minTop = top - 500 <= 0 ? 0 : top - 500
    // const maxTop = top + 500
    // return { min: minTop, max: maxTop }
  },
  left(style) {
    // const left = Number.parseFloat(style.left)
    // const minLeft = left - 500 <= 0 ? 0 : left - 500
    // const maxLeft = left + 500
    // return { min: minLeft, max: maxLeft }
  },
  zIndex() {
    return {
      min: 2,
      max: 999,
    }
  },
  fontSize() {
    return { min: 12, max: 40 }
  },
  lineHeight() {
    return { min: 20, max: 100 }
  },

    // 选项的限制

  textAlign() {
    return {
      enumOptions: ['left', 'center', 'right'],
    }
  },

  textDecoration() {
    return {
      enumOptions: ['underline', 'overline', 'line-through','none'],
    }
  },

  objectFit() {
    return {
      enumOptions: ['contain', 'cover', 'fill', 'none', 'scale-down'],
    }
  },
  objectPosition() {
    return {
      enumOptions: ['top', 'bottom', 'center', 'left', 'right'],
    }
  },

    // 颜色没什么需要限制的, 因为使用取色板, 但是该属性还是得存在

    color() {},
    backgroundColor() {},
}

// 存储当前正在修改配置的可配置项
export default defineStore('configOptionsTemp', {
  state: () => ({
    show: false,
    id: -1,
    hasSave: true,
    config: {}, // 非样式可配置项
    style: {}, // 这些值都会带上单位
    styleLimit: {}, // 限制输入范围
  }),
  actions: {
    open(id) {
      if (this.id === id) return
      this.hasSave = true
      this.show = true
      this.id = id
      const drawData = useDrawData()
      const dragStyle = useDragTempStyleStore()
      // NOTE: 此处进行值复制, 如果直接复制, 则用户的修改会立即保存, 这不是我们想要的
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[id].style))
      // 所有样式都要限制值范围
      Object.keys(this.style).forEach(property => {
        this.styleLimit[property] = limitFunction[property](this.style, dragStyle)
      })
    },
    save() {
      const drawData = useDrawData()
      drawData.update(this.id, this.style, this.config)
      this.hasSave = true
    },
    reset() {
      const drawData = useDrawData()
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].style))
      this.hasSave = true
    },
    close() {
      this.show = false
      this.id = -1
    },
    // 还是要求修改值时都要通过 action 修改, 这样可以监控变化
    modifyStyle(property, value) {
      this.style[property] = value
      this.hasSave = false
    },
    modifyConfig(property, value) {
      this.config[property] = value
      this.hasSave = false
    },
  },
})

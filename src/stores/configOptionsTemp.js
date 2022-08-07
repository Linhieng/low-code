import { defineStore } from 'pinia'
import { useDrawData } from '@/stores/index'

// TODO: 对相关值进行限制，这里先简单处理一下。
// limitFunction 对象的属性均为函数，并且该函数名与样式属性名对应，返回值也不是乱写的，他们和 @/components/work-place/Right/StyleConfig.vue 中的限制一一对应
const limitFunction = {
  // 数值的限制

  width() {
    return { min: 100, max: 1000 }
  },
  height() {
    return { min: 30, max: 500 }
  },
  top(t) {
    const top = Number.parseFloat(t)
    const minTop = top - 500 <= 0 ? 0 : top - 500
    const maxTop = top + 500
    return { min: minTop, max: maxTop }
  },
  left(l) {
    const left = Number.parseFloat(l)
    const minLeft = left - 500 <= 0 ? 0 : left - 500
    const maxLeft = left + 500
    return { min: minLeft, max: maxLeft }
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

  // 颜色没什么需要限制的, 因为使用取色板, 但是该属性还是得存在

  color() {},
  backgroundColor() {},
}

// 存储当前正在修改配置的可配置项
export default defineStore('configOptionsTemp', {
  // 这些值都会带上单位
  state: () => ({
    show: false,
    id: -1,
    config: {}, // 非样式可配置项
    style: {},
    styleLimit: {}, // 限制输入范围
  }),
  actions: {
    open(id) {
      this.show = true
      this.id = id
      const drawData = useDrawData()
      // NOTE: 此处进行值复制, 如果直接复制, 则用户的修改会立即保存, 这不是我们想要的
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[id].style))
      // 所有样式都要限制值范围
      Object.keys(this.style).forEach(property => {
        this.styleLimit[property] = limitFunction[property](this.style[property])
      })
    },
    save() {
      const drawData = useDrawData()
      drawData.update(this.id, this.style, this.config)
    },
    reset() {
      const drawData = useDrawData()
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].style))
    },
    close() {
      this.show = false
      this.id = -1
    },
    // modify(property, value) {
    // 一般来说，不要直接修改 state 比较好，将修改的方式的放在 actions 中比较好
    // 这样后续需要校验什么的比较方便
    // 但是在这里，条件限制已经交给了 styleLimit
    // 而且某些操作上，直接修改 state 更方便
    // 所以对于 configOptionsTemp 的数据修改，直接通过 state 修改
    // this.style[property] = value
    // },
  },
})

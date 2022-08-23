import { defineStore } from 'pinia'
import { useDrawData } from '@/stores/index'

// TODO: 对相关值进行限制，这里先简单处理一下。
// limitFunction 对象的属性均为函数，并且该函数名与样式属性名对应，返回值也不是乱写的，他们和 @/components/work-place/Right/StyleConfig.vue 中的限制一一对应
const limitFunction = {

  // 数值的限制（因为使用滑轮，所以需要限制，但感觉还能换种方式处理）
  width(style) {
    const width = Number.parseFloat(style.width)
    return { min: width / 2, max: width * 2 }
  },
  height(style) {
    const height = Number.parseFloat(style.height)
    return { min: height / 2, max: height * 2 }
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

  // 选项的可选项（这个才是真正有用的）
  textAlign() {
    return {
      enumOptions: ['left', 'center', 'right'],
    }
  },

  textDecoration() {
    return {
      enumOptions: ['underline', 'overline', 'line-through', 'none'],
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

  // 不需要限制的样式，top left 是不在 “配置面板” 进行修改。 颜色是因为取色板不需要限制
  top() { },
  left() { },
  color() { },
  backgroundColor() { },
}

// 存储当前正在修改配置的可配置项
export default defineStore('dataCacheConfig', {
  state: () => ({
    id: -1,
    show: false,
    hasSave: true,
    config: {}, // 非样式可配置项
    style: {}, // 这些值都会带上单位
    styleLimit: {}, // 限制输入范围
  }),
  actions: {
    open(id) {
      if (this.id === id) return

      this.id = id
      this.show = true
      this.hasSave = true

      const drawData = useDrawData()
      // NOTE: 此处进行值复制, 如果直接复制, 则用户的修改会立即保存, 这不是我们想要的
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[id].style))
      // 所有样式都要限制值范围（只在这里弄的话，一些数量级的限制被写死了）
      Object.keys(this.style).forEach(property => {
        this.styleLimit[property] = limitFunction[property](this.style)
      })
    },
    save() {
      if (this.hasSave) return
      useDrawData().update(this.id, this.style, this.config)
      this.hasSave = true
    },
    reset() {
      if (this.hasSave) return
      const drawData = useDrawData()
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[this.id].style))
      this.hasSave = true
    },
    close() {
      if (!this.hasSave && !window.confirm('关闭后未保存的数据会丢失，是否确定关闭？')) {
        return
      }
      this.show = false
      this.id = -1
    },
    del() {
      useDrawData().del(this.id)
      this.close()
    },
    // 还是要求修改值时都要通过 action 修改, 这样可以监控变化, 后续还可以实现 "撤销操作"
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

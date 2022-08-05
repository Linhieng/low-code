import { defineStore } from 'pinia'
import { useDrawData } from '@/stores/index'

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
      // NOTE: 此处进行值复制, 如果直接赋值, 则用户的修改会立即保存, 这不是我们想要的
      this.config = JSON.parse(JSON.stringify(drawData.elementConfig[id].config))
      this.style = JSON.parse(JSON.stringify(drawData.elementConfig[id].style))

      // TODO: 对相关值进行限制，这里先简单处理一下
      this.styleLimit.width = { min: 100, max: 1000 }
      this.styleLimit.height = { min: 30, max: 500 }
      const top = Number.parseFloat(this.style.top)
      const left = Number.parseFloat(this.style.left)
      const minTop = top - 500 <= 0 ? 0 : top - 500
      const maxTop = top + 500
      const minLeft = left - 500 <= 0 ? 0 : left - 500
      const maxLeft = left + 500
      this.styleLimit.top = { min: minTop, max: maxTop }
      this.styleLimit.left = { min: minLeft, max: maxLeft }
    },
    save() {
      const drawData = useDrawData()
      drawData.update(this.id, this.style, this.config)
    },
    close() {
      this.show = false
      this.id = -1
    },
    modifyNumber(property, value) {
      this.style[property] = value + 'px'
    },
  },
})

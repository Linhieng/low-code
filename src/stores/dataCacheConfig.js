import { defineStore } from 'pinia'
import { useDrawData } from '@/stores/index'

// 修改颜色的样式
const COLOR_SPECIES = ['color', 'backgroundColor']
// 值是特定的样式, RESTRICTED_SELECTION 是对应的特定值
const RESTRICTED_SPECIES = ['textAlign', 'objectFit', 'objectPosition', 'textDecoration',]
const RESTRICTED_SELECTION = {
  'textAlign': ['left', 'center', 'right'],
  'objectFit': ['contain', 'cover', 'fill', 'none', 'scale-down'],
  'objectPosition': ['top', 'bottom', 'center', 'left', 'right'],
  'textDecoration': ['underline', 'overline', 'line-through', 'none'],
}
// 需要用户输入的样式, 是带单位 px 的。 这一部分的限制, 暂不单独适配
const INPUT_PX_SPECIES = ['width', 'height', 'fontSize', 'lineHeight']
// const INPUT_PX_LIMIT
// 只允许输入数字的样式
const PURE_NUM_SPECIES = ['zIndex']


// 存储当前正在修改配置的可配置项
export default defineStore('dataCacheConfig', {
  state: () => ({
    id: -1,
    show: false,
    hasSave: true,
    config: {}, // 非样式可配置项
    style: {}, // 这些值都会带上单位
    styleForModify: {}, // 专门为修改面板服务
  }),
  actions: {
    // 同步 style 和 styleForModify
    styleSyncStyleForModify() {
      const style = this.style
      let restricted = {}
      let color = {}
      let inputPx = {}
      let pureNum = {}

      // NOTE: 要求 style 中有的样式, 必须都有一个默认值
      Object.keys(style).forEach(item => {
        if (COLOR_SPECIES.includes(item)) {
          color[item] = {
            propName: item,
            value: style[item],
          }
        } else if (INPUT_PX_SPECIES.includes(item)) {
          const v = Number.parseInt(style[item])
          inputPx[item] = {
            propName: item,
            value: style[item],
            limit: { min: v, max: v * 10 }
          }
        } else if (PURE_NUM_SPECIES.includes(item)) {
          const v = style[item]
          pureNum[item] = {
            propName: item,
            value: v,
            limit: { min: v, max: v * 100 }
          }
        } else if (RESTRICTED_SPECIES.includes(item)) {
          restricted[item] = {
            propName: item,
            value: style[item],
            selection: RESTRICTED_SELECTION[item]
          }
        } else {
          item !== 'top' && item !== 'left' && console.warn('出现了未使用的样式', item)
        }
      })

      this.styleForModify = { restricted, color, inputPx, pureNum }
    },
    open(id) {
      if (this.id === id) return

      this.id = id
      this.show = true
      this.hasSave = true

      // NOTE: 此处进行值复制, 如果直接复制, 则用户的修改会立即保存, 这不是我们想要的
      const drawData = useDrawData()
      const config = JSON.parse(JSON.stringify(drawData.elementConfig[id].config))
      const style = JSON.parse(JSON.stringify(drawData.elementConfig[id].style))
      this.style = style
      this.config = config
      this.styleSyncStyleForModify()
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
      this.styleSyncStyleForModify()
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
      this.styleForModify.restricted.hasOwnProperty(property) && (this.styleForModify.restricted[property].value = value)
      this.styleForModify.color.hasOwnProperty(property) && (this.styleForModify.color[property].value = value)
      this.styleForModify.inputPx.hasOwnProperty(property) && (this.styleForModify.inputPx[property].value = value)
      this.styleForModify.pureNum.hasOwnProperty(property) && (this.styleForModify.pureNum[property].value = value)

      this.style[property] = value
      this.hasSave = false
    },
    modifyConfig(property, value) {
      this.config[property] = value
      this.hasSave = false
    },
  },
})

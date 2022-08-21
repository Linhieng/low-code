// 存储创建的组件内容
import { defineStore } from 'pinia'
import { ELEMENT_LAYOUT, ELEMENT_CONFIG, ELEMENT_STYLE } from '@/constants/index'
import uploadPage from "@/request/upload-page"

export default defineStore('drawData', {
  state: () => ({
    // NOTE: 这两个完全可以合并成一个, 这里我选择不合并。
    elementArr: [], // 每个组件最基本的信息, id 和 type
    elementConfig: {}, // 每个组件的可配置信息, elementArr 通过 id 可以在这里查找到对应组件的可配置信息, 不同组件的可配置信息不同
  }),
  actions: {
    add(type, top, left) {
      // NOTE: 这里为了方便, 就使用下标作为 id, 但查找时要使用 id 进行查找, 不能将该 id 作为下标
      const id = this.elementArr.length
      this.elementArr.push({ id, type })
      this.elementConfig[id] = {
        style: {
          ...ELEMENT_STYLE[type],
          ...ELEMENT_LAYOUT[type],
          top,
          left,
        },
        config: {
          ...ELEMENT_CONFIG[type],
        },
      }
    },
    dragUpdate(id, top, left) {
      console.log('debugger: ', id, this.elementConfig[id])
      this.elementConfig[id].style.top = top
      this.elementConfig[id].style.left = left
    },
    update(id, style, config) {
      this.elementConfig[id].style = style
      this.elementConfig[id].config = config
    },
    del(id) {
      delete this.elementConfig[id]

      const tmp = this.elementArr
      tmp.splice(tmp.find(({ i }) => i === id), 1)
      this.elementArr = tmp
    },
    publish() {
      return new Promise(async (res, rej) => {
        try {
          const data = await uploadPage({
            elementArr: this.elementArr,
            elementConfig: this.elementConfig,
          })
          if (data.status === 'success') {
            res(data.data)
          } else {
            rej(data.data)
          }
        } catch (error) {
          console.error(error)
          rej(error.message)
        }
      })
    }
  },
})

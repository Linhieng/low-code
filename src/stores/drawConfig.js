// 存储创建的组件内容
import { defineStore } from 'pinia'
import { useWorkPlaceRefs, useDataCacheConfig } from './index'

export default defineStore('drawConfig', {
  state: () => ({
    autoHeight: true,
    isPreview: false,
  }),
  actions: {
    toggleAutoHeight() {
      this.autoHeight = !this.autoHeight
    },
    togglePreview() {
      this.isPreview = !this.isPreview
      const workPlace = useWorkPlaceRefs().workPlace
      this.isPreview
        ? workPlace.classList.add('preview-page')
        : workPlace.classList.remove('preview-page')
    }
  },
})

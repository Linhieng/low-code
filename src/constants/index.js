// 个人服务器地址
export const SERVER_HOST = 'http://localhost:10001/'

/* export */ const ELEMENT_TEXT = 'ElementText'
/* export */ const ELEMENT_BUTTON = 'ElementButton'
/* export */ const ELEMENT_IMAGE = 'ElementImage'
/* export */ const ELEMENT_LINK = 'ElementLink'
/* export */ const ELEMENT_VIDEO = 'ElementVideo'
// 项目拥有的拖拽组件。 里面的 id 是元素的 id，仅用于样式的渲染。
export const ELEMENT_TYPES = {
  [ELEMENT_TEXT]: {
    value: ELEMENT_TEXT,
    description: '文本组件',
    id: 'component-text',
  },
  [ELEMENT_BUTTON]: {
    value: ELEMENT_BUTTON,
    description: '按钮组件',
    id: 'component-button',
  },
  [ELEMENT_IMAGE]: {
    value: ELEMENT_IMAGE,
    description: '图片组件',
    id: 'component-image',
  },
  [ELEMENT_LINK]: {
    value: ELEMENT_LINK,
    description: '链接组件',
    id: 'component-link',
  },
  [ELEMENT_VIDEO]: {
    value: ELEMENT_VIDEO,
    description: '视频组件',
    id: 'component-video',
  },
}

// 各个组件的默认宽高
export const ELEMENT_LAYOUT = {
  [ELEMENT_TEXT]: {
    width: '400px',
    height: '100px',
  },
  [ELEMENT_BUTTON]: {
    width: '120px',
    height: '40px',
  },
  [ELEMENT_IMAGE]: {
    width: '200px',
    height: '200px',
  },
  [ELEMENT_LINK]: {
    width: '120px',
    height: '30px',
  },
  [ELEMENT_VIDEO]: {
    width: '400px',
    height: '400px',
  },
}

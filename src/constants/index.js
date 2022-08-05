// 个人服务器地址
export const SERVER_HOST = 'http://localhost:10001/'

// 这几个代表拖拽组件对应的 vue 文件名, 他们的值也用于判断组件类型是否相同
/* export */ const ELEMENT_TEXT = 'ElementText'
/* export */ const ELEMENT_BUTTON = 'ElementButton'
/* export */ const ELEMENT_IMAGE = 'ElementImage'
/* export */ const ELEMENT_LINK = 'ElementLink'
/* export */ const ELEMENT_VIDEO = 'ElementVideo'

/*
ELEMENT_TYPES 保存了项目拥有的所有组件类型。
id 用在左侧添加栏中元素的 id
descriptions 用作左侧添加栏中的内容描述
value 对应拖拽组件的名称, 可用作 type, 区分不同类型组件
 */
export const ELEMENT_TYPES = {
  [ELEMENT_TEXT]: {
    value: ELEMENT_TEXT,
    description: '文本组件',
    id: 'btn-text',
  },
  [ELEMENT_BUTTON]: {
    value: ELEMENT_BUTTON,
    description: '按钮组件',
    id: 'btn-button',
  },
  [ELEMENT_IMAGE]: {
    value: ELEMENT_IMAGE,
    description: '图片组件',
    id: 'btn-image',
  },
  [ELEMENT_LINK]: {
    value: ELEMENT_LINK,
    description: '链接组件',
    id: 'btn-link',
  },
  [ELEMENT_VIDEO]: {
    value: ELEMENT_VIDEO,
    description: '视频组件',
    id: 'btn-video',
  },
}

// ELEMENT_LAYOUT 可用于查阅各个组件的默认宽高
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

// ELEMENT_STYLE_TOGETHER 是所有组件共同拥有的可配置样式
// ELEMENT_STYLE 是各个组件各自的可配置样式
// ELEMENT_CONFIG 是各个组件各自的可配置选项（不是样式）
const ELEMENT_STYLE_TOGETHER = { width: '', height: '', top: '', left: '' }
export const ELEMENT_STYLE = {
  [ELEMENT_TEXT]: {
    ...ELEMENT_STYLE_TOGETHER,
    color: '',
    size: '',
  },
  [ELEMENT_BUTTON]: {
    ...ELEMENT_STYLE_TOGETHER,
    backgroundColor: '',
  },
  [ELEMENT_IMAGE]: {
    ...ELEMENT_STYLE_TOGETHER,
  },
  [ELEMENT_LINK]: {
    ...ELEMENT_STYLE_TOGETHER,
  },
  [ELEMENT_VIDEO]: {
    ...ELEMENT_STYLE_TOGETHER,
  },
}
export const ELEMENT_CONFIG = {
  [ELEMENT_TEXT]: {
    textValue: '',
  },
  [ELEMENT_BUTTON]: {
    textValue: '',
  },
  [ELEMENT_IMAGE]: {
    alt: '',
    url: '',
  },
  [ELEMENT_LINK]: {
    textValue: '',
    url: '',
  },
  [ELEMENT_VIDEO]: {
    url: '',
  },
}

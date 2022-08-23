// 个人服务器地址
export const SERVER_HOST = 'http://localhost:10001/'

// 这几个代表拖拽组件对应的 vue 文件名, 他们的值也用于判断组件类型是否相同
export  const ELEMENT_TEXT = 'ElementText'
export  const ELEMENT_BUTTON = 'ElementButton'
export  const ELEMENT_IMAGE = 'ElementImage'
export  const ELEMENT_LINK = 'ElementLink'
export  const ELEMENT_VIDEO = 'ElementVideo'

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
        width: '200px',
        height: '40px',
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
        width: '300px',
        height: '140px',
    },
}

// ELEMENT_STYLE_TOGETHER 是所有组件共同拥有的可配置样式
// ELEMENT_STYLE 是各个组件各自的可配置样式
// ELEMENT_CONFIG 是各个组件各自的可配置选项（不是样式）
const ELEMENT_STYLE_TOGETHER = { width: '', height: '', top: '', left: '', zIndex: 2 }
export const ELEMENT_STYLE = {
  [ELEMENT_TEXT]: {
    ...ELEMENT_STYLE_TOGETHER,
    fontSize: '14px',
    textAlign: 'center',
    color: '#666',
    lineHeight: '20px',
    backgroundColor: '#FFF',
  },
  [ELEMENT_BUTTON]: {
    ...ELEMENT_STYLE_TOGETHER,
    fontSize: '14px',
    textAlign: 'center',
    color: '#FFF',
    lineHeight: '20px',
    backgroundColor: '#8cd6f4',
  },
  [ELEMENT_IMAGE]: {
    ...ELEMENT_STYLE_TOGETHER,
    objectFit: 'cover',
    objectPosition: 'center',
  },
  [ELEMENT_LINK]: {
    ...ELEMENT_STYLE_TOGETHER,
    fontSize: '14px',
    textAlign: 'center',
    color: '#666',
    lineHeight: '20px',
    backgroundColor: '#FFF',
    textDecoration:'underline',
  },
  [ELEMENT_VIDEO]: {
    ...ELEMENT_STYLE_TOGETHER,
    objectFit: 'none',
    objectPosition: 'center',
  },
}
export const ELEMENT_CONFIG = {
  [ELEMENT_TEXT]: {
    innerText: 'talk is cheap, show me the code.',
  },
  [ELEMENT_BUTTON]: {
    innerText: '按钮',
    title: '按钮描述',
  },
  [ELEMENT_IMAGE]: {
    alt: '图片',
    src: 'https://pic.imgdb.cn/item/6304358116f2c2beb15e9a9b.jpg',
  },
  [ELEMENT_LINK]: {
    innerText: 'github page',
    href: 'https://linhieng.github.io/linhieng/',
  },
  [ELEMENT_VIDEO]: {
    videoSrc: '',
    poster: 'https://pic.imgdb.cn/item/6304364a16f2c2beb15ef536.png',
  },
}

# 搭建一个简单的低代码平台

## 运行

```bash
$ npm ci
安装依赖包

$ npm run koa-server
启动后台

$ npm run serve
启动前端
```

## 具体要求

需求：要求开发一个 Web 页面编辑器，支持通过拖拽方式编辑页面内容并生成最终可视页面，核心功能：

* 支持 button、图片、视频、文本、链接等基础组件
* 支持自定义组件动作(单击、双击等)逻辑
* 支持页面预览与发布

需求来自: [青训营](https://bytedance.feishu.cn/docx/doxcnLxmR5PMdZlENJ3VbgMDT4d)

## 项目使用的相关库

* vue3
* vue-router
* pinia
* axios
* easy-file-uploader

## TODO

项目完成后根据根据拥有的配置项，来对 StyleConfig.vue 组件进行重构。


## 相关文件介绍

### stores

* `index` 文件用于导出所有 pinia 创建的状态。但目前来看，不要 index.js 也不会带来不方便的地方。
* `drawData` 低代码组件的核心数据存储，创建的组件和对应的配置都存储在 drawData 中
* `workPlaceRefs` 存储了页面的 DOM 元素。因为各个 DOM 之间是模块化的，有时候想要操作其他的 vue 文件中的 dom，可以通过 workPlaceRefs 来获取到。但目前来看，也没有经常用到。
* `drawConfig` 存储页面的配置，比如是否开启 “高度自动适应”，当前是否是 “预览” 状态。
* `dragTempStyle` 存储拖拽过程中的一些临时数据，要存储的核心信息就是拖拽时组件的类型、拖拽结束时组件的决定定位。
* `configOptionTemp` 存储修改组件配置时的信息。对组件的样式和配置进行修改时，这些修改的数据不是立即生效的，需要用户确定保存，才会将数据写入 drawData。
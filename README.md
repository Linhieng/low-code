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
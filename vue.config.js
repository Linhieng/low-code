module.exports = {
  css: {
    loaderOptions: {
      // TODO: 后续有需要可以对样式进行模块化
      // "sass-loader" 版本是 v8, 此处应该使用 prependData
      scss: {
        prependData: `
          @import '@/assets/scss/animation.scss';
        `,
      },
    },
  },
}

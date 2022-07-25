<template>
  <div>
    <DrawPanel :dataList="datasList"/>
  </div>
</template>

<script>
import DrawPanel from "./DrawPanel.vue";
export default {
  name: "Father",
  components: { DrawPanel },
  data() {
    return {
        
      datasList: [
        {
          id: "01", // 组件 ID
          type: "text", // 组件类型
          data: "我是text", // 文字内容
          color: "#000000", // 文字颜色
          size: "12px", // 文字大小
          width: "100px", // 容器宽度
          height: "100px", // 容器高度
          left: "50px", // 容器左边距
          top: "250px", // 容器上边距
        },
        {
          id: "02", // 组件 ID
          type: "image", // 组件类型
          data: "我是图片", // 图片 url
          width: "100px", // 容器宽度
          height: "100px", // 容器高度
          left: "150px", // 容器左边距
          top: "150px", // 容器上边距
        },
        {
          id: "03", // 组件 ID
          type: "video", // 组件类型
          data: "我是视频", // 视频 url
          width: "100px", // 容器宽度
          height: "100px", // 容器高度
          left: "280px", // 容器左边距
          top: "150px", // 容器上边距
        },
        {
          id: "04", // 组件 ID
          type: "input", // 组件类型
          data: "我是输入框", // 
          width: "100px", // 容器宽度
          height: "100px", // 容器高度
          left: "300px", // 容器左边距
          top: "300px", // 容器上边距
        },
      ],
    };
  },
};
</script>

<style>
</style>
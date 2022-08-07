<template>
  <div>
    <DrawPanel :dataList="datasList" />
    <div class="contain">
      <button
        style="
          width: 150px;
          height: 50px;
          background-color: rgb(196, 255, 205);
          margin-left: 15px;
        "
        @click="addInput"
      >
        点我增加input
      </button>
      <button
        style="
          width: 150px;
          height: 50px;
          background-color: rgb(196, 255, 228);
          margin-left: 15px;
        "
        @click="addText"
      >
        点我增加text
      </button>
      <button
        style="
          width: 150px;
          height: 50px;
          background-color: rgb(196, 255, 242);
          margin-left: 15px;
        "
        @click="addImage"
      >
        点我增加image
      </button>
      <button
        style="
          width: 150px;
          height: 50px;
          background-color: rgb(196, 255, 258);
          margin-left: 15px;
        "
        @click="addVideo"
      >
        点我增加video
      </button>
      <button
        style="
          width: 150px;
          height: 50px;
          background-color: rgb(196, 255, 278);
          margin-left: 15px;
        "
        @click="deleteOne"
      >
        点我删除
      </button>
    </div>
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
  methods:{
    addInput(){
      const tempList={
        id:toString(this.datasList.length),
        type:"input",
        data: "我是输入框", 
        width: "100px", 
        height: "100px", 
        left: Math.random()*600+ '0'+"px", 
        top: Math.random()*600+'0'+"px", 
      }
      this.datasList.push(tempList)
    },
    addText(){
      const tempList={
        id:toString(this.datasList.length),
        type:"text",
        data: "我是text", 
        width: "100px", 
        height: "100px", 
        left: Math.random()*600+ '0'+"px", 
        top: Math.random()*600+'0'+"px", 
      } 
      this.datasList.push(tempList)     
    },
    addImage(){
      const tempList={
        id:toString(this.datasList.length),
        type:"image",
        data: "我是图片", 
        width: "100px", 
        height: "100px", 
        left: Math.random()*600+ '0'+"px", 
        top: Math.random()*600+'0'+"px", 
      }
      this.datasList.push(tempList)
    },
    addVideo(){
      const tempList={
        id:toString(this.datasList.length),
        type:"video",
        data: "我是视频",
        width: "100px", 
        height: "100px", 
        left: Math.random()*600+ '0'+"px", 
        top: Math.random()*600+'0'+"px", 
      }
      this.datasList.push(tempList)
    },
    deleteOne(){
      let temp = this.datasList
      temp.pop()
      this.datasList = temp
    }
  }
};
</script>

<style>
.contain button {
  scale: 1;
  transition: 0.5s;
}
.contain button:hover {
  transform: scale(1.2);
}
</style>
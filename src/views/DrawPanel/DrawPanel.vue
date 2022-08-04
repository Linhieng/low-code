<template>
  <div class="showPlace">
    <h1>Welcome to drawPanel!!!</h1>
    <!-- <div
      v-for="(item, index) in dataList"
      :key="index"
      :style="{
        color: item.color,
        fontSize: item.size,
        width: item.width,
        height: item.height,
        left: item.left,
        top: item.top,
        position: 'absolute',
        backgroundColor: '#bbbbbb',
      }"
      class="zindex"
    >
      {{ item.data }}
    </div> -->
    <div class="contain"></div>
    <!-- <div style="width: 200px; height: 100px">
        <button style="width: 100px; height: 100px" @click="cutit">点我删除</button>
        <button style="width: 100px; height: 100px" @click="addit">点我增加</button>
    </div> -->
  </div>
</template>

<script>
export default {
  name: "DrawPanel",
  props: {
    dataList: {
      type: Array,
    },
  },
  computed: {
  	dataListNew() {
        return JSON.parse(JSON.stringify(this.dataList))//watch监听要求
  	},
 },
  methods: {
    // cutit(){
    //     let temp = this.dataList;
    //     temp.pop();
    //     this.dataList = temp;
    // },
    // addit(){
    //     let temp = this.dataList;
    //     let tempIndex = this.dataList.length;
    //     // console.log(tempIndex);
    //     let tempData = {
    //     id: '0'+tempIndex, // 组件 ID
    //     type: "新增", // 组件类型
    //     data: "我是新增", //
    //     width: "100px", // 容器宽度
    //     height: "100px", // 容器高度
    //     left: Math.random()*600+ '0'+"px", // 容器左边距
    //     top: Math.random()*600+'0'+"px", // 容器上边距
    //     }
    //     this.dataList.push(tempData);
    // }
  },
  mounted() {
    // const contain = document.getElementsByClassName("contain");
    const contain = document.querySelector(".contain");
    this.dataList.forEach((item) => {
      let temp = document.createElement(`${item.type}`);
      temp.innerHTML = `${item.data}`;
      temp.style.color = `${item.color}`;
      temp.style.width = `${item.width}`;
      temp.style.height = `${item.height}`;
      temp.style.position = "absolute";
      temp.style.left = `${item.left}`;
      temp.style.top = `${item.top}`;
      temp.style.fontSize = `${item.size}`;
      temp.style.backgroundColor = "skyblue";
      contain.appendChild(temp);
    });
  },
  watch: {
    dataList: {
      handler(newValue, oldValue) {
        for (let i = 0; i < oldValue.length; i++) {
          if (oldValue[i].id == newValue[i].id && newValue.length == oldValue.length) {
            break;
          } else {
            this.dataList = newValue
            break;
          }
        }
        const contain = document.querySelector(".contain");
        while(contain.children.length != 0){
          contain.removeChild(contain.children[contain.children.length-1])
        }
        this.dataList.forEach((item) => {
          let temp = document.createElement(`${item.type}`);
          temp.innerHTML = `${item.data}`;
          temp.style.color = `${item.color}`;
          temp.style.width = `${item.width}`;
          temp.style.height = `${item.height}`;
          temp.style.position = "absolute";
          temp.style.left = `${item.left}`;
          temp.style.top = `${item.top}`;
          temp.style.fontSize = `${item.size}`;
          temp.style.backgroundColor = "skyblue";
          contain.appendChild(temp);
        });
      },
      immediate: false,
      deep: true,
    },
  },
};
</script>

<style scope>
.showPlace {
  position: relative;
  height: 700px;
  width: 700px;
  background: rgb(246, 229, 229);
  backdrop-filter: blur(4px);
  overflow: hidden;
}
.zindex {
  z-index: -1000;
}
</style>
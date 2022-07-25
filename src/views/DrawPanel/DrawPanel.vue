<template>
    <div class="showPlace">
        <h1>Welcome to drawPanel!!! </h1>
        <div v-for="(item,index) in dataList"
        :key="index"
        :style="{ 
            color: item.color,
            fontSize: item.size,
            width: item.width,
            height: item.height,
            left: item.left,
            top: item.top,
            position: 'absolute',
            backgroundColor: '#bbbbbb'}"
        >{{item.data}}</div>
        <button style="width:100px;height:100px" @click="cutit">点我删除</button>
    </div>

</template>

<script>
export default {
  name:'DrawPanel',
  props:['dataList'],
  
  methods:{
    cutit(){
        let temp = this.dataList;
        temp.pop();
        this.dataList = temp;
    }
  }
}
</script>

<style scope>
    .showPlace{
        position: relative;
        height: 700px;
        width: 700px;
        background: rgb(246, 229, 229);
        backdrop-filter: blur(4px);
    }
</style>
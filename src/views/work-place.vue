<template>
  <p>这个数是非响应式的：{{num}}</p>
  <p>这样才是响应式的{{totalNum.num}}</p>
  <p>这样才是响应式的{{totalNum.actionTimes}}</p>
  <button @click="totalNum.increment">+1</button>
  <button @click="totalNum.decrement">-1</button>
</template>

<script>
import { useTotalNumStore } from '@/stores/index'

export default {
  data() {
    const totalNum = useTotalNumStore()
    // 注意, 不推荐这样直接修改: totalNum.num++
    return {
      totalNum,
      num: totalNum.num
    }
  }
}
</script>

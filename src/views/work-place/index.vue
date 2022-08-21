<template>
  <div id="work-place" :class="{dragging: dragStyle.dragging}">
    <header>
      <Top />
    </header>
    <main>
      <Left />
      <Draw />
      <Right />
    </main>
  </div>
</template>

<script>
import Left from './Left.vue'
import Draw from './Draw.vue'
import Right from './Right.vue'
import Top from './Top.vue'
import "./index.scss"
import { useDragTempStyleStore  } from "@/stores/index"

export default {
  components: { Left, Draw, Right, Top },
  data() {
    return {
      dragStyle: useDragTempStyleStore()
    }
  }
}
</script>

<style lang="scss">

</style>
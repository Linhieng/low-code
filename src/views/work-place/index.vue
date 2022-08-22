<template>
  <div id="work-place" :class="{dragging: dragStyle.dragging}">
    <header>
      <Top />
    </header>
    <main ref="main">
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
import { useDragTempStyleStore, useWorkPlaceRefs  } from "@/stores/index"

export default {
  components: { Left, Draw, Right, Top },
  data() {
    return {
      dragStyle: useDragTempStyleStore(),
      workPlaceRefs: useWorkPlaceRefs(),
    }
  },
  mounted() {
    this.workPlaceRefs.addMain(this.$refs.main)
  }
}
</script>

<style lang="scss">

</style>
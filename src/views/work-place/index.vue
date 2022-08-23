<template>
  <div ref="workPlace" id="work-place" :class="{dragging: cacheDragging.dragging}">
    <header ref="header">
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
import Top from './Top.vue'
import Left from './Left.vue'
import Draw from './Draw.vue'
import Right from './Right.vue'
import "./index.scss"
import { useWorkPlaceRefs, useDataCacheDragging  } from "@/stores/index"

export default {
  components: { Top, Left, Draw, Right },
  data() {
    return {
      cacheDragging: useDataCacheDragging(),
      workPlaceRefs: useWorkPlaceRefs(),
    }
  },
  mounted() {
    this.workPlaceRefs.addMain(this.$refs.main)
    this.workPlaceRefs.addHeader(this.$refs.header)
    this.workPlaceRefs.addWorkPlace(this.$refs.workPlace)
  }
}
</script>
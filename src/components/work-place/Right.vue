<template>
  <div ref="right" id="right">配置</div>
</template>

<script>
import { useWorkPlaceRefs } from '@/stores/index'

export default {
  data() {
    return {
      workPlaceRefs: useWorkPlaceRefs(),
    }
  },
  mounted() {
    this.workPlaceRefs.addRight(this.$refs.right)
  },
}
</script>

<style lang="scss"></style>

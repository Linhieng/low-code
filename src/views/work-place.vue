<template>
  <Top />
  <Left />
  <Draw />
  <Right />
</template>

<script>
import Left from '@/components/work-place/Left.vue'
import Draw from '@/components/work-place/Draw.vue'
import Right from '@/components/work-place/Right.vue'
import Top from '@/components/work-place/Top.vue'

export default {
  components: { Left, Draw, Right, Top },
}
</script>

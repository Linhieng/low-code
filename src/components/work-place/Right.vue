<template>
  <div ref="right" id="right" :style="style">
    <h2>
      <p>配置</p>
      <button @click="close" title="关闭" class="options_close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-close_line"><path d="M13.414 12l6.293-6.293a.999.999 0 10-1.414-1.414L12 10.586 5.707 4.293a.997.997 0 00-1.414 0 .999.999 0 000 1.414L10.586 12l-6.293 6.293a.999.999 0 101.414 1.414L12 13.414l6.293 6.293a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z" fill-rule="evenodd"></path></svg>
      </button>
    </h2>
  </div>
</template>

<script>
import { useWorkPlaceRefs, useConfigOptionsTemp } from '@/stores/index'

export default {
  data() {
    return {
      workPlaceRefs: useWorkPlaceRefs(),
      configOptions: useConfigOptionsTemp(),
    }
  },
  computed: {
    style() {
      return {
        display: this.configOptions.show ? 'block' : 'none',
      }
    },
  },
  methods: {
    close() {
      this.configOptions.close()
    },
  },
  mounted() {
    this.workPlaceRefs.addRight(this.$refs.right)
  },
}
</script>

<style lang="scss">
#right {
  h2 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    p {
      width: max-content;
      font-size: 30px;
      height: max-content;
      line-height: 100%;
    }
    .options_close {
      padding: 20px;
      margin-right: -20px;
      background-color: transparent;
      border: none;
      cursor: pointer;
      svg {
        width: 40px;
        height: 40px;
      }
      &:hover svg {
        fill: skyblue;
      }
    }
  }
}
</style>

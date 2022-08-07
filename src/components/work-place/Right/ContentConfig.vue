<template>
  <div class="modify-config">
    <div v-if="configList.hasOwnProperty('innerText')" class="modify-item">
      <p class="property">innerText（按钮描述）</p>
      <div class="value-input">
        <TextArea v-model="configList.innerText" />
      </div>
    </div>
  </div>
</template>

<script>
import { useConfigOptionsTemp } from '@/stores/index'
import TextArea from '@/components/TextArea.vue'

export default {
  components: { TextArea },
  data() {
    return {
      configOption: useConfigOptionsTemp(),
    }
  },
  computed: {
    configList() {
      return this.configOption.config
    },
  },
  methods: {
    modify(property, value) {
      this.configOption.style[property] = value
    },
  },
}
</script>

<style lang="scss" scoped>
.modify-item {
  width: 100%;
  margin-top: 20px;

  .property {
    margin-bottom: 16px;
  }
  .value-input {
    width: 100%;
    display: flex;
    justify-content: center;
  }
}
</style>

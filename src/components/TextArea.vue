<template>
  <div class="textarea--auto-height" :style="style">
    <span class="border"></span>
    <textarea ref="domTextarea" :style="{ height }" :rows="_rows" :placeholder="placeholder" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" />
  </div>
</template>

<script>
import calcTextareaHeight from '@/utils/calcTextareaHeight'

export default {
  emits: ['update:modelValue'],
  props: {
    style: Object,
    modelValue: String,
    placeholder: String,
    rows: Number,
  },
  data() {
    return {
      _rows: this.rows,
      height: 'auto',
    }
  },
  watch: {
    modelValue: {
      handler() {
        this.height = calcTextareaHeight(this.$refs.domTextarea, this.rows).height
      },
      flush: 'post',
    },
  },
  mounted() {
    this.height = calcTextareaHeight(this.$refs.domTextarea, this.rows).height
  },
}
</script>

<style lang="scss" scoped>
.textarea--auto-height {
  width: 100%;
  padding: 10px 14px;
  font-size: 18px;
  position: relative;
  textarea {
    position: relative;
    z-index: 1;
    width: 100%;
    font-size: inherit;
    text-align: inherit;
    line-height: inherit;

    resize: none;
    outline: none;
    border: none;
    caret-color: #00b7ff;
  }
  .border {
    position: absolute;
    z-index: 0;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border: 1px solid #d1d1d1;
    box-sizing: border-box;
    border-radius: 4px;
    transition: border 0.3s;
  }
  &:hover .border {
    border: 1px dashed skyblue;
  }
  textarea:focus + .border {
    border: 1px solid skyblue;
  }
}
</style>

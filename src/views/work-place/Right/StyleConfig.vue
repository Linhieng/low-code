<template>
  <div class="modify-style">

    <template v-for="item in styleList.pureNum" :key="item.propName">
       <div class="modify-item">
        <p class="property">{{item.propName}}: {{ item.value }}</p>
        <input @input="modify(item.propName, $event.currentTarget.value)" class="value" type="range" :value="item.value" :min="item.limit.min" :max="item.limit.max" />
      </div>
    </template>

    <template v-for="item in styleList.inputPx" :key="item.propName">
       <div class="modify-item">
        <p class="property">{{item.propName}}: {{ item.value }}</p>
        <input @input="modify(item.propName, $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(item.value)" :min="item.limit.min" :max="item.limit.max" />
      </div>
    </template>

    <!-- 选项 -->
    <template v-for="item in styleList.restricted" :key="item.value">
      <div class="modify-item">
        <p class="property">{{item.propName}}: {{ item.value }}</p>
        <ul class="option-list"> <button class="btn-option" v-for="option in item.selection" :key="option" :class="{ active: item.value === option }" @click="modify(item.propName, option)">{{ option }}</button> </ul>
      </div>
    </template>

    <!-- 颜色 -->
    <!-- NOTE: :key 值如果设置为 item.value, 会导致 bug。每当颜色变化时，item.value 的值都会变，从而导致 vue 重新渲染， 先前的组件 ColorPicker 就会被卸载。   -->
    <template v-for="item in styleList.color" :key="item.propName">
      <div class="modify-item">
        <p class="property">{{item.propName}}: {{ item.value }}</p>
        <div class="value"> <ColorPicker :modelValue="item.value" @update:modelValue="modify(item.propName, $event)" /> </div>
      </div>
    </template>

  </div>
</template>

<script>
import { useDataCacheConfig } from '@/stores/index'
import ColorPicker from '@/components/ColorPicker.vue'

export default {
  components: { ColorPicker },
  data() {
    return {
      cacheConfig: useDataCacheConfig(),
    }
  },
  computed: {
    styleList() {
      return this.cacheConfig.styleForModify
    },
  },
  methods: {
    modify(property, value) {
      this.cacheConfig.modifyStyle(property, value)
    },
  },
}
</script>

<style lang="scss" scoped>

input[type="range"] {
  appearance: none;
  width: 100px;
  height: 10px;
  border-radius: 5px;
  background: #d7dcdf;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 15px;
    height: 15px;
    border-radius: 50%;
    background: #2c3e50;
    cursor: pointer;
    &:hover {
      background: skyblue;
    }
  }
  &:active::-webkit-slider-thumb {
    background: skyblue;
  }
}

.modify-item {
  width: 100%;
  margin-top: 20px;

  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;

  .property {
    margin-bottom: 6px;
  }
  .key-option {
    cursor: pointer;
    width: 40px;
    height: 24px;
    line-height: 24px;
    padding: 4px;
    margin-right: 5px;
    border-radius: 4px;
    text-align: center;
    border: 1px solid #d1d1d1;
    color: #000;
    background-color: #fff;

    &.active {
      background: skyblue;
      color: #fff;
      border-color: transparent;
    }
  }
  .value {
    width: 100%;
    margin: 10px 0;
    display: flex;
    justify-content: center;
  }
  .option-list {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    button {
      width: max-content;
      padding: 8px 14px;
      list-style: none;
    }
  }
}
</style>

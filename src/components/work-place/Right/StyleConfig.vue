<template>
  <div class="modify-style">
    <div v-if="styleList.width" class="modify-item">
      <p class="property">width: {{ styleList.width }}</p>
      <input @input="modify('width', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.width)" :min="styleLimit.width.min" :max="styleLimit.width.max" />
    </div>

    <div v-if="styleList.height" class="modify-item">
      <p class="property">height: {{ styleList.height }}</p>
      <input @input="modify('height', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.height)" :min="styleLimit.height.min" :max="styleLimit.height.max" />
    </div>

    <div v-if="styleList.top" class="modify-item">
      <p class="property">top: {{ styleList.top }}</p>
      <input @input="modify('top', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.top)" :min="styleLimit.top.min" :max="styleLimit.top.max" />
    </div>

    <div v-if="styleList.left" class="modify-item">
      <p class="property">left: {{ styleList.left }}</p>
      <input @input="modify('left', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.left)" :min="styleLimit.left.min" :max="styleLimit.left.max" />
    </div>

    <div v-if="styleList.fontSize" class="modify-item">
      <p class="property">font-size: {{ styleList.fontSize }}</p>
      <input @input="modify('fontSize', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.fontSize)" :min="styleLimit.fontSize.min" :max="styleLimit.fontSize.max" />
    </div>

    <div v-if="styleList.textAlign" class="modify-item">
      <p class="property">text-align: {{ styleList.textAlign }}</p>
      <ul class="ul-value">
        <li v-for="(option, i) in styleLimit.textAlign.enumOptions" :key="i" :class="{ active: styleList.textAlign === option }" @click="modify('textAlign', option)">{{ option }}</li>
      </ul>
    </div>

    <div v-if="styleList.color" class="modify-item">
      <p class="property">color: {{ styleList.color }}</p>
      <div class="value">
        <ColorPicker v-model="color" />
      </div>
    </div>
  </div>
</template>

<script>
import { useConfigOptionsTemp } from '@/stores/index'
import ColorPicker from '@/components/ColorPicker.vue'

export default {
  components: { ColorPicker },
  data() {
    return {
      configOption: useConfigOptionsTemp(),
      color: '#000',
    }
  },
  computed: {
    styleList() {
      return this.configOption.style
    },
    styleLimit() {
      return this.configOption.styleLimit
    },
  },
  methods: {
    modify(property, value) {
      this.configOption.modify(property, value)
    },
  },
}
</script>

<style lang="scss" scoped>
.modify-item {
  width: 100%;
  margin-top: 20px;

  display: flex;
  align-items: center;
  flex-wrap: wrap;

  .property {
    margin-bottom: 6px;
  }
  .value {
    width: 100%;
  }
  .ul-value {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    li {
      width: max-content;
      padding: 4px 8px;
      margin-top: 10px;
      margin-right: 16px;
      box-sizing: border-box;
      border: 1px solid #ddd;

      list-style: none;
      cursor: pointer;
      &:hover {
        color: #fff;
        background-color: skyblue;
      }
      &:active {
        filter: brightness(1.1);
      }
      &.active {
        color: #fff;
        background-color: skyblue;
        filter: brightness(1.04);
      }
    }
  }
}
</style>

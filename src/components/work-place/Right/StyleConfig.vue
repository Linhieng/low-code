<template>
  <div class="modify-style">
    <!-- range -->

    <div v-if="styleList.width" class="modify-item">
      <p class="property">width: {{ styleList.width }}</p>
      <input @input="modify('width', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.width)" :min="styleLimit.width.min" :max="styleLimit.width.max" />
    </div>

    <div v-if="styleList.height" class="modify-item">
      <p class="property">height: {{ styleList.height }}</p>
      <div class="key-option" :class="{ active: styleList.height === 'auto' }" @click="modify('height', 'auto')">auto</div>
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

    <div v-if="styleList.lineHeight" class="modify-item">
      <p class="property">line-height: {{ styleList.lineHeight }}</p>
      <input @input="modify('lineHeight', $event.currentTarget.value + 'px')" class="value" type="range" :value="Number.parseFloat(styleList.lineHeight)" :min="styleLimit.lineHeight.min" :max="styleLimit.lineHeight.max" />
    </div>

    <!-- 选项 -->

    <div v-if="styleList.textAlign" class="modify-item">
      <p class="property">text-align: {{ styleList.textAlign }}</p>
      <ul class="option-list">
        <button class="btn-option" v-for="(option, i) in styleLimit.textAlign.enumOptions" :key="i" :class="{ active: styleList.textAlign === option }" @click="modify('textAlign', option)">{{ option }}</button>
      </ul>
    </div>

    <div v-if="styleList.objectFit" class="modify-item">
      <p class="property">object-fit: {{ styleList.objectFit }}</p>
      <ul class="option-list">
        <button class="btn-option" v-for="(option, i) in styleLimit.objectFit.enumOptions" :key="i" :class="{ active: styleList.objectFit === option }" @click="modify('objectFit', option)">{{ option }}</button>
      </ul>
    </div>

    <div v-if="styleList.objectPosition" class="modify-item">
      <p class="property">object-position: {{ styleList.objectPosition }}</p>
      <ul class="option-list">
        <button class="btn-option" v-for="(option, i) in styleLimit.objectPosition.enumOptions" :key="i" :class="{ active: styleList.objectPosition === option }" @click="modify('objectPosition', option)">{{ option }}</button>
      </ul>
    </div>

    <!-- 颜色 -->

    <div v-if="styleList.color" class="modify-item">
      <p class="property">color: {{ styleList.color }}</p>
      <div class="value">
        <ColorPicker v-model="styleList.color" />
      </div>
    </div>
    <div v-if="styleList.backgroundColor" class="modify-item">
      <p class="property">background-color: {{ styleList.backgroundColor }}</p>
      <div class="value">
        <ColorPicker v-model="styleList.backgroundColor" />
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
      this.configOption.style[property] = value
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

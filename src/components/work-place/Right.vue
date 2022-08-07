<template>
  <div ref="right" id="right" v-show="this.configOptions.show">
    <h2>
      <p>配置</p>
      <button @click="close" title="关闭" class="options_close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-close_line"><path d="M13.414 12l6.293-6.293a.999.999 0 10-1.414-1.414L12 10.586 5.707 4.293a.997.997 0 00-1.414 0 .999.999 0 000 1.414L10.586 12l-6.293 6.293a.999.999 0 101.414 1.414L12 13.414l6.293 6.293a.997.997 0 001.414 0 .999.999 0 000-1.414L13.414 12z" fill-rule="evenodd"></path></svg>
      </button>
    </h2>
    <div class="tabs">
      <button @click="modifyType = STYLE_TYPE" :class="modifyType == STYLE_TYPE ? 'btn-active' : ''" class="modify_style">编辑样式</button>
      <button @click="modifyType = CONTENT_TYPE" :class="modifyType == CONTENT_TYPE ? 'btn-active' : ''" class="modify_options">编辑内容</button>
    </div>

    <div class="tabs-content">
      <StyleConfig v-show="modifyType === STYLE_TYPE" />
      <ContentConfig v-show="modifyType === CONTENT_TYPE" />
    </div>
    <div class="btn-save">
      <button class="save" @click="save" title="保存并修改">保存并修改</button>
      <button class="reset" @click="reset" title="全部重置">全部重置</button>
    </div>
  </div>
</template>

<script>
import { useWorkPlaceRefs, useConfigOptionsTemp } from '@/stores/index'
import StyleConfig from './Right/StyleConfig.vue'
import ContentConfig from './Right/ContentConfig.vue'

// 因为只会在该组件中使用, 所以直接在这里定义常量
const STYLE_TYPE = 0
const CONTENT_TYPE = 1

export default {
  components: { StyleConfig, ContentConfig },
  data() {
    return {
      workPlaceRefs: useWorkPlaceRefs(),
      configOptions: useConfigOptionsTemp(),
      STYLE_TYPE,
      CONTENT_TYPE,
      modifyType: STYLE_TYPE,
    }
  },
  methods: {
    close() {
      const right = this.$refs.right
      right.classList.add('close-animation')
      right.onanimationend = () => {
        right.classList.remove('close-animation')
        this.configOptions.close()
        right.onanimationend = null
      }
    },
    save() {
      this.configOptions.save()
      this.$msg('已保存', 'success')
    },
    reset() {
      this.configOptions.reset()
    },
  },
  mounted() {
    this.workPlaceRefs.addRight(this.$refs.right)
  },
}
</script>

<style lang="scss">
// 将 #right 拆出来, 是因为 #right 的样式设置不在这里
#right.close-animation {
  @include hidden-right;
}

#right h2 {
  height: 86px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

#right .tabs {
  border-bottom: 1px solid #eee;
  button {
    width: 100px;
    height: 40px;

    font-size: 16px;
    background-color: #fffff9;
    border: none;
    outline: none;
    cursor: pointer;
    opacity: 0.8;
    &:hover {
      opacity: 1;
    }
  }
  button.btn-active {
    color: #fff;
    background: skyblue;
    filter: brightness(1.01);
  }
}

#right .tabs-content {
  $padding-left: 4px;
  height: calc(100% - 230px);
  padding-right: $padding-left;
  margin-top: 20px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: $padding-left;
    height: $padding-left;
  }
  &::-webkit-scrollbar-thumb {
    background-color: transparent;
    box-shadow: inset 0 0 $padding-left $padding-left skyblue;
  }
}

#right .btn-save {
  margin-top: 20px;
  button {
    width: 100px;
    height: 36px;
    margin: 0 10px;
    cursor: pointer;
    outline: none;
  }
  .save {
    box-sizing: border-box;
    background-color: skyblue;
    color: #fff;
    &:hover {
      filter: brightness(1.04);
    }
    &:active {
      filter: brightness(0.96);
    }
  }
  .reset {
    border: 1px solid #d1d11d;
    border-radius: 4px;
    background-color: #fff;
    color: #000;
    &:hover {
      filter: brightness(1.04);
    }
    &:active {
      filter: brightness(0.96);
    }
  }
}
</style>

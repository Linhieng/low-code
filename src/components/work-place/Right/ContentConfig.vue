<template>
  <div class="modify-config">
    <div v-if="configList.hasOwnProperty('innerText')" class="modify-item">
      <div class="property">innerText（按钮文字）</div>
      <div class="value-input">
        <TextArea v-model="configList.innerText" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('title')" class="modify-item">
      <div class="property">title（按钮描述）</div>
      <div class="value-input">
        <TextArea v-model="configList.title" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('alt')" class="modify-item">
      <div class="property">alt（图片描述）</div>
      <div class="value-input">
        <TextArea v-model="configList.alt" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('muted')" class="modify-item">
      <div class="property">静音</div>
      <div class="value-select">
        <button class="btn-option" :class="{ active: configList.muted === true }" @click="modify('muted', true)">true</button>
        <button class="btn-option" :class="{ active: configList.muted === false }" @click="modify('muted', false)">false</button>
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('videoSrc')" class="modify-item">
      <div class="property">
        <span>上传视频</span>
        <div class="preview-box">
          <video class="litter-preview" :src="configList.videoSrc">错误</video>
        </div>
      </div>
      <div class="value-input">
        <UpdateVideo v-model="configList.videoSrc" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('poster')" class="modify-item">
      <div class="property">
        <span>上传封面</span>
        <div class="preview-box">
          <img class="litter-preview" :src="configList.poster" alt="封面" />
        </div>
      </div>
      <div class="value-input">
        <UpdateImage v-model="configList.poster" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('src')" class="modify-item">
      <div class="property">
        <span>上传图片</span>
        <div class="preview-box">
          <img class="litter-preview" :src="configList.src" alt="封面" />
        </div>
      </div>
      <div class="value-input">
        <UpdateImage v-model="configList.src" />
      </div>
    </div>
  </div>
</template>

<script>
import { useConfigOptionsTemp } from '@/stores/index'
import TextArea from '@/components/TextArea.vue'
import UpdateImage from '@/components/UpdateImage.vue'
import UpdateVideo from '@/components/UpdateVideo.vue'

export default {
  components: { TextArea, UpdateImage, UpdateVideo },
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
      this.configOption.config[property] = value
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
    display: flex;
    align-items: center;

    .preview-box {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-left: 20px;

      .litter-preview {
        width: 40px;
        height: 40px;
        object-fit: contain;
        box-shadow: 0 0 5px 0 #aaa;
        border-radius: 1px;
        transition: 0.3s;
        position: absolute;
        &:hover {
          transform: scale(8);
          z-index: 5;
        }
      }
    }
    // .litter-preview {
    //   width: 40px;
    //   height: 40px;
    //   object-fit: contain;
    //   margin-left: 200px;

    //   box-shadow: 0 0 5px 0 #aaa;
    //   border-radius: 1px;
    //   position: relative;
    //   z-index: 2;

    //   transform-origin: right;
    //   transition: 0.3s;

    //   &:hover {
    //     transform: scale(8);
    //   }
    // }
  }
  .value-input {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
  }
  .value-select {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    .btn-option {
      width: 100px;
      height: 40px;
    }
  }
}
</style>

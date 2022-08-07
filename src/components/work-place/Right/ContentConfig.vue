<template>
  <div class="modify-config">
    <div v-if="configList.hasOwnProperty('innerText')" class="modify-item">
      <p class="property">innerText（按钮描述）</p>
      <div class="value-input">
        <TextArea v-model="configList.innerText" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('muted')" class="modify-item">
      <p class="property">静音</p>
      <div class="value-select">
        <button class="btn-option" :class="{ active: configList.muted === true }" @click="modify('muted', true)">true</button>
        <button class="btn-option" :class="{ active: configList.muted === false }" @click="modify('muted', false)">false</button>
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('videoSrc')" class="modify-item">
      <p class="property">上传视频</p>
      <div class="value-input">
        <UpdateVideo v-model="configList.videoSrc" />
        <video class="litter-img" :src="configList.videoSrc">错误</video>
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('poster')" class="modify-item">
      <p class="property">上传封面</p>
      <div class="value-input">
        <UpdateImage v-model="configList.poster" />
        <img class="litter-img" :src="configList.poster" alt="封面" />
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
  }
  .value-input {
    width: 100%;
    display: flex;

    .litter-img {
      width: 40px;
      height: 40px;
      object-fit: contain;
      margin-left: 200px;
      transition: 0.3s;
      box-shadow: 0 0 5px 0 #aaa;
      border-radius: 1px;
      &:hover {
        transform: scale(8);
      }
    }
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

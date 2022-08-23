<template>
  <div class="modify-config">
    <!-- 输入文本 -->
    <div v-if="configList.hasOwnProperty('innerText')" class="modify-item">
      <div class="property">innerText（文本内容）</div>
      <div class="value-input">
        <TextArea :modelValue="configList.innerText" @update:modelValue="modify('innerText', $event)" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('title')" class="modify-item">
      <div class="property">title（按钮描述）</div>
      <div class="value-input">
        <TextArea :modelValue="configList.title" @update:modelValue="modify('title', $event)" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('alt')" class="modify-item">
      <div class="property">alt（图片描述）</div>
      <div class="value-input">
        <TextArea :placeholder="'输入图片描述'" :modelValue="configList.alt" @update:modelValue="modify('alt', $event)" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('href')" class="modify-item">
      <p class="property">href（跳转链接）</p>
      <div class="value-input">
        <TextArea :placeholder="'请输入合法的网页链接, 如 https://example.com'"  :modelValue="configList.href" :rows="2" @update:modelValue="modify('href', $event)" @change="check('href', $event)" />
      </div>
    </div>

    <div v-if="configList.hasOwnProperty('videoSrc')" class="modify-item">
      <div class="property">
        <span>上传视频</span>
        <div class="preview-box">
          <video class="litter-preview" :src="configList.videoSrc" muted autoplay>错误</video>
        </div>
      </div>
      <div class="value-input">
        <UpdateFile :type="'video'" :typeValue="'视频'" :modelValue="configList.videoSrc" @update:modelValue="modify('videoSrc', $event)" />
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
        <UpdateFile :type="'image'" :typeValue="'封面'" :modelValue="configList.poster" @update:modelValue="modify('poster', $event)" />
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
        <UpdateFile :type="'image'" :typeValue="'图片'" :modelValue="configList.src" @update:modelValue="modify('src', $event)" />
      </div>
    </div>

  </div>
</template>

<script>
import { useDataCacheConfig } from '@/stores/index'
import TextArea from '@/components/TextArea.vue'
import UpdateFile from '@/components/UpdateFile.vue'

export default {
  components: { TextArea, UpdateFile },
  data() {
    return {
      configOption: useDataCacheConfig(),
    }
  },
  computed: {
    configList() {
      return this.configOption.config
    },
  },
  methods: {
    modify(property, value) {
      this.configOption.modifyConfig(property, value)
    },
    check(property, value) {
      if (property === 'href') {
        const href = value.trim()
        const reg = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/
        if (value !== '' && !reg.test(href)) {
          this.$msg('链接不合法', 'error')
          this.configOption.modifyConfig('href', '')
        }
      }

    }
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
    justify-content: space-between;

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
        transform-origin: right;
        &:hover {
          transform: scale(8);
          z-index: 5;
          background-color: #fff;
        }
      }
    }
  }
  .value-input {
    width: 100%;
    min-height: 50px;
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

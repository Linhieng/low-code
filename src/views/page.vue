<template>
  <div id="public-draw" ref="drawWrapper">
    <template v-for="ele in drawData.elementArr" :key="ele.id">
      <div class="component-item" v-if="ele.type === ELEMENT_TEXT" :style="drawData.elementConfig[ele.id].style">{{drawData.elementConfig[ele.id].config.innerText}}</div>
      <div class="component-item" v-if="ele.type === ELEMENT_BUTTON" :style="drawData.elementConfig[ele.id].style">
        <button :title="drawData.elementConfig[ele.id].config.title">{{ drawData.elementConfig[ele.id].config.innerText }}</button>
      </div>
      <div class="component-item" v-if="ele.type === ELEMENT_IMAGE" :style="drawData.elementConfig[ele.id].style">
        <img :src="drawData.elementConfig[ele.id].config.src" :alt="drawData.elementConfig[ele.id].config.alt" :style="{ objectFit: drawData.elementConfig[ele.id].style.objectFit, objectPosition: drawData.elementConfig[ele.id].style.objectPosition }" />
      </div>
      <div class="component-item" v-if="ele.type === ELEMENT_LINK" :style="drawData.elementConfig[ele.id].style">
        <a :href="drawData.elementConfig[ele.id].config.href">{{ drawData.elementConfig[ele.id].config.innerText }}</a>
      </div>
      <div class="component-item" v-if="ele.type === ELEMENT_VIDEO" :style="drawData.elementConfig[ele.id].style">
        <video :poster="drawData.elementConfig[ele.id].config.poster" :src="drawData.elementConfig[ele.id].config.videoSrc" muted controls>错误</video>
      </div>
    </template>
  </div>
</template>

<script>
import getPage from "@/request/get-page";
import getAllPages from "@/request/get-all-pages";
import {
  ELEMENT_TEXT,
  ELEMENT_BUTTON,
  ELEMENT_IMAGE,
  ELEMENT_LINK,
  ELEMENT_VIDEO,
} from "@/constants/index";

export default {
  data() {
    return {
      drawData: {},
      ELEMENT_TEXT,
      ELEMENT_BUTTON,
      ELEMENT_IMAGE,
      ELEMENT_LINK,
      ELEMENT_VIDEO,
    };
  },
  async mounted() {
    try {
      console.log("debugger: ", await getAllPages());
      const data = await getPage();
      console.log("debugger: ", data);
      this.drawData = JSON.parse(data.drawData);
    } catch (e) {
      console.error(e);
      this.$msg(e);
    }
  },
};
</script>


<style lang="scss" scoped>
#public-draw {
  width     : 1200px;
  height    : auto;
  min-height: 100vh;
  position  : absolute;
  top       : 0;
  left      : 50%;
  transform: translateX(-50%);
  z-index   : 1;
  background: #fff;
}
.component-item {
  position: absolute;
  box-shadow: 0 0 10px 0px #ddd;
}
button {
  width: 100%;
  height: 100%;
  color: inherit;
  font-size: inherit;
  line-height: inherit;
  background-color: transparent;
  cursor: pointer;
  &:hover {
    filter: brightness(1.1);
  }
  &:active {
    filter: brightness(0.9);
  }
}

video ,img {
  width: 100%;
  height: 100%;
}
a {
  font-size:inherit;
  text-align:inherit;
  color:inherit;
  line-height:inherit;
  background-color:inherit;
  text-decoration:inherit;
  &:hover {
    color: skyblue;
  }
}

</style>

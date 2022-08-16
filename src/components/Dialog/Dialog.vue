<template>
  <div class="wrap">
    <div class="container">
      <div class="title">{{ title }}</div>
      <div class="control">
        <button @click="clickClose">关闭</button>
      </div>
      <div class="content">
        <slot>
        </slot>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ['title', 'change'],
  methods: {
    clickClose() {
      this.change(false)
    }
  }
}

</script>

<style lang="scss" scoped>
.wrap {
  position: absolute;
  top: 0;
  left: 0;
  background: rgba(15, 15, 15, 0.5);
  width: 100%;
  height: 100%;
  z-index: 9998;
}
.container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  height: 80%;
  padding: 10px;
  background: white;
  overflow: auto;
  display: flex;
  flex-direction: column;
  z-index: 9999;
}
.content {
  flex: 1;
  padding: 10px;
  text-align: left;
}
.title {
  min-height: 30px;
  text-align: center;
}
.control {
  position: absolute;
  top: 10px;
  right: 10px;
}
</style>

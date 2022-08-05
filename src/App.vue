<template>
  <router-view></router-view>
</template>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  border: none;
}

input[type='range'] {
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

:root::-webkit-scrollbar {
  width: 14px;
  height: 14px;
}
:root::-webkit-scrollbar-thumb {
  background-color: transparent;
  box-shadow: inset 0 0 14px 14px skyblue;
}
</style>

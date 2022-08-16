<template>
  <div class="color-picker">
    <div :ref="btnBox" class="btn-box">
      <div class="btn">
        <svg v-show="show" t="1659799815661" class="show icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2564" width="200" height="200">
          <path d="M512 224c184.736 0 340 122.368 384 288-44 165.632-199.264 288-384 288S172 677.632 128 512c44-165.632 199.264-288 384-288z m0 64c-147.008 0-274.464 92.544-317.28 224 42.816 131.456 170.24 224 317.28 224 147.008 0 274.464-92.544 317.28-224-42.816-131.456-170.24-224-317.28-224z m0 64a160 160 0 1 1 0 320 160 160 0 0 1 0-320z m0 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z" p-id="2565"></path>
        </svg>
        <svg v-show="!show" t="1659799797479" class="hidden icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2410" width="200" height="200">
          <path d="M512 224c86.784 0 167.072 27.008 232.384 72.832l80.576-60.736 38.528 51.104-68.608 51.712A380.576 380.576 0 0 1 896 512c-44 165.632-199.264 288-384 288-86.784 0-167.072-27.008-232.384-72.832L199.04 787.904l-38.528-51.104 68.608-51.712A380.576 380.576 0 0 1 128 512c44-165.632 199.264-288 384-288z m144.512 219.2a160 160 0 0 1-250.432 188.704l-72.128 54.368A341.12 341.12 0 0 0 512 736c147.008 0 274.464-92.544 317.28-224-15.68-48.128-45.472-93.536-86.144-134.08l-86.624 65.28zM512 288c-147.008 0-274.464 92.544-317.28 224a317.504 317.504 0 0 0 86.144 134.08l86.624-65.28a160 160 0 0 1 250.432-188.704l72.128-54.368A341.12 341.12 0 0 0 512 288z m-53.024 304.032A96 96 0 0 0 608 512c0-7.552-2.016-20.672-4.448-28.928L458.976 592zM512 416a96 96 0 0 0-91.552 124.928l144.576-108.96A95.552 95.552 0 0 0 512 416z" p-id="2411"></path>
        </svg>
      </div>
      <p>{{ modelValue }}</p>
      <span class="color-preview" :style="bgColor"></span>
    </div>
    <div :ref="panel" v-show="show" class="panel">
      <div class="board" @mousedown="cursorDown">
        <canvas :ref="board" :id="board"></canvas>
        <span :ref="cursor" class="board__cursor"></span>
      </div>
      <div class="slider">
        <canvas :ref="slider" :id="slider"></canvas>
        <span :ref="bar" class="slider__bar" @mousedown="barDown"></span>
      </div>
      <div class="tran-slider">
        <canvas :ref="tranSlider" :id="tranSlider"></canvas>
        <span :ref="tranBar" class="slider__bar" @mousedown="tranBarDown"></span>
      </div>
      <div class="bottom-config">
        <span class="color-preview" :style="previewColor"></span>
        <div class="input-color">
          <input maxlength="8" @change="checkInput" v-model="inputColor" />
        </div>
        <div class="autoSubmit">
          <label for="color-picker-autoSubmit">自动提交</label>
          <input @change="autoSubmit = !autoSubmit" type="checkbox" id="color-picker-autoSubmit" :checked="autoSubmit" />
        </div>
        <button class="click-update" v-show="!autoSubmit" @click="submit">提交</button>
      </div>
    </div>
  </div>
</template>

<script>
import { isAinB, rgb2Hex } from '@/utils/index'

// NOTE: canvas 面板的 id、宽高是写死的, 因为基本不会改变. 为了方便修改 canvas 的 id, 所以 id 直接在这外面定义了, 这个不仅仅可作为 ID, 还会作为 ref
let nums = 0

function drawColorPickerBoard(id, rgb) {
  const width = 255
  const height = 180
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = width + 1
  canvas.height = height
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  const rx_part = (0xff - rgb[0]) / width
  const gx_part = (0xff - rgb[1]) / width
  const bx_part = (0xff - rgb[2]) / width
  const ax_part = (0xff - rgb[3]) / width

  for (let x = 0; x <= width; x++) {
    const gradient = ctx.createLinearGradient(0, 1, 0, height - 1)
    gradient.addColorStop(0, `rgb(${rgb[0] + rx_part * x}, ${rgb[1] + gx_part * x}, ${rgb[2] + bx_part * x},${rgb[3] + ax_part * x})`)
    gradient.addColorStop(1, 'black')
    ctx.fillStyle = gradient
    ctx.fillRect(width - x, 0, 1, height)
  }
}

function drawColorPickerSlider(id) {
  // 画布样式宽度 12, 高度 180, 画布实际宽度 13, 高度 1531
  const width = 12
  const height = 180
  const fullHeight = 1530 // 6 * 0xff
  const rate = 8.5 // rate = fullHeight / height = 8.5
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = width + 1
  canvas.height = fullHeight + 1
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'

  for (let h = 0, i = 1, j = 1, rgb = [255, 0, 0, 1]; h <= fullHeight; h++) {
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]},${rgb[3]})`
    ctx.fillRect(0, h, width + 1, 1)

    // 算法: 实现 F00 FF0 0F0 0FF 00F F0F F00 规律
    rgb[i] += j
    if (rgb[i] === 255 || rgb[i] === 0) {
      i = i - 1 < 0 ? 2 : i - 1
      j *= -1
    }
  }
}

function drawColorPickerTranSlider(id, color) {
  const width = 255
  const height = 12
  const fullHeight = 1530 // 6 * 0xff
  const rate = 8.5 // rate = fullHeight / height = 8.5
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')
  canvas.width = width + 1
  canvas.height = fullHeight + 1
  canvas.style.width = width + 'px'
  canvas.style.height = height + 'px'
  console.log('color', color)
  for (let h = 0, i = 1, j = 1, rgb = [255, 0, 0]; h <= fullHeight; h++) {
    var my_gradient = ctx.createLinearGradient(0, 0, 170, 0);
    my_gradient.addColorStop(0, "white");
    my_gradient.addColorStop(1, color);
    ctx.fillStyle = my_gradient;
    ctx.fillRect(0, h, width + 1, 1)

    // 算法: 实现 F00 FF0 0F0 0FF 00F F0F F00 规律
    rgb[i] += j
    if (rgb[i] === 255 || rgb[i] === 0) {
      i = i - 1 < 0 ? 2 : i - 1
      j *= -1
    }
  }
}


export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      board: 'canvas-id-board' + nums,
      slider: 'canvas-id-slider' + nums,
      cursor: 'canvas-board-cursor' + nums,
      bar: 'canvas-slider-bar' + nums,
      btnBox: 'color-picker-btnBox' + nums,
      panel: 'color-picker-panel' + nums,
      tranSlider: 'canvas-id-tranSlider' + nums,
      tranBar: 'canvas-tranSlider-bar' + nums,

      show: false,
      isCursorMouseDown: false,
      isBarMouseDown: false,
      isTranBarMouseDown: false,
      autoSubmit: true,
      colorHex: this.modelValue, // 这个颜色属性仅仅作用在该组件内。关闭自动提交时它和 this.modelValue 不相等
      inputColor: this.modelValue.substring(1), // 只允许修改数字, # 符号必须存在
    }
  },
  computed: {
    bgColor() {
      return {
        backgroundColor: this.modelValue,
      }
    },
    previewColor() {
      return {
        backgroundColor: this.colorHex,
      }
    },
  },
  methods: {
    checkInput() {
      if (!/^[0-9a-fA-F]{3}$/.test(this.inputColor) && !/^[0-9a-fA-F]{6}$/.test(this.inputColor)&& !/^[0-9a-fA-F]{8}$/.test(this.inputColor)) {
        this.updateColorHex()
      }
    },
    submit() {
      this.$emit('update:modelValue', this.colorHex)
    },
    updateColorHex(top, left) {
      const canvas = this.$refs[this.board]
      const y = top || Number.parseFloat(this.$refs[this.cursor].style.top)
      const x = left || Number.parseFloat(this.$refs[this.cursor].style.left)
      const rgba = [...canvas.getContext('2d').getImageData(x, y, 1, 1).data]
      this.colorHex = rgb2Hex(rgba)
      this.inputColor = this.colorHex.substring(1)
      drawColorPickerTranSlider(this.tranSlider, this.colorHex)
    },
    updateTranColorHex(left) {
     /*  00-FF
      只需要替换后两位即可 */
      const canvas = this.$refs[this.tranSlider]
      const rgba = [...canvas.getContext('2d').getImageData(255, 255, 1, 1).data]
      console.log(rgba)
      console.log(rgba[3])
      rgba[3] = left
      console.log(rgba)
      this.colorHex = rgb2Hex(rgba)
      this.inputColor = this.colorHex.substring(1)
    },
    updateCursorPosition(clientX, clientY) {
      const canvasStyle = this.$refs[this.board].getBoundingClientRect()
      const canvasTop = canvasStyle.top
      const canvasLeft = canvasStyle.left
      const canvasHeight = canvasStyle.height
      const canvasWidth = canvasStyle.width
      const cursorElement = this.$refs[this.cursor]
      let top = clientY - canvasTop
      let left = clientX - canvasLeft
      if (top <= 0) top = 0
      if (top >= canvasHeight) top = canvasHeight
      if (left <= 0) left = 0
      if (left >= canvasWidth) left = canvasWidth

      cursorElement.style.top = top + 'px'
      cursorElement.style.left = left + 'px'
      this.updateColorHex(top, left)
    },
    updateBarPosition(clientY) {
      const canvas = this.$refs[this.slider]
      const canvasStyle = canvas.getBoundingClientRect()
      const canvasTop = canvasStyle.top
      const canvasHeight = canvasStyle.height
      const barElement = this.$refs[this.bar]
      let top = clientY - canvasTop
      if (top <= 0) top = 0
      if (top >= canvasHeight) top = canvasHeight

      barElement.style.top = top + 'px'
      drawColorPickerBoard(this.board, [...canvas.getContext('2d').getImageData(1, top * 8.5, 1, 1).data])
      this.updateColorHex()
    },
    updateTranBarPosition(clientX) {
      const canvas = this.$refs[this.tranSlider]
      const canvasStyle = canvas.getBoundingClientRect()
      const canvasLeft = canvasStyle.left
      const canvasWidth = canvasStyle.width
      const barElement = this.$refs[this.tranBar]
      let left = clientX - canvasLeft
      if (left <= 0) left = 0
      if (left >= canvasWidth) left = canvasWidth

      barElement.style.left = left + 'px'
      this.updateTranColorHex(left)
    },
    barDown() {
      this.isBarMouseDown = true
    },
    tranBarDown() {
      this.isTranBarMouseDown = true
    },
    cursorDown(e) {
      this.updateCursorPosition(e.clientX, e.clientY)
      this.isCursorMouseDown = true
    },
  },
  watch: {
    inputColor() {
      this.colorHex = '#' + this.inputColor
      if (this.autoSubmit) this.submit()
    },
  },
  beforeCreate() {
    nums++
  },
  mounted() {
    drawColorPickerBoard(this.board, [255, 0, 0, 1])
    drawColorPickerSlider(this.slider)
    drawColorPickerTranSlider(this.tranSlider, this.colorHex)
    this.$refs[this.cursor].style.top = '100px'
    this.$refs[this.cursor].style.left = '100px'
    this.$refs[this.bar].style.top = '0'
    this.$refs[this.tranBar].style.right = '-80px'

    document.addEventListener('mousemove', ({ clientX, clientY }) => {
      if (this.isCursorMouseDown) this.updateCursorPosition(clientX, clientY)
      if (this.isBarMouseDown) this.updateBarPosition(clientY)
      if (this.isTranBarMouseDown) this.updateTranBarPosition(clientX)
    })
    document.addEventListener('mouseup', e => {
      if (isAinB(e.target, this.$refs[this.btnBox])) {
        this.show = !this.show
      } else if (isAinB(e.target, this.$refs[this.panel])) {
        this.show = true
      } else if (!this.isCursorMouseDown && !this.isBarMouseDown && !this.isTranBarMouseDown) {
        this.show = false
      }
      this.isCursorMouseDown = false
      this.isBarMouseDown = false
      this.isTranBarMouseDown = false
    })
  },
}
</script>

<style lang="scss" scoped>
* {
  user-select: none;
}
.color-picker {
  position: relative;
  width: 160px;
  height: 40px;
  margin: 10px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;

  // 有两个
  .color-preview {
    display: block;
    width: 20px;
    height: 20px;
    border-radius: 4px;
    box-shadow: 0 0 4px 0 #ccc;
  }
  .btn-box {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: space-evenly;
    align-items: center;

    cursor: pointer;
    p {
      width: 80px;
      text-align: center;
      font-size: 18px;
      margin-right: 10px;
      color: #000;
    }
    .btn {
      position: relative;
      width: 34px;
      height: 34px;
      svg {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }
    }
    &:hover .btn svg {
      fill: skyblue;
    }
  }

  .panel {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);

    width: 320px;
    height: 260px;

    background-color: #fff;
    border: 1px solid #dcdfe6;
    border-radius: 5px;
    box-shadow: 0 0 8px 0 #d1d1d1;

    .board {
      width: 280px;
      height: 180px;
      position: absolute;
      top: 10px;
      left: 10px;
      .board__cursor {
        position: absolute;
        top: 40px;
        left: 40px;

        display: block;
        width: 4px;
        height: 4px;
        margin-top: -4px;
        margin-left: -4px;
        border: 2px solid #fff;
        box-shadow: inset 0 0 2px#000;
        border-radius: 100%;
      }
    }
    .slider {
      width: 12px;
      height: 180px;
      position: absolute;
      top: 10px;
      right: 10px;
      .slider__bar {
        position: absolute;
        top: 0px;
        left: -2px;

        display: block;
        width: 16px;
        height: 4px;
        margin-top: -3px;
        border: 1px solid #aaa;
        background-color: #fff;
        box-shadow: 0 0 4px #999;

        cursor: pointer;
      }
    }
    .tran-slider {
      width: 180px;
      height: 12px;
      position: absolute;
      bottom: 54px;
      left: 10px;

      .slider__bar {
        position: absolute;
        bottom: -6px;

        display: block;
        width: 4px;
        height: 16px;
        margin-top: 1px;
        border: 1px solid #aaa;
        background-color: #fff;
        box-shadow: 0 0 4px #999;

        cursor: pointer;
      }
    }
    .bottom-config {
      font-size: 15px;
      .color-preview {
        position: absolute;
        bottom: 15px;
        left: 10px;
      }
      .input-color {
        position: absolute;
        bottom: 10px;
        left: 40px;

        width: 90px;
        height: 30px;

        display: flex;
        justify-content: center;
        align-items: center;
        border: 1px solid #d1d1d1;
        background-color: #fff;

        input {
          max-width: 60px;
          font-size: inherit;
          text-align: left;
          padding-left: 2px;
          box-sizing: border-box;
          outline: none;
        }
        &::before {
          content: "#";
        }
      }
      .autoSubmit {
        position: absolute;
        left: 140px;
        bottom: 10px;
        width: 100px;
        height: 30px;

        border: 1px solid #d1d1d1;

        cursor: pointer;
        label {
          width: 100px;
          height: 30px;
          padding-left: 8px;
          box-sizing: border-box;
          position: absolute;
          line-height: 30px;
          text-align: start;
          font-size: inherit;
          cursor: inherit;
        }
        input {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 14px;
          height: 14px;
          cursor: inherit;
        }
      }
      .click-update {
        position: absolute;
        bottom: 12px;
        right: 10px;
        width: 60px;
        height: 30px;

        color: #fff;
        font-size: inherit;
        background-color: #409eff;
        box-shadow: -1px 0 4px 0 #ccc;
        border-radius: 4px;
        cursor: pointer;
      }
    }
  }
}
</style>

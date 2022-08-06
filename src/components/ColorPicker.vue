<template>
  <div class="color-picker" @click.stop>
    <div @click="show = !show" class="btn-box">
      <div class="btn">
        <svg v-show="show" t="1659799815661" class="show icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2564" width="200" height="200"><path d="M512 224c184.736 0 340 122.368 384 288-44 165.632-199.264 288-384 288S172 677.632 128 512c44-165.632 199.264-288 384-288z m0 64c-147.008 0-274.464 92.544-317.28 224 42.816 131.456 170.24 224 317.28 224 147.008 0 274.464-92.544 317.28-224-42.816-131.456-170.24-224-317.28-224z m0 64a160 160 0 1 1 0 320 160 160 0 0 1 0-320z m0 64a96 96 0 1 0 0 192 96 96 0 0 0 0-192z" p-id="2565"></path></svg>
        <svg v-show="!show" t="1659799797479" class="hidden icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2410" width="200" height="200"><path d="M512 224c86.784 0 167.072 27.008 232.384 72.832l80.576-60.736 38.528 51.104-68.608 51.712A380.576 380.576 0 0 1 896 512c-44 165.632-199.264 288-384 288-86.784 0-167.072-27.008-232.384-72.832L199.04 787.904l-38.528-51.104 68.608-51.712A380.576 380.576 0 0 1 128 512c44-165.632 199.264-288 384-288z m144.512 219.2a160 160 0 0 1-250.432 188.704l-72.128 54.368A341.12 341.12 0 0 0 512 736c147.008 0 274.464-92.544 317.28-224-15.68-48.128-45.472-93.536-86.144-134.08l-86.624 65.28zM512 288c-147.008 0-274.464 92.544-317.28 224a317.504 317.504 0 0 0 86.144 134.08l86.624-65.28a160 160 0 0 1 250.432-188.704l72.128-54.368A341.12 341.12 0 0 0 512 288z m-53.024 304.032A96 96 0 0 0 608 512c0-7.552-2.016-20.672-4.448-28.928L458.976 592zM512 416a96 96 0 0 0-91.552 124.928l144.576-108.96A95.552 95.552 0 0 0 512 416z" p-id="2411"></path></svg>
      </div>
      <p>{{ modelValue }}</p>
      <span class="color-preview" :style="bgColor"></span>
    </div>
    <div v-show="show" @click.stop class="panel">
      <div class="board" @mousedown="cursorDown">
        <canvas ref="board" id="color-picker-board"></canvas>
        <span ref="cursor" class="board__cursor"></span>
      </div>
      <div class="slider">
        <canvas ref="slider" id="color-picker-slider"></canvas>
        <span class="slider__bar" @mousedown="barDown"></span>
      </div>
      <div class="bottom-config">
        <span class="color-preview" :style="previewColor"></span>
        <input class="input-color" v-model="colorHex" />
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
import { rgb2Hex } from '@/utils/index'

function drawColorPickerBoard(id, rgb, width, height) {
  const rateX = 1
  const rateY = 1
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = width + 1
  canvas.height = height
  canvas.style.width = width / rateX + 'px'
  canvas.style.height = height / rateY + 'px'

  // 渲染顺序为 上到下, 右到左。
  const rx_part = (0xff - rgb[0]) / width
  const gx_part = (0xff - rgb[1]) / width
  const bx_part = (0xff - rgb[2]) / width
  for (let x = 0; x <= width; x++) {
    const rx = rgb[0] + rx_part * x
    const gx = rgb[1] + gx_part * x
    const bx = rgb[2] + bx_part * x
    const ry_part = rx / height
    const gy_part = gx / height
    const by_part = bx / height
    for (let y = 0; y < height; y++) {
      ctx.fillStyle = `rgb(${rx - ry_part * y}, ${gx - gy_part * y}, ${bx - by_part * y})`
      ctx.fillRect(width - x, y, 1, 1)
    }
  }

  canvas.addEventListener('click', ({ offsetX, offsetY }) => {
    console.log('debugger: ', offsetX * rateX, offsetY * rateY)
    console.log([...ctx.getImageData(offsetX * rateX, offsetY * rateY, 1, 1).data])
  })
}

function drawColorPickerSlider(id, width, h) {
  const height = 1530 // 6 * 0xff
  const rate = 1530 / h // 8.5
  const canvas = document.getElementById(id)
  const ctx = canvas.getContext('2d')

  canvas.width = width + 1 // 这里和下面的 fillRect 中的 101, 如果没有 1, getImageData(100, 0, 1, 1) 会获取到 [0,0,0,0]
  canvas.height = height + 1 // 这里如果不加 1, getImageData(0, 1530, 1, 1) 会获取到 [0,0,0,0]
  canvas.style.width = width + 'px'
  canvas.style.height = height / rate + 'px'

  for (let a = 0, i = 1, j = 1, rgb = [255, 0, 0]; a <= 6 * 0xff; a++) {
    ctx.fillStyle = `rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`
    ctx.fillRect(0, a, width + 1, 1)

    rgb[i] += j
    if (rgb[i] === 255 || rgb[i] === 0) {
      i = i - 1 < 0 ? 2 : i - 1
      j *= -1
    }
  }

  // canvas.addEventListener('click', ({ offsetX, offsetY }) => {
  //   console.log('debugger: ', offsetX, offsetY * rate)
  //   console.log([...ctx.getImageData(offsetX, offsetY * rate, 1, 1).data])
  // })
}

export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      show: false,
      colorHex: this.modelValue,
      autoSubmit: true,
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
    submit() {
      this.$emit('update:modelValue', this.colorHex)
    },
    update() {
      const canvas = this.$refs.board
      const cursor = this.$refs.cursor
      const y = Number.parseFloat(cursor.style.top)
      const x = Number.parseFloat(cursor.style.left)
      const rgba = [...canvas.getContext('2d').getImageData(x, y, 1, 1).data]
      this.colorHex = rgb2Hex(rgba)
      if (this.autoSubmit) this.submit()
    },
    barDown(e1) {
      const canvas = this.$refs.slider
      const target = e1.currentTarget
      const pStyle = target.parentElement.getBoundingClientRect()
      const pTop = pStyle.top
      const pHeight = pStyle.height
      document.onmousemove = e2 => {
        let t = e2.clientY - pTop
        if (t <= 0) t = 0
        if (t >= pHeight) t = pHeight
        target.style.top = t + 'px'
        // NOTE: 效率特别特别差！！！
        // TODO: 待修复
        drawColorPickerBoard('color-picker-board', [...canvas.getContext('2d').getImageData(1, t * 8.5, 1, 1).data], 280, 180)
        this.update()

        document.onmouseup = () => {
          document.onmousemove = null
        }
      }
    },
    cursorDown(e1) {
      const cursor = this.$refs.cursor
      const target = e1.target
      const pStyle = target.getBoundingClientRect()
      const pTop = pStyle.top
      const pLeft = pStyle.left
      const pHeight = pStyle.height
      const pWidth = pStyle.width
      let t = e1.clientY - pTop
      let l = e1.clientX - pLeft
      if (t <= 0) t = 0
      if (l <= 0) l = 0
      if (t >= pHeight) t = pHeight
      if (l >= pWidth) l = pWidth
      cursor.style.top = t + 'px'
      cursor.style.left = l + 'px'
      this.update(l, t)

      document.onmousemove = e2 => {
        let t = e2.clientY - pTop
        let l = e2.clientX - pLeft
        if (t <= 0) t = 0
        if (l <= 0) l = 0
        if (t >= pHeight) t = pHeight
        if (l >= pWidth) l = pWidth
        cursor.style.top = t + 'px'
        cursor.style.left = l + 'px'
        this.update(l, t)
      }
    },
  },
  mounted() {
    drawColorPickerBoard('color-picker-board', [255, 0, 0], 280, 180)
    drawColorPickerSlider('color-picker-slider', 12, 180)
    document.addEventListener('mouseup', () => {
      document.onmousemove = null
    })
    document.addEventListener('click', () => {
      this.show = false
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
  }

  .panel {
    position: absolute;
    bottom: 110%;
    left: 50%;
    transform: translateX(-50%);

    width: 320px;
    height: 240px;

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
        top: 10px;
        left: -3px;

        display: block;
        width: 16px;
        height: 4px;
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
        line-height: 30px;
        font-size: inherit;
        text-align: center;

        background-color: #fff;
        border: 1px solid #d1d1d1;
        outline: none;
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

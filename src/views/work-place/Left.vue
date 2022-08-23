<template>
  <div ref="left" id="left" :class="open ? '' : 'close'">
    <h2 @mousedown="isDownLeft = true" >组件添加栏</h2>
    <div class="btn_toggle"  @click="open = !open">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="coral-icon coral-icon-arrow_left_line"><path d="M15.994 21a1 1 0 01-.708-.293L7.292 12.7a.999.999 0 01.001-1.413l7.994-7.994a.999.999 0 111.414 1.414l-7.287 7.287 7.288 7.299A1.001 1.001 0 0115.994 21" fill-rule="evenodd"></path></svg>
    </div>
    <div class="btn-wrapper">
      <div class="btn-item" v-for="(elementType, i) in ELEMENT_TYPES" :key="i" :id="elementType.id" :data-type="elementType.value" @pointerdown="pointerdown(elementType.value)">{{ elementType.description }}</div>
    </div>
  </div>
</template>

<script>
import { ELEMENT_TYPES } from '@/constants/index'
import { useWorkPlaceRefs, useDataCacheDragging } from '@/stores/index'

export default {
  data() {
    return {
      workPlaceRefs: useWorkPlaceRefs(),
      cacheDragging: useDataCacheDragging(),

      ELEMENT_TYPES,
      open: true,
      isDownLeft: false,
      leftX: 0,
      leftY: 0,
    }
  },
  methods: {
    pointerdown(type) {
      this.cacheDragging.pointerdownLeft(type)
    },
  },
  mounted() {
    this.workPlaceRefs.addLeft(this.$refs.left)

    document.addEventListener('mousemove', e => {
      if (this.isDownLeft) {
        this.leftX += e.movementX / window.devicePixelRatio
        this.leftY += e.movementY / window.devicePixelRatio
        this.$refs.left.style.transform = `translate(${this.leftX}px, ${this.leftY}px)`
      }
    })

    document.addEventListener('mouseup', () => { this.isDownLeft = false })

  },
}
</script>

<style lang="scss" scoped>

#left.close {
  .btn_toggle svg {
    transform: rotate(-90deg);
  }
  .btn-wrapper{
    height: 0;
  }
}

.btn_toggle {
  position: absolute;
  top: 12px;
  right: 8px;

  width: 30px;
  height: 20px;
  display: grid;
  place-content: center;

  cursor: pointer;

  svg {
    width: 16px;
    height: 16px;
    vertical-align: middle;
    margin-top: -3px;
    fill: #999999;
    transform: rotate(90deg);
  }
  &:hover svg {
    fill: #0f6bff;
  }
}
h2 {
  user-select: none;
  margin-left: 12px;
  cursor: move;
}
.btn-wrapper {
  height: 500px;
  overflow: hidden;
  transition: .3s;

  .btn-item {
    display: flex;
    justify-content: center;
    align-items: center;

    margin: 20px auto;
    border: 1px solid #ccc;
    border-radius: 4px;

    color: #666;
    font-size: 14px;
    text-align: center;

    cursor: grab;
    &:active { cursor: grabbing; }
  }
}

/* === */

#btn-text {
    width : 150px;
    height: 40px;
}

#btn-button {
    width : 110px;
    height: 35px;
}

#btn-image {
    width : 80px;
    height: 80px;
}

#btn-link {
    width          : 120px;
    height         : 30px;
    text-decoration: underline;
}

#btn-video {
    width : 150px;
    height: 150px;
}
</style>

// src/stores/totalNum.js
import { defineStore } from 'pinia'

export default defineStore('totalNum', {
  state: () => ({ num: 0, actionTimes: 0 }),
  actions: {
    increment() {
      this.num++
      this.actionTimes++
    },
    decrement() {
      this.num--
      this.actionTimes++
    },
  },
})
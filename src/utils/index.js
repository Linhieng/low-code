// 生成防抖函数：接收一个函数，返回一个防抖函数
export function debounce(func, timeout = 300) {
  let timer
  return (...args) => {
    clearTimeout(timer)
    timer = setTimeout(() => {
      func.apply(this, args)
    }, timeout)
  }
}

function numTo16(num) {
  num = Number.parseInt(num)
  if (num === 0) return '00'
  if (num < 16) return '0' + num.toString(16).toUpperCase()
  return num.toString(16).toUpperCase()
}
export function rgb2Hex(rgb) {
  return '#' + numTo16(rgb[0]) + numTo16(rgb[1]) + numTo16(rgb[2])
}

export function isAinB(A, B) {
  // parentElement 是有 “尽头” 的, 所以直接判断 A
  while (!!A) {
    if (A == B) {
      return true
    }
    A = A.parentElement
  }
  return false
}

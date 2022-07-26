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
export function rgba2Hex(rgb) {
  return '#' + numTo16(rgb[0]) + numTo16(rgb[1]) + numTo16(rgb[2]) + numTo16(rgb[3])
}
export function rgb2Hex(rgb) {
  return '#' + numTo16(rgb[0]) + numTo16(rgb[1]) + numTo16(rgb[2])
}

// 判断 B 元素是否是 A 元素的 “父系”
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

// 当路径为 /page/id, i 为 1 获取到的就是 第二个参数 id
export function getPath(i = 1) {
  const pathName = window.location.pathname // 例如 /fill-in/123
  const path = pathName.split('/').filter(v => !!v) // 过滤空字符
  return path[i]
}
const CONTEXT_STYLE = ['letter-spacing', 'line-height', 'padding-top', 'padding-bottom', 'font-family', 'font-weight', 'font-size', 'text-rendering', 'text-transform', 'width', 'text-indent', 'padding-left', 'padding-right', 'border-width', 'box-sizing']

function calculateNodeStyling(targetElement) {
  const style = window.getComputedStyle(targetElement)

  const boxSizing = style.getPropertyValue('box-sizing')

  const paddingSize = Number.parseFloat(style.getPropertyValue('padding-bottom')) + Number.parseFloat(style.getPropertyValue('padding-top'))

  const borderSize = Number.parseFloat(style.getPropertyValue('border-bottom-width')) + Number.parseFloat(style.getPropertyValue('border-top-width'))

  const contextStyle = CONTEXT_STYLE.map(name => `${name}:${style.getPropertyValue(name)}`).join(';')

  return { contextStyle, paddingSize, borderSize, boxSizing }
}

export default function calcTextareaHeight(targetElement, minRows = 1, maxRows) {
  const isNumber = v => {
    // return /^[0-9]+$/.test(v)
    return typeof v === 'number'
  }

  const HIDDEN_STYLE = `
    height:0 !important;
    visibility:hidden !important;
    overflow:hidden !important;
    position:absolute !important;
    z-index:-1000 !important;
    top:0 !important;
    right:0 !important;
  `

  let hiddenTextarea = document.createElement('textarea')
  document.body.appendChild(hiddenTextarea)

  const { paddingSize, borderSize, boxSizing, contextStyle } = calculateNodeStyling(targetElement)

  hiddenTextarea.setAttribute('style', `${contextStyle};${HIDDEN_STYLE}`)
  hiddenTextarea.value = targetElement.value || targetElement.placeholder || ''

  let height = hiddenTextarea.scrollHeight
  const result = {} // as TextAreaHeight

  if (boxSizing === 'border-box') {
    height = height + borderSize
  } else if (boxSizing === 'content-box') {
    height = height - paddingSize
  }

  hiddenTextarea.value = ''
  const singleRowHeight = hiddenTextarea.scrollHeight - paddingSize

  if (isNumber(minRows)) {
    let minHeight = singleRowHeight * minRows
    if (boxSizing === 'border-box') {
      minHeight = minHeight + paddingSize + borderSize
    }
    height = Math.max(minHeight, height)
    result.minHeight = `${minHeight}px`
  }
  if (isNumber(maxRows)) {
    let maxHeight = singleRowHeight * maxRows
    if (boxSizing === 'border-box') {
      maxHeight = maxHeight + paddingSize + borderSize
    }
    height = Math.min(maxHeight, height)
  }
  result.height = `${height}px`
  hiddenTextarea.parentNode?.removeChild(hiddenTextarea)
  hiddenTextarea = undefined
  // console.log('debugger: ', height, singleRowHeight, parseInt(height / singleRowHeight))
  return { ...result, rows: parseInt(height / singleRowHeight) }
}
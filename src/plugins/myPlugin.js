function mitt(all) {
  all = all || new Map()
  return {
    all: all,
    on: function (type, handler) {
      let handlers = all.get(type)
      if (handlers) {
        handlers.push(handler)
      } else {
        all.set(type, [handler])
      }
    },
    off: function (type, handler) {
      let handlers = all.get(type)
      if (handlers) {
        if (handler) {
          handlers.splice(handlers.indexOf(handler) >>> 0, 1)
        } else {
          all.set(type, [])
        }
      }
    },
    emit: function (type, evt) {
      let handlers = all.get(type)
      if (handlers) {
        handlers.slice().map(function (handler) {
          handler(evt)
        })
      }
      handlers = all.get('*')
      if (handlers) {
        handlers.slice().map(function (handler) {
          handler(type, evt)
        })
      }
    },
  }
}
// type 有 center success error warning 可选, center 可以和另外三个搭配
function myMsg(msgInbox) {
  // TODO: 暂时没想到要用来干什么
  msgInbox = msgInbox || new Map()

  // 创建一个顶层元素, 原来放置消息框
  const myMsgElement = document.createElement('div')
  myMsgElement.id = 'my-msg'
  document.body.appendChild(myMsgElement)

  // 先放这里吧, 这些是类型名
  const types = ['success', 'error', 'warning']

  return (message, type) => {
    // 首先需要对参数进行合法性校验
    if (message === undefined) return
    if (types.indexOf(type) === -1) type = undefined

    // 创建一个消息框元素，并插入到上面创建的顶层元素中
    const msg = document.createElement('div')
    msg.innerHTML = `<p>${message}</p>`
    msg.classList.add('message')
    type && msg.classList.add(type)
    myMsgElement.appendChild(msg)

    setTimeout(() => {
      msg.classList.add('fadeOut')
      msg.addEventListener('animationend', () => {
        msg.parentNode?.removeChild(msg)
      })
    }, 2500)
  }
}

export default {
  install(app) {
    app.config.globalProperties.$mitt = mitt()
    app.config.globalProperties.$msg = myMsg()
  },
}

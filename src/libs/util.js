/**
 * 设置标题
 * @param {string} title 标题title
 */
export function setTitle(title) {
  window.document.title = title
}

let localData = {
  /**
   * 设置本地存储
   * @param {string} key 设置localStorage本地存储key
   * @param {string} value 设置localStorage本地存储value
   */
  setData(key, value) {
    window.localStorage.setItem(key, value)
  },
  /**
   * 获取本地存储
   * @param {string} key 获取本地存储的key
   * @returns {string} 返回获取的结果，如果为null，则返回''空字符串
   */
  getData(key) {
    let data = window.localStorage.getItem(key)

    return data ? data : null
  },
  /**
   * 删除本地存储
   * @param {string} key 移除本地存储
   */
  removeData(key) {
    window.localStorage.removeItem(key)
  },
  /**
   * 清除所有本地存储
   */
  clearAllData() {
    window.localStorage.clear()
  }
}

/*设置本地存储*/
export { localData }

let platForms = {
  ua: window.navigator.userAgent,
  /**
   * 判断是否是平台
   * @param {String} type 字符串
   * @returns {Boolean} true or false
   */
  is: function (type) {
    type = type.toLowerCase()
    return this.ua.toLowerCase().indexOf(type) >= 0
  },
  isMobile: function () {
    return !!this.ua.match(/(iPhone|iPod|Android|ios)/i)
  },
  isIOS: function () {
    return !!this.ua.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/) //ios终端
  },
  isIPad: function () {
    return this.is('ipad')
  },
  isiPhone: function () {
    return this.is('iPhone')
  },
  isAndroid: function () {
    return this.is('android') || this.is('Linux')
  },
  isWindowsPhone: function () {
    return this.is('Windows Phone')
  },
  isWx: function () {
    return this.is('micromessenger')
  },
  isApp: function () {
    return this.is('minivision')
  }
}

/*判断平台*/
export { platForms }

/**
 * 匹配对象
 * @param {*} options
 * @param {string} options.val 传递的校验值
 * @param {string} options.ignore 是否忽略校验值为空(是否为必填校验)
 * @param {string} options.checkReg 自定义校验类型
 * @returns {boolean} 返回检查的正确性 true | false
 */
export function check(options = {
  val: '',
  ignore: false,
  checkReg: null
}) {
  options.val = options.val.trim()
  if (options.val) {
    let reg = typeof options.checkReg == 'string' ? new RegExp(options.checkReg) : options.checkReg //定义匹配

    return reg ? reg.test(options.val) : true
  }
  return options.ignore
}
/**
 * 字符匹配
 * @param {*} search 搜索内容
 * @param {*} content 整体内容
 * @returns {Boolean} 返回匹配正确true | false
 */
export function stringSearch(search = '', content = '') {
  search = search.trim()
  if (search) {
    search = '[' + search.toLowerCase().split('').join('].*[') + ']'
    let reg = new RegExp(search)

    return reg.test(content)
  } else {
    return true
  }
}

/**
 * 获取随机整数
 * @param {int} min 最小值
 * @param {int} max 最大值
 * @returns {string} 返回范围内随机整数
 */
export function getRandomNum(min, max) {
  const range = max - min
  const rand = Math.random()

  return (min + Math.round(rand * range))
}

/**
 * 滚动透传处理
 * @param {string} bodyClass 滚动透传body class
 * @returns {Object} 返回方法Object
 */
export function maskOpenHelper(bodyClass = 'mask-open') {
  let scrollElement = document.scrollingElement || document.body

  let scrollTop

  return {
    afterOpen() {
      scrollTop = scrollElement.scrollTop
      document.body.classList.add(bodyClass)
      document.body.style.top = -scrollTop + 'px'
    },
    beforeClose() {
      document.body.classList.remove(bodyClass)
      scrollElement.scrollTop = scrollTop
    }
  }
}

/**
 * 将图片链接转换为 base64
 * @param {String} url 图片链接
 * @param {String} callback 转换成功后的回调
 * @param {String} outputFormat base64图片的格式
 */
export function convertImgToBase64(url, callback, outputFormat) {
  let canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  const img = new Image()

  img.crossOrigin = 'Anonymous'
  img.src = url
  img.onload = () => {
    canvas.height = img.height
    canvas.width = img.width
    ctx.drawImage(img, 0, 0)
    let dataURL = canvas.toDataURL(outputFormat || 'image/jpg')

    callback(dataURL)
    canvas = null
  }
}

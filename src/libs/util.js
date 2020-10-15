/**
 * 设置标题
 * @param {string} title 标题title
 */
export function setTitle(title) {
  window.document.title = title || 'YangChao'
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

let sessionData = {
  /**
   * 设置本地存储
   * @param {string} key 设置sessionStorage本地存储key
   * @param {string} value 设置sessionStorage本地存储value
   */
  setData(key, value) {
    window.sessionStorage.setItem(key, value)
  },
  /**
   * 获取本地存储
   * @param {string} key 获取本地存储的key
   * @returns {string} 返回获取的结果，如果为null，则返回''空字符串
   */
  getData(key) {
    let data = window.sessionStorage.getItem(key)

    return data ? data : null
  },
  /**
   * 删除本地存储
   * @param {string} key 移除本地存储
   */
  removeData(key) {
    window.sessionStorage.removeItem(key)
  },
  /**
   * 清除所有本地存储
   */
  clearAllData() {
    window.sessionStorage.clear()
  }
}

/*设置本地存储*/
export { localData, sessionData }

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
 * 时间格式化
 * @param {string} time 时间
 * @param {Boolean} isDate 是否是时间，默认false
 * @returns {String} 返回格式化的时间
 */
export function formatDate(time, isDate = false) {
  let date

  if (!time) {
    date = new Date()
  } else {
    date = new Date(time)
  }

  let addTime = function (v) {
    return v < 10 ? '0' + v : v
  }

  let year = date.getFullYear()

  let month = date.getMonth() + 1

  let day = date.getDate()

  if (isDate == true) {
    return year + '-' + addTime(month) + '-' + addTime(day)
  }
  let hour = date.getHours()

  let minute = date.getMinutes()

  let second = date.getSeconds()

  return year + '-' + addTime(month) + '-' + addTime(day) + ' ' + addTime(hour) + ':' + addTime(minute) + ':' + addTime(second)
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

/**
 * 将选择图片文件转成成url，可以实现图片在线预览
 * @param {String} file 图片链接
 * @param {Function} callback 转换成功后的回调
 */
export function imageFile2DataUrl(file, callback) {
  if (file && file.type.indexOf('image/') !== -1) {
    if (typeof FileReader === 'function') {
      let fileReader = new FileReader()

      fileReader.onload = (data) => {
        callback(data.target.result)
      }
      fileReader.readAsDataURL(file)
    }
  }
}

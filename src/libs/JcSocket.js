/**
 * 原生websocket
 */
export default class JcSocket {
  /**
   * 构造方法，进行初始化
   * @param {String} url socket 连接地址
   */
  constructor(url) {
    this.url = url
    this.lockReconnect = false
    this.reconnectTimes = 0
  }

  /**
   * 开始连接
   * @param {Function} callback
   */
  connect(callback) {
    this.callback = callback
    this.disconnect()

    try {
      console.log('JcSocket 开始连接......', this.url)
      this.ws = new WebSocket(this.url)

      this.ws.onopen = function (e) {
        console.log('JcSocket onopen......', e)
        this.reconnectTimes = 0
      }

      this.ws.onmessage = function (evt) {
        console.log('JcSocket onmessage......', evt)
        let data = evt.data

        if (data) {
          data = JSON.parse(data)
        }
        callback(data)
      }
      this.ws.onclose = (e) => {
        console.log('JcSocket onclose......', e)
        this.reconnect()
      }
      this.ws.onerror = (e) => {
        console.log('JcSocket onerror......', e)
        this.reconnect()
      }
    } catch (error) {
      console.log('JcSocket', error)
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.onclose = null
      this.ws.close()
      this.ws = null
    }
  }

  /**
   * 发送消息
   * @param {Objec} data 消息内容
   */
  send(data) {
    if (this.ws) {
      this.ws.send(data)
    }
  }

  /**
   * 重新连接
   */
  reconnect() {
    if (this.lockReconnect || this.reconnectTimes > 5) {
      console.log('JcSocket 重连锁定 或者 超过重连次数')
      return
    }
    this.lockReconnect = true
    setTimeout(() => {
      this.reconnectTimes++
      console.log(`JcSocket 第${this.reconnectTimes}次 重连......`)
      this.connect(this.callback)
      this.lockReconnect = false
    }, 3000)
  }
}

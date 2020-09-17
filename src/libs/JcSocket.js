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
      this.ws = new WebSocket(this.url)

      this.ws.onopen = function () {
        this.reconnectTimes = 0
      }

      this.ws.onmessage = function (evt) {
        let data = evt.data

        if (data) {
          data = JSON.parse(data)
        }
        callback(data)
      }
      this.ws.onclose = () => {
        console.log('JcSocket onclose......')
        this.reconnect()
      }
      this.ws.onerror = () => {
        console.log('JcSocket onerror......')
        this.reconnect()
      }
    } catch (error) {
      console.log(error)
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

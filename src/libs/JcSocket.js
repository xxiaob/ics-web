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
  }

  /**
   * 开始连接
   * @param {Function} callback
   */
  connect(callback) {
    this.disconnect()
    this.ws = new WebSocket(this.url)

    this.ws.onmessage = function (evt) {
      let data = evt.data

      if (data) {
        data = JSON.parse(data)
      }
      callback(data.resData)
    }
    this.ws.onclose = this.reconnect
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.ws) {
      this.ws.close()
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
    this.connect()
  }
}

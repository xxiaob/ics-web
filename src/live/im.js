import '../../static/jimsdk/jmessage-sdk-web.2.6.0.min.js'
import md5 from 'md5'

export class IM {
  constructor() {
    this.JIM = new JMessage({
      // debug: true
    })
    this.init()
  }
  //初始化
  init() {
    const secret = 'b8542135bfc2995812894d6a',
      appkey = 'f8409a2c88ceee289baaf57d',
      randomStr = 'dsadadwqeq213123edwqeq2131',
      timestamp = new Date().getTime(),
      signature = md5(`appkey=${appkey}&timestamp=${timestamp}&random_str=${randomStr}&key=${secret}`)

    this.JIM.init({
      appkey,
      random_str: randomStr,
      timestamp,
      signature
    }).onSuccess(data => {
      console.log('init success', data)
    }).onFail(data => {
      console.log('init error', data)
    })
  }

  register() {
    this.JIM.register({
      'username': 'lxy2',
      'password': '123456',
      'nickname': '李向玉'
    }).onSuccess(function (data) {
      console.log('register success', data)
    }).onFail(function (data) {
      console.log('register error', data)
    })
  }

  login() {
    this.JIM.login({
      'username': 'lxy2',
      'password': '123456'
    }).onSuccess(data => {
      console.log('login success', data)
      this.on()
    }).onFail(function (data) {
      console.log('error:' + JSON.stringify(data))
    }).onTimeout(function (data) {
      console.log('timeout:' + JSON.stringify(data))
    })
  }

  on() {
    this.JIM.onMsgReceive(data => {
      console.log('onMsgReceive 实时数据:', data)
    })

    this.JIM.onEventNotification(function (data) {
      console.log('event_receive: ' + JSON.stringify(data))
    })

    this.JIM.onSyncConversation(function (data) { //离线消息同步监听
      console.log(data)
    })

    this.JIM.onUserInfUpdate(function (data) {
      console.log('onUserInfUpdate : ' + JSON.stringify(data))
    })

    this.JIM.onSyncEvent(function (data) {
      console.log('onSyncEvent : ' + JSON.stringify(data))
    })

    this.JIM.onMsgReceiptChange(function (data) {
      console.log('onMsgReceiptChange : ' + JSON.stringify(data))
    })

    this.JIM.onSyncMsgReceipt(function (data) {
      console.log('onSyncMsgReceipt : ' + JSON.stringify(data))
    })

    this.JIM.onMutiUnreadMsgUpdate(function (data) {
      console.log('onConversationUpdate : ' + JSON.stringify(data))
    })

    this.JIM.onTransMsgRec(function (data) {
      console.log('onTransMsgRec : ' + JSON.stringify(data))
    })

    this.JIM.onRoomMsg(function (data) {
      console.log('onRoomMsg  : ' + JSON.stringify(data))
    })
  }

  sendSingleMsg() {
    this.JIM.sendSingleMsg({
      'target_username': 'lxx123',
      'content': '啦啦啦'
    }).onSuccess((data, msg) => {
      console.log('sendSingleMsg success data:', data)
      console.log('sendSingleMsg succes msg:', msg)
    }).onFail((data) => {
      console.log('sendSingleMsg error:', data)
    })
  }
}

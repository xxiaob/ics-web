import '../../static/jimsdk/jmessage-sdk-web.2.6.0.min.js'
// import md5 from 'md5'
import JMessage from 'JMessage'
export class IM {
  /**
   * @param {String} username 用户名
  */
  constructor(username) {
    this.username = username
    this.JIM = new JMessage({
      // debug: true
    })
  }

  /**
   * 初始化
   * @param {Object} authToken 用户名
   * @param {String} authToken.appkey
   * @param {String} authToken.random_str 随机数
   * @param {String} authToken.timestamp  时间戳
   * @param {String} authToken.signature  签名
  */
  init(authToken) {
    // const secret = 'b8542135bfc2995812894d6a',
    //   appkey = 'f8409a2c88ceee289baaf57d',
    //   randomStr = 'dsadadwqeq213123edwqeq2131',
    //   timestamp = new Date().getTime(),
    //   signature = md5(`appkey=${appkey}&timestamp=${timestamp}&random_str=${randomStr}&key=${secret}`)
    this.JIM.init({ ...authToken }).onSuccess(data => {
      console.log('init success', data)
      // this.on(cb)
      if (this.username) {
        this.login(this.username)
      }
    }).onFail(data => {
      console.log('init error', data)
    })
    // console.log(this.isInit())
    // if (this.isInit()) {
    //   console.log('已经初始化')
    // } else {

    // }
  }

  /**
   * 用户注册
   * @param {String} username 用户名 4-128
   * @param {String} nickname 昵称
  */
  register(username, nickname) {
    this.JIM.register({
      username,
      password: '123456',
      nickname
    }).onSuccess(data => {
      console.log('register success', data)
    }).onFail(data => {
      console.log('register error', data)
    })
  }

  /**
   * 用户登录
   * @param {String} username 用户名
  */
  login(username) {
    if (this.isLogin()) {
      console.log('用户已登录')
    } else {
      this.JIM.login({
        username,
        password: '123456'
      }).onSuccess(data => {
        console.log('login success 登录成功', data)
      }).onFail(data => {
        console.log('login error:', data)
      }).onTimeout(data => {
        console.log('login timeout:', data)
      })
    }
  }

  //退出登录
  loginOut() {
    this.JIM.loginOut()
  }

  //连接状态
  isConnect() {
    return this.JIM.isConnect()
  }

  //初始化状态
  isInit() {
    return this.JIM.isInit()
  }

  //登录状态
  isLogin() {
    return this.JIM.isLogin()
  }

  /**
   * 消息监听
   * @param {Function} cb 回调函数
  */
  on(cb) {
    //聊天消息实时监听
    this.JIM.onMsgReceive(data => {
      console.log('onMsgReceive 实时数据:', data)
      cb('onMsgReceive', data)
    })

    this.JIM.onEventNotification(data => {
      console.log('event_receive: ', data)
    })

    this.JIM.onSyncConversation(data => { //离线消息同步监听
      console.log('onSyncConversation', data)
    })

    this.JIM.onUserInfUpdate(data => {
      console.log('onUserInfUpdate : ', data)
    })

    this.JIM.onSyncEvent(data => {
      console.log('onSyncEvent : ', data)
    })

    this.JIM.onMsgReceiptChange(data => {
      console.log('onMsgReceiptChange : ', data)
    })

    this.JIM.onSyncMsgReceipt(data => {
      console.log('onSyncMsgReceipt : ', data)
    })

    this.JIM.onMutiUnreadMsgUpdate(data => {
      console.log('onConversationUpdate : ', data)
    })

    this.JIM.onTransMsgRec(data => {
      console.log('onTransMsgRec : ', data)
    })

    this.JIM.onRoomMsg(data => {
      console.log('onRoomMsg  : ', data)
    })
  }

  /**
   * 发送消息
   * @param {String} username 用户名
   * @param {Object} obj 消息体
   * @param {String} obj.msgType "0":正常,"1":邀请视频
   * @param {String} obj.channelId 房间id
   * @param {String} obj.content 消息内容
   * @param {String} obj.inviteType "0":正常,"1":强拉
   * @param {String} obj.mediaType "0":音频,"1":视频
   * 接收方  回复消息  agree  channelId
   * @param {String} obj.agree "0":拒绝邀请, "1":接受邀请
  */
  sendSingleMsg(username, obj) {
    this.JIM.sendSingleMsg({
      target_username: username,
      content: JSON.stringify(obj)
    }).onSuccess((data, msg) => {
      console.log('sendSingleMsg success data:', data)
      console.log('sendSingleMsg succes msg:', msg)
    }).onFail((data) => {
      console.log('sendSingleMsg error:', data)
    })
  }
}

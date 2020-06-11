import '../../static/jimsdk/jmessage-sdk-web.2.6.0.min.js'
import md5 from 'md5'
import JMessage from 'JMessage'
import { getImAuth } from '@/api/live'

export class IM {
  /**
   * @param {String} username 用户id
   * @param {String} nickname 用户昵称
   * @param {Boolean} debug
  */
  constructor(username, nickname, debug = true) {
    this.username = username
    this.nickname = nickname
    console.log(this.username, this.nickname)
    this.password = 'jcuser2020'
    this.debug = debug
    this.JIM = new JMessage({
      // debug: true
    })
    this.init()
  }

  /**
   * 初始化
   * @param {Object} authToken 用户名
   * @param {String} authToken.appkey
   * @param {String} authToken.random_str 随机数
   * @param {String} authToken.timestamp  时间戳
   * @param {String} authToken.signature  签名
  */
  async init() {
    const secret = 'a5ae26950b615d60056d50ab',
      appkey = 'e11ba843b514674bfe2fa130',
      randomStr = 'dsadadwqeq213123edwqeq2131',
      timestamp = new Date().getTime(),
      signature = md5(`appkey=${appkey}&timestamp=${timestamp}&random_str=${randomStr}&key=${secret}`)

    if (this.isInit()) {
      this.console('已经初始化')
    } else {
      // const authToken = await getImAuth()
      const authToken = { appkey, random_str: randomStr, timestamp, signature }

      this.JIM.init({ ...authToken }).onSuccess(data => {
        this.console('init success', data)
        this.login(this.username)
      }).onFail(data => {
        this.console('init error', data)
        this.init()
      })
    }
  }

  /**
   * 用户注册
   * @param {String} username 用户名 4-128
   * @param {String} nickname 昵称
  */
  register(username, nickname) {
    this.JIM.register({
      username,
      password: this.password,
      nickname
    }).onSuccess(data => {
      this.console('register success', data)
      this.login(this.username)
    }).onFail(data => {
      this.console('register error', data)
    })
  }

  /**
   * 用户登录
   * @param {String} username 用户名
  */
  login(username) {
    if (this.isLogin()) {
      this.console('用户已登录')
    } else {
      this.JIM.login({
        username,
        password: this.password
      }).onSuccess(data => {
        this.console('login success 登录成功', data)
      }).onFail(data => {
        this.console('login error 登录失败', data)
        this.register(this.username, this.nickname)
      }).onTimeout(data => {
        this.console('login timeout 登录超时', data)
        this.login(this.username)
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
      this.console('onMsgReceive 实时数据:', data)
      const { from_username: fromUsername, content: { msg_body: { text, extras } } } = data.messages[0]

      cb('onMsgReceive', { fromUsername, content: JSON.parse(text) })
    })

    this.JIM.onEventNotification(data => {
      this.console('event_receive: ', data)
    })

    this.JIM.onSyncConversation(data => { //离线消息同步监听
      this.console('onSyncConversation', data)
    })

    this.JIM.onUserInfUpdate(data => {
      this.console('onUserInfUpdate : ', data)
    })

    this.JIM.onSyncEvent(data => {
      this.console('onSyncEvent : ', data)
    })

    this.JIM.onMsgReceiptChange(data => {
      this.console('onMsgReceiptChange : ', data)
    })

    this.JIM.onSyncMsgReceipt(data => {
      this.console('onSyncMsgReceipt : ', data)
    })

    this.JIM.onMutiUnreadMsgUpdate(data => {
      this.console('onConversationUpdate : ', data)
    })

    this.JIM.onTransMsgRec(data => {
      this.console('onTransMsgRec : ', data)
    })

    this.JIM.onRoomMsg(data => {
      this.console('onRoomMsg  : ', data)
    })
  }

  /**
   * 发送消息
   * @param {String} username 用户名
   * @param {Object} obj 消息体
   * @param {String} obj.msgType "0":正常,"1":邀请视频
   * @param {String} obj.nickName 别名  系统里的用户名
   * @param {String} obj.content 消息内容  "help":一键求助,"double":双人视频,"meet":多人视频, " observation":观摩
   * 视频聊天相关参数
   * @param {String} obj.channelId 房间id
   * @param {String} obj.inviteType "0":正常, "1":强拉, 2":强制观摩(拉执法仪)
   * @param {String} obj.mediaType "0":音频, "1":视频
   * @param {String} obj.inviteDevice  "0":pc端, "1":移动端, "2":执法仪 , "3":全部
   * @param {String} obj.agree "0":拒绝邀请, "1":接受邀请
   * @param {String} obj.isExit "0":退出房间, "1":结束聊天
  */
  sendSingleMsg(username, obj) {
    obj = { inviteDevice: '3', ...obj }
    this.JIM.sendSingleMsg({
      target_username: username,
      content: JSON.stringify(obj),
      extras: obj
    }).onSuccess((data, msg) => {
      this.console('sendSingleMsg success data:发送消息成功', data)
      this.console('sendSingleMsg succes msg:发送消息成功', msg)
    }).onFail((data) => {
      this.console('sendSingleMsg error:', data)
    })
  }

  //打印日志
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }
}

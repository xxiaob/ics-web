import AgoraRTC from 'agora-rtc-sdk'

export class Live {
  /**
   * @param {String} localId 本地流播放的容器id
   * @param {String} remoteId 远端流播放的容器id
   * @param {Boolean} debug
  */
  constructor(localId = 'live', remoteId = 'tolive', debug = true) {
    this.debug = debug
    this.localId = localId
    this.remoteId = remoteId

    this.rtc = {
      client: null,
      joined: false,
      published: false,
      localStream: null,
      remoteStreams: [],
      params: {}
    }

    this.option = {
      appID: '2923891558a04fa8a5c30514e06cfac8',
      channel: 'Channel name',
      uid: null,
      token: 'Your token'
    }
    this.init()
    this.on()
  }

  //sdk初始化
  init() {
    this.console('init')
    // mode 用于设置频道场景。一对一或多人通话中，建议设为 "rtc" ，使用通信场景；互动直播中，建议设为 "live"，使用直播场景。
    this.rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' })
    this.rtc.client.init(this.option.appID, () => {
      this.console('init success')
    }, err => {
      this.console('init err', err)
    })
    //     让用户选择自己的角色是主播（"host"）还是观众（"audience"）。
    // 调用 setClientRole 方法，传入用户选择的角色。
    // // The value of role can be "host" or "audience".
    // rtc.client.setClientRole(role);
  }

  //监听事件
  on() {
    //报错信息
    this.rtc.client.on('error', (err) => {
      this.console('error', err)
    })

    //本地流已发布
    this.rtc.client.on('stream-published', e => {
      this.console('stream-published 本地流发布', e)
      //是否 需要直播推流
      // if (this.fromUsername) {
      //   this.console('不用推流')
      // } else {
      //   this.console('推流')
      //   setTimeout(() => {
      //     this.setPublish()
      //     this.publishStreamUrl('lxyada')
      //   })
      // }
    })

    //本地音视频流已取消发布
    this.rtc.client.on('stream-unpublished', e => {
      this.console('local stream unpublished 本地音视频流已取消发布', e)
    })

    //有远端用户/主播加入频道
    this.rtc.client.on('stream-unpublished', e => {
      this.console('local stream unpublished 有远端用户/主播加入频道', e)
    })

    //监听客户端的新增流
    this.rtc.client.on('stream-added', e => {
      this.console('stream-added 监听客户端的新增流 成功', e, e.stream.getId())
      this.rtc.remoteStreams.push(e.stream.getId())
      // this.setPublish()

      //订阅远端流，触发订阅事件
      this.rtc.client.subscribe(e.stream, err => {
        this.console('Subscribe stream failed 失败', err)
      })
    })

    //监听订阅事件 并播放远端流
    this.rtc.client.on('stream-subscribed', e => {
      this.console('stream-subscribed 订阅远端流成功', e)
      //接下来可以选择在本地播放远端流
      e.stream.play(this.remoteId)
    })

    //监听远端流移除
    this.rtc.client.on('stream-removed', e => {
      this.console('stream-removed 远端流移除成功', e, e.uid)
      this.removePlayer(e.uid)
      this.removeRemoteId(e.uid)
    })

    //监听用户离开
    this.rtc.client.on('peer-leave', e => {
      this.console('peer-leave 用户离开成功', e, e.uid)
      this.removePlayer(e.uid)
      this.removeRemoteId(e.uid)
    })

    //开启直播成功
    this.rtc.client.on('liveStreamingStarted', e => {
      this.console('liveStreamingStarted 开启直播成功', e)
    })

    //开启直播失败
    this.rtc.client.on('liveStreamingFailed', e => {
      this.console('liveStreamingFailed 开启直播失败', e)
    })

    //中断直播
    this.rtc.client.on('liveStreamingStopped', e => {
      this.console('liveStreamingStopped 中断直播', e)
    })

    //直播更新
    this.rtc.client.on('liveTranscodingUpdated', e => {
      this.console('liveTranscodingUpdated 直播更新', e)
    })
  }

  /**
   * 移除远端流的id  从rtc.remoteStreams中删除
   * @param {String} id
  */
  removeRemoteId(id) {
    const index = this.rtc.remoteStreams.findIndex(v => v === id)

    if (index > -1) {
      this.rtc.remoteStreams.splice(index, 1)
      // this.setPublish()
    }
  }

  /**
 * 移除远端流的播放dom
 * @param {String} id
*/
  removePlayer(id) {
    const playerDom = document.getElementById('player_' + id)

    if (playerDom) {
      playerDom.remove()
    }
  }

  /**
   * 加入频道
   * @param {String} channelId 房间ID
  */
  joinChannel(channelId = '123456') {
    this.rtc.client.join(null, channelId, null, uid => {
      this.console('joinChannel 成功')
      this.console('this.rtc.client', this.rtc.client)
      this.rtc.params.uid = uid
      this.createAndPublishStream()
    })
  }

  /**
   * 创建并且发布本地流
   * @param {Boolean} video 是否开启摄像头
  */
  createAndPublishStream(video = true) {
    this.console(this.rtc.params.uid, '创建本地流')

    this.rtc.localStream = AgoraRTC.createStream({
      streamID: this.rtc.params.uid,
      audio: true,
      video,
      screen: false
    })

    //本地流初始化
    this.rtc.localStream.init(() => {
      this.console('localStream.init 本地流初始化 成功')
      //播放本地流
      this.rtc.localStream.play(this.localId)
      //发布本地流
      this.rtc.client.publish(this.rtc.localStream, err => {
        this.console('发布本地流 报错: ', err)
      })
    }, err => {
      this.console('localStream.init 本地流初始化 报错: ', err)
    })
  }

  //离开房间
  leaveChannel() {
    this.rtc.client.leave(() => {
      this.console('leaveChannel 离开房间 成功')
      this.rtc.localStream.stop()
      this.rtc.localStream.close()

      // const selfLive = document.getElementById(this.localId)
      // selfLive.innerHTML = ''
      // Stop playing the remote streams and remove the views
      // while (rtc.remoteStreams.length > 0) {
      //   let stream = rtc.remoteStreams.shift()
      //   let id = stream.getId()
      //   stream.stop()
      //   removeView(id)
      // }
    }, err => {
      this.console('leaveChannel 离开房间 报错: ', err)
    })
  }

  //打印日志
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }
}

import LiveClient from 'LiveClient'

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
    this.appId = '408a34ed80ac4b43b5353b56ec1cd5f1'
    this.pushUrl = 'rtmp://push.bg365.top/live/' //推流地址

    this.client = null
    this.inChannel = false //已经加入频道
    this.pushed = false //已经推流
    this.remoteHostIds = [] //所有远端流的id
    this.fromUsername = '' //邀请人
    this.init()
    this.on()
  }

  //sdk初始化
  init() {
    this.console('init')
    this.client = new LiveClient()

    const context = {
      mode: 'live',
      codec: 'h264'
    }

    //创建客户端对象
    this.client.create(context, this.appId, () => {
      this.console('client inited 成功')
    })
  }

  //监听事件
  on() {
    //app本地流发布
    this.client.on('stream-published', e => {
      this.console('stream-published app本地流发布', e)
      //是否 需要直播推流
      if (this.fromUsername) {
        this.console('不用推流')
      } else {
        this.console('推流')
        setTimeout(() => {
          this.setPublish()
          this.publishStreamUrl('lxyada')
        })
      }
    })

    //监听客户端的新增流
    this.client.on('stream-added', e => {
      this.console('stream-added 监听客户端的新增流 成功', e, e.stream.getId())
      this.remoteHostIds.push(e.stream.getId())
      this.setPublish()

      //订阅远端流，触发订阅事件
      this.client.subscribe(e.stream, err => {
        this.console('Subscribe stream failed 失败', err)
      })
    })

    //监听订阅事件 并播放远端流
    this.client.on('stream-subscribed', e => {
      this.console('stream-subscribed 订阅远端流成功', e)
      //接下来可以选择在本地播放远端流
      e.stream.play(this.remoteId)
    })

    //监听远端流移除
    this.client.on('stream-removed', e => {
      this.console('stream-removed 远端流移除成功', e, e.uid)
      this.removePlayer(e.uid)
      this.removeRemoteId(e.uid)
    })

    //监听用户离开
    this.client.on('peer-leave', e => {
      this.console('peer-leave 用户离开成功', e, e.uid)
      this.removePlayer(e.uid)
      this.removeRemoteId(e.uid)
    })

    //开启直播成功
    this.client.on('liveStreamingStarted', e => {
      this.console('liveStreamingStarted 开启直播成功', e)
    })

    //开启直播失败
    this.client.on('liveStreamingFailed', e => {
      this.console('liveStreamingFailed 开启直播失败', e)
    })

    //中断直播
    this.client.on('liveStreamingStopped', e => {
      this.console('liveStreamingStopped 中断直播', e)
    })

    //直播更新
    this.client.on('liveTranscodingUpdated', e => {
      this.console('liveTranscodingUpdated 直播更新', e)
    })
  }

  /**
   * 移除远端流的id  从remoteHostIds中删除
   * @param {String} id
  */
  removeRemoteId(id) {
    const index = this.remoteHostIds.findIndex(v => v === id)

    if (index > -1) {
      this.remoteHostIds.splice(index, 1)
      this.setPublish()
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
   * @param {String} role 角色 主播(host)和观众(audience)
   * @param {String} fromUsername 邀请方
  */
  joinChannel(channelId = '123456', role = 'host', fromUsername = '') {
    this.fromUsername = fromUsername
    this.client.joinChannel(null, channelId, null, 0, null, role, () => {
      this.console('joinChannel 成功', role)
      this.console(this.client)
      this.inChannel = true

      if (role === 'host') {
        //主播  创建本地流
        this.createAndPublishStream()
      }
    })
  }

  /**
   * 创建并且发布本地流
   * @param {Boolean} video 是否开启摄像头
  */
  createAndPublishStream(video = true) {
    this.console(this.client.uid, '创建本地流')

    this.localStream = this.client.createStream({
      streamID: this.client.uid,
      audio: true,
      video
    })

    //本地流初始化
    this.localStream.init(() => {
      this.console('localStream.init 本地流初始化 成功', this.client.uid)
      //播放本地流
      this.localStream.play(this.localId)
      //发布本地流
      this.client.publishStream(this.localStream, err => {
        this.console('publishStream 发布本地流 报错: ' + err)
      })
    }, err => {
      this.console('localStream.init 本地流初始化 报错: ' + err)
    })
  }

  //离开房间
  leaveChannel() {
    if (this.pushed) {
      this.stopPublishStream('lxyada')
      this.console('结束推流成功')
    }
    this.client.leaveChannel(() => {
      this.console('leaveChannel 离开房间 成功')
      this.inChannel = false
      this.fromUsername = ''
      if (this.localStream) {
        this.localStream.close()
      }
      const selfLive = document.getElementById(this.localId)

      selfLive.innerHTML = ''
    }, err => {
      this.console('leaveChannel 报错: ' + err)
    })
  }

  //停止发布本地流
  unpublish() {
    this.client.unpublish(this.localStream, err => {
      this.console('unpublish 报错: ' + err)
    })
  }

  //设置推流参数
  setPublish() {
    const transcodingUsers = [
      {
        uid: this.client.uid,
        x: 0,
        y: 0,
        width: 640,
        height: 480,
        zOrder: 100,
        alpha: 1
      }
    ]

    let count = 0

    this.remoteHostIds.forEach(hostId => {
      transcodingUsers.push({
        uid: hostId,
        x: 640 + Math.floor(count / 3) * 213,
        y: (count % 3) * 160,
        width: 213,
        height: 160,
        zOrder: 100,
        alpha: 1
      })
      count++
    })
    const LiveTranscoding = {
      width: 640 + 213 * (Math.floor((count - 1) / 3) + 1),
      height: 480,
      videoBitrate: 400,
      videoFramerate: 15,
      lowLatency: false,
      audioSampleRate: 48000,
      audioBitrate: 48,
      audioChannels: 1,
      videoGop: 30,
      videoCodecProfile: 100,
      userCount: transcodingUsers.length,
      userConfigExtraInfo: {},
      backgroundColor: 0x000000,
      transcodingUsers: transcodingUsers
    }

    this.client.setLiveTranscoding(LiveTranscoding)
    this.console('设置推流参数', LiveTranscoding)
  }

  /**
   * 直播推流
   * @param {String} id 流id
  */
  publishStreamUrl(id) {
    this.console('publishStreamUrl 推流', this.client.uid)
    this.client.addPublishStreamUrl(this.pushUrl + id, true)
    this.pushed = true
  }

  /**
   * 停止直播推流
   * @param {String} id 流id
  */
  stopPublishStream(id) {
    this.client.removePublishStreamUrl(id)
    this.pushed = false
  }

  //打印日志
  console() {
    if (this.debug) {
      console.log(...arguments)
    }
  }
}

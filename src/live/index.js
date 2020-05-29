import LiveClient from 'LiveClient'
export class Live {
  constructor(localId = 'live', remoteId = 'tolive') {
    console.log('constructor')
    this.client = null
    this.inChannel = false
    //本地流播放的容器id
    this.localId = localId
    //远端流播放的容器id
    this.remoteId = remoteId
    this.appId = '408a34ed80ac4b43b5353b56ec1cd5f1'
    this.pushUrl = 'rtmp://push.bg365.top/live/'
    this.pushed = false
    this.fromUsername = ''
    //所有远端流的id
    this.remoteHostIds = []
    this.isLiving = false
    this.restartLive = false
    this.init()
    this.on()
  }

  //sdk初始化
  init() {
    console.log('init')
    this.client = new LiveClient()

    const context = {
      mode: 'live',
      codec: 'h264'
    }

    //创建客户端对象
    this.client.create(context, this.appId, () => {
      console.log('client inited 成功')
    })
  }

  //监听事件
  on() {
    //app本地流发布
    this.client.on('stream-published', e => {
      console.log('stream-published app本地流发布', e)
      if (this.fromUsername) {
        console.log('不用推流')
      } else {
        console.log('推流')
        setTimeout(() => {
          this.publishStreamUrl('lxyada')
        })
        this.pushed = true
      }
    })

    //监听客户端的新增流
    this.client.on('stream-added', e => {
      console.log('stream-added 监听客户端的新增流 成功', e, e.stream.getId())
      this.remoteHostIds.push(e.stream.getId())
      this.publishStreamUrl('lxyada')
      // if (this.isLiving) {
      //   this.restartLive = true
      //   this.stopPublishStream('lxyada')
      // }
      //订阅远端流，触发订阅事件
      this.client.subscribe(e.stream, err => {
        console.log('Subscribe stream failed 失败', err)
      })
    })

    //监听订阅事件 并播放远端流
    this.client.on('stream-subscribed', e => {
      console.log('stream-subscribed 订阅远端流成功', e)
      //接下来可以选择在本地播放远端流
      e.stream.play(this.remoteId)
    })

    //监听远端流移除
    this.client.on('stream-removed', e => {
      console.log('stream-removed 远端流移除成功', e, e.uid)
      this.removePlayer(e.uid)
      const index = this.remoteHostIds.findIndex(v => v === e.uid)

      if (index > -1) {
        this.remoteHostIds.splice(index, 1)
        this.publishStreamUrl('lxyada')
      }
      // if (this.isLiving) {
      //   this.restartLive = true
      //   this.stopPublishStream('lxyada')
      // }
    })

    //监听用户离开
    this.client.on('peer-leave', e => {
      console.log('peer-leave 用户离开成功', e, e.uid)
      this.removePlayer(e.uid)
      const index = this.remoteHostIds.findIndex(v => v === e.uid)

      if (index > -1) {
        this.remoteHostIds.splice(index, 1)
        this.publishStreamUrl('lxyada')
      }
      // if (this.isLiving) {
      //   this.restartLive = true
      //   this.stopPublishStream('lxyada')
      // }
    })

    //开启直播成功
    this.client.on('liveStreamingStarted', e => {
      console.log('liveStreamingStarted 开启直播成功', e)
      // if (this.restartLive) {
      //   this.restartLive = false
      // }
    })

    //开启直播失败
    this.client.on('liveStreamingFailed', e => {
      console.log('liveStreamingFailed 开启直播失败', e)
    })

    //中断直播
    this.client.on('liveStreamingStopped', e => {
      console.log('liveStreamingStopped 中断直播', e)
      // if (this.restartLive) {
      //   this.isLiving = true
      //   this.publishStreamUrl('lxyada')
      // }
    })

    //直播更新
    this.client.on('liveTranscodingUpdated', e => {
      console.log('liveTranscodingUpdated 直播更新', e)
    })
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
      console.log('joinChannel 成功')
      this.inChannel = true
    })

    console.log(this.client)

    //创建本地流
    this.localStream = this.client.createStream({
      streamID: this.client.uid,
      audio: true,
      video: true,
      audioProcessing: {
        AEC: true,
        AGC: true,
        ANS: true
      }
    })

    //本地流初始化
    this.localStream.init(() => {
      console.log('localStream.init 本地流初始化 成功', this.localStream.getId())
      //播放本地流
      this.localStream.play(this.localId)
      //发布本地流
      this.client.publishStream(this.localStream, err => {
        console.log('publishStream 发布本地流 报错: ' + err)
      })
    }, err => {
      console.log('localStream.init 本地流初始化 报错: ' + err)
    })
  }

  //离开房间
  leaveChannel() {
    if (this.pushed) {
      this.stopPublishStream('lxyada')
      console.log('结束推流成功')
    }
    this.client.leaveChannel(() => {
      console.log('leaveChannel 离开房间 成功')
      this.inChannel = false
      if (this.localStream) {
        this.localStream.close()
      }
      const selfLive = document.getElementById(this.localId)

      selfLive.innerHTML = ''
    }, err => {
      console.log('leaveChannel 报错: ' + err)
    })
  }

  //停止发布本地流
  unpublish() {
    this.client.unpublish(this.localStream, err => {
      console.log('unpublish 报错: ' + err)
    })
  }

  /**
   * 直播推流
   * @param {String} id 流id
  */
  publishStreamUrl(id) {
    console.log('publishStreamUrl 推流', this.client.uid)
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

    console.log('正在直播', this.isLiving, LiveTranscoding)
    this.client.setLiveTranscoding(LiveTranscoding)
    if (!this.isLiving) {
      this.client.addPublishStreamUrl(this.pushUrl + id, true)
      this.isLiving = true
    }
  }

  /**
   * 停止直播推流
   * @param {String} id 流id
  */
  stopPublishStream(id) {
    this.client.removePublishStreamUrl(id)
    this.isLiving = false
  }
}

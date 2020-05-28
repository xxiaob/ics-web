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
    this.init()
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

    //监听远端流移除
    this.client.on('stream-removed', e => {
      console.log('stream-removed 远端流移除成功', e, e.uid)
      this.removePlayer(e.uid)
    })
    //监听用户离开
    this.client.on('peer-leave', e => {
      console.log('peer-leave 用户离开成功', e, e.uid)
      this.removePlayer(e.uid)
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
  */
  joinChannel(channelId = '123456', role = 'host') {
    this.client.joinChannel(null, channelId, null, null, null, role, () => {
      console.log('joinChannel 成功')
      this.inChannel = true
    })

    console.log(this.client)

    //创建本地流
    this.localStream = this.client.createStream({
      streamID: this.client.uid,
      audio: true,
      video: true
    })

    //本地流初始化
    this.localStream.init(() => {
      console.log('localStream.init 本地流初始化 成功')
      //播放本地流
      this.localStream.play(this.localId)
      //发布本地流
      this.client.publishStream(this.localStream, err => {
        console.log('publishStream 发布本地流 报错: ' + err)
      })
    }, err => {
      console.log('localStream.init 本地流初始化 报错: ' + err)
    })

    //监听客户端的新增流
    this.client.on('stream-added', e => {
      console.log('stream-added 监听客户端的新增流 成功', e)
      //订阅远端流，触发订阅事件
      this.client.subscribe(e.stream, err => {
        console.log('Subscribe stream failed 失败', err)
      })
    })
    //监听订阅事件 并播放远端流
    this.client.on('stream-subscribed', e => {
      console.log('stream-subscribed 监听订阅事件 成功', e)
      //接下来可以选择在本地播放远端流
      e.stream.play(this.remoteId)
    })
  }

  //离开房间
  leaveChannel() {
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
}

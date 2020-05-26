export class Live {
  constructor() {
    console.log('constructor')
    this.client = null
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
    this.client.create(context, '408a34ed80ac4b43b5353b56ec1cd5f1', () => {
      console.log('client inited 成功')
    })
  }

  /**
   * 加入频道
   * @param {String} channelId 房间ID
   * @param {String} role 角色 主播(host)和观众(audience)
  */
  joinChannel(channelId = '1001', role = 'host') {
    this.client.joinChannel(null, channelId, null, null, null, role, () => {
      console.log('joinChannel 成功')
    })

    console.log(this.client)

    //创建本地流
    this.localStream = this.client.createStream({
      streamID: this.client.uid,
      audio: true,
      video: true
    })

    //本地流初始化
    this.localStream.init(success => {
      console.log('localStream.init 成功: ' + success)
      //播放本地流
      this.localStream.play('live')
      //发布本地流
      this.client.publishStream(this.localStream, err => {
        console.log('publishStream 报错: ' + err)
      })
    }, err => {
      console.log('localStream.init 报错: ' + err)
    })

    //监听客户端的新增流
    this.client.on('stream-added', e => {
      console.log('stream-added 成功', e)
      const stream = e.stream

      //订阅远端流，触发订阅事件
      this.client.subscribe(stream, err => {
        console.log('Subscribe stream failed 失败', err)
      })
    })
    //监听订阅事件 并播放远端流
    this.client.on('stream-subscribed', e => {
      console.log('stream-subscribed 成功', e)
      const remoteStream = e.stream

      //接下来可以选择在本地播放远端流
      remoteStream.play('tolive')
    })
  }

  //离开房间
  leaveChannel() {
    this.client.leaveChannel(success => {
      console.log('leaveChannel 成功: ' + success)
      if (this.localStream) {
        this.localStream.close()
      }
      const selfLive = document.getElementById('live')

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

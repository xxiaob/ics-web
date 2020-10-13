
//https://docs.agora.io/cn/Voice/API%20Reference/web/v3.1.1/index.html

import AgoraRTC from 'agora-rtc-sdk'
import { getAgoraToken, startRecord, endRecord } from '@/api/live'

export class Live {
  /**
   * @param {String} userId 用户id
   * @param {String} localId 本地流播放的容器id
   * @param {String} remoteId 远端流播放的容器id
   * @param {Function} cb
   * @param {Function} remoteStremCb
   * @param {Boolean} debug
  */
  constructor(userId, localId = 'live', remoteId = 'tolive', cb, remoteStremCb, debug = true) {
    this.userId = userId
    this.debug = debug
    this.localId = localId
    this.remoteId = remoteId

    //当前用户客户端的相关信息
    this.rtc = {
      client: null,
      joined: false, //是否加入频道
      published: false, //是否已经发布流
      localStream: null, //本地流
      remoteStreams: [], //远端流的id 数组
      params: {} // params.uid 本地流的id
    }

    //声网应用信息 加入频道信息
    this.option = {
      appID: process.env.agoraConfig.appID,
      channel: 'Channel name',
      uid: null,
      token: 'Your token'
    }

    //录制参数
    this.recordParams = {
      channelName: '',
      recordingType: 0,
      recorded: true,
      userId: ''
    }

    this.init()
    this.on(cb, remoteStremCb)
  }

  //sdk初始化
  init() {
    this.console('agora init')
    // mode 用于设置频道场景。一对一或多人通话中，建议设为 "rtc" ，使用通信场景；互动直播中，建议设为 "live"，使用直播场景。
    this.rtc.client = AgoraRTC.createClient({ mode: 'live', codec: 'h264' })
    this.rtc.client.init(this.option.appID, () => {
      this.console('agora init success')
    }, err => {
      this.console('agora init err', err)
    })
  }

  //空函数
  noop() { }

  /**
   * 监听事件
   * @param {Function} cb 监听回调
   * @param {Function} remoteStremCb 监听回调
   */
  on(cb = this.noop, remoteStremCb = this.noop) {
    //报错信息
    this.rtc.client.on('error', err => {
      this.console('监听报错信息 error', err)
    })

    //本地流已发布
    this.rtc.client.on('stream-published', e => {
      this.console('stream-published 本地流发布', e)
      if (this.recordParams.recorded) {
        startRecord(this.recordParams)
      }
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

      //订阅远端流，触发订阅事件
      this.rtc.client.subscribe(e.stream, err => {
        this.console('Subscribe stream failed 失败', e.stream, e.stream.getId(), err)
      })
    })

    //监听订阅事件 并播放远端流
    this.rtc.client.on('stream-subscribed', e => {
      this.console('stream-subscribed 订阅远端流成功', e, e.stream.streamId)
      //接下来可以选择在本地播放远端流
      const remoteId = e.stream.streamId.split('_')[0]

      this.console('remoteId', remoteId)
      // e.stream.play(this.remoteId)
      e.stream.play(remoteId)

      if (!this.interval) {
        this.interval = setInterval(() => {
          this.rtc.client.getRemoteVideoStats(remoteVideoStatsMap => {
            /**
             * End2EndDelay 端到端延迟（ms）从远端采集视频到本地播放视频的延迟。
             * TotalFreezeTime  视频卡顿总时间，单位为秒
             * PacketLossRate  远端视频的丢包率（%）
             * TransportDelay  传输延迟（ms） 从远端发送视频到本地接收视频的延迟。
             *
             * MuteState  视频画面是否开启 "1"：视频画面开启 "0"：视频画面关闭
             * RecvBitrate  视频接收码率，单位 Kbps
             * RecvResolutionHeight  视频接收分辨率高度，单位为像素
             * RecvResolutionWidth  视频接收分辨率宽度，单位为像素
             * RenderFrameRate  视频解码输出帧率（渲染帧率），单位 fps
             * RenderResolutionHeight  视频渲染分辨率高度，单位为像素
             * RenderResolutionWidth  视频渲染分辨率宽度，单位为像素
             * TotalPlayDuration  视频播放总时间，单位为秒
             */
            const badStreams = []

            this.console('getRemoteVideoStats 监听 远端流的情况', remoteVideoStatsMap)

            for (const key in remoteVideoStatsMap) {
              if (remoteVideoStatsMap[key].PacketLossRate > 10) {
                badStreams.push(key.split('_')[0])
              }
            }
            remoteStremCb(badStreams)
          })
        }, 2000)
      }
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

    //网络质量统计数据
    this.rtc.client.on('network-quality', e => {
      this.console('network-quality 本地网络数据', e)
      if (e.downlinkNetworkQuality > 3 || e.uplinkNetworkQuality > 3) {
        cb(true)
      } else {
        cb(false)
      }
    })
  }

  /**
   * 移除远端流的id  从rtc.remoteStreams中删除
   * @param {String} id
  */
  removeRemoteId(id) {
    // this.console('removeRemoteId', id)
    const index = this.rtc.remoteStreams.findIndex(v => v === id)

    if (index > -1) {
      this.rtc.remoteStreams.splice(index, 1)
    }
    // this.console('this.rtc.remoteStreams', this.rtc.remoteStreams)
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
   * @param {Boolean} video 是否开启摄像头
   * @param {Boolean} recorded 是否录制
   * @param {String} toUserId 邀请人的用户id  一人进多个频道
  */
  async joinChannel(channelId = '123456', role = 'host', video = true, recorded = true, toUserId = '') {
    //设置录制参数
    this.recordParams.channelName = channelId
    this.recordParams.recordingType = video ? 1 : 0 //录制类型  0对讲  1视频  2采集
    this.recordParams.recorded = recorded
    // 让用户选择自己的角色是主播（"host"）还是观众（"audience"）。
    // 调用 setClientRole 方法，传入用户选择的角色。
    this.rtc.client.setClientRole(role)

    const recordingType = video ? '_Video' : '_Audio'

    let userAccount = this.userId + '_web' + recordingType //用户加入频道的id = 视频流的id

    if (toUserId) {
      userAccount += toUserId
    }
    this.recordParams.userId = userAccount
    const { channelKey } = await getAgoraToken({ channelName: channelId, userAccount })

    this.console('获取token成功', channelKey, channelId)
    this.rtc.client.join(channelKey, channelId, userAccount, uid => {
      this.console('joinChannel 成功')
      this.console('this.rtc.client', uid, this.rtc.client)
      this.rtc.params.uid = uid
      this.joined = true
      if (role === 'host') {
        this.createAndPublishStream(video)
      }
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
    //设置视频属性
    this.rtc.localStream.setVideoProfile('720p_1')
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
    // this.console('this.interval', this.interval)
    if (this.interval) {
      clearInterval(this.interval)
      this.interval = null
    }
    if (this.recordParams.recorded) {
      endRecord(this.recordParams)
    }
    this.rtc.client.leave(() => {
      this.console('leaveChannel 离开房间 成功')
      this.joined = false
      if (this.rtc.localStream) {
        this.rtc.localStream.stop()
        this.rtc.localStream.close()
      }

      // const selfLive = document.getElementById(this.localId)
      // selfLive.innerHTML = ''
      // Stop playing the remote streams and remove the views
      // while (rtc.remoteStreams.length > 0) {
      //   let stream = rtc.remoteStreams.shift()
      //   let id = stream.getId()
      //   stream.stop()
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

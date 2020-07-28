/**
 * 大屏socket 连接
 */
import { screenMapSocket, screenMessageChannelSocket } from '@/api/socket'
import { SOCKET_MESSAGE_TYPES } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      screenSocketOrg: null,
      screenSocket: null,
      screenMessageChannelSocket: null
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.initScreenMapSocket) //监听行级别切换，进行socket 连接
    this.$EventBus.$on('screen-message-channel', this.sendScreenMessageChannelSocket) //监听消息发送
  },
  methods: {
    initScreenMapSocket(org) {
      this.screenSocketOrg = org
      if (this.screenSocket) {
        this.screenSocket.disconnect() //如果已经存在，则断开连接
      }
      this.screenSocket = screenMapSocket({ subOrgId: this.screenSocketOrg.orgId, subProjectId: this.project.projectId })
      this.screenSocket.connect((data) => {
        console.log('screenMapSocket message data:', data)
        /**
         * 根据 消息type 区分消息类型
         * 0为用户信息,2为一开始订阅所有,3为事件问题任务消息,4为一键采集,5为任务结束,6人员考勤,7岗点考勤,8异常临时任务 9.临时任务推送
         */
        if (data.type == 0) {
          //数据类型为用户信息变更
          this.$EventBus.$emit('map-user-change', { type: 2, users: data.locations }) //通知用户上线
        } else if (data.type == 1) {
          //数据类型为组织人员信息变更
          if (data.offlineUserId) {
            this.$EventBus.$emit('map-user-change', { type: 3, offUserId: data.offlineUserId }) //通知用户离线
          }
        } else if (data.type == 2) {
          //数据类型为第一次连接的数据
          this.$EventBus.$emit('map-user-change', { type: 1, users: data.locations }) //通知用户初始化
          this.$EventBus.$emit('screen-message-init', data.tasks) //通知消息初始化
        } else if (data.type == 3) {
          //数据类型为问题，任务消息
          this.$EventBus.$emit('screen-message-change', data) //通知任务事件
        } else if (data.type == 4) {
          //数据类型为一键采集 数据
          this.$EventBus.$emit('map-user-change', { type: 4, collectUser: data.collectUser }) //通知用户进入一键采集
        } else if (data.type == 6) {
          //数据类型为人员考勤
          this.$EventBus.$emit('map-user-change', { type: 5, attendance: data.attendance }) //通知用户考勤状态
        } else if (data.type == 7) {
          //数据类型为岗点考勤
          this.$EventBus.$emit('map-grid-change', { type: 1, attendance: data.attendance }) //通知岗点考勤状态
        } else if (data.type == 8) {
          //异常临时任务
          this.$EventBus.$emit('map-task-change', { type: 1, tasks: data.abnormalTasks }) //通知临时任务考勤状态
        } else if (data.type == 5) {
          //为任务结束
          this.$EventBus.$emit('map-task-change', { type: 2, taskId: data.taskId }) //通知临时任务结束
        } else if (data.type == 9) {
          //临时任务推送
          this.$EventBus.$emit('map-task-change', { type: 3, task: data.messageDTO }) //通知新增临时任务
        }
      })

      this.sendScreenMessageChannelSocket() //发送消息
    },
    sendScreenMessageChannelSocket(message) {
      //如果消息通道不存在，则去连接
      if (!this.screenMessageChannelSocket) {
        this.screenMessageChannelSocket = screenMessageChannelSocket({
          orgId: this.screenSocketOrg.orgId,
          projectId: this.project.projectId,
          type: SOCKET_MESSAGE_TYPES.command
        })
        this.screenMessageChannelSocket.connect((data) => { })
      }
      if (message) {
        //如果消息存在，则去发送消息
        this.screenMessageChannelSocket.send({ sendType: SOCKET_MESSAGE_TYPES.DATA_STATISTICS, data: message })
      }
    }
  },
  beforeDestroy() {
    if (this.screenSocket) {
      this.screenSocket.disconnect() //如果已经存在，则断开连接
      this.screenSocket = null
    }
    if (this.screenMessageChannelSocket) {
      this.screenMessageChannelSocket.disconnect() //如果已经存在，则断开连接
      this.screenMessageChannelSocket = null
    }
    //去除监听
    this.$EventBus.$off('org-change', this.initScreenMapSocket)
    this.$EventBus.$off('screen-message-channel', this.sendScreenMessageChannelSocket)
  }
}

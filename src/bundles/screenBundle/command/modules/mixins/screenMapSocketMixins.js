/**
 * 大屏socket 连接
 */
import { screenMapSocket } from '@/api/socket'

export default {
  data() {
    return {
      screenSocketOrg: null,
      screenSocket: null
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.initScreenMapSocket) //监听行级别切换，进行socket 连接
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
         * 0为用户信息, 1为组织消息, 2为一开始订阅所有, 3为事件问题任务消息, 4为一键采集, 5为任务结束, 6人员考勤, 7岗点考勤
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
        }
      })
    }
  },
  beforeDestroy() {
    if (this.screenSocket) {
      this.screenSocket.disconnect() //如果已经存在，则断开连接
      this.screenSocket = null
    }
    //去除监听
    this.$EventBus.$off('org-change', this.initScreenMapSocket)
  }
}

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
         * 1为组织消息, 0为用户信息,2为一开始订阅所有,3为事件问题任务消息,4为一键采集
         */
        if (data.type == 0) {
          //数据类型为用户信息变更
          this.$EventBus.$emit('map-user-change', { type: 2, users: data.locations }) //通知用户上线
        } else if (data.type == 1) {
          //数据类型为组织人员信息变更
          this.$EventBus.$emit('data-overview-change', data.orgUsers) //通知组织人员在线人数变更
          this.$EventBus.$emit('map-user-change', { type: 3, users: data.offlineUserId }) //通知用户离线
        } else if (data.type == 2) {
          //数据类型为第一次连接的数据
          this.$EventBus.$emit('data-overview-change', data.orgUsers) //通知组织人员在线人数变更
          this.$EventBus.$emit('map-user-change', { type: 1, users: data.locations }) //通知用户初始化
        } else if (data.type == 3) {
          //数据类型为问题，任务消息
          this.$EventBus.$emit('screen-message-change', data) //通知任务事件
        } else if (data.type == 4) {
          //数据类型为一键采集 数据

        }
      })
    }
  },
  beforeDestroy() {
    if (this.screenSocket) {
      this.screenSocket.disconnect() //如果已经存在，则断开连接
    }
    //去除监听
    this.$EventBus.$off('org-change', this.initScreenMapSocket)
  }
}

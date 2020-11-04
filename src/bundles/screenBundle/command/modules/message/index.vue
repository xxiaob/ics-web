<template>
  <div class="jc-screen-message">
    <div class="jc-title">信息推送</div>
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <message-list :list="this[tabComponent]" @todoChange="changeTodo"></message-list>
  </div>
</template>
<script>
import { MESSAGE_TYPE, SYSTEM_MESSAGE_TYPE, WARNING_TYPE } from '@/constant/Dictionaries'
import { formatDate } from '@/libs/util'
import { getTodoInfo, setTodoInfo } from '@/libs/storage'

export default {
  name: 'ScreenCommandMessage',
  props: ['options', 'project'],
  components: {
    ViewTabs: () => import('../common/viewTabs'),
    MessageList: () => import('./modules/List')
  },
  data() {
    return {
      tabComponent: 'BaseVocation',
      tabs: [
        { label: '基础业务', value: 'BaseVocation' },
        { label: '项目业务', value: 'ProjectVocation' },
        { label: '告警信息', value: 'WarningInfo' },
        { label: '待办信息', value: 'TodoInfo' }
      ],
      visible: true,
      notReadNum: 0,
      maxLength: 20, //最大数量
      BaseVocation: [], //基础业务
      ProjectVocation: [], //项目业务
      TodoInfo: [], //待办信息
      WarningInfo: [], //告警信息
      WarningInfoIds: [],
      initTodoInfoIds: []
    }
  },
  created() {
    const res = getTodoInfo(this.project.projectId)

    console.log('getTodoInfo', res)
    if (res && res.length) {
      this.TodoInfo = res
      this.initTodoInfoIds = res.map(item=>item.id)
    }
    this.$EventBus.$on('screen-message-init', this.messageInit) //监听消息 初始化
    this.$EventBus.$on('screen-message-change', this.initData) //监听消息
    this.$EventBus.$on('screen-message-warning-change', this.initWarningData) //监听告警消息
  },
  mounted() {
    this.$nextTick(() => {
      this.$EventBus.$emit('message-component-change', { component: 'CommandMessage', options: null }) //通知窗口改变
    })
  },
  methods: {
    initWarningData({ init, data }) {
      console.log('initWarningData', init, data)
      if (init) {
        this.WarningInfo = []
        this.WarningInfoIds = []
      } else {
        if (!this.visible) {
          this.$EventBus.$emit('message-num-change', { type: 2 }) //通知事件变更
        }
        this.tabComponent = 'WarningInfo'
      }

      if (data && data.length) {
        const userWarning = [], taskWarning = [], gridWarning = []

        data.forEach(item => {
          if (item.alarmSourceType == WARNING_TYPE.USER_ABNORMAL) {
            userWarning.push({ ...item, id: item.businessId })
          } else if (item.alarmSourceType == WARNING_TYPE.TEMPORARY_ABNORMAL) {
            taskWarning.push({ ...item, taskId: item.businessId })
          } else {
            gridWarning.push({ ...item, id: item.businessId, warnType: item.alarmSourceType + '' })
          }

          const index = this.WarningInfoIds.indexOf(item.businessId + item.alarmSourceType)

          if (index > -1) {
            if (item.status == 0) {
              this.WarningInfoIds.splice(index, 1)
              this.WarningInfo.splice(index, 1)
            }
          } else if (item.status == 1) {
            this.WarningInfoIds.unshift(item.businessId + item.alarmSourceType)

            let todo = false

            if (this.initTodoInfoIds.includes(item.businessId)) {
              todo = true
            }
            this.WarningInfo.unshift({
              id: item.businessId,
              systemSourceType: SYSTEM_MESSAGE_TYPE.SELF,
              title: WARNING_TYPE.toString(item.alarmSourceType + ''),
              type: MESSAGE_TYPE.ALARM,
              warnType: item.alarmSourceType + '',
              location: item.locationName,
              orgName: item.orgName,
              areaTypeId: item.areaTypeId,
              businessName: item.businessName,
              todo,
              time: item.time
            })
          }
        })

        if (this.WarningInfo.length > this.maxLength) {
          this.WarningInfo.splice(this.maxLength, this.WarningInfo.length - this.maxLength)
        }
        console.log('initWarningData', userWarning, taskWarning, gridWarning)
        this.$EventBus.$emit('map-user-change', { type: 5, attendance: userWarning, init }) //通知用户考勤状态
        this.$EventBus.$emit('map-task-change', { type: 1, tasks: taskWarning, init }) //通知临时任务考勤状态
        this.$EventBus.$emit('map-grid-change', { type: 1, attendance: gridWarning, init }) //通知岗点考勤状态
      }
    },
    initData(data) {
      let message = data.messageDTO

      console.log('screen-message-change', message)
      /**
       * 如果当前窗口隐藏，接收到的消息是事件则通知未读数据变化，如果是其他则弹出显示
       */
      if (!this.visible) {
        if (message.messageType == MESSAGE_TYPE.EVENT) {
          this.notReadNum++
          this.$EventBus.$emit('message-num-change', { type: 1, num: this.notReadNum }) //通知事件变更
        } else {
          this.$EventBus.$emit('message-num-change', { type: 2 }) //通知事件变更
        }
      }

      const item = {
        id: message.businessKey,
        type: message.messageType + '',
        systemSourceType: message.systemSourceType + '',
        title: message.titleName,
        userName: message.userName,
        typeName: message.typeName,
        orgName: message.orgName,
        todo: false,
        warnType: '',
        time: formatDate(message.createTime)
      }

      if (message.systemSourceType == SYSTEM_MESSAGE_TYPE.DREGS || message.systemSourceType == SYSTEM_MESSAGE_TYPE.PROSECUTION) { //项目业务  溧水渣土 溧水控违
        this.tabComponent = 'ProjectVocation'
        this.ProjectVocation.splice(0, 0, item)
        //处理列表只显示最大数量的事件问题
        if (this.ProjectVocation.length > this.maxLength) {
          this.ProjectVocation.splice(this.maxLength, this.ProjectVocation.length - this.maxLength)
        }
      } else { //基础业务
        this.tabComponent = 'BaseVocation'
        this.BaseVocation.splice(0, 0, item)
        //处理列表只显示最大数量的事件问题
        if (this.BaseVocation.length > this.maxLength) {
          this.BaseVocation.splice(this.maxLength, this.BaseVocation.length - this.maxLength)
        }
      }

      this.$EventBus.$emit('map-voice-alert', { type: message.messageType + '' }) //通知播放提示音
    },
    messageInit(data) {
      console.log('screen-message-init', data)
      this.BaseVocation = []
      this.ProjectVocation = []
      if (data && data.length) {
        let list = []

        data.forEach(item => {
          let todo = false

          if (this.initTodoInfoIds.includes(item.businessKey)) {
            todo = true
          }
          list.push({
            id: item.businessKey,
            type: MESSAGE_TYPE.TEMPORARY,
            systemSourceType: SYSTEM_MESSAGE_TYPE.SELF,
            title: item.taskName,
            userName: item.startUser,
            orgName: item.startOrg,
            typeName: item.taskSource,
            todo,
            warnType: '',
            time: formatDate(item.createTime)
          })
        })
        this.BaseVocation = list
      }
    },
    changeTodo(item) {
      console.log('changeTodo item', item)
      if (item.todo) {
        this.TodoInfo.unshift(item)
      } else {
        const index = this.TodoInfo.findIndex(v=>v.id == item.id)

        this.TodoInfo.splice(index, 1)
      }
      setTodoInfo(this.project.projectId, this.TodoInfo)
    }
  },
  activated() {
    //设置该窗口显示
    this.notReadNum = 0
    this.visible = true
    console.log('ScreenCommandMessage activated')
  },
  deactivated() {
    //设置该窗口隐藏,然后开始新消息数量通知
    this.visible = false
    console.log('ScreenCommandMessage deactivated')
  },
  beforeDestroy() {
    //去除监听
    this.$EventBus.$off('screen-message-change', this.initData)
    this.$EventBus.$off('screen-message-init', this.messageInit)
  }
}
</script>

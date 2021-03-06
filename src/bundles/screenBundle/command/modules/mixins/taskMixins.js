/**
 * 任务显示混入
 */
import { JcMapMarker } from '@/map'
import { JcTemporaryTaskIcons } from '@/config/JcIconConfig'
import { MAP_EVENT, MAP_SIGN_ZINDEX } from '@/constant/CONST'
import { MESSAGE_TYPE, SYSTEM_ALARM_STATUS } from '@/constant/Dictionaries'
import { VOICE_TYPE } from '@/config/JcVoiceAlertConfig'
import { getScreenTask } from '@/api/screen'

let userTasks = {} //记录

let abnormalTaskTimes = {} //记录所有异常的任务时间，用于重置

export default {
  data() {
    return {
      temporaryTaskOrgId: '',
      abnormalTaskIds: [] //异常的临时任务数组
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.temporaryTaskOrgChange) //监听第一次组织级别切换，然后去初始化地图临时任务
    this.$EventBus.$on('map-task-change', this.mapTaskChange) //临时任务考勤状态

    this.abnormalTaskinterval = setInterval(this.abnormalTaskChange, 2000) //异常任务 超时没有推送 改变状态
  },
  methods: {
    abnormalTaskChange() {
      const nowTime = new Date().getTime()
      const intervalTime = 10 * 60 * 1000
      const overtimeAbnormalTask = []

      this.abnormalTaskIds.forEach(taskId=>{
        if (nowTime - abnormalTaskTimes[taskId] >= intervalTime) {
          overtimeAbnormalTask.push({ status: 0, taskId })
        }
      })

      if (overtimeAbnormalTask.length) {
        this.mapTaskChange({ type: 1, tasks: overtimeAbnormalTask })
      }
    },
    temporaryTaskOrgChange(org) {
      this.temporaryTaskOrgId = org.orgId
      this.clearTasks()
      this.initMapTask()
    },
    async initMapTask() {
      try {
        let tasks = await getScreenTask({ orgId: this.temporaryTaskOrgId, projectId: this.project.projectId })

        if (tasks && tasks.length) {
          tasks.forEach(item => {
            this.drawTask({ taskId: item.businessKey, taskName: item.taskName, center: item.position })
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    drawTask(task) {
      if (!task.center || userTasks[task.taskId]) {
        return//如果坐标不存在，则直接返回
      }
      let myJcMap = this.getMyJcMap() //获取地图对象

      let marker = new JcMapMarker({ map: myJcMap, name: task.taskName, zIndex: MAP_SIGN_ZINDEX.TASK, icon: JcTemporaryTaskIcons.plain, position: task.center.split(',') })

      //添加监听
      marker.on(MAP_EVENT.CLICK, () => {
        this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: task.taskId, type: MESSAGE_TYPE.TEMPORARY } }) //通知窗口改变
      })

      userTasks[task.taskId] = { taskId: task.taskId, center: marker.position, marker }
    },
    mapTaskChange(data) {
      // console.log('mapTaskChange', data)
      if (data.type == 1) {
        //临时任务考勤状态更新
        if (data.tasks && data.tasks.length) {
          let hasAbnormalTask = false //记录获取的批量异常任务里是否有新增，如果有，则通知播放提示音

          data.tasks.forEach(item => {
            //记录异常报警的时间
            if (item.status == SYSTEM_ALARM_STATUS.OPEN) {
              abnormalTaskTimes[item.taskId] = new Date().getTime()
            }

            let index = this.abnormalTaskIds.indexOf(item.taskId)

            //如果任务正常，从异常列表移除，恢复任务显示，如果不正常，则去显示异常任务标识
            if (index > -1) {
              if (item.status == SYSTEM_ALARM_STATUS.CLOSE) {
                this.abnormalTaskIds.splice(index, 1)
              }
            } else if (item.status == SYSTEM_ALARM_STATUS.OPEN) {
              this.abnormalTaskIds.push(item.taskId)
              hasAbnormalTask = true
            }
            //如果该地图对象存在，则去设置显示
            if (userTasks[item.taskId]) {
              let marker = userTasks[item.taskId].marker

              marker.icon = item.status == SYSTEM_ALARM_STATUS.CLOSE ? JcTemporaryTaskIcons.plain : JcTemporaryTaskIcons.abnormal
              marker.setContent()
            }
          })

          if (hasAbnormalTask && !data.init) {
            this.$EventBus.$emit('map-voice-alert', { type: VOICE_TYPE.TEMPORARY_ABNORMAL }) //通知播放提示音
          }
        }
      } else if (data.type == 2) {
        //任务结束
        if (data.taskId && userTasks[data.taskId]) {
          userTasks[data.taskId].marker.hide()
          delete userTasks[data.taskId]
        }
      } else if (data.type == 3) {
        //新增临时任务
        this.drawTask({ taskId: data.task.businessKey, taskName: data.task.titleName, center: data.task.position })
      }
    },
    clearTasks() {
      for (let taskId in userTasks) {
        let signItem = userTasks[taskId]

        if (signItem.labelMarker) {
          signItem.labelMarker.hide()
        }
      }
      userTasks = {}
    }
  },
  beforeDestroy() {
    this.clearTasks()

    //去除事件监听
    this.$EventBus.$off('org-change', this.temporaryTaskOrgChange)
    this.$EventBus.$off('map-task-change', this.mapTaskChange)
    if (this.abnormalTaskinterval) {
      clearInterval(this.abnormalTaskinterval)
    }
  }
}

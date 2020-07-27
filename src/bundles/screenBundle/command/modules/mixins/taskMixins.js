/**
 * 任务显示混入
 */
import { JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'
import { MAP_EVENT } from '@/constant/CONST'
import { MESSAGE_TYPE } from '@/constant/Dictionaries'
import { VOICE_TYPE } from '@/config/JcVoiceAlertConfig'
import { getScreenTask } from '@/api/screen'

let userTasks = {} //记录

export default {
  data() {
    return {
      abnormalTaskIds: [] //异常的临时任务数组
    }
  },
  created() {
    this.$EventBus.$on('org-change', this.initMapTask) //监听第一次组织级别切换，然后去初始化地图临时任务
    this.$EventBus.$on('map-task-change', this.mapTaskChange) //临时任务考勤状态
  },
  methods: {
    async initMapTask(org) {
      //初始化
      try {
        let tasks = await getScreenTask({ orgId: org.orgId, projectId: this.project.projectId })

        if (tasks && tasks.length) {
          tasks.forEach(item => {
            this.drawTask({ taskId: item.businessKey, taskName: item.taskName, center: item.position.split(',') })
          })
        }
      } catch (error) {
        console.log(error)
      }
      this.$EventBus.$off('org-change', this.initMapTask) //获取完成
    },
    drawTask(task) {
      let myJcMap = this.getMyJcMap() //获取地图对象

      let marker = new JcMapMarker({ map: myJcMap, name: task.taskName, icon: '/static/mapIcons/temporarytasks.gif', position: task.center, mapStyle: markerStyle.CENTER_MARKER })

      //添加监听
      marker.on(MAP_EVENT.CLICK, () => {
        this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: task.taskId, type: MESSAGE_TYPE.TEMPORARY } }) //通知窗口改变
      })

      userTasks[task.taskId] = { taskId: task.taskId, center: task.center, marker }
    },
    mapTaskChange(data) {
      if (data.type == 1) {
        //临时任务考勤状态更新
        if (data.tasks && data.tasks.length) {
          let hasAbnormalTask = false //记录获取的批量异常任务里是否有新增，如果有，则通知播放提示音

          data.tasks.forEach(item => {
            let index = this.abnormalTaskIds.indexOf(item.taskId)

            //如果任务正常，从异常列表移除，恢复任务显示，如果不正常，则去显示异常任务标识
            if (index > -1) {
              if (item.status == 0) {
                this.abnormalTaskIds.splice(index, 1)
              }
            } else if (item.status == 1) {
              this.abnormalTaskIds.push(item.taskId)
              hasAbnormalTask = true
            }
            //如果该地图对象存在，则去设置显示
            if (userTasks[item.taskId]) {
              let marker = userTasks[item.taskId].marker

              marker.icon = item.status == 0 ? '/static/mapIcons/temporarytasks.gif' : '/static/mapIcons/temporarytaskswarn.gif'
              marker.setContent()
            }
          })

          if (hasAbnormalTask) {
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
        //新增临时任务，如果地图该内容不存在，则去显示
        if (!userTasks[data.businessKey]) {
          this.drawTask({ taskId: data.businessKey, taskName: data.titleName, center: data.position.split(',') })
        }
      }
    }
  },
  beforeDestroy() {
    userTasks = {}
    //去除事件监听
    this.$EventBus.$off('org-change', this.initMapTask)
    this.$EventBus.$off('map-task-change', this.mapTaskChange)
  }
}

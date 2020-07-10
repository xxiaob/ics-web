/**
 * 任务显示混入
 */
import { JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'
import { MAP_EVENT } from '@/constant/CONST'
import { MESSAGE_TYPE } from '@/constant/Dictionaries'


let userTasks = {} //记录

export default {
  data() {
    return {

    }
  },
  created() {
    this.$EventBus.$on('map-task-change', this.mapTaskChange) //临时任务考勤状态
  },
  methods: {
    mapTaskChange(data) {
      let myJcMap = this.getMyJcMap() //获取地图对象

      if (data.type == 1) {
        //临时任务考勤状态更新
        if (data.tasks && data.tasks.length) {
          data.tasks.forEach(item => {
            /**
             * 如果地图有该任务报警，但是状态恢复正常，则取消显示
             * 如果地图该任务报警不存在，且任务需要报警，则进行显示
             */
            if (userTasks[item.taskId]) {
              if (item.status == 0) {
                userTasks[item.taskId].marker.hide()
                delete userTasks[item.taskId]
              }
            } else if (item.status == 1) {
              let center = item.position.split(',')

              let marker = new JcMapMarker({ map: myJcMap, name: item.taskName, icon: '/static/mapIcons/temporarytaskswarn.gif', position: center, mapStyle: markerStyle.CENTER_MARKER })

              //添加监听
              marker.on(MAP_EVENT.CLICK, () => {
                this.$EventBus.$emit('view-component-change', { component: 'MessageDetail', options: { id: item.taskId, type: MESSAGE_TYPE.TEMPORARY } }) //通知窗口改变
              })
              userTasks[item.taskId] = { taskId: item.taskId, center, marker }
            }
          })
        }
      }
    }
  },
  beforeDestroy() {
    userTasks = {}
    //去除事件监听
    this.$EventBus.$off('map-task-change', this.mapTaskChange)
  }
}

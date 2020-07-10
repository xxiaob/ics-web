/**
 * 任务显示混入
 */
import { JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'

export default {
  data() {
    return {

    }
  },
  created() {
    this.$EventBus.$on('map-grid-change', this.mapTaskChange) //临时任务考勤状态
  },
  methods: {
    mapTaskChange(data) {
      if (data.type == 1) {
        //岗点考勤状态更新
        // if (data.tasks && data.tasks.length) {
        //   data.tasks.forEach(item => {
        //     let index = this.abnormalGridIds.indexOf(item.id)

        //     //如果异常岗点列表，岗点存在，岗点为正常，则从异常列表移除，如果岗点不存在，异常，则增加
        //     if (index > -1) {
        //       if (item.status == 0) {
        //         this.abnormalGridIds.splice(index, 1)
        //       }
        //     } else if (item.status == 1) {
        //       this.abnormalGridIds.push(item.id)
        //     }
        //   })
        // }
      }
      // this.fitGrids()
    }
  },
  beforeDestroy() {
    // this.clearUsers() //清除基础数据
    // userMouseTool = null
    // //去除事件监听
    this.$EventBus.$off('map-grid-change', this.mapTaskChange)
  }
}

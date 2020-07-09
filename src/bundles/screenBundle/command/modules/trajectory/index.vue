<template>
  <el-dialog :title="user.userName + '-轨迹查询'" :visible.sync="visible" width="1000px" :close-on-click-modal="false" :append-to-body="true">
    <el-form ref="form" :inline="true" :model="form" class="jc-tabfilter-form" size="small" @submit.native.prevent>
      <el-form-item label="日期" prop="date" :rules="rules.NOT_NULL">
        <el-date-picker v-model="form.date" value-format="timestamp" :picker-options="pickerOptions" type="datetimerange" :default-time="['00:00:00','23:59:59']" range-separator="-" start-placeholder="开始日期" end-placeholder="结束日期"></el-date-picker>
      </el-form-item>
      <el-form-item class="jc-tabfilter-btns">
        <el-button type="primary" :loading="loading" @click="onSubmit">查询</el-button>
      </el-form-item>
    </el-form>
    <div class="jc-map-warp" ref="myMap" v-loading="loading"></div>
  </el-dialog>
</template>
<script>
import { NOT_NULL } from '@/libs/rules'
import { JcMap, JcMapMarker } from '@/map'
import { initMoveAnimation, getAddressByPosition } from '@/map/aMap/aMapUtil'
import { getUserHistoryPosition } from '@/api/screen'
import { formatDate } from '@/libs/util'

let myJcMap = null

let startMarker, endMarker, moveMarker //定义开始，结束和移动的marker

export default {
  name: 'ScreenCommandUserDetailTrajectory',
  data() {
    return {
      form: { date: '' },
      loading: false,
      visible: false,
      user: { userId: '56776731599568896', userName: '杨超' },
      rules: { NOT_NULL },
      pickerOptions: {
        shortcuts: [{
          text: '6:00-9:00',
          onClick(picker) {
            window.picker = picker
            const end = new Date()
            const start = new Date()

            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }]
      }
    }
  },
  created() {
    this.$EventBus.$on('screen-user-trajectory', this.initData) //监听显示人员轨迹
    // setTimeout(this.initData, 1000 * 5)
  },
  methods: {
    async initData(user) {
      this.visible = true
      if (!myJcMap) {
        myJcMap = new JcMap()
        await initMoveAnimation() //加载动画组件
        await myJcMap.init(this.$refs.myMap) //等待地图初始化
        this.$nextTick(() => {
          myJcMap.map.setPitch(60) //设置地图倾斜，呈现3D地图
        })
      }
      if (user) {
        this.user = { userId: user.id, userName: user.name }
      }
      this.clearMap()
    },
    clearMap() {
      startMarker = null
      endMarker = null
      if (moveMarker) {
        moveMarker.marker.pauseMove()
        moveMarker = null
      }
      if (myJcMap) {
        myJcMap.clearSign()
      }
    },
    async formatPath(res) {
      console.log('UserHistoryPosition', res)
      /**
       * 位置转换和处理绘图
       * 如果两点间的距离低于5米则进行丢弃，距离超过200米，则进行位置查询
       */
      let path = [] //记录处理的path坐标

      let pathData = {} //记录处理的详细数据

      let activeDot = null //记录查询位置的点数据

      let lastP = null //记录最后一个点

      if (res.data && res.data.length) {
        try {
          lastP = new myJcMap.AMap.LngLat(res.data[0].ln, res.data[0].la)
          activeDot = { p: lastP, s: res.data[0].s, t: formatDate(res.data[0].t) }
          activeDot.d = await getAddressByPosition(lastP)
          path.push(lastP)
          pathData[res.data[0].ln + res.data[0].la] = activeDot
          for (let i = 1; i < res.data.length; i++) {
            let item = res.data[i]

            let p = new myJcMap.AMap.LngLat(item.ln, item.la)

            if (lastP.distance(p) > 5) {
              lastP = p
              if (activeDot.p.distance(p) >= 200) {
                activeDot = { p: lastP, s: item.s, t: formatDate(item.t) }
                activeDot.d = await getAddressByPosition(lastP)
                pathData[item.ln + item.la] = activeDot
              } else {
                pathData[item.ln + item.la] = { p: lastP, s: item.s, t: formatDate(item.t), d: activeDot.d }
              }
              path.push(lastP)
            }
          }
          console.log(path, pathData)
          this.drawPath(path, pathData) //开始绘画轨迹
        } catch (error) {
          console.log(error)
        }
        this.loading = false
      } else {
        this.$message.error('暂无轨迹')
      }
    },
    drawPath(path, pathData) {
      //设置开始点
      startMarker = new JcMapMarker({ map: myJcMap, titleVisible: false, position: path[0], icon: '/static/mapIcons/trajectorystart.png' })
      //设置结束点
      endMarker = new JcMapMarker({ map: myJcMap, titleVisible: false, position: path[path.length - 1], icon: '/static/mapIcons/trajectoryend.png' })

      //画线
      let polyline = new myJcMap.AMap.Polyline({ path, strokeColor: '#0183ff', strokeWeight: 6, showDir: true })

      myJcMap.map.add(polyline) //添加画线

      //设置移动的对象
      moveMarker = new JcMapMarker({ map: myJcMap, titleVisible: false, position: path[0] })

      moveMarker.marker.moveAlong(path, {
        // 每一段的时长
        duration: 200,
        // JSAPI2.0 是否延道路自动设置角度在 moveAlong 里设置
        autoRotation: true
      })
      moveMarker.marker.startMove()//开始动画

      myJcMap.fitView()
    },
    onSubmit() {
      this.clearMap() //情况map
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          getUserHistoryPosition({ userId: this.user.userId, startTime: this.form.date[0], endTime: this.form.date[1] }).then((res) => {
            this.formatPath(res)
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    }
  },
  beforeDestroy() {
    this.clearMap()
    if (myJcMap) {
      myJcMap.destroy()
      myJcMap = null
    }
    this.$EventBus.$off('screen-user-trajectory', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp {
  position: relative;
  width: 100%;
  height: 500px;
}
</style>

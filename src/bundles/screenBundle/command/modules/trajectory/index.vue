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
    <div class="jc-trajectory-warp">
      <div class="jc-trajectory-info">
        <div class="jc-trajectory-speed">{{runInfo.speed}}<span class="jc-trajectory-unit">KM/H</span></div>
        <div class="jc-trajectory-addr" v-text="runInfo.addr"></div>
      </div>
      <div class="jc-map-warp" ref="myMap" v-loading="loading"></div>
      <div class="jc-trajectory-controll">
        <i class="jc-trajectory-item" :class="isPlay ? 'el-icon-video-pause' : 'el-icon-video-play'" :title="isPlay ? '暂停' : '播放'" @click="goPlay"></i>
        <i class="jc-trajectory-item el-icon-refresh" title="重新播放" @click="resetPlay"></i>
      </div>
    </div>
  </el-dialog>
</template>
<script>
import { NOT_NULL } from '@/libs/rules'
import { JcMap, JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'
import { initMoveAnimation, getAddressByPosition } from '@/map/aMap/aMapUtil'
import { getUserHistoryPosition } from '@/api/screen'
import { formatDate } from '@/libs/util'

let today = formatDate(null, true) //今天日期

let myJcMap = null

let startMarker, endMarker, moveMarker //定义开始，结束和移动的marker

let path = [] //记录处理的path坐标

let pathData = {} //记录处理的详细数据

//获取事件
let getTime = function (date, time1, time2) {
  let startTime = today, endTime = today

  if (date && date.length == 2) {
    startTime = formatDate(date[0], true)
    endTime = formatDate(date[1], true)
  }
  return [new Date(startTime + ' ' + time1).getTime(), new Date(endTime + ' ' + time2).getTime()]
}

export default {
  name: 'ScreenCommandUserDetailTrajectory',
  data() {
    return {
      form: { date: '' },
      loading: false,
      visible: false,
      isPlay: false,
      user: { userId: '', userName: '' }, //用户信息
      runInfo: { addr: '--', speed: 0 }, //运行信息
      rules: { NOT_NULL },
      pickerOptions: {
        shortcuts: [{
          text: '6:00 ~ 9:00',
          onClick(picker) {
            picker.$emit('pick', getTime(picker.value, '6:00:00', '9:00:00'))
          }
        }, {
          text: '9:00 ~ 12:00',
          onClick(picker) {
            picker.$emit('pick', getTime(picker.value, '9:00:00', '12:00:00'))
          }
        }, {
          text: '12:00 ~ 15:00',
          onClick(picker) {
            picker.$emit('pick', getTime(picker.value, '12:00:00', '15:00:00'))
          }
        }, {
          text: '15:00 ~ 18:00',
          onClick(picker) {
            picker.$emit('pick', getTime(picker.value, '15:00:00', '18:00:00'))
          }
        }]
      }
    }
  },
  created() {
    this.$EventBus.$on('screen-user-trajectory', this.initData) //监听显示人员轨迹
    // setTimeout(() => {
    //   this.initData({ id: '56783818509516800', name: '李向玉江宁' })
    // }, 5000)
  },
  methods: {
    async initData(user) {
      this.visible = true
      if (!myJcMap) {
        myJcMap = new JcMap()
        await initMoveAnimation() //加载动画组件
        await myJcMap.init(this.$refs.myMap) //等待地图初始化
        this.$nextTick(() => {
          myJcMap.map.setPitch(45) //设置地图倾斜，呈现3D地图
        })
      }
      if (user) {
        this.user = { userId: user.id, userName: user.name }
      }
      this.clearMap()
      this.form.date = [new Date(today + ' 00:00:00').getTime(), new Date(today + ' 23:59:59').getTime()]
    },
    clearMap() {
      this.isPlay = false
      startMarker = null
      endMarker = null
      if (moveMarker) {
        moveMarker.marker.stopMove()
        moveMarker = null
      }
      path = [] //记录处理的path坐标
      pathData = {} //记录处理的详细数据
      this.runInfo = { addr: '--', speed: 0 } //设置运行信息
      if (myJcMap) {
        myJcMap.clearSign()
      }
    },
    goPlay() {
      if (moveMarker) {
        if (this.isPlay) {
          moveMarker.marker.stopMove()//暂停动画
        } else {
          moveMarker.marker.resumeMove()//开始动画
        }
        this.isPlay = !this.isPlay
      }
    },
    resetPlay() {
      if (moveMarker) {
        moveMarker.marker.off('moving', this.markerMoving)
        moveMarker.marker.stopMove()//开始动画
        moveMarker.hide()
      }
      if (path.length) {
        //设置移动的对象
        moveMarker = new JcMapMarker({ map: myJcMap, position: path[0], icon: '/static/mapIcons/trajectorycar.png', mapStyle: markerStyle.TRAJECTORY })

        moveMarker.marker.moveAlong(path, { duration: 200, autoRotation: true })
        moveMarker.marker.stopMove()//暂停动画
        moveMarker.marker.on('moving', this.markerMoving)
        if (this.isPlay) {
          this.isPlay = false
        }
      }
    },
    markerMoving(e) {
      let lastP = e.passedPath[e.passedPath.length - 1]

      let key = this.getKeyByLngLat(lastP.lng, lastP.lat)

      if (key != this.runInfo.key && pathData[key]) {
        this.runInfo = { addr: pathData[key].d, speed: pathData[key].s, key } //设置运行信息
        this.setMarketContent() //更新图标
      }
    },
    setMarketContent() {
      let icon = moveMarker.icon //设置当前icon

      let speed = parseFloat(this.runInfo.speed)

      if (speed < 10) {
        icon = '/static/mapIcons/trajectoryuser.png'
      } else if (speed < 20) {
        icon = '/static/mapIcons/trajectorybicycle.png'
      } else if (speed < 40) {
        icon = '/static/mapIcons/trajectorymtcycle.png'
      } else {
        icon = '/static/mapIcons/trajectorycar.png'
      }
      if (icon != moveMarker.icon) {
        moveMarker.icon = icon
        moveMarker.setContent() //重设内容
      }
    },
    async formatPath(res) {
      console.log('UserHistoryPosition', res)
      /**
       * 位置转换和处理绘图
       * 如果两点间的距离低于10米则进行丢弃，距离超过200米，则进行位置查询
       */
      let activeDot = null //记录查询位置的点数据

      let lastP = null //记录最后一个点

      if (res.data && res.data.length) {
        try {
          lastP = new myJcMap.AMap.LngLat(res.data[0].ln, res.data[0].la)
          activeDot = { p: lastP, s: res.data[0].s, t: formatDate(res.data[0].t) }
          activeDot.d = await getAddressByPosition(lastP)
          path.push(lastP)
          pathData[this.getKeyByLngLat(res.data[0].ln, res.data[0].la)] = activeDot
          for (let i = 1; i < res.data.length; i++) {
            let item = res.data[i]

            let p = new myJcMap.AMap.LngLat(item.ln, item.la)

            if (lastP.distance(p) > 10) {
              lastP = p
              if (activeDot.p.distance(p) >= 200) {
                activeDot = { p: lastP, s: item.s, t: formatDate(item.t) }
                activeDot.d = await getAddressByPosition(lastP)
                pathData[this.getKeyByLngLat(item.ln, item.la)] = activeDot
              } else {
                pathData[this.getKeyByLngLat(item.ln, item.la)] = { p: lastP, s: item.s || 0, t: formatDate(item.t), d: activeDot.d }
              }
              path.push(lastP)
            }
          }
          console.log(path, pathData)
          this.drawPath() //开始绘画轨迹
        } catch (error) {
          console.log(error)
        }
      } else {
        this.$message.error('暂无轨迹')
      }
      this.loading = false
    },
    drawPath() {
      //设置开始点
      startMarker = new JcMapMarker({ map: myJcMap, titleVisible: false, position: path[0], icon: '/static/mapIcons/trajectorystart.png' })
      //设置结束点
      endMarker = new JcMapMarker({ map: myJcMap, titleVisible: false, position: path[path.length - 1], icon: '/static/mapIcons/trajectoryend.png' })

      //画线
      let polyline = new myJcMap.AMap.Polyline({ path, strokeColor: '#0183ff', strokeWeight: 6, showDir: true })

      myJcMap.map.add(polyline) //添加画线

      this.resetPlay() //设置动画对象

      myJcMap.map.setFitView(null, false, [0, 0, 0, 0], 20)
    },
    getKeyByLngLat(lng, lat) {
      //根据经纬度去计算key
      return parseFloat(lng).toFixed(6) + ',' + parseFloat(lat).toFixed(6)
    },
    onSubmit() {
      this.clearMap() //情况map
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          getUserHistoryPosition({ userId: this.user.userId, startTimestamp: this.form.date[0], endTimestamp: this.form.date[1] }).then((res) => {
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
.jc-trajectory-warp {
  position: relative;
  height: 500px;
}
.jc-map-warp {
  position: relative;
  width: 100%;
  height: 100%;
}
$jc-item-width: 36px;
.jc-trajectory-controll {
  position: absolute;
  top: 0;
  right: 0;
  height: $jc-item-width * 2;
  bottom: 0;
  margin: auto 0;
  z-index: 8;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  text-align: center;
}
.jc-trajectory-item {
  display: block;
  width: $jc-item-width;
  height: $jc-item-width;
  line-height: $jc-item-width;
  color: $jc-color-white;
  cursor: pointer;
  font-size: $jc-font-size-large;
  transition: font-size 0.3s;
  will-change: font-size;

  &:hover,
  &.jc-active {
    font-size: $jc-font-size-larger;
  }
}
.jc-trajectory-info {
  position: absolute;
  top: $jc-default-dis;
  left: 50%;
  text-align: center;
  width: 300px;
  transform: translateX(-50%);
  color: $jc-color-white;
  z-index: 8;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  .jc-trajectory-speed {
    font-size: $jc-font-size-larger;
    line-height: 28px;
  }
  .jc-trajectory-unit {
    font-size: $jc-font-size-smaller;
    padding-left: 4px;
  }
  .jc-trajectory-addr {
    line-height: 24px;
  }
}
</style>

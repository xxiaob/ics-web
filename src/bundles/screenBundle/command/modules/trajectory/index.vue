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
        <div class="jc-trajectory-type" :class="runInfo.style"></div>
        <div class="jc-flex-con">
          <div class="jc-trajectory-text">{{runInfo.speed}}<span class="jc-trajectory-unit">KM/H</span><span class="jc-trajectory-time" v-text="runInfo.time"></span></div>
          <div class="jc-trajectory-text" v-text="runInfo.addr"></div>
        </div>
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
      runInfo: { addr: '--', speed: 0, style: 'jc-trajectory-walk', time: '' }, //运行信息
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
        await myJcMap.init(this.$refs.myMap, { pitch: 45 }) //等待地图初始化
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
      this.runInfo = { addr: '--', speed: 0, style: 'jc-trajectory-walk', time: '' } //设置运行信息
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
        moveMarker = new JcMapMarker({ map: myJcMap, position: path[0], icon: '/static/mapIcons/trajectorysign.png', size: [50, 50], zIndex: 9 })

        moveMarker.marker.moveAlong(path, { duration: 500, autoRotation: true, aniInterval: 10 })
        moveMarker.marker.stopMove()//暂停动画
        moveMarker.marker.on('moving', this.markerMoving)
        if (this.isPlay) {
          this.isPlay = false
        }
      }
    },
    markerMoving(e) {
      e.target.setzIndex(9)
      let lastP = e.passedPath[e.passedPath.length - 1]

      let key = this.getKeyByLngLat(lastP.lng, lastP.lat)

      if (key != this.runInfo.key && pathData[key]) {
        //更新图标
        let style = 'jc-trajectory-walk'

        let speed = parseFloat(pathData[key].s)

        if (speed > 20) {
          style = 'jc-trajectory-car'
        } else if (speed > 5) {
          style = 'jc-trajectory-elcicle'
        }
        this.runInfo = { addr: pathData[key].d, speed: pathData[key].s, key, style, time: pathData[key].t } //设置运行信息
      }
    },
    async formatPath(res) {
      console.log('UserHistoryPosition', res)
      /**
       * 位置转换和处理绘图
       * 如果两点间的距离低于20米则进行丢弃，距离超过1000米，则进行位置查询
       */
      let activeDot = null //记录查询位置的点数据

      let lastP = null //记录最后一个点

      if (res.data && res.data.length > 1) {
        try {
          lastP = new myJcMap.AMap.LngLat(res.data[0].ln, res.data[0].la)
          activeDot = { p: lastP, s: res.data[0].s, t: formatDate(res.data[0].t) }
          activeDot.d = await getAddressByPosition(lastP)
          path.push(lastP)
          pathData[this.getKeyByLngLat(res.data[0].ln, res.data[0].la)] = activeDot
          for (let i = 1; i < res.data.length; i++) {
            let item = res.data[i]

            let p = new myJcMap.AMap.LngLat(item.ln, item.la)

            if (lastP.distance(p) > 20) {
              lastP = p
              if (activeDot.p.distance(p) >= 1000) {
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
  width: 380px;
  transform: translateX(-50%);
  color: $jc-color-white;
  z-index: 8;
  background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.6);
  border-radius: $jc-border-radius-base;
  padding: $jc-default-dis/2 $jc-default-dis/2 $jc-default-dis/2 0;

  display: flex;

  .jc-trajectory-type {
    position: relative;
    width: 66px;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: $jc-default-dis/2;
    &::after {
      content: "";
      position: absolute;
      right: 0;
      top: 50%;
      transform: translateY(-50%);
      height: 28px;
      width: 1px;
      background-color: rgba($color: $jc-menu-bg-color, $alpha: 0.8);
    }
    &.jc-trajectory-walk {
      background-image: url(./assets/walk.png);
    }
    &.jc-trajectory-car {
      background-image: url(./assets/car.png);
    }
    &.jc-trajectory-elcicle {
      background-image: url(./assets/elcicle.png);
    }
  }

  .jc-trajectory-text {
    font-size: $jc-font-size-base;
    line-height: 22px;
  }

  .jc-trajectory-unit {
    font-size: $jc-font-size-smaller;
    padding-left: 4px;
  }
  .jc-trajectory-time {
    float: right;
    font-size: $jc-font-size-smaller;
    opacity: 0.8;
  }
}
</style>

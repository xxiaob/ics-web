<template>
  <div class="jc-map-space">
    <div class="jc-map-warp" ref="myMap"></div>
  </div>
</template>
<script>
import { getAMapLoader } from '@/map/aMap/aMapUtil'
import { organizationList } from '@/api/organization'
import { areaList } from '@/api/area'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { orgBoundariesFormat } from '@/libs/apiFormat'

let myJcMap, AMap, object3Dlayer //个人 map 对象,存储Amap对象,存储3D图层

let orgAreas = {} //存储区域信息

let colors = ['#0083ff', '#00c0ff', '#00a9ff', '#0072ff'], activeColor = '#00fcff'

export default {
  name: 'ScreenDataCenterContentMapData',
  data() {
    return {
      project: null,
      orgId: null,
      mapParams: Object.freeze({ baseCoefficient: 0.000005, activeCoefficient: 0.000006 }), //记录高度基础和抬起的高度，不用于vue watch
      showAreas: [], //存储所有显示的区域
      index: 0, //当前循环到第几个
      showNum: 4, //最多每次显示的个数
      loopAreas: [] //存储 循环的区域
    }
  },
  created() {
    this.$EventBus.$on('data-statistics-init-success', this.initData) //监听基础数据初始化完成
  },
  methods: {
    async initData(project) {
      //获取组织边界去显示，如果项目orgId存在，则使用项目的orgId去获取，如果不存在。则获取orgId
      this.project = project
      this.orgId = this.project.orgId

      if (!this.orgId) {
        const res = await organizationList()

        this.orgId = res[0].orgId
      }
      //初始化地图设置
      let AMapLoader = getAMapLoader() //获取amap 对象

      AMap = await AMapLoader.load({ key: process.env.aMapConfig.accessKey, plugins: ['Map3D', 'AMap.Marker', 'AMap.GeometryUtil'] })

      object3Dlayer = new AMap.Object3DLayer({ opacity: 0.84 })

      //, dragEnable: false, zoomEnable: false, rotateEnable: false, keyboardEnable: false
      myJcMap = new AMap.Map(this.$refs.myMap, {
        mapStyle: 'amap://styles/1b8b05391432855bd2473c0d1d3628b5', viewMode: '3D', features: ['bg', 'road'], pitch: 40, skyColor: 'rgba(0,0,0,0)'
      })
      this.clearMapSign() //清除地图标记
      // 设置光照
      myJcMap.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.6)
      myJcMap.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 0.88)

      this.$EventBus.$emit('data-statistics-amap-success', this.orgId) //通知地图加载完成

      // this.orgId = '37621502421499904' //测试组织边界使用
      this.getOrgAreas(this.orgId) //获取组织区域信息
    },
    async getOrgAreas(orgId) {
      //获取组织区域信息
      try {
        let result

        if (PROJECT_TYPES.EmergencySupport == this.project.projectType) {
          result = await areaList({ orgId, orgSearchType: AREAS_TYPE.OWN, searchType: AREAS_SEARCH_TYPE.ORG })
        } else {
          result = await areaList({ orgId, orgSearchType: AREAS_TYPE.OWN_AND_CHILD, searchType: AREAS_SEARCH_TYPE.ORG })
        }

        if (result && result.length) {
          let measureAreas = 0 //记录除自己之外所有区域的面积总和

          let centerPosition = { lng: 0, lat: 0, length: 0 } //记录有边界区域的数量

          let lnglats //获取最父级边界

          result.forEach(item => {
            let orgInfo = { orgId: item.orgId, center: null, areaCode: item.areaCode, areaId: item.areaId, areaName: item.areaName, measureAreas: 0 }

            //中心点存在则去计算边界等
            if (item.center) {
              orgInfo.center = item.center.split(',')

              orgInfo.boundaries = orgBoundariesFormat(item.withoutRadiusReqs, AMap) //处理边界数据

              //设置边界，去处理信息
              if (orgInfo.boundaries && orgInfo.boundaries.length) {
                orgInfo.boundaries.forEach(boundary => {
                  let boundaryLnglats = this.getAreaBundleLnglats(boundary.hasInPath ? boundary.path[0] : boundary.path)

                  //设置边界 和 父级最大边界
                  orgInfo.lnglats = this.calcBundleLnglats(orgInfo.lnglats, boundaryLnglats)
                  lnglats = this.calcBundleLnglats(lnglats, orgInfo.lnglats)

                  //计算边界面积
                  orgInfo.measureAreas += AMap.GeometryUtil.ringArea(boundary.hasInPath ? boundary.path[0] : boundary.path)

                  if (item.orgId != this.orgId) {
                    //如果不是当前组织，则累加面积
                    measureAreas += orgInfo.measureAreas
                  }
                })
                //如果该组织有区域边界，则统计需要绘图的中心点
                centerPosition.lng += orgInfo.center[0] * 1
                centerPosition.lat += orgInfo.center[1] * 1
                centerPosition.length += 1

                //存储需要显示的组织
                this.showAreas.push({ orgId: orgInfo.orgId })
              }
            }
            orgAreas[item.orgId] = orgInfo
          })

          //最后处理最父级组织的数据
          let parentOrg = orgAreas[this.orgId]

          parentOrg.measureAreas = parentOrg.measureAreas > 0 ? parentOrg.measureAreas : measureAreas
          parentOrg.lnglats = parentOrg.lnglats ? parentOrg.lnglats : lnglats
          if (centerPosition.length) {
            parentOrg.centerPosition = new AMap.LngLat(centerPosition.lng / centerPosition.length, centerPosition.lat / centerPosition.length)
          }

          console.log('数据大屏，组织边界信息', orgAreas)

          this.drawMapAreas() //去绘图
        }
      } catch (error) {
        console.log(error)
      }
    },
    drawMapAreas() {
      //绘图
      if (this.showAreas.length < 1) {
        return
      }
      //如果需要显示的区域数量大于一，则需要过滤掉自己
      if (this.showAreas.length > 1) {
        let index = this.showAreas.findIndex(item => item.orgId == this.orgId)

        if (index > -1) {
          this.showAreas.splice(index, 1)
        }
      }
      let markers = [] //存储所有区域的marker

      let parentOrg = orgAreas[this.orgId] //父级区域

      for (let i = 0; i < this.showAreas.length; i++) {
        let keyOrgId = this.showAreas[i].orgId

        let item = orgAreas[this.showAreas[i].orgId]

        //如果非最父级组织或需要显示的组织只有一个
        if (this.orgId != keyOrgId || this.showAreas.length == 1) {
          item.marker = new AMap.Marker({ position: item.center, anchor: 'middle-left', content: `<div class="jc-data-statistics-content">${item.areaName}</div>` })

          markers.push(item.marker)
        }

        this.showAreas[i].dis = AMap.GeometryUtil.distance(parentOrg.centerPosition, new AMap.LngLat(item.center[0], item.center[1]))
      }

      //对显示的数组做排序
      this.showAreas.sort((a, b) => a.dis - b.dis) //先进行记录小到大排序

      let loopAreas = [], loopIndex = -1

      //对数组进行分组
      this.showAreas.forEach((item, index) => {
        if (index % this.showNum == 0) {
          loopIndex += 1
        }

        if (!loopAreas[loopIndex]) {
          loopAreas[loopIndex] = []
        }
        loopAreas[loopIndex].push(item)
      })

      console.log('处理前的loopAreas：', loopAreas)
      //对每个分数组进行排序
      let allAreas = [] //存储排序后的组织数据

      loopAreas.forEach(loopArea => {
        loopArea.sort(function (a, b) {
          let aOrg = orgAreas[a.orgId], bOrg = orgAreas[b.orgId]

          return bOrg.center[0] * 1 - aOrg.center[0] * 1
        })
        allAreas.push(...loopArea)
      })

      //进行合并组合进行显示
      console.log('处理后的loopAreas：', loopAreas, allAreas)

      let height = Math.ceil(parentOrg.measureAreas * this.mapParams.baseCoefficient)//设置高度

      allAreas.forEach((item, index) => {
        let areaItem = orgAreas[item.orgId]

        let prisms = [] //存储当前组织3D对象

        let color = colors[index % colors.length] //设置颜色

        areaItem.boundaries.forEach(boundary => {
          let prism = new AMap.Object3D.Prism({ path: boundary.path, height, color })

          prism.transparent = true
          prisms.push(prism)
          object3Dlayer.add(prism) //添加图层
        })
        areaItem.prisms = prisms
      })
      myJcMap.add(object3Dlayer)//添加到地图
      myJcMap.add(markers) //添加点标记
      //设置自适应显示
      let lnglats = parentOrg.lnglats//设置边距

      myJcMap.setBounds(new AMap.Bounds([lnglats.lng.min, lnglats.lat.min], [lnglats.lng.max, lnglats.lat.max * 0.992]))
    },
    calcBundleLnglats(target1, target2) {
      if (target1) {
        target1.lng.max = target2.lng.max > target1.lng.max ? target2.lng.max : target1.lng.max
        target1.lng.min = target2.lng.min < target1.lng.min ? target2.lng.min : target1.lng.min
        target1.lat.max = target2.lat.max > target1.lat.max ? target2.lat.max : target1.lat.max
        target1.lat.min = target2.lat.min < target1.lat.min ? target2.lat.min : target1.lat.min
        return target1
      }
      return target2
    },
    getAreaBundleLnglats(path) {
      //获取区域东南西北边界
      let lnglats = { lng: { max: null, min: null }, lat: { max: null, min: null } }

      path.forEach(item => {
        if (!lnglats.lng.max || item.lng > lnglats.lng.max) {
          lnglats.lng.max = item.lng
        }
        if (!lnglats.lng.min || item.lng < lnglats.lng.min) {
          lnglats.lng.min = item.lng
        }
        if (!lnglats.lat.max || item.lat > lnglats.lat.max) {
          lnglats.lat.max = item.lat
        }
        if (!lnglats.lat.min || item.lat < lnglats.lat.min) {
          lnglats.lat.min = item.lat
        }
      })

      return lnglats
    },
    clearMapSign() {
      let complete = false //防止map complete事件触发多次

      myJcMap.on('complete', () => {
        if (!complete) {
          // 地图图块加载完成后触发
          let mapEl = this.$refs.myMap

          let logoEL = mapEl.querySelector('.amap-logo')

          let amapCopyrightEl = mapEl.querySelector('.amap-copyright')

          logoEL.parentNode.removeChild(logoEL)
          amapCopyrightEl.parentNode.removeChild(amapCopyrightEl)
          complete = true
        }
      })
    },
    getMyJcMap() {
      return myJcMap//获取地图
    }
  },
  beforeDestroy() {
    if (myJcMap) {
      myJcMap.destroy()
      myJcMap = null
    }
    AMap = null
    object3Dlayer = null
    orgAreas = {}
    this.$EventBus.$off('data-statistics-init-success', this.initData)
  }
}
</script>
<style lang="scss" scoped>
.jc-map-space {
  position: relative;
  padding: $jc-default-dis;
  background: url(./assets/map-bg.png) no-repeat center;
  background-size: 100% 100%;
  width: 100%;
  height: 100%;
}
.jc-map-warp {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>
<style lang="scss">
.jc-data-statistics-content {
  position: relative;
  width: 100px;
  height: 20px;
  line-height: 20px;
  color: #00fffc;
  font-size: $jc-font-size-base;
  @include jc-text-warp();
  &:before {
    display: inline-block;
    content: " ";
    width: 8px;
    height: 8px;
    background-color: #00fffc;
    border-radius: 50%;
    margin-right: 4px;
    margin-left: -6px;
  }
}
</style>

<template>
  <div class="jc-map-space">
    <div class="jc-map-warp" ref="myMap"></div>
    <!-- 地图模块切换 -->
    <div class="jc-model-switch">
      <div class="jc-model-item">指挥区域</div>
      <div class="jc-model-item">事件热力</div>
      <div class="jc-model-item">事件聚合</div>
    </div>
    <!-- 维度切换 -->
    <div class="jc-dimension-switch"></div>
  </div>
</template>
<script>
import { getAMapLoader } from '@/map/aMap/aMapUtil'
import { organizationList } from '@/api/organization'
import { areaList } from '@/api/area'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { orgBoundariesFormat } from '@/libs/apiFormat'
import CommandAreaMixins from './modules/mixins/commandAreaMixins'

let myJcMap, AMap //个人 map 对象,存储Amap对象,存储3D图层，存储点标记

let orgAreas = {} //存储区域信息

export default {
  name: 'ScreenDataCenterContentMapData',
  mixins: [CommandAreaMixins],
  data() {
    return {
      project: null,
      orgId: null
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

      myJcMap = new AMap.Map(this.$refs.myMap, {
        mapStyle: 'amap://styles/1b8b05391432855bd2473c0d1d3628b5', viewMode: '3D', features: ['bg', 'road'], pitch: 40, skyColor: 'rgba(0,0,0,0)'
        // ,dragEnable: false, zoomEnable: false, rotateEnable: false, keyboardEnable: false
      })
      this.clearMapSign() //清除地图标记
      // 设置光照
      myJcMap.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.6)
      myJcMap.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1)

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
          let lnglats //获取最父级边界

          result.forEach(item => {
            let orgInfo = { orgId: item.orgId, center: null, areaCode: item.areaCode, areaId: item.areaId, areaName: item.areaName }

            //中心点存在则去计算边界等
            if (item.center) {
              let center = item.center.split(',')

              orgInfo.center = [center[0] * 1, center[1] * 1]

              orgInfo.boundaries = orgBoundariesFormat(item.withoutRadiusReqs, AMap) //处理边界数据

              //设置边界，去处理信息
              if (orgInfo.boundaries && orgInfo.boundaries.length) {
                orgInfo.boundaries.forEach(boundary => {
                  let boundaryLnglats = this.getAreaBundleLnglats(boundary.hasInPath ? boundary.path[0] : boundary.path)

                  //设置边界 和 父级最大边界
                  orgInfo.lnglats = this.calcBundleLnglats(orgInfo.lnglats, boundaryLnglats)
                })

                if (item.orgId != this.orgId) {
                  lnglats = this.calcBundleLnglats(lnglats, orgInfo.lnglats)//如果不是当前组织，则计算最大边界
                }

                //存储需要显示的组织
                this.showAreas.push({ orgId: orgInfo.orgId, center: Object.freeze(orgInfo.center) })
              }
            }
            orgAreas[item.orgId] = orgInfo
          })

          //最后处理最父级组织的数据
          let parentOrg = orgAreas[this.orgId]

          /**
           * 处理显示使用的参数，
           * 如果存在下级区域，则用下级区域参数，如果下级不存在，则使用父级显示
           * 计算面积 AMap.GeometryUtil.ringArea
           */
          if (lnglats) {
            parentOrg.totalLnglats = lnglats
          } else {
            parentOrg.totalLnglats = parentOrg.lnglats
          }

          if (parentOrg.totalLnglats) {
            let totalLnglats = parentOrg.totalLnglats

            parentOrg.measureAreas = AMap.GeometryUtil.ringArea([[totalLnglats.lng.min, totalLnglats.lat.max], [totalLnglats.lng.max, totalLnglats.lat.max],
              [totalLnglats.lng.max, totalLnglats.lat.min], [totalLnglats.lng.min, totalLnglats.lat.min]]) //计算边框的面积

            parentOrg.centerPosition = new AMap.LngLat((totalLnglats.lng.min + totalLnglats.lng.max) / 2, (totalLnglats.lat.min + totalLnglats.lat.max) / 2)

            //设置矩形将内容框起来，用于自适应显示
            parentOrg.rectangle = new AMap.Rectangle({ map: myJcMap, strokeOpacity: 0, fillOpacity: 0, zIndex: 1,
              bounds: new AMap.Bounds([totalLnglats.lng.min, totalLnglats.lat.min], [totalLnglats.lng.max, totalLnglats.lat.max]) })

            //计算信息窗四个位置的坐标点
            this.orgInfoPosition.leftTop = [totalLnglats.lng.min, (totalLnglats.lat.max + parentOrg.centerPosition.lat) / 2]
            this.orgInfoPosition.rightTop = [totalLnglats.lng.max, (totalLnglats.lat.max + parentOrg.centerPosition.lat) / 2]
            this.orgInfoPosition.leftBottom = [totalLnglats.lng.min, (totalLnglats.lat.min + parentOrg.centerPosition.lat) / 2]
            this.orgInfoPosition.rightBottom = [totalLnglats.lng.max, (totalLnglats.lat.min + parentOrg.centerPosition.lat) / 2]
          }

          console.log('数据大屏，组织边界信息', orgAreas)

          this.initCommandArea() //去初始化指挥区域显示
        }
      } catch (error) {
        console.log(error)
      }
    },
    calcBundleLnglats(target1, target2) {
      if (target1) {
        target1.lng.max = target2.lng.max > target1.lng.max ? target2.lng.max : target1.lng.max
        target1.lng.min = target2.lng.min < target1.lng.min ? target2.lng.min : target1.lng.min
        target1.lat.max = target2.lat.max > target1.lat.max ? target2.lat.max : target1.lat.max
        target1.lat.min = target2.lat.min < target1.lat.min ? target2.lat.min : target1.lat.min
      } else {
        target1 = { lng: { max: target2.lng.max, min: target2.lng.min }, lat: { max: target2.lat.max, min: target2.lat.min } }
      }

      return target1
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
    },
    getAMap() {
      return AMap
    },
    getOrgAreasData() {
      return orgAreas
    }
  },
  beforeDestroy() {
    if (myJcMap) {
      myJcMap.destroy()
      myJcMap = null
    }
    AMap = null
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
  z-index: 1;
}
.jc-model-switch {
  position: absolute;
}
</style>
<style lang="scss">
@mixin jc-map-animation($name, $trans) {
  @keyframes #{$name} {
    from {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3) $trans;
    }
    from,
    50%,
    60%,
    70%,
    80%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }

    50% {
      opacity: 0;
      transform: scale3d(0.3, 0.3, 0.3) $trans;
    }

    60% {
      transform: scale3d(1.1, 1.1, 1.1) $trans;
    }

    70% {
      transform: scale3d(0.9, 0.9, 0.9) $trans;
    }

    80% {
      opacity: 1;
      transform: scale3d(1.03, 1.03, 1.03) $trans;
    }

    90% {
      transform: scale3d(0.97, 0.97, 0.97) $trans;
    }

    to {
      opacity: 1;
      transform: scale3d(1, 1, 1) $trans;
    }
  }
}
//增加动画样式
@include jc-map-animation(left-top-in, translate3d(-50%, -20px, 0));
@include jc-map-animation(left-bottom-in, translate3d(-50%, 20px, 0));
@include jc-map-animation(right-top-in, translate3d(50%, -20px, 0));
@include jc-map-animation(right-bottom-in, translate3d(50%, 20px, 0));
.jc-data-statistics-warp {
  position: relative;
  width: 154px;
  height: 180px;
  text-align: center;
  background: url(./assets/info-bg.png) no-repeat center;
  background-size: 100% 100%;
  font-size: 12px;
  color: #feffff;
  animation-duration: 2.4s;

  &:after {
    position: absolute;
    content: "";
    top: 50%;
    width: 3px;
    height: 20px;
    background-color: #14edfc;
  }
  &.jc-leftTop {
    animation-name: left-top-in;
    transform: translate3d(-50%, -20px, 0);
    &:after {
      right: -2px;
      transform: translateY(10px);
    }
  }
  &.jc-leftBottom {
    animation-name: left-bottom-in;
    transform: translate3d(-50%, 20px, 0);
    &:after {
      right: -2px;
      transform: translateY(-30px);
    }
  }
  &.jc-rightTop {
    animation-name: right-top-in;
    transform: translate3d(50%, -20px, 0);
    &:after {
      left: -2px;
      transform: translateY(10px);
    }
  }
  &.jc-rightBottom {
    animation-name: right-bottom-in;
    transform: translate3d(50%, 20px, 0);
    &:after {
      left: -2px;
      transform: translateY(-30px);
    }
  }
  .jc-ds-info-title {
    position: relative;
    display: inline-block;
    max-width: 100%;
    padding: 0 $jc-default-dis;
    height: 34px;
    line-height: 34px;
    font-size: 14px;
    text-align: center;
    overflow: hidden;
    text-shadow: $jc-color-white 0 0 12px;
    @include jc-text-warp;
    &:before,
    &:after {
      content: "";
      position: absolute;
      width: 5px;
      height: 5px;
      top: 50%;
      transform: translateY(-50%);
      border-radius: 50%;
      background-color: $jc-color-white;
    }
    &:before {
      left: 9px;
    }
    &:after {
      right: 9px;
    }
  }
  .jc-ds-info-item {
    padding: 0 $jc-default-dis;
    text-align: left;
    span {
      color: #14edfc;
      height: 22px;
      line-height: 22px;
    }
  }
}
</style>

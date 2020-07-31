<template>
  <div class="jc-map-space">
    <div class="jc-map-warp" ref="myMap"></div>
  </div>
</template>
<script>
import { getAMapLoader } from '@/map/aMap/aMapUtil'
import { organizationList } from '@/api/organization'
import { areaList } from '@/api/area'
import { getAreaDataStatistics } from '@/api/dataScreen'
import { PROJECT_TYPES } from '@/constant/Dictionaries'
import { AREAS_TYPE, AREAS_SEARCH_TYPE } from '@/constant/CONST'
import { orgBoundariesFormat } from '@/libs/apiFormat'

let myJcMap, AMap, object3Dlayer, labelsLayer //个人 map 对象,存储Amap对象,存储3D图层，存储点标记

let orgAreas = {} //存储区域信息

let baseOpacity = 0.6, activeOpacity = 0.8 //透明度

let colors = ['0083ff', '00c0ff', '00a9ff', '0072ff', '00fcff']

let mapParams = { baseCoefficient: 0.0000032, activeCoefficient: 1.8, minHeight: 2400, animationTimes: 10 } //设置一些地图参数

export default {
  name: 'ScreenDataCenterContentMapData',
  data() {
    return {
      project: null,
      orgId: null,
      mapParams: { baseHeight: 0, activeHeight: 0, dis: 0 }, //记录高度基础和抬起的高度
      showAreas: [], //存储所有显示的区域
      index: 0, //当前循环到第几个
      orgIds: [], //需要查询的组织id数组
      orgData: {}, //存储组织信息
      orgInfoPosition: {}, //记录四个位置的坐标
      orgInterval: null, //存储获取数据定时器
      loopAreas: [], //存储 循环的区域
      loopInterval: null,
      loopTimes: 1000 * 20 //循环时间
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

      object3Dlayer = new AMap.Object3DLayer({ opacity: 1, zIndex: 8 })

      labelsLayer = new AMap.LabelsLayer({ visible: true, zIndex: 9, collision: false })

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

      //先进行排序去显示
      this.showAreas.sort(function (a, b) {
        let aOrg = orgAreas[a.orgId], bOrg = orgAreas[b.orgId]

        return bOrg.center[0] * 1 - aOrg.center[0] * 1
      })

      //计算高度和选中高度以及每次变化的高度
      this.mapParams.baseHeight = mapParams.minHeight / mapParams.baseCoefficient > parentOrg.measureAreas ? mapParams.minHeight : Math.ceil(parentOrg.measureAreas * mapParams.baseCoefficient)
      this.mapParams.activeHeight = Math.ceil(this.mapParams.baseHeight * mapParams.activeCoefficient)
      this.mapParams.dis = Math.ceil((this.mapParams.activeHeight - this.mapParams.baseHeight) / mapParams.animationTimes)

      for (let i = 0; i < this.showAreas.length; i++) {
        let keyOrgId = this.showAreas[i].orgId

        let item = orgAreas[this.showAreas[i].orgId]

        item.height = this.mapParams.baseHeight

        //如果非最父级组织或需要显示的组织只有一个
        if (this.orgId != keyOrgId || this.showAreas.length == 1) {
          this.orgIds.push(keyOrgId) //存储需要查询信息的组织id
          item.marker = new AMap.LabelMarker({ position: item.center, zooms: [3, 20], icon: {
            image: '/static/mapIcons/map-dot.png', anchor: 'center'
          }, text: {
            content: item.areaName,
            direction: 'right',
            offset: [-14, -2],
            style: { fontSize: 13, fillColor: '#00fcff', fontWeight: 'bold', fontFamily: '微软雅黑', strokeColor: '#00fcff' }
          } })
          markers.push(item.marker)

          let prisms = [] //存储当前组织3D对象

          item.color = AMap.Util.rgbHex2Rgba(colors[i % colors.length]) //设置颜色

          //循环增加每个组织的区域
          for (let j = 0; j < item.boundaries.length; j++) {
            let prism = new AMap.Object3D.Prism({ path: item.boundaries[j].path, height: this.mapParams.baseHeight,
              color: item.color.replace('1.00', baseOpacity) })

            prism.transparent = true
            prisms.push(prism)
            object3Dlayer.add(prism) //添加图层
          }
          item.prisms = prisms
        }

        this.showAreas[i].dis = AMap.GeometryUtil.distance(parentOrg.centerPosition, new AMap.LngLat(item.center[0], item.center[1]))
      }

      myJcMap.add(object3Dlayer)//添加到地图
      labelsLayer.add(markers)
      myJcMap.add(labelsLayer) //添加点标记

      window.orgAreas = orgAreas

      //设置自适应显示
      myJcMap.setFitView(null, true, [0, 1, 1, 1]) //设置自适应显示

      //对显示的数组做排序
      this.showAreas.sort((a, b) => a.dis - b.dis) //先进行记录小到大排序

      let loopAreas = [], loopIndex = -1, showNum = Math.ceil(this.showAreas.length / 4)

      //对数组进行分组
      this.showAreas.forEach((item, index) => {
        if (index % showNum == 0) {
          loopIndex += 1
        }

        if (!loopAreas[loopIndex]) {
          loopAreas[loopIndex] = []
        }
        loopAreas[loopIndex].push(item)
      })

      //对每个分数组进行排序
      loopAreas.forEach(loopArea => {
        loopArea.sort(function (a, b) {
          let aOrg = orgAreas[a.orgId], bOrg = orgAreas[b.orgId]

          return bOrg.lnglats.lat.max * 1 - aOrg.lnglats.lat.max * 1
        })
      })

      console.log('处理后的loopAreas：', loopAreas)
      //处理循环数组
      for (let i = 0; i < loopAreas[0].length; i++) {
        let newLoopArea = [] //存储新的数组

        loopAreas.forEach(item => {
          if (item[i]) {
            newLoopArea.push(item[i])
          }
        })
        this.loopAreas.push(newLoopArea)
      }
      console.log('转至后的显示loopAreas：', this.loopAreas)

      this.loopAreasStart() //开始循环显示区域和信息
    },
    async loopAreasStart() {
      this.orgInterval = setInterval(this.getOrgDatas, 1000 * 60 * 1) //定时调用数据
      await this.getOrgDatas() //先去获取数据信息
      //高亮显示区域
      if (this.loopAreas.length < 2) {
        this.activeMarkerShow(0, 0) //marker显示
        this.orgInfoShow(0, 0) //信息显示
      } else {
        this.loopInterval = setInterval(() => {
          let nowIndex = (this.index++ ) % this.loopAreas.length

          let nextIndex = this.index % this.loopAreas.length

          this.boundaryActiveShow(nowIndex, nextIndex) //边界布局显示
          this.activeMarkerShow(nowIndex, nextIndex) //marker显示
          this.orgInfoShow(nowIndex, nextIndex) //信息显示
        }, this.loopTimes)
      }
    },
    async getOrgDatas() {
      try {
        let result = await getAreaDataStatistics({ orgIds: this.orgIds, projectId: this.project.projectId })

        if (result && result.length) {
          result.forEach(item => {
            this.orgData[item.orgId] = Object.freeze(item)
          })
        }
      } catch (error) {
        console.log(error)
      }
    },
    boundaryAnimation(prisms, height, color, type) {
      //如果不存在，则结束
      if (!prisms || prisms.length < 1) {
        return
      }
      //如果类型为1，则是降低，为2则是抬高
      if (type == 1) {
        height -= this.mapParams.dis
      } else {
        height += this.mapParams.dis
      }
      if (height >= this.mapParams.activeHeight) {
        height = this.mapParams.activeHeight
      } else if (height <= this.mapParams.baseHeight) {
        height = this.mapParams.baseHeight
      } else {
        setTimeout(() => {
          this.boundaryAnimation(prisms, height, color, type)
        }, 120)
      }
      prisms.forEach(prism => {
        prism.setOptions({ height, color })
      })
    },
    boundaryActiveShow(nowIndex, nextIndex) {
      //显示区域拔高，之前的显示，抬高新的区域
      let nowAreas = this.loopAreas[nowIndex]

      nowAreas.forEach(item => {
        let nowOrg = orgAreas[item.orgId]

        this.boundaryAnimation(nowOrg.prisms, nowOrg.height, nowOrg.color.replace('1.00', baseOpacity), 1)
        nowOrg.height = this.mapParams.baseHeight
      })

      //抬高新的区域
      let nextAreas = this.loopAreas[nextIndex]

      nextAreas.forEach(item => {
        let nextOrg = orgAreas[item.orgId]

        this.boundaryAnimation(nextOrg.prisms, nextOrg.height, nextOrg.color.replace('1.00', activeOpacity), 2)
        nextOrg.height = this.mapParams.activeHeight
      })
    },
    activeMarkerShow(nowIndex, nextIndex) {
      //显示标记信息，先隐藏之前的信息，再显示新的信息
      let nowAreas = this.loopAreas[nowIndex]

      nowAreas.forEach(item => {
        let nowOrg = orgAreas[item.orgId]

        if (nowOrg.activeMarker) {
          nowOrg.activeMarker.hide()
        }
      })

      //显示新的标记
      let nextAreas = this.loopAreas[nextIndex]

      let newMarkers = []

      nextAreas.forEach(item => {
        let nextOrg = orgAreas[item.orgId]

        if (nextOrg.activeMarker) {
          nextOrg.activeMarker.show()
        } else {
          nextOrg.activeMarker = new AMap.Marker({ position: nextOrg.center, anchor: 'bottom-center', offset: new AMap.Pixel(0, 0),
            icon: new AMap.Icon({ image: '/static/mapIcons/map-active.gif', size: [24, 40], imageSize: new AMap.Size(24, 40) }) })
          newMarkers.push(nextOrg.activeMarker)
        }
      })
      if (newMarkers.length) {
        myJcMap.add(newMarkers)
      }
    },
    orgInfoShow(nowIndex, nextIndex) {
      //显示组织信息数据
      let nowAreas = this.loopAreas[nowIndex]

      nowAreas.forEach(item => {
        let nowOrg = orgAreas[item.orgId]

        if (nowOrg.infoMarker) {
          nowOrg.infoPolyline.setMap(null)
          nowOrg.infoMarker.setMap(null)
        }
      })

      //显示新的标记
      let nextAreas = this.loopAreas[nextIndex]

      let overlays = [] //存储覆盖物

      this.calcAreasPosition(nextAreas) //去计算位置
      nextAreas.forEach(item => {
        let nextOrg = orgAreas[item.orgId]

        let { position, content } = this.getPositionAndContent(item) //获取中心点和内容

        if (nextOrg.infoMarker) {
          nextOrg.infoMarker.setContent(content)
          nextOrg.infoMarker.setMap(myJcMap)
          nextOrg.infoPolyline.setMap(myJcMap)
        } else {
          nextOrg.infoMarker = new AMap.Marker({ position, content, anchor: 'center', offset: new AMap.Pixel(0, 0) })

          nextOrg.infoPolyline = new AMap.Polyline({ path: [nextOrg.center, position], strokeOpacity: 1, strokeStyle: 'solid', strokeColor: '#14edfc', strokeWeight: 2.4 })
          overlays.push(nextOrg.infoMarker)
          overlays.push(nextOrg.infoPolyline)
        }
      })
      if (overlays.length) {
        myJcMap.add(overlays)
      }
    },
    getInfoPositionKey(position) {
      let parentOrg = orgAreas[this.orgId] //获取父级组织

      if (position[0] <= parentOrg.centerPosition.lng) {
        if (position[1] >= parentOrg.centerPosition.lat) {
          return 'leftTop'
        }
        return 'leftBottom'
      }
      if (position[1] >= parentOrg.centerPosition.lat) {
        return 'rightTop'
      }
      return 'rightBottom'
    },
    calcAreasPosition(areas) {
      /**
       * 如果信息显示位置不存在，则去计算位置，并设置信息窗的class
       * 一次最多显示四个
       * 如果当前可显示个数为1个，则根据中心点位置判断应该显示的位置
       * 如果当前可显示个数为2个，则先根据中心点判断，再根据左右位置判断显示位置
       * 如果当前可显示个数为3个，则先根据中心点判断，再根据上下左右位置判断显示位置
       * 如果当前可显示个数为4个，则直接根据上下左右位置判断显示位置
       */
      if (areas[0].infoShowPosition) {
        return
      }
      //对数组信息进行处理
      if (areas.length == 1) {
        areas[0].infoShowPosition = this.getInfoPositionKey(areas[0].center)
      } else if (areas.length == 2) {
        areas[0].infoShowPosition = this.getInfoPositionKey(areas[0].center)
        areas[1].infoShowPosition = this.getInfoPositionKey(areas[1].center)
        //如果两个位置相等，则去判断两个的位置，按照左右显示
        if (areas[0].infoShowPosition == areas[1].infoShowPosition) {
          if (areas[0].center[0] <= areas[1].center[0]) {
            areas[0].infoShowPosition.replace('right', 'left')
            areas[1].infoShowPosition.replace('left', 'right')
          } else {
            areas[0].infoShowPosition.replace('left', 'right')
            areas[1].infoShowPosition.replace('right', 'left')
          }
        }
      } else {
        //对数组进行左右排序，然后在进行上下判断
        areas.sort(function (a, b) {
          let aOrg = orgAreas[a.orgId], bOrg = orgAreas[b.orgId]

          return aOrg.center[0] * 1 - bOrg.center[0] * 1
        })
        if (areas[0].center[1] >= areas[1].center[1]) {
          areas[0].infoShowPosition = 'leftTop'
          areas[1].infoShowPosition = 'leftBottom'
        } else {
          areas[0].infoShowPosition = 'leftBottom'
          areas[1].infoShowPosition = 'leftTop'
        }
        if (areas.length == 3) {
          let parentOrg = orgAreas[this.orgId] //获取父级组织

          if (areas[2].center[1] >= parentOrg.centerPosition.lat) {
            areas[2].infoShowPosition = 'rightTop'
          } else {
            areas[2].infoShowPosition = 'rightBottom'
          }
        } else if (areas[2].center[1] >= areas[3].center[1]) {
          areas[2].infoShowPosition = 'rightTop'
          areas[3].infoShowPosition = 'rightBottom'
        } else {
          areas[2].infoShowPosition = 'rightBottom'
          areas[3].infoShowPosition = 'rightTop'
        }
      }
    },
    getPositionAndContent(area) {
      //获取位置和信息内容content
      let info = this.orgData[area.orgId]

      //设置基础信息
      let infoContent = `<div class="jc-ds-info-title">${info.orgName}</div>`

      infoContent += `<div class="jc-ds-info-item">在岗人数<span>${info.onGuardUserCount}人</span></div>`
      infoContent += `<div class="jc-ds-info-item">巡逻里程<span>${info.journey}KM</span></div>`
      infoContent += `<div class="jc-ds-info-item">岗点触碰<span>${info.inoutCount}次</span></div>`
      infoContent += `<div class="jc-ds-info-item">上报事件<span>${info.eventReportCount}件</span></div>`
      infoContent += `<div class="jc-ds-info-item">网巡问题<span>${info.problemCount}个</span></div>`
      infoContent += `<div class="jc-ds-info-item">临时任务<span>${info.temporaryTaskCount}个</span></div>`

      let content = `<div class="jc-data-statistics-warp jc-${area.infoShowPosition}">${infoContent}</div>`

      return { position: this.orgInfoPosition[area.infoShowPosition], content }
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
    }
  },
  beforeDestroy() {
    if (myJcMap) {
      myJcMap.destroy()
      myJcMap = null
    }
    AMap = null
    object3Dlayer = null
    labelsLayer = null
    orgAreas = {}
    //清除定时器
    if (this.loopInterval) {
      clearInterval(this.loopInterval)
    }
    if (this.orgInterval) {
      clearInterval(this.orgInterval)
    }
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
@keyframes left-top-in {
  from {
    opacity: 0;
    transform: translate3d(-80%, -20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(-50%, -20px, 0);
  }
}
@keyframes left-bottom-in {
  from {
    opacity: 0;
    transform: translate3d(-80%, 20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(-50%, 20px, 0);
  }
}
@keyframes right-top-in {
  from {
    opacity: 0;
    transform: translate3d(80%, -20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(50%, -20px, 0);
  }
}
@keyframes right-bottom-in {
  from {
    opacity: 0;
    transform: translate3d(80%, 20px, 0);
  }

  to {
    opacity: 1;
    transform: translate3d(50%, 20px, 0);
  }
}
.jc-data-statistics-warp {
  position: relative;
  width: 154px;
  height: 180px;
  background: url(./assets/info-bg.png) no-repeat center;
  background-size: 100% 100%;
  font-size: 12px;
  color: #feffff;
  animation-duration: 0.4s;
  animation-timing-function: ease;
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
    padding: 0 $jc-default-dis;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    text-align: center;
    @include jc-text-warp;
  }
  .jc-ds-info-item {
    padding: 0 $jc-default-dis;
    display: flex;
    span {
      color: #14edfc;
      flex: 1;
      @include jc-text-warp(1);
      text-align: right;
      height: 22px;
      line-height: 22px;
    }
  }
}
</style>

/**
 * 指挥区域混入
 */
import { getAreaDataStatistics } from '@/api/dataScreen'

let myJcMap, AMap, object3Dlayer, labelsLayer //个人 map 对象,存储Amap对象,存储3D图层，存储点标记

let baseOpacity = 0.6, activeOpacity = 0.8 //透明度

let colors = ['0083ff', '00c0ff', '00a9ff', '0072ff', '00fcff']

let mapParams = { baseCoefficient: 0.0000046, activeCoefficient: 1.8, minHeight: 2800, animationTimes: 6 } //设置一些地图参数

export default {
  data() {
    return {
      mapParams: { baseHeight: 0, activeHeight: 0, dis: 0 }, //记录高度基础和抬起的高度
      showAreas: [], //存储所有显示的区域
      index: 0, //当前循环到第几个
      orgIds: [], //需要查询的组织id数组
      orgData: {}, //存储组织信息
      orgInfoPosition: {}, //记录四个位置的坐标
      orgInterval: null, //存储获取数据定时器
      loopAreas: [], //存储 循环的区域
      loopInterval: null,
      loopTimes: 1000 * 19 //循环时间
    }
  },
  methods: {
    initCommandArea() {
      //处理如果不是当前显示，则去隐藏自己
      if (this.switchType != 1) {
        this.hideCommandArea()
        return
      }
      myJcMap = this.getMyJcMap()
      myJcMap.setPitch(40)
      myJcMap.setFeatures(['bg', 'road'])
      AMap = this.getAMap()
      //如果对象已经创建，则去显示，否则进行初始化显示
      if (object3Dlayer && labelsLayer) {
        myJcMap.add(object3Dlayer)//添加到地图
        myJcMap.add(labelsLayer) //添加点标记
        this.setFitView() //设置自适应显示
        this.loopAreasStart() //开始循环显示区域和信息
        if (this.index > 0) {
          this.showNextMarkerAndInfo(this.index % this.loopAreas.length)
        }
      } else {
        object3Dlayer = new AMap.Object3DLayer({ opacity: 1, zIndex: 8 })

        labelsLayer = new AMap.LabelsLayer({ visible: true, zIndex: 9, collision: false })

        this.drawMapAreas()
      }
    },
    hideCommandArea() {
      if (this.loopInterval) {
        clearInterval(this.loopInterval)
      }
      this.hidePreMarkerAndInfo(this.index % this.loopAreas.length)
      myJcMap.remove(object3Dlayer)
      myJcMap.remove(labelsLayer)
    },
    drawMapAreas() {
      let orgAreas = this.getOrgAreasData()

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
          item.marker = new AMap.LabelMarker({
            position: item.center, zooms: [3, 20], icon: {
              image: '/static/mapIcons/map-dot.png', anchor: 'center'
            }, text: {
              content: item.areaName,
              direction: 'right',
              offset: [-14, -2],
              style: { fontSize: 12, fillColor: '#ffffff', fontWeight: 'bold', fontFamily: '微软雅黑' }
            }
          })
          markers.push(item.marker)

          let prisms = [] //存储当前组织3D对象

          item.color = AMap.Util.rgbHex2Rgba(colors[i % colors.length]) //设置颜色

          //循环增加每个组织的区域
          for (let j = 0; j < item.boundaries.length; j++) {
            let prism = new AMap.Object3D.Prism({
              path: item.boundaries[j].path, height: this.mapParams.baseHeight,
              color: item.color.replace('1.00', baseOpacity)
            })

            prism.transparent = true
            prism.jcColor = item.color
            prisms.push(prism)
            object3Dlayer.add(prism) //添加图层
          }
          item.prisms = prisms
        }

        this.showAreas[i].dis = AMap.GeometryUtil.distance(parentOrg.centerPosition, new AMap.LngLat(item.center[0], item.center[1]))
      }

      labelsLayer.add(markers)
      myJcMap.add(object3Dlayer)//添加到地图
      myJcMap.add(labelsLayer) //添加点标记

      this.setFitView() //设置自适应显示

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
      this.orgInterval = setInterval(this.getOrgDatas, 1000 * 55) //定时调用数据
    },
    async loopAreasStart() {
      await this.getOrgDatas() //先去获取数据信息
      //高亮显示区域
      if (this.loopAreas.length < 2) {
        this.showNextMarkerAndInfo(0) //显示信息
      } else {
        this.loopInterval = setInterval(() => {
          let nowIndex = (this.index++) % this.loopAreas.length

          let nextIndex = this.index % this.loopAreas.length

          this.boundaryActiveShow(nowIndex, nextIndex) //边界布局显示
          this.hidePreMarkerAndInfo(nowIndex)
          setTimeout(() => {
            if (this.switchType == 1) {
              this.showNextMarkerAndInfo(nextIndex) //显示信息
            }
          }, 1200)
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
    boundaryAnimation(prisms, height, type) {
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
          this.boundaryAnimation(prisms, height, type)
        }, 120)
      }
      prisms.forEach(prism => {
        prism.jcReDraw = prism.reDraw
        prism.reDraw = function () { }
        prism.setOptions({ height, color: type == 1 ? prism.jcColor.replace('1.00', baseOpacity) : prism.jcColor.replace('1.00', activeOpacity) })
        prism.reDraw = prism.jcReDraw
      })
      object3Dlayer.reDraw()
    },
    boundaryActiveShow(nowIndex, nextIndex) {
      let orgAreas = this.getOrgAreasData()

      //显示区域拔高，之前的显示，抬高新的区域
      if (this.index > 1) {
        let nowAreas = this.loopAreas[nowIndex]

        let nowPrisms = [] //存储所有需要改变的数据

        nowAreas.forEach(item => {
          let nowOrg = orgAreas[item.orgId]

          nowPrisms.push(...(nowOrg.prisms || []))
        })

        this.boundaryAnimation(nowPrisms, this.mapParams.activeHeight, 1)
      }

      //抬高新的区域
      let nextAreas = this.loopAreas[nextIndex]

      let nextPrisms = [] //存储所有需要改变的数据

      nextAreas.forEach(item => {
        let nextOrg = orgAreas[item.orgId]

        nextPrisms.push(...(nextOrg.prisms || []))
      })
      this.boundaryAnimation(nextPrisms, this.mapParams.baseHeight, 2)
    },
    hidePreMarkerAndInfo(nowIndex) {
      let orgAreas = this.getOrgAreasData()

      //隐藏现在的marker 和信息窗口显示
      let nowAreas = this.loopAreas[nowIndex]

      nowAreas.forEach(item => {
        let nowOrg = orgAreas[item.orgId]

        if (nowOrg.activeMarker) {
          nowOrg.activeMarker.hide()
        }
        if (nowOrg.infoMarker) {
          nowOrg.infoPolyline.setMap(null)
          nowOrg.infoMarker.setMap(null)
        }
      })
    },
    polylineAnimation(startPath, endPath, polyline) {
      let lngDis = (endPath[0] - startPath[0]) / mapParams.animationTimes, latDis = (endPath[1] - startPath[1]) / mapParams.animationTimes

      let animationFN = function (times) {
        if (times >= mapParams.animationTimes) {
          polyline.setPath([startPath, endPath])
        } else {
          polyline.setPath([startPath, [startPath[0] + lngDis * times, startPath[1] + latDis * times]])
          setTimeout(function () {
            times += 1
            animationFN(times)
          }, 80)
        }
      }

      animationFN(0)
      polyline.setMap(myJcMap)
    },
    showNextMarkerAndInfo(nextIndex) {
      let orgAreas = this.getOrgAreasData()

      //显示新的标记
      let nextAreas = this.loopAreas[nextIndex]

      let overlays = [] //存储覆盖物

      this.calcAreasPosition(nextAreas) //去计算位置
      nextAreas.forEach(item => {
        let nextOrg = orgAreas[item.orgId]

        let { position, content } = this.getPositionAndContent(item) //获取中心点和内容

        if (nextOrg.activeMarker) {
          nextOrg.activeMarker.show()
          nextOrg.infoMarker.setContent(content)
          nextOrg.infoMarker.setMap(myJcMap)
        } else {
          nextOrg.activeMarker = new AMap.Marker({
            position: nextOrg.center, anchor: 'bottom-center', offset: new AMap.Pixel(0, 0),
            icon: new AMap.Icon({ image: '/static/mapIcons/map-active.gif', size: [24, 40], imageSize: new AMap.Size(24, 40) })
          })
          nextOrg.infoMarker = new AMap.Marker({ position, content, anchor: 'center', offset: new AMap.Pixel(0, 0) })

          nextOrg.infoPolyline = new AMap.Polyline({ path: [nextOrg.center, position], strokeOpacity: 1, strokeStyle: 'solid', strokeColor: '#14edfc', strokeWeight: 1.2 })
          overlays.push(nextOrg.activeMarker)
          overlays.push(nextOrg.infoMarker)
        }
        this.polylineAnimation(nextOrg.center, position, nextOrg.infoPolyline)
      })
      if (overlays.length) {
        myJcMap.add(overlays)
      }
    },
    getInfoPositionKey(position) {
      let orgAreas = this.getOrgAreasData()

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
      let orgAreas = this.getOrgAreasData()

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

      infoContent += `<div class="jc-ds-info-item">在岗人数：<span>${info.onGuardUserCount}人</span></div>`
      infoContent += `<div class="jc-ds-info-item">巡逻里程：<span>${info.journey}KM</span></div>`
      infoContent += `<div class="jc-ds-info-item">岗点触碰：<span>${info.inoutCount}次</span></div>`
      infoContent += `<div class="jc-ds-info-item">上报事件：<span>${info.eventReportCount}件</span></div>`
      infoContent += `<div class="jc-ds-info-item">网巡问题：<span>${info.problemCount}个</span></div>`
      infoContent += `<div class="jc-ds-info-item">临时任务：<span>${info.temporaryTaskCount}个</span></div>`

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
    }
  },
  beforeDestroy() {
    object3Dlayer = null
    labelsLayer = null

    //清除定时器
    if (this.loopInterval) {
      clearInterval(this.loopInterval)
    }
    if (this.orgInterval) {
      clearInterval(this.orgInterval)
    }
  }
}

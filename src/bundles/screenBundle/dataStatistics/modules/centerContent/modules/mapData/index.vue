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

let colors = ['#00a9ff', '#008eff', '#0083ff', '#1357ff', '#0f29e7']

export default {
  name: 'ScreenDataCenterContentMapData',
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

      AMap = await AMapLoader.load({ key: process.env.aMapConfig.accessKey, plugins: ['Map3D', 'AMap.Marker'] })

      object3Dlayer = new AMap.Object3DLayer({ opacity: 0.8 })

      //, dragEnable: false, zoomEnable: false, rotateEnable: false, keyboardEnable: false
      myJcMap = new AMap.Map(this.$refs.myMap, {
        mapStyle: 'amap://styles/1b8b05391432855bd2473c0d1d3628b5', viewMode: '3D', features: ['bg', 'road'], pitch: 45, skyColor: 'rgba(0,0,0,0)'
      })
      this.clearMapSign() //清除地图标记
      // 设置光照
      myJcMap.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.6)
      myJcMap.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 0.8)

      this.$EventBus.$emit('data-statistics-amap-success') //通知地图加载完成

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
          let index = 0, markers = []

          result.forEach(item => {
            if (item.center) { //中心点必须存在
              let center = item.center.split(',')

              let marker = new AMap.Marker({ position: center, anchor: 'middle-left', content: `<div class="jc-data-statistics-content">${item.areaName}</div>` })

              markers.push(marker)
              let orgInfo = { orgId: item.orgId, center, areaCode: item.areaCode, areaId: item.areaId, areaName: item.areaName, marker }

              if (item.orgId != this.orgId || result.length == 1) {
                orgInfo.boundaries = orgBoundariesFormat(item.withoutRadiusReqs, AMap)

                //设置边界，并绘画
                if (orgInfo.boundaries && orgInfo.boundaries.length) {
                  let prisms = [] //存储当前组织3D对象

                  let height = index % 5 == 1 ? 6000 : 30000 //设置高度

                  let color = colors[index++ % colors.length] //设置颜色

                  orgInfo.boundaries.forEach(boundary => {
                    let prism = new AMap.Object3D.Prism({ path: boundary.path, height, color })

                    prism.transparent = true
                    prisms.push(prism)
                    object3Dlayer.add(prism) //添加图层
                  })
                  orgInfo.prisms = prisms
                }
              }
              orgAreas[item.orgId] = orgInfo
            }
          })
          myJcMap.add(object3Dlayer)//添加到地图
          myJcMap.add(markers) //添加点标记
          console.log('数据大屏，组织边界信息', orgAreas)
        }
      } catch (error) {
        console.log(error)
      }
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
  }
}
</style>

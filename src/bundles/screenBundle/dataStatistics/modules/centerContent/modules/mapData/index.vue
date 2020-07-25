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

      AMap = await AMapLoader.load({ key: process.env.aMapConfig.accessKey, plugins: ['Map3D'] })

      object3Dlayer = new AMap.Object3DLayer({ opacity: 0.6 })

      //, dragEnable: false, zoomEnable: false, rotateEnable: false, keyboardEnable: false
      myJcMap = new AMap.Map(this.$refs.myMap, {
        mapStyle: 'amap://styles/1b8b05391432855bd2473c0d1d3628b5', viewMode: '3D', features: ['bg', 'road'], pitch: 50, skyColor: 'rgba(0,0,0,0)'
      })
      this.clearMapSign() //清除地图标记
      // 设置光照
      myJcMap.AmbientLight = new AMap.Lights.AmbientLight([1, 1, 1], 0.5)
      myJcMap.DirectionLight = new AMap.Lights.DirectionLight([0, 0, 1], [1, 1, 1], 1)

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
          let index = 0

          result.forEach(item => {
            if (item.center) { //中心点必须存在
              let orgInfo = { orgId: item.orgId, center: item.center.split(','), areaCode: item.areaCode, areaId: item.areaId, areaName: item.areaName }

              if (item.orgId != this.orgId || result.length == 1) {
                orgInfo.boundaries = orgBoundariesFormat(item.withoutRadiusReqs, AMap)

                //设置边界，并绘画
                if (orgInfo.boundaries && orgInfo.boundaries.length) {
                  let prisms = []

                  orgInfo.boundaries.forEach(boundary => {
                    let prism = new AMap.Object3D.Prism({ path: boundary.path, height: 10000, color: colors[index++ % colors.length] })

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

<template>
  <section class="jc-map-warp">
    <div class="jc-map-space" ref="myMap"></div>
  </section>
</template>
<script>
import JcMapUtils from '@/libs/JcMapUtil'
import { MapOptions, PolygonStyle } from '@/config/JcMapConfig'

let allBoundsMap = {}

let useBoundsMap = {}

export default {
  name: 'MapDemo',
  data() {
    return {
      floorData: { adcode: '', zoom: '' }
    }
  },
  mounted() {
    JcMapUtils.init({ ...MapOptions, source: this.$refs.myMap }, () => {
      this.initData() //初始化
      console.log(JcMapUtils.map)
      JcMapUtils.map.on('zoomend', () => {
        let nowZoom = JcMapUtils.map.getZoom()

        if (this.floorData.zoom) {
          if (nowZoom < this.floorData.zoom) {
            let preBound = allBoundsMap[this.floorData.adcode].parent

            if (preBound) {
              console.log(preBound)
              this.showFloor(preBound.adcode, preBound.level)
            }
          }
        } else {
          this.floorData.zoom = nowZoom
          JcMapUtils.map.setStatus({ zoomEnable: true })
          // JcMapUtils.
        }
        console.log(nowZoom)
      })
    })
  },
  methods: {
    initData() {
      // this.showFloor('320000', 'province') //开始查询江苏省
      this.showFloor('320100') //开始查询南京市
    },
    showFloor(adcode, level = 'city') {
      if (adcode == this.floorData.adcode) {
        return
      }
      this.floorData = { adcode, zoom: '' }
      JcMapUtils.map.setStatus({ zoomEnable: false })
      console.log('搜索的adcode：' + adcode + '，level：' + level)
      let parentFloor = allBoundsMap[adcode]

      if (parentFloor) {
        this.loadChild(parentFloor)
      } else {
        JcMapUtils.districtSearch({ options: { level: level, extensions: 'all' }, keyword: adcode }, (result) => {
          parentFloor = result.districtList[0]
          allBoundsMap[adcode] = parentFloor
          this.loadChild(parentFloor)
        })
      }
    },
    loadChild(parentFloor) {
      console.log(parentFloor)
      let useFloor = [parentFloor]

      let loadChildPromise = function (item) {
        return new Promise(function (resolve, reject) {
          let childFloor = allBoundsMap[item.adcode]

          if (childFloor) {
            useFloor.push(childFloor)
            resolve()
          } else {
            JcMapUtils.districtSearch({ options: { level: item.level, extensions: 'all' }, keyword: item.adcode }, (result) => {
              childFloor = result.districtList[0]
              allBoundsMap[item.adcode] = { ...childFloor, parent: { adcode: parentFloor.adcode, level: parentFloor.level } }
              useFloor.push(childFloor)
              resolve()
            })
          }
        })
      }

      let moduleExecute = (data) => {
        let requestPormise = []

        data.forEach(item => {
          requestPormise.push(loadChildPromise(item))
        })

        return Promise.all(requestPormise)
      }

      moduleExecute(parentFloor.districtList).then(() => {
        JcMapUtils.polygon.clear(this.getAllUsePolygons()) //清除之前的显示
        useBoundsMap = {}
        useFloor.forEach(item => {
          this.addChild(item)
        })
        JcMapUtils.map.add(this.getAllUsePolygons())
        JcMapUtils.map.setFitView()//地图自适应
      })
    },
    addChild(item) {
      JcMapUtils.polygon.add({ ...PolygonStyle.base, extData: { adcode: item.adcode, name: item.name, level: item.level }, path: item.boundaries }, (polygons) => {
        useBoundsMap[item.adcode] = polygons
        polygons.forEach(polygon => {
          this.addEvent(polygon)
        })
      })
    },
    getAllUsePolygons() {
      let polygons = []

      for (let key in useBoundsMap) {
        polygons.push(...useBoundsMap[key])
      }
      return polygons
    },
    addEvent(polygon) {
      polygon.on('mouseover', () => {
        let polygons = useBoundsMap[polygon.getExtData().adcode]

        if (polygons && polygons.length) {
          polygons.forEach(item => {
            item.setOptions(PolygonStyle.active)
          })
        }
      })
      polygon.on('mouseout', () => {
        let polygons = useBoundsMap[polygon.getExtData().adcode]

        if (polygons && polygons.length) {
          polygons.forEach(item => {
            item.setOptions(PolygonStyle.normal)
          })
        }
      })
      polygon.on('dblclick', () => {
        let data = polygon.getExtData()

        this.showFloor(data.adcode, data.level)
      })
    },
    showTip(tip) {
      console.log(`Amap----loading---${tip}`)
    }
  },
  beforeDestroy() {
    JcMapUtils.destroy() //销毁地图
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp,
.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

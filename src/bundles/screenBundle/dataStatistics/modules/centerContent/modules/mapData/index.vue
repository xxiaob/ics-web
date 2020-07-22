<template>
  <div class="jc-map-space">
    <div class="jc-map-warp" ref="myMap"></div>
  </div>
</template>
<script>
import { JcMap } from '@/map'
import { mapStyle } from '@/map/mapConst'
import { getMap3D } from '@/map/aMap/aMapUtil'

let myJcMap //个人 map 对象

export default {
  name: 'ScreenDataCenterContentMapData',
  data() {
    return {

    }
  },
  mounted() {
    myJcMap = new JcMap({ mapStyle: mapStyle.DARK })
    this.initData()
  },
  methods: {
    async initData() {
      let { AMap } = await getMap3D() //获取amap 对象

      let object3Dlayer = new AMap.Object3DLayer()

      //, dragEnable: false, zoomEnable: false, rotateEnable: false, keyboardEnable: false
      await myJcMap.init(this.$refs.myMap, { features: ['bg', 'road'], pitch: 50, layers: [object3Dlayer] }) //等待地图初始化
      window.myMap = myJcMap.map
    },
    getMyJcMap() {
      return myJcMap//获取地图
    }
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

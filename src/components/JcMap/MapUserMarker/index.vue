<template>
  <div class="jc-map-warp">
    <map-search ref="mapSearch" class="jc-area-search" @search-change="searchChange"></map-search>
    <div class="jc-marker-map" ref="myMap"></div>
  </div>
</template>
<script>
import { JcMap, JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'

import { MAP_EVENT } from '@/constant/CONST'
import MapSearch from '@/components/JcMap/MapSearch'
export default {
  name: 'MapUserMarker',
  model: { prop: 'value', event: 'change' },
  props: { value: { type: String, default: '' } },
  components: { MapSearch },
  data() {
    return {
      myJcMap: null,
      myMarker: null
    }
  },
  mounted() {
    this.myJcMap = new JcMap()
    this.initData()
  },
  methods: {
    async initData() {
      await this.myJcMap.init(this.$refs.myMap) //等待地图初始化

      this.$refs.mapSearch.initData(this.myJcMap) //初始化搜索对象

      //添加监听
      this.myJcMap.on(MAP_EVENT.CLICK, (data) => {
        console.log('地图点击了', data)
      })
    },
    showMarker(center, name) {
      if (this.myMarker) {
        this.myMarker.name = name
        this.myMarker.setPosition(center)
      } else {
        this.myMarker = new JcMapMarker({ map: this.myJcMap, name, icon: '/static/mapIcons/temporarytasks.gif', position: center, mapStyle: markerStyle.TEMPORARY_TASKS, draggable: true })
      }
    },
    searchChange(data) {
      //搜索改变
      console.log('搜索地址改变：', data)
      this.showMarker(data.center, data.name)
    }
  },
  beforeDestroy() {
    this.myJcMap.destroy()
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp,
.jc-marker-map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.jc-area-search {
  top: $jc-default-dis;
}
</style>

<template>
  <div class="jc-map-warp">
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-marker-map" ref="myMap"></div>
  </div>
</template>
<script>
import { JcMap, JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'
import { MAP_EVENT } from '@/constant/CONST'
import MapSearch from '@/components/JcMap/MapSearch'
import { getAddressByPosition } from '@/map/aMap/aMapUtil'

export default {
  name: 'MapUserMarker',
  model: { prop: 'value', event: 'change' },
  props: { value: { type: Object, default: {} } },
  components: { MapSearch },
  data() {
    return {
      myJcMap: null,
      myMarker: null,
      address: { position: '', name: '' }
    }
  },
  mounted() {
    this.myJcMap = new JcMap()
    this.initData()
  },
  watch: {
    value() {
      this.valueChange() //监听传入值变化
    },
    address() {
      this.$emit('change', this.address)
    }
  },
  methods: {
    async initData() {
      await this.myJcMap.init(this.$refs.myMap) //等待地图初始化

      this.$refs.mapSearch.initData(this.myJcMap) //初始化搜索对象

      this.valueChange() //初始化基础数据

      //添加监听
      this.myJcMap.on(MAP_EVENT.RIGHTCLICK, (data) => {
        console.log('地图点击了', data)
        let center = [data.lnglat.lng, data.lnglat.lat]

        getAddressByPosition(data.lnglat).then(name => {
          this.showMarker(center, name)
          this.address = { position: center.join(','), name }
        })
      })
    },
    valueChange() {
      if (this.value && this.value.position != this.address.position && this.value.name != this.address.name) {
        this.showMarker(this.value.position.split(','), name)
        this.myMarker.fitView()
      }
    },
    showMarker(center, name) {
      if (this.myMarker) {
        this.myMarker.name = name
        this.myMarker.show(center)
      } else {
        this.myMarker = new JcMapMarker({ map: this.myJcMap, name, icon: '/static/mapIcons/temporarytasks.gif', position: center, mapStyle: markerStyle.TEMPORARY_TASKS })
      }
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

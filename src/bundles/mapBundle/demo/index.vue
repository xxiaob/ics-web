<template>
  <section class="jc-map-warp">
    <div class="jc-map-space" ref="myMap"></div>
  </section>
</template>
<script>
import JcMapUtils from '@/libs/JcMapUtil'
import { MapOptions } from '@/config/JcMapConfig'

let boundsMap = new Map()

export default {
  name: 'MapDemo',
  mounted() {
    JcMapUtils.init({ ...MapOptions, source: this.$refs.myMap }, () => {
      //搜索南京市
      this.search('320100')
      JcMapUtils.map.on('zoomend', () => {
        console.log(JcMapUtils.map.getZoom())
      })
    })
  },
  methods: {
    search(adcode) {
      console.log('搜索的adcode：' + adcode)
      JcMapUtils.districtSearch({ options: { level: 'city', extensions: 'all' }, keyword: adcode }, (result) => {
        console.log(result)
      })
    },
    loadChild() {

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

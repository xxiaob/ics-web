<template>
  <section class="jc-screen-warp">
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-screen-space" ref="myMap"></div>
  </section>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'MapDemo',
  components: {
    MapSearch: () => import('@/components/JcMap/MapSearch')
  },
  data() {
    return {

    }
  },
  mounted() {
    myJcMap = new JcMap()
    this.initData()
  },
  methods: {
    initData() {
      myJcMap.init({ source: this.$refs.myMap }).then(() => {
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
      })
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
  }
}
</script>
<style lang="scss" scoped>
.jc-screen-warp,
.jc-screen-space {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
</style>

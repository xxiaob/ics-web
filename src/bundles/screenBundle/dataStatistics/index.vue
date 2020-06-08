<template>
  <section class="jc-screen-warp">
    <!-- <command-header></command-header> -->
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-screen-space" ref="myMap"></div>
  </section>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'ScreenDataStatistics',
  components: {
    // CommandHeader: () => import('./modules/header'), //顶部
    MapSearch: () => import('@/components/JcMap/MapSearch') //地图搜索
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
      myJcMap.init(this.$refs.myMap).then(() => {
        this.$nextTick(() => {
          this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
        })
      })
    },
    getMyJcMap() {
      return myJcMap//获取地图
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>

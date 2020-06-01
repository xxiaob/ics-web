<template>
  <section class="jc-screen-warp">
    <command-header @org-change="orgChange"></command-header>
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-screen-space" ref="myMap"></div>
    <command-operate></command-operate>
  </section>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'ScreenCommand',
  components: {
    CommandHeader: () => import('./modules/header'), //顶部
    CommandOperate: () => import('./modules/operate'), //功能操作区域
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
      myJcMap.init(this.$refs.myMap).then(() => {
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
      })
    },
    orgChange() {
      //指挥级别切换
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
  }
}
</script>
<style lang="scss" scoped src="./css/command.scss"></style>

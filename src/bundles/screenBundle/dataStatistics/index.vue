<template>
  <section class="jc-screen-warp">
    <!-- <command-header></command-header> -->
    <div class="jc-container">
      <jc-header></jc-header>
      <div class="jc-top">
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
        </div>
        <div class="jc-row-flex2">
          <map-search ref="mapSearch" class="jc-area-search"></map-search>
          <div class="jc-screen-space" ref="myMap"></div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">jc-item</div>
            </div>
          </div>
        </div>
      </div>
      <div class="jc-bottom">
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">jc-item</div>
          </div>
        </div>
        <div class="jc-row-flex2">
          <div class="jc-item-out">
            <div class="jc-item">jc-item</div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">jc-item</div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">jc-item</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>
import { JcMap } from '@/map'

let myJcMap //个人 map 对象

export default {
  name: 'ScreenDataStatistics',
  components: {
    JcHeader: ()=> import('./header'),
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
        this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
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

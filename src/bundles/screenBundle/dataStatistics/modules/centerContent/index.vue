<template>
  <div class="jc-flex-warp jc-flex-vertical">
    <!-- 上面用户定制化区域数据 -->
    <user-data></user-data>
    <div class="jc-flex-con jc-data-content">
      <!-- 指挥范围显示 map -->
      <map-data></map-data>
      <screen-projection></screen-projection>
    </div>
    <div class="jc-map-footer">
      <img src="./assets/map-footer.png" class="jc-map-img" />
    </div>
  </div>
</template>
<script>
import UserData from './modules/userData'
import MapData from './modules/mapData'
import ScreenProjection from './modules/screenProjection'

export default {
  name: 'ScreenDataCenterContent',
  components: { UserData, MapData, ScreenProjection }
}
</script>
<style lang="scss" scoped>
.jc-data-content {
  position: relative;
  z-index: 2;
}
.jc-map-footer {
  position: relative;
  height: 60px;
}
.jc-map-img {
  position: absolute;
  display: block;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 300px;
  z-index: 3;
}
</style>

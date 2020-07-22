<template>
  <div class="jc-flex-warp jc-flex-vertical">
    <!-- 上面用户定制化区域数据 -->
    <user-data></user-data>
    <div class="jc-flex-con jc-data-content">
      <!-- 指挥范围显示 map -->
      <map-data></map-data>
    </div>
    <div class="jc-map-footer">
      <img src="./assets/map-footer.gif" class="jc-map-img" />
    </div>
  </div>
</template>
<script>
import UserData from './modules/userData'
import MapData from './modules/mapData'

export default {
  name: 'ScreenDataCenterContent',
  components: { UserData, MapData }
}
</script>
<style lang="scss" scoped>
.jc-data-content {
  position: relative;
  z-index: 1;
}
.jc-map-footer {
  position: relative;
  height: 70px;
  z-index: 2;
}
.jc-map-img {
  position: absolute;
  display: block;
  left: 50%;
  bottom: -10px;
  transform: translateX(-50%);
  width: 320px;
}
</style>

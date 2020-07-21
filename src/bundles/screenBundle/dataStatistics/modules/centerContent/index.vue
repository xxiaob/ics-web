<template>
  <div class="jc-flex-warp jc-flex-vertical">
    <!-- 上面用户定制化区域数据 -->
    <user-data></user-data>
    <!-- 指挥范围显示 map -->
    <map-data class="jc-flex-con"></map-data>
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
</style>

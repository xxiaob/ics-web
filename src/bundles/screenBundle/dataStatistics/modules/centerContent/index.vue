<template>
  <div class="jc-flex-warp jc-flex-vertical">
    <user-data></user-data>
    <div class="jc-flex-con"></div>
  </div>
</template>
<script>
import UserData from './modules/userData'
export default {
  name: 'ScreenDataCenterContent',
  components: { UserData }
}
</script>

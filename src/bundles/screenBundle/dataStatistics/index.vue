<template>
  <section class="jc-screen-warp">
    <screen-header></screen-header>
    <div class="jc-screen-content">

    </div>
  </section>
</template>
<script>
import ScreenHeader from './modules/header' //顶部header

export default {
  name: 'ScreenDataStatistics',
  components: { ScreenHeader }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>

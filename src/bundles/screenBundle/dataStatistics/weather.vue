<template>
  <div class="weather">
    <div class="title">
      <span>天气信息</span>
    </div>
    <div class="content">

    </div>

  </div>
</template>

<script>
export default {
  name: 'weather'

}
</script>

<style lang="scss" scoped>
.content {
  flex: 1;
  overflow: auto;
  display: flex;
}
</style>

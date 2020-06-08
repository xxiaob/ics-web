<template>
  <div>
    <el-button @click="visible=true" type="primary">打开</el-button>
    <im-live :visible.sync="visible"></im-live>
  </div>
</template>

<script>
import imLive from './imLive'
export default {
  name: 'liveDemo',
  components: {
    imLive
  },
  data() {
    return {
      visible: false
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

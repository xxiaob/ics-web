<template>
  <div class="jc-custom-area" v-show="visible">

  </div>
</template>
<script>
let JcMapUtils //用户承接工具类

export default {
  name: 'SystemOrganizationCustomArea',
  props: ['visible'],
  data() {
    return {
      list: [],
      adcode: ''
    }
  },
  methods: {
    initData(util) {
      this.adcode = ''
      JcMapUtils = util
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-custom-area {
  position: absolute;
  width: 300px;
  bottom: $jc-default-dis;
  left: 0;
  right: 0;
  margin: 0 auto;
  z-index: 9;
}
</style>

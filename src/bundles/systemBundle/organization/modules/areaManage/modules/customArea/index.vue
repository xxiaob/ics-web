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
      if (this.list.length < 1) {
        JcMapUtils.districtSearch({ keyword: '320100', options: { level: 'city' } }, (result) => {
          let areas = result.districtList[0].districtList

          let list = []

          if (areas && areas.length) {
            areas.forEach(item => {
              list.push({ adcode: item.adcode, name: item.name, level: item.level })
            })
          }
          this.list = list
          console.log(areas, list)
        })
      }
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

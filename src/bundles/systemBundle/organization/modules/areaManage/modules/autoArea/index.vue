<template>
  <div class="jc-auto-area" v-show="visible">
    <el-select v-model="adcode" placeholder="请选择" size="mini" @change="adCodeChange">
      <el-option v-for="item in list" :key="item.adcode" :label="item.name" :value="item.adcode"></el-option>
    </el-select>
  </div>
</template>
<script>
let JcMapUtils //用户承接工具类

export default {
  name: 'SystemOrganizationAutoArea',
  props: ['visible'],
  data() {
    return {
      list: [],
      adcode: ''
    }
  },
  methods: {
    initData(util, adcode) {
      this.adcode = adcode
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
    },
    adCodeChange(code) {
      console.log(this.adcode, code)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-auto-area {
  position: absolute;
  top: 50px;
  left: $jc-default-dis;
  z-index: 8;
  .el-select {
    width: 90px;
  }
}
</style>

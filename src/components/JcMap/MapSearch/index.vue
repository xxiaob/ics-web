<template>
  <div class="jc-map-search">
    <i class="el-icon-search"></i>
    <el-select v-model="value" value-key="id" size="small" filterable remote reserve-keyword placeholder="输入搜索" @change="selectChange" :remote-method="search" :loading="loading" :popper-append-to-body="false">
      <el-option v-for="item in list" :key="item.id" :label="item.name" :value="item"></el-option>
    </el-select>
  </div>
</template>
<script>
import { JcMapSearch } from '@/map'

let myJcSearch //搜索对象

export default {
  name: 'JcMapSearch',
  data() {
    return {
      value: '',
      loading: false,
      list: []
    }
  },
  methods: {
    initData(map) {
      this.list = []
      this.value = ''
      myJcSearch = new JcMapSearch({ map })
    },
    search(query) {
      this.loading = true
      myJcSearch.search(query).then(res => {
        this.list = res
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    selectChange(item) {
      if (item.center && item.center.length) {
        myJcSearch.fitView(item.center)
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-map-search {
  position: absolute;
  top: 50px;
  left: $jc-default-dis;
  z-index: 8;
  /deep/ .el-select {
    width: 160px;
    .el-input__inner {
      padding: 0 15px 0 30px;
    }
  }
  .el-icon-search {
    position: absolute;
    z-index: 9;
  }
}
</style>

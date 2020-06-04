<template>
  <div class="jc-map-search" :class="{'jc-active': visible}">
    <i class="el-icon-search"></i>
    <el-select v-model="value" value-key="id" size="small" filterable remote reserve-keyword placeholder="输入搜索" @visible-change="visibleChange" @change="selectChange" :remote-method="search" :loading="loading" :popper-append-to-body="false">
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
      visible: false,
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
    },
    visibleChange(visible) {
      this.visible = visible
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
  width: 32px;
  overflow: hidden;
  border-radius: 16px;
  transition: all 0.4s;
  box-shadow: 0 0 1px 1px $jc-color-primary;

  &:hover,
  &.jc-active {
    width: 160px;
    overflow: visible;
  }

  /deep/ .el-select {
    width: 100%;
    .el-input__inner {
      border-radius: 18px;
      padding: 0 15px 0 32px;
    }
    .el-select-dropdown {
      left: 0 !important;
    }
  }
  .el-icon-search {
    position: absolute;
    display: block;
    width: 32px;
    height: 100%;
    z-index: 9;
    left: 0;
    top: 0;
    line-height: 32px;
    text-align: center;
    cursor: pointer;
    z-index: 9;
  }
}
</style>

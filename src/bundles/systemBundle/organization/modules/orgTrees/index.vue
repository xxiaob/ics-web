<template>
  <div class="jc-ph">
    <div class="jc-title" v-text="title"></div>
    <el-input v-model="filterText" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-tree-warp">
      <tree-card ref="tree"></tree-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemOrganizationTrees',
  components: {
    TreeCard: () => import('./modules/treeCard')
  },
  props: {
    title: {
      type: String,
      default: '组织架构'
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  data() {
    return {
      filterText: ''
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-title {
  height: 40px;
  line-height: 40px;
  font-weight: $jc-font-weight-bold;
}
.jc-tree-warp {
  position: absolute;
  top: 76px;
  left: $jc-default-dis;
  right: $jc-default-dis;
  bottom: $jc-default-dis;
  overflow: auto;
}
</style>

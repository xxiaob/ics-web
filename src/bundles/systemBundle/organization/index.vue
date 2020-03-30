<template>
  <div class="jc-main-container-warp">
    <el-card>
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">组织架构</div>
        <div class="jc-button-group">
          <el-input v-model="filterText" class="jc-filter-input" clearable size="small" placeholder="输入关键字进行过滤"></el-input>
          <el-button type="primary" size="small" :icon="treeEdit?'el-icon-finished':'el-icon-edit'" @click="treeEdit = !treeEdit">{{treeEdit?'完成':'编辑'}}</el-button>
        </div>
      </div>
      <tree-card ref="tree" :edit="treeEdit"></tree-card>
    </el-card>
  </div>
</template>
<script>

export default {
  name: 'SystemOrganizationIndex',
  components: {
    TreeCard: () => import('./modules/treeCard')
  },
  data() {
    return {
      list: [],
      loading: false,
      treeEdit: false,
      filterText: ''
    }
  },
  watch: {
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-filter-input {
  width: 200px;
  display: inline-block;
}
</style>

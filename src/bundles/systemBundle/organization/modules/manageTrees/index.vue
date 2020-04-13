<template>
  <div class="jc-card jc-ph">
    <div class="jc-title">
      {{title}}
      <el-button class="jc-edit-btn" type="text" size="small" :icon="treeEdit?'el-icon-finished':'el-icon-edit'" @click="treeEdit = !treeEdit"></el-button>
    </div>
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-tree-warp">
      <tree-card ref="tree" @node-change="nodeChange" :edit="treeEdit"></tree-card>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemOrganizationManageTrees',
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
      filterText: '',
      treeEdit: false
    }
  },
  methods: {
    nodeChange(data) {
      this.$emit('node-change', data)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-edit-btn {
  float: right;
  padding: 0;
  border: none;
  height: 40px;
  line-height: 40px;
  font-size: $jc-font-size-base;
}
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

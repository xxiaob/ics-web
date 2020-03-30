<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :data="trees" :props="props" empty-text="暂无组织架构，请添加" :filter-node-method="filterNode">
      <div class="custom-tree-node" slot-scope="{ node }">
        <div class="jc-tree-label">
          <div class="jc-text-warp" v-text="node.label"></div>
        </div>
        <div class="jc-tree-options" v-if="edit" v-on:click.stop>
          <el-button type="text" size="small" icon="el-icon-delete" v-if="node.level > 1"></el-button>
          <el-button type="text" size="small" icon="el-icon-edit-outline"></el-button>
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline"></el-button>
        </div>
      </div>
    </el-tree>
  </div>
</template>
<script>
import TreesFilter from '@/mixins/TreesFilter'

export default {
  name: 'SystemOrganizationTreeCard',
  mixins: [TreesFilter],
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      trees: [{ label: '江苏省', children: [{ label: '南京市' }, { label: '无锡市' }] }],
      props: {
        children: 'children',
        label: 'label'
      }
    }
  },
  methods: {
    initData() {

    }
  }
}
</script>
<style lang="scss" scoped>
.jc-tree-card {
  position: relative;
  min-height: 200px;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  .jc-tree-label {
    flex: 1;
    width: 0;
  }
  .jc-tree-options {
    width: 50px;
    padding-top: 2px;
    .el-button {
      padding: 0;
      margin-left: 2px;
      float: right;
    }
  }
}
</style>

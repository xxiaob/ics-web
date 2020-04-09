<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :data="trees" :props="props" :filter-node-method="filterNode" @node-click="nodeClick">
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
import TreesFilterMixins from '@/mixins/TreesFilterMixins'

export default {
  name: 'SystemOrganizationManageTreesTreeCard',
  mixins: [TreesFilterMixins],
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

    },
    nodeClick(data, node) {
      console.log('点击了节点', data, node)
      this.$emit('node-change', { label: data.label })
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
    font-size: $jc-font-size-small;
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

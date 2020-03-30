<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree :data="trees" :props="props" empty-text="暂无组织结构，请添加">
      <div class="custom-tree-node" slot-scope="{ node }">
        <div class="jc-tree-label">
          <div class="jc-text-warp" v-text="node.label"></div>
        </div>
        <div class="jc-tree-options" v-if="edit" v-on:click.stop>
          <el-button type="text" size="small" icon="el-icon-delete"></el-button>
          <el-button type="text" size="small" icon="el-icon-edit-outline"></el-button>
          <el-button type="text" size="small" icon="el-icon-circle-plus-outline"></el-button>
        </div>
      </div>
    </el-tree>
  </div>
</template>
<script>
export default {
  name: 'SystemOrganizationTreeCard',
  props: {
    edit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      loading: false,
      trees: [],
      pid: 1,
      props: {
        children: 'children',
        label: 'label',
        isLeaf: 'leaf'
      }
    }
  },
  methods: {

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

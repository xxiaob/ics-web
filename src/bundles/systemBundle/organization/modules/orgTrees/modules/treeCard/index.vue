<template>
  <div class="jc-tree-card" v-loading="loading">
    <el-tree ref="tree" :data="trees" :props="props" :filter-node-method="filterNode" @node-click="nodeClick">
      <div class="custom-tree-node" slot-scope="{ node }">
        <div class="jc-text-warp" v-text="node.label"></div>
      </div>
    </el-tree>
  </div>
</template>
<script>
import TreesFilter from '@/mixins/TreesFilter'

export default {
  name: 'SystemOrganizationTreesTreeCard',
  mixins: [TreesFilter],
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
  width: 0;
  font-size: $jc-font-size-small;
}
</style>

<template>
  <div class="jc-main-container-warp">
    <tab-filter></tab-filter>
    <el-card class="jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
        <div class="jc-button-group">
          <el-button type="primary" size="small" :icon="treeEdit?'el-icon-finished':'el-icon-edit'" @click="treeEdit = !treeEdit">{{treeEdit?'完成':'编辑'}}</el-button>
        </div>
      </div>
      <tree-card :edit="treeEdit"></tree-card>
    </el-card>
  </div>
</template>
<script>

export default {
  name: 'SystemOrganizationIndex',
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    TreeCard: () => import('./modules/treeCard')
  },
  data() {
    return {
      list: [],
      loading: false,
      treeEdit: false,
      filter: {}
    }
  },
  methods: {
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    }
  }
}
</script>

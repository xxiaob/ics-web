<template>
  <div class="jc-main-full-container">
    <manage-trees class="jc-trees-warp" @node-change="nodeChange"></manage-trees>
    <div class="jc-trees-content">
      <detail-info class="jc-detail-warp"></detail-info>
      <area-manage class="jc-area-warp"></area-manage>
    </div>
  </div>
</template>
<script>

export default {
  name: 'SystemOrganizationIndex',
  components: {
    ManageTrees: () => import('./modules/manageTrees'),
    DetailInfo: () => import('./modules/info'),
    AreaManage: () => import('./modules/areaManage')
  },
  methods: {
    nodeChange(data) {
      console.log('组织管理，树节点change：', data)
    }
  }
}
</script>
<style lang="scss" scoped>
$jc-edit-trees-width: $jc-trees-width * 1.2;
$jc-detail-height: 200px;
.jc-trees-warp {
  position: absolute;
  top: $jc-default-dis;
  left: $jc-default-dis;
  bottom: $jc-default-dis;
  width: $jc-edit-trees-width;
  z-index: 1;
}
.jc-trees-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding: $jc-default-dis $jc-default-dis 0 $jc-edit-trees-width +
    $jc-default-dis * 2;
  overflow: auto;
  .jc-detail-warp {
    height: $jc-detail-height;
    min-width: $jc-min-width - $jc-edit-trees-width;
  }
  .jc-area-warp {
    position: absolute;
    top: $jc-detail-height + $jc-default-dis * 2;
    left: $jc-edit-trees-width + $jc-default-dis * 2;
    right: $jc-default-dis;
    bottom: $jc-default-dis;
    min-width: $jc-min-width - $jc-edit-trees-width;
  }
}
</style>

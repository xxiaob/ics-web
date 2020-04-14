<template>
  <div class="jc-main-full-container">
    <org-trees class="jc-trees-warp" @node-change="nodeChange"></org-trees>
    <div class="jc-trees-content">
      <role-list ref="myRoles" class="jc-main-container-warp"></role-list>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemRoleIndex',
  components: {
    OrgTrees: () => import('@/bundles/systemBundle/organization/modules/orgTrees'),
    RoleList: () => import('./modules/roles')
  },
  methods: {
    nodeChange(data) {
      console.log('角色管理，树节点change：', data)
      this.$refs.myRoles.initData(data.orgId)
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-trees-warp {
  position: absolute;
  top: $jc-default-dis;
  left: $jc-default-dis;
  bottom: $jc-default-dis;
  width: $jc-trees-width;
  background-color: $jc-color-white;
  border-radius: $jc-border-radius-base;
  z-index: 1;
}
.jc-trees-content {
  position: relative;
  width: 100%;
  height: 100%;
  padding-left: $jc-trees-width + $jc-default-dis;
  overflow: auto;
  .jc-main-container-warp {
    min-width: $jc-min-width - $jc-trees-width;
  }
}
</style>

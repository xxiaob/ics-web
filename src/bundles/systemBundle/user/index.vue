<template>
  <div class="jc-main-full-container">
    <org-trees class="jc-trees-warp" @node-change="nodeChange"></org-trees>
    <div class="jc-trees-content">
      <user-list ref="myUsers" class="jc-main-container-warp"></user-list>
    </div>
  </div>
</template>
<script>
export default {
  name: 'SystemUserIndex',
  components: {
    OrgTrees: () => import('@/bundles/systemBundle/organization/modules/orgTrees'),
    UserList: () => import('./modules/users')
  },
  methods: {
    nodeChange(data) {
      console.log('用户管理，树节点change：', data)
      this.$refs.myUsers.initData(data.orgId)
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

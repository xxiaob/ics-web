<template>
  <div class="jc-forward-list">
    <warning-list></warning-list>
    <forward-list :taskId="taskId"></forward-list>
  </div>
</template>

<script>
export default {
  name: 'ScreenCommandMessageDetailTemporaryForwardList',
  props: {
    taskId: {
      type: String,
      default: ''
    }
  },
  components: {
    WarningList: () => import('@/bundles/screenBundle/command/modules/common/warningList'),
    ForwardList: () => import('@/bundles/taskBundle/taskProcess/modules/detail/forwardList')
  }
}
</script>

<style lang="scss" scoped>

</style>

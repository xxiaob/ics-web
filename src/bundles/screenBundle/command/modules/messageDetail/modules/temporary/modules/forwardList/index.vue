<template>
  <div class="jc-forward-list">
    <warning-list :list="list"></warning-list>
    <forward-list :taskId="taskId"></forward-list>
  </div>
</template>

<script>
import { getDetail } from '@/api/warning'
import { WARNING_DETAIL_TYPE } from '@/constant/Dictionaries'
export default {
  name: 'ScreenCommandMessageDetailTemporaryForwardList',
  props: {
    taskId: {
      type: String,
      default: ''
    },
    projectId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      list: []
    }
  },
  watch: {
    taskId: {
      immediate: true,
      handler() {
        this.getWarning()
      }
    }
  },
  methods: {
    async getWarning() {
      try {
        this.list = await getDetail({
          businessId: this.taskId,
          projectId: this.projectId,
          selectType: WARNING_DETAIL_TYPE.TASK
        })
      } catch (error) {
        console.error(error)
      }
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

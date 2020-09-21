<template>
  <div class="jc-question">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :info="info" :taskId="taskId"></component>
    </keep-alive>
  </div>
</template>
<script>
import { listByProblemId } from '@/api/task'

export default {
  name: 'ScreenCommandMessageDetailQuestion',
  props: ['info'],
  components: {
    ViewTabs: () => import('../../../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'),
    Temporary: () => import('../temporary/modules/baseInfo'),
    EventList: () => import('../temporary/modules/eventList')
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      tabs: [
        { label: '基础信息', value: 'BaseInfo' },
        { label: '相关任务', value: 'Temporary' },
        { label: '关联事件', value: 'EventList' }
      ],
      taskId: ''
    }
  },
  watch: {
    info: {
      immediate: true,
      deep: true,
      handler() {
        this.getTemporary()
      }
    }
  },
  methods: {
    async getTemporary() {
      if (this.info && this.info.id) {
        try {
          const res = await listByProblemId(this.info.id)

          this.taskId = (res && res.businessKey) ? res.businessKey : ''
        } catch (error) {
          console.error(error)
        }
      } else {
        this.taskId = ''
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-question {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>

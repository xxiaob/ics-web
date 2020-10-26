<template>
  <div class="jc-warning">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :info="info" :taskId="taskId"></component>
    </keep-alive>
  </div>
</template>
<script>
import { getTaskByResource } from '@/api/dregsAlarm'
import { TASK_SOURCES } from '@/constant/Dictionaries'

export default {
  name: 'ScreenCommandMessageDetailWaring',
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
          const res = await getTaskByResource({ sourceId: this.info.id, sourceType: TASK_SOURCES.RESIDUEWARING })

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
.jc-warning {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
}
</style>

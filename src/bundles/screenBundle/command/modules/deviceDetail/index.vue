<template>
  <view-warp :title="options.userName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
  </view-warp>
</template>
<script>
import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'
// import { getChannelByUserId } from '@/api/live'

export default {
  name: 'ScreenCommandDeviceDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    WorkingInfo: () => import('./modules/workingInfo') // 运行信息

  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      videoTypes: VIDEO_INVITE_TYPES,
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '运行信息', value: 'WorkingInfo' }]
    }
  },
  mounted() {
    console.log(this.options, this.project)
  },
  methods: {

  }
}
</script>
<style lang="scss" scoped>

</style>

<template>
  <view-warp :title="options.userName">
    <view-tabs v-model="tabComponent" :options="tabs"></view-tabs>
    <keep-alive>
      <component :is="tabComponent" :options="options" :project="project"></component>
    </keep-alive>
    <div class="jc-user-detail-footer">
      <div class="jc-user-detail-item">投屏</div>
      <!-- <div class="jc-user-detail-item">投屏</div> -->
    </div>
  </view-warp>
</template>
<script>
import { VIDEO_INVITE_TYPES } from '@/constant/Dictionaries'
// import { getChannelByUserId } from '@/api/live'

export default {
  name: 'ScreenCommandEventDetail',
  props: ['options', 'project'],
  components: {
    ViewWarp: () => import('../common/viewWarp'),
    ViewTabs: () => import('../common/viewTabs'),
    BaseInfo: () => import('./modules/baseInfo'), //基础信息
    EventPhoto: () => import('./modules/eventPhoto'), // 事件照片
    EventAudioAndVideo: () =>import('./modules/eventAudioAndVideo') //考勤
  },
  data() {
    return {
      tabComponent: 'BaseInfo',
      videoTypes: VIDEO_INVITE_TYPES,
      tabs: [{ label: '基础信息', value: 'BaseInfo' }, { label: '事件照片', value: 'EventPhoto' }, { label: '录像录音', value: 'EventAudioAndVideo' }]
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
.jc-user-detail-footer {
  position: relative;
  display: flex;
  .jc-user-detail-item {
    flex: 1;
    cursor: pointer;
    margin: 12px 0;
    height: 20px;
    color: $jc-color-text-secondary;
    font-size: $jc-font-size-smaller;
    @include jc-vhcenter;
    border-right: solid 1px $jc-color-line-primary;
    &:last-child {
      border-right: none;
    }

    &:hover {
      color: $jc-color-primary;
    }
  }
}
</style>

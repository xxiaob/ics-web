<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-event-video">
      <div class="jc-event-video-title">事件录像</div>
      <div class="jc-event-video-wrap" v-if="list.length">
      </div>
      <view-empty v-else></view-empty>
    </div>
    <div class="jc-event-audio">
      <div class="jc-event-audio-title">事件录音</div>
      <div class="jc-event-audio-wrap" v-if="list.length">
      </div>
      <view-empty v-else></view-empty>
    </div>
  </div>
</template>
<script>
// import { getTaskPersonalLine } from '@/api/screen'

export default {
  name: 'ScreenCommandEventDetailAudioAndVideo',
  props: ['options', 'project'],
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      loading: false,
      list: []
    }
  },
  watch: {
    options() {
      this.initData()
    }
  },
  created() {
    this.initData()
  },
  methods: {
    async initData() {
      this.loading = true
      this.analysis = {}
      try {
        let list = []

        this.list = list
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }

  }
}
</script>

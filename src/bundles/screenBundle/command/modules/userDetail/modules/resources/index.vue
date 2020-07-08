<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-resource-warp">
      <div class="jc-resource-item">
        <video class="jc-video"></video>
        <div class="jc-title"></div>
      </div>
    </div>
    <view-empty v-if="list.length < 1"></view-empty>
    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
import { getRecording } from '@/api/live'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'ScreenCommandUserDetailResources',
  props: ['options', 'project'],
  mixins: [MediaMixins],
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
      this.list = []
      try {
        let res = await getRecording({ initiator: '56783818509516800', videoType: 'Capture' })
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-resource-warp {
  position: relative;
  padding: $jc-default-dis/2;
  .jc-resource-item {
    position: relative;
    overflow: hidden;
    .jc-video {
      display: block;
      width: 100%;
      height: 160px;
    }
    .jc-title {
      text-align: center;
      height: 30px;
      line-height: 30px;
      color: $jc-color-text-regular;
    }
  }
}
</style>

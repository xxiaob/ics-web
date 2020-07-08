<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <el-row :gutter="10">
      <el-col :span="12">
        <div class="jc-resource-warp">
          <video class="jc-video"></video>
          <div class="jc-title"></div>
        </div>
      </el-col>
      <el-col :span="12">2</el-col>
    </el-row>
    <view-empty v-if="list.length < 1"></view-empty>
    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
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
        // this.detail = await userGet({ userId: this.options.userId })
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
}
</style>

<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-resource-warp" v-if="list.length">
      <div class="jc-resource-item" v-for="item in list" :key="item.id">
        <video :src="item.url" class="jc-video" controls></video>
        <div class="jc-title" v-text="item.name"></div>
      </div>
    </div>
    <view-empty v-else></view-empty>
  </div>
</template>
<script>
import { getRecording } from '@/api/live'

export default {
  name: 'ScreenCommandUserDetailResources',
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
      this.list = []
      try {
        let res = await getRecording({ initiator: '56783818509516800', videoType: 'Capture' })

        let list = []

        if (res && res.length) {
          res.forEach(item => {
            list.push({ id: item.id, name: item.videoName, url: item.videoUrl })
          })
        }
        this.list = list
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

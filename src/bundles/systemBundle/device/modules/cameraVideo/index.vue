<template>
  <div class="jc-main-container-warp">
    <video-filter @filter="goFilter" :detail="detail">
      <template v-slot:back>
        <el-button icon="el-icon-back" size="small" @click="back" style="margin-right:20px">返回</el-button>
      </template>
    </video-filter>
    <el-card class="jc-table-card jc-mt">
      <video class="jc-video" controls :src="src"></video>
    </el-card>
  </div>
</template>
<script>
export default {
  name: 'SystemDeviceCameraVideo',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      filter: {},
      src: 'https://192.168.0.150:9000/group1/M00/00/28/wKgAeF80qX2AAUSIBGwc-DEbYQ8509.mp4'
    }
  },
  components: {
    VideoFilter: () => import('../videoFilter')
  },
  watch: {
    detail: {
      immediate: true,
      deep: true,
      handler() {
        this.initData()
      }
    }
  },
  methods: {
    initData() {
      if (this.detail && this.detail.id) {
        console.log('initData', this.detail.id)
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.initData()
    },
    back() {
      this.$parent.checkShow('index')
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-table-card /deep/ .el-card__body {
  padding: 20px;
  text-align: center;
}
.jc-video {
  width: 80%;
  height: 70vh;
}
</style>

<template>
  <div class="jc-main-container-warp">

    <video-filter @filter="goFilter" :detail="detail">
      <template v-slot:back>
        <el-button icon="el-icon-back" size="small" @click="back" style="margin-right:20px">返回</el-button>
      </template>
    </video-filter>

    <el-card class="jc-table-card jc-mt">
      <div class="jc-video-container">
        <div class="jc-video-item" v-for="item in list" :key="item">
          <div class="jc-video-item-time">2020-08-10 15:03:23</div>
          <video class="jc-video" src="https://192.168.0.150:9000/group1/M00/00/28/wKgAeF80qX2AAUSIBGwc-DEbYQ8509.mp4" @click="showVideo('https://192.168.0.150:9000/group1/M00/00/28/wKgAeF80qX2AAUSIBGwc-DEbYQ8509.mp4')"></video>
        </div>
        <div v-show="list.length===0">暂无数据</div>
      </div>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt" :page-sizes="[12, 24, 36]"></el-pagination>
    </el-card>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="60vw" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>

  </div>
</template>
<script>
import PaginationMixins from '@/mixins/PaginationMixins'

export default {
  name: 'SystemDeviceLawVideo',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      dialogVideoVisible: false,
      dialogVideoUrl: '',
      filter: {},
      list: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
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
  created() {
    this.page.pageSize = 12
  },
  methods: {
    initData() {
      if (this.page.pageSize === 10) {
        this.page.pageSize = 12
      }
      if (this.detail && this.detail.id) {
        console.log('initData', this.detail.id)
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange()
    },
    back() {
      this.$parent.checkShow('index')
    },
    showVideo(url) {
      this.dialogVideoUrl = url
      this.dialogVideoVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
.jc-table-card /deep/ .el-card__body {
  // padding: 20px;
  text-align: center;
}

.jc-video-container::after {
  content: "";
  display: table;
  clear: both;
}

.jc-video-item {
  width: 25%;
  box-sizing: border-box;
  padding: 0 20px;
  float: left;

  .jc-video-item-time {
    line-height: 30px;
    padding-top: 10px;
  }

  .jc-video {
    width: 100%;
    height: 20vh;
    object-fit: cover;
    cursor: pointer;
  }
}
</style>

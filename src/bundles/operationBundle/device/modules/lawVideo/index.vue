<template>
  <div class="jc-main-container-warp">

    <video-filter @filter="goFilter" :detail="detail">
      <template v-slot:back>
        <el-button icon="el-icon-back" size="small" @click="back" style="margin-right:20px">返回</el-button>
      </template>
    </video-filter>

    <el-card class="jc-table-card jc-mt jc-law-list">
      <div class="jc-video-container">
        <div class="jc-video-item" v-for="item in list" :key="item.url1">
          <div class="jc-video-item-time">{{item.time}}</div>
          <video class="jc-video" :src="item.url1" @click="showVideo(item.url1)"></video>
        </div>
        <div v-show="list.length===0" class="empty">暂无数据</div>
      </div>
      <!-- <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt" :page-sizes="[12, 24, 36]"></el-pagination> -->
    </el-card>

    <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="60vw" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
    </el-dialog>

  </div>
</template>
<script>
// import PaginationMixins from '@/mixins/PaginationMixins'
import { getRelay } from '@/api/device'

export default {
  name: 'SystemDeviceLawVideo',
  props: {
    detail: {
      type: Object,
      default: ()=>{}
    }
  },
  // mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      dialogVideoVisible: false,
      dialogVideoUrl: '',
      filter: {},
      list: []
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
  // created() {
  //   this.page.pageSize = 12
  // },
  methods: {
    async initData() {
      // if (this.page.pageSize === 10) {
      //   this.page.pageSize = 12
      // }
      if (this.detail && this.detail.deviceId && this.filter && this.filter.startTime) {
        try {
          const { deviceId, cameraId } = this.detail

          this.list = await getRelay({ deviceId, cameraId, ...this.filter })

          // console.log('LawVideo initData', res)
          // this.list = new Array(30).fill('1')
        } catch (error) {
          console.error(error)
        }
      }
    },
    goFilter(filter) {
      this.filter = filter
      // this.currentChange()
      this.initData()
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
.jc-main-container-warp{
  height: 100%;
  display: flex;
  flex-direction: column;

  .jc-law-list{
    flex: 1;
    overflow: auto;

    .empty{
      text-align: center;
      padding: $jc-default-dis;
    }
  }
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

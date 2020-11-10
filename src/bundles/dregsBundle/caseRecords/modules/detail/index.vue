<template>
  <div>
    <el-card class="jc-table-card">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">案件详情</div>
        <div class="jc-button-group">
          <el-button size="small" icon="el-icon-arrow-left" @click="$emit('update:detailShow', false)">返回</el-button>
        </div>
      </div>
      <div class="jc-detail">
        <el-form class="jc-manage-form" ref="form" label-width="100px" :model="form" size="small">
          <div>
            <el-form-item label="标题：">
              <span>{{form.title}}</span>
            </el-form-item>
            <el-form-item label="立案描述：">
              <span>{{form.desc}}</span>
            </el-form-item>
            <el-form-item label="时间：">
              <span>{{form.createTime | filterTime}}</span>
            </el-form-item>
            <el-form-item label="立案材料：">
             <el-image v-for="url in form.caseImgs" :key="url" :src="url" :preview-src-list="form.caseImgs" class="jc-img"></el-image>
            </el-form-item>
          </div>
        </el-form>

        <div class="jc-problem-title">关联问题</div>

        <el-form ref="problemDetail" label-width="100px"  class="jc-manage-form" size="small">

          <div class="jc-clearboth">
            <el-form-item label="问题标题：" class="jc-left-width40">
              <div>{{ problemDetail.problemTitle }}</div>
            </el-form-item>
            <el-form-item label="问题类型：" class="jc-left-width30">
              <span>{{problemDetail.problemTypeName}}</span>
            </el-form-item>
            <el-form-item label="车牌号：" class="jc-left-width30">
              <span>{{problemDetail.carNumber}}</span>
            </el-form-item>
          </div>

          <div class="jc-clearboth">
            <el-form-item label="查出地点：" class="jc-left-width40">
              <span>{{problemDetail.positionName}}</span>
            </el-form-item>
            <el-form-item label="运输公司：" class="jc-left-width30">
              <span>{{problemDetail.transportCompany}}</span>
            </el-form-item>
            <el-form-item label="上报人：" class="jc-left-width30">
              <span>{{problemDetail.userName}}</span>
            </el-form-item>
          </div>

          <div class="jc-clearboth">
            <el-form-item label="问题描述：" class="jc-left-width40">
              <span>{{problemDetail.problemDesc}}</span>
            </el-form-item>
            <el-form-item label="创建时间：" class="jc-left-width30">
              <span>{{problemDetail.createTime | filterTime}}</span>
            </el-form-item>

          </div>


          <el-form-item label="现场照片：">
            <el-image v-for="url in problemDetail.filePO && problemDetail.filePO.photos" :key="url" :src="url" :preview-src-list="imgs"  class="jc-img"></el-image>
          </el-form-item>
          <el-form-item label="视频：">
            <div class="jc-video" v-for="url in problemDetail.filePO && problemDetail.filePO.videoAddrs" :key="url" @click="showVideo(url)">
              <video :src="url"></video>
              <div class="hover">
                <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="">
              </div>
            </div>
          </el-form-item>
          <el-form-item label="音频：">
              <div v-for="(url,index) in problemDetail.filePO && problemDetail.filePO.audioAddrs" :key="url" class="jc-audio" @click="playAudio(url,index)">
                <img class="jc-audio-mike" src="@/bundles/taskBundle/assets/mike.png" alt="">
                <div class="hover">
                  <img class="jc-video-play" src="@/bundles/taskBundle/assets/play.png" alt="" v-show="audioPlayShows[index]">
                  <img class="jc-video-play" src="@/bundles/taskBundle/assets/pause.png" alt="" v-show="!audioPlayShows[index]">
                </div>
              </div>
            </el-form-item>
        </el-form>
      </div>
      <audio v-if="detailShow" ref="audio" :src="audioUrl" style="width:0;height:0" @ended="audioEnded"></audio>
      <el-dialog title="视频播放" :visible.sync="dialogVideoVisible" width="800px" :close-on-click-modal="false" :append-to-body="true">
          <video v-if="dialogVideoVisible" :src="dialogVideoUrl" autoplay controls width="100%"></video>
        </el-dialog>
    </el-card>

  </div>

</template>
<script>

import { getProblemDetail } from '@/api/dregsAlarm'
import { formatDate } from '@/libs/util'
import MediaMixins from '@/bundles/taskBundle/mixins/MediaMixins'

export default {
  name: 'caseRecordsDetail',
  mixins: [MediaMixins],
  props: {
    info: {
      type: Object,
      default: ()=>{}
    },
    detailShow: {
      type: Boolean
    }
  },
  data() {
    return {
      loading: false,
      form: {},
      problemDetail: {}
    }
  },
  watch: {
    info: {
      // immediate: true,
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  filters: {
    filterTime(value) {
      return formatDate(value)
    }
  },
  created() {
    console.log('this.info2', this.info)
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      // 立案详情
      this.form = { ...this.info, ...{
        caseImgs: this.info.uploadFilePath.split(',')
      } }

      // 问题详情
      this.problemDetail = await getProblemDetail(this.info.id)
      console.log('pp', this.problemDetail)
    }
  }
}
</script>
<style lang="scss" scoped>
@import "@/bundles/taskBundle/css/media.scss";
/deep/ .el-form-item {
  margin-bottom: 6px;
}

.jc-manage-form{
  margin-top: 20px;
}

.jc-problem-title{
  margin:40px 0 30px;
  font-weight: 700;
}

.jc-left-width40 {
  width: 40%;
  float: left;
}
.jc-left-width30 {
  width: 30%;
  float: left;
}

.jc-clearboth::after,
.jc-clearboth::before {
  content: "";
  display: table;
  clear: both;
}

</style>


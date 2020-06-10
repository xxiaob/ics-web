<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-detail-warp" v-for="(item,index) in list" :key="index">
      <div class="jc-detail-label" v-text="item.title"></div>
      <div class="jc-detail-content" v-if="item.name" v-text="item.name"></div>
      <div class="jc-detail-content" v-else>
        <div class="jc-media-warp">
          <video v-if="item.type == 'video'" :src="item.url" @click="showVideo(item.url)"></video>
          <img v-if="item.type == 'img'" :src="item.url">
        </div>
      </div>
    </div>
    <el-dialog title="视频播放" :visible.sync="visible" width="800px" :close-on-click-modal="false" :append-to-body="true">
      <video v-if="visible" :src="videlUrl" autoplay controls width="100%"></video>
    </el-dialog>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandMessageDetailEvent',
  props: ['options'],
  data() {
    return {
      loading: false,
      visible: false,
      videlUrl: '',
      list: [{ title: '事件ID', name: 'E20200610183842p3RLcB' }, { title: '上报人', name: '麒麟街道管理员' }, { title: '所属组织', name: '麒麟街道' },
        { title: '事件标题', name: '暴露垃圾' }, { title: '事件描述', name: '2020年6月10日。秀园路溧水永阳幼儿园门前发现暴露垃圾，现已处理完毕。' }, { title: '事件类型', name: '暴露垃圾' }, { title: '处理前图片', type: 'img', url: 'http://218.94.132.110:880/group1/M00/00/00/wKgBZV7guByAARiLAATLPYbRkDE74.JPEG' }, { title: '处理后图片', type: 'img', url: 'http://218.94.132.110:880/group1/M00/00/00/wKgBZV7guCKAF--qAASbG5R0Ij444.JPEG' }, { title: '视频文件', type: 'video', url: 'http://218.94.132.110:880/group1/M00/00/00/wKgBZV7guC-AbG-UAGKoBhXrbCs695.mp4' }, { title: '音频文件' }]
    }
  },
  methods: {
    showVideo(url) {
      this.videlUrl = url
      this.visible = true
    }
  }
}
</script>

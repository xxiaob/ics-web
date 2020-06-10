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
  name: 'ScreenCommandMessageDetailQuestion',
  props: ['options'],
  data() {
    return {
      loading: false,
      visible: false,
      videlUrl: '',
      list: [{ title: '问题ID', name: '58659236976001024' }, { title: '上报人', name: '濮大林' }, { title: '所属组织', name: '渣土中队' },
        { title: '问题标题', name: '机动车乱停放' }, { title: '问题描述', name: '非法小广告' }, { title: '问题类型', name: '暂无' }, { title: '附件', name: '暂无' }]
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

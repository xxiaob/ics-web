<template>
  <section class="jc-main-body">
    <router-view />
    <el-image v-if="show" ref="previewImage" style="height: 0;position: absolute;" :src="url" :preview-src-list="srcList">
    </el-image>
  </section>
</template>
<script>
export default {
  name: 'FullPage',
  data() {
    return {
      show: false,
      url: '',
      srcList: []
    }
  },
  created() {
    this.$EventBus.$on('show-full-img', this.showImages)
  },
  methods: {
    showImages(data) {
      // console.log('show-full-img', data)
      this.show = false
      this.url = data.url
      this.srcList = data.imgs
      setTimeout(() => {
        this.show = true
        this.$nextTick(() => {
          this.$refs.previewImage.showViewer = true
        })
      })
    }
  },
  beforeDestroy() {
    this.$EventBus.$off('show-full-img', this.showImages)
  }
}
</script>
<style lang="scss" scoped>
.jc-main-body {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

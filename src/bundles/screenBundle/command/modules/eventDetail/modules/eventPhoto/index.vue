<template>
  <div class="jc-view-content" v-loading="loading" element-loading-background="rgba(0, 0, 0, 0)">
    <div class="jc-event-photo-item">
      <div class="jc-event-photo-title">处理前照片</div>
      <div class="jc-event-photo-wrap">
      </div>
      <view-empty v-if="list.length < 1"></view-empty>
    </div>
    <div class="jc-event-photo-item">
      <div class="jc-event-photo-title">处理后照片</div>
      <div class="jc-event-photo-wrap">
      </div>
      <view-empty v-if="list.length < 1"></view-empty>
    </div>
  </div>
</template>
<script>


export default {
  name: 'ScreenCommandEventDetailEventPhoto',
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
        let list = []

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

</style>

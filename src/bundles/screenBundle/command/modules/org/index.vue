<template>
  <view-warp title="组织架构">
    <div class="jc-view-content" v-loading="loading" element-loading-spinner="jc-loading-spinner" element-loading-background="rgba(0, 0, 0, 0)"></div>
  </view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandOrg',
  props: ['options'],
  components: {
    ViewWarp: () => import('../commont/viewWarp')
  },
  data() {
    return {
      loading: true
    }
  },
  created() {
    console.log('ScreenCommandOrg')
  },
  methods: {

  }
}
</script>

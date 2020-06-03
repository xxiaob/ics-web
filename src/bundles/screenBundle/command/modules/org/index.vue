<template>
  <view-warp title="组织架构"></view-warp>
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

    }
  },
  created() {
    console.log('ScreenCommandOrg')
  },
  methods: {

  }
}
</script>

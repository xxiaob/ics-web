<template>
  <view-warp title="网格"></view-warp>
</template>
<script>
export default {
  name: 'ScreenCommandGrid',
  props: ['options'],
  components: {
    ViewWarp: () => import('../commont/viewWarp')
  },
  data() {
    return {

    }
  },
  created() {
    console.log('ScreenCommandGrid')
  },
  methods: {

  }
}
</script>

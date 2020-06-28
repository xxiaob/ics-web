<template>
  <div class="jc-view-content"></div>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetailTask',
  props: ['options', 'project'],
  data() {
    return {
      loading: false
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
      try {
        //
      } catch (error) {
        console.log(error)
      }
      this.loading = false
    }
  }
}
</script>

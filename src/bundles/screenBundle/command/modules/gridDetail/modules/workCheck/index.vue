<template>
  <div class="jc-view-content">
    <view-empty v-if="list.length < 1"></view-empty>
  </div>
</template>
<script>
export default {
  name: 'ScreenCommandGridDetailWorkCheck',
  props: ['options', 'project'],
  components: {
    ViewEmpty: () =>import('@/bundles/screenBundle/command/modules/common/viewEmpty')
  },
  data() {
    return {
      loading: false,
      list: []
    }
  }
}
</script>

<template>
  <im-live :params.sync="params" :visible.sync="visible"></im-live>
</template>
<script>
import imLive from '@/bundles/liveBundle/imLive'

export default {
  name: 'ScreenCommandMediaLive',
  components: { imLive },
  data() {
    return {
      visible: false,
      params: {}
    }
  },
  created() {
    this.$EventBus.$on('screen-media-live', this.startMediaLive) //监听进行音视频
  },
  methods: {
    startMediaLive(data) {
      if (data.users.length) {
        if (data.users.length > 17) {
          this.$message.error('最多支持17人')
        } else {
          let users = []

          data.users.forEach(item => {
            users.push({ userId: item.id, userName: item.name })
          })

          this.params = {
            users, //用户列表
            inviteType: data.type,
            channelId: null //可选  采集观摩需要
          }
          this.visible = true
        }
      } else {
        this.$message.error('请选择人员')
      }
    }
  },
  beforeDestroy() {
    //去除监听
    this.$EventBus.$off('screen-media-live', this.startMediaLive)
  }
}
</script>

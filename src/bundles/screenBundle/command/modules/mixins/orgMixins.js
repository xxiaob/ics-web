/**
 * 地图组织处理
 */
export default {
  data() {
    return {

    }
  },
  created() {
    this.$EventBus.$on('org-change', this.org) //使用事件总线进行级别切换通知
  },
  methods: {

  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('org-change', this.viewComponentChange)
  }
}

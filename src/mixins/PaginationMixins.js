/**
 * 页面分页功能
 */
export default {
  data() {
    return {
      page: {
        pageSize: 10, // 每页条数
        pageNum: 1,
        total: 0 // 总条数
      }
    }
  },
  methods: {
    //页面切换
    currentChange(index) {
      this.page.pageNum = index
      this.initData()
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.currentChange(1)
    }
  }
}

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
    indexMethod(index) {
      //处理序号
      return this.page.pageSize * this.page.pageNum + index - 9
    },
    currentChange(index) {
      //页面切换
      this.page.pageNum = index > 0 ? index : 1
      this.initData()
    },
    sizeChange(val) {
      this.page.pageSize = val
      this.currentChange(1)
    }
  }
}

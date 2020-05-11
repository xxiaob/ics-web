/**
 * 按钮才做 mixins
 */
export default {
  data() {
    return {
      visible: false,
      info: null,
      pNode: { name: '', pid: '' }
    }
  },
  methods: {
    del(node) {
      this.checkManage(() => {
        this.$confirm('确认删除该网格', '提示', { type: 'warning' }).then(() => {
          // organizationDel(node.orgId).then(() => {
          //   this.$message.success('删除成功')
          //   this.initData()
          // })
        }).catch(() => { })
      })
    },
    manage(node, type) {
      if (type == 1) {
        this.pNode = { name: node.name, pid: node.pid }
        this.info = { orgId: node.orgId, orgName: node.orgName, orgCode: node.orgCode, sameLevelAuth: node.sameLevelAuth }
      } else if (type == 2) {
        this.pNode = { name: node.orgName, pid: node.orgId }
        this.info = null
      }
      this.visible = true
    },
    viewControll(data) {
      this.$emit('grid-change', { type: 'view', data })
    },
    saveSuccess(orgId) {
      this.orgId = orgId
      this.initData()
    },
    nodeClick(data) {
      if (data.view) {
        this.$emit('grid-change', { type: 'fitview', data })
      }
    }
  }
}

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
    manage(data, type) {
      this.pNode = data
      if (type == 1) {
        this.info = { orgId: data.orgId, orgName: data.orgName, orgCode: data.orgCode }
      } else if (type == 2) {
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

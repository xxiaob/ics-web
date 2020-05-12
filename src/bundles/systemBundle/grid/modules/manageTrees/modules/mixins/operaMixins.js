/**
 * 按钮操作 mixins
 */
import { areaDel } from '@/api/area'
export default {
  data() {
    return {
      visible: false,
      info: null,
      pNode: { name: '', orgId: '', areaId: '' }
    }
  },
  methods: {
    del(node) {
      this.$confirm('确认删除该网格', '提示', { type: 'warning' }).then(() => {
        areaDel(node.areaId).then(() => {
          this.$message.success('删除成功')
          this.$refs.tree.remove(node)
        })
      }).catch(() => { })
    },
    manage(data, type) {
      if (type == 1) {
        this.pNode = { name: data.pName, orgId: data.orgId, areaId: data.areaId }
        this.info = data
      } else if (type == 2) {
        this.pNode = { name: data.name, orgId: data.orgId }
        this.info = null
      }
      this.visible = true
    },
    viewControll(data) {
      this.$emit('grid-change', { type: 'view', data })
    },
    saveSuccess(orgId) {
      // this.orgId = orgId
      // this.initData()
    },
    nodeClick(data) {
      if (data.view) {
        this.$emit('grid-change', { type: 'fitview', data })
      }
    }
  }
}

/**
 * 按钮操作 mixins
 */
import { areaDel } from '@/api/area'
export default {
  data() {
    return {
      currentKey: null,
      visible: false,
      info: null,
      pNode: { name: '', orgId: '', areaId: '' }
    }
  },
  methods: {
    del(node) {
      this.$parent.checkWork(() => {
        this.$confirm('确认删除该网格', '提示', { type: 'warning' }).then(() => {
          areaDel(node.areaId).then(() => {
            this.$message.success('删除成功')
            this.$refs.tree.remove(node)
          })
        }).catch(() => { })
      })
    },
    manage(data, type) {
      this.$parent.checkWork(() => {
        this.pNode = { name: data.name, orgId: data.orgId, areaId: data.areaId }
        if (type == 1) {
          this.info = data
        } else if (type == 2) {
          this.info = null
        }
        this.visible = true
      })
    },
    viewControll(data) {
      console.log('viewControll', data)
      this.$emit('grid-change', { type: 'view', data })
    },
    saveSuccess(data) {
      //如果info 存在则是更新成功
      if (this.info) {
        let node = this.$refs.tree.getNode(this.info.id)

        console.log('区域操作，编辑，saveSuccess', data, node)
        Object.assign(node.data, data)
      } else {
        let node = this.$refs.tree.getNode(this.pNode.areaId || this.pNode.orgId)

        if (node.loaded) {
          node.expanded = true
          this.$refs.tree.append({ ...data, view: true }, node)
          this.goEdit(data)
          this.$refs.tree.setCurrentKey(data.id)
        } else {
          this.currentKey = data.id
          this.expandedKeys = [this.expandedKeys[0], node.data.id]
        }

        console.log('区域操作，添加，saveSuccess', data, node)
      }
    },
    goEdit(data) {
      console.log('编辑处理', data)
      if (data.areaId) {
        this.$emit('grid-change', { type: 'areaedit', data })
      }
    }
  }
}

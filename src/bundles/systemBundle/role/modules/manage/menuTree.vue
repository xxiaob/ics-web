<template>
  <el-tree ref="tree" :default-checked-keys="checkedKeys" :data="menuTree" :props="props" node-key="resId" :default-expand-all="true" :show-checkbox="true"></el-tree>
</template>

<script>
export default {
  name: 'SystemRoleManageMenuTree',
  props: {
    isApp: '',
    propMenuTree: {
      type: Array,
      default: ()=>[]
    },
    resIds: {
      type: Array,
      default: ()=>[]
    }
  },
  watch: {
    propMenuTree: {
      deep: true,
      handler(val) {
        this.parentKeys = []
        this.menuTree = this.formatMenuTree(val)
        this.setCheckedKeys()
      }
    },
    resIds: {
      deep: true,
      handler() {
        this.setCheckedKeys()
      }
    }
  },
  data() {
    return {
      menuTree: [],
      parentKeys: [],
      checkedKeys: [],
      props: { children: 'children', label: 'resName' }
    }
  },
  methods: {
    formatMenuTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          if (item.isApp == this.isApp) {
            let node = { resId: item.resId, resName: item.resName }

            let children = this.formatMenuTree(item.children)

            if (children && children.length) {
              node.children = children
              this.parentKeys.push(item.resId)
            }

            trees.push(node)
          }
        })
      }
      return trees
    },
    setCheckedKeys() {
      let checkedKeys = []

      if (this.resIds && this.resIds.length) {
        this.resIds.forEach(resId => {
          if (!this.parentKeys.includes(resId)) {
            checkedKeys.push(resId)
          }
        })
      }

      this.checkedKeys = checkedKeys
    },
    getCheckedKeys() {
      return this.$refs.tree.getCheckedKeys()
    },
    getHalfCheckedKeys() {
      return this.$refs.tree.getHalfCheckedKeys()
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

/**
 * OrgTree 页面混入处理
 */
import { organizationList } from '@/api/organization'

export default {
  data() {
    return {
      orgTree: []
    }
  },
  methods: {
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
    }
  }
}

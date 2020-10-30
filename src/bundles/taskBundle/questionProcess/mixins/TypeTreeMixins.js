/**
 * 问题类型树 页面混入处理
 */

import { questionTypeTree } from '@/api/question'

export default {
  data() {
    return {
      types: []
    }
  },
  methods: {
    formatTypeTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.id || item.typeName,
            label: item.typeName
          }

          let children = this.formatTypeTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    async getTypeTree() {
      const res = await questionTypeTree()

      this.types = this.formatTypeTree(res)
    }
  }
}

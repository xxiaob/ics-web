/**
 * 树结构过滤
 */
import { stringSearch } from '@/libs/util'

export default {
  methods: {
    filter(val) {
      this.$refs.tree.filter(val)
    },
    filterNode(value, data) {
      return stringSearch(value, data.label || data.name)
    }
  }
}

<template>
  <div>
    <div class="jc-left-width50">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
      <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
      <el-button type="" @click="resetChecked" size="mini">清空</el-button>
      <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="true" :filter-node-method="filterNode" :default-expanded-keys="tree.map(item=>item.id)" @check="check" :default-checked-keys="selecteds"></el-tree>
    </div>
    <div class="jc-left-width50 jc-selected-box">
      <div>已选人员</div>
      <div class="jc-selected">
        <el-tag v-for="tag in checkedNodes" :key="tag.id" closable size="small" @close="handleCloseTag(tag)">
          {{tag.label}}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { getOrgUserList } from '@/api/user'
export default {
  name: 'ConfigureManagePeople',
  model: {
    prop: 'selecteds',
    event: 'change'
  },
  props: {
    selecteds: {
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      filterText: '',
      filterArr: [],
      checkedNodes: [],
      tree: []
    }
  },
  watch: {
    filterText(val) {
      this.filterArr = []
      this.$refs.tree.filter(val)
    },
    selecteds: {
      immediate: true,
      handler(val) {
        this.$nextTick(()=>{
          this.$refs.tree.setCheckedKeys(val)
          this.checkedNodes = this.$refs.tree.getCheckedNodes()
        })
      },
      deep: true
    }
  },
  async created() {
    const res = await getOrgUserList({})

    this.tree = this.formatPeopleTree(res)
    this.filterArr = Object.keys(this.formatTreeToObj(this.tree, true))
    setTimeout(()=>{
      this.checkedNodes = this.$refs.tree.getCheckedNodes()
    })
  },
  methods: {
    handleCloseTag(tag) {
      const selecteds = this.selecteds.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$emit('change', selecteds)
      this.$parent.$emit('el.form.change')
    },
    check(checkedNode, { checkedKeys }) {
      this.$emit('change', checkedKeys)
      this.$parent.$emit('el.form.change')
    },
    setCheckedKeys() {
      const selecteds = new Set([...this.filterArr, ...this.selecteds])

      this.$emit('change', [...selecteds])
      this.$parent.$emit('el.form.change')
    },
    resetChecked() {
      this.$emit('change', [])
      this.$parent.$emit('el.form.change')
    },
    filterNode(value, data) {
      if (!value) {
        this.filterArr.push(data.id)
        return true
      }
      if (data.label.indexOf(value) !== -1) {
        this.filterArr.push(data.id)
        return true
      } else {
        return false
      }
    },
    formatPeopleTree(tree) {
      let trees = []

      if (tree && tree.length) {
        tree.forEach(item => {
          let node = {
            disabled: item.userId ? false : true,
            id: item.userId || item.orgId,
            label: item.userName || item.orgName
          }

          const children = [...(item.children || []), ...(item.userRespDTOList || [])]

          if (children && children.length) {
            node.children = this.formatPeopleTree(children)
          }
          trees.push(node)
        })
      }
      return trees
    },
    formatTreeToObj(child, People) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatTreeToObj(item.children, People))
          }
          if (People) {
            if (item.disabled === false) {
              objs[item.id] = item.label
            }
          } else {
            objs[item.id] = item.label
          }
        })
      }
      return objs
    }
  }
}
</script>

<style lang="scss" scoped>
.el-tree {
  height: 200px;
  overflow: auto;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
.el-select {
  width: inherit;
}
.jc-left-width50 {
  width: 50%;
  float: left;
  box-sizing: border-box;
}
.jc-selected-box {
  box-sizing: border-box;
  padding: 0 10px;
}
.jc-selected {
  // margin: 0 10px;
  border: 1px solid #dcdfe6;
  height: 233px;
  overflow: auto;
  line-height: normal;

  .el-tag {
    margin: 2px;
  }
}
</style>

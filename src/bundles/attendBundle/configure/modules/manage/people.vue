<template>
  <div>
    <div class="jc-left-width60">
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
      <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
      <el-button type="" @click="resetChecked" size="mini">清空</el-button>
      <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="true" :filter-node-method="filterNode" @check="check" :default-checked-keys="selecteds"></el-tree>
    </div>
    <div class="jc-left-width40 jc-selected-box">
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
export default {
  name: 'ConfigureManagePeople',
  props: {
    selecteds: {
      type: Array,
      default: ()=>[]
    },
    tree: {
      type: Array
    }
  },
  data() {
    return {
      filterText: '',
      filterArr: [],
      checkedNodes: []
    }
  },
  async created() {
    // setTimeout(()=>{
    //   this.filterArr = this.tree.map(item=>item.id)
    //   this.checkedNodes = this.$refs.tree.getCheckedNodes()
    // })
  },
  watch: {
    filterText(val) {
      this.filterArr = []
      this.$refs.tree.filter(val)
    },
    tree: {
      handler(val) {
        this.filterText = ''
        this.filterArr = val.map(item=>item.id)
        this.$nextTick(()=>{
          this.checkedNodes = this.$refs.tree.getCheckedNodes()
        })
      },
      deep: true
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
  methods: {
    handleCloseTag(tag) {
      const selecteds = this.selecteds.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$emit('update:selecteds', selecteds)
    },
    check(checkedNode, { checkedKeys }) {
      this.$emit('update:selecteds', checkedKeys)
    },
    setCheckedKeys() {
      const selecteds = new Set([...this.filterArr, ...this.selecteds])

      this.$emit('update:selecteds', [...selecteds])
    },
    resetChecked() {
      this.$emit('update:selecteds', [])
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
.jc-left-width60 {
  width: 60%;
  float: left;
  box-sizing: border-box;
}
.jc-left-width40 {
  width: 40%;
  float: left;
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

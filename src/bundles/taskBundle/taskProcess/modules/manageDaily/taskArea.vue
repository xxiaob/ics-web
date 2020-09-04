<template>
  <div>
    <div class="jc-left-width48 tree-content">
      <el-select v-model="areaTypeId" clearable placeholder="网格类型" size="mini" @change="areaTypeChange">
        <el-option v-for="item in gridTypes" :key="item.areaTypeId" :label="item.areaTypeName" :value="item.areaTypeId">
        </el-option>
      </el-select>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini" style="margin:5px 0"></el-input>
      <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
      <el-button type="" @click="resetChecked" size="mini">清空</el-button>
      <el-tree ref="tree" :data="projectGrid" show-checkbox node-key="id" :filter-node-method="filterNode" @check="check" :check-strictly="true" :default-expanded-keys="projectGrid.map(item=>item.id)" :default-checked-keys="selectedAreas"></el-tree>
    </div>
    <div class="jc-right-width48 jc-selected-box">
      <div>已选区域</div>
      <div class="jc-selected">
        <el-tag v-for="tag in checkedNodes" :key="tag.id" closable effect="plain" size="medium" @close="handleCloseTag(tag)">
          {{tag.label}}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { areaGridList } from '@/api/area'
import { areaTypeList } from '@/api/areaType'

export default {
  name: 'TaskProcessManageDailyArea',
  props: {
    projectId: String,
    selectedAreas: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      projectGrid: [],
      filterText: '',
      filterArr: [],
      gridTypes: [],
      areaTypeId: '',
      checkedNodes: [],
      first: true //组件第一次加载
    }
  },
  async created() {
    this.gridTypes = await areaTypeList({})
  },
  watch: {
    filterText(val) {
      this.filterArr = []
      this.$refs.tree.filter(val)
    },
    selectedAreas: {
      handler: 'initData',
      deep: true
    },
    projectId: {
      immediate: true,
      handler(val) {
        this.getAreaGridList(val)
      }
    }
  },
  methods: {
    initData(val) {
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys(val)
        this.checkedNodes = this.$refs.tree.getCheckedNodes().filter(item => item.org === false)
      })
    },
    async getAreaGridList(val) {
      const res = await areaGridList(val)

      this.projectGrid = this.formatGridTree(res)
      this.filterArr = Object.keys(this.formatTreeToObj(this.projectGrid, true))
      if (!this.first) {
        this.$emit('update:selectedAreas', [])
      }
      this.first = false

      this.initData(this.selectedAreas)
    },
    formatGridTree(tree) {
      let trees = []

      if (tree && tree.length) {
        tree.forEach(item => {
          let node = {
            disabled: item.areaId ? false : true,
            org: item.areaId ? false : true,
            areaTypeId: item.areaTypeId || '',
            id: item.areaId || item.orgId,
            label: item.areaName || item.orgName
          }

          const children = [...(item.children || []), ...(item.areaChildren || [])]

          if (children && children.length) {
            node.children = this.formatGridTree(children)
          }
          trees.push(node)
        })
      }
      return trees
    },
    check(checkedNode, { checkedNodes }) {
      const selecteds = checkedNodes.filter(item => item.org === false).map(item => item.id)

      this.$emit('update:selectedAreas', selecteds)
    },
    handleCloseTag(tag) {
      const selecteds = this.selectedAreas.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$refs.tree.setCheckedKeys(selecteds)
      this.$emit('update:selectedAreas', selecteds)
    },
    setCheckedKeys() {
      const areas = new Set([...this.filterArr, ...this.selectedAreas])

      this.$emit('update:selectedAreas', [...areas])
    },
    resetChecked() {
      this.$emit('update:selectedAreas', [])
    },
    areaTypeChange(value) {
      this.areaTypeId = value
      this.filterText = ''
      this.$refs.tree.filter('')
    },
    filterNode(value, data) {
      if (this.areaTypeId) {
        // 有 areaTypeId
        if (!value && this.areaTypeId === data.areaTypeId) {
          this.filterArr.push(data.id)
          return true
        }
        if (data.label.indexOf(value) !== -1 && this.areaTypeId === data.areaTypeId) {
          this.filterArr.push(data.id)
          return true
        } else {
          return false
        }
      } else {
        // 没有areaTypeId
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
    },
    formatTreeToObj(child, grid) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatTreeToObj(item.children, grid))
          }
          if (grid) {
            if (item.org === false) {
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
.jc-left-width48 {
  width: 48%;
  float: left;
  box-sizing: border-box;
}
.jc-right-width48 {
  width: 48%;
  float: right;
  box-sizing: border-box;
}
.tree-content {
  margin-top: 10px;
  background: #f6f6f6;
  box-sizing: border-box;
  padding: 10px 20px;
  border-radius: 4px;
  .el-tree {
    background: #f6f6f6;
    height: 200px;
    overflow: auto;
    margin-top: 5px;
  }
}
.jc-selected-box {
  box-sizing: border-box;
  padding: 0 10px;
}
.jc-selected {
  background: #f6f6f6;
  margin-top: 10px;
  border-radius: 4px;
  box-sizing: border-box;
  padding: 10px 20px;
  height: 299px;
  overflow: auto;
  line-height: normal;

  .el-tag {
    margin: 2px;
  }
}
</style>

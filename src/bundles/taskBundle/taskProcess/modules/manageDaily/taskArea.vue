<template>
  <div>
    <el-radio-group v-model="selfAreaType" size="small" @change="changeAreaType">
      <el-radio-button v-for="item in areaTypes" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
    </el-radio-group>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
    <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
    <el-button type="" @click="resetChecked" size="mini">清空</el-button>
    <!-- <el-button type="primary" @click="getCheckedKeys" size="mini">获取选中节点</el-button> -->
    <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="true" :filter-node-method="filterNode" default-expand-all @check="check" :default-checked-keys="selectedAreas"></el-tree>
  </div>
</template>

<script>
import { TASK_AREA_TYPES } from '@/constant/Dictionaries'
import { areaGridList } from '@/api/area'

export default {
  name: 'TaskProcessManageDailyArea',
  props: {
    selectedAreas: {
      type: Array,
      default: ()=>[]
    },
    areaType: {
      type: String,
      default: TASK_AREA_TYPES.ORG
    },
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      selfAreaType: this.areaType,
      areaTypes: TASK_AREA_TYPES.VALUES,
      orgGrid: [],
      filterText: '',
      filterArr: [],
      filterArrGrid: [],
      objTree: {}
    }
  },
  computed: {
    tree() {
      if (this.areaType === TASK_AREA_TYPES.ORG) {
        return this.orgTree
      } else {
        return this.orgGrid
      }
    }
  },
  async created() {
    const res = await areaGridList()

    this.orgGrid = this.formatGridTree(res)
    setTimeout(()=>{
      this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
    })
  },
  watch: {
    filterText(val) {
      this.filterArr = []
      this.$refs.tree.filter(val)
    },
    selectedAreas: {
      handler(val) {
        this.$refs.tree.setCheckedKeys(val)
      },
      deep: true
    }
  },
  methods: {
    formatGridTree(tree) {
      let trees = []

      if (tree && tree.length) {
        tree.forEach(item => {
          let node = {
            disabled: item.areaId ? false : true,
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
    check(checkedNodes, { checkedKeys }) {
      this.$emit('update:selectedAreas', checkedKeys)
    },
    // getCheckedKeys() {
    //   this.$emit('update:selectedAreas', this.$refs.tree.getCheckedKeys())
    // },
    setCheckedKeys() {
      const areas = new Set([...this.filterArr, ...this.selectedAreas])

      this.$emit('update:selectedAreas', [...areas])
    },
    resetChecked() {
      this.$emit('update:selectedAreas', [])
    },
    filterNode(value, data) {
      if (!value) {
        this.filterArr.push(data.value)
        return true
      }
      if (data.label.indexOf(value) !== -1) {
        this.filterArr.push(data.value)
        return true
      } else {
        return false
      }
    },
    changeAreaType(value) {
      if (value === TASK_AREA_TYPES.ORG) {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
      } else {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgGrid, true))
        console.log(this.filterArr)
      }
      this.$emit('update:areaType', value)
      this.$emit('update:selectedAreas', [])
    },
    formatTreeToObj(child, grid) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatTreeToObj(item.children, grid))
          }
          if (grid) {
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
</style>

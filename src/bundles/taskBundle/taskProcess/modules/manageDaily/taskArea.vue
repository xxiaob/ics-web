<template>
  <div>
    <div class="jc-left-width60">
      <el-radio-group v-model="selfAreaType" size="small" @change="changeAreaType">
        <el-radio-button v-for="item in TASK_AREA_TYPES.VALUES" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <el-select class="jc-area-type-select" v-model="areaTypeId" clearable placeholder="网格类型" size="small" v-if="selfAreaType===TASK_AREA_TYPES.GRID" @change="areaTypeChange">
        <el-option v-for="item in gridTypes" :key="item.areaTypeId" :label="item.areaTypeName" :value="item.areaTypeId">
        </el-option>
      </el-select>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
      <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
      <el-button type="" @click="resetChecked" size="mini">清空</el-button>
      <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="true" :filter-node-method="filterNode" default-expand-all @check="check" :default-checked-keys="selectedAreas"></el-tree>
    </div>
    <div class="jc-left-width40 jc-selected-box">
      <div>已选区域</div>
      <div class="jc-selected">
        <el-tag v-for="tag in checkedNodes" :key="tag.id" closable size="small" @close="handleCloseTag(tag)">
          {{tag.label}}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { TASK_AREA_TYPES } from '@/constant/Dictionaries'
import { areaGridList } from '@/api/area'
import { areaTypeList } from '@/api/areaType'

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
      TASK_AREA_TYPES,
      orgGrid: [],
      filterText: '',
      filterArr: [],
      filterArrGrid: [],
      objTree: {},
      gridTypes: [],
      areaTypeId: '',
      checkedNodes: []
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
    this.gridTypes = await areaTypeList({})
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
    formatGridTree(tree) {
      let trees = []

      if (tree && tree.length) {
        tree.forEach(item => {
          let node = {
            disabled: item.areaId ? false : true,
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
    check(checkedNodes, { checkedKeys }) {
      this.$emit('update:selectedAreas', checkedKeys)
    },
    handleCloseTag(tag) {
      const selecteds = this.selectedAreas.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$emit('update:selectedAreas', selecteds)
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
    areaTypeChange(value) {
      this.areaTypeId = value
      this.filterText = ''
      this.$refs.tree.filter('')
    },
    filterNode(value, data) {
      if (this.areaTypeId) {
        // console.log('有 areaTypeId')
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
    changeAreaType(value) {
      if (value === TASK_AREA_TYPES.ORG) {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
        this.areaTypeId = ''
      } else {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgGrid, true))
      }
      this.filterText = ''
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
.jc-area-type-select {
  width: 105px;
  float: right;
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
  height: 280px;
  overflow: auto;
  line-height: normal;

  .el-tag {
    margin: 2px;
  }
}
</style>

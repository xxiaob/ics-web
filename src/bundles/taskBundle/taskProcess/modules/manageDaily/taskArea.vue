<template>
  <div>
    <div class="jc-left-width48 tree-content">
      <!-- <el-radio-group v-model="selfAreaType" size="mini" @change="changeAreaType">
        <el-radio-button v-for="item in TASK_AREA_TYPES.VALUES" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group> -->
      <el-select v-model="areaTypeId" clearable placeholder="网格类型" size="mini" v-if="selfAreaType===TASK_AREA_TYPES.GRID" @change="areaTypeChange">
        <el-option v-for="item in gridTypes" :key="item.areaTypeId" :label="item.areaTypeName" :value="item.areaTypeId">
        </el-option>
      </el-select>
      <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini" style="margin:5px 0"></el-input>
      <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
      <el-button type="" @click="resetChecked" size="mini">清空</el-button>
      <el-tree ref="tree" :data="orgGrid" show-checkbox node-key="id" :filter-node-method="filterNode" @check="check" :check-strictly="true" :default-expanded-keys="orgGrid.map(item=>item.id)" :default-checked-keys="selectedAreas"></el-tree>
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
import { TASK_AREA_TYPES } from '@/constant/Dictionaries'
import { areaGridList, areaList } from '@/api/area'
import { areaTypeList } from '@/api/areaType'

export default {
  name: 'TaskProcessManageDailyArea',
  props: {
    edit: false,
    projectId: String,
    // emergency: false,
    selectedAreas: {
      type: Array,
      default: ()=>[]
    },
    areaType: {
      type: String,
      default: TASK_AREA_TYPES.GRID
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
      projectGrid: [],
      filterText: '',
      filterArr: [],
      objTree: {},
      gridTypes: [],
      areaTypeId: '',
      checkedNodes: [],
      first: true
    }
  },
  // computed: {
  //   tree() {
  //     if (this.areaType === TASK_AREA_TYPES.ORG) {
  //       return this.orgTree
  //     } else {
  //       return this.orgGrid
  //     }
  //   }
  // },
  async created() {
    this.gridTypes = await areaTypeList({})
    // this.getAreaGridList('')

    this.interval = setInterval(()=>{
      // this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
      this.checkedNodes = this.$refs.tree.getCheckedNodes().filter(item=>item.org === false)
      if (this.orgGrid.length) {
        clearInterval(this.interval)
      }
    }, 100)
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
          // if (this.edit) {
          //   this.$emit('update:edit', false)
          // }
          this.checkedNodes = this.$refs.tree.getCheckedNodes().filter(item=>item.org === false)
        })
      },
      deep: true
    },
    projectId: {
      immediate: true,
      handler(val) {
        // console.log('area projectId', val)
        const projectId = val == '0' ? '' : val

        this.getAreaGridList(projectId)
      }
    }
  },
  methods: {
    async getAreaGridList(val) {
      const res = await areaGridList(val)

      this.orgGrid = this.formatGridTree(res)
      this.filterArr = Object.keys(this.formatTreeToObj(this.orgGrid, true))
      if (!this.first) {
        this.$emit('update:selectedAreas', [])
      }
      this.first = false
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
    check(checkedNode, { checkedKeys, checkedNodes }) {
      const selecteds = checkedNodes.filter(item=>item.org === false).map(item=>item.id)

      this.$emit('update:selectedAreas', selecteds)
    },
    handleCloseTag(tag) {
      const selecteds = this.selectedAreas.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$refs.tree.setCheckedKeys(selecteds)
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

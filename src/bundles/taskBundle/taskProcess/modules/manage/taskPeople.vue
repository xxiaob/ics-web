<template>
  <div>
    <div class="jc-left-width48">
      <el-radio-group v-model="selfPeopleType" size="mini" @change="changePeopleType">
        <el-radio-button v-for="item in TASK_PEOPLE_TYPES.VALUES" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
      </el-radio-group>
      <div class="tree-content">
        <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="mini" style="margin-bottom:5px"></el-input>
        <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
        <el-button type="" @click="resetChecked" size="mini">清空</el-button>
        <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="selfPeopleType===TASK_PEOPLE_TYPES.ORG" :filter-node-method="filterNode" :default-expanded-keys="tree.map(item=>item.id)" @check="check" :default-checked-keys="selecteds"></el-tree>
      </div>
    </div>
    <div class="jc-right-width48 jc-selected-box">
      <div>已选人员</div>
      <div class="jc-selected">
        <el-tag v-for="tag in checkedNodes" :key="tag.id" effect="plain" closable size="medium" @close="handleCloseTag(tag)">
          {{tag.label}}
        </el-tag>
      </div>
    </div>
  </div>
</template>

<script>
import { TASK_PEOPLE_TYPES } from '@/constant/Dictionaries'
import { getOrgUserList, getOrgUserListByProject } from '@/api/user'

export default {
  name: 'TaskProcessManagePeople',
  props: {
    edit: false,
    projectId: String,
    emergency: false,
    selecteds: {
      type: Array,
      default: () => []
    },
    peopleType: {
      type: String,
      default: TASK_PEOPLE_TYPES.PEOPLE
    },
    orgTree: {
      type: Array
    }
  },
  data() {
    return {
      selfPeopleType: this.peopleType,
      TASK_PEOPLE_TYPES,
      orgPeople: [],
      projectPeople: [],
      filterText: '',
      filterArr: [],
      filterArrPeople: [],
      checkedNodes: [],
      first: true
    }
  },
  computed: {
    tree() {
      if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
        if (this.emergency) {
          this.$emit('update:selecteds', [])
          return []
        }
        return this.orgTree
      } else {
        return this.projectPeople
      }
    }
  },
  watch: {
    peopleType(val) {
      this.selfPeopleType = val
    },
    filterText(val) {
      this.filterArr = []
      this.$refs.tree.filter(val)
    },
    selecteds: {
      immediate: true,
      handler: 'initData',
      deep: true
    },
    projectId: {
      immediate: true,
      handler(val) {
        this.getProjectUsers(val)
      }
    }
  },
  methods: {
    async initData(val) {
      try {
        if (this.orgPeople.length < 1) {
          const res = await getOrgUserList({})

          this.orgPeople = this.formatPeopleTree(res)
        }
        this.$nextTick(() => {
          if (this.edit) {
            this.$refs.tree.setCheckedKeys(val)
            this.$emit('update:edit', false)
          }
          if (this.peopleType === TASK_PEOPLE_TYPES.PEOPLE) {
            this.checkedNodes = this.$refs.tree.getCheckedNodes().filter(item => item.org === false)
          } else {
            this.checkedNodes = this.$refs.tree.getCheckedNodes()
          }
        })
      } catch (error) {
        console.log(error)
      }
    },
    async getProjectUsers(projectId) {
      const res = await getOrgUserListByProject({ projectId })

      this.projectPeople = this.formatPeopleTree(res)

      if (this.peopleType === TASK_PEOPLE_TYPES.PEOPLE) {
        this.filterArr = Object.keys(this.formatTreeToObj(this.projectPeople, true))
        if (!this.first) {
          this.$emit('update:selecteds', [])
        }
      }
      this.first = false
    },
    formatPeopleTree(tree) {
      let trees = []

      if (tree && tree.length) {
        tree.forEach(item => {
          let node = {
            org: item.userId ? false : true,
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
    handleCloseTag(tag) {
      const selecteds = this.selecteds.slice(0)
      const index = selecteds.indexOf(tag.id)

      selecteds.splice(index, 1)
      this.$refs.tree.setCheckedKeys(selecteds)
      this.$emit('update:selecteds', selecteds)
    },
    check(checkedNode, { checkedKeys, checkedNodes }) {
      if (this.peopleType === TASK_PEOPLE_TYPES.PEOPLE) {
        const selecteds = checkedNodes.filter(item => item.org === false).map(item => item.id)

        this.$emit('update:selecteds', selecteds)
      } else {
        this.$emit('update:selecteds', checkedKeys)
      }
    },
    setCheckedKeys() {
      const areas = new Set([...this.filterArr, ...this.selecteds])

      this.$emit('update:selecteds', [...areas])
    },
    resetChecked() {
      this.$refs.tree.setCheckedKeys([])
      this.checkedNodes = []
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
    },
    changePeopleType(value) {
      if (value === TASK_PEOPLE_TYPES.ORG) {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
      } else {
        this.filterArr = Object.keys(this.formatTreeToObj(this.projectPeople, true))
      }
      this.filterText = ''
      this.$emit('update:peopleType', value)
      this.$emit('update:selecteds', [])
    },
    formatTreeToObj(child, People) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatTreeToObj(item.children, People))
          }
          if (People) {
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

.el-select {
  width: inherit;
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
  height: 294px;
  overflow: auto;
  line-height: normal;

  .el-tag {
    margin: 2px;
  }
}
</style>

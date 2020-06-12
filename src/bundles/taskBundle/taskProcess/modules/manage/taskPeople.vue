<template>
  <div>
    <el-radio-group v-model="selfPeopleType" size="small" @change="changePeopleType">
      <el-radio-button v-for="item in TASK_PEOPLE_TYPES.VALUES" :key="item.value" :label="item.value">{{item.label}}</el-radio-button>
    </el-radio-group>
    <el-input placeholder="输入关键字进行过滤" v-model="filterText" size="small"></el-input>
    <el-button type="" @click="setCheckedKeys" size="mini">全选</el-button>
    <el-button type="" @click="resetChecked" size="mini">清空</el-button>
    <el-tree ref="tree" :data="tree" show-checkbox node-key="id" :check-strictly="true" :filter-node-method="filterNode" default-expand-all @check="check" :default-checked-keys="selecteds"></el-tree>
  </div>
</template>

<script>
import { TASK_PEOPLE_TYPES } from '@/constant/Dictionaries'
import { getOrgUserList } from '@/api/user'

export default {
  name: 'TaskProcessManagePeople',
  props: {
    selecteds: {
      type: Array,
      default: ()=>[]
    },
    peopleType: {
      type: String,
      default: TASK_PEOPLE_TYPES.ORG
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
      filterText: '',
      filterArr: [],
      filterArrPeople: []
    }
  },
  computed: {
    tree() {
      if (this.peopleType === TASK_PEOPLE_TYPES.ORG) {
        return this.orgTree
      } else {
        return this.orgPeople
      }
    }
  },
  async created() {
    const res = await getOrgUserList({})

    this.orgPeople = this.formatPeopleTree(res)
    setTimeout(()=>{
      this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
    })
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
      handler(val) {
        this.$refs.tree.setCheckedKeys(val)
      },
      deep: true
    }
  },
  methods: {
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
    check(checkedNodes, { checkedKeys }) {
      this.$emit('update:selecteds', checkedKeys)
    },
    setCheckedKeys() {
      const areas = new Set([...this.filterArr, ...this.selecteds])

      this.$emit('update:selecteds', [...areas])
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
    },
    changePeopleType(value) {
      if (value === TASK_PEOPLE_TYPES.ORG) {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgTree))
      } else {
        this.filterArr = Object.keys(this.formatTreeToObj(this.orgPeople, true))
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
</style>

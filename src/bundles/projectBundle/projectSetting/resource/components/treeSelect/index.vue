<template>
  <div>
    <el-input v-model="filterText" prefix-icon="el-icon-search" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <el-tree ref="tree" class="jc-uo-tree" v-loading="treesLoading" :default-expanded-keys="expandedKeys" :data="trees" :default-checked-keys="checkKeys" :show-checkbox="true" :props="props" :filter-node-method="filterNode" node-key="id">
      <div class="custom-tree-node" slot-scope="{ node,data }" :class="{'jc-user': data.type=='user','jc-camera':data.deviceType==1,'jc-uav':data.deviceType==2,'jc-netPatrolCar':data.deviceType==3}">
        <div class="jc-text-warp" v-text="data.label"></div>
      </div>
    </el-tree>
  </div>
</template>

<script>
import { stringSearch } from '@/libs/util'

export default {
  name: 'ProjectProjectSettingResourceTreeSelect',
  props: {
    type: {
      type: String,
      default: 'user'
    },
    treesLoading: {
      type: Boolean,
      default: false
    },
    trees: {
      type: Array,
      default: ()=>[]
    },
    checkKeys: { //开始选中的节点
      type: Array,
      default: ()=>[]
    }
  },
  data() {
    return {
      props: { children: 'children', label: 'label' },
      filterText: ''
    }
  },
  computed: {
    expandedKeys() {
      return this.trees.map(item=>item.id)
    }
  },
  watch: {
    treesLoading(val) {
      if (val) {
        this.filterText = ''
      }
    },
    filterText(val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    filterNode(value, data) {
      return stringSearch(value, data.label || data.name)
    },
    getResult() {
      const checkNodes = this.$refs.tree.getCheckedNodes(true)
      const checkLeafIds = checkNodes.filter(item=>item.type == this.type).map(item=>item.id)

      console.log('选中的叶子节点id', checkLeafIds)

      const params = { addIds: [], deleteIds: [] }

      if (this.checkKeys.length) {
        if (checkLeafIds.length) {
          this.checkKeys.forEach(id => {
            const index = checkLeafIds.indexOf(id)

            if (index < 0) {
              params.deleteIds.push(id)
            } else {
              checkLeafIds.splice(index, 1)
            }
          })
          params.addIds = checkLeafIds
        } else {
          params.deleteIds = this.checkKeys
        }
      } else {
        params.addIds = checkLeafIds
      }
      console.log('TreeSelect getResult', this.checkKeys, params)
      return params
    }
  }

}
</script>

<style lang="scss" scoped>
.jc-uo-tree {
  position: relative;
  height: 360px;
  overflow-y: auto;
  margin-top: $jc-default-dis/2;
}
.custom-tree-node {
  flex: 1;
  display: flex;
  width: 0;
  font-size: $jc-font-size-small;
  padding-left: 15px;
  background: url(/static/areaicons/organization.png) no-repeat left center;
  background-size: 12px auto;
  &.jc-user {
    background-image: url(./assets/user.png);
  }
  &.jc-camera {
    background-image: url(./assets/camera.png);
  }
  &.jc-netPatrolCar {
    background-image: url(./assets/netPatrolCar.png);
  }
  &.jc-uav {
    background-image: url(./assets/uav.png);
  }
}
</style>

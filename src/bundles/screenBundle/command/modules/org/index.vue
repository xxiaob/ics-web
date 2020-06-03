<template>
  <view-warp title="组织架构">
    <el-input v-model="filterText" prefix-icon="el-icon-search" class="jc-filter-input" clearable size="mini" placeholder="输入关键字进行过滤"></el-input>
    <div class="jc-view-content" v-loading="loading" element-loading-spinner="jc-loading-spinner" element-loading-background="rgba(0, 0, 0, 0)">

    </div>
  </view-warp>
</template>
<script>
import { getOrgUserList } from '@/api/user'
import TreesFilterMixins from '@/mixins/TreesFilterMixins'

export default {
  name: 'ScreenCommandOrg',
  mixins: [TreesFilterMixins],
  props: ['options'],
  components: {
    ViewWarp: () => import('../commont/viewWarp')
  },
  watch: {
    filterText(val) {
      this.filter(val)
    }
  },
  data() {
    return {
      loading: false,
      filterText: '',
      trees: [],
      expandedKeys: [],
      props: { children: 'children', label: 'label' }
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {

    }
  }
}
</script>

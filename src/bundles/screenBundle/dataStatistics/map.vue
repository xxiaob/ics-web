<template>
  <div class="map">
    <!-- <map-search ref="mapSearch" class="jc-area-search"></map-search> -->
    <div class="jc-screen-space" ref="myMap"></div>
  </div>
</template>

<script>
import { JcMap } from '@/map'
import { mapStyle } from '@/map/mapConst'
import { projectGet } from '@/api/projects'
import OrgMixins from '../command/modules/mixins/orgMixins'

let myJcMap //个人 map 对象

export default {
  name: 'jcMap',
  data() {
    return {
      // orgTipVisible: true, //组织是否显示名称
      project: {}
    }
  },
  mixins: [OrgMixins],
  components: {
    MapSearch: () => import('@/components/JcMap/MapSearch') //地图搜索
  },
  async created() {
    if (this.$route.params.projectId) {
      console.log(this.$route.params)
      //处理项目，如果项目id存在则获取项目详情
      let { projectId, projectName, orgId, projectType } = await projectGet(this.$route.params.projectId)

      this.project = { projectId, projectName, orgId, projectType }
    }
  },
  mounted() {
    myJcMap = new JcMap({ mapStyle: mapStyle.DARK })
    this.initData()
  },
  methods: {
    initData() {
      myJcMap.init(this.$refs.myMap).then(() => {
        // this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象
      })
    },
    getMyJcMap() {
      return myJcMap//获取地图
    }
  },
  beforeDestroy() {
    myJcMap.destroy()
  }
}
</script>

<style lang="scss" scoped>
.map {
  position: relative;
  height: 100%;
  .jc-screen-space {
    height: 100%;
  }
}
</style>

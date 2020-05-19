<template>
  <div class="jc-project-item" :class="getItemClass(item.projectType)">
    <div class="jc-title-warp">
      <div class="jc-title" v-text="item.title"></div>
      <i class="jc-setting iconfont iconshezhi"></i>
    </div>
    <div class="jc-project-screen">
      <div class="jc-screen jc-screen-command">指挥大屏</div>
      <div class="jc-screen jc-screen-data">数据大屏</div>
    </div>
    <div class="jc-project-footer">
      <div class="jc-project-info jc-not-start">
        <div class="jc-info-item"><i class="iconfont iconmingchengguanliqi"></i>{{item.title}}</div>
        <div class="jc-info-item"><i class="iconfont iconshijian1"></i>{{item.title}}</div>
      </div>
      <div class="jc-project-opera">
        <div class="jc-opera-item first"><i class="iconfont icontoufangziyuanshezhi"></i>资源设置</div>
        <div class="jc-opera-item second"><i class="iconfont icontoufangziyuanshezhi"></i>网格设置</div>
        <div class="jc-opera-item three"><i class="iconfont icontoufangziyuanshezhi"></i>统计分析</div>
        <div class="jc-opera-item four"><i class="iconfont icontoufangziyuanshezhi"></i>删除项目</div>
      </div>
    </div>
  </div>
</template>
<script>
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  name: 'ProjectProjectsListItem',
  props: ['item'],
  methods: {
    getItemClass(projectType) {
      let types = new Map([[PROJECT_TYPES.EmergencySupport, 'jc-project-es'], [PROJECT_TYPES.SpecialControl, 'jc-project-sc']])

      return types.get(projectType + '') || ''
    }
  }
}
</script>

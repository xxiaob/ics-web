<template>
  <div class="jc-main-container-warp">
    <div v-show="!detailShow">
      <tab-filter :types="types" @filter="goFilter"></tab-filter>

      <el-card class="jc-table-card jc-mt">
        <div slot="header" class="jc-card-header">
          <div class="jc-card-title">列表内容</div>
        </div>
        <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
          <el-table-column type="index" :index="indexMethod" label="序号" width="80"></el-table-column>
          <el-table-column prop="alarmTypeName" label="告警类型" width="120"></el-table-column>
          <el-table-column prop="transportCompany" label="企业" width="200"></el-table-column>
          <el-table-column prop="transportCompanyAddress" label="企业地址"></el-table-column>
          <el-table-column prop="carNumber" label="车牌号"></el-table-column>
          <el-table-column prop="carSpeed" label="车速"></el-table-column>
          <el-table-column prop="status" label="状态" :formatter="formatStatus"></el-table-column>
          <el-table-column prop="alarmDate" label="时间" width="160"></el-table-column>
          <el-table-column width="50" label="操作">
            <template slot-scope="scope">
              <el-button type="text" size="mini" icon="el-icon-refresh-right" @click="handle(scope.row,true)" title="查看"></el-button>
            </template>
          </el-table-column>

        </el-table>
        <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
      </el-card>
    </div>

    <jc-detail v-show="detailShow" :info="info" :detailShow.sync="detailShow" @save-success="initData"></jc-detail>
  </div>
</template>

<script>
import { getByType } from '@/api/supervise' // 获取告警类型接口
import { getDregsAlarmList } from '@/api/dregsAlarm' // 获取告警列表
import { LAWS_TYPES, ALARM_STATUS } from '@/constant/Dictionaries' // 告警类型字典
import PaginationMixins from '@/mixins/PaginationMixins'


export default {
  name: 'dregsWaringHandleIndex',
  mixins: [PaginationMixins],
  data() {
    return {
      loading: false,
      list: [],
      filter: {},
      types: [],
      info: null,
      detailShow: false
    }
  },

  async created() {
    this.getStatuteTypes() // 调用获取告警类型方法
    this.initData() // 初始化告警列表数据方法
  },
  components: {
    TabFilter: () => import('./modules/tabFilter'),
    JcDetail: () => import('./modules/detail')
  },
  methods: {
    formatStatus(row) {
      // 告警状态
      return ALARM_STATUS.toString(row.status)
    },
    async initData() {
      // 初始获取数据
      if (!this.loading) {
        this.loading = true
        try {
          let filter = this.filter // 获取所有查询条件

          Object.keys(filter).map(key => { // 过滤条件为空的字段
            if (!filter[key]) {
              delete filter[key]
            }
          })

          // 接口获取数据
          const { total, resultList } = await getDregsAlarmList({ ...this.filter, ...this.page })

          this.page.total = total
          this.list = resultList
          this.loading = false
        } catch (error) {
          this.loading = false
        }
      }
    },
    async getStatuteTypes() {
      this.types = await getByType({ type: LAWS_TYPES.ALARM }) // 获取告警类型
    },
    goFilter(filter) {
      this.filter = filter // 获取查询信息
      this.currentChange(1) // 切换页面方法,在切换页面方法中调用initData初始化数据
    },
    handle(row, handle) {
      // handle方法 就是告警详情列表处理
      // handle 参数   true 告警处理(包含转任务,和关闭告警)  false 告警查询(查询告警转为的任务)

      this.info = row
      this.info.handle = handle
      this.detailShow = true
    }
  }
}
</script>

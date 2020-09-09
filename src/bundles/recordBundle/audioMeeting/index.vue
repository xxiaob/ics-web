<template>
  <div class="jc-main-container-warp">

    <tab-filter :orgTree="orgTree" @filter="goFilter"></tab-filter>

    <el-card class="jc-table-card jc-mt">
      <div slot="header" class="jc-card-header">
        <div class="jc-card-title">列表内容</div>
      </div>
      <el-table :data="list" v-loading="loading" row-key="id" class="jc-table">
        <el-table-column type="index" :index="indexMethod" label="序号" width="50"></el-table-column>
        <el-table-column prop="initiatorName" label="发起人"></el-table-column>
        <el-table-column prop="orgId" label="所属组织" :formatter="formatOrg"></el-table-column>
        <el-table-column prop="createTime" label="发起时间" :formatter="formatTime"></el-table-column>
        <el-table-column prop="videoDuration" label="会议时长"></el-table-column>
        <el-table-column prop="participants" label="应答方" show-overflow-tooltip></el-table-column>
        <el-table-column width="60" label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="mini" icon="el-icon-microphone" @click="showAudio(scope.row)" title="播放"></el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @current-change="currentChange" @size-change="sizeChange" :current-page.sync="page.pageNum" :page-size="page.pageSize" layout="total, sizes, prev, pager, next" :total="page.total" class="text-right jc-mt"></el-pagination>
    </el-card>

    <el-dialog title="音频播放" :visible.sync="dialogAudioVisible" width="600px" :close-on-click-modal="false" :append-to-body="true">
      <audio v-if="dialogAudioVisible" :src="dialogAudioUrl" autoplay controls width="100%"></audio>
    </el-dialog>

  </div>
</template>
<script>
import { videoList } from '@/api/record'
import { formatDate } from '@/libs/util'
import PaginationMixins from '@/mixins/PaginationMixins'
import { organizationList } from '@/api/organization'

export default {
  name: 'RecordAudioMeetingIndex',
  mixins: [PaginationMixins],
  components: {
    TabFilter: () => import('../videoMeeting/modules/tabFilter')
  },
  data() {
    return {
      orgTree: [],
      orgObj: {},
      list: [],
      dialogAudioUrl: '',
      dialogAudioVisible: false,
      loading: false,
      filter: {}
    }
  },
  async created() {
    await this.getOrgTree()

    this.initData()
  },
  methods: {
    formatTime(row, column, cellValue) {
      return formatDate(cellValue)
    },
    formatOrg(row, column, cellValue) {
      return this.orgObj[cellValue]
    },
    formatOrgTree(child) {
      let trees = []

      if (child && child.length) {
        child.forEach(item => {
          let node = {
            value: item.orgId,
            label: item.orgName
          }

          let children = this.formatOrgTree(item.children)

          if (children && children.length) {
            node.children = children
          }

          trees.push(node)
        })
      }
      return trees
    },
    formatOrgTreeToObj(child) {
      let objs = {}

      if (child && child.length) {
        child.forEach(item => {
          if (item.children && item.children.length) {
            objs = Object.assign(objs, this.formatOrgTreeToObj(item.children))
          }
          objs[item.orgId] = item.orgName
        })
      }
      return objs
    },
    async getOrgTree() {
      const res = await organizationList()

      this.orgTree = this.formatOrgTree(res)
      this.orgObj = this.formatOrgTreeToObj(res)
    },
    async initData() {
      if (!this.loading) {
        this.loading = true
        try {
          const { total, resultList } = await videoList({ ...this.filter, ...this.page, videoType: 'AUDIO' })

          this.page.total = total
          this.list = resultList
          this.loading = false
        } catch (error) {
          console.error(error)
          this.loading = false
        }
      }
    },
    goFilter(filter) {
      this.filter = filter
      this.currentChange(1)
    },
    showAudio(row) {
      this.dialogAudioUrl = row.videoUrl
      this.dialogAudioVisible = true
    }
  }
}
</script>

<style lang="scss" scoped>
</style>

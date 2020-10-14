<template>
  <el-dialog title="人员详情" :visible.sync="dialogVisible" width="600px" :append-to-body="true" :close-on-click-modal="false" @close="dialogClose" top="5vh">
    <el-row :gutter="20">
      <el-col :span="8">
        <div class="userPhoto">
          <img :src="form.photo" width="100%" alt="">
        </div>
      </el-col>
      <el-col :span="16">
        <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">
          <el-form-item label="姓 名：">
            <span>{{form.userName}}</span>
          </el-form-item>
          <el-form-item label="登录账号：">
            <span>{{form.account}}</span>
          </el-form-item>
          <el-form-item label="手机号码：">
            <span>{{form.phone}}</span>
          </el-form-item>
          <el-form-item label="执法证号：">
            <span>{{form.lawNbr}}</span>
          </el-form-item>
          <el-form-item label="胸牌编号：">
            <span>{{form.chestNbr}}</span>
          </el-form-item>
          <el-form-item label="所属组织：">
            <span>{{form.orgName}}</span>
          </el-form-item>
          <el-form-item label="是否党员：">
            <span v-if="form.partyMember === '1'">是</span>
            <span v-else>否</span>
          </el-form-item>
          <el-form-item label="用户角色：">
            <div v-for="(role,index) in form.roles" :key="index">{{role}}</div>
          </el-form-item>

          <el-form-item label="用户职位：">
             <div v-for="(position,index) in form.positions" :key="index">{{position}}</div>
          </el-form-item>
          <el-form-item label="用户任务：">
             <div v-for="(task,index) in form.tasks" :key="index">{{task}}</div>
          </el-form-item>
          <el-form-item label="用户描述：">
            <div v-html="form.description"></div>
          </el-form-item>
        </el-form>
      </el-col>
    </el-row>

    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="downloadDetail">导出</el-button>
    </div>
  </el-dialog>
</template>
<script>

import { exportUserInfo } from '@/api/organizeInfo'
export default {
  name: 'UserInfoDetail',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    info: {
      type: Object,
      default: ()=>{}
    }
  },

  watch: {
    visible(newVal) {
      if (newVal) {
        this.dialogVisible = true
      }
    },
    info: {
      deep: true,
      handler() {
        this.getDetail()
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      form: {}

    }
  },
  created() {
    if (this.info && this.info.id) {
      this.getDetail()
    }
  },
  methods: {
    async getDetail() {
      this.form = { ...this.info }
      console.log('form', this.form)
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
    downloadDetail() {
      console.log('导出')
      exportUserInfo({ userId: this.form.userId, orgId: this.form.orgId })
    }
  }
}
</script>
<style lang="scss" scoped>

.dialog-footer {
  text-align: center;
}
</style>

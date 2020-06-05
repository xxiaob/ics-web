<template>
  <el-dialog :title="title" :visible.sync="dialogVisible" width="600px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <div class="jc-clearboth">
      <div id="live" v-show="false"></div>
      <div id="tolive">{{overseeTypeMsg}}</div>
    </div>
    <el-form ref="form" label-width="100px" :model="form" class="jc-manage-form" size="mini">
      <el-form-item label="督查对象">
        <span>督查对象</span>
      </el-form-item>
      <el-form-item label="所属组织">
        <span>所属组织</span>
      </el-form-item>
      <el-form-item label="督查结果" prop="eventType" :rules="rules.SELECT_NOT_NULL">
        <el-select v-model="form.eventType" placeholder="请选择督查结果">
          <el-option v-for="item in eventTypes" :key="item.id" :label="item.typeName" :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="desc" :rules="rules.NOT_NULL">
        <el-input v-model="form.desc" placeholder="请输入备注" type="textarea"></el-input>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="onSubmit">确 定</el-button>
    </div>
  </el-dialog>
</template>
<script>
import { eventManageSave } from '@/api/eventManage'
import { getStringRule, NOT_NULL, SELECT_NOT_NULL } from '@/libs/rules'
import FormMixins from '@/mixins/FormMixins'
import { IM } from '@/live/im'
import { Live } from '@/live/agora'

export default {
  name: 'PeopleOverseeManage',
  mixins: [FormMixins],
  props: {
    title: {
      type: String,
      default: '督查'
    },
    user: {
      type: Object,
      default: ()=>{}
    }
  },
  data() {
    return {
      invitUserId: '',
      channelId: '',
      loading: false,
      onCall: false,
      rules: {
        Len50: getStringRule(1, 50),
        SELECT_NOT_NULL,
        NOT_NULL
      },
      eventTypes: [],
      overseeType: 1,
      overseeTypeMsg: ''
    }
  },
  created() {
    this.im = new IM(this.user.userId, this.user.userName)
    this.im.on(this.imMsgCb)
  },
  mounted() {
    if (this.live) {
      console.log('直播客户端已经初始化')
    } else {
      this.live = new Live('live', 'tolive')
    }
  },
  methods: {
    imMsgCb(onType, data) {
      console.log('vue 数据', onType, data)
      const { content: { agree, nickName, isExit } } = data

      if (this.timeout) {
        clearTimeout(this.timeout)
      }
      if (agree === '1') {
        this.onCall = true
        this.$message.success(nickName + '同意接听')
        if (this.overseeType) {
          this.overseeTypeMsg = '正在强制观摩' + nickName
        } else {
          this.overseeTypeMsg = '正在和' + nickName + '语音通话'
        }
      } else if (agree === '0') {
        this.$message.warning(nickName + '拒绝接听')
        this.overseeTypeMsg = nickName + '拒绝接听'
      }
      if (isExit) {
        this.onCall = false
        this.$message.warning(nickName + '已经挂断')
        this.leaveChannel()
        this.overseeTypeMsg = nickName + '已经退出频道'
      }
    },
    formatFormData() {
      if (this.options) {
        const { overseeType, userId } = this.options

        console.log(userId)
        this.invitUserId = '56037241549488128'
        this.overseeType = overseeType
        if (overseeType) {
          console.log('强制观摩')
          this.overseeTypeMsg = '正在发起强制观摩'
          this.inviteUser('2', '1', 'audience')
        } else {
          console.log('语音通话')
          this.overseeTypeMsg = '正在邀请语音通话'
          this.inviteUser('0', '0', 'host')
        }
        this.timeout = setTimeout(()=>{
          this.overseeTypeMsg = '对方不在线'
        }, 5000)
        return {}
      } else {
        return {}
      }
    },
    //强制观摩 '2' , '1' , 'audience'  邀请语音通话 '0' , '0' , 'host'
    inviteUser(inviteType, mediaType, role) {
      this.channelId = new Date().getTime().toString()
      const msg = {
        msgType: '1',
        nickName: this.user.userName,
        channelId: this.channelId,
        inviteDevice: '2',
        inviteType, //"0":正常,"1":强拉 2":强制观摩(拉执法仪)
        mediaType //"0":音频,"1":视频
      }

      this.im.sendSingleMsg(this.invitUserId, msg)
      if (!this.live.joined) {
        this.live.joinChannel(this.channelId, role, false)
      }
    },
    //结束聊天
    exit() {
      if (this.onCall) {
        const msg = {
          msgType: '1',
          nickName: this.user.userName,
          channelId: this.channelId,
          inviteDevice: '2',
          isExit: '1'
        }

        this.im.sendSingleMsg(this.invitUserId, msg)
      }
      this.leaveChannel()
    },
    async leaveChannel() {
      if (this.live.joined) {
        await this.live.leaveChannel()
      }
    },
    onSubmit() {
      this.loading = true
      this.$refs.form.validate(valid => {
        if (valid) {
          eventManageSave(this.form).then(() => {
            this.$message.success('操作成功')
            this.dialogVisible = false
            this.$emit('save-success')
            this.exit()
            this.loading = false
          }).catch(() => {
            this.loading = false
          })
        } else {
          this.loading = false
        }
      })
    },
    dialogClose() {
      console.log('dialogClose oversee manage')
      this.exit()
      this.$emit('update:visible', false)
    }
  }
}
</script>

<style lang="scss" scoped>
#live,
#tolive {
  width: 50%;
  height: 150px;
  // float: left;
  margin: 0 auto;
}
.jc-clearboth::before,
.jc-clearboth::after {
  display: table;
  content: "";
  clear: both;
}
</style>

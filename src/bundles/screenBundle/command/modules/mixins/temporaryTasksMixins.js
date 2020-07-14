/**
 * 临时任务下发
 */
import { PROJECT_TYPES } from '@/constant/Dictionaries'

export default {
  data() {
    return {
      temporaryTaskVisible: false //是否显示
    }
  },
  created() {
    this.$EventBus.$on('send-temporary-tasks', this.sendTemporaryTasks) //通知窗口发送临时任务
  },
  computed: {
    temporaryTaskprojectId() {
      return this.project.projectId || PROJECT_TYPES.NORMAL
    }
  },
  methods: {
    sendTemporaryTasks() {
      //发送临时任务
      this.temporaryTaskVisible = true
    },
    temporaryTaskSuccess() {
      //临时任务发送成功
    }
  },
  beforeDestroy() {
    //去除事件监听
    this.$EventBus.$off('send-temporary-tasks', this.sendTemporaryTasks)
  }
}

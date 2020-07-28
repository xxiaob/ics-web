/**
 * 声音提醒配置
 */
import JcEnum from '@/libs/JcEnum'

/**
 * 声音提醒类型
 */
export const VOICE_TYPE = new JcEnum([
  { key: 'TASK', value: '0', label: '日常任务' },
  { key: 'QUESTION', value: '1', label: '问题' },
  { key: 'EVENT', value: '2', label: '事件' },
  { key: 'TEMPORARY', value: '4', label: '临时任务' },
  { key: 'GRID_ABNORMAL', value: 'gridabnormal', label: '岗点异常' },
  { key: 'USER_ABNORMAL', value: 'userabnormal', label: '人出圈异常' },
  { key: 'TEMPORARY_ABNORMAL', value: 'temporaryabnormal', label: '临时任务异常' },
  { key: 'AUDIO_REMIND', value: 'audio', label: '语音提醒' },
  { key: 'VIDEO_REMIND', value: 'video', label: '视频提醒' },
  { key: 'HELP_REMIND', value: 'help', label: '求助提醒' }
])

/**
 * 声音提示资源
 */
export const VoiceSource = {
  [VOICE_TYPE.TASK]: '/static/voices/task.wav',
  [VOICE_TYPE.QUESTION]: '/static/voices/question.wav',
  [VOICE_TYPE.EVENT]: '/static/voices/event.wav',
  [VOICE_TYPE.TEMPORARY]: '/static/voices/temporary.wav',
  [VOICE_TYPE.GRID_ABNORMAL]: '/static/voices/grid-abnormal.wav',
  [VOICE_TYPE.USER_ABNORMAL]: '/static/voices/user-abnormal.wav',
  [VOICE_TYPE.TEMPORARY_ABNORMAL]: '/static/voices/temporary-abnormal.wav',
  [VOICE_TYPE.AUDIO_REMIND]: '/static/voices/audio.wav',
  [VOICE_TYPE.VIDEO_REMIND]: '/static/voices/video.wav',
  [VOICE_TYPE.HELP_REMIND]: '/static/voices/help.wav'
}

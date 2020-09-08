/**
 * 地图使用常量定义
 */
import JcEnum from '@/libs/JcEnum'

/**
 * 地图样式风格
 */
export const mapStyle = new JcEnum([
  { key: 'BASE', value: 'base', label: '标准' },
  { key: 'DARK', value: 'dark', label: '深夜黑' },
  { key: 'SATELLITE', value: 'satellite', label: '卫星图' }
])

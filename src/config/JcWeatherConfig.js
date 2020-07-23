/**
 * 天气配置
 */
import JcEnum from '@/libs/JcEnum'

/**
 * 天气 字典
 */
export const JC_WEATHER = new JcEnum([
  { key: 'SUNNY', value: 'sunny', label: '晴、平静' },
  { key: 'BIG_SNOW', value: 'big-snow', label: '大雪、大雪-暴雪' },
  { key: 'SNOW', value: 'snow', label: '雪、阵雪、小雪、中雪、小雪-中雪、中雪-大雪' },
  { key: 'BIG_RAIN', value: 'big-rain', label: '大雨、暴雨、大暴雨、特大暴雨、大雨-暴雨、暴雨-大暴雨、大暴雨-特大暴雨、极端降雨' },
  { key: 'RAIN', value: 'rain', label: '小雨、中雨、毛毛雨_细雨，雨、小雨-中雨、中雨-大雨' },
  { key: 'SHOWER', value: 'shower', label: '阵雨、强阵雨' },
  { key: 'storm', value: 'storm', label: '风暴、狂暴风、飓风、热带风暴、龙卷风' },
  { key: 'BIG_WIND', value: 'big-wind', label: '强风_劲风、疾风、大风、烈风' },
  { key: 'WIND', value: 'wind', label: '有风、微风、和风、清风' },
  { key: 'DUST', value: 'dust', label: '浮尘、扬沙' },
  { key: 'THUNDER_SHOWER', value: 'thunder-shower', label: '雷阵雨、强雷阵雨' },
  { key: 'FREEXING_RAIN', value: 'freezing-rain', label: '雷阵雨并伴有冰雹、冻雨' },
  { key: 'HAZE', value: 'haze', label: '霾、中度霾' },
  { key: 'BIG_HAZE', value: 'big-haze', label: '重度霾、严重霾' },
  { key: 'BIG_FOG', value: 'big-fog', label: '浓雾、强浓雾、大雾、特强浓雾' },
  { key: 'SMALL_FOG', value: 'small-fog', label: '雾、轻雾' },
  { key: 'CLOUDY', value: 'cloudy', label: '晴间多云、多云' },
  { key: 'LESS_CLOUDY', value: 'less-cloudy', label: '少云' },
  { key: 'SAND_STORM', value: 'sand-storm', label: '沙尘暴、强沙尘暴' },
  { key: 'UNKNOW', value: 'unknow', label: '未知' },
  { key: 'COLD', value: 'cold', label: '阴、冷' },
  { key: 'RAIN_SNOW', value: 'rain-snow', label: '雨雪天气、雨夹雪、阵雨夹雪' }
])

/**
 * 天气对应资源
 */
let weatherResource = {}

JC_WEATHER.VALUES.forEach(item => {
  weatherResource[item.value] = `/static/weather/${item.value}.png`
})
export const WeatherResource = weatherResource

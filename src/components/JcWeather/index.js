/**
 * 天气
 */
import { JC_WEATHER } from '@/constant/Dictionaries'
import { getLiveWeather, getForecastWeather } from '@/map/aMap/aMapUtil'

export default class JcWeather {
  /**
  * 构造
  */
  constructor() {
    this.weatherMapping = {
      [JC_WEATHER.SUNNY]: ['晴', '少云', '晴间多云', '多云', '有风', '平静', '微风', '和风', '清风', '强风/劲风', '疾风', '大风', '烈风', '风暴', '狂爆风', '飓风', '热带风暴', '热'],
      [JC_WEATHER.OVERCAST]: ['阴', '冷', '未知'],
      [JC_WEATHER.SMOG]: ['霾', '中度霾', '重度霾', '严重霾', '浮尘', '扬沙', '沙尘暴', '强沙尘暴', '龙卷风', '雾', '浓雾', '强浓雾', '轻雾', '大雾', '特强浓雾'],
      [JC_WEATHER.RAIN]: ['阵雨', '雷阵雨', '雷阵雨并伴有冰雹', '小雨', '中雨', '大雨', '暴雨', '大暴雨', '特大暴雨', '强阵雨', '强雷阵雨', '极端降雨', '毛毛雨/细雨', '小雨-中雨', '中雨-大雨', '大雨-暴雨', '暴雨-大暴雨', '大暴雨-特大暴雨', '冻雨'],
      [JC_WEATHER.SNOW]: ['雨雪天气', '雨夹雪', '阵雨夹雪', '雪', '阵雪', '小雪', '中雪', '大雪', '暴雪', '小雪-中雪', '中雪-大雪', '大雪-暴雪', '雪', '雪', '雪', '雪', '雪']
    }
  }

  /**
   * 获取天气信息
   * @param {String} city 地区名称
   */
  async getWeather(city) {
    let result = await getLiveWeather(city)

    delete result.info //删除info字段

    //处理天气归类
    for (let key in this.weatherMapping) {
      if (this.weatherMapping[key].indexOf(result.weather) > -1) {
        result.type = key
        break
      }
    }

    return result
  }

  /**
   * 获取天气信息
   * @param {String} city 地区名称
   */
  async getForecastWeather(city) {
    let result = await getForecastWeather(city)

    delete result.info //删除info字段

    //处理天气归类
    result.forecasts.forEach(item => {
      for (let key in this.weatherMapping) {
        if (this.weatherMapping[key].indexOf(item.dayWeather) > -1) {
          item.dayType = key
        }
        if (this.weatherMapping[key].indexOf(item.nightWeather) > -1) {
          item.nightType = key
        }
      }
    })

    return result
  }

  get [Symbol.toStringTag]() {
    return 'JcWeather'
  }
}

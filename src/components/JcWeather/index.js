/**
 * 天气
 */
import { JC_WEATHER, WeatherResource } from '@/config/JcWeatherConfig'
import { getLiveWeather, getForecastWeather } from '@/map/aMap/aMapUtil'

export default class JcWeather {
  /**
  * 构造
  */
  constructor() {
    this.weatherMapping = {}
    JC_WEATHER.VALUES.forEach(item => {
      this.weatherMapping[item.value] = item.label.split('、')
    })
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
      if (this.weatherMapping[key].includes(result.weather)) {
        result.type = key
        result.source = WeatherResource[key]
        break
      }
    }

    return result
  }

  /**
   * 获取查询四天预报天气
   * @param {String} city 地区名称
   */
  async getForecastWeather(city) {
    let result = await getForecastWeather(city)

    delete result.info //删除info字段

    //处理天气归类
    result.forecasts.forEach(item => {
      for (let key in this.weatherMapping) {
        if (this.weatherMapping[key].includes(item.dayWeather)) {
          item.dayType = key
          item.source = WeatherResource[key]
        }
        if (this.weatherMapping[key].includes(item.nightWeather)) {
          item.nightType = key
          item.source = WeatherResource[key]
        }
      }
    })

    return result
  }

  get [Symbol.toStringTag]() {
    return 'JcWeather'
  }
}

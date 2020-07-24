<template>
  <div class="weather-info jc-flex-warp">
    <jc-abstract-area title="气象信息">
      <div class="weather-info-content jc-flex-con jc-flex-warp jc-flex-vertical">
        <!-- 当前天气信息 -->
        <div class="jc-current-weather jc-flex-con-2 jc-flex-warp">
          <div class="jc-weather-img-wrap jc-flex-con jc-flex-warp">
            <img :src="weather.source" alt="当前天气">
          </div>
          <div class="jc-current-weather-content jc-flex-con-3 jc-flex-warp jc-flex-vertical">

            <div class="jc-weather-humidity jc-flex-con jc-flex-warp">
              <div class="weath-humidity-left">
                <span>东北风3级</span> |
                <span>湿度87%</span>
              </div>
              <div class="weath-humidity-right">
                <span>{{weather.date}}</span>
              </div>
            </div>

            <div class="jc-weather-temperature jc-flex-con-2 jc-flex-warp">
              <div class="weather-temperature-left">
                <span>27℃</span>
              </div>
              <div class="weather-temperature-right">
                <span>周{{weather.currentWeek}}</span>
              </div>
            </div>

          </div>
        </div>

        <!-- 未来天气信息 -->
        <div class="jc-future-weather jc-flex-con-2 jc-flex-warp">

          <div class="jc-future-weather-info jc-flex-con jc-flex-warp" v-for="(item) in futureWeather" :key="item.data">

            <div class="future-weather-img-wrap jc-flex-warp jc-flex-con">
              <img :src="item.source" width='36' alt="">
            </div>
            <div class="future-weather-content jc-flex-con-2 jc-flex-vertical">
              <div class="future-top-info">
                <span>周{{item.currentWeek}}</span>
              </div>
              <div class="future-bottom-info">
                <span>{{item.dayWeather}}</span>
                <span>{{item.nightTemp}}℃~{{item.dayTemp}}℃</span>
              </div>
            </div>

          </div>

        </div>
      </div>
    </jc-abstract-area>
  </div>
</template>

<script>
// 组件
import JcAbstractArea from '../../../common/abstractArea'
import { getUser } from '@/libs/storage'
import { getAreaCodeByOrgId } from '@/api/area'
import JcWeather from '@/components/JcWeather'

export default {
  name: 'ScreenDataStatisticsOtherInfoWeatherInfo',
  components: { JcAbstractArea },
  data() {
    return {
      weather: {},
      futureWeather: []
    }
  },
  mounted() {
    this.getWeather() // 获取天气信息
  },
  methods: {
    async getWeather() {
      const _this = this

      console.log('weather info ', getUser())

      let { orgId } = await getUser() // 获取用户orgId

      console.log(orgId)
      let { areaCode } = await getAreaCodeByOrgId(orgId) // 通过用户orgId获取城市areaCode

      console.log(areaCode)

      let myWeather = new JcWeather() // 实例化获取天气的类

      this.weather = await myWeather.getWeather(areaCode) // 当日天气
      let { forecasts } = await myWeather.getForecastWeather(areaCode) // 四天天气

      forecasts = forecasts.map(item => ({
        ...item,
        currentWeek: _this.getWeek(item.week)
      }))

      this.weather = Object.assign({}, this.weather, forecasts[0])

      this.futureWeather = forecasts.filter((item, index) => !!index) // 未来三天天气

      console.log(this.weather)
      console.log(this.futureWeather)
    },
    getWeek(week) {
      switch (week) {
      case '1':
        return '一'

      case '2':
        return '二'
      case '3':
        return '三'
      case '4':
        return '四'
      case '5':
        return '五'
      case '6':
        return '六'
      case '7':
        return '日'
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-current-weather {
  padding: 16px;

  .jc-weather-img-wrap {
    justify-content: center;
    align-items: center;
  }

  .jc-current-weather-content {
    padding-left: 10px;
    color: #ffffff;

    .jc-weather-humidity {
      justify-content: space-between;
      align-items: center;

      span {
        padding: 0 6px;
      }
    }

    .jc-weather-temperature {
      justify-content: space-between;
      align-items: flex-start;

      .weather-temperature-left {
        font-size: 46px;
      }
      .weather-temperature-right {
        padding-right: 6px;
        font-size: 16px;
      }
    }
  }
}

.jc-future-weather {
  background-color: rgba(4, 115, 192, 0.14);
  padding: 14px 0;

  .jc-future-weather-info {
    position: relative;

    &:not(:last-child) {
      &::after {
        content: "";
        position: absolute;
        top: 0;
        bottom: 0;
        right: 0;
        width: 1px;
        background: url("./assets/separate.png") no-repeat 0 0/100%;
      }
    }

    .future-weather-img-wrap {
      justify-content: flex-end;
      align-items: center;
      padding-right: 10px;
    }
    .future-weather-content {
      color: #8bc1fc;
      font-size: 12px;

      .future-top-info {
        padding-bottom: 4px;
      }
    }
  }
}
</style>

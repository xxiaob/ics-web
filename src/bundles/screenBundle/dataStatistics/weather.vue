<template>
  <div class="weather">
    <div class="title">
      <span>天气信息</span>
    </div>
    <div class="jc-column-flex3">
      <div class="ic-row-flex1" :class="getWeatherStyle(weather.type)"></div>
      <div class="ic-row-flex1">
        <p>
          <span class="count">{{weather.temperature}}</span>
          <span class="unit">℃</span>
        </p>
      </div>
      <div class="ic-row-flex1">
        <p>{{weather.weather}}天</p>
        <p>{{weather.windDirection}}风 {{weather.windPower}} 级</p>
      </div>
    </div>
    <div class="jc-column-flex4">
      <div class="ic-row-flex1">
        <div class="jc-column-flex1">周五</div>
        <div class="jc-column-flex2 jc-weather-sunny"></div>
        <div class="jc-column-flex1">35℃</div>
        <div class="jc-column-flex1">阴天</div>
      </div>
      <div class="ic-row-flex1">
        <div class="jc-column-flex1">周五</div>
        <div class="jc-column-flex2 jc-weather-sunny"></div>
        <div class="jc-column-flex1">35℃</div>
        <div class="jc-column-flex1">阴天</div>
      </div>
      <div class="ic-row-flex1">
        <div class="jc-column-flex1">周五</div>
        <div class="jc-column-flex2 jc-weather-sunny"></div>
        <div class="jc-column-flex1">35℃</div>
        <div class="jc-column-flex1">阴天</div>
      </div>
      <div class="ic-row-flex1">
        <div class="jc-column-flex1">周五</div>
        <div class="jc-column-flex2 jc-weather-sunny"></div>
        <div class="jc-column-flex1">35℃</div>
        <div class="jc-column-flex1">阴天</div>
      </div>
    </div>
  </div>
</template>

<script>
import JcWeather from '@/components/JcWeather'
import { JC_WEATHER } from '@/constant/Dictionaries'
const weatherStyleMapping = {
  [JC_WEATHER.SUNNY]: 'jc-weather-sunny',
  [JC_WEATHER.OVERCAST]: 'jc-weather-overcast',
  [JC_WEATHER.SMOG]: 'jc-weather-smog',
  [JC_WEATHER.RAIN]: 'jc-weather-rain',
  [JC_WEATHER.SNOW]: 'jc-weather-snow'
}

export default {
  name: 'weather',
  data() {
    return {
      weather: {},
      weathers: {},
      weeks: {
        0: '周日',
        1: '周一',
        2: '周二',
        3: '周三',
        4: '周四',
        5: '周五',
        6: '周六'
      }
    }
  },
  async  created() {
    const myWeather = new JcWeather()

    this.weather = await myWeather.getWeather('南京')
    this.weathers = await myWeather.getForecastWeather('南京')
    console.log('now weather', this.weather, this.weathers)
  },
  methods: {
    getWeatherStyle(type) {
      return weatherStyleMapping[type]
    }
  }
}
</script>

<style lang="scss" scoped>
.jc-column-flex3 {
  flex: 3;
}
.jc-column-flex4 {
  flex: 5;
}
.jc-column-flex3,
.jc-column-flex4 {
  display: flex;
  flex-direction: row;
  text-align: center;
  padding: 10px 0;
  .ic-row-flex1 {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    .count {
      font-size: 28px;
    }

    .jc-column-flex1 {
      flex: 1;
      font-size: 12px;
    }
    .jc-column-flex2 {
      flex: 2;
      font-size: 12px;
    }
  }
}

.jc-weather-sunny {
  background: url(../command/modules/header/assets/sunny.png) no-repeat;
  background-size: 80% 80%;
  background-position: 50% 50%;
}

.jc-weather-snow {
  background: url(../command/modules/header/assets/snow.png) no-repeat;
  background-size: 80% 80%;
  background-position: 50% 50%;
}

.jc-weather-overcast {
  background: url(../command/modules/header/assets/overcast.png) no-repeat;
  background-size: 80% 80%;
  background-position: 50% 50%;
}

.jc-weather-smog {
  background: url(../command/modules/header/assets/smog.png) no-repeat;
  background-size: 80% 80%;
  background-position: 50% 50%;
}

.jc-weather-rain {
  background: url(../command/modules/header/assets/rain.png) no-repeat;
  background-size: 80% 80%;
  background-position: 50% 50%;
}
</style>

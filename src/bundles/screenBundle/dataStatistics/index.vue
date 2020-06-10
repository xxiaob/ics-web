<template>
  <section class="jc-screen-warp">
    <div class="jc-container">
      <jc-header></jc-header>
      <div class="jc-top">
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-total-count class="jc-item-content"></jc-total-count>
              </div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-case-summary class="jc-item-content"></jc-case-summary>
              </div>
            </div>
          </div>
        </div>
        <div class="jc-row-flex2">
          <jc-map></jc-map>
          <jc-map-left class="jc-item-content"></jc-map-left>
          <jc-map-right class="jc-item-content"></jc-map-right>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-monitor class="jc-item-content"></jc-monitor>
              </div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-real-time-event class="jc-item-content"></jc-real-time-event>
              </div>
            </div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-weather class="jc-item-content"></jc-weather>
              </div>
            </div>
          </div>
          <div class="jc-column-flex1">
            <div class="jc-item-out">
              <div class="jc-item">
                <jc-attend class="jc-item-content"></jc-attend>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="jc-bottom">
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">
              <jc-data-statistics class="jc-item-content"></jc-data-statistics>
            </div>
          </div>
        </div>
        <div class="jc-row-flex2">
          <div class="jc-item-out">
            <div class="jc-item">
              <div class="jc-item-1">
                <jc-count-statistics class="jc-item-content"></jc-count-statistics>
              </div>
              <div class="jc-item-2">
                <jc-type-statistics class="jc-item-content"></jc-type-statistics>
              </div>
            </div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">
              <!-- <jc-event-type class="jc-item-content"></jc-event-type> -->
              <jc-slag-summary class="jc-item-content"></jc-slag-summary>
            </div>
          </div>
        </div>
        <div class="jc-row-flex1">
          <div class="jc-item-out">
            <div class="jc-item">
              <jc-intellect class="jc-item-content"></jc-intellect>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
<script>

export default {
  name: 'ScreenDataStatistics',
  components: {
    JcHeader: ()=> import('./header'),
    JcDataStatistics: ()=> import('./dataStatistics'),
    JcCountStatistics: ()=> import('./countStatistics'),
    JcTypeStatistics: ()=> import('./typeStatistics'),
    JcIntellect: ()=> import('./intellect'),
    JcEventType: ()=> import('./eventType'),
    JcMonitor: ()=> import('./monitor'),
    JcRealTimeEvent: ()=> import('./realTimeEvent'),
    JcAttend: ()=> import('./attend'),
    JcTotalCount: ()=> import('./totalCount'),
    JcCaseSummary: ()=> import('./caseSummary'),
    JcWeather: ()=> import('./weather'),
    JcMapLeft: ()=> import('./mapLeft'),
    JcMapRight: ()=> import('./mapRight'),
    JcMap: ()=> import('./map'),
    JcSlagSummary: () => import('./slagSummary')
  }
}
</script>
<style lang="scss" scoped src="./css/datastatistics.scss"></style>

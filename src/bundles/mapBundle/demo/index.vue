<template>
  <section class="jc-map-warp">
    <div class="jc-map-space" id="myMap"></div>
  </section>
</template>
<script>
export default {
  name: 'MapDemo',
  mounted() {
    let mapEl = document.getElementById('myMap')

    mapEl.addEventListener('DOMNodeInserted', (e) => {
      let target = e.target

      if (target.querySelector('.scale-control') || target.querySelector('.logo-text')) {
        target.parentNode.removeChild(target)
      }
    }, false)
    //定义地图中心点坐标
    let center = new TMap.LatLng(32.05838, 118.79647)
    //定义map变量，调用 TMap.Map() 构造函数创建地图

    let map = new TMap.Map(mapEl, {
      center: center, //设置地图中心点坐标
      baseMap: {
        type: 'vector',
        features: ['base', 'building3d', 'building2d', 'point', 'label']
      },
      // viewMode: '2D',
      zoom: 13, //设置地图缩放级别
      pitch: 60, //设置俯仰角
      rotation: 45 //设置地图旋转角度
    })
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp,
.jc-map-space {
  position: relative;
  width: 100%;
  height: 100%;
}
</style>

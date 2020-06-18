<template>
  <div class="jc-map-warp">
    <map-search ref="mapSearch" class="jc-area-search"></map-search>
    <div class="jc-select-warp" :title="userSelect?'关闭框选':'开启框选'">
      <el-switch v-model="userSelect" @change="userSelectChange"></el-switch>
    </div>
    <div class="jc-marker-map" ref="myMap"></div>
    <el-radio-group v-model="distence" size="mini" class="jc-distence-warp" @change="getUsers">
      <el-radio-button label="500">500m</el-radio-button>
      <el-radio-button label="2000">2000m</el-radio-button>
      <el-radio-button label="5000">5000m</el-radio-button>
    </el-radio-group>
  </div>
</template>
<script>
import { JcMap, JcMapMarker } from '@/map'
import { markerStyle } from '@/map/mapConst'
import { MAP_EVENT } from '@/constant/CONST'
import MapSearch from '@/components/JcMap/MapSearch'
import { getAddressByPosition, getMouseTool } from '@/map/aMap/aMapUtil'
import { getUsersByPosition } from '@/api/user'
import { JcUserIcons } from '@/config/JcIconConfig'

let MouseTool = null //存储 MouseTool对象

let myJcMap = null

let mousetool = null

export default {
  name: 'MapUserMarker',
  model: { prop: 'value', event: 'change' },
  props: { value: { type: Object, default: {} } },
  components: { MapSearch },
  data() {
    return {
      myMarker: null,
      distence: '500',
      userSelect: false,
      users: [],
      address: { position: '', name: '' }
    }
  },
  mounted() {
    myJcMap = new JcMap()
    this.initData()
  },
  watch: {
    value() {
      this.valueChange() //监听传入值变化
    },
    address() {
      this.$emit('change', this.address)
    }
  },
  methods: {
    async initData() {
      await myJcMap.init(this.$refs.myMap) //等待地图初始化

      MouseTool = await getMouseTool()

      mousetool = new MouseTool(myJcMap.map)
      mousetool.on('draw', (e) => {
        console.log('MapUserMarker Draw', e)
        let rectEl = e.obj

        //处理判断在绘图矩形内的用户
        let usedIds = []

        this.users.forEach(item => {
          if (rectEl.contains(item.center)) {
            usedIds.push(item.userId)
          }
        })
        myJcMap.map.remove(myJcMap.map.getAllOverlays('rectangle'))
        if (usedIds.length) {
          this.$emit('user-change', usedIds)
        }
        console.log('框选的用户：', usedIds)
      })
      this.$refs.mapSearch.initData(myJcMap) //初始化搜索对象

      this.valueChange() //初始化基础数据

      //添加监听
      myJcMap.on(MAP_EVENT.RIGHTCLICK, (data) => {
        console.log('地图点击了', data)
        let center = [data.lnglat.lng, data.lnglat.lat]

        getAddressByPosition(data.lnglat).then(name => {
          this.showMarker(center, name)
          this.address = { position: center.join(','), name }
        })
      })
    },
    async getUsers() {
      //获取用户信息
      let position = this.address.position || (this.value ? this.value.position : '')

      if (!position) {
        return
      }
      try {
        //清除之前的用户显示之后去获取新的用户
        this.users.forEach(item => {
          item.marker.hide()
        })
        let center = position.split(',')

        let results = await getUsersByPosition({ distance: this.distence, lat: center[1], lon: center[0] })

        let users = []

        if (results && results.length) {
          results.forEach(item => {
            let userPosition = item.location

            let marker = new JcMapMarker({ map: myJcMap, name: item.userName, icon: JcUserIcons.online, position: userPosition })

            users.push({ userId: item.userId, userName: item.userId, center: userPosition, marker })
          })
        }
        this.users = users
        myJcMap.fitView()
        console.log('距离' + this.distence + 'm内的用户：', results)
      } catch (error) {
        console.log(error)
      }
    },
    valueChange() {
      if (!(this.value && this.value.position)) {
        this.distence = '500'
        this.userSelect = false
        if (this.myMarker) {
          this.myMarker.hide()
        }
        this.userSelectChange(false)
      } else if (this.value.position != this.address.position && this.value.name != this.address.name) {
        this.showMarker(this.value.position.split(','), name)
        this.distence = '500'
        this.userSelect = false
      }
      this.getUsers() //去获取用户
    },
    userSelectChange(isSelect) {
      if (isSelect) {
        mousetool.rectangle({ strokeWeight: 1, strokeColor: '#fc005b', fillOpacity: 0, strokeStyle: 'dashed' })
      } else {
        mousetool.close(true)
      }
    },
    showMarker(center, name) {
      if (this.myMarker) {
        this.myMarker.name = name
        this.myMarker.show(center)
      } else {
        this.myMarker = new JcMapMarker({ map: myJcMap, name, icon: '/static/mapIcons/temporarytasks.gif', position: center, mapStyle: markerStyle.TEMPORARY_TASKS })
      }
    }
  },
  beforeDestroy() {
    myJcMap = null
    mousetool = null
    myJcMap.destroy()
  }
}
</script>
<style lang="scss" scoped>
.jc-map-warp,
.jc-marker-map {
  position: relative;
  width: 100%;
  height: 100%;
  z-index: 1;
}
.jc-area-search {
  top: $jc-default-dis;
}
.jc-select-warp {
  position: absolute;
  top: $jc-default-dis/2;
  right: $jc-default-dis/2;
  z-index: 4;
}
.jc-distence-warp {
  position: absolute;
  right: $jc-default-dis/2;
  bottom: $jc-default-dis/2;
  z-index: 4;
}
</style>

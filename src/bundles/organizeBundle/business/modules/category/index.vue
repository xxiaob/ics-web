<template>
    <el-col :span="8">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">业务类别占比</div>
          <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="1">事件</el-radio-button>
            <el-radio-button  label="2">问题</el-radio-button>
            <el-radio-button  label="3">任务</el-radio-button>
          </el-radio-group>
        </div>

        <div class="jc-type-echarts jc-flex-con">
          <jc-charts :options="options" :isClear="true"></jc-charts>
        </div>

      </el-card>
    </el-col>
</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts' // echarts
export default {
  name: 'OrganizeBusinessCategory',
  components: { JcCharts },
  props: {
  },
  data() {
    return {
      activated: 1,
      options: null
    }
  },
  watch: {
    activated() {
      this.processData()
    }
  },
  methods: {
    processData() {
      let name = ''

      let datas = []

      console.log('this.activated', this.activated)
      if (this.activated == 1) {
        console.log(111)
        name = '事件'
        datas = [
          { value: 18, name: '市容环境' },
          { value: 10, name: '宣传广告' },
          { value: 8, name: '施工管理' },
          { value: 5, name: '街面秩序' },
          { value: 5, name: '突发事件' },
          { value: 4, name: '其他事件' }
        ]
      } else if (this.activated == 2) {
        console.log(222)

        name = '任务'
        datas = [
          { value: 30, name: '市容环境' },
          { value: 19, name: '宣传广告' },
          { value: 21, name: '施工管理' },
          { value: 16, name: '街面秩序' },
          { value: 7, name: '突发事件' },
          { value: 9, name: '其他事件' }
        ]
      } else if (this.activated == 3) {
        console.log(333)

        name = '问题'
        datas = [
          { value: 9, name: '市容环境' },
          { value: 20, name: '宣传广告' },
          { value: 18, name: '施工管理' },
          { value: 20, name: '街面秩序' },
          { value: 17, name: '突发事件' },
          { value: 14, name: '其他事件' }
        ]
      }

      console.log('datas', datas)

      let total = datas.reduce((prev, current) => prev + current.value * 1, 0)

      this.options.series[0].name = name
      this.options.series[0].data = datas
      this.options.title.text = `{name| 合计 }\n{val| ${ total}个}`
    }
  },
  created() {
    this.options = {
      color: [ '#6AA3FF', '#0064FD', '#BD7EFF', '#FF7CA2', '#FFDB53', '#8CE78A' ],
      title: {
        text: '',

        top: '36%',
        textAlign: 'center',
        left: '29%',
        textStyle: {
          rich: {
            name: {
              fontSize: 14,
              fontWeight: 'normal',
              color: '#666666',
              padding: [10, 0]
            },
            val: {
              fontSize: 18,
              fontWeight: 'bold',
              color: '#333333'
            }
          }
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        // pageIconColor: '#112adf',
        // pageIconInactiveColor: '#0f89d2',
        // pageIconSize: 12,

        icon: 'circle',
        orient: 'vertical',
        right: 0,
        top: 'center',

        itemWidth: 10,
        itemHeight: 8,
        itemGap: 8,
        selectedMode: false,
        textStyle: {
          fontSize: 12,
          rich: {
            name: {
              // fontSize: 12,
              lineHeight: 24
            },
            percentage: {
              // fontSize: 12,
              width: 60,
              align: 'left',
              color: '#999',
              padding: [0, 0, 0, 12 ]
            },
            value: {
              // fontSize: 12
            }
          }

        },
        formatter: name=> {
          let index = 0, total = 0
          const datas = this.options.series[0].data

          if (datas.length) {
            datas.forEach((v, i) => {
              total += v.value
              if (v.name == name) {
                index = i
              }
            })

            const percentage = datas[index].value === 0 ? 0 : ((datas[index].value / total) * 100).toFixed(2)

            return [`{name|${name}  |}`, `{percentage| ${ percentage }% }`, `{value| ${datas[index].value} }`].join('')
          } else {
            return name
          }
        }
      },
      series: [
        {
          name: '业务类型占比',
          type: 'pie',
          radius: ['56%', '80%'],
          center: ['30%', '50%'],
          label: {
            show: false
          },
          itemStyle: {
            borderWidth: 3,
            borderColor: '#fff'
            // normal: {
            //   borderColor: '#fff',
            //   borderWidth: 6
            // }
          },
          data: [],

          animationType: 'scale',
          animationEasing: 'elasticOut',
          animationDelay: ()=> {
            return Math.random() * 200
          }
        }
      ]

    }

    this.processData()
  }
}
</script>

<style lang="scss" scoped>

</style>

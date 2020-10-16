<template>
    <el-col :span="8">
      <el-card >
      <div slot="header" class="jc-card-header">
          <div class="jc-card-title">业务类别占比</div>
          <el-radio-group class="jc-button-group" v-model="activated" size="mini">
            <el-radio-button  label="0">事件</el-radio-button>
            <el-radio-button  label="2">问题</el-radio-button>
            <el-radio-button  label="1">任务</el-radio-button>
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


let options = {
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
    pageIconColor: '#112adf',
    pageIconInactiveColor: '#0f89d2',
    pageIconSize: 12,
    type: 'scroll',
    pageTextStyle: {
      color: 'rgb(139,193,252)'
    },
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
      const datas = options.series[0].data

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

export default {
  name: 'OrganizeBusinessCategory',
  components: { JcCharts },
  props: {
    category: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      activated: '0',
      options: null
    }
  },
  watch: {
    activated() {
      this.processData()
    },
    category() {
      this.processData()
    }
  },
  methods: {
    processData() {
      console.log('this.category', this.category)
      if (this.category && this.category.length) {
        let name = '', total = 0

        let categoryData = {}

        let data = []

        this.category.forEach(item => {
          if (item.index == this.activated) {
            categoryData = { ...item }
            name = categoryData.typeName
            total = categoryData.countNumber
            categoryData.typeRateDTOList.forEach(item2 => {
              data.push({
                name: item2.typeName,
                value: item2.typeCount
              })
            })
          }
        })

        options.series[0].name = name
        options.series[0].data = data
        options.title.text = `{name| 合计 }\n{val| ${ total}个}`

        this.options = options
      }
    }
  }

}
</script>


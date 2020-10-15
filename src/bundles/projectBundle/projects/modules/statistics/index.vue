<template>
  <el-dialog :visible.sync="dialogVisible" width="1000px" :close-on-click-modal="false" :append-to-body="true" @close="dialogClose">
    <div slot="title" class="el-dialog__header__title">
      <span class="title-name">项目统计</span>
      <span class="title-divide">|</span>
      <span class="title-project">{{options.projectName}}</span>
      <span class="title-time">{{options.beginTime}}-{{options.endTime}}</span>
    </div>

    <el-row :gutter="20">
      <el-col :span="6">
        <el-card>
          <div slot="header" class="jc-card-header">
            <div class="jc-card-title">项目资源</div>
          </div>
          <div class="jc-detail">
            <p>
              <span>人员：</span>
              <span class="jc-right">7名</span>
            </p>
            <p>
              <span>网巡车：</span>
              <span class="jc-right">2辆</span>
            </p>
            <p>
              <span>固定监控：</span>
              <span class="jc-right">56个</span>
            </p>
            <p>
              <span>无人机：</span>
              <span class="jc-right">56架</span>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6">
        <el-card>
          <div slot="header" class="jc-card-header">
            <div class="jc-card-title">项目勤务</div>
          </div>
          <div class="jc-detail">
            <p>
              <span>在岗里程：</span>
              <span class="jc-right">119公里</span>
            </p>
            <p>
              <span>在岗时长：</span>
              <span class="jc-right">223小时</span>
            </p>
            <p>
              <span>岗点触碰：</span>
              <span class="jc-right">56个</span>
            </p>
            <p>
              <span>岗点日常任务：</span>
              <span class="jc-right">56个</span>
            </p>
            <p>
              <span>岗点达标任务：</span>
              <span class="jc-right">56个</span>
            </p>
            <p>
              <span>岗点任务达标率：</span>
              <span class="jc-right">56个</span>
            </p>
          </div>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card>
          <div slot="header" class="jc-card-header">
            <div class="jc-card-title">业务类别占比</div>
            <el-radio-group class="jc-button-group" v-model="activated" size="mini">
              <el-radio-button  label="1">事件</el-radio-button>
              <el-radio-button  label="2">任务</el-radio-button>
            </el-radio-group>
          </div>
          <div class="jc-type-echarts">
            <jc-charts :options="chartOptions"></jc-charts>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </el-dialog>
</template>

<script>
import JcCharts from '@/components/JcForm/JcCharts'
export default {
  name: 'ProjectProjectsStatistics',
  props: ['options', 'visible'],
  components: { JcCharts },
  data() {
    return {
      activated: 1,
      dialogVisible: false,
      chartOptions: null
    }
  },
  watch: {
    visible(newVal) {
      if (newVal) {
        this.initData()
      }
    },
    activated(newVal) {
      console.log('newVal', newVal)
      this.processData()
    }
  },
  methods: {
    initData() {
      this.dialogVisible = this.visible
    },
    dialogClose() {
      this.$emit('update:visible', false)
    },
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
      }

      console.log('datas', datas)

      let total = datas.reduce((prev, current) => prev + current.value * 1, 0)

      this.chartOptions.series[0].name = name
      this.chartOptions.series[0].data = datas
      this.chartOptions.title.text = `{name| 合计 }\n{val| ${total}个}`
    }
  },
  created() {
    this.chartOptions = {
      color: [ '#04e0f9', '#48f754', '#f9ff5c', '#ffba00', '#ff5d5d', '#04dcfc' ],
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
          const datas = this.chartOptions.series[0].data

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
/deep/{
  .el-dialog__header__title{
    line-height: 30px;
    .title-name,.title-project{
      font-weight: bold;
      font-size: 16px;
    }
    .title-divide{
      color: #999999;
      margin: 0 $jc-default-dis/2;
    }
    .title-time{
      margin-left: $jc-default-dis;
      color: #999999;
    }
  }
  .el-dialog__body{
    padding: 0 $jc-default-dis;
  }
}
.el-card{
  box-shadow: none;
  border: none;
  /deep/{
    .el-card__header{
      border: none;
      .jc-card-title{
        color: #333333;
        font-weight: bold;
        text-indent: inherit;
        &::before{
          width: 0;
        }
      }
    }
    .el-card__body{
      padding-top: 0;
    }
  }
  .jc-detail{
    line-height: 30px;
    .jc-right{
      float: right;
    }
  }
}
.jc-type-echarts{
  height: 260px;
}
</style>

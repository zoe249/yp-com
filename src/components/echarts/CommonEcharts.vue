<template>
  <div ref="echart" style="height:100%;">{{ $t('lang.loading') }}</div>
</template>

<script>
import echarts from 'echarts'
export default {
  props: {
    chartData: {
      type: Object,
      default() {
        return {
          xData: [],
          series: []
        }
      }
    },
    isAxisChart: {
      type: Boolean,
      default: true
    }
  },
  watch: {
    chartData: {
      handler: function() {
        this.initChart()
      },
      deep: true
    },
    isCollapse() {
      setTimeout(() => {
        this.resizeChart()
      }, 300)
    }
  },
  computed: {
    options() {
      return this.isAxisChart ? this.axisOption : this.normalOption
    },
    isCollapse() {
      return this.$store.state.tab.isCollapse
    }
  },
  data() {
    return {
      echart: null,
      axisOption: {
        legend: {
          textStyle: {
            color: '#333'
          }
        },
        grid: {
          left: '10%'
        },
        tooltip: {
          trigger: 'axis'
        },
        xAxis: {
          type: 'category',
          data: [],
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          },
          axisLabel: {
            color: '#333'
          }
        },
        color: ['#2ec7c9', '#b6a2de', '#5ablef'],
        yAxis: {
          type: 'value',
          axisLine: {
            lineStyle: {
              color: '#17b3a3'
            }
          }
        },
        series: []
      },
      normalOption: {
        tooltip: {
          trigger: 'item'
        },
        series: [
          {
            type: 'pie',
            data: []
          }
        ]
      }
    }
  },
  methods: {
    // 初始化图表
    initChart() {
      this.initChartData()
      if (this.echart) {
        this.echart.setOption(this.options)
      } else {
        this.echart = echarts.init(this.$refs.echart)
        this.echart.setOption(this.options)
      }
    },
    initChartData() {
      if (this.isAxisChart) {
        this.axisOption.xAxis.data = this.chartData.xData
        this.axisOption.series = this.chartData.series
      } else {
        this.normalOption.series = this.chartData.series
      }
    },
    resizeChart() {
      if (this.echart) {
        this.echart.resize()
      }
    }
  },
  mounted() {
    window.addEventListener('resize', this.resizeChart)
  },
  destroyed() {
    window.removeEventListener('resize', this.resizeChart)
  }
}
</script>

<style lang="scss" scoped></style>

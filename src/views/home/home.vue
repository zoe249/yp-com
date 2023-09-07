<template>
  <div>
    <el-row :gutter="20">
      <el-col :span="6"
        ><el-card shadow="hover">
          <div class="top-card">
            <div class="content-label">
              <span class="content-label-title">{{ $t('lang.newMembers') }}</span>
              <span class="content-label-num">20</span>
            </div>
            <div class="content-chart">
              <el-progress type="circle" :percentage="25"></el-progress>
            </div>
          </div> </el-card
      ></el-col>
      <el-col :span="6"
        ><el-card shadow="hover">
          <div class="top-card">
            <div class="content-label">
              <span class="content-label-title">{{ $t('lang.getCoupons') }}</span>
              <span class="content-label-num">20</span>
            </div>
            <div class="content-chart">
              <el-progress type="circle" :percentage="100" status="success"></el-progress>
            </div>
          </div> </el-card
      ></el-col>
      <el-col :span="6"
        ><el-card shadow="hover">
          <div class="top-card">
            <div class="content-label">
              <span class="content-label-title">{{ $t('lang.memIntegral') }}</span>
              <span class="content-label-num">20</span>
            </div>
            <div class="content-chart">
              <el-progress type="circle" :percentage="70" status="warning"></el-progress>
            </div>
          </div>
        </el-card>
      </el-col>
      <el-col :span="6"
        ><el-card shadow="hover">
          <div class="top-card">
            <div class="content-label">
              <span class="content-label-title">{{ $t('lang.registerUser') }}</span>
              <span class="content-label-num">20</span>
            </div>
            <div class="content-chart">
              <el-progress type="circle" :percentage="50" status="exception"></el-progress>
            </div>
          </div> </el-card
      ></el-col>
    </el-row>
    <el-row :gutter="20">
      <el-col :span="12">
        <el-card class="table-card-table" shadow="hover">
          <common-table :tableData="memberList" :tableLabel="memberListLabel"></common-table>
        </el-card>
      </el-col>
      <el-col :span="12">
        <el-card class="table-card" shadow="hover">
          <div class="chart-wrapper"><common-echarts :chartData="echartData.merberLine"></common-echarts></div>
        </el-card>
        <el-card class="table-card-tow" shadow="hover">
          <div class="table-card-tow-wrapper">
            <div class="left"><common-echarts :chartData="echartData.merberBar"></common-echarts></div>
            <div class="right">
              <common-echarts :chartData="echartData.merberPie" :isAxisChart="false"></common-echarts>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import CommonTable from '@/components/table/CommonTable.vue'
import CommonEcharts from '@/components/echarts/CommonEcharts.vue'
export default {
  components: {
    CommonTable,
    CommonEcharts
  },
  data() {
    return {
      // 表格数据
      memberList: [],
      echartData: {
        merberLine: {
          xData: [],
          series: []
        },
        merberBar: {
          xData: [],
          series: []
        },
        merberPie: {
          series: []
        }
      }
    }
  },
  computed: {
    // 表格label标签
    memberListLabel() {
      return [
        {
          label: this.$t('lang.month'),
          prop: 'month'
        },
        {
          label: this.$t('lang.newMembers'),
          prop: 'addMember'
        },
        {
          label: this.$t('lang.memIntegral'),
          prop: 'addIntegral'
        },
        {
          label: this.$t('lang.getCoupons'),
          prop: 'getCoupons'
        },
        {
          label: this.$t('lang.registerUser'),
          prop: 'registerUser'
        }
      ]
    }
  },
  created() {
    // console.log(this.memberListLabel)
    this.getMembers()
  },
  methods: {
    getMembers() {
      // this.$api.getHomeApi.getMembersList().then(res => {
      // console.log(res)
      // this.memberList = res.data.data
      // 会员折线图
      // const merberLine = res.data.data
      // const merberLineXdata = []
      // for (let i = 0; i < merberLine.length; i++) {
      //   merberLineXdata[i] = merberLine[i].month
      // }
      // // 折线图x轴
      // this.echartData.merberLine.xData = merberLineXdata
      // // 柱状图x轴
      // this.echartData.merberBar.xData = merberLineXdata
      // // 折线图y轴数据
      // const obj1 = {
      //   name: '新增会员',
      //   data: [],
      //   type: 'line'
      // }
      // for (let i = 0; i < merberLine.length; i++) {
      //   obj1.data[i] = merberLine[i].addMember
      // }
      // this.echartData.merberLine.series.push(obj1)
      // const obj2 = {
      //   name: '新增积分',
      //   data: [],
      //   type: 'line'
      // }
      // for (let i = 0; i < merberLine.length; i++) {
      //   obj2.data[i] = merberLine[i].addIntegral
      // }
      // this.echartData.merberLine.series.push(obj2)
      // // 柱状图y轴数据
      // const obj3 = {
      //   name: '新增会员',
      //   data: [],
      //   type: 'bar'
      // }
      // for (let i = 0; i < merberLine.length; i++) {
      //   obj3.data[i] = merberLine[i].addMember
      // }
      // this.echartData.merberBar.series.push(obj3)
      // const obj4 = {
      //   name: '新增积分',
      //   data: [],
      //   type: 'bar'
      // }
      // for (let i = 0; i < merberLine.length; i++) {
      //   obj4.data[i] = merberLine[i].addIntegral
      // }
      // this.echartData.merberBar.series.push(obj4)
      // // 饼图数据
      // const obj5 = {
      //   name: '积分占比图',
      //   type: 'pie',
      //   radius: ['30%', '70%'],
      //   avoidLabelOverlap: false,
      //   data: []
      // }
      // for (let i = 0; i < merberLine.length; i++) {
      //   obj5.data[i] = merberLine[i].month
      //   obj5.data[i] = merberLine[i].addIntegral
      // }
      // this.echartData.merberPie.series.push(obj5)
      // })
    }
  }
}
</script>

<style lang="scss" scoped>
.el-card {
  height: 170px;
}
.top-card {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: row;
}
.content-label {
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 180px;
}
.content-label-title {
  font-size: 25px;
}
.content-label-num {
  margin-top: 30px;
  font-size: 20px;
}
.content-chart {
  height: 100%;
}
.table-card-table {
  margin-top: 20px;
  height: 520px;
}
.table-card {
  margin-top: 20px;
  height: 250px;
}
.chart-wrapper {
  height: 250px;
  width: 100%;
}
.table-card-tow {
  margin-top: 20px;
  height: 250px;
}
.table-card-tow-wrapper {
  display: flex;
  width: 100%;
  height: 250px;
}
.left {
  flex: 1;
  width: 50%;
  height: 250px;
}
.right {
  flex: 1;
  width: 50%;
  height: 250px;
}
</style>

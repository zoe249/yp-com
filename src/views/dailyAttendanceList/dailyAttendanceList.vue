<!--
 * @FileDescription: 签到记录
 * @Version: 3.0.2
 * @Author: Wangdandi
 * @Date: 2021-09-02
 -->
<template>
  <div :style="{ height: height }">
    <!-- echarts表 begin -->
    <div class="box">
      <div class="boxOne">
        <div id="main" class="echartClass"></div>
      </div>
      <div class="boxTwoEng">
        <div class="boxTwo">
          <div class="boxTwoText">
            <div class="text">总签到用户数</div>
            <div class="text1">{{ numberList.allMemberNumber }}</div>
          </div>
          <div class="boxTwoText">
            <div class="text">人均签到次数</div>
            <div class="text1">{{ numberList.averageAttendanceNumber }}</div>
          </div>
        </div>
        <div class="boxThree">
          <div class="boxTwoText">
            <div class="text">总签到次数</div>
            <div class="text1">{{ numberList.allAttendanceNumber }}</div>
          </div>
          <div class="boxTwoText">
            <div class="text">当月签到用户数</div>
            <div class="text1">{{ numberList.thisMonthMemberNumber }}</div>
          </div>
        </div>
      </div>
    </div>
    <!-- echarts表 end -->
    <!-- 搜索区域 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchFormLabel" :formData="signDataForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchsearchForm" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 搜索区域 end -->
    <!-- 签到数据列表 -->
    <el-table :data="signData" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" max-height="260px">
      <el-table-column prop="cardNumber" label="会员卡号" align="center"></el-table-column>
      <el-table-column prop="phone" label="手机号" align="center"></el-table-column>
      <el-table-column prop="nickName" label="昵称" align="center"></el-table-column>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '0'">未知</span>
          <span v-if="scope.row.gender === '1'">男</span>
          <span v-if="scope.row.gender === '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column prop="cardLevel" label="会员等级" align="center"></el-table-column>
      <el-table-column prop="sumDays" label="累计签到天数" align="center"></el-table-column>
      <el-table-column prop="prize" label="领取累计奖励" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.prize === true">是</span>
          <span v-if="scope.row.prize === false">否</span>
        </template>
      </el-table-column>
      <el-table-column prop="attendanceTime" label="签到时间" align="center"></el-table-column>
    </el-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="signDataForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="signDataForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import echarts from 'echarts'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpSearchForm
  },
  data() {
    return {
      charts: '',
      yAxisList: [], // 表数据
      axisXList: [], // 数据表x轴
      signData: [], // 数据列表
      signDataForm: {
        pageIndex: 1,
        pageSize: 20,
        memberName: '', // 手机号或姓名
        attendanceStartTime: '', // 开始时间
        attendanceEndTime: '' // 结束时间
      },
      numberList: {
        allMemberNumber: '', // 总签到用户数
        allAttendanceNumber: '', // 总签到次数
        averageAttendanceNumber: '', // 人均签到次数
        thisMonthMemberNumber: '' // 当月签到用户数
      },
      total: 0
    }
  },
  computed: {
    searchFormLabel() {
      return [
        {
          label: '昵称:',
          type: 'input',
          prop: 'memberName',
          placeholder: '手机号或昵称'
        },
        {
          label: '签到时间:',
          type: 'time',
          props: 'attendanceStartTime',
          placeholder: '开始日期'
        },
        {
          label: '至',
          type: 'time',
          props: 'attendanceEndTime',
          placeholder: '结束日期'
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getSignData()
    this.getEchartsList()
    // 两个接口：1.echarts表接口，2.查询分页数据表接口
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 150 + 'px'
      console.log(this.height)
    },
    // 获取签到统计echarts表
    getEchartsList() {
      this.$api.getCouponInfo.getEchartsList().then(res => {
        console.log('echarts表', res)
        this.numberList.allMemberNumber = res.allMemberNumber
        this.numberList.averageAttendanceNumber = res.averageAttendanceNumber
        this.numberList.allAttendanceNumber = res.allAttendanceNumber
        this.numberList.thisMonthMemberNumber = res.thisMonthMemberNumber
      })
    },
    // 重置按钮
    resetSearchForm() {
      console.log('重置')
      this.signDataForm = {
        pageIndex: 1,
        pageSize: 20,
        memberName: '', // 手机号或姓名
        attendanceStartTime: '', // 开始时间
        attendanceEndTime: '' // 结束时间
      }
      this.getSignData()
    },
    // 搜索按钮
    searchsearchForm() {
      console.log('搜索')
      this.getSignData()
      this.signDataForm.pageIndex = 1
    },
    // 获取数据列表
    getSignData() {
      this.$api.getCouponInfo.getSignList(this.signDataForm).then(res => {
        console.log('数据列表', res)
        this.signData = res.data
        this.total = res.total
      })
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.signDataForm.pageSize = newPage
      this.getSignData()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.signDataForm.pageIndex = newPage
      this.getSignData()
    }
  },
  mounted() {
    const axisXList = [] // x轴
    const yAxisList = [] // y轴
    this.$api.getCouponInfo.getEchartsList().then(res => {
      console.log('echarts表xxxx', res)
      const barData = res.memberNumberList
      for (let i = 0; i < barData.length; i++) {
        axisXList[i] = barData[i].attendanceTime
        yAxisList[i] = barData[i].memberNumber
      }
      this.axisXList = axisXList
      this.yAxisList = yAxisList
      // -----
      var myChart = echarts.init(document.getElementById('main'))
      myChart.resize() // 自适应
      var drawLine = {
        tooltip: {
          extraCssText: 'box-shadow:1px 1px 10px 0px rgba(0, 48, 187, 0.14)',
          trigger: 'axis',
          // 指示背景颜色
          backgroundColor: '#ffffff',
          // 提示框圆角
          borderRadius: 4,
          color: '#666666',
          textStyle: {
            color: '#666666'
          },
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#757CBB'
            }
          }
        },
        title: {
          text: '近30签到统计',
          // top: 20,
          // left: 110,
          textStyle: {
            fontSize: 14,
            color: '#999999'
          }
        },
        legend: {
          data: ['签到用户数']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        toolbox: {
          feature: {
            // saveAsImage: {}
          }
        },
        // X轴数据
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: this.axisXList
        },
        yAxis: {
          type: 'value'
        },
        series: [
          {
            name: '签到用户数',
            type: 'line',
            stack: '总量',
            smooth: true,
            color: '#757CBB',
            areaStyle: {
              normal: {
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                  {
                    offset: 0,
                    // echarts背景色
                    // color: '#E4E5F2 ' // 0% 处的颜色
                    color: 'rgba(117,124,187,0.5)'
                  },
                  {
                    offset: 1,
                    color: '#FFFFFF' // 100% 处的颜色
                  }
                ]) // 背景渐变色
              }
            },
            data: this.yAxisList // y轴数据
          }
        ]
      }
      myChart.setOption(drawLine)
    })
  }
}
</script>
<style lang="scss" scoped>
.echartClass {
  width: 100%;
  height: 400px;
}
.box {
  display: flex;
  padding-bottom: 20px;
}
.boxOne {
  flex: 1;
}
.boxTwoEng {
  flex: 1;
  font-size: 26px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
}
.boxThree {
  margin-left: 64px;
}
.boxTwoText {
  margin-top: 30px;
  .text1 {
    margin-top: 8px;
  }
}
</style>

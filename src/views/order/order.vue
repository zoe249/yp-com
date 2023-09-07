<!--
 * @FileDescription: 订单管理
 * @Version: 3.0.1
 * @Author: Wangdandi
 * @Date: 2021-08-16
 -->
<template>
  <div>
    <!-- 搜索区域 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searOrderListFormLabel" :formData="searOrderListForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div> </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchOrderList"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchOrderList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 搜索区域 end -->
    <!-- 订单列表数据 begin -->
    <el-table :data="orderList" style="width: 100%;" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="height">
      <el-table-column type="selection" width="50" label="全选"> </el-table-column>
      <el-table-column prop="orderNum" label="订单编号" width="170" align="center"> </el-table-column>
      <el-table-column prop="createAt" label="下单时间" width="160" align="center"> </el-table-column>
      <el-table-column prop="memberCard" label="会员卡号" width="160" align="center"> </el-table-column>
      <el-table-column prop="customerTotalAmount" label="实付金额" align="right">
        <template slot-scope="scope"> ￥{{ Number(scope.row.customerTotalAmount).toFixed(2) }} </template>
      </el-table-column>
      <el-table-column prop="paymentMethod" label="支付方式" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.paymentMethod === '01'">微信支付</span>
        </template>
      </el-table-column>
      <el-table-column prop="integralOfThisOrder" label="获得积分" align="right"> </el-table-column>
      <el-table-column prop="growthOfThisOrder" label="获得成长值" align="right"> </el-table-column>
      <el-table-column prop="orderStatus" label="订单状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.orderStatus === 'Completed'">已完成</span>
          <span v-if="scope.row.orderStatus === 'Refunded'">退款</span>
        </template>
      </el-table-column>
      <el-table-column prop="productName" label="商品名称" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="activityCode" label="活动方案" width="180" align="center"> </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showOrderDialog(scope.row)">{{ $t('lang.viewDetails') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 订单表格数据 end -->
    <!-- 查看详情 begin -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('lang.viewDetails')" :visible.sync="showDialogOrder" width="60%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 基本信息列表数据 -->
      <el-row style="margin-bottom:20px;"
        ><el-col :span="2">
          <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 基本信息</span>
        </el-col></el-row
      >
      <el-table :data="basicList" style="width: 100%;" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column prop="orderNum" label="订单编号" width="170"> </el-table-column>
        <el-table-column prop="createAt" label="下单时间" width="160"> </el-table-column>
        <el-table-column prop="paymentMethod" label="支付方式">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentMethod === '01'">微信支付</span>
          </template>
        </el-table-column>
        <el-table-column prop="paymentCode" label="支付交易号" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="customerTotalAmount" label="实付总额" align="right">
          <template slot-scope="scope"> ￥{{ Number(scope.row.customerTotalAmount).toFixed(2) }} </template>
        </el-table-column>
        <el-table-column prop="useTotalPoint" label="消耗总积分" align="right"> </el-table-column>
        <el-table-column prop="refundedAmount" label="退款金额" align="right"> </el-table-column>
        <el-table-column prop="integralOfThisOrder" label="获得积分" align="right"> </el-table-column>
        <el-table-column prop="growthOfThisOrder" label="获得成长值" align="right"> </el-table-column>
      </el-table>
      <!-- show-overflow-tooltip -->
      <!-- <yp-table :propArr="basicListLabel" height="200" :listInfo="basicList" style="width: 100%"> </yp-table> -->
      <!-- 会员信息列表数据 -->
      <el-row style="margin-bottom:20px;margin-top:20px"
        ><el-col :span="2">
          <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 会员信息</span>
        </el-col></el-row
      >
      <!-- <yp-table :propArr="memberListLabel" height="71" :listInfo="memberList" style="width: 100%"> </yp-table> -->
      <el-table :data="memberList" style="width: 100%;" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column prop="cardNumber" label="会员卡号" align="center"> </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center"> </el-table-column>
        <el-table-column prop="realName" label="姓名" align="center"> </el-table-column>
        <el-table-column prop="cardLevelCode" label="会员等级" align="center">
          <template slot-scope="scope"> {{ scope.row.cardLevelCode }}-{{ scope.row.cardLevelName }} </template>
        </el-table-column>
        <el-table-column prop="registrationDate" label="注册时间" align="center">
          <template slot-scope="scope">
            {{ scope.row.registrationDate | parseTime('{y}-{m}-{d}') }}
          </template>
        </el-table-column>
      </el-table>
      <!-- 商品信息数据列表 -->
      <el-row style="margin-bottom:20px;margin-top:20px"
        ><el-col :span="2">
          <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 商品信息</span>
        </el-col></el-row
      >
      <!-- <yp-table height="71" :propArr="productListLabel" :listInfo="productList" style="width: 100%"> </yp-table> -->
      <el-table :data="productList" style="width: 100%;" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column prop="code" label="商品编码" align="center"> </el-table-column>
        <el-table-column prop="name" label="商品名称" align="center"> </el-table-column>
        <el-table-column prop="salePrice" label="销售价格" align="center"> </el-table-column>
        <el-table-column prop="usePoint" label="消耗积分" align="center"> </el-table-column>
        <el-table-column prop="quantity" label="数量" align="center"> </el-table-column>
        <el-table-column prop="type" label="活动类型" align="center"> </el-table-column>
        <el-table-column prop="activityId" label="活动方案" align="center"> </el-table-column>
      </el-table>
    </el-dialog>
    <!-- 查看详情 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searOrderListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searOrderListForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
// import YpTable from '@/components/table/YpTable.vue'
import { parseTime } from '@/filters/format.js'
export default {
  components: {
    YpSearchForm
    // YpTable
  },
  data() {
    return {
      total: 0,
      // 搜索区域参数
      searOrderListForm: {
        pageIndex: 1,
        pageSize: 20,
        orderNum: '',
        code: '',
        memberCode: '',
        activityCode: '',
        beginTime: '',
        endTime: ''
      },
      activityType: [
        { label: '售券活动', value: '01' },
        { label: '礼品卡', value: '02' },
        { label: '付费会员', value: '03' },
        { label: '后台售卡', value: '04' }
      ],
      // 列表数据
      orderList: [],
      showDialogOrder: false,
      // 查看详情---基本信息数据
      basicList: [],
      // 查看详情---会员信息数据
      memberList: [],
      // 查看详情---商品信息数据
      productList: [],
      // 会员id
      memId: '',
      // 商品id
      activityId: '',
      orderId: ''
    }
  },
  computed: {
    // 头部搜索区域
    searOrderListFormLabel() {
      return [
        {
          label: '订单编号：',
          type: 'input',
          prop: 'orderNum',
          placeholder: '订单编号'
        },
        {
          label: '商品编号：',
          type: 'input',
          prop: 'code',
          placeholder: '商品编号或名称'
        },
        {
          label: '会员卡号：',
          type: 'input',
          prop: 'memberCode',
          placeholder: '会员卡号或手机号'
        },
        {
          label: '活动方案：',
          type: 'input',
          prop: 'activityCode',
          placeholder: '活动方案编码'
        },
        {
          label: '下单时间：',
          type: 'datetimerange',
          props1: 'beginTime',
          props2: 'endTime',
          placeholder1: '选择开始时间',
          placeholder2: '选择结束时间',
          span: 9
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getOrderList() // 订单列表数据
    parseTime()
  },
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  methods: {
    // 搜索
    searchOrderList() {
      this.getOrderList()
      this.searOrderListForm.pageIndex = 1
    },
    // 重置
    resetSearchOrderList() {
      this.searOrderListForm.orderNum = ''
      this.searOrderListForm.code = ''
      this.searOrderListForm.memberCode = ''
      this.searOrderListForm.activityCode = ''
      this.searOrderListForm.beginTime = ''
      this.searOrderListForm.endTime = ''
      this.getOrderList()
    },
    // 样式
    getHeight() {
      this.height = window.innerHeight - 260 + 'px'
      console.log(this.height)
    },
    // 订单列表数据
    getOrderList() {
      console.log('orderorder', this.orderList)
      this.$api.getOrderApi.getOrderList(this.searOrderListForm).then(res => {
        console.log('订单管理', res)
        this.orderList = res.data
        this.total = res.total
      })
    },
    // 查看详情
    async showOrderDialog(row) {
      this.basicList = []
      console.log('每行数据', row)
      await this.$api.getOrderApi.showOrderDialog(row.id).then(res => {
        console.log('查看详情res', res)
        this.basicList.push(res)
        // this.basicList.forEach(item => {
        //   item.customerTotalAmount = item.customerTotalAmount.toFixed(2)
        // })
      })
      this.orderId = row.id
      // 会员id
      this.memId = row.memberId
      // 商品id
      this.activityId = row.activityId
      this.showDialogOrder = true
      this.getMemberList()
      this.getProductList(row)
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searOrderListForm.pageSize = newPage
      this.getOrderList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searOrderListForm.pageIndex = newPage
      this.getOrderList()
    },
    // 查看详情--会员信息列表数据
    getMemberList() {
      console.log('会员id', this.memId)
      this.$api.getOrderApi.getMemberList(this.memId).then(res => {
        console.log('会员信息列表', res)
        this.memberList.push(res)
      })
      this.memberList = []
    },
    getActivityTypeName(type) {
      if (!type) return ''
      const item = this.activityType.filter(v => v.value === type)[0]
      return item.value + ' - ' + item.label
    },
    // 查看详情--商品信息列表数据
    getProductList(row) {
      this.productList = []
      if (this.basicList[0].type === '02') {
        this.basicList.forEach(item => {
          const map = {
            usePoint: item.usePoint,
            quantity: item.quantity,
            code: item.giftCardScheme.productCode,
            name: item.giftCardScheme.productName,
            type: this.getActivityTypeName('02'),
            salePrice: item.giftCardScheme.faceValue,
            activityId: item.giftCardScheme.number
          }
          this.productList.push(map)
        })
      } else if (this.basicList[0].type === '03') {
        this.basicList.forEach(item => {
          const map = {
            usePoint: item.usePoint,
            quantity: item.quantity,
            code: item.paidMemberScheme.productCode,
            name: item.paidMemberScheme.productName,
            type: this.getActivityTypeName('03'),
            salePrice: item.paidMemberScheme.salePrice,
            activityId: item.paidMemberScheme.number
          }
          this.productList.push(map)
        })
      } else if (this.basicList[0].type === '01') {
        // 商品id
        console.log('商品ididid', this.activityId)
        this.$api.getOrderApi.getProductList(this.activityId).then(res => {
          console.log('商品信息列表', res.data)
          // this.productList.push(res.data)
          console.log(this.basicList.quantity)
          this.basicList.forEach(item => {
            console.log('itemitem', item)
            const map = {
              usePoint: item.usePoint,
              quantity: item.quantity,
              code: res.data.code,
              name: res.data.name,
              type: this.getActivityTypeName('01'),
              salePrice: res.data.salePrice,
              activityId: row.activityCode
            }
            this.productList.push(map)
          })
        })
      } else if (this.basicList[0].type === '04') {
        // 2023-03-27 礼品卡新增
        this.$api.getOrderApi.getGiftCardSellById(row.activityId).then(res => {
          this.productList = []
          const map = {
            code: res.data.number,
            name: '礼品卡',
            salePrice: res.data.realAmount,
            usePoint: 0,
            quantity: 1,
            type: this.getActivityTypeName('04'),
            activityId: res.data.number
          }
          this.productList.push(map)
        })
        // console.log(row)
      }
    }
  }
}
</script>
<style></style>

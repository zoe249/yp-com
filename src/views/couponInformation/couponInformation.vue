<!--
 * @FileDescription: 优惠券信息
 * @Version: 3.0.1
 * @Author: Wangdandi
 * @Date: 2021-08-16
 -->
<template>
  <div>
    <!-- 头部搜索 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searCouponListFormLabel" :formData="searCouponListForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchCouponList"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchCouponList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 优惠券信息列表 begin -->
    <!-- <yp-table :propArr="couponListLabel" :height="height" :listInfo="couponList" style="width: 100%"> </yp-table> -->
    <el-table :data="couponList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="height">
      <el-table-column prop="couponNo" label="优惠券码" width="200"> </el-table-column>
      <el-table-column prop="couponTemplateName" label="券名称" align="center" width="130" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="couponTemplateCode" label="券模板" align="center" width="180"> </el-table-column>
      <el-table-column prop="type" label="券类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '01'">{{ scope.row.type }}-金额券</span>
          <span v-if="scope.row.type === '02'">{{ scope.row.type }}-计次券</span>
          <span v-if="scope.row.type === '03'">{{ scope.row.type }}-满减券</span>
          <span v-if="scope.row.type === '04'">{{ scope.row.type }}-折扣券</span>
        </template>
      </el-table-column>
      <el-table-column prop="facevalue" label="券面值" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '01'">{{ scope.row.facevalue }}元</span>
          <span v-if="scope.row.type === '02'">{{ Number(scope.row.facevalue) }}次</span>
          <span v-if="scope.row.type === '03'">{{ scope.row.facevalue }}元</span>
          <span v-if="scope.row.type === '04'">{{ Number(scope.row.facevalue) }}折</span>
        </template>
      </el-table-column>
      <el-table-column prop="couponStatus" label="券状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.couponStatus === '0'">{{ scope.row.couponStatus }}-未领取</span>
          <span v-if="scope.row.couponStatus === '1'">{{ scope.row.couponStatus }}-已领取</span>
          <span v-if="scope.row.couponStatus === '2'">{{ scope.row.couponStatus }}-已使用</span>
          <span v-if="scope.row.couponStatus === '3'">{{ scope.row.couponStatus }}-已失效</span>
        </template>
      </el-table-column>
      <el-table-column prop="" label="有效日期" align="center" width="180">
        <template slot-scope="scope"> {{ scope.row.beginTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}至{{ scope.row.endTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </template>
      </el-table-column>
      <el-table-column prop="saleCouponActivityCode" label="售券活动" align="center" width="180"> </el-table-column>
      <el-table-column prop="cardNumber" label="会员卡号" align="center" width="160"> </el-table-column>
      <el-table-column prop="useTime" label="使用时间" align="center" width="160">
        <template slot-scope="scope">
          {{ scope.row.useTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
      <el-table-column prop="getTime" label="领取时间" align="center" width="160">
        <template slot-scope="scope">
          {{ scope.row.getTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}
        </template>
      </el-table-column>
    </el-table>
    <!-- 优惠券信息列表 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searCouponListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searCouponListForm.pageSize"
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
      total: 0, // 总页数
      // 搜索参数
      searCouponListForm: {
        pageIndex: 1,
        pageSize: 20,
        couponNo: '', // 优惠券码
        couponTemplateName: '', // 券名称
        couponTemplateCode: '', // 券模板
        saleCouponActivityCode: '', // 售券活动
        couponStatus: '', // 券状态
        type: '', // 券类型
        cardNumber: '', // 会员卡号
        beginTime: '', // 有效期开始时间
        endTime: '', // 有效期结束时间
        saleCouponActivityId: '', // 售券活动id
        number: '' // 活动编号
      },
      //   列表数据
      couponList: []
    }
  },
  computed: {
    searCouponListFormLabel() {
      return [
        {
          label: '优惠券码：',
          type: 'input',
          prop: 'couponNo',
          placeholder: '优惠券码'
        },
        {
          label: '券名称：',
          type: 'input',
          prop: 'couponTemplateName',
          placeholder: '券名称'
        },
        {
          label: '券模板：',
          type: 'input',
          prop: 'couponTemplateCode',
          placeholder: '券模板'
        },
        {
          label: '售券活动：',
          type: 'input',
          prop: 'number',
          placeholder: '售券活动'
        },
        {
          label: '券状态：',
          type: 'select',
          prop: 'couponStatus',
          options: [
            { value: '', label: '不限' },
            { value: '0', label: '0-未领取' },
            { value: '1', label: '1-已领取' },
            { value: '2', label: '2-已使用' },
            { value: '3', label: '3-已失效' }
          ]
        },
        {
          label: '券类型：',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限' },
            { value: '01', label: '01-金额券' },
            { value: '02', label: '02-计次券' },
            { value: '03', label: '03-满减券' },
            { value: '04', label: '04-折扣券' }
          ]
        },
        {
          label: '会员卡号：',
          type: 'input',
          prop: 'cardNumber',
          placeholder: '会员卡号'
        },
        {
          label: '券有效期：',
          type: 'datetimerange',
          props1: 'beginTime',
          props2: 'endTime',
          placeholder1: '开始时间',
          placeholder2: '结束时间',
          span: 9
        }
      ]
    }
  },
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getCouponList() // 数据列表
    parseTime()
  },
  methods: {
    // 头部搜索
    searchCouponList() {
      console.log('搜索')
      this.searCouponListForm.pageIndex = 1
      this.getCouponList()
    },
    // 头部重置
    resetSearchCouponList() {
      console.log('重置')
      this.searCouponListForm.pageIndex = 1
      this.searCouponListForm.couponNo = ''
      this.searCouponListForm.couponTemplateName = ''
      this.searCouponListForm.couponTemplateCode = ''
      this.searCouponListForm.number = ''
      this.searCouponListForm.couponStatus = ''
      this.searCouponListForm.type = ''
      this.searCouponListForm.cardNumber = ''
      this.searCouponListForm.beginTime = ''
      this.searCouponListForm.endTime = ''
      this.getCouponList()
    },
    // 样式
    getHeight() {
      this.height = window.innerHeight - 260 + 'px'
      console.log(this.height)
    },
    // 数据列表
    getCouponList() {
      this.$api.getCouponInfo.getCouponInfoList(this.searCouponListForm).then(res => {
        console.log('优惠券信息', res)
        this.couponList = res.data
        this.total = res.total
        this.couponList.forEach(item => {
          if (item.type === '04') {
            item.facevalue = item.facevalue / 10
          }
        })
      })
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searCouponListForm.pageSize = newPage
      this.getCouponList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searCouponListForm.pageIndex = newPage
      this.getCouponList()
    }
  }
}
</script>
<style lang="scss" scoped></style>

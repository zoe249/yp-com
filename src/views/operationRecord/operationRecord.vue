<!--
 * @FileDescription: 券操作记录
 * @Version: 3.0.1
 * @Author: Wangdandi
 * @Date: 2021-08-16
 -->
<template>
  <div>
    <!-- 头部搜索 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searCouponListFormLabel" :formData="searCouponListForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
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
    <!-- 券操作记录 begin -->
    <!-- <yp-table :propArr="couponListLabel" :height="height" :listInfo="couponList" style="width: 100%"> </yp-table> -->
    <el-table :data="couponList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="height">
      <el-table-column prop="couponNo" label="优惠券码" width="200" align="center"> </el-table-column>
      <el-table-column prop="denomination" label="券面值" align="right">
        <template slot-scope="scope">
          <span>{{ scope.row.denomination }}{{ scope.row.uom }}</span>
        </template>
      </el-table-column>
      <el-table-column prop="type" label="操作类型" align="right">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '1'">{{ scope.row.type }}-领取</span>
          <span v-if="scope.row.type === '2'">{{ scope.row.type }}-用券</span>
          <span v-if="scope.row.type === '3'">{{ scope.row.type }}-回冲</span>
          <span v-if="scope.row.type === '4'">{{ scope.row.type }}-过期</span>
          <span v-if="scope.row.type === '5'">{{ scope.row.type }}-转赠</span>
        </template>
      </el-table-column>
      <el-table-column prop="channelsName" label="渠道" align="center"> </el-table-column>
      <el-table-column prop="terminalsName" label="终端" align="center"> </el-table-column>
      <el-table-column prop="orderNumber" label="用券订单编号" align="center"> </el-table-column>
      <el-table-column prop="operator" label="操作者" align="center"> </el-table-column>
      <el-table-column prop="operationAt" label="操作时间" align="center"> </el-table-column>
    </el-table>
    <!-- 券操作记录 end -->
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
export default {
  components: {
    YpSearchForm
    // YpTable
  },
  data() {
    return {
      total: 0,
      // 搜索参数
      searCouponListForm: {
        pageIndex: 1,
        pageSize: 20,
        code: '', // 优惠券码
        type: '', // 操作类型
        orderNumber: '', // 用券订单编号
        startTime: '',
        endTime: ''
      },
      //   列表数据
      couponList: []
    }
  },
  computed: {
    //   头部搜索
    searCouponListFormLabel() {
      return [
        {
          label: '优惠券码：',
          type: 'input',
          prop: 'code',
          placeholder: '优惠券码'
        },
        {
          label: '操作类型：',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限' },
            { value: '1', label: '1-领券' },
            { value: '2', label: '2-用券' }
          ]
        },
        {
          label: '用券订单编号：',
          type: 'input',
          prop: 'orderNumber',
          placeholder: '用券订单编号'
        },
        // 操作时间字段
        {
          label: '操作时间：',
          type: 'datetimerange',
          props1: 'startTime',
          props2: 'endTime',
          placeholder1: '开始时间',
          placeholder2: '结束时间',
          span: 10
        }
      ]
    },
    // 数据列表
    couponListLabel() {
      return [
        {
          label: '操作时间',
          type: 'time',
          props: 'operationAt'
        },
        {
          label: '优惠券码',
          props: 'couponNo'
        },
        {
          label: '券面值',
          type: 'codeName',
          align: 'right',
          render: row => {
            return row.denomination + row.uom
          }
        },
        {
          label: '操作类型',
          props: 'type',
          type: 'codeName',
          render: res => {
            if (res.type === '1') {
              return '1-领券'
            }
            if (res.type === '2') {
              return '2-用券'
            }
            if (res.type === '3') {
              return '3-回冲'
            }
            if (res.type === '4') {
              return '4-过期'
            }
            if (res.type === '5') {
              return '5-转赠'
            }
          }
        },
        {
          label: '渠道',
          props: 'channelsName'
        },
        {
          label: '终端',
          props: 'terminalsName'
        },
        {
          label: '用券订单编号',
          props: 'orderNumber'
        },
        {
          label: '操作者',
          props: 'operator'
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getCouponList() // 数据列表
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
      this.searCouponListForm.code = ''
      this.searCouponListForm.type = ''
      this.searCouponListForm.orderNumber = ''
      this.searCouponListForm.startTime = ''
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
      this.$api.getCouponInfo.getoperationList(this.searCouponListForm).then(res => {
        console.log('券操作记录', res)
        this.couponList = res.data
        this.total = res.total
        this.couponList.forEach(item => {
          console.log('denominationdenomination', item)
          if (item.uom === '折') {
            item.denomination = item.denomination / 10
          }
          if (item.uom === '元') {
            item.denomination = item.denomination.toFixed(2)
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

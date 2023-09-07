<template>
  <div>
    <!-- 储值明细搜索区域 start -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchDataSavingsActivityFormLabel" :formData="searchDataSavingsActivityForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchsearchDataSavingsActivityForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchsearchDataSavingsActivityForm" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 储值明细数据列表 start -->
    <el-table :data="dataSavingsActivityList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
      <el-table-column prop="cardNumber" label="会员卡号" align="center"> </el-table-column>
      <el-table-column prop="nickname" label="昵称" align="center"> </el-table-column>
      <el-table-column prop="gender" label="性别" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '0'">{{ scope.row.gender }}-未知</span>
          <span v-if="scope.row.gender === '1'">{{ scope.row.gender }}-男</span>
          <span v-if="scope.row.gender === '2'">{{ scope.row.gender }}-女</span>
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="手机号" align="center" width="150"> </el-table-column>
      <el-table-column prop="createTime" label="发生时间" align="center" width="180"> </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type === '1'">{{ scope.row.type }}-充值</span>
          <span v-if="scope.row.type === '2'">{{ scope.row.type }}-消费</span>
          <span v-if="scope.row.type === '3'">{{ scope.row.type }}-退款</span>
          <span v-if="scope.row.type === '4'">{{ scope.row.type }}-回冲</span>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="金额" align="center"> </el-table-column>
      <el-table-column prop="givenAmount" label="赠送金额" align="center"> </el-table-column>
      <el-table-column prop="couponTemplateCode" label="赠送优惠券" align="center" width="170"> </el-table-column>
      <el-table-column prop="balance" label="余额" align="center"> </el-table-column>
      <el-table-column prop="organizationName" label="来源组织" align="center"> </el-table-column>
      <el-table-column prop="channelsName" label="来源渠道" align="center"> </el-table-column>
      <el-table-column prop="terminalsName" label="来源终端" align="center"> </el-table-column>
      <el-table-column prop="billNum" label="单据号" align="center"> </el-table-column>
      <el-table-column prop="number" label="充值活动" align="center"> </el-table-column>
      <el-table-column prop="description" label="备注" align="center"> </el-table-column>
    </el-table>
    <!-- 储值明细数据列表 end -->
    <!-- 储值明细分页 start -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="dataSavingsHandleSizeChange"
          @current-change="dataSavingsHandleCurrentChange"
          :current-page="searchDataSavingsActivityForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchDataSavingsActivityForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totals"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 储值明细分页 end -->
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpSearchForm
  },
  data() {
    return {
      dataSavingsActivityList: [],
      totals: 0,
      channelList: [], // 所有渠道列表数据
      // 储值明细搜索参数
      searchDataSavingsActivityForm: {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      // 渠道范围参数
      searchChannelForm: {
        name: '',
        status: '',
        userCode: ''
      }
    }
  },
  computed: {
    // 储值明细搜索
    searchDataSavingsActivityFormLabel() {
      return [
        {
          label: '昵称：',
          type: 'input',
          placeholder: '手机号或昵称',
          prop: 'nickname'
        },
        {
          label: '充值活动：',
          type: 'input',
          placeholder: '充值活动编号',
          prop: 'number'
        },
        {
          label: '类型：',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限制' },
            { value: '1', label: '1-充值' },
            { value: '2', label: '2-消费' },
            { value: '3', label: '3-退款' },
            { value: '4', label: '4-回冲' }
          ]
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsId',
          options: this.channelList
        },
        {
          label: '发生时间：',
          type: 'datetimerange',
          props1: 'beginTime',
          props2: 'endTime',
          placeholder1: this.$t('lang.selectbegintime'),
          placeholder2: this.$t('lang.selectendtime'),
          span: 9
        }
      ]
    }
  },
  created() {
    this.getHeight()
    this.dataSavingsActivity()
    this.getDataSavingsActivityList()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    /**
     * 描述：储值明细数据列表
     */
    getDataSavingsActivityList() {
      this.$api.getActivityApi.getDataSavingsActivityList(this.searchDataSavingsActivityForm).then(res => {
        console.log('储存数据列表', res)
        this.dataSavingsActivityList = res.data
        this.totals = res.total
        // this.dataSavingsActivity()
      })
    },
    dataSavingsActivity() {
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log(res)
        const firstAll = {
          value: '',
          label: '不限制'
        }
        this.channelList.unshift(firstAll)
        res.map(item => {
          this.channelList.push({ value: item.id, label: item.name })
        })
      })
    },
    /**
     * 描述：储值明细重置搜索
     */
    resetSearchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm = {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：查询储值明细
     */
    searchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm.pageIndex = 1
      console.log('搜索', this.searchDataSavingsActivityForm)
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页条数
     */
    dataSavingsHandleSizeChange(newPage) {
      this.searchDataSavingsActivityForm.pageSize = newPage
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页
     */
    dataSavingsHandleCurrentChange(newPage) {
      this.searchDataSavingsActivityForm.pageIndex = newPage
      this.getDataSavingsActivityList()
    }
  }
}
</script>

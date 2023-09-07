<template>
  <div>
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchPointEditLabel" :formData="searchPointEditForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchMember"
          size="mini"
          icon="el-icon-refresh-left">{{ this.$t('lang.reset') }}</el-button>
          <el-button class="search-btn" type="primary" @click="searchPointEdit" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 积分列表数据表格 start -->
    <yp-table :propArr="pointEditListLabel" :listInfo="pointEditList" :height="height"></yp-table>
    <!-- 积分列表数据表格 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handlePointSizeChange"
          @current-change="handlePointCurrentChange"
          :current-page="searchPointEditForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchPointEditForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
export default {
  name: 'pointEdit',
  components: {
    YpSearchForm,
    YpTable
  },
  data() {
    return {
      total: 0,
      height: '400px',
      pointEditList: [],
      searchPointEditForm: {
        pageIndex: 1,
        pageSize: 20,
        cardNumber: '', // 会员卡号
        realName: '', // 姓名
        createTimeFrom: '', // 创建时间起始时间
        createTimeTo: '' // 创建时间结束时间
      }
    }
  },
  computed: {
    // 查询积分表单标签
    searchPointEditLabel() {
      return [
        { label: '会员卡号:', type: 'input', prop: 'cardNumber', placeholder: this.$t('lang.membercarnumber') },
        { label: '姓名:', type: 'input', prop: 'realName', placeholder: this.$t('lang.pointname') },
        {
          label: '创建时间:',
          type: 'datetimerange',
          props1: 'createTimeFrom',
          props2: 'createTimeTo',
          placeholder1: this.$t('lang.selectbegintime'),
          placeholder2: this.$t('lang.selectendtime'),
          span: 9,
          pickerOptionsStart: {
            disabledDate: (time) => {
              const endDateVal = this.searchPointEditForm.createTimeTo
              if (endDateVal) {
                return time.getTime() > new Date(endDateVal).getTime()
              }
            }
          },
          pickerOptionsEnd: {
            disabledDate: time => {
              const beginDateVal = this.searchPointEditForm.createTimeFrom
              if (beginDateVal) {
                return (time.getTime() < new Date(beginDateVal).getTime()
                )
              }
            }
          }
        }
      ]
    },
    // 积分数据列表表格标签
    pointEditListLabel() {
      return [
        {
          label: this.$t('lang.remarks'),
          props: 'description'
        },
        {
          label: this.$t('lang.ordernumber'),
          type: 'index'
        },
        {
          label: '会员卡号',
          props: 'cardNumber'
        },
        {
          label: '会员姓名',
          props: 'realName'
        },
        {
          label: '性别',
          props: 'gender',
          type: 'codeName',
          render: res => {
            if (res.gender === '0') {
              return '未知'
            }
            if (res.gender === '1') {
              return '男'
            }
            if (res.gender === '2') {
              return '女'
            }
          }
        },
        {
          label: '手机号',
          props: 'phone'
        },
        {
          label: '积分调整',
          props: 'point'
        },
        {
          label: '创建时间',
          props: 'createTime',
          type: 'time'
        },
        {
          label: '创建人',
          props: 'createBy'
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getPointList()
  },
  methods: {
    // 获取积分列表
    getPointList() {
      console.log('this.searchPointEditForm', this.searchPointEditForm)
      this.$api.getPointEditApi.getPointEditList(this.searchPointEditForm).then(res => {
        this.pointEditList = res.data
        this.total = res.total
      })
    },
    // 切换积分调整条数
    handlePointSizeChange(newPageSize) {
      this.searchPointEditForm.pageSize = newPageSize
      this.getPointList()
    },
    // 切换积分调整页码
    handlePointCurrentChange(newPage) {
      this.searchPointEditForm.pageIndex = newPage
      this.getPointList()
    },
    resetSearchMember() {
      this.searchPointEditForm.cardNumber = ''
      this.searchPointEditForm.realName = ''
      this.searchPointEditForm.createTimeFrom = ''
      this.searchPointEditForm.createTimeTo = ''
      this.searchPointEditForm.pageSize = 20
      this.searchPointEditForm.pageIndex = 1
      this.getPointList()
    },
    searchPointEdit() {
      this.getPointList()
    },
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    }
  }
}
</script>

<style scoped>

</style>

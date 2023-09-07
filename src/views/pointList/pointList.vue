<!--
 * @Author: liupenghui
 * @Date: 2021-01-12 11:13:24
 * @LastEditTime: 2021-01-29 10:37:52
 * @LastEditors: Please set LastEditors
 * @Description: 积分明细
 * @FilePath: \celesta-web-project\src\views\pointList\pointList.vue
-->
<template>
  <div>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchPointListFormLabel" :formData="searchPointListForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchPointList"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchPointList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <yp-table :propArr="pointListListLabel" :listInfo="pointListList" style="width: 100%" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditPointListDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 主表格内容 end -->

    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchPointListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchPointListForm.pageSize"
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
import YpTable from '@/components/table/YpTable.vue'
export default {
  components: {
    YpSearchForm,
    YpTable
  },
  computed: {
    // 积分明细搜索表头数据
    searchPointListFormLabel() {
      return [
        {
          label: '单据号：',
          type: 'input',
          prop: 'billNum',
          placeholder: '单据号'
        },
        {
          label: '会员卡号：',
          type: 'input',
          prop: 'cardNumber',
          placeholder: '会员卡号'
        },
        {
          label: this.$t('lang.pointname') + '：',
          type: 'input',
          prop: 'info',
          placeholder: this.$t('lang.phoneorname')
        },
        {
          label: this.$t('lang.pointtype') + '：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
        },
        {
          label: this.$t('lang.brithdayorganization') + '：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationList
        },
        {
          label: this.$t('lang.brithdaychannel') + '：',
          type: 'select',
          prop: 'channelsCode',
          options: this.channelList
        },
        {
          label: this.$t('lang.timeofoccurrence') + '：',
          type: 'datetimerange',
          props1: 'beginTime',
          props2: 'endTime',
          placeholder1: this.$t('lang.selectbegintime'),
          placeholder2: this.$t('lang.selectendtime'),
          span: 9
        }
      ]
    },
    // 积分明细表格数据
    pointListListLabel() {
      return [
        {
          label: this.$t('lang.abstract'),
          props: 'description'
        },
        {
          label: this.$t('lang.ordernumber'),
          type: 'index'
        },
        {
          label: this.$t('lang.membercarnumber'),
          props: 'cardNumber',
          width: '160'
        },
        {
          label: this.$t('lang.pointname'),
          props: 'memberName'
        },
        {
          label: this.$t('lang.gender'),
          props: 'gender'
        },
        {
          label: this.$t('lang.pbone'),
          props: 'phone',
          width: '160'
        },
        {
          label: this.$t('lang.timeofoccurrence'),
          props: 'createTime',
          type: 'time',
          width: '160'
        },
        {
          label: this.$t('lang.pointtype'),
          props: 'pointTypeName'
        },
        {
          label: this.$t('lang.integraltypes'),
          props: 'species',
          type: 'status',
          render: row => {
            if (row.species === '01') {
              return this.$t('lang.normalintegral')
            } else if (row.species === '02') {
              return this.$t('lang.bonuspoints')
            } else if (row.species === '03') {
              return this.$t('lang.pointsNoDiffer')
            }
          }
        },
        {
          label: this.$t('lang.pointchange'),
          props: 'pointBefore',
          type: 'right',
          width: '170'
        },
        {
          label: this.$t('lang.pointadd'),
          props: 'pointAdd',
          type: 'right',
          width: '160'
        },
        {
          label: this.$t('lang.pointsubtract'),
          props: 'pointSubtract',
          type: 'right',
          width: '160'
        },
        {
          label: this.$t('lang.pointchanges'),
          props: 'pointAfter',
          type: 'right',
          width: '160'
        },
        {
          label: this.$t('lang.brithdayorganization'),
          props: 'organizationName',
          width: '160'
        },
        {
          label: this.$t('lang.brithdaychannel'),
          props: 'channelsName',
          width: '160'
        },
        {
          label: this.$t('lang.brithdayterminal'),
          props: 'terminalsName',
          width: '160'
        },
        {
          label: this.$t('lang.purpose'),
          props: 'application',
          width: '160'
        },
        {
          label: this.$t('lang.event'),
          props: 'event',
          width: '160'
        },
        {
          label: this.$t('lang.documentnumber'),
          props: 'billNum',
          width: '160'
        }
      ]
    }
  },
  data() {
    return {
      total: 1, // 数据总条数
      pointTypeList: [], // 获取积分类型的下拉表单数据
      organizationList: [], // 获取来源组织下拉表单数据
      channelList: [], // 获取来源渠道下拉表单数据
      // 搜索表头表单数据
      searchPointListForm: {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: '',
        memberId: '',
        pageSize: 20,
        pageIndex: 1,
        billNum: '',
        cardNumber: ''
      },

      // 用来接受表格数据
      pointListList: []
    }
  },
  created() {
    this.getPointListList() // 获取后端数据
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getPointTypeList() // 获取积分类型
    this.getOrganizationList() // 获取来源组织
    this.getChannelList() // 获取来源渠道
  },
  methods: {
    // 获取积分类型
    getPointTypeList() {
      const obj = {}
      obj.species = ''
      obj.info = ''
      obj.status = ''
      obj.pageIndex = 1
      obj.pageSize = 999
      this.pointTypeList = []
      this.$api.getPointTypeApi.getPointTypeList(obj).then(res => {
        res.data.map(item => {
          this.pointTypeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取来源组织
    getOrganizationList() {
      console.log('getChannelList')
      this.organizationList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getTreeData(res)
      })
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        this.organizationList.push({ value: data[i].code, label: data[i].name })
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = undefined
        } else {
          // organizations若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].organizations)
        }
      }
      return data
    },
    // 获取来源渠道
    getChannelList() {
      this.channelList = []
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log(res)
        res.map(item => {
          this.channelList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 样式
    getHeight() {
      this.height = window.innerHeight - 260 + 'px'
      console.log(this.height)
    },
    // 从后端获取积分明细表格数据
    getPointListList() {
      this.$api.getPointListApi.getPointListList(this.searchPointListForm).then(res => {
        this.pointListList = res.data
        this.total = res.total
      })
    },
    // 编辑积分明细
    showEditPointListDialog() {
      console.log('showEditPointListDialog')
    },
    // 重置积分明细表头数据
    resetSearchPointList() {
      console.log('resetSearchPointList')
      this.searchPointListForm = {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        cardNumber: '',
        billNum: ''
      }
      this.getPointListList()
    },
    // 搜索积分明细数据
    searchPointList() {
      console.log('searchPointList')
      this.getPointListList()
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchPointListForm.pageSize = newPage
      this.getPointListList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchPointListForm.pageIndex = newPage
      this.getPointListList()
    }
  }
}
</script>
<style scoped></style>

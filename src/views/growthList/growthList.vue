<!--
 * @Author: 谯坤
 * @Date: 2021-06-21 10:30:24
 * @LastEditTime: 2021-06-21 10:30:24
 * @LastEditors: Please set LastEditors
 * @Description: 成长值明细
-->
<template>
  <div>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchGrowthListFormLabel" :formData="searchGrowthListForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchGrowthList"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchGrowthList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <yp-table :propArr="growthListListLabel" :listInfo="growthListList" style="width: 100%" :height="height">
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
          :current-page="searchGrowthListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchGrowthListForm.pageSize"
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
    // 成长值明细搜索表头数据
    searchGrowthListFormLabel() {
      return [
        {
          label: '姓名：',
          type: 'input',
          prop: 'info',
          placeholder: this.$t('lang.phoneorname')
        },
        {
          label: '组织范围：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationList
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsCode',
          options: this.channelList
        },
        {
          label: '开始时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: this.$t('lang.selectbegintime')
        },
        {
          label: '结束时间：',
          type: 'time',
          props: 'endTime',
          placeholder: this.$t('lang.selectendtime')
        }
      ]
    },
    // 成长值明细表格数据
    growthListListLabel() {
      return [
        {
          label: '摘要',
          props: 'description'
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '会员卡号',
          props: 'cardNumber',
          width: '160'
        },
        {
          label: '会员等级',
          props: 'levelName'
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
          props: 'phone',
          width: '160'
        },
        {
          label: '发生时间',
          props: 'createTime',
          type: 'time',
          width: '160'
        },

        {
          label: '变更前成长值',
          props: 'growthBefore',
          type: 'right',
          width: '170'
        },
        {
          label: '成长值增加',
          props: 'growthAdd',
          type: 'right',
          width: '160'
        },
        {
          label: '成长值减少',
          props: 'growthSubtract',
          type: 'right',
          width: '160'
        },
        {
          label: '变更后成长值',
          props: 'growthAfter',
          type: 'right',
          width: '160'
        },
        {
          label: '来源组织',
          props: 'organizationName',
          width: '160'
        },
        {
          label: '来源渠道',
          props: 'channelsName',
          width: '160'
        },
        {
          label: '来源终端',
          props: 'terminalsName',
          width: '160'
        },
        {
          label: '事件',
          props: 'event',
          width: '160'
        },
        {
          label: '单据号',
          props: 'billNum',
          width: '160'
        }
      ]
    }
  },
  data() {
    return {
      total: 1, // 数据总条数
      organizationList: [], // 获取来源组织下拉表单数据
      channelList: [], // 获取来源渠道下拉表单数据
      // 搜索表头表单数据
      searchGrowthListForm: {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        info: '',
        memberId: '',
        pageSize: 20,
        pageIndex: 1
      },

      // 用来接受表格数据
      growthListList: []
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getOrganizationList() // 获取来源组织
    this.getChannelList() // 获取来源渠道
    this.getGrowthListList() // 获取后端数据
  },
  // mounted() {
  //   this.growthListList.push({
  //     id: '1',
  //     memberId: '213456',
  //     cardNumber: '45644',
  //     level: '01',
  //     levelName: '普通会员',
  //     realName: '真实姓名',
  //     gender: '0',
  //     phone: '17802925394',
  //     organizationCode: '01',
  //     organizationName: '来源组织名称',
  //     channelsCode: '02',
  //     channelsName: '来源渠道名称',
  //     terminalsCode: '03',
  //     terminalsName: '来源终端名称',
  //     billNum: '20210621YP00001',
  //     event: '购买商品',
  //     description: '摘要',
  //     growthSubtract: 100,
  //     growthAdd: 20,
  //     growthBefore: 100,
  //     growthAfter: 120,
  //     createTime: '2021-06-21 10:53:20'
  //   })
  // },
  methods: {
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
    // 从后端获取成长值明细表格数据
    getGrowthListList() {
      this.$api.getGrowthListApi.getGrowthListList(this.searchGrowthListForm).then(res => {
        this.growthListList = res.data
        this.total = res.total
      })
    },

    // 重置积分明细表头数据
    resetSearchGrowthList() {
      this.searchGrowthListForm.beginTime = ''
      this.searchGrowthListForm.endTime = ''
      this.searchGrowthListForm.channelsCode = ''
      this.searchGrowthListForm.organizationCode = ''
      this.searchGrowthListForm.pointTypeCode = ''
      this.searchGrowthListForm.info = ''
      this.searchGrowthListForm.pageIndex = 1
      this.searchGrowthListForm.memberId = ''

      this.getGrowthListList()
    },
    // 搜索积分明细数据
    searchGrowthList() {
      this.searchGrowthListForm.pageIndex = 1
      this.getGrowthListList()
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchGrowthListForm.pageSize = newPage
      this.getGrowthListList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchGrowthListForm.pageIndex = newPage
      this.getGrowthListList()
    }
  }
}
</script>
<style scoped></style>

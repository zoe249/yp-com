<template>
  <div>
    <div class="search-form-box-wrapper">
      <el-form :model="searchPointListForm" label-width="auto" label-position="left">
        <el-row>
          <el-col :span="7" v-for="(item, index) in showSearchList" :key="index">
            <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
              <el-input v-model.trim="searchPointListForm[item.prop]" style="width:auto" placeholder="手机号或者姓名" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select v-model="searchPointListForm[item.prop]" filterable style="width:auto" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" clearable>
                <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'time'" :label="item.label" :prop="item.prop">
              <el-date-picker style="width:auto" value-format="yyyy-MM-dd HH-mm-ss" v-model="searchPointListForm[item.props]" type="datetime" :placeholder="item.placeholder"> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-button size="mini" style="marginTop:5px;marginLeft:20px;" v-show="searchPointListFormLabel.length > 3" @click="changeIsBrandFold"
            ><span>{{ isBrandFold ? '更多查询' : '收起查询' }}</span
            ><i :class="isBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
          ></el-button>
        </el-row>
      </el-form>
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
    <el-table :data="pointListList" stripe border row-key="id" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-row v-for="(item, index) in pointListListLabel" :key="index">
        <el-table-column v-if="item.type === 'tag'" :prop="item.props" :label="item.label" align="center">
          <template slot-scope="scope">
            <el-tag effect="plain" :type="item.renderStyle(scope.row)">{{ item.render(scope.row) }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type === 'checkedAll'" width="50" align="center" :label="item.label">
          <template slot-scope="scope">
            <el-checkbox v-model="scope.row[item.props]" @change="selectMemberTagCheck(scope.row, $event)" :disabled="scope.row.level === '3' ? false : true"></el-checkbox>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type === 'switch'" :prop="item.props" :label="item.label" align="center">
          <template slot-scope="scope">
            <el-switch v-model="scope.row[item.props]" :disabled="item.disabled ? true : false"> </el-switch>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type === 'time'" :prop="item.props" :label="item.label" align="center" :width="item.width">
          <template slot-scope="scope"> {{ scope.row[item.props] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </template>
        </el-table-column>
        <el-table-column v-else-if="item.type === 'codeName'" :prop="item.props" :label="item.label" align="center">
          <template slot-scope="scope">
            {{ item.render(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.type === 'operation'" v-show="false" width="70px" type="index" align="center"></el-table-column>
        <el-table-column v-else-if="item.type === 'index'" width="70px" type="index" align="center" :label="item.label"></el-table-column>
        <!-- 显示默认值 -->
        <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
      </el-row>
    </el-table>
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handlePointListSizeChange"
          @current-change="handlePointListCurrentChange"
          :current-page="searchPointListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchPointListForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pointListTotal"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { parseTime } from '@/filters/format.js'
export default {
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  /*
   * @params id:会员id
   */
  props: {
    id: {
      type: String,
      default: ''
    },
    viewDetailsPhone: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      // 控制会员账户弹窗 add by qiaokun 2021/01/25
      // 搜索积分明细表头表单数据
      searchPointListForm: {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: this.viewDetailsPhone,
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        billNum: '',
        cardNumber: ''
      },
      pointTypeList: [], // 获取积分类型的下拉表单数据
      organizationAndPointList: [], // 获取来源组织下拉表单数据
      channelAndPointList: [], // 获取来源渠道下拉表单数据
      isBrandFold: true, // 搜索折叠
      pointListList: [], // 积分明细表数据
      pointListTotal: 0
      // add by qiaokun 2021/01/25
    }
  },
  computed: {
    // 积分明细搜索表头数据  add by qiaokun 2021/01/25
    // 积分明细表格数据
    pointListListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '会员卡号',
          props: 'cardNumber'
        },
        {
          label: '姓名',
          props: 'memberName'
        },
        {
          label: '性别',
          props: 'gender'
        },
        {
          label: '手机号',
          props: 'phone'
        },
        {
          label: '发生时间',
          props: 'createTime',
          type: 'time',
          width: '200'
        },
        {
          label: '积分类型',
          props: 'pointTypeName'
        },

        {
          label: '积分种类',
          props: 'species',
          type: 'codeName',
          render: row => {
            if (row.species === '01') {
              return '正常积分'
            } else if (row.species === '02') {
              return '赠送积分'
            }
          }
        },
        {
          label: '变动前积分',
          props: 'pointBefore',
          position: 'right'
        },
        {
          label: '积分增加',
          props: 'pointAdd',
          position: 'right'
        },
        {
          label: '积分减少',
          props: 'pointSubtract',
          position: 'right'
        },
        {
          label: '变更后积分',
          props: 'pointAfter',
          position: 'right'
        },
        {
          label: '来源组织',
          props: 'organizationName'
        },
        {
          label: '来源渠道',
          props: 'channelsName'
        },
        {
          label: '来源终端',
          props: 'terminalsName'
        },
        {
          label: '用途',
          props: 'application'
        },
        {
          label: '事件',
          props: 'event'
        },
        {
          label: '单据号',
          props: 'billNum'
        },
        {
          label: '摘要',
          props: 'description'
        }
      ]
    },
    // 折叠写法
    showSearchList: {
      get: function() {
        if (this.isBrandFold) {
          if (this.searchPointListFormLabel.length < 4) {
            return this.searchPointListFormLabel
          }
          const newArr = []
          for (var i = 0; i < 3; i++) {
            const item = this.searchPointListFormLabel[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.searchPointListFormLabel
      },
      set: function(val) {
        this.showSearchList = val
      }
    },
    searchPointListFormLabel() {
      return [
        {
          label: '姓名：',
          type: 'input',
          prop: 'info',
          placeholder: '手机号或姓名'
        },
        {
          label: '积分类型：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
        },
        {
          label: '来源组织：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationAndPointList
        },
        {
          label: '来源渠道：',
          type: 'select',
          prop: 'channelsCode',
          options: this.channelAndPointList
        },
        {
          label: '发生时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: '请选择开始时间'
        },
        {
          label: '发生时间：',
          type: 'time',
          props: 'endTime',
          placeholder: '请选择结束时间'
        }
      ]
    } // add by qiaokun 2021/01/25 end
  },
  created() {
    if (this.id) {
      console.log('adskfjaldsfjlakdj')
      this.searchPointListForm.memberId = this.id
      this.getPointListList()
      this.getPointTypeList()
      this.getOrganizationList()
      this.getChannelList()
      this.getPointListList()
    }
  },
  methods: {
    // add by qiaokun 2021/01/25
    // 积分明细查询重置
    resetSearchPointList() {
      this.searchPointListForm.beginTime = ''
      this.searchPointListForm.endTime = ''
      this.searchPointListForm.channelsCode = ''
      this.searchPointListForm.pointTypeCode = ''
      this.searchPointListForm.organizationCode = ''
      this.searchPointListForm.info = this.viewDetailsPhone
      this.searchPointListForm.pageSize = 20
      this.searchPointListForm.pageIndex = 1
      this.searchPointListForm.memberId = this.id
      this.getPointListList()
    },
    searchPointList() {
      console.log(this.searchPointListForm)
      this.searchPointListForm.info = ''
      this.searchPointListForm.memberId = ''
      this.searchPointListForm.pageIndex = 1
      this.getPointListList()
    },
    // 切换积分明细条数
    handlePointListSizeChange(newPageSize) {
      this.searchPointListForm.pageSize = newPageSize
      this.getPointListList()
    },
    // 切换积分明细页码
    handlePointListCurrentChange(newPage) {
      this.searchPointListForm.pageIndex = newPage
      this.getPointListList()
    },
    // 改变查询折叠按钮
    changeIsBrandFold() {
      this.isBrandFold = !this.isBrandFold
    },
    // 查看会员账户详情
    viewMemberAccountDetails(row) {
      console.log(row)
      this.searchPointListForm.memberId = row.memberId
      this.getPointTypeList()
      this.getOrganizationList()
      this.getChannelList()
      this.getPointListList()
      this.memberAccountDialog = true
      // this.$message.info('积分域开发进行中')
    },
    // 从后端获取积分明细表格数据
    getPointListList() {
      this.$api.getPointListApi.getPointListList(this.searchPointListForm).then(res => {
        console.log('000000000000000000000000000000000000')
        console.log(res)
        this.pointListList = res.data
        this.pointListTotal = res.total
      })
    },
    // 关闭会员账户详情
    // closeMemberAccountDialog() {
    //   this.searchPointListForm.beginTime = ''
    //   this.searchPointListForm.endTime = ''
    //   this.searchPointListForm.channelsId = ''
    //   this.searchPointListForm.pointTypeId = ''
    //   this.searchPointListForm.organizationId = ''
    //   this.searchPointListForm.info = ''
    //   this.searchPointListForm.pageSize = 20
    //   this.searchPointListForm.pageIndex = 1
    //   this.searchPointListForm.memberId = ''
    // },
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
      this.organizationAndPointList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getTreeData(res)
      })
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        this.organizationAndPointList.push({ value: data[i].code, label: data[i].name })
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
      this.channelAndPointList = []
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log(res)
        res.map(item => {
          this.channelAndPointList.push({ value: item.code, label: item.name })
        })
      })
    }
    // add by qiaokun 2021/01/25  end
  }
}
</script>

<style lang="scss" scoped>
.search-form-box-wrapper {
  // height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
</style>

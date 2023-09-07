<!--
 * @FileDescription: 会员打标签
 * @Author: qiaokun
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-29 10:27:47
 -->
<template>
  <div class="form-div">
    <!-- 备选条件区域 -->
    <el-row>
      <el-col
        ><span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '18px' }">| </span
        ><span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> 备选条件</span></el-col
      >
    </el-row>
    <el-row class="pre-select-wrapper">
      <el-col :span="2">会员属性:</el-col>
      <el-col :span="12">
        <el-row>
          <el-col v-for="(item, index) in showMemberAttibutesList" :key="index" :span="4">
            <el-tag @click="selectMemberAttibute(item)" style="margin-bottom:10px;">{{ item.itemCnname }}</el-tag>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2"
        ><el-button type="primary" size="mini" @click="changeFoldState"
          >{{ AttibutesBrandFold ? '展开' : '收起' }} <i :class="AttibutesBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
        ></el-button>
      </el-col>
    </el-row>
    <el-row class="pre-select-wrapper">
      <el-col :span="2">会员标签:</el-col>
      <el-col :span="12">
        <el-row>
          <el-col v-for="(item, index) in showMemberTagLevelTwoListList" :key="index" :span="4">
            <el-tag type="success" style="margin-bottom:10px;" @click="selectMemberTag(item)">{{ item.name }}</el-tag>
          </el-col>
        </el-row>
      </el-col>
      <el-col :span="2"
        ><el-button type="primary" size="mini" @click="changeTagFoldState">{{ TagBrandFold ? '展开' : '收起' }} <i :class="TagBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i></el-button
      ></el-col>
    </el-row>
    <el-divider></el-divider>
    <!-- 已选条件区域 -->
    <el-row>
      <el-col
        ><span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '18px' }">| </span
        ><span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> 已选条件</span></el-col
      >
    </el-row>
    <div v-for="(item, index) in selectMemberAttibuteList" class="select-condition-wrapper" :key="index">
      <el-row class="select-condition" v-if="item.type === 'enum'" :gutter="25" align="middle" type="flex">
        <el-col :span="2">
          <el-tag closable @close="handleClose(item, 'attibute')"> {{ item.itemCnname }}</el-tag>
        </el-col>
        <el-col :span="2">
          <el-radio v-model="item.statusValue" :label="true">有效</el-radio>
        </el-col>
        <el-col :span="2">
          <el-radio v-model="item.statusValue" :label="false">无效</el-radio>
        </el-col>
      </el-row>
      <el-row class="select-condition" v-if="item.type === 'number'" align="middle" type="flex" :gutter="25">
        <el-col :span="2">
          <el-tag closable @close="handleClose(item, 'attibute')"> {{ item.itemCnname }}</el-tag>
        </el-col>
        <el-col :span="3">
          <el-select v-model="item.judgingValue">
            <el-option v-for="(selectItem, index) in item.judgingList" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.inputValue"></el-input>
        </el-col>
      </el-row>
      <el-row class="select-condition" v-if="item.type === 'string'" align="middle" type="flex" :gutter="25">
        <el-col :span="2">
          <el-tag closable @close="handleClose(item, 'attibute')"> {{ item.itemCnname }}</el-tag>
        </el-col>
        <el-col :span="3">
          <el-select v-model="item.judgingValue">
            <el-option v-for="(selectItem, index) in item.judgingList" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
        </el-col>
        <el-col :span="4">
          <el-input v-model="item.inputValue"></el-input>
        </el-col>
      </el-row>
      <el-row class="select-condition" v-if="item.type === 'date'" :gutter="25" align="middle" type="flex">
        <el-col :span="2.5">
          <el-tag closable @close="handleClose(item, 'attibute')"> {{ item.itemCnname }}</el-tag>
        </el-col>
        <el-col :span="4">
          <el-date-picker v-model="item[item.itemName + 'From']" style="width:auto" type="date" placeholder="选择开始日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-col>
        <el-col :span="1">至</el-col>
        <el-col :span="4">
          <el-date-picker v-model="item[item.itemName + 'To']" style="width:auto" type="date" placeholder="选择结束日期" format="yyyy-MM-dd" value-format="yyyy-MM-dd"> </el-date-picker>
        </el-col>
      </el-row>
      <el-row class="select-condition" v-if="item.type === 'multienum'" :gutter="25" type="flex" align="middle">
        <el-col :span="2">
          <el-tag closable @close="handleClose(item, 'attibute')"> {{ item.itemCnname }}</el-tag>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="item.checkBoxValue">
            <el-checkbox class="checkbox-wrapper" v-for="checkItem in item.checkBoxList" :label="checkItem.code" :key="checkItem.code">{{ checkItem.name }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
      <el-row class="select-condition" v-if="item.type === 'memberTags'" :gutter="25" type="flex" align="middle">
        <el-col :span="2">
          <el-tag closable @close="handleClose(item, 'memberTag')"> {{ item.name }}</el-tag>
        </el-col>
        <el-col :span="21">
          <el-checkbox-group v-model="item.checkBoxValue">
            <el-checkbox class="checkbox-wrapper" v-for="checkItem in item.checkBoxList" :label="checkItem.id" :key="checkItem.id">{{ checkItem.name }}</el-checkbox>
          </el-checkbox-group>
        </el-col>
      </el-row>
    </div>
    <!-- 操作按钮区域 -->
    <el-row>
      <el-col :offset="20" class="opt-btn">
        <!-- <el-button @click="btn">点击</el-button> -->
        <el-button type="primary" size="mini" @click="searchMember">1-筛选会员</el-button>
        <el-button type="primary" size="mini" :disabled="isSelectMemberTagBtn" @click="showSelectMemberTagDialog">2-选择标签</el-button>
      </el-col>
    </el-row>
    <!-- 操作选择按钮 是否本页全选 或者 选择全部按钮 -->
    <el-alert show-icon title="提示:表格中'全选'表示'本页全选'，底部'选择全部'表示'选择所有'！" type="info"> </el-alert>
    <el-table :data="currentPageMemberList" stripe border ref="multipleTable" :row-key="getRowKeys" @selection-change="selRow" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column type="selection" prop="id" :reserve-selection="true" align="center" width="100"> </el-table-column>
      <el-table-column label="会员卡号" prop="cardNumber" align="center"> </el-table-column>
      <el-table-column label="会员姓名" prop="realName" align="center"> </el-table-column>
      <el-table-column label="性别" prop="gender" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.gender === '0'">未知</span>
          <span v-if="scope.row.gender === '1'">男</span>
          <span v-if="scope.row.gender === '2'">女</span>
        </template>
      </el-table-column>
      <el-table-column label="手机号" prop="phone" align="center"> </el-table-column>
      <el-table-column label="会员等级" prop="cardLevel" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.cardLevel === '01'">01-普通会员</span>
          <span v-if="scope.row.cardLevel === '02'">02-白金会员</span>
          <span v-if="scope.row.cardLevel === '03'">03-白银会员</span>
        </template>
      </el-table-column>
      <el-table-column label="有效状态" prop="status" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" disabled></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="注册日期" prop="registrationDate" align="center">
        <template slot-scope="scope">
          {{ scope.row.registrationDate | parseTime('{y}-{m}-{d}') }}
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showMemberDetailsDialog(scope.row)">{{ $t('lang.viewDetails') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <el-checkbox class="check-all-box" :indeterminate="isIndeterminate" v-model="checkAll" @change="selAll()">选择全部</el-checkbox>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchSelectMemberForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchSelectMemberForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->

    <!-- 选择标签对话框 begin -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      title="选择会员标签"
      :visible.sync="selectMemberTagDialog"
      width="55%"
      :close-on-click-modal="false"
      @close="closeMemberTagDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '选择会员标签' }}
        </div>
      </template>
      <el-main style="height:500px;" class="scoll">
        <!-- 会员标签对话框搜索区域 start -->
        <div class="search-form-box-wrapper">
          <el-form :model="searchSelectMemberTagForm" label-width="80px" label-position="left" class="search-form-wrapper">
            <div class="form-content" style="display:flex;">
              <div v-for="(item, index) in searchSelectMemberTagFormLabel" :key="index">
                <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                  <el-input v-model.trim="searchSelectMemberTagForm[item.prop]" placeholder="输入标签名称" clearable></el-input>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchMemberTag"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchMemberTag" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
        <el-table :data="selectMemberTagList" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
          <el-row v-for="(item, index) in selectMemberTagListLabel" :key="index">
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
            <!-- 显示默认值 -->
            <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
          </el-row>
        </el-table>
        <!-- 选择标签对话框中的表格 end -->
      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectMemberTagDialog = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirmMemberAndTag" :disabled="hasSelectMemberTag">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>

    <!-- 查看会员详情弹出框 start -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="$t('lang.viewDetails')"
      :visible.sync="memberDetailsDialogVisible"
      :lock-scroll="false"
      v-if="memberDetailsDialogVisible"
      :append-to-body="true"
      width="80%"
      @close="closeMemberDetailsDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.viewDetails') }}
        </div>
      </template>
      <member-details :id="currentMemberId"></member-details>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="memberDetailsDialogVisible = false">关闭</el-button>
      </span>
    </el-dialog>
    <!-- 查看会员详情弹出框 end -->
  </div>
</template>

<script>
// 导入表格组件
import memberDetails from '@/components/memberDetails/memberDetails.vue'
import { parseTime } from '@/filters/format.js'
import axios from 'axios'
import { config } from '@/api/config.js'
export default {
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  components: {
    memberDetails
  },
  data() {
    return {
      // 全选功能代码开始
      checkAll: false,
      selectObjList: [], // 选中的列表对象
      selectIndexList: [], // 选中的索引值
      isIndeterminate: false,
      currentPageMemberList: [], // 当前页码会员表格数据
      allPageMemberList: [], // 获取所有页码会员数据
      // 全选功能代码结束
      checkedAll: false, // 是否为全选
      searchSelectMemberTagForm: {
        pageIndex: 1,
        pageSize: 999,
        name: '',
        level: '',
        memberId: '',
        handmade: true
      }, // 查询会员标签列表表单
      selectMemberTagList: [], // 选择会员标签table列表数据
      getTreeList: [], // 选择会员标签列表处理数据
      selectMemberTagDialog: false, // 选择会员弹出框是否显示或者隐藏
      selectMemberTagIds: [], // 选择会员标签id集合
      selectMemberIds: [], // 单选，或者本页全选 或者选择全部的会员id集合
      selectMemberList: [], // 筛选过滤会员表格数据
      total: 0, // 筛选过滤会员表格分页总条数
      searchSelectMemberForm: {
        pageIndex: 1,
        pageSize: 20
      }, // 筛选过滤会员表格分页
      // selectMemberTagList: [], // 已经选择的会员三级标签的列表
      selectMemberAttibuteList: [], // 已经选择会员属性或者已经选择的三级标签列表
      memberAttibutesList: [], // 会员属性列表
      memberTagLevelTwoList: [], // 会员标签列表
      AttibutesBrandFold: true, // 会员属性收起与展开
      TagBrandFold: true, // 会员标签收起与展开
      judgingStringList: [], // 字符串判断条件列表
      judgingNumberList: [], // 数字判断条件列表
      memberDetailsDialogVisible: false // 会员详情弹出框显示或者隐藏
    }
  },
  computed: {
    // 判断是否选择了会员标签
    hasSelectMemberTag() {
      if (this.selectMemberTagIds.length > 0) {
        return false
      } else {
        return true
      }
    },
    // 判断选择标签是否可用
    isSelectMemberTagBtn() {
      if (this.selectIndexList.length > 0) {
        return false
      } else {
        return true
      }
    },
    // 判断本页全选还是非全选按钮
    isDisabled() {
      const isAll = this.selectMemberList.length
      console.log(isAll)
      if (isAll <= 0) {
        return true
      } else {
        return false
      }
    },
    // 本页全选按钮 或者 选择全部按钮是否隐藏或者显示
    selectBtnDisabled() {
      if (this.selectMemberList.length > 0) {
        return true
      } else {
        return false
      }
    },
    searchSelectMemberTagFormLabel() {
      return [{ label: '标签名称:', prop: 'name', type: 'input' }]
    },
    // 选择会员标签表格标题
    selectMemberTagListLabel() {
      return [
        { label: '标签描述', props: 'description' },
        { label: '选择', props: 'checked', type: 'checkedAll' },
        { label: '标签名称', props: 'name' },
        {
          label: '级别',
          props: 'level',
          type: 'tag',
          render: res => {
            if (res.level === '1') {
              return '一级'
            } else if (res.level === '2') {
              return '二级'
            } else {
              return '三级'
            }
          },
          renderStyle: res => {
            if (res.level === '1') {
              return 'success'
            } else if (res.level === '2') {
              return ''
            } else {
              return 'danger'
            }
          }
        },
        { label: '手工标签', props: 'handmade', type: 'switch', disabled: 'true' }
      ]
    },
    // 选择会员表格标题
    selectMemberListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        { type: 'selection', props: 'id' },
        { label: '会员卡号', props: 'cardNumber' },
        { label: '会员姓名', props: 'realName' },
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
          label: '会员等级',
          props: 'cardLevel',
          type: 'codeName',
          render: res => {
            if (res.cardLevel === '01') {
              return res.cardLevel + '-' + '普通会员'
            }
            if (res.cardLevel === '02') {
              return res.cardLevel + '-' + '白金会员'
            }
            if (res.cardLevel === '03') {
              return res.cardLevel + '-' + '白银会员'
            }
          }
        },
        {
          label: '有效状态',
          props: 'status',
          type: 'switch',
          disabled: 'true'
        },
        {
          label: '注册日期',
          props: 'registrationDate',
          type: 'date'
        }
      ]
    },
    // 会员属性列表（展开折叠)
    showMemberAttibutesList: {
      get: function() {
        if (this.AttibutesBrandFold) {
          if (this.memberAttibutesList.length < 7) {
            return this.memberAttibutesList
          }
          const newArr = []
          for (var i = 0; i < 6; i++) {
            const item = this.memberAttibutesList[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.memberAttibutesList
      },
      set: function(val) {
        this.showMemberAttibutesList = val
      }
    },
    // 会员二级标签列表(展开与折叠)
    showMemberTagLevelTwoListList: {
      get: function() {
        if (this.TagBrandFold) {
          if (this.memberTagLevelTwoList.length < 7) {
            return this.memberTagLevelTwoList
          }
          const newArr = []
          for (var i = 0; i < 6; i++) {
            const item = this.memberTagLevelTwoList[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.memberTagLevelTwoList
      },
      set: function(val) {
        this.showMemberTagLevelTwoListList = val
      }
    },
    // 会员详情弹出框属性
    // 会员账户列表表格标签
    memberAccountListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        { label: '账户类型', props: 'type', position: 'center' },
        { label: '总额', props: 'total' },
        { label: '余额', props: 'balance' },
        { label: '赠送额', props: 'gift' },
        { label: '扣减额', props: 'deduction' }
      ]
    }
  },
  created() {
    // 获取会员属性列表
    this.getMemberAttibutesList()
    // 获取会员标签二级列表
    this.getMemberTagLevelTwoList()
    // 获取条件列表
    this.getJudgingList()
    // 获取当前平台信息，处理注册组织、注册渠道、注册终端
  },
  methods: {
    // 关闭已选条件
    handleClose(val, type) {
      if (type === 'memberTag') {
        const i = this.selectMemberAttibuteList.findIndex(item => {
          return item.id === val.id
        })
        this.selectMemberAttibuteList.splice(i, 1)
      }
      if (type === 'attibute') {
        const i = this.selectMemberAttibuteList.findIndex(item => {
          return item.itemid === val.itemid
        })
        this.selectMemberAttibuteList.splice(i, 1)
      }
    },
    // 获取判断条件列表
    getJudgingList() {
      this.judgingStringList = []
      this.judgingNumberList = []
      const obj = {}
      obj.ddCode = '10017'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.judgingStringList.push({ value: item.code, label: item.name })
          this.judgingNumberList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 选择会员标签
    selectMemberTag(val) {
      console.log(val)
      const isExist = this.selectMemberAttibuteList.findIndex(item => {
        return item.id === val.id
      })
      if (isExist === -1) {
        this.selectMemberAttibuteList.push(val)
        console.log(this.selectMemberAttibuteList)
        console.log(val)
        const i = this.selectMemberAttibuteList.findIndex(item => {
          return item.id === val.id
        })
        this.$set(this.selectMemberAttibuteList[i], 'type', 'memberTags')
        this.$set(this.selectMemberAttibuteList[i], 'checkBoxValue', [])
        this.$set(this.selectMemberAttibuteList[i], 'checkBoxList', [])
        this.$api.getMemberTagApi.getMemberThreeTagsByParentId(val.id).then(res => {
          // console.log(res)
          if (res.data.length > 0) {
            res.data.map(item => {
              this.selectMemberAttibuteList[i].checkBoxList.push({ id: item.id, name: item.name })
            })
          } else {
            this.$message.info('该标签底下无三级标签！')
          }
        })
      } else {
        this.$message.info('已选条件已经存在此条件')
      }
    },
    // 选择会员属性
    selectMemberAttibute(val) {
      const isExist = this.selectMemberAttibuteList.findIndex(item => {
        return item.itemid === val.itemid
      })
      if (isExist === -1) {
        // 处理判断当item类型值为 enum 时是 单选按钮
        if (val.type === 'enum') {
          // val.statusValue = true
          this.selectMemberAttibuteList.push(val)
          console.log(this.selectMemberAttibuteList)
          console.log(val)
          const i = this.selectMemberAttibuteList.findIndex(item => {
            return item.itemid === val.itemid
          })
          this.$set(this.selectMemberAttibuteList[i], 'statusValue', false)
        }
        // 判断当item类型值为 string时， 是 条件带输入框的值
        if (val.type === 'number') {
          this.selectMemberAttibuteList.push(val)
          const i = this.selectMemberAttibuteList.findIndex(item => {
            return item.itemid === val.itemid
          })
          this.$set(this.selectMemberAttibuteList[i], 'judgingList', this.judgingNumberList)
          this.$set(this.selectMemberAttibuteList[i], 'judgingValue', '')
          this.$set(this.selectMemberAttibuteList[i], 'inputValue', '')
        }
        // 判断当item类型值为 string时， 是 条件带输入框的值
        if (val.type === 'string') {
          this.selectMemberAttibuteList.push(val)
          const i = this.selectMemberAttibuteList.findIndex(item => {
            return item.itemid === val.itemid
          })
          this.judgingStringList = this.judgingStringList.filter(item => {
            return item.value === 'eq' || item.value === 'in'
          })
          this.$set(this.selectMemberAttibuteList[i], 'judgingList', this.judgingStringList)
          this.$set(this.selectMemberAttibuteList[i], 'judgingValue', '')
          this.$set(this.selectMemberAttibuteList[i], 'inputValue', '')
        }
        // 判断当item类型值为 date时，时间选择
        if (val.type === 'date') {
          this.selectMemberAttibuteList.push(val)
          const i = this.selectMemberAttibuteList.findIndex(item => {
            return item.itemid === val.itemid
          })
          this.$set(this.selectMemberAttibuteList[i], val.itemName + 'From', '')
          this.$set(this.selectMemberAttibuteList[i], val.itemName + 'To', '')
        }
        // 判断当item类型值为 multienum ,多选 checkbox
        if (val.type === 'multienum') {
          this.selectMemberAttibuteList.push(val)
          const i = this.selectMemberAttibuteList.findIndex(item => {
            return item.itemid === val.itemid
          })
          this.$set(this.selectMemberAttibuteList[i], 'checkBoxValue', [])
          this.$set(this.selectMemberAttibuteList[i], 'checkBoxList', [])
          console.log(i)
          axios.get('/' + val.dataSourcesService + `${config.version}` + val.dataSourcesUri).then(res => {
            res.map(item => {
              this.selectMemberAttibuteList[i].checkBoxList.push({ code: item.code, name: item.name })
            })
          })
        }
      } else {
        this.$message.info('已选条件已存在')
      }
    },
    // 获取会员属性列表
    getMemberAttibutesList() {
      this.$api.getMemberTagMappingApi.getMemberAttibutesList().then(res => {
        console.log(res)
        this.memberAttibutesList = res
      })
    },
    // 获取二级标签列表
    getMemberTagLevelTwoList() {
      const obj = {}
      obj.name = ''
      obj.level = '2'
      obj.pageIndex = 1
      obj.pageSize = 999
      obj.memberId = ''
      obj.handmade = ''
      this.$api.getMemberTagApi.getMemberTagList(obj).then(res => {
        console.log(res)
        this.memberTagLevelTwoList = res.data
      })
    },
    // 会员属性的展开与折叠
    changeFoldState() {
      this.AttibutesBrandFold = !this.AttibutesBrandFold
    },
    // 会员属性的展开与折叠
    changeTagFoldState() {
      this.TagBrandFold = !this.TagBrandFold
    },
    // 切换分页条数方法
    handleSizeChange(newPage) {
      this.searchSelectMemberForm.pageSize = newPage
      this.searchMember()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchSelectMemberForm.pageIndex = newPage
      this.searchMember()
    },
    // 确认绑定会员与会员标签关系
    confirmMemberAndTag() {
      console.log(this.selectMemberAttibuteList)
      const memberTagId = []
      const queryObj = {}
      // 如果是全选
      if (this.checkAll) {
        for (var i = 0; i < this.selectMemberAttibuteList.length; i++) {
          if (this.selectMemberAttibuteList[i].type === 'enum') {
            queryObj[this.selectMemberAttibuteList[i].itemName] = this.selectMemberAttibuteList[i].statusValue
          }
          if (this.selectMemberAttibuteList[i].type === 'string' || this.selectMemberAttibuteList[i].type === 'number') {
            queryObj[this.selectMemberAttibuteList[i].itemName] = this.selectMemberAttibuteList[i].inputValue
            queryObj[this.selectMemberAttibuteList[i].itemName + 'Condition'] = this.selectMemberAttibuteList[i].judgingValue
          }
          if (this.selectMemberAttibuteList[i].type === 'date') {
            const dateFrom = this.selectMemberAttibuteList[i].itemName + 'From'
            const dateTo = this.selectMemberAttibuteList[i].itemName + 'To'
            queryObj[dateFrom] = this.selectMemberAttibuteList[i][dateFrom]
            queryObj[dateTo] = this.selectMemberAttibuteList[i][dateTo]
          }
          if (this.selectMemberAttibuteList[i].type === 'multienum') {
            queryObj[this.selectMemberAttibuteList[i].itemName] = this.selectMemberAttibuteList[i].checkBoxValue
          }
          if (this.selectMemberAttibuteList[i].type === 'memberTags') {
            queryObj.memberTagId = memberTagId.concat(this.selectMemberAttibuteList[i].checkBoxValue)
          }
        }
        console.log(queryObj)
        queryObj.booAll = true
        queryObj.addMemberIds = []
        queryObj.addMemberTagIds = this.selectMemberTagIds
        this.$api.postMemberTagApi.postMemberTagMappings(queryObj).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.selectMemberTagDialog = false
          }
        })
      } else {
        queryObj.booAll = false
        queryObj.addMemberIds = this.selectIndexList
        queryObj.addMemberTagIds = this.selectMemberTagIds
        console.log(queryObj)
        this.$api.postMemberTagApi.postMemberTagMappings(queryObj).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.selectMemberTagDialog = false
          }
        })
      }
    },
    // 筛选会员(查询会员)
    searchMember() {
      console.log(this.selectMemberAttibuteList)
      // 动态拼接参数处理
      var params = ''
      var memberTagId = []
      for (var i = 0; i < this.selectMemberAttibuteList.length; i++) {
        // 判断单选按钮参数 有效或者无效  true或者false
        if (this.selectMemberAttibuteList[i].type === 'enum') {
          params = params + `&${this.selectMemberAttibuteList[i].itemName}=` + `${this.selectMemberAttibuteList[i].statusValue}`
        }
        // 判断string或者number类型  itemName+条件= 条件值   itemName = 输入值
        if (this.selectMemberAttibuteList[i].type === 'string' || this.selectMemberAttibuteList[i].type === 'number') {
          params =
            params +
            '&' +
            `${this.selectMemberAttibuteList[i].itemName}` +
            'Condition=' +
            `${this.selectMemberAttibuteList[i].judgingValue}` +
            `&${this.selectMemberAttibuteList[i].itemName}=` +
            `${this.selectMemberAttibuteList[i].inputValue}`
        }
        // 判断date类型  itemNameFrom= itemNameFrom起始值 itemNameTo = itemName结束值
        if (this.selectMemberAttibuteList[i].type === 'date') {
          const dateFrom = this.selectMemberAttibuteList[i].itemName + 'From'
          const dateTo = this.selectMemberAttibuteList[i].itemName + 'To'
          params =
            params +
            '&' +
            `${this.selectMemberAttibuteList[i].itemName}` +
            'From=' +
            `${this.selectMemberAttibuteList[i][dateFrom]}` +
            '&' +
            `${this.selectMemberAttibuteList[i].itemName}` +
            'To=' +
            `${this.selectMemberAttibuteList[i][dateTo]}`
        }
        // 判断multienum 多选框 checkBox
        if (this.selectMemberAttibuteList[i].type === 'multienum') {
          params = params + '&' + `${this.selectMemberAttibuteList[i].itemName}=` + `${this.selectMemberAttibuteList[i].checkBoxValue}`
        }
        // 判断memberTags 多选框 checkBox
        if (this.selectMemberAttibuteList[i].type === 'memberTags') {
          memberTagId = memberTagId.concat(this.selectMemberAttibuteList[i].checkBoxValue)
        }
        console.log(memberTagId)
      }
      console.log(params)
      // this.getSelectMemberList(this.searchSelectMemberForm, params, memberTagId)
      this.$api.getMemberApi.getSelectMemberList(this.searchSelectMemberForm, params, memberTagId).then(res => {
        console.log(res)
        if (this.selectMemberIds.length <= 0 && !this.checkedAll) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].checked = false
          }
        }
        if (this.checkedAll) {
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].checked = true
          }
        }
        if (this.selectMemberIds.length > 0 && !this.checkedAll) {
          for (let i = 0; i < res.data.length; i++) {
            for (let j = 0; j < this.selectMemberIds.length; j++) {
              if (res.data[i].id === this.selectMemberIds[j]) {
                res.data[i].checked = true
              }
            }
          }
          for (let i = 0; i < res.data.length; i++) {
            if (!res.data[i].checked) {
              res.data[i].checked = false
            }
          }
          console.log(res.data)
        }
        this.total = res.total
        this.selectMemberList = res.data
        this.currentPageMemberList = res.data
        this.allPageMemberList = this.allPageMemberList.concat(res.data)
      })
    },
    // 选择会员标签弹出框
    showSelectMemberTagDialog() {
      this.getSelectMemberTagList()
    },
    // 查询会员标签
    searchMemberTag() {
      this.getSelectMemberTagList()
    },
    // 重置会员标签
    resetSearchMemberTag() {
      this.searchSelectMemberTagForm.name = ''
      this.getSelectMemberTagList()
    },
    // 进行选择的会员标签列表
    getSelectMemberTagList() {
      this.$api.getMemberTagApi.getMemberTagList(this.searchSelectMemberTagForm).then(res => {
        console.log(res)
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].checked = false
        }
        this.selectMemberTagList = res.data
        console.log(this.selectMemberTagList)
        this.selectMemberTagDialog = true
      })
    },
    // 选择会员标签 处理会员标签id集合
    selectMemberTagCheck(row, e) {
      console.log(row, e)
      this.selectMemberTagIds = this.selectMemberTagList.filter(item => {
        return item.checked === true
      })
      for (let i = 0; i < this.selectMemberTagIds.length; i++) {
        this.selectMemberTagIds[i] = this.selectMemberTagIds[i].id
      }
    },
    // 关闭选择会员标签弹出框
    closeMemberTagDialog() {},

    // 会员详情的方法集合
    // 查询会员详情弹出框
    showMemberDetailsDialog(row) {
      this.currentMemberId = row.id
      this.memberDetailsDialogVisible = true
    },
    // 关闭会员详情弹出框
    closeMemberDetailsDialog() {},
    // 全选的方法集合
    // 获取row的key值
    getRowKeys(row) {
      return row.id
    },
    // 全选按键功能实现
    selAll() {
      console.log(this.$refs.multipleTable.selection.length)
      if (this.$refs.multipleTable.selection.length < this.total) {
        console.log('执行')
        this.checkAll = true
      } else {
        this.checkAll = false
      }
      if (this.checkAll) {
        // this.$refs.multipleTable.clearSelection()
        console.log(this.allPageMemberList)
        this.allPageMemberList.forEach(row => {
          console.log(row)
          console.log('执行222')
          this.$refs.multipleTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
        this.selectObjList = []
        this.selectIndexList = []
      }
    },
    selRow(val) {
      const vm = this
      // 选择的行的完整数据
      vm.selectObjList = Array.from(new Set([...vm.selectObjList, ...val]))
      const currentArr = val.map(item => item.id)
      const arr1 = [...vm.selectIndexList, ...currentArr]
      vm.selectIndexList = Array.from(new Set(arr1))
      const tableData = vm.currentPageMemberList.map(item => item.id)
      const difference = tableData.filter(v => !currentArr.includes(v))
      difference.forEach(item => {
        if (vm.selectIndexList.indexOf(item) !== -1) {
          vm.selectIndexList.splice(vm.selectIndexList.indexOf(item), 1)
        }
      })
      var list = vm.selectObjList.filter(item => vm.selectIndexList.indexOf(item.id) !== -1)
      for (var i = 0; i < list.length; i++) {
        for (var j = i + 1; j < list.length; j++) {
          if (list[i].id === list[j].id) {
            list.splice(j, 1)
            j--
          }
        }
      }
      setTimeout(() => {
        this.stateChange()
      }, 0)
    },
    stateChange() {
      var vm = this
      if (vm.selectIndexList.length < this.total && vm.selectIndexList.length > 0) {
        this.isIndeterminate = true
      } else if (vm.selectIndexList.length === this.total) {
        this.isIndeterminate = false
        this.checkAll = true
      } else if (vm.selectIndexList.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      }
    }
    // 全选的方法结束
  }
}
</script>

<style lang="scss" scoped>
.pre-select-wrapper {
  margin: 20px;
}
.el-tag {
  cursor: pointer;
  // background: cyan;
}
.select-condition-wrapper {
  height: 40px;
}
.select-condition {
  margin: 5px 0px;
  height: 100%;
}
.opt-btn {
  margin-bottom: 20px;
}
.select-btn {
  margin-bottom: 20px;
}
.label-text {
  text-align: center;
}
.form-content {
  // width: 100%;
  height: 500px;
}
.top-wrapper {
  margin-bottom: 20px;
}
.no-avatar {
  width: 100px;
  height: 100px;
  border-radius: 100px;
}
.avatar {
  border: none;
  height: 200px;
}
.upload {
  margin-top: 20px;
}
.avatar-wrapper {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f7f6fb;
  border-radius: 10px;
}
.member-label {
  border: none;
  height: 200px;
}
.member-label-wrapper {
  height: 200px;
  margin-left: 20px;
  background: #f7f6fb;
  border-radius: 10px;
}
.el-select {
  border: none !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  border: none !important;
}
.form-table-item {
  margin-top: 10px;
}
.pre-select-wrapper {
  margin: 20px;
}
.search-form-box-wrapper {
  height: 40px;
  // width: 100%;
  display: flex;
  margin-bottom: 20px;
}
.el-tag {
  cursor: pointer;
}
.select-condition {
  margin: 5px 0px;
}
.opt-btn {
  margin-bottom: 20px;
}
.select-btn {
  margin-bottom: 20px;
}
.is-show-select {
  margin-right: 20px;
}
.el-input .el-select .el-date-picker {
  width: 150px;
}
.member-detail-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
}
.check-all-box {
  margin-left: 20px;
}
::v-deep .el-table__header-wrapper .el-checkbox__input::after {
  content: '全选';
  position: absolute;
  margin-left: 5px;
}
</style>

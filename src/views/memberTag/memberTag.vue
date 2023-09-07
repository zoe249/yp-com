<!--
 * @FileDescription: 会员标签
 * @Author: liupenghui
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-20 16:05:02
 -->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddMemberTagDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->

    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchMemberTagFormLabel" :formData="searchMemberTagForm"></yp-search-form>
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
    <!-- 头部搜索表单 end -->

    <!-- 表格树形 begin -->
    <yp-table :listInfo="memberTagList" :propArr="memberTagListLabel" children="memberTags" @switchChange="switchChange" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-show="scope.scope.level === '3'" @click="showViewMemberTagDialog(scope.scope)">{{ $t('lang.viewMember') }}</el-button>
        <el-button type="text" v-show="scope.scope.level === '1'" @click="showAddChildrenMemberTagDialog(scope.scope)">+ 新增子标签</el-button>
        <el-button type="text" v-show="scope.scope.level === '2'" @click="showAddChildrenMemberTagDialog(scope.scope)">+ 新增子标签</el-button>
        <el-button type="text" icon="el-icon-search" @click="showEditMemberTagDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <el-button type="text" icon="el-icon-delete" @click="deleteMemberTagDialog(scope.scope)">{{ $t('lang.delete') }} </el-button>
      </template>
    </yp-table>
    <!-- 表格树形 end -->

    <!-- 会员标签分页 begin -->
    <div class="pagination-wrapper">
      <!-- 占位 -->
      <div></div>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="1"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchMemberTagForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 会员标签分页 end -->

    <!-- 会员标签对话框 begin -->
    <el-dialog :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="50%" @close="closeSelectDialog" :close-on-click-modal="false" v-dialogDrag>
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <div>
        <!-- 对话框表单 begin -->
        <el-form :model="memberTagForm" ref="ypForm" label-width="120px" label-position="right" :rules="memberTagFormRules">
          <div v-for="(item, index) in memberTagFormLabel" :key="index">
            <!-- 用于所搜 type 为 input 类型 -->
            <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
              <el-input v-model.trim="memberTagForm[item.prop]" placeholder="" clearable></el-input>
            </el-form-item>
            <!-- 用于所搜 type 为 input 类型 -->

            <!-- 用于上传图片 -->
            <el-form-item v-if="item.type === 'img'" :label="item.label">
              <yp-single-upload utype="memberTag" :url.sync="memberTagForm[item.prop]"></yp-single-upload>
            </el-form-item>
            <!-- 用于上传图片 end -->

            <!-- 上级标签 -->
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select v-model="memberTagForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="disabled" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>

            <!-- 用于状态 begin -->
            <el-form-item v-if="item.type === 'switch'" :label="item.label" :prop="item.prop">
              <el-switch v-model="memberTagForm[item.prop]" :disabled="item.disabled ? true : false"></el-switch>
            </el-form-item>
            <!-- 用于状态 end -->
          </div>
        </el-form>
        <!-- 对话框表单 end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 会员标签对话框 end -->

    <!-- 查看会员对话框 begin -->
    <el-dialog title="查看会员" :visible.sync="viewMemberdialogVisible" width="65%" @close="viewMembercloseSelectDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '查看会员' }}
        </div>
      </template>
      <div>
        <!-- 查看会员对话框中的 新增与删除 按钮 begin -->
        <el-button class="add-btn" type="primary" @click="showViewMemberAddDialog" size="mini">+ 新增</el-button>
        <el-button class="add-btn" type="primary" @click="showViewMemberDeleteDialog" size="mini">- 删除</el-button>
        <!-- 查看会员对话框中的 新增与删除 按钮 end -->

        <!-- 查看会员对话框中的 头部搜索表单 begin -->
        <div class="search-form-box">
          <yp-search-form class="search-form-wrapper" :formLabel="searchViewMemberFormLabel" :formData="ViewFormList"></yp-search-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              @click="resetSearchViewMember"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button @click="SearchViewMember" class="search-btn" type="primary" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
        <!-- 查看会员对话框中的 头部搜索表单 end -->

        <!-- 查看会员对话框中表格内容 begin -->
        <el-table :data="viewMemberList" stripe border ref="multipleTable" :row-key="getRowKeys" @selection-change="selRow" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
          <el-table-column type="selection" prop="id" :reserve-selection="true" align="center"> </el-table-column>
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
              <span v-if="scope.row.cardLevel === '02'">02-白银会员</span>
              <span v-if="scope.row.cardLevel === '03'">03-黄金会员</span>
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
              @size-change="ViewMemberhandleSizeChange"
              @current-change="ViewMemberhandleCurrentChange"
              :current-page="ViewFormList.pageIndex"
              :page-sizes="[10, 20, 30, 40]"
              :page-size="ViewFormList.pageSize"
              layout="total, sizes, prev, pager, next, jumper"
              :total="ViewFormListtotal"
            >
            </el-pagination>
          </div>
        </div>
        <!-- 分页 end -->
      </div>
    </el-dialog>
    <!-- 查看会员对话框 end -->
    <!-- 查看会员对话框中的新增对话框 begin -->
    <el-dialog title="新增" :visible.sync="ViewMemberdiaAddlogVisible" width="50%" :close-on-click-modal="false" v-dialogDrag @close="viewMembercloseAddDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '新增' }}
        </div>
      </template>
      <!-- 头部搜索 begin -->
      <div class="search-form-box">
        <span style="width:90px;display:flex;align-items:center;">查询条件：</span>
        <span style="width:300px;">
          <el-input placeholder="输入姓名、会员账号或手机号" v-model.trim="ViewFormListAdd.info" class="input-with-select"> </el-input>
        </span>
        <div style="display:flex;flex:1;flex:1;flex-direction:row-reverse;">
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchViewMemberInAdd"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchViewMemberAdd" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
      </div>
      <!-- 头部搜索 end -->

      <!-- 表格 begin -->
      <el-table :data="viewMemberAddList" stripe border ref="multipleAddTable" :row-key="getAddRowKeys" @selection-change="selAddRow" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column type="selection" prop="id" :reserve-selection="true" align="center"> </el-table-column>
        <el-table-column label="会员卡号" prop="cardNumber" align="center"> </el-table-column>
        <el-table-column label="姓名" prop="realName" align="center"> </el-table-column>
        <el-table-column label="手机号" prop="phone" align="center"> </el-table-column>
        <el-table-column label="会员等级" prop="cardLevel" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.cardLevel === '01'">01-普通会员</span>
            <span v-if="scope.row.cardLevel === '02'">02-白银会员</span>
            <span v-if="scope.row.cardLevel === '03'">03-黄金会员</span>
          </template>
        </el-table-column>
        <el-table-column label="性别" prop="gender" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === '0'">未知</span>
            <span v-if="scope.row.gender === '1'">男</span>
            <span v-if="scope.row.gender === '2'">女</span>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 begin -->
      <div class="pagination-wrapper">
        <el-checkbox class="check-all-box" :indeterminate="isAddIndeterminate" v-model="checkAddAll" @change="selAddAll()">选择全部</el-checkbox>
        <div class="pagination">
          <el-pagination
            @size-change="ViewMemberAddhandleSizeChange"
            @current-change="ViewMemberAddhandleCurrentChange"
            :current-page="ViewFormListAdd.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="ViewFormListAdd.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="ViewFormListAddtotal"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="ViewMemberdiaAddlogVisible = false">取 消</el-button>
        <el-button type="primary" @click="ViewMemberAddConfirm">保 存</el-button>
      </span>
    </el-dialog>
    <!-- 查看会员对话框中的新增对话框 end -->

    <!-- 查看详情中用户的积分明细对话框 begin -->
    <el-dialog title="积分明细" :visible.sync="PointsDetailsDialog">
      <span><h2>等积分域做完之后，开发此对话框</h2></span>
    </el-dialog>
    <!-- 查看详情中用户的积分明细对话框 end -->
    <!-- 查看会员详情弹出框 start -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      title="查看详情"
      :visible.sync="memberDetailsDialogVisible"
      :lock-scroll="false"
      v-if="memberDetailsDialogVisible"
      :append-to-body="true"
      width="80%"
      @close="closeMemberDetailsDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '查看详情' }}
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
import memberDetails from '@/components/memberDetails/memberDetails.vue'
// 表格所引用的组件
import YpTable from '@/components/table/YpTable.vue'
// 头部搜索所引用的组件
import YpSearchForm from '@/components/form/YpSearchForm.vue'
// 图片上传所引用的组件
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
// 时间筛选器
import { parseTime } from '@/filters/format.js'
import { Loading } from 'element-ui'
export default {
  components: {
    YpSearchForm,
    YpSingleUpload,
    YpTable,
    memberDetails
  },
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  computed: {
    // 查看详情中用户信息表格数据
    viewUserListLabel() {
      return [
        { label: '操作', type: 'operation' },
        { label: '账户类型', props: 'type' },
        { label: '总额', props: 'total' },
        { label: '余额', props: 'balance' },
        { label: '赠送额', props: 'gift' },
        { label: '扣减额', props: 'deduction' }
      ]
    },
    // 查看详情中地址信息表格数据
    viewAdressListLabel() {
      return [
        { label: '详细地址', props: 'adress' },
        { label: '地址类型', props: 'type' },
        { label: '所在国家', props: 'country' },
        { label: '所在省份', props: 'state' },
        { label: '所在城市', props: 'city' },
        { label: '所在区', props: 'district' },
        { label: '所在街道', props: 'street' }
      ]
    },
    // 会员标签对话框里面的表单数据
    memberTagFormLabel() {
      return [
        { label: '标签名称', type: 'input', prop: 'name' },
        { label: '标签图标', type: 'img', prop: 'icon' },
        {
          label: '上级标签',
          type: 'select',
          prop: 'parentId',
          disabled: this.disabled,
          options: this.optionEditParentList
        },
        { label: '手工标签', type: 'switch', prop: 'handmade' },
        { label: '描述', type: 'input', prop: 'description' }
      ]
    },
    // 会员标签头部搜索Label数据
    searchMemberTagFormLabel() {
      return [
        {
          label: '标签名称：',
          type: 'input',
          prop: 'name',
          placeholder: '标签名称'
        },
        {
          label: '标签级别：',
          type: 'select',
          prop: 'level',
          options: [
            { label: '一级', value: '1' },
            { label: '二级', value: '2' },
            { label: '三级', value: '3' }
          ]
        }
      ]
    },
    // 会员标签树形表格结构数据
    memberTagListLabel() {
      return [
        { label: '操作', type: 'operation' },
        { label: '标签名称', props: 'name' },
        { label: '标签图标', props: 'icon', type: 'img' },
        {
          label: '级别',
          props: 'level',
          type: 'tag',
          renderStyle: row => {
            if (row.level === '1') {
              return 'primary'
            } else if (row.level === '2') {
              return 'success'
            } else {
              return 'danger'
            }
          },
          render: row => {
            if (row.level === '1') {
              return '一级'
            } else if (row.level === '2') {
              return '二级'
            } else {
              return '三级'
            }
          }
        },
        { label: '手工标签', props: 'handmade', type: 'switch', method: 'switchChange' },
        { label: '描述', props: 'description' }
      ]
    },
    // 查看会员表格数据
    viewMemberListLabel() {
      return [
        { label: '操作', type: 'operation' },
        { label: '全选', type: 'customChecked', props: 'checked' },
        { label: '会员卡号', props: 'cardNumber' },
        { label: '会员姓名', props: 'realName' },
        {
          label: '性别',
          props: 'gender',
          type: 'status',
          render: row => {
            if (row.gender === '1') {
              return '男'
            } else if (row.gender === '2') {
              return '女'
            } else {
              return '未知'
            }
          }
        },
        { label: '手机号', props: 'phone' },
        {
          label: '会员等级',
          props: 'cardLevel',
          type: 'status',
          render: row => {
            if (row.cardLevel === '01') {
              return '01-普通会员'
            } else if (row.cardLevel === '02') {
              return '02-白银会员'
            } else if (row.cardLevel === '03') {
              return '03-黄金会员'
            }
          }
        },
        {
          label: '有效状态',
          props: 'status',
          type: 'status',
          render: row => {
            if (row.status === true) {
              return '有效'
            } else {
              return '无效'
            }
          }
        },
        { label: '注册日期', props: 'registrationDate', type: 'date' },
        { label: '会员标签', props: 'memberTagName' }
      ]
    },
    // 查看会员搜索表单数据
    searchViewMemberFormLabel() {
      return [
        {
          label: '会员：',
          type: 'input',
          prop: 'cardInfo',
          placeholder: '卡号或姓名'
        },
        {
          label: '会员等级：',
          type: 'select',
          prop: 'cardLevelCode',
          options: [
            { label: '01-普通会员', value: '01' },
            { label: '02-白银会员', value: '02' },
            { label: '03-黄金会员', value: '03' }
          ]
        },
        {
          label: '手机号：',
          type: 'input',
          prop: 'phone',
          placeholder: '手机号'
        }
      ]
    },
    // 查看会员新增对话框中的表格
    viewMemberAddListLabel() {
      return [
        {
          label: '性别',
          props: 'gender',
          type: 'status',
          render: row => {
            if (row.gender === '1') {
              return '男'
            } else if (row.gender === '2') {
              return '女'
            } else {
              return '未知'
            }
          }
        },
        { label: '全选', type: 'customChecked', props: 'checked' },
        { label: '会员卡号', props: 'cardNumber' },
        { label: '会员姓名', props: 'realName' },
        { label: '手机号', props: 'phone' },
        {
          label: '会员等级',
          props: 'cardLevel',
          type: 'status',
          render: row => {
            if (row.cardLevel === '01') {
              return '01-普通会员'
            } else if (row.cardLevel === '02') {
              return '02-白银会员'
            } else if (row.cardLevel === '03') {
              return '03-黄金会员'
            }
          }
        }
      ]
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
    // 获取会员标签列表的方法
    this.getMemberTaglist()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  data() {
    // 检测会员名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        console.log(value)
        this.$api.getMemberTagApi.getCheckName(`${value}`, this.currentId).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            return cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      // 全选功能代码开始
      checkAll: false,
      checkAddAll: false,
      selectObjList: [], // 选中的列表对象
      selectIndexList: [], // 选中的索引值
      selectObjAddList: [], // 选中的列表对象
      selectIndexAddList: [], // 选中的索引值
      currentPageMemberList: [], // 当前页码会员表格数据
      isIndeterminate: false,
      isAddIndeterminate: false,
      allPageMemberList: [], // 获取所有页码会员数据
      allPageMemberAddList: [], // 获取所有页码会员数据
      // 查看详情中用户信息
      viewUserList: [],
      // 查看详情中地址表格所绑定的信息
      viewAdressList: [],
      typeList: [], // 选择地址类型下拉列表
      // 控制会员标签对话框里面的数据
      memberTagForm: {
        name: '',
        icon: '',
        description: '',
        handmade: true,
        parentId: ''
      },

      // 会员标签搜索表单所绑定的值
      searchMemberTagForm: {
        name: '',
        level: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        handmade: '',
        parentId: ''
      },

      // 查看会员搜索表单所绑定的值
      // searchViewMemberForm: {
      //   phone: '',
      //   cardInfo: '',
      //   cardlevel: ''
      // },
      // 用来进行查看会员的（包含分页）！！！也是会员标签表头搜索所绑定的值
      ViewFormList: {
        cardInfo: '',
        cardLevelCode: '',
        pageIndex: 1,
        pageSize: 20,
        phone: '',
        beginTime: '',
        endTime: '',
        memberTagId: '',
        status: '',
        filterMemberTagId: '',
        info: ''
      },
      // 用来进行查看会员里面的新增的（包含分页，也是用来对查看会员对话框中新增对话框中的头部搜索进行控制）
      ViewFormListAdd: {
        pageIndex: 1,
        pageSize: 20,
        filterMemberTagId: '',
        info: ''
      },
      // 用来接受查看会员中新增的总数
      ViewFormListtotal: 0,
      ViewFormListAddtotal: 0,
      // 用来接受id，用于查看会员对话框中的新增
      viewImpoetId: '0',
      // 用来进行控制对话框的显示与隐藏
      dialogVisible: false,
      // 查看会员对话框中的新增对话框的显示与隐藏
      ViewMemberdiaAddlogVisible: false,
      // 查看会员对话框中的查看详情对话框显示与隐藏
      ViewMemberdiaEditlogVisible: false,
      // 查看会员对话框的显示与隐藏
      viewMemberdialogVisible: false,
      // 积分明细对话框的显示与隐藏
      PointsDetailsDialog: false,

      // 用来接收数据（用于当点击新增下级时，上级组织所展示的数据）
      obj: {},

      // 用来接受id的集合（用于查看会员中的新增）
      inIds: { addMemberIds: [], addMemberTagIds: [], booAll: false },
      // 用来接受id的集合（用于查看会员中的删除）
      inDeleteIds: { deleteMemberIds: [], booAll: false },
      idViewDelete: '',
      viewMemberDeleteId: '',

      // 当会员标签点击编辑时，上级标签所绑定的值
      optionEditParentList: [],

      // 用来进行获取会员标签总数据
      total: 0,

      // 用来接受 id 值（用于会员标签中）
      currentId: '0',

      // 查看会员
      // memberIds

      // 用来接受查看会员中新增对话框中的表格数据
      viewMemberAddList: [],

      // 用来进行接受查看会员的列表数据
      viewMemberList: [],

      // 来进行控制上级标签是否可以进行被选择
      disabled: false,

      // 用来进行控制会员标签中提示文字的显示
      isAdd: true,

      // 用来接受会员标签数据
      memberTagList: [],

      // 当选中某一条数据之后，所触发的索引值
      currentRow: 0,

      // 用于产看会员对话框中的新增对话框中的搜索表单数据
      info: '',

      // 会员标签校验规则
      memberTagFormRules: {
        name: [
          { required: true, message: '请输入标签名称', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        handmade: [{ required: true, trigger: 'blur' }]
      },
      // 会员详情相关属性
      // isAdd: false,
      memberDetailsDialogVisible: false, // 控制查看会员详情弹出框是否显示或隐藏
      memberForm: {
        avatar: '', // 头像
        cardNumber: '', // 会员卡号
        realName: '', // 真实姓名
        phone: '', // 手机号码
        openId: '', // 微信ID
        cardlevel: '01', // 会员等级
        gender: '', // 性别
        birthday: '', // 生日
        cardlevelTime: '', // 等级变更日期
        nickname: '', // 昵称
        nation: '01', // 民族
        email: '', // 邮箱
        status: true, // 有效状态
        certificateType: '', // 证件类型
        idCard: '', // 证件号码
        registrationDate: '', // 注册日期
        registrationCompanyId: '', // 注册企业
        registrationOrganizationId: '', // 注册组织
        registrationChannelId: '', // 注册渠道
        registrationTerminalId: '', // 注册终端
        professional: '', // 职业
        position: '', // 职务
        company: '', // 企业名称
        workingYears: '', // 工龄
        monthlyIncome: '', // 月收入
        diploma: '', // 文化水平
        religion: '', // 宗教信仰
        familyStatus: '', // 家庭状况
        maritalStatus: '', // 婚姻状况
        politicsStatus: '', // 政治面貌
        tripMode: '', // 出行方式
        carNumber: '', // 车牌号
        referrerMemberId: '', // 推荐会员
        referrerUserId: '', // 推荐员工
        serviceUserId: '', // 服务员工
        oldCardNumber: '', // 原会员卡号
        memberAddressList: []
      }, // 会员表单对象
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg', // 无头像时
      memberAndTagMappingList: [], // 会员标签列表数据
      currentMemberId: '', // 当前会员Id存储
      memberAccountList: [], // 会员账户列表数据
      statusList: [
        { label: '有效', value: true },
        {
          label: '无效',
          value: false
        }
      ], // 选择有效无效列表
      age: '' // 会员年龄
    }
  },
  methods: {
    // 获取row的key值
    getRowKeys(row) {
      return row.id
    },
    getAddRowKeys(row) {
      return row.id
    },
    // 全选按键功能实现
    selAll() {
      if (this.$refs.multipleTable.selection.length < this.ViewFormListtotal) {
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
    // 全选按键功能实现（新增）
    selAddAll() {
      if (this.$refs.multipleAddTable.selection.length < this.ViewFormListAddtotal) {
        console.log('执行')
        this.checkAddAll = true
      } else {
        this.checkAddAll = false
      }
      if (this.checkAddAll) {
        console.log(this.allPageMemberAddList)
        this.allPageMemberAddList.forEach(row => {
          console.log(row)
          console.log('执行222')
          this.$refs.multipleAddTable.toggleRowSelection(row, true)
        })
      } else {
        this.$refs.multipleAddTable.clearSelection()
        this.selectObjAddList = []
        this.selectIndexAddList = []
      }
    },
    // 全选按钮所触发的事件
    selRow(val) {
      this.inDeleteIds.deleteMemberIds = []
      const vm = this
      // 选择的行的完整数据
      val.map(item => {
        this.inDeleteIds.deleteMemberIds.push(item.id)
      })
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
    // 当改变全选按钮的值时，所触发的事件（新增）
    selAddRow(val) {
      this.inIds.addMemberIds = []
      val.map(item => {
        this.inIds.addMemberIds.push(item.id)
      })
      const vm = this
      // 选择的行的完整数据
      vm.selectObjAddList = Array.from(new Set([...vm.selectObjAddList, ...val]))
      const currentArr = val.map(item => item.id)
      const arr1 = [...vm.selectIndexAddList, ...currentArr]
      vm.selectIndexAddList = Array.from(new Set(arr1))
      const tableData = vm.currentPageMemberList.map(item => item.id)
      const difference = tableData.filter(v => !currentArr.includes(v))
      difference.forEach(item => {
        if (vm.selectIndexAddList.indexOf(item) !== -1) {
          vm.selectIndexAddList.splice(vm.selectIndexAddList.indexOf(item), 1)
        }
      })
      var list = vm.selectObjAddList.filter(item => vm.selectIndexAddList.indexOf(item.id) !== -1)
      for (var i = 0; i < list.length; i++) {
        for (var j = i + 1; j < list.length; j++) {
          if (list[i].id === list[j].id) {
            list.splice(j, 1)
            j--
          }
        }
      }
      setTimeout(() => {
        this.stateAddChange()
      }, 0)
    },

    stateChange() {
      var vm = this
      if (vm.selectIndexList.length < this.ViewFormListtotal && vm.selectIndexList.length > 0) {
        this.isIndeterminate = true
      } else if (vm.selectIndexList.length === this.ViewFormListtotal) {
        this.isIndeterminate = false
        this.checkAll = true
      } else if (vm.selectIndexList.length === 0) {
        this.isIndeterminate = false
        this.checkAll = false
      }
    },
    stateAddChange() {
      var vm = this
      if (vm.selectIndexAddList.length < this.ViewFormListAddtotal && vm.selectIndexAddList.length > 0) {
        this.isAddIndeterminate = true
      } else if (vm.selectIndexAddList.length === this.ViewFormListAddtotal) {
        this.isAddIndeterminate = false
        this.checkAddAll = true
      } else if (vm.selectIndexAddList.length === 0) {
        this.isAddIndeterminate = false
        this.checkAddAll = false
      }
    },
    // 样式
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 查看会员新增最后确定按钮
    ViewMemberAddConfirm() {
      this.$api.postMemberTagApi.postViewMemberTag(this.inIds).then(res => {
        console.log(res)
        if (res.code === '200000') {
          this.ViewMemberdiaAddlogVisible = false
          this.getViewMemberTableList()
        }
      })
    },
    // 会员标签删除按钮
    async deleteMemberTagDialog(item) {
      console.log(item)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getMemberTaglist()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.deleteMemberTagApi.deleteMemberTag(item.id).then(res => {
          console.log(res)
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
          this.getMemberTaglist()
        })
      }
    },
    // 从后端获取会员标签表格数据
    getMemberTaglist() {
      this.$api.getMemberTagApi.getMemberTagList(this.searchMemberTagForm).then(res => {
        console.log(res.data)
        this.total = res.total
        this.memberTagList = res.data
      })
    },
    // 从后端获取查看会员
    getViewMemberList() {
      this.$api.getMemberTagApi.getViewMemberList().then(res => {
        console.log('getViewMemberList')
        this.viewMemberList = res.data
      })
    },
    // 控制会员标签的状态数据
    async switchChange(val) {
      console.log(val)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getMemberTaglist()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putMemberTagApi.putMemberTag(val, val.id).then(res => {
          if (res.code === '200000') this.getMemberTaglist()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 新增会员标签
    showAddMemberTagDialog() {
      this.optionEditParentList = []
      const obj = {}
      obj.value = '0'
      obj.label = '顶级标签'
      this.optionEditParentList.push(obj)
      this.memberTagForm.parentId = '0'
      this.isAdd = true
      this.currentId = ''
      this.disabled = true
      this.dialogVisible = true
    },
    // 查看会员对话框中的搜索按钮
    searchViewMemberAdd() {
      console.log('searchViewMemberAdd')
      this.showViewMemberAddDialog()
    },
    // 新增对话框关闭之后所触发的事件（查看会员中的新增）
    viewMembercloseAddDialog() {
      this.ViewFormListAdd.info = ''
    },
    // 新增查看会员对话框里面的新增（获取查看会员里面新增的数据）
    showViewMemberAddDialog() {
      console.log('showViewMemberAddDialog')
      this.$api.getMemberApi.getMemberListInMemberTag(this.ViewFormListAdd).then(res => {
        console.log(res)
        console.log(res.data.length)
        for (var i = 0; i < res.data.length; i++) {
          res.data[i].checked = false
        }
        this.viewMemberAddList = res.data
        this.ViewFormListAddtotal = res.total
        this.allPageMemberAddList = this.allPageMemberAddList.concat(res.data)
      })
      this.ViewMemberdiaAddlogVisible = true
    },
    // 查看会员中新增对话框中的重置按钮
    resetSearchViewMemberInAdd() {
      console.log('resetSearchViewMemberInAdd')
      this.ViewFormListAdd.info = ''
      this.showViewMemberAddDialog()
    },
    // 新增查看会员对话框里面的删除
    async showViewMemberDeleteDialog() {
      console.log('showViewMemberDeleteDialog')
      const confirmResult = await this.$confirm('此操作将进行删除会员数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您取消了删除')
      } else {
        const obj = {}
        obj.deleteMemberIds = this.inDeleteIds.deleteMemberIds
        obj.id = this.idViewDelete
        obj.booAll = this.inDeleteIds.booAll
        console.log(obj)
        console.log(this.idViewDelete)
        this.$api.deleteMemberTagApi.deleteMemberTagByIds(this.idViewDelete, obj).then(res => {
          console.log(res)
          this.getViewMemberTableList()
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.inDeleteIds.deleteMemberIds = []
            // this.inDeleteIds.booAll = false
          }
        })
      }
    },
    // 编辑会员标签
    showEditMemberTagDialog(item) {
      this.optionEditParentList = []
      console.log(item)
      if (item.parentId === '0') {
        const obj = {}
        obj.value = '0'
        obj.label = '顶级标签'
        this.optionEditParentList.push(obj)
      } else {
        const obj = {}
        obj.value = item.parentId
        obj.label = item.parentName
        this.optionEditParentList.push(obj)
      }
      this.currentId = item.id
      this.isAdd = false
      this.getMemberTagById(item.id)
      this.disabled = true
      this.dialogVisible = true
    },
    // 根据 id 获取某一条数据
    getMemberTagById(id) {
      console.log(id)
      this.$api.getMemberTagApi.getMemberTagById(id).then(res => {
        console.log(res)
        this.memberTagForm = res
        if (res.parentId === '0' || !res.parentId) {
          this.memberTagForm.parentId = '0'
        }
      })
    },
    // 根据 id 获取所有的会员信息
    getViewDetailsList(id) {
      this.$api.getMemberApi.getMemberById(id).then(res => {
        console.log(res)
        this.memberForm = res
      })
    },
    // 获取查看详情中的用户信息
    getViewDetailsUser(id) {
      this.$api.getMemberApi.getMemberUserById(id).then(res => {
        console.log(res)
        this.viewUserList = res
      })
    },
    // 获取查看详情中的地址信息
    getViewDetailsAdress(id) {
      this.$api.getMemberApi.getMemberAddressById(id).then(res => {
        console.log(res)
        this.memberForm.memberAddressList = res
        // this.viewAdressList = res
      })
    },
    // 查看会员（用来打开查看会员对话框的按钮）
    showViewMemberTagDialog(item) {
      console.log(item)
      console.log('showViewMemberTagDialog')
      this.inIds.addMemberTagIds.push(item.id)
      this.ViewFormList.memberTagId = item.id
      this.ViewFormListAdd.filterMemberTagId = item.id
      this.idViewDelete = item.id
      this.getViewMemberTableList()
      // 获取查看会员列表的方法
      this.viewMemberdialogVisible = true
    },
    // 获取查看会员的表格数据
    getViewMemberTableList() {
      this.$api.getMemberApi.getMemberList(this.ViewFormList).then(res => {
        if (this.inDeleteIds.deleteMemberIds.length <= 0 && !this.checkedAll) {
          console.log(this.inDeleteIds.deleteMemberIds.length)
          for (let i = 0; i < res.data.length; i++) {
            res.data[i].checked = false
          }
          if (this.checkedAll) {
            for (let i = 0; i < res.data.length; i++) {
              res.data[i].checked = true
            }
          }
          if (this.inDeleteIds.deleteMemberIds.length > 0 && !this.checkedAll) {
            for (let i = 0; i < res.data.length; i++) {
              for (let j = 0; j < this.inDeleteIds.deleteMemberIds.length; j++) {
                if (res.data[i].id === this.inDeleteIds.deleteMemberIds[j]) {
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
        }
        this.viewMemberList = res.data
        this.ViewFormListtotal = res.total
        this.allPageMemberList = this.allPageMemberList.concat(res.data)
      })
    },
    // 查看详情对话框中用户查看详情
    viewDetailsUserViewDetails() {
      console.log('viewDetailsUserViewDetails')
      this.PointsDetailsDialog = true
    },
    // 新增子菜单
    showAddChildrenMemberTagDialog(item) {
      // console.log(item)
      this.obj.value = item.id
      this.obj.label = item.name
      this.memberTagForm.parentId = this.obj.label
      this.dialogVisible = true
      this.disabled = true
      this.isAdd = true
    },
    // 对话框中的确定按钮
    confirm() {
      this.memberTagForm.parentId = this.obj.value
      this.$refs.ypForm.validate(async valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postMemberTagApi.postMemberTag(this.memberTagForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getMemberTaglist()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putMemberTagApi.putMemberTag(this.memberTagForm, this.currentId).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getMemberTaglist()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 改变查看会员新增
    changeStatusViewMemberAdd(item) {
      // 一开始在获取表格的时候，为每一项添加了一个属性(check)，并赋值为 false
      // 为什么为 true 之后，在 memberIds 数组中就有了数据？？
      // 在 1446 时，数组里面还没有数据，在 1450 时有了数据
      console.log(this.inIds.addMemberIds)
      this.inIds.addMemberIds = this.viewMemberAddList.filter(item => {
        return item.checked === true
      })
      console.log(this.inIds.addMemberIds)
      for (let i = 0; i < this.inIds.addMemberIds.length; i++) {
        this.inIds.addMemberIds[i] = this.inIds.addMemberIds[i].id
      }
      console.log(this.inIds.addMemberIds)
    },
    // 改变查看会员表格的状态
    changeStatus(item) {
      this.inDeleteIds.deleteMemberIds = this.viewMemberList.filter(item => {
        return item.checked === true
      })
      for (let i = 0; i < this.inDeleteIds.deleteMemberIds.length; i++) {
        this.inDeleteIds.deleteMemberIds[i] = this.inDeleteIds.deleteMemberIds[i].id
      }
      console.log(this.inDeleteIds)
      this.inDeleteIds.booAll = false
    },
    // 会员标签头部搜索按钮
    searchMemberTag() {
      console.log('searchMemberTag')
      this.getMemberTaglist()
    },
    // 查看会员头部搜索按钮
    SearchViewMember() {
      console.log('SearchViewMember')
      this.getViewMemberTableList()
    },
    // 当会员标签对话框关闭后所触发的事件
    closeSelectDialog() {
      this.memberTagForm = {
        name: '',
        icon: '',
        description: '',
        handmade: true,
        level: ''
      }
      this.$refs.ypForm.resetFields()
    },
    // 查看会员对话框关闭之后所会做的事
    viewMembercloseSelectDialog() {
      console.log('viewMembercloseSelectDialog')
      this.ViewFormList = {
        cardInfo: '',
        cardLevelCode: '',
        pageIndex: 1,
        pageSize: 20,
        phone: '',
        beginTime: '',
        endTime: '',
        memberTagId: '',
        status: '',
        filterMemberTagId: '',
        info: ''
      }
      // this.getViewMemberTableList()
    },
    // 重置会员标签表头的按钮
    resetSearchMemberTag() {
      this.searchMemberTagForm.pageIndex = 1
      this.searchMemberTagForm = {
        name: '',
        level: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        handmade: '',
        parentId: ''
      }
      this.getMemberTaglist()
    },
    // 重置查看会员表头的按钮
    resetSearchViewMember() {
      console.log('resetSearchViewMember')
      // this.searchViewMemberForm = {
      //   phone: '',
      //   cardNumber: '',
      //   cardlevel: ''
      // }
      this.ViewFormList = {
        cardInfo: '',
        cardLevelCode: '',
        pageIndex: 1,
        pageSize: 20,
        phone: '',
        beginTime: '',
        endTime: '',
        memberTagId: this.ViewFormList.memberTagId,
        status: '',
        filterMemberTagId: ''
      }
      this.getViewMemberTableList()
    },
    // 查看会员表格中开关方法
    changeSwitch(item) {
      console.log(item)
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchMemberTagForm.pageSize = newPage
      this.getMemberTaglist()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      console.log('newPage')
      this.searchMemberTagForm.pageIndex = newPage
      this.getMemberTaglist()
    },
    // 查看会员对话框中的新增对话框切换分页条数
    ViewMemberAddhandleSizeChange(newPage) {
      console.log('newPage')
      this.ViewFormListAdd.pageSize = newPage
      this.showViewMemberAddDialog()
    },
    // 查看会员对话框中的新增对话框切换分页
    ViewMemberAddhandleCurrentChange(newPage) {
      console.log('newPage')
      this.ViewFormListAdd.pageIndex = newPage
      this.showViewMemberAddDialog()
    },
    // 查看会员对话框中的切换分页条数
    ViewMemberhandleSizeChange(newPage) {
      console.log('newPage')
      this.ViewFormList.pageSize = newPage
      this.getViewMemberTableList()
    },
    // 查看会员对话框中的切换分页
    ViewMemberhandleCurrentChange(newPage) {
      console.log('newPage')
      this.ViewFormList.pageIndex = newPage
      this.getViewMemberTableList()
    },
    // 会员详情的方法集合   add by qiaokun 2021-01-12
    // 查询会员详情弹出框
    showMemberDetailsDialog(row) {
      this.currentMemberId = row.id
      const option = {
        lock: true,
        background: '#fff'
      }
      this.loadings = Loading.service(option)
      this.getMemberById(row.id)
      this.getMemberAndTagMapping()
      // this.memberDetailsDialogVisible = true
    },
    // 根据会员id查询会员标签
    getMemberAndTagMapping() {
      const obj = {}
      obj.name = ''
      obj.level = ''
      obj.pageIndex = 1
      obj.pageSize = 999
      obj.memberId = this.currentMemberId
      obj.handmade = ''
      this.$api.getMemberTagApi.getMemberTagList(obj).then(res => {
        this.selectMemberTagList = res.data
        this.selectMemberTagList = this.selectMemberTagList.filter(item => {
          return item.hasThis === true
        })
        this.memberAndTagMappingList = this.selectMemberTagList
      })
    },
    // 通过id查询会员详情信息
    getMemberById(id) {
      this.$api.getMemberApi.getMemberById(id).then(res => {
        console.log(res)
        this.memberForm = res
        if (this.memberForm.birthday) {
          this.age = this.toAge(this.memberForm.birthday)
        }
        // this.getPlatforms()
        this.getMemberAccountById(id)
        this.getMemberAddressById(id)
      })
    },
    // 根据返回的日期计算间隔
    toAge(timeStamp) {
      const birthDate = this.toDate(timeStamp).substr(0, 4)
      const newDate = new Date().getFullYear()
      return newDate - parseInt(birthDate)
    },
    // 时间戳转日期
    toDate(number) {
      const n = number
      const date = new Date(n)
      const Y = date.getFullYear() + '/'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },
    // 通过id查询会与账号信息
    getMemberAccountById(id) {
      this.$api.getMemberApi.getMemberAccountById(id).then(res => {
        console.log(res)
        this.memberAccountList = res
      })
    },
    // 通过会员id查询 会员信息
    getMemberAddressById(id) {
      this.$api.getMemberApi.getMemberAddressById(id).then(res => {
        console.log(res)
        this.loadings.close()
        this.memberForm.memberAddressList = res
        for (let i = 0; i < this.memberForm.memberAddressList.length; i++) {
          // 处理国家列表
          if (this.memberForm.memberAddressList[i].country) {
            this.$set(this.memberForm.memberAddressList[i], 'countryList', [])
            this.memberForm.memberAddressList[i].countryList.push({ label: '中国', value: '0' })
          }
          // 处理省份列表
          if (this.memberForm.memberAddressList[i].state) {
            this.$set(this.memberForm.memberAddressList[i], 'stateList', [])
            this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].country).then(res => {
              res.map(item => {
                this.memberForm.memberAddressList[i].stateList.push({ label: item.name, value: item.id })
              })
            })
          }
          if (this.memberForm.memberAddressList[i].city) {
            this.$set(this.memberForm.memberAddressList[i], 'cityList', [])
            this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].state).then(res => {
              res.map(item => {
                this.memberForm.memberAddressList[i].cityList.push({ label: item.name, value: item.id })
              })
            })
          }
        }
        this.memberDetailsDialogVisible = true
      })
    },
    // 查看会员账户详情
    viewMemberAccountDetails() {
      this.$message.info('积分域开发进行中')
    },
    // 关闭会员详情弹出框
    closeMemberDetailsDialog() {
      console.log('关闭了会员详情弹出框')
    }
  }
}
</script>
<style scoped lang="scss">
@import '~@/assets/scss/scroll.scss';
.form-content {
  width: 100%;
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
.el-input {
  border: none !important;
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
.el-tag {
  cursor: pointer;
}
.select-condition {
  margin: 5px 0px;
}
.checkbox-wrapper {
  margin-bottom: 20px;
}
.opt-btn {
  margin-bottom: 20px;
}
.select-btn {
  margin-bottom: 20px;
}
.form-content {
  width: 100%;
  height: 500px;
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
  // width: 100%;
  height: 200px;
  margin-left: 20px;
  background: #f7f6fb;
  border-radius: 10px;
}
.el-input {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.el-select {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.form-table-item {
  margin-top: 10px;
}
.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.pre-select-wrapper {
  margin: 20px;
}
.search-form-box-wrapper {
  height: 40px;
  width: 100%;
  display: flex;
}
.el-tag {
  cursor: pointer;
}
.select-condition {
  margin: 5px 0px;
}
.checkbox-wrapper {
  margin-bottom: 20px;
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
.pagination-wrapper {
  display: flex;
  justify-content: space-between;
}
.check-all-box {
  margin-left: 20px;
}
</style>

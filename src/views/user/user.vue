<!--
 * @FileDescription: 用户管理
 * @Author: liupenghui
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-28 14:04:26
 -->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddUserDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchUserFormLabel" :formData="searchUserForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchUser"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchUser" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <div class="channel-table">
      <yp-table :propArr="userListLabel" :listInfo="userList" @updateStatus="updateStatus" :height="height">
        <template v-slot:button="scope">
          <el-button type="text" icon="el-icon-search" v-permission="{ action: 'edit', effect: 'disabled' }" @click="showEditUserDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
          <el-button type="text" icon="el-icon-refresh-left" v-permission="{ action: 'resetPassword', effect: 'disabled' }" @click="resetUserPassword(scope.scope)">{{
            $t('lang.resetpassword')
          }}</el-button>
        </template>
      </yp-table>
    </div>
    <!-- 主表格内容 end -->

    <!-- 用户对话框 (新增与编辑共用) begin -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')"
      :visible.sync="dialogVisible"
      width="50%"
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-form :model="userForm" ref="ypForm" label-width="120px" label-position="right" :rules="userFormRule">
        <div>
          <div v-for="(item, index) in userFormLabel" :key="index">
            <!-- 用于所搜 type 为 input 类型 -->
            <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
              <el-input v-model.trim="userForm[item.prop]" placeholder="" clearable></el-input>
            </el-form-item>
            <!-- 用于所搜 type 为 password 类型 -->
            <el-form-item v-show="isAdd" v-if="item.type === 'pwd'" :label="item.label" :prop="item.prop">
              <el-input type="password" v-model.trim="userForm[item.prop]" placeholder="" clearable></el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'inputcode'" :label="item.label" :prop="item.prop">
              <el-input v-model.trim="userForm[item.prop]" placeholder="" clearable :disabled="isdisabled"></el-input>
            </el-form-item>
            <el-form-item v-if="item.type === 'organizationSelect'" :label="item.label" :prop="item.prop">
              <el-input v-model.trim="userForm[item.prop]" placeholder="" clearable @focus="selectOrganizationButton"></el-input>
            </el-form-item>
            <!-- 用于选择组织对话框 end -->
            <!-- 用于性别的显示 -->
            <el-form-item v-if="item.type === 'render'" :label="item.label" :prop="item.prop">
              <span v-for="itemtwo in item.prop" :key="itemtwo.id">{{ userForm[itemtwo.props] }}</span>
            </el-form-item>
            <!-- 用于性别的显示 end -->
            <!-- 用于上传图片 -->
            <el-form-item v-if="item.type === 'img'" :label="item.label">
              <yp-single-upload utype="userAvatar" :url.sync="userForm[item.prop]"></yp-single-upload>
            </el-form-item>
            <!-- 用于上传图片 end -->
            <!-- 用于角色与性别 -->
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="userForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
              <template>
                <slot name="select"></slot>
              </template>
            </el-form-item>
            <el-form-item v-if="item.type === 'selectroleids'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="userForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
              <template>
                <slot name="select"></slot>
              </template>
            </el-form-item>
            <!-- 用于角色与性别 end -->
            <!-- 用于状态 begin -->
            <el-form-item v-if="item.type === 'switch'" :label="item.label">
              <el-switch v-model="userForm[item.prop]" :disabled="item.disabled ? true : false"></el-switch>
            </el-form-item>
            <!-- 用于状态 end -->
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'edit', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 用户对话框 (新增与编辑共用) end -->

    <!-- 所属组织对话框 begin -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      :title="organizationTitle"
      :visible.sync="selectOrganizationDialog"
      width="60%"
      :close-on-click-modal="false"
      @close="closeSelectDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ organizationTitle }}
        </div>
      </template>
      <div>
        <!-- 所属组织对话框搜索区域 start -->
        <div style="display:flex;">
          <div style="margin-left:-70px;">
            <el-form :model="selectOrganizationForm" label-width="120px" label-position="right" class="search-form-wrapper">
              <div class="form-content" style="display:flex;">
                <div v-for="(item, index) in selectOrganizationFormLabel" :key="index">
                  <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                    <el-input v-model.trim="selectOrganizationForm[item.prop]" :placeholder="item.placeholder" clearable></el-input>
                  </el-form-item>
                  <el-form-item v-if="item.type === 'selectOrg'" :label="item.label">
                    <el-select filterable v-model="selectOrganizationForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false">
                      <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                    </el-select>
                  </el-form-item>
                </div>
              </div>
            </el-form>
          </div>
          <div style="display:flex;flex:1;flex-direction:row-reverse;align-items:center;margin-bottom:20px;">
            <span style="margin-left:10px;">
              <el-button
                class="reset-btn"
                :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
                @click="resetSearchOrganization"
                size="mini"
                icon="el-icon-refresh-left"
                >{{ this.$t('lang.reset') }}</el-button
              >
            </span>
            <span style="margin-right:10px;">
              <el-button class="search-btn" type="primary" @click="searchOrganization" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
            </span>
          </div>
        </div>
        <!-- 所属组织对话框搜索区域 end -->

        <!-- 组织对话框中的表格 start -->
        <div>
          <el-table
            :data="getTreeList"
            stripe
            border
            :default-expand-all="true"
            max-height="500"
            highlight-current-row
            row-key="id"
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            :tree-props="{ children: 'organizations' }"
          >
            <!-- 循环表格标签以及类型 -->
            <el-row v-for="(item, index) in selectOrganizationListLabel" :key="index">
              <el-table-column v-if="item.type === 'checked'" width="100" align="center" :label="item.label">
                <template slot-scope="scope">
                  <el-radio @change="selectOrganizationCheck(scope.row)" v-model="radio" :label="scope.row.code">{{&nbsp;}}</el-radio>
                </template>
              </el-table-column>
              <!-- 显示默认值 -->
              <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
            </el-row>
          </el-table>
        </div>
        <!-- 组织对话框中的表格 end -->
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="selectOrganizationDialog = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="selectOrganizationDialog = false">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 所属组织对话框 end  -->

    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchUserForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchUserForm.pageSize"
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
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
export default {
  components: {
    YpTable,
    YpSearchForm,
    YpSingleUpload
  },
  computed: {
    // 头部搜索表单的内容
    searchUserFormLabel() {
      return [
        { label: '姓名：', type: 'input', prop: 'realName', placeholder: '账号或真实姓名' },
        { label: this.$t('lang.organization') + ':', type: 'input', prop: 'organization', placeholder: '组织编码' },
        { label: this.$t('lang.role') + ':', type: 'input', prop: 'role', placeholder: '角色名称' },
        {
          label: this.$t('lang.status') + ':',
          type: 'select',
          // placeholder: '有效/无效',
          prop: 'status',
          options: [
            { label: this.$t('lang.effective'), value: true },
            { label: this.$t('lang.invalid'), value: false }
          ]
        }
      ]
    },
    // 主表格的内容
    userListLabel() {
      return [
        { type: 'operation', label: this.$t('lang.operation') },
        { type: 'index', label: this.$t('lang.ordernumber') },
        { props: 'code', label: this.$t('lang.accountnumber') },
        { props: 'realName', label: this.$t('lang.fullname') },
        {
          type: 'status',
          props: 'gender',
          label: this.$t('lang.gender'),
          render: row => {
            if (row.gender === '2') {
              return '女'
            } else if (row.gender === '1') {
              return '男'
            } else {
              return '未知'
            }
          }
        },
        { props: 'organizationName', label: this.$t('lang.organization') },
        {
          props: 'roleBaseDtoList',
          label: this.$t('lang.role'),
          type: 'array',
          render: res => {
            if (res.roleBaseDtoList) {
              return res.roleBaseDtoList.join('；')
            } else {
              return ''
            }
          }
        },
        { type: 'switch', props: 'status', label: this.$t('lang.status'), method: 'updateStatus' },
        { props: 'phone', label: '手机号' },
        { props: 'lastLoginAt', label: this.$t('lang.lastlogintime'), type: 'time', width: '200' }
      ]
    },
    // 对话框表单内容
    userFormLabel() {
      return [
        { label: this.$t('lang.accountnumber') + '：', type: 'inputcode', prop: 'code' },
        { label: this.$t('lang.password') + '：', type: 'pwd', prop: 'password' },
        { label: this.$t('lang.fullname') + '：', type: 'input', prop: 'realName' },
        {
          label: this.$t('lang.gender') + '：',
          type: 'select',
          prop: 'gender',
          options: [
            { label: '未知', value: '0' },
            { label: '男', value: '1' },
            { label: '女', value: '2' }
          ]
        },
        {
          label: this.$t('lang.contactinformation') + '：',
          type: 'input',
          prop: 'phone'
        },
        {
          label: this.$t('lang.email') + '：',
          type: 'input',
          prop: 'email'
        },
        { label: this.$t('lang.profilepicture') + '：', type: 'img', prop: 'avatar' },
        {
          label: this.$t('lang.role') + '：',
          type: 'select',
          prop: 'roleIds',
          options: this.roleFormListArr,
          multiple: true
        },
        {
          label: this.$t('lang.organization') + '：',
          type: 'organizationSelect',
          prop: 'organizationCode',
          disabled: true
        },
        { type: 'button', btnname: '选择组织' },
        { label: this.$t('lang.status') + '：', type: 'switch', prop: 'status' }
      ]
    },
    // 选择组织表格
    selectOrganizationListLabel() {
      return [
        // 组织名称
        { props: 'name', label: this.$t('lang.organizationname') },
        { type: 'checked', props: 'checked', label: '选择', prop: 'label' },
        { props: 'code', label: this.$t('lang.organizationcode') },
        { props: 'organizationTypeName', label: this.$t('lang.organizationtype') }
      ]
    },
    // 组织搜索表单内容
    selectOrganizationFormLabel() {
      return [
        { label: '组织', type: 'input', prop: 'code', placeholder: '组织名称或编码' },
        { label: this.$t('lang.organizationtype'), type: 'selectOrg', prop: 'organizationTypeId', options: this.getOrganizationTypesIdArr }
      ]
    }
  },

  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
      // 提示接口地址要换 状态：未换
      // 这句话不用复制 ：   方法中传参数  一个是输入值 ，一个是当前的id  ，在点击新增的时候，弹框方法中将此值赋值为 空字符串 ，点击编辑的时候，将传过去的值 赋值给当前id
      this.$api.getUserApi.getCheckName(`${value}`, this.currentUserId).then(res => {
        if (!res) {
          return cb()
        } else {
          cb(new Error(this.$t('lang.usercodehad')))
        }
      })
    }
    // 校验手机号规则
    const checkPhone = (rule, value, cb) => {
      const phoneRegMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      const telRegMobile = /^0\d{2,3}-?\d{7,8}$/
      if (phoneRegMobile.test(value) | telRegMobile.test(value)) {
        cb()
      } else {
        cb(Error(this.$t('lang.truephone')))
      }
    }
    // 邮箱校验规则
    const checkEmail = (rule, value, cb) => {
      const email = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (value !== '') {
        if (!email.test(value)) {
          return cb(Error('请输入正确的邮箱格式'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    return {
      radio: '',
      // 用来接受递归之后的数据（用于选择值对话框里面的表格数据）
      getTreeList: [],
      itemprops: false,
      editobj: {},
      // 用来解决对话框的编码显示问题
      obj: {},
      // 获取表格角色
      getTabelRoles: [],
      // 头部搜索表单的假数据
      searchUserForm: {
        pageIndex: 1,
        pageSize: 20,
        realName: '',
        organization: '',
        role: '',
        status: ''
      },
      // 用户对话框内容（编辑与新增）
      userForm: {
        code: '',
        password: '',
        realName: '',
        gender: '1',
        phone: '',
        email: '',
        avatar: '',
        roleIds: [],
        organizationCode: '',
        status: false
      },
      // 选择组织对话框搜索表单内容
      selectOrganizationForm: {
        code: '',
        organizationTypeId: ''
      },
      // 用于接受接受组织类型里面的Id
      getOrganizationTypesIdArr: [],
      getOrganizationTypesId: [],
      // 控制账号输入框的disabled
      isdisabled: false,
      // 用来接受组织类型（用于选择组织对话框）
      getorganizationTypeNameArr: [],
      getorganizationTypeName: [],
      // 用于进行账号的唯一性校验
      currentUserId: '',
      // 用来进行判断对话框的显示提示标题内容
      isAdd: true,
      // 所属组织对话框提示内容
      organizationTitle: this.$t('lang.selectorganization'),
      // 接受角色所搜数组
      TableRoleArr: [],
      TableRole: [],
      // 接受角色数据
      roleIds: [],
      // 取出组织对话数据
      selectOrganizationList: [],
      // 组织对话框
      selectOrganizationDialog: false,
      // 接受表单内容
      roleFormList: [],
      roleFormListArr: [],
      // 分页的总条数
      total: 10,
      // 接受mock里面的数据
      userList: [],

      // 我是对话框的内容
      dialogVisible: false,
      // 组织类型表单校验规则
      userFormRule: {
        // 真实姓名的校验规则
        realName: [{ required: true, message: this.$t('lang.enternickname'), trigger: 'blur' }],
        // 手机号校验规则
        phone: [
          { required: true, message: this.$t('lang.phoneisnotnull'), trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        // 邮箱校验规则
        email: [{ validator: checkEmail, trigger: 'blur' }],
        // 账号的校验规则
        code: [
          { required: true, message: this.$t('lang.entermember'), trigger: 'blur' },
          { validator: checkName, trigger: 'blur' }
        ],
        // 性别的校验规则
        gender: [{ required: true, message: '性别不可为空', trigger: 'blur' }],
        // 所属组织的校验规则
        organizationCode: [{ required: true, message: '所属组织不可为空', trigger: 'blur' }]
      }
    }
  },
  created() {
    this.getUserList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 选择组织对话框关闭之后所触发的事件
    closeSelectDialog() {
      this.getOrganizationTypesIdArr = []
      // this.getOrganizationManagementList()
    },
    // 更新组织类型的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getUserList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.getUserApi.getUserListById(val.id).then(res => {
          res.roleIds = []
          if (res.roleBaseDtoList) {
            for (var i = 0; i < res.roleBaseDtoList.length; i++) {
              res.roleIds.push(res.roleBaseDtoList[i].id)
            }
          } else {
            res.roleIds = []
          }
          res.status = !res.status
          this.$api.putUserApi.putUserStatus(res.id, res).then(res => {
            if (res.code === '200000') {
              this.getUserList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            }
          })
        })
      }
    },
    // 关闭对话框时触发条件
    closeDialog() {
      this.$refs.ypForm.resetFields()
      this.roleFormListArr = []
      this.userForm = {
        code: '',
        password: '',
        realName: '',
        gender: '1',
        phone: '',
        email: '',
        avatar: '',
        roleIds: [],
        organizationCode: '',
        status: false
      }
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchUserForm.pageSize = newPage
      this.getUserList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchUserForm.pageIndex = newPage
      this.getUserList()
    },
    // 搜索用户
    searchUser() {
      this.searchUserForm.pageIndex = 1
      this.getUserList()
    },
    // 组织对话框中表格获取数据（注意：获取的数据的数据类型是树形结构）
    getOrganizationManagementList() {
      this.getTreeList = []
      this.$api.getOrganizationManagementApi.getorganizationManagementsList(this.selectOrganizationForm).then(res => {
        this.selectOrganizationList = this.getTreeData(res)
      })
    },
    // 递归函数（用于打开所选组织对话框之后，挑出来数据）
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        this.getTreeList.push({ code: data[i].code, name: data[i].name, organizationTypeName: data[i].organizationTypeName })
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = undefined
        } else {
          // organizations若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].organizations)
        }
      }
      return data
    },
    // 选中选择组织对话框之后跳出对话框（触发的是 foucs 事件 ）
    selectOrganizationButton() {
      this.getorganizationTypeName = []
      this.getTreeList = []
      this.getOrganizationTypeId()
      this.getOrganizationManagementList()
      this.itemprops = false
      this.selectOrganizationDialog = true
      // }
    },
    // 获取角色数据列表
    getRoleList() {
      this.roleFormListArr = []
      this.$api.getUserApi.getRoleList().then(res => {
        this.roleFormList = res.data
        this.roleFormList.map((item, index) => {
          this.roleFormListArr.push({ value: item.id, label: item.name })
        })
      })
    },
    // 从后台获取数据
    getUserList() {
      this.$api.getUserApi.getUserList(this.searchUserForm).then(res => {
        console.log(res)
        this.userList = res.data
        this.total = res.total
        for (var i = 0; i < this.userList.length; i++) {
          if (this.userList[i].roleBaseDtoList) {
            for (var j = 0; j < this.userList[i].roleBaseDtoList.length; j++) {
              this.userList[i].roleBaseDtoList[j] = this.userList[i].roleBaseDtoList[j].name
            }
          }
        }
      })
    },
    // 编辑用户
    showEditUserDialog(val) {
      this.obj = { value: val.organizationCode, label: val.organizationName }
      // 当点击编辑时，用来进行对选择组织对话款进行获取数据
      this.$api.getOrganizationManagementApi.getorganizationManagementsListByCode(val.organizationCode).then(res => {
        console.log(res)
        // const objValue = []
        res.map(item => {
          console.log(item)
          this.radio = item.code
        })
        console.log(this.radio)
        // objValue.value = res.code
        // objValue.label = res.name
        // this.userForm.organizationCode = objValue.name
        // console.log(objValue)
        // this.radio = res.code
        // console.log(this.radio)
      })
      this.getRoleList()
      this.isAdd = false
      this.isdisabled = true
      this.getUserListById(val.id)
      this.dialogVisible = true
    },
    // 根据 id 获取某一条数据
    getUserListById(id) {
      // 用户里根据 id 来获取某一条数据
      this.currentUserId = id
      this.$api.getUserApi.getUserListById(id).then(res => {
        console.log(res)
        this.editobj.value = res.organizationCode
        this.editobj.label = res.organizationName
        console.log(this.editobj)
        res.roleIds = []
        this.userForm = res
        if (res.roleBaseDtoList) {
          for (var i = 0; i < res.roleBaseDtoList.length; i++) {
            this.userForm.roleIds.push(res.roleBaseDtoList[i].id)
          }
        }
        console.log(this.editobj.label + '我是所属组织所展现出来的数据')
        this.userForm.organizationCode = this.editobj.label
      })
    },
    // 新增用户
    showAddUserDialog() {
      this.radio = ''
      this.currentUserId = ''
      // 判断显示框是否为新增或编辑
      this.isAdd = true
      this.isdisabled = false
      this.getRoleList()
      this.dialogVisible = true
    },
    // 重置密码
    async resetUserPassword(item) {
      const confirmResult = await this.$confirm('此操作将密码设置为初始密码, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您取消了重置')
      } else {
        this.$api.putUserApi.putUserPwd(item.id).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.getRoleList()
          }
        })
      }
    },
    // 重置搜索条件按钮
    resetSearchOrganization() {
      this.selectOrganizationForm = {
        code: '',
        organizationTypeId: ''
      }
      this.getOrganizationManagementList()
    },
    // 获取组织管理数据（用于选择组织对话框中的搜索按钮，是从组织管理里面获取到的）
    // getOrganzaitionsManagement() {
    //   this.$api.getOrganizationManagementApi.getorganizationManagementsList(this.selectOrganizationForm).then(res => {
    //   })
    // },
    // 获取组织类型里面的 id，用于与组织管理里面的 OrganizationId 来进行比较（获取到的是 状态为 true 的所有组织类型）
    getOrganizationTypeId() {
      this.$api.getOrganizationTypeApi.getOrganizationTypeId().then(res => {
        this.getOrganizationTypesId = res.data
        this.getOrganizationTypesId.map(item => {
          this.getOrganizationTypesIdArr.push({ value: item.id, label: item.name })
        })
      })
    },
    // 搜索选择组织阿按钮
    searchOrganization() {
      this.getOrganizationManagementList()
    },
    // 单选按钮所触发的事件（用于选择组织对话框中单选按钮并选择值）
    selectOrganizationCheck(item) {
      // 用来进行对新增时，进行对对话框里面的所选组织来进行code与name之间的转换
      this.obj.value = item.code
      this.obj.label = item.name
      this.userForm.organizationCode = this.obj.label
      console.log(item)
    },
    // 确定新增与编辑按钮
    confirm() {
      this.$refs.ypForm.validate(async valid => {
        if (!valid) return
        if (this.isAdd) {
          this.userForm.organizationCode = this.obj.value
          this.$api.postUserApi.postUserList(this.userForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getUserList()
              this.dialogVisible = false
            }
          })
        } else {
          // console.log(this.obj)
          this.userForm.organizationCode = this.obj.value
          if (this.userForm.organizationCode !== '') {
            this.$api.putUserApi.putUserList(this.userForm).then(res => {
              if (res.code === '200000') {
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.getUserList()
                this.dialogVisible = false
              }
            })
          }
        }
      })
    },
    // 重置表头表单（用户表头重置）
    resetSearchUser() {
      this.searchUserForm = {
        pageIndex: 1,
        pageSize: 20,
        realName: '',
        organization: '',
        role: '',
        status: ''
      }
      this.getUserList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

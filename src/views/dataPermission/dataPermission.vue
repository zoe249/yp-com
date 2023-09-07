<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddDataPermissionDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchDataPermissionFormLabel" :formData="searchDataPermissionForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchDataPermission"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchDataPermission" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 数据权限表格 start -->
    <yp-table :propArr="dataPermissionListLabel" :listInfo="dataPermissionList" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditDataPermissionDialog(scope.scope)">{{
          $t('lang.viewDetails')
        }}</el-button>
        <el-button type="text" icon="el-icon-delete" v-permission="{ action: 'delete', effect: 'disabled' }" @click="deleteDataPermission(scope.scope)">{{ $t('lang.delete') }}</el-button>
      </template>
    </yp-table>
    <!-- 数据权限表格 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchDataPermissionForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchDataPermissionForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 数据权限对话框 begin -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      :title="isAdd ? this.$t('lang.add') : this.$t('lang.viewDetails')"
      :visible.sync="dialogVisible"
      width="50%"
      v-dialogDrag
      @close="closeDialog"
      :close-on-click-modal="false"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-form :model="dataPermissionForm" ref="ypForm" label-width="120px" label-position="right" :rules="dataPermissionFormRule">
        <div>
          <div v-for="(item, index) in dataPermissionFormLabel" :key="index">
            <!-- 用于对话框中的账号 begin -->
            <el-form-item v-if="item.type === 'selectCode'" :label="item.label" :prop="item.prop">
              <el-select v-model="dataPermissionForm[item.prop]" :disabled="item.disabled ? true : false" :multiple="item.multiple" filterable placeholder="请选择或输入账号">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.value" :value="selectItem.value">
                  <span style="float: left">{{ selectItem.value }}</span>
                  <span style="float: right; color: #8492a6; font-size: 13px">{{ selectItem.label }}</span>
                </el-option>
              </el-select>
            </el-form-item>
            <!-- 用于对话框中的账号 end -->
            <!-- 用于对话框中的许可组织类型 start -->
            <el-form-item v-if="item.type === 'selectOrganzationType'" :label="item.label" :prop="item.prop">
              <el-select v-model="dataPermissionForm[item.prop]" :disabled="item.disabled ? true : false" :multiple="item.multiple" @change="changeSelectOrganizationType" filterable clearable>
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 用于对话框中的许可组织类型 end -->
            <!-- 用于对话框中的许可组织 begin -->
            <el-form-item v-if="item.type === 'selectOrganization'" :label="item.label" :prop="item.prop">
              <el-select v-model="dataPermissionForm[item.prop]" :disabled="item.disabled ? true : false" :multiple="item.multiple" @change="changeSelectOrganization" filterable clearable>
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <!-- 用于对话框中的许可组织 end -->
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'viewDetails', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 数据权限对话框 end -->
  </div>
</template>

<script>
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpTable,
    YpSearchForm
  },
  data() {
    // 验证用户账号是否存在
    var checkUserCode = (rule, value, cb) => {
      if (value !== '') {
        if (this.dataPermissionForm.userCode === '') {
          return cb(new Error('先选择账号信息'))
        } else {
          return cb()
        }
      }
    }
    return {
      // 控制数据权限数据的总条数
      total: 0,
      // 判断新增与编辑对话框的提示内容
      isAdd: true,
      // 用来接收后端表格的数据
      dataPermissionList: [],
      // 搜索数据表单数据
      searchDataPermissionForm: {
        pageIndex: 1,
        pageSize: 20,
        code: '',
        organization: ''
      },
      userList: [], // 获取所有用户列表数据
      selectUserList: [], // 下拉选择所有用户列表数据
      organizationTypeList: [], // 获取所有组织类型列表数据
      selectOrganizationTypeList: [], // 下拉选择所有用户列表数据
      permissionOrganizationList: [], // 获取渠道或者组织管理中的列表数据
      selectPermissionOrganizationList: [], // 下拉选择渠道或者组织管理列表数据
      // 数据权限对话框表单数据
      dataPermissionForm: {
        userCode: '',
        permissionOrganizationTypeId: '',
        permissionOrganizationId: ''
      },
      dataPermissionFormRule: {
        userCode: [{ required: true, message: '请选择账户', trigger: 'blur' }],
        permissionOrganizationTypeId: [
          { required: true, message: '请选择许可组织类型', trigger: 'blur' },
          {
            validator: checkUserCode,
            trigger: 'change'
          }
        ],
        permissionOrganizationId: [{ required: true, message: '请选择许可组织', trigger: 'blur' }]
      },
      // 新增与编辑对话框的显示与否
      dialogVisible: false
    }
  },
  computed: {
    // 查询数据权限的表单标签
    searchDataPermissionFormLabel() {
      return [
        { label: this.$t('lang.accountnumber') + ':', prop: 'code', type: 'input', placeholder: '账号或姓名' },
        { label: this.$t('lang.licensingorganizations') + ':', prop: 'organization', type: 'input', placeholder: '组织账号或名称' }
      ]
    },
    // 新增或编辑数据权限表单标签
    dataPermissionFormLabel() {
      return [
        { label: this.$t('lang.accountnumber') + ':', type: 'selectCode', prop: 'userCode', options: this.selectUserList, disabled: !this.isAdd },
        {
          type: 'selectOrganzationType',
          label: this.$t('lang.licenseorganizationype') + ':',
          prop: 'permissionOrganizationTypeId',
          options: this.selectOrganizationTypeList
        },
        {
          label: this.$t('lang.licensingorganizations') + ':',
          type: 'selectOrganization',
          prop: 'permissionOrganizationId',
          options: this.selectPermissionOrganizationList
        }
      ]
    },
    // 数据权限数据列表标签
    dataPermissionListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation', width: '180' },
        { label: this.$t('lang.ordernumber'), type: 'index' },
        { label: this.$t('lang.accountnumber'), props: 'userCode' },
        { label: '姓名', props: 'realName' },
        {
          label: this.$t('lang.organization'),
          type: 'codeName',
          props: 'organizationCode',
          render: res => {
            return res.organizationCode + '-' + res.organizationName
          }
        },
        { label: this.$t('lang.licenseorganizationype'), props: 'permissionOrganizationTypeName' },
        { label: this.$t('lang.licensingorganizations'), props: 'permissionOrganizationName' },
        { label: this.$t('lang.creationtime'), props: 'createTime', type: 'time', width: '180' },
        { label: this.$t('lang.creator'), props: 'createBy' },
        { label: this.$t('lang.modificationtime'), props: 'updateTime', type: 'time', width: '180' },
        { label: this.$t('lang.reviser'), props: 'updateBy' }
      ]
    }
  },

  created() {
    this.getDataPermissionList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 删除数据权限
    async deleteDataPermission(res) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.deleteDataPermissionApi.deleteDataPermission(res.id).then(res => {
          if (res.code === '200000') {
            this.getDataPermissionList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        })
      }
    },
    // 关闭对话框时触发条件
    closeDialog() {
      // 控制对话框里面的账号，每次关闭时，刷新
      this.$refs.ypForm.resetFields()
      this.dataPermissionForm = {
        userCode: '',
        permissionOrganizationTypeId: '',
        permissionOrganizationId: ''
      }
    },
    // 查询数据权限方法
    searchDataPermission() {
      this.getDataPermissionList()
    },
    // 切换分页条数方法
    handleSizeChange(newPage) {
      this.searchDataPermissionForm.pageSize = newPage
      this.getDataPermissionList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchDataPermissionForm.pageIndex = newPage
      this.getDataPermissionList()
    },
    // 获取数据权限列表数据
    getDataPermissionList() {
      this.$api.getDataPermissionApi.getDataPermissionsList(this.searchDataPermissionForm).then(res => {
        console.log(res)
        this.dataPermissionList = res.data
        this.total = res.total
      })
    },
    // 编辑数据权限弹出框
    showEditDataPermissionDialog(res) {
      this.permissionOrganizationList = []
      this.selectPermissionOrganizationList = []
      this.isAdd = false
      if (res.permissionOrganizationTypeId === '111111') {
        this.getCurrentChannelById(res.permissionOrganizationId)
        this.getDataPermissionListById(res.id)
      } else {
        this.getCurrentOrganizationManagementById(res.permissionOrganizationId)
        this.getDataPermissionListById(res.id)
      }
    },
    // 编辑时特殊处理用于显示许可组织
    getCurrentOrganizationManagementById(id) {
      this.$api.getOrganizationManagementApi.getOrganizationManagementById(id).then(res => {
        this.permissionOrganizationList.push(res)
        this.permissionOrganizationList.map(item => {
          this.selectPermissionOrganizationList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 编辑时特殊处理用于显示当前渠道label
    getCurrentChannelById(id) {
      this.$api.getChannelApi.getChannelById(id).then(res => {
        this.permissionOrganizationList.push(res)
        this.permissionOrganizationList.map(item => {
          this.selectPermissionOrganizationList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 根据 id 获取 数据权限信息
    getDataPermissionListById(id) {
      this.$api.getDataPermissionApi.getDataPermissionsListById(id).then(res => {
        this.getUserList()
        this.getOrganizationTypeList()
        this.dataPermissionForm = res
        if (res.permissionOrganizationTypeId === '111111') {
          this.getChannelList()
        } else {
          this.getOrganizationManagementList()
        }
        this.dialogVisible = true
      })
    },
    // 新增数据权限弹出框
    showAddDataPermissionDialog() {
      this.permissionOrganizationList = []
      this.selectPermissionOrganizationList = []
      this.getUserList()
      this.getOrganizationTypeList()
      this.isAdd = true
      this.dialogVisible = true
    },
    // 获取用户数据
    getUserList() {
      this.userList = []
      this.selectUserList = []
      const obj = {
        pageIndex: 1,
        pageSize: 999,
        realName: '',
        organization: '',
        role: '',
        status: ''
      }
      this.$api.getUserApi.getUserList(obj).then(res => {
        this.userList = res.data
        this.userList.map(item => {
          this.selectUserList.push({ value: item.code, label: item.realName })
        })
      })
    },
    // 获取组织类型列表数据
    getOrganizationTypeList() {
      this.organizationTypeList = []
      this.selectOrganizationTypeList = []
      const obj = {
        name: '',
        status: true,
        pageIndex: 1,
        pageSize: 999,
        judgeRelation: false,
        isPermission: true,
        includeTop: true
      }
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(obj).then(res => {
        this.organizationTypeList = res.data
        this.organizationTypeList.map(item => {
          this.selectOrganizationTypeList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 查询渠道列表方法
    getChannelList() {
      this.permissionOrganizationList = []
      // this.selectPermissionOrganizationList = []
      const obj = {
        name: '',
        status: true,
        userCode: this.dataPermissionForm.userCode
      }
      this.$api.getChannelApi.getChannelList(obj).then(res => {
        this.permissionOrganizationList = res
        this.permissionOrganizationList.map(item => {
          this.selectPermissionOrganizationList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 查询组织管理列表
    getOrganizationManagementList() {
      this.permissionOrganizationList = []
      // this.selectPermissionOrganizationList = []
      const obj = {
        pageIndex: 1,
        pageSize: 999,
        code: '',
        organizationTypeId: this.dataPermissionForm.permissionOrganizationTypeId,
        formats: '',
        parent: '',
        excludeUser: true,
        userCode: this.dataPermissionForm.userCode,
        publish: true
      }
      this.$api.getOrganizationManagementApi.getOrganizationManagementsList(obj).then(res => {
        this.permissionOrganizationList = res
        this.permissionOrganizationList.map(item => {
          this.selectPermissionOrganizationList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 选择许可组织
    changeSelectOrganization(val) {
      if (this.dataPermissionForm.permissionOrganizationTypeId === '') {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先搜索或选择许可组织类型',
          type: 'warning'
        })
        this.dataPermissionForm.permissionOrganizationId = ''
      }
    },
    // 选择组织类型，查询渠道或许可
    changeSelectOrganizationType(val) {
      if (this.dataPermissionForm.userCode === '') {
        val = ''
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先搜索或选择账号',
          type: 'warning'
        })
        this.dataPermissionForm.permissionOrganizationTypeId = ''
      }
      this.permissionOrganizationList = []
      this.dataPermissionForm.permissionOrganizationId = ''
      this.selectPermissionOrganizationList = []
      if (val === '111111') {
        // 请求渠道列表
        this.getChannelList()
      } else {
        // 请求组织管理
        this.dataPermissionForm.permissionOrganizationTypeId = val
        this.getOrganizationManagementList()
      }
    },
    // 确定新增
    confirm() {
      this.$refs.ypForm.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postDataPermissionApi.postDataPermission(this.dataPermissionForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getDataPermissionList()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putDataPermissionApi.putDataPermission(this.dataPermissionForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getDataPermissionList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 重置
    resetSearchDataPermission() {
      this.searchDataPermissionForm = {
        pageIndex: 1,
        pageSize: 20,
        code: '',
        organization: ''
      }
      this.getDataPermissionList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

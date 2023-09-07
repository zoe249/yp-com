<!--
 * @FileDescription: 角色管理
 * @Author: qiaokun
 * @Date: 2020-12-04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-06 15:43:07
 -->
<template>
  <div>
    <!-- 添加角色 -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddRoleDialog" v-permission="{ action: 'add', effect: 'disabled' }">{{ $t('lang.add') }}</el-button>
    <!-- 列表数据 -->
    <yp-table :listInfo="roleList" :propArr="roleListLabel" :height="height" :expand="true">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'edit', effect: 'disabled' }" @click="showEditRoleDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <el-button type="text" icon="el-icon-delete" v-permission="{ action: 'delete', effect: 'disabled' }" @click="deleteRole(scope.scope)">{{ $t('lang.delete') }} </el-button>
      </template>
    </yp-table>
    <!-- 分页 -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="queryInfo.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="queryInfo.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 添加或编辑 -->
    <!-- close-on-click-modal：当为 false 的时候，点击空白的地方的时候，对话框不会消失，当为 true 的时候，点击空白的地方对话框会消失 -->
    <!-- <el-dialog v-dialogDrag :close-on-click-modal="false" :title="isAdd ? $t('lang.add') : $t('lang.edit')" :visible.sync="dialogVisible" width="60%" @close="closeDialog"> -->
    <el-dialog
      v-dialogDrag
      :lock-scroll="false"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')"
      :visible.sync="dialogVisible"
      width="60%"
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-main style="height:500px;" class="scoll">
        <yp-form :formData="roleForm" :formLabel="roleFormLabel" :formRule="roleFormRule" ref="ypForm"></yp-form>
      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
// 表单组价导入
import YpForm from '@/components/form/YpForm.vue'
// 表格组件导入
import YpTable from '@/components/table/YpTable.vue'
export default {
  components: {
    YpTable,
    YpForm
  },
  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        this.$api.getRoleApi.getCheckName(`${value}`, this.currentRoleId).then(res => {
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      currentRoleId: '',
      queryInfo: {
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      checkStrictly: true,
      checkedId: [], // 选中的角色id
      defaultProps: {
        children: 'permissions',
        label: 'name',
        id: 'id'
      },
      treePermissionList: [], // 树形权限列表
      isAdd: true, // 判断是否是新增，默认新增
      dialogVisible: false, // 判断弹出框是显示还是隐藏，默认隐藏
      roleList: [], // 角色列表数据
      permissionList: [],
      roleForm: {
        name: '',
        description: '',
        permissionIds: []
      },
      roleFormRule: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    roleListLabel() {
      return [
        {
          props: 'operation',
          label: this.$t('lang.operation'),
          type: 'operation',
          operationList: [
            { type: 'text', label: this.$t('lang.edit'), icon: 'el-icon-edit-outline', methods: 'edit', actions: { aciton: 'edit' } },
            { type: 'text', label: this.$t('lang.delete'), icon: 'el-icon-delete', methods: 'delete', actions: { aciton: '' } }
          ]
        },
        {
          type: 'index',
          props: '',
          label: this.$t('lang.ordernumber')
        },
        {
          props: 'name',
          label: this.$t('lang.name')
        },
        {
          props: 'description',
          label: this.$t('lang.description')
        }
      ]
    },
    roleFormLabel() {
      return [
        {
          label: this.$t('lang.rolename') + '：',
          prop: 'name',
          type: 'input',
          maxLength: '10',
          placeholder: '请输入名称角色'
        },
        {
          label: this.$t('lang.description') + '：',
          prop: 'description',
          type: 'input',
          placeholder: '请输入描述'
        },
        {
          label: this.$t('lang.functionauthority') + '：',
          prop: 'permissionIds',
          type: 'tree',
          options: this.treePermissionList,
          checkedId: this.checkedId,
          defaultProps: this.defaultProps,
          checkStrictly: this.checkStrictly
        }
      ]
    }
  },
  created() {
    this.getRoleList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 235 + 'px'
      console.log(this.height)
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.queryInfo.pageSize = newPage
      this.getRoleList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.queryInfo.pageIndex = newPage
      this.getRoleList()
    },
    // 获取角色列表数据
    async getRoleList() {
      const res = await this.$api.getRoleApi.getRoleList(this.queryInfo)
      this.total = res.total
      this.roleList = res.data
    },
    // 新增角色弹出框
    showAddRoleDialog() {
      this.currentRoleId = ''
      this.isAdd = true
      this.getPermissionList()
    },
    getPermissionList() {
      this.$api.getPermissionApi.getPermissionList().then(res => {
        this.treePermissionList = res
        // 新增
        if (this.isAdd) {
          this.checkedId = []
          this.checkStrictly = false
          this.dialogVisible = true
        }
        // 编辑
        if (!this.isAdd) {
          this.checkStrictly = true
          this.$api.getRoleApi.getRoleById(this.currentRoleId).then(res => {
            this.roleForm = res
            this.checkedId = res.permissionIds
            this.$nextTick(() => {
              this.$refs.ypForm.$refs.tree[0].setCheckedKeys(this.checkedId)
              this.checkStrictly = false
            })
            this.dialogVisible = true
          })
        }
      })
    },
    showEditRoleDialog(row) {
      this.isAdd = false
      this.currentRoleId = row.id
      this.getPermissionList()
    },
    async deleteRole(row) {
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
        const res = await this.$api.deleteRoleApi.deleteRole(row.id)
        if (res.code === '200000') {
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.getRoleList()
        }
      }
    },
    // 关闭弹框
    closeDialog() {
      this.checkedId = []
      this.$refs.ypForm.resetForm()
      this.roleForm = {
        name: '',
        description: '',
        permissionIds: []
      }
    },
    // 确认
    confirm() {
      this.$refs.ypForm.$refs.formRef.validate(async valid => {
        if (!valid) return
        this.checkedId = this.$refs.ypForm.$refs.tree[0].getCheckedNodes().map(item => {
          return (item = item.id)
        })
        this.checkedId.push(...this.$refs.ypForm.$refs.tree[0].getHalfCheckedKeys())
        this.roleForm.permissionIds = this.checkedId
        if (this.isAdd) {
          const res = await this.$api.postRoleApi.postRole(this.roleForm)
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
            this.getRoleList()
          }
        }
        // 编辑接口
        if (!this.isAdd) {
          const res = await this.$api.putRoleApi.putRole(this.currentRoleId, this.roleForm)
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
            this.getRoleList()
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
@import '~@/assets/scss/common/role.scss';
</style>

<!--
 * @FileDescription: 菜单管理
 * @Author: qiaokun
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-08 15:42:52
 -->
<template>
  <div>
    <!-- 添加应用按钮区域 start  -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddPermissionDialog" v-permission="{ action: 'add', effect: 'disabled' }">{{ this.$t('lang.add') }}</el-button>
    <!-- <el-button type="primary" @click="showAddPermissionDialog()" v-permission="{ action: 'add', effect: 'disabled' }">{{ $t('lang.add') }}</el-button> -->
    <!-- 添加应用按钮区域 end  -->
    <!-- 菜单列表 start -->
    <yp-table :listInfo="permissionList" :height="height" :propArr="permissionListLabel" children="permissions" :expand="true">
      <template v-slot:button="scope">
        <el-button type="text" :disabled="scope.scope.type === '3'" v-permission="{ action: 'addChild', effect: 'disabled' }" @click="showAddPermissionChildDialog(scope.scope)">{{
          ' + ' + $t('lang.addChildFun')
        }}</el-button>
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditPermissionDialog(scope.scope)">{{
          $t('lang.viewDetails')
        }}</el-button>
        <el-button type="text" icon="el-icon-delete" v-permission="{ action: 'delete', effect: 'disabled' }" @click="deletePermission(scope.scope)">{{ $t('lang.delete') }} </el-button>
      </template>
    </yp-table>
    <!-- 菜单列表 end -->
    <!-- 新增或编辑弹框 start -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      :close-on-click-modal="false"
      :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')"
      :visible.sync="dialogVisible"
      width="40%"
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <yp-form :formData="permissionForm" :formLabel="permissionFormLabel" :formRule="permissionFormRule" ref="ypForm"></yp-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'viewDetails', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 新增或编辑弹框 end -->
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
    // 检测排序是否通过
    const checkDisplayOrder = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('请输入大于0的正整数'))
        } else {
          return cb()
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    return {
      height: '',
      currentPermissionId: '', // 编辑时用的当前id
      isAdd: true, // 判断是否为新增
      // 添加表单
      permissionForm: {
        parentId: '',
        name: '',
        url: '',
        permissionKey: '',
        displayOrder: '',
        logo: '',
        description: '',
        type: ''
      },
      parentIdDisabled: true, // 控制表单是否为可以编辑 true 为 不可编辑 false 为可编辑
      typeDisabled: true, // 控制表单是否为可以编辑 true 为 不可编辑 false 为可编辑
      permissionFormRule: {
        name: [{ required: true, message: '请输入', trigger: 'blur' }],
        url: [{ required: true, message: '请输入', trigger: 'blur' }],
        permissionKey: [{ required: true, message: '请输入', trigger: 'blur' }],
        displayOrder: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkDisplayOrder,
            trigger: 'blur'
          }
        ]
      },
      parentList: '',
      parentSelectOptions: [
        { label: '运营后台', value: '0' },
        { label: '菜单管理', value: '0101' }
      ],
      // 菜单类型选项
      typeOptions: [
        {
          value: '1',
          label: '应用'
        },
        {
          value: '2',
          label: '菜单'
        },
        {
          value: '3',
          label: '按钮'
        }
      ],
      permissionList: [], // 菜单列表数据
      dialogVisible: false // 控制弹框的显示与影藏
    }
  },
  computed: {
    // 表单标签
    permissionFormLabel() {
      return [
        {
          label: this.$t('lang.parentCatalog') + '：',
          prop: 'parentId',
          type: 'select',
          options: this.parentSelectOptions,
          disabled: this.parentIdDisabled
        },
        {
          label: this.$t('lang.nenuName') + '：',
          prop: 'name',
          type: 'input'
        },
        {
          label: this.$t('lang.requesturl') + '：',
          prop: 'url',
          type: 'input',
          disabled: !this.isAdd
        },
        {
          label: this.$t('lang.keyValue') + '：',
          prop: 'permissionKey',
          type: 'input',
          disabled: !this.isAdd
        },
        {
          label: this.$t('lang.ordernumber') + '：',
          prop: 'displayOrder',
          type: 'input'
        },
        {
          label: this.$t('lang.icon') + '：',
          prop: 'logo',
          type: 'icon'
        },
        {
          label: this.$t('lang.description') + '：',
          prop: 'description',
          type: 'input'
        },
        {
          label: this.$t('lang.type') + '：',
          prop: 'type',
          type: 'select',
          options: this.typeOptions,
          disabled: this.typeDisabled
        }
      ]
    },
    // 菜单列表标题以及类型（表格）
    permissionListLabel() {
      return [
        {
          props: 'operation',
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          props: 'name',
          label: this.$t('lang.name')
        },
        {
          props: 'displayOrder',
          label: '序号'
        },
        {
          type: 'icon',
          props: 'logo',
          label: this.$t('lang.icon')
        },
        {
          props: 'url',
          label: 'URL'
        },
        {
          props: 'description',
          label: this.$t('lang.description')
        },
        {
          props: 'type',
          label: this.$t('lang.type'),
          type: 'tag',
          render: res => {
            if (res.type === '1') {
              return this.$t('lang.application')
            } else if (res.type === '2') {
              return this.$t('lang.menu')
            } else {
              return this.$t('lang.button')
            }
          },
          renderStyle: res => {
            if (res.type === '1') {
              return 'success'
            } else if (res.type === '2') {
              return ''
            } else {
              return 'danger'
            }
          }
        },
        {
          props: 'permissionKey',
          label: '键值'
        }
      ]
    }
  },
  created() {
    this.getPermissionList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 190 + 'px'
      console.log(this.height)
    },
    // 获取菜单数据列表
    async getPermissionList() {
      const res = await this.$api.getPermissionApi.getPermissionList()
      this.permissionList = res
      console.log(res)
    },
    confirm() {
      // 重置表单子组件
      this.$refs.ypForm.$refs.formRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        if (this.isAdd) {
          const res = await this.$api.postPermissionApi.postPermission(this.permissionForm)
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
            this.getPermissionList()
          }
        }
        if (!this.isAdd) {
          const res = await this.$api.putPermissionApi.putPermission(this.currentPermissionId, this.permissionForm)
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
            this.getPermissionList()
          }
        }
      })
    },
    async deletePermission(row) {
      if (row.permissions.length > 0) {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '含有下级，不可删除',
          type: 'warning'
        })
      } else {
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
          this.$api.deletePermissionApi.deletePermission(row.id).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getPermissionList()
            }
          })
        }
      }
    },
    // 表单关闭时触发
    closeDialog() {
      // 重置表单调用子组件的方法
      this.$refs.ypForm.resetForm()
      this.permissionForm = {
        parentId: '',
        name: '',
        url: '',
        permissionKey: '',
        displayOrder: '',
        logo: '',
        description: '',
        type: ''
      }
    },
    // 编辑方法弹出框
    showEditPermissionDialog(row) {
      this.currentPermissionId = row.id
      this.isAdd = false
      // 编辑时处理父级选择框
      if (row.parentId === '0') {
        this.parentSelectOptions = [{ label: '运营后台', value: '0' }]
      } else {
        this.parentList = []
        this.parentSelectOptions = []
        this.$api.getPermissionApi.getPermissionById(row.parentId).then(res => {
          const obj = {}
          obj.label = res.name
          obj.value = res.id
          this.parentSelectOptions.push(obj)
          // this.parentList.push(res)
          // this.parentList.map(item => {
          //   this.parentSelectOptions.push({ value: item.id, label: item.name })
          // })
        })
      }
      console.log(this.parentSelectOptions)
      this.$api.getPermissionApi.getPermissionById(row.id).then(res => {
        this.permissionForm = res
        this.dialogVisible = true
      })
    },
    // 新增应用方法弹出框
    showAddPermissionDialog() {
      this.isAdd = true
      this.permissionForm.parentId = '0'
      this.permissionForm.type = '1'
      this.parentSelectOptions = [{ label: '运营后台', value: '0' }]
      this.dialogVisible = true
    },
    // 新增子功能方法弹出框
    async showAddPermissionChildDialog(row) {
      this.isAdd = true
      this.parentSelectOptions = []
      // 设置父级目录的值
      const obj = {}
      obj.label = row.name
      obj.value = row.id
      this.parentSelectOptions.push(obj)
      // 设置表单的父级目录的id
      this.permissionForm.parentId = row.id
      if (row.type === '1') {
        this.permissionForm.type = '2'
      }
      if (row.type === '2') {
        const res = await this.$api.getPermissionApi.getPermissionById(row.parentId)
        if (res.type === '1') {
          this.permissionForm.type = '2'
        } else {
          this.permissionForm.type = '3'
        }
      }
      this.dialogVisible = true
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

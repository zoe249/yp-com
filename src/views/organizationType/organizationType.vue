<!--
 * @FileDescription: 组织类型
 * @Author: liupenghui
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-08 15:24:28
 -->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddOrganiztionTypeDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchOrganizationTypeFormLabel" :formData="searchOrganizationTypeForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchOrganizationType"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchOrganizationType" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <!-- 代码举例 不用复制这句话   只为了举例说明：organizationTypeListLabel 表示表格头部的标题， organizationTypeList 表示表格列表的数据  模块 + ListLabel（List）-->
    <!-- 代码举例 不用复制这句话   只为了举例说明：@updateStatus  在定义表格的时候传过去的自定义事件名称，在父组件中用来写方法进行接收子组件传递过来的值，进行触发方法，该方法是修改组织类型状态的 -->
    <yp-table :propArr="organizationTypeListLabel" :height="height" :listInfo="organizationTypeList" @swichChange="swichChange" @updateStatus="updateStatus">
      <template v-slot:button="scope">
        <!-- 代码举例 不用复制这句话   只为了举例说明：点击事件名称：show +  操作 + 模块名称+ Dialog      showEditOrganiztionTypeDialog 显示编辑组织类型弹出框 -->
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditOrganizationTypeDialog(scope.scope)">{{
          $t('lang.viewDetails')
        }}</el-button>
        <!-- 代码举例 不用复制这句话   只为了举例说明：点击事件名称： 操作 + 模块名称      deleteOrganizationType  删除组织类型 -->
        <el-button type="text" icon="el-icon-edit-outline" v-permission="{ action: 'delete', effect: 'disabled' }" @click="deleteOrganizationType(scope.scope)">{{ $t('lang.delete') }}</el-button>
      </template>
    </yp-table>
    <!-- 主表格内容 end -->

    <!-- 编辑与添加对话框内容 begin -->
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
      <!-- 对话框里面的表单 begin -->
      <!-- 代码举例 不用复制这句话   只为了举例说明：organizationTypeFormLabel 表示表单左侧的标题， organizationTypeList 表示表格列表的数据  模块 + ListLabel（List）-->
      <yp-form :formLabel="organizationTypeFormLabel" :formData="organizationTypeForm" :formRule="organizationTypeFormRule" ref="ypForm"></yp-form>
      <!-- 对话框里面的表单 end -->
      <!-- 不用复制这句话   class：dialog-footer 类名为element-ui类名 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'viewDetails', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 编辑与添加对话框内容 end -->

    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchOrganizationTypeForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchOrganizationTypeForm.pageSize"
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
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpForm from '@/components/form/YpForm.vue'
export default {
  components: {
    YpTable,
    YpSearchForm,
    YpForm
  },
  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        // 这句话不用复制 ：   方法中传参数  一个是输入值 ，一个是当前的id  ，在点击新增的时候，弹框方法中将此值赋值为 空字符串 ，点击编辑的时候，将传过去的值 赋值给当前id
        this.$api.getOrganizationTypeApi.getCheckName(`${value}`, this.currentOrganizationTypeId).then(res => {
          console.log(res)
          if (!res.exist) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      // 控制是否进行禁止
      disabledStatus: false,
      // 用来进行判断是否禁用对话框里面的顶级组织
      putorganizationTypeStatus: [],
      // 当前id 用来编辑的时候传递Id校验名称的唯一性
      currentOrganizationTypeId: '',
      isAdd: true, // 判断是否是新增还是编辑   true 新增   false 编辑
      // 分页的总条数
      total: 10,
      // 获取组织类型列表
      organizationTypeList: [],
      // 控制添加与编辑对话框的显示
      dialogVisible: false,
      // 编辑与新增对话框里面的表单内容
      organizationTypeForm: {
        name: '',
        status: true,
        top: false
      },
      // 头部搜索表单的假数据
      searchOrganizationTypeForm: {
        name: '',
        status: '',
        pageIndex: 1,
        pageSize: 20,
        judgeRelation: false,
        isPermission: false,
        includeTop: true
      },
      // 组织类型表单校验规则
      organizationTypeFormRule: {
        name: [
          { required: true, message: '请输入组织类型', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        status: [{ required: true, message: '请选择状态', trigger: 'blur' }],
        top: [{ required: true, message: '请选择是否为顶级', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 获取组织类型数据列表
    // 这句话不用复制   代码举例： 此方法名称尽量与你的接口封装的方法名称一致
    this.getOrganizationTypeList()
    // 进行对对话框里面的状态来进行控制是否可以禁止cotrolStatus
    this.$api.getOrganizationTypeApi.getOrganizationTypeListDialog().then(res => {
      this.putorganizationTypeStatus = res.data
      for (var p = 0; p < this.putorganizationTypeStatus.length; p++) {
        if (this.putorganizationTypeStatus[p].top === true) {
          this.disabledStatus = true
        }
      }
    })
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  computed: {
    // 头部搜索表单的内容
    searchOrganizationTypeFormLabel() {
      return [
        { label: this.$t('lang.organizationtype') + ':', type: 'input', prop: 'name', placeholder: '组织类型' },
        {
          label: this.$t('lang.status') + ':',
          type: 'select',
          prop: 'status',
          options: [
            { label: this.$t('lang.effective'), value: true },
            { label: this.$t('lang.invalid'), value: false }
          ]
        }
      ]
    },
    // 组织类型列表标题以及类型（表格）
    organizationTypeListLabel() {
      return [
        { type: 'operation', label: this.$t('lang.operation') },
        { label: this.$t('lang.ordernumber'), type: 'index' },
        { label: this.$t('lang.organizationtype'), props: 'name' },
        { label: this.$t('lang.toporganization'), props: 'top', type: 'switch', disabled: true },
        { label: this.$t('lang.creationtime'), props: 'createTime', type: 'time' },
        { label: this.$t('lang.modificationtime'), props: 'updateTime', type: 'time' },
        { label: this.$t('lang.status'), props: 'status', type: 'switch', method: 'updateStatus' }
      ]
    },
    // 对话框表单内容
    organizationTypeFormLabel() {
      return [
        { label: this.$t('lang.organizationtype') + ':', type: 'input', prop: 'name' },
        { label: this.$t('lang.toporganization') + ':', type: 'switch', prop: 'top', disabled: this.disabledStatus },
        { label: this.$t('lang.status') + ':', type: 'switch', prop: 'status' }
      ]
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 更新组织类型的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      // 特殊处理 判断当前是否是顶级
      if (val.top) {
        this.getOrganizationTypeList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '此组织为顶级组织，不可修改状态',
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
          this.getOrganizationTypeList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          this.$api.putOrganizationTypeApi.putOrganizationTypeStatus(val.id, val).then(res => {
            if (res.code === '200000') this.getOrganizationTypeList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          })
        }
      }
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchOrganizationTypeForm.pageSize = newPage
      this.getOrganizationTypeList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchOrganizationTypeForm.pageIndex = newPage
      this.getOrganizationTypeList()
    },
    // 关闭对话框时触发条件
    closeDialog() {
      this.$refs.ypForm.resetForm()
      this.organizationTypeForm = {
        name: '',
        status: true,
        top: false
      }
    },
    // 获取后端接口数据
    getOrganizationTypeList() {
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(this.searchOrganizationTypeForm).then(res => {
        console.log(res)
        this.organizationTypeList = res.data
        this.total = res.total
      })
    },
    // 监听开关
    swichChange(res) {
      console.log(res)
      // 控制顶级组织
      if (res.top === true) {
        res.status = true
        this.$notify({
          title: this.$t('lang.tip'),
          message: '此组织为顶级组织，不可修改',
          type: 'warning'
        })
      }
    },
    // 删除组织类型
    async deleteOrganizationType(val) {
      /*
       * add by qiaokun 2020-12-27
       * @Description  删除前判断当前组织类型状态是否为启用状态    启用提示 用户不能操作，不启用则进行删除
       */
      if (val.status) {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '此组织状态为开启，不可删除',
          type: 'warning'
        })
      } else {
        const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          this.$api.deleteOrganizationTypeApi.deleteOrganizationType(val.id).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationTypeList()
            }
          })
        }
      }
    },
    // 编辑组织类型弹出框
    showEditOrganizationTypeDialog(val) {
      console.log(val)
      this.title = this.$t('lang.edit')
      this.getOrganizationTypeById(val.id)
      this.dialogVisible = true
    },
    // 根据 id 查询某一条组织类型数据
    getOrganizationTypeById(id) {
      this.isAdd = false
      this.currentOrganizationTypeId = id
      this.$api.getOrganizationTypeApi.getOrganizationTypeById(id).then(res => {
        this.organizationTypeForm = res
      })
    },
    // 新增组织类型弹出框
    showAddOrganiztionTypeDialog() {
      this.isAdd = true
      this.currentOrganizationTypeId = ''
      this.dialogVisible = true
    },
    // 查询组织类型数据
    searchOrganizationType() {
      this.searchOrganizationTypeForm.pageIndex = 1
      this.getOrganizationTypeList()
    },
    // 新增或编辑组织类型方法
    confirm() {
      this.$refs.ypForm.$refs.formRef.validate(async valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postOrganizationTypeApi.postOrganizationType(this.organizationTypeForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationTypeList()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putOrganizationTypeApi.putOrganizationType(this.organizationTypeForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationTypeList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 重置查询条件
    resetSearchOrganizationType() {
      this.searchOrganizationTypeForm = {
        name: '',
        status: '',
        pageIndex: 1,
        pageSize: 20,
        judgeRelation: false,
        isPermission: false,
        includeTop: true
      }
      this.getOrganizationTypeList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

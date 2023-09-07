<!--
 * @Author: liupenghui
 * @Date: 2020-12-04 16:37:45
 * @LastEditTime: 2021-01-06 15:59:50
 * @LastEditors: Please set LastEditors
 * @Description: 组织关系
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddOrganizationRelationDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchOrganizationRelationFormLabel" :formData="searchOrganizationRelationForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchOrganizationRelation"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchOrganizationRelation" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <yp-table :propArr="organizationRelationListLabel" :listInfo="organizationRelationList" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditOrganizationRelationDialog(scope.scope)">{{
          $t('lang.viewDetails')
        }}</el-button>
        <el-button type="text" icon="el-icon-delete" v-permission="{ action: 'delete', effect: 'disabled' }" @click="deleteOrganizationRelation(scope.scope)">{{ $t('lang.delete') }}</el-button>
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
      <!-- <yp-form :formLabel="organizationRelationFormLabel" :formData="organizationRelationForm" :formRule="organizationTypeRule" ref="ypForm"></yp-form> -->
      <el-form :model="organizationRelationForm" ref="ypForm" label-width="120px" :rules="organizationRelationFormRule" label-position="right">
        <div>
          <div v-for="(item, index) in organizationRelationFormLabel" :key="index">
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="organizationRelationForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'switch'" :label="item.label">
              <el-switch v-model="organizationRelationForm[item.prop]"></el-switch>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <!-- 对话框里面的表单 end -->
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
          :current-page="searchOrganizationRelationForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchOrganizationRelationForm.pageSize"
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
export default {
  components: {
    YpTable,
    YpSearchForm
  },
  data() {
    // 检查组织类型是否存在
    const checkOrganizationTypeId = (rule, value, cb) => {
      console.log(value)
      console.log(this.organizationRelationForm.parentOrganizationTypeId)
      if (value !== '' && this.organizationRelationForm.parentOrganizationTypeId && this.isAdd) {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.pageIndex = 1
        obj.pageSize = 20
        obj.organizationTypeId = value
        obj.parentOrganizationTypeId = this.organizationRelationForm.parentOrganizationTypeId
        this.$api.getOrganizationRelationApi.getOrganizationRelationList(obj).then(res => {
          if (res.data.length === 0) {
            return cb()
          } else {
            cb(new Error('选择的组织类型与上级组织已经存在，请重新选择'))
          }
        })
      } else {
        return cb()
      }
    }
    // 检查上级组织类型是否存在
    const checkParentOrganizationTypeId = (rule, value, cb) => {
      if (value !== '' && this.organizationRelationForm.organizationTypeId && this.isAdd) {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.pageIndex = 1
        obj.pageSize = 20
        obj.organizationTypeId = this.organizationRelationForm.organizationTypeId
        obj.parentOrganizationTypeId = value
        this.$api.getOrganizationRelationApi.getOrganizationRelationList(obj).then(res => {
          if (res.data.length === 0) {
            return cb()
          } else {
            cb(new Error('选择的组织类型与上级组织已经存在，请重新选择'))
          }
        })
      } else {
        return cb()
      }
    }
    return {
      currentOrganizationRelation: {}, // 存储当前的组织关系
      organizationTypeList: [], // 查询所有已启用的不含顶级组织类型
      selectOrganizationTypeList: [], // 下拉选择所有已经启用的组织类型不含顶级列表
      organizationTypeTopList: [], // // 查询所有已启用的不含顶级组织类型
      selectOrganizationTypeTopList: [], // 下拉选择所有已经启用的组织类型含顶级列表
      // 组织类型查询表单
      searchOrganizationTypeForm: {
        name: '',
        status: true,
        pageIndex: 1,
        pageSize: 999,
        judgeRelation: false,
        isPermission: false,
        includeTop: true
      },
      // 判断是否为新增或者编辑
      isAdd: true,
      // 分页数据的总数
      total: 10,
      // 控制添加与编辑对话框的显示
      dialogVisible: false,
      // 用来接收后端传过来的数据
      organizationRelationList: [],
      // 头部搜索表单的假数据
      searchOrganizationRelationForm: {
        pageIndex: 1,
        pageSize: 20,
        parentOrganizationTypeId: '',
        organizationTypeId: ''
      },
      // 对话框数据内容
      organizationRelationForm: {
        organizationTypeId: '',
        parentOrganizationTypeId: ''
      },
      // 组织类型唯一性校验
      organizationRelationFormRule: {
        organizationTypeId: [
          { required: true, message: '请选择组织类型', trigger: 'blur' },
          {
            validator: checkOrganizationTypeId,
            trigger: 'blur'
          }
        ],
        parentOrganizationTypeId: [
          { required: true, message: '请选择上级组织类型', trigger: 'blur' },
          {
            validator: checkParentOrganizationTypeId,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  created() {
    this.getOrganizationRelationList()
    // 获取启用的组织类型
    this.getOrganizationTypeList()
    this.getOrganizationTypeTopList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  computed: {
    // 头部搜索表单的内容
    searchOrganizationRelationFormLabel() {
      return [
        {
          label: this.$t('lang.organizationtype') + ':',
          type: 'select',
          prop: 'organizationTypeId',
          options: this.selectOrganizationTypeList
        },
        {
          label: this.$t('lang.parentorganizationtype') + ':',
          type: 'select',
          prop: 'parentOrganizationTypeId',
          options: this.selectOrganizationTypeTopList
        }
      ]
    },
    // 主表格
    organizationRelationListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation' },
        { label: this.$t('lang.ordernumber'), type: 'index' },
        { label: this.$t('lang.organizationtype'), props: 'organizationTypeName' },
        { label: this.$t('lang.parentorganizationtype'), props: 'parentOrganizationTypeName', width: '200px' },
        { label: this.$t('lang.creationtime'), props: 'createTime' },
        { label: this.$t('lang.modificationtime'), props: 'updateTime' }
      ]
    },
    // 对话框表单内容
    organizationRelationFormLabel() {
      return [
        {
          label: this.$t('lang.organizationtype') + ':',
          type: 'select',
          prop: 'organizationTypeId',
          options: this.selectOrganizationTypeList
        },
        {
          label: this.$t('lang.parentorganizationtype') + ':',
          type: 'select',
          prop: 'parentOrganizationTypeId',
          options: this.selectOrganizationTypeTopList
        }
      ]
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 获取启用的组织类型含顶级列表
    getOrganizationTypeTopList() {
      this.searchOrganizationTypeForm.includeTop = true
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(this.searchOrganizationTypeForm).then(res => {
        this.organizationTypeTopList = res.data
        this.organizationTypeTopList.map(item => {
          this.selectOrganizationTypeTopList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 获取启用的组织类型不含顶级列表
    getOrganizationTypeList() {
      this.searchOrganizationTypeForm.includeTop = false
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(this.searchOrganizationTypeForm).then(res => {
        console.log(res)
        this.organizationTypeList = res.data
        this.organizationTypeList.map(item => {
          this.selectOrganizationTypeList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 获取后端接口数据
    getOrganizationRelationList() {
      this.$api.getOrganizationRelationApi.getOrganizationRelationList(this.searchOrganizationRelationForm).then(res => {
        this.organizationRelationList = res.data
        this.total = res.total
      })
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchOrganizationRelationForm.pageSize = newPage
      this.getOrganizationRelationList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchOrganizationRelationForm.pageIndex = newPage
      this.getOrganizationRelationList()
    },
    // 关闭对话框时触发条件
    closeDialog() {
      this.$refs.ypForm.resetFields()
      this.organizationRelationForm = {
        organizationTypeId: '',
        parentOrganizationTypeId: ''
      }
    },
    // 搜索按钮触发事件
    searchOrganizationRelation() {
      this.searchOrganizationRelationForm.pageIndex = 1
      this.getOrganizationRelationList()
    },
    // 编辑组织关系
    showEditOrganizationRelationDialog(val) {
      this.isAdd = false
      console.log(val)
      this.currentOrganizationRelation = val
      this.getOrganizationRelationById(val.id)
      this.dialogVisible = true
    },
    // 根据 id 获取某一条组织关系数据
    getOrganizationRelationById(id) {
      this.$api.getOrganizationRelationApi.getOrganizationRelationById(id).then(res => {
        this.organizationRelationForm = res
      })
    },
    // 删除组织关系
    async deleteOrganizationRelation(val) {
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
        this.$api.deleteOrganizationRelationApi.deleOrganizationRelation(val.id).then(res => {
          if (res.code === '200000') {
            this.getOrganizationRelationList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        })
      }
    },
    // 新增组织关系
    showAddOrganizationRelationDialog() {
      this.isAdd = true
      this.getOrganizationTypeStatusIsTrueList = []
      this.searchOrganizationTypeForm.judgeRelation = true
      this.dialogVisible = true
    },
    // 对话框确定按钮事件
    confirm() {
      this.$refs.ypForm.validate(valid => {
        console.log(valid)
        if (!valid) return
        if (this.isAdd) {
          this.$api.postOrganizationRelationApi.postOrganizationRelation(this.organizationRelationForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationRelationList()
              this.dialogVisible = false
            }
          })
        } else {
          if (
            this.currentOrganizationRelation.id === this.organizationRelationForm.id &&
            this.currentOrganizationRelation.organizationTypeId === this.organizationRelationForm.organizationTypeId &&
            this.currentOrganizationRelation.parentOrganizationTypeId === this.organizationRelationForm.parentOrganizationTypeId
          ) {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.getOrganizationRelationList()
            this.dialogVisible = false
          } else {
            this.$api.putOrganizationRelationApi.putOrganizationRelation(this.organizationRelationForm).then(res => {
              if (res.code === '200000') {
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.getOrganizationRelationList()
                this.dialogVisible = false
              }
            })
          }
        }
      })
    },
    // 重置查询条件触发事件
    resetSearchOrganizationRelation() {
      this.searchOrganizationRelationForm = {
        parentOrganizationTypeId: '',
        organizationTypeId: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getOrganizationRelationList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

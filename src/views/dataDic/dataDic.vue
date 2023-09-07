<!--
 * @FileDescription: 数据字典
 * @Author: qiaokun
 * @Date: 2021-01-04
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-29 10:23:46
 -->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddDataDicDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchDataDicFormLabel" :formData="searchDataDicForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchDataDic"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchDataDic" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 数据字典表格 start -->
    <yp-table :propArr="dataDicListLabel" :listInfo="dataDicList" @updateStatus="updateStatus" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showViewDataDicDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <!-- <el-button type="text" icon="el-icon-search" @click="showEditDataDicDialog(scope.scope)">{{ $t('lang.edit') }}</el-button> -->
        <!-- <el-button type="text" icon="el-icon-delete" @click="deleteDataDic(scope.scope)">{{ $t('lang.delete') }}</el-button> -->
      </template>
    </yp-table>
    <!-- 数据字典表格 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchDataDicForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchDataDicForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 新增或编辑数据字典弹框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('lang.add')" :visible.sync="dialogVisible" width="40%" @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.titleAdd') }}
        </div>
      </template>
      <yp-form :formData="dataDicForm" :formLabel="dataDicFormLabel" :formRule="dataDicFormRule" ref="ypForm"></yp-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 新增或编辑数据字典弹框 end -->
    <!-- 数据字典项值列表弹出框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('lang.viewDetails')" :visible.sync="viewDetailsDialogVisible" width="60%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.viewDetails') }}
        </div>
      </template>
      <el-button class="add-btn" type="primary" size="mini" @click="showAddDataDicItemDialog" :disabled="isEdit">{{ this.$t('lang.add') }}</el-button>
      <yp-table :propArr="dataDicItemListLabel" :listInfo="dataDicItemList" @updateStatus="updateItemStatus"> </yp-table>
    </el-dialog>
    <!-- 数据字典项值列表弹出框 end -->
    <!-- 数据字典项值列表弹出框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('lang.add')" :visible.sync="addDataDicItemDialogVisible" @close="closeItemDialog" width="40%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.titleAdd') }}
        </div>
      </template>
      <yp-form :formData="dataDicItemForm" :formLabel="dataDicItemFormLabel" :formRule="dataDicItemFormRule" ref="ypFormItem"></yp-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDataDicItemDialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirmAddDataDicItem">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 数据字典项值列表弹出框 end -->
  </div>
</template>

<script>
// 表单组价导入
import YpForm from '@/components/form/YpForm.vue'
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpForm,
    YpTable,
    YpSearchForm
  },
  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.name = value
        obj.id = this.currentDataDicId
        obj.code = ''
        this.$api.getDataDicApi.checkNameOrCode(obj).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    // 检测字典项值类型名称是否通过
    const checkItemName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.name = value
        obj.ddId = this.currentDataDicId
        obj.code = ''
        obj.id = ''
        this.$api.getDataDicApi.checkItemNameOrCode(obj).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    // 检测类型编码是否通过
    const checkCode = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.name = ''
        obj.id = this.currentDataDicId
        obj.code = value
        this.$api.getDataDicApi.checkNameOrCode(obj).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的编码已存在'))
          }
        })
      }
    }
    // 检测字典项值编码是否通过
    const checkItemCode = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.name = ''
        obj.ddId = this.currentDataDicId
        obj.code = value
        obj.id = ''
        this.$api.getDataDicApi.checkItemNameOrCode(obj).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的编码已存在'))
          }
        })
      }
    }
    return {
      isEdit: false, // 查看详情时更据diy的值判断项值是否为可编辑
      currentDataDicCode: '', // 记录挡墙点击字典的code
      currentDataDicId: '', // 记录当前点击的字典id
      addDataDicItemDialogVisible: false, // 添加项值 显示/隐藏
      viewDetailsDialogVisible: false, // 查看详情 显示/隐藏
      isAdd: true, // 判断是否是新增还是编辑
      dialogVisible: false, // 弹框的显示与隐藏
      total: 0, // 分页总条数
      // 查询数据字典表单
      searchDataDicForm: {
        pageIndex: 1, // 当前页码
        pageSize: 20, // 当前页码数据条数
        code: '', // 类型编码
        name: '' // 类型名称
      },
      dataDicList: [], // 数据字典列表数据
      dataDicItemList: [], // 数据字典项值列表数据
      dataDicForm: {
        code: '',
        name: '',
        diy: true
      }, // 新增或编辑数据字典表单
      dataDicItemForm: {
        code: '',
        name: '',
        status: true
      }, // 新增数据字典相值表单
      dataDicFormRule: {
        code: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      }, // 新增或编辑数据字典表单验证规则
      dataDicItemFormRule: {
        code: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkItemCode,
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkItemName,
            trigger: 'blur'
          }
        ]
      } // 新增数据字典项值的表单验证规则
    }
  },
  computed: {
    // 查询数据字典标题
    searchDataDicFormLabel() {
      return [
        {
          label: '类型编码：',
          type: 'input',
          prop: 'code'
        },
        {
          label: '类型名称：',
          type: 'input',
          prop: 'name'
        }
      ]
    },
    // 数据字典列表标题
    dataDicListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: '类型编码',
          props: 'code'
        },
        {
          label: '类型名称',
          props: 'name'
        },
        {
          label: '自定义修改',
          type: 'switch',
          props: 'diy',
          method: 'updateStatus'
        }
      ]
    },
    // 数据字典项值列表
    dataDicItemListLabel() {
      return [
        {
          label: '是否有效',
          props: 'status',
          type: 'switch',
          method: 'updateStatus',
          disabled: this.isEdit
        },
        {
          label: '类型编码',
          props: 'ddCode'
        },
        {
          label: '项值标识',
          props: 'code'
        },
        {
          label: '项值名称',
          props: 'name'
        }
      ]
    },
    // 新增或编辑数据字典表单标题
    dataDicFormLabel() {
      return [
        {
          label: '类型编码',
          type: 'input',
          prop: 'code',
          maxLength: '5'
        },
        {
          label: '类型名称',
          type: 'input',
          prop: 'name'
        },
        {
          label: '自定义修改',
          type: 'switch',
          prop: 'diy'
        }
      ]
    },
    dataDicItemFormLabel() {
      return [
        {
          label: '项值标识',
          type: 'input',
          prop: 'code'
        },
        {
          label: '项值名称',
          type: 'input',
          prop: 'name'
        },
        {
          label: '是否有效',
          type: 'switch',
          prop: 'status'
        }
      ]
    }
  },
  created() {
    this.getDataDicList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 更新数据字典是否是DIY自定义修改
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getDataDicList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putDataDicApi.putDataDicStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getDataDicList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 更新数据字典项值是否有效状态
    async updateItemStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getDataDicItemListByddCode(this.currentDataDicCode)
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putDataDicApi.putDataDicItemStatus(this.currentDataDicId, val.id, val).then(res => {
          if (res.code === '200000') this.getDataDicItemListByddCode(this.currentDataDicCode)
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 获取数据字典列表
    getDataDicList() {
      // this.dataDicList = [{ id: '123456', code: '5555', name: '会员等级', diy: false }]
      this.$api.getDataDicApi.getDataDicList(this.searchDataDicForm).then(res => {
        console.log(res)
        this.total = res.total
        this.dataDicList = res.data
      })
    },
    // 新增数据字典弹出框
    showAddDataDicDialog() {
      this.isAdd = true
      this.currentDataDicId = ''
      this.dialogVisible = true
    },
    // 新增数据字典项目值弹出框
    showAddDataDicItemDialog() {
      console.log('66666')
      this.addDataDicItemDialogVisible = true
    },
    // 查询数据字典
    searchDataDic() {
      this.searchDataDicForm.pageIndex = 1
      this.getDataDicList()
    },
    // 重置查询数据字典
    resetSearchDataDic() {
      this.searchDataDicForm = {
        pageIndex: 1, // 当前页码
        pageSize: 20, // 当前页码数据条数
        code: '', // 类型编码
        name: '' // 类型名称
      }
      this.getDataDicList()
    },
    showViewDataDicDialog(row) {
      console.log(row)
      if (!row.diy) {
        this.isEdit = true
      } else {
        this.isEdit = false
      }
      this.currentDataDicId = row.id
      this.currentDataDicCode = row.code
      this.getDataDicItemListByddCode(row.code)
      this.viewDetailsDialogVisible = true
    },
    // 编辑数据字典弹出框
    // showEditDataDicDialog(row) {
    //   this.isAdd = false
    //   this.viewDetailsDialogVisible = true
    //   this.getDataDicById(row.id)
    // },
    // 根据id查询数据
    getDataDicItemListByddCode(ddCode) {
      const obj = {}
      obj.ddCode = ddCode
      obj.status = false
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        this.dataDicItemList = res
      })
    },
    // // 删除数据字典
    // deleteDataDic() {},
    // 切换分页条数方法
    handleSizeChange(newPage) {
      this.searchDataDicForm.pageSize = newPage
      this.getDataDicList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchDataDicForm.pageIndex = newPage
      this.getDataDicList()
    },
    // 关闭弹框
    closeDialog() {
      this.$refs.ypForm.resetForm()
    },
    // 关闭头项值
    closeItemDialog() {
      this.$refs.ypFormItem.resetForm()
    },
    // 确定新增或者编辑
    confirm() {
      console.log(this.dataDicForm)
      this.$refs.ypForm.$refs.formRef.validate(valid => {
        console.log(valid)
        if (!valid) return
        if (this.isAdd) {
          this.$api.postDataDicApi.postDataDic(this.dataDicForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getDataDicList()
            }
            console.log(res)
          })
        }
      })
    },
    // 确认新增数据字典项值
    confirmAddDataDicItem() {
      console.log(this.dataDicItemForm)
      this.$refs.ypFormItem.$refs.formRef.validate(valid => {
        console.log(valid)
        if (!valid) return
        this.$api.postDataDicApi.postDataDicItem(this.currentDataDicId, this.dataDicItemForm).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.addDataDicItemDialogVisible = false
            this.getDataDicItemListByddCode(this.currentDataDicCode)
          }
          console.log(res)
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

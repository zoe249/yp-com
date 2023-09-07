<!--
 * @Author: liupenghui
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-29 10:38:30
 * @LastEditors: Please set LastEditors
 * @Description: 终端配置界面
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddTerminalDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchTerminalFormLabel" :formData="searchTerminalForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchTerminal"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchTerminal" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 终端配置列表 begin -->
    <yp-table :propArr="terminalListLabel" :listInfo="terminalList" @updateStatus="updateStatus" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditTerminalDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 我是主页表格内容 end -->
    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog v-dialogDrag :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="30%" @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <yp-form :formLabel="terminalFormLabel" :formData="terminalForm" :formRule="terminalFormRule" ref="ypForm"></yp-form>
      <!-- 对话框里面的表单 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'viewDetails', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 编辑与添加对话框内容 end -->
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
        this.$api.getTerminalApi.getCheckName(`${value}`, this.currentTerminalId).then(res => {
          if (!res.exist) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      currentTerminalId: '',
      isAdd: false, // 判断是否是新增还是编辑
      // 接收后端表格数据
      terminalList: [],
      // 头部搜索表单的假数据
      searchTerminalForm: {
        name: '',
        status: ''
      },
      // 编辑与新增对话框里面的表单内容
      terminalForm: {
        name: '',
        status: false
      },
      terminalFormRule: {
        name: [
          { required: true, message: '请输入终端名称', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      },
      dialogVisible: false,
      title: this.$t('lang.add')
    }
  },
  created() {
    this.getTerminalList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  computed: {
    // 终端配置列表表头
    terminalListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation' },
        { label: this.$t('lang.ordernumber'), type: 'index' },
        { label: this.$t('lang.terminalcoding'), props: 'code' },
        { label: this.$t('lang.terminalname'), props: 'name' },
        { label: this.$t('lang.creationtime'), props: 'createTime' },
        { label: this.$t('lang.modificationtime'), props: 'updateTime' },
        { label: this.$t('lang.status'), props: 'status', type: 'switch', method: 'updateStatus' }
      ]
    },
    // 头部搜索表单的内容
    searchTerminalFormLabel() {
      return [
        { label: this.$t('lang.terminalname') + ':', type: 'input', prop: 'name', placeholder: '终端' },
        {
          label: this.$t('lang.status') + ':',
          type: 'select',
          prop: 'status',
          options: [
            { label: '有效', value: true },
            { label: '无效', value: false }
          ]
        }
      ]
    },
    // 表单左侧名称
    terminalFormLabel() {
      return [
        { label: this.$t('lang.terminalname') + ':', type: 'input', prop: 'name' },
        { label: this.$t('lang.status') + ':', type: 'switch', prop: 'status' }
      ]
    }
  },

  methods: {
    getHeight() {
      this.height = window.innerHeight - 250 + 'px'
      console.log(this.height)
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
        this.getTerminalList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putTerminalApi.putTerminalStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getTerminalList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 关闭对话框时触发条件
    closeDialog() {
      this.$refs.ypForm.resetForm()
      this.terminalForm = {
        name: '',
        status: false
      }
    },
    // 搜索
    searchTerminal() {
      this.getTerminalList()
    },

    // 从后台获取数据
    getTerminalList() {
      this.$api.getTerminalApi.getTerminalList(this.searchTerminalForm).then(res => {
        this.terminalList = res
      })
    },

    // 编辑按钮
    showEditTerminalDialog(val) {
      this.isAdd = false
      this.currentTerminalId = val.id
      this.getTerminalListById(val.id)
      this.dialogVisible = true
    },

    // 根据 id 来获取某一条数据
    getTerminalListById(id) {
      this.$api.getTerminalApi.getTerminalById(id).then(res => {
        this.terminalForm = res
      })
    },

    // 新增终端配置弹出框
    showAddTerminalDialog() {
      this.isAdd = true
      this.currentTerminalId = ''
      console.log('add')
      // this.reset()
      this.terminalForm = {
        name: '',
        status: false
      }
      this.title = this.$t('lang.add')
      this.dialogVisible = true
    },
    // 确定新增或编辑
    confirm() {
      this.$refs.ypForm.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postTerminalApi.postTerminal(this.terminalForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getTerminalList()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putTerminalApi.putTerminal(this.terminalForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              console.log('edit success')
              this.getTerminalList()
              this.dialogVisible = false
            }
          })
        }
      })
    },

    // switch开关的改变所触碰的方法
    swichChange(res) {
      console.log(res)
    },
    // 重置
    resetSearchTerminal() {
      console.log('reset')
      this.searchTerminalForm = {
        name: '',
        status: ''
      }
      this.getTerminalList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

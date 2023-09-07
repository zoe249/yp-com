<!--
 * @Author: liupenghui
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-12 13:53:16
 * @LastEditors: Please set LastEditors
 * @Description: 渠道配置
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" type="primary" size="mini" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddChannelDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->

    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchChannelFormLabel" :formData="searchChannelForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchChannel"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchChannel" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <yp-table :propArr="channelListLabel" :listInfo="channelList" @updateStatus="updateStatus" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditChannelDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 主表格内容 end -->

    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="30%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <yp-form :formLabel="channelFormLabel" :formData="channelForm" :formRule="channelFormRule" ref="ypForm"></yp-form>
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
// 导入表格组件
import YpTable from '@/components/table/YpTable.vue'
// 导入查询表单
import YpSearchForm from '@/components/form/YpSearchForm.vue'
// 导入新增或编辑表单
import YpForm from '@/components/form/YpForm.vue'
export default {
  components: {
    YpTable,
    YpForm,
    YpSearchForm
  },
  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        this.$api.getChannelApi.getCheckName(`${value}`, this.currentChannelId).then(res => {
          if (!res.exist) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      currentChannelId: '', // 当前渠道id用于名称校验时候使用
      isAdd: true, // 判断是否是新增或者编辑
      // 校验规则
      channelFormRule: {
        name: [
          { required: true, message: '请输入渠道名称', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ]
      },
      // 接收后端表格内容数据
      channelList: [],
      // 头部搜索表单的假数据
      searchChannelForm: {
        name: '',
        status: '',
        userCode: ''
      },

      // 编辑与新增对话框里面的表单内容
      channelForm: {
        name: '',
        status: false
      },

      // 控制对话框的显示与隐藏
      dialogVisible: false,

      // 控制对话框头部提示
      title: this.$t('lang.add')
    }
  },
  computed: {
    // 渠道列表标题
    channelListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: this.$t('lang.ordernumber'),
          type: 'index'
        },
        {
          label: this.$t('lang.channelcoding'),
          props: 'code'
        },
        {
          label: this.$t('lang.channelname'),
          props: 'name'
        },
        {
          label: this.$t('lang.creationtime'),
          props: 'createTime',
          type: 'time'
        },
        {
          label: this.$t('lang.modificationtime'),
          props: 'updateTime',
          type: 'time'
        },
        {
          label: this.$t('lang.status'),
          props: 'status',
          type: 'switch',
          method: 'updateStatus'
        }
      ]
    },
    // 渠道配置查询
    searchChannelFormLabel() {
      return [
        {
          label: this.$t('lang.channelname') + ':',
          type: 'input',
          prop: 'name',
          placeholder: '编码或名称'
        },
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

    // 对话框表单内容
    channelFormLabel() {
      return [
        {
          label: this.$t('lang.channelname') + ':',
          type: 'input',
          prop: 'name'
        },
        {
          label: this.$t('lang.status') + ':',
          type: 'switch',
          prop: 'status'
        }
      ]
    }
  },
  created() {
    // 获取渠道配置列表信息
    this.getChannelList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
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
        this.getChannelList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putChannelApi.putChannelStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getChannelList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 从后台获取数据
    getChannelList() {
      this.$api.getChannelApi.getChannelList(this.searchChannelForm).then(res => {
        this.channelList = res
      })
    },
    // 查询渠道配置
    searchChannel() {
      this.getChannelList()
    },
    // 编辑按钮
    showEditChannelDialog(val) {
      this.isAdd = false
      this.currentChannelId = val.id
      this.title = this.$t('lang.edit')
      this.getChannelById(val.id)
      this.dialogVisible = true
    },
    // 根据 id 来进行获取某一条数据
    getChannelById(id) {
      console.log(id)
      this.$api.getChannelApi.getChannelById(id).then(res => {
        console.log(res)
        this.channelForm = res
      })
    },
    // 新增渠道弹出框
    showAddChannelDialog() {
      this.isAdd = true
      this.currentChannelId = ''
      this.resetSearchChannel()
      this.title = this.$t('lang.add')
      this.channelForm = {
        name: '',
        status: false
      }
      this.dialogVisible = true
    },
    // 确定新增
    confirm() {
      this.$refs.ypForm.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postChannelApi.postChannel(this.channelForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getChannelList()
            }
            console.log(res)
          })
        } else {
          this.$api.putChannelApi.putChannel(this.channelForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getChannelList()
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
    // 重置查询条件
    resetSearchChannel() {
      this.searchChannelForm = {
        name: '',
        status: ''
      }
      this.getChannelList()
    },
    // 表单关闭之后
    closeDialog() {
      this.$refs.ypForm.resetForm()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

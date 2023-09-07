<!--
 * @Author: liupenghui
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-06 14:52:28
 * @LastEditors: Please set LastEditors
 * @Description: 渠道终端
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" v-permission="{ action: 'add', effect: 'disabled' }" @click="showAddChannelTerminalDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchChannelTerminalFormLabel" :formData="searchChannelTerminalForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchChannelTerminal"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchChannelTerminal" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 主表格 begin -->
    <yp-table :propArr="channelTerminalListLabel" :height="height" :listInfo="channelTerminalList" @updateStatus="updateStatus"></yp-table>
    <!-- 主表格 end -->

    <!-- 对话框 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="50%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-form :model="channelTerminalForm" ref="ypForm" label-width="120px" :rules="channelTerminalFormRule" label-position="right">
        <div>
          <div v-for="(item, index) in channelTerminalLabel" :key="index">
            <el-form-item v-if="item.type === 'selectOrg'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="channelTerminalForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="channelTerminalForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'switch'" :label="item.label">
              <el-switch v-model="channelTerminalForm[item.prop]"></el-switch>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ this.$t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ this.$t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 对话框 end -->
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
    // 渠道是否存在
    const checkChannel = (rule, value, cb) => {
      if (value !== '' && this.channelTerminalForm.terminalsId) {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.channelsId = value
        obj.terminalsId = this.channelTerminalForm.terminalsId
        this.$api.getChannelTerminalApi.getChannelTerminalList(obj).then(res => {
          if (res.length === 0) {
            return cb()
          } else {
            cb(new Error('选择的渠道与终端已经存在，请重新选择'))
          }
        })
      }
    }
    // 终端是否存在
    const checkTerminal = (rule, value, cb) => {
      if (value !== '' && this.channelTerminalForm.channelsId) {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const obj = {}
        obj.channelsId = this.channelTerminalForm.channelsId
        obj.terminalsId = value
        this.$api.getChannelTerminalApi.getChannelTerminalList(obj).then(res => {
          if (res.length === 0) {
            return cb()
          } else {
            cb(new Error('选择的渠道与终端已经存在，请重新选择'))
          }
        })
      }
    }
    return {
      isAdd: true,
      currentChannelTerminal: '',
      channelList: [], // 启用渠道数据列表
      selectChannelList: [], // 下拉选择渠道数据列表
      terminalList: [], // 启用的终端数据列表
      selectTerminalList: [], // 下拉选择渠道数据列表
      // 控制对话框的显示与关闭
      dialogVisible: false,
      // 对话框表单数据
      channelTerminalForm: {
        channelsId: '',
        terminalsId: '',
        status: true
      },
      channelTerminalFormRule: {
        channelsId: [
          { required: true, message: '请选择', trigger: 'change' },
          {
            validator: checkChannel,
            trigger: 'blur'
          }
        ],
        terminalsId: [
          { required: true, message: '请选择', trigger: 'blur' },
          {
            validator: checkTerminal,
            trigger: 'change'
          }
        ]
      },
      // 获取后台数据
      channelTerminalList: [],
      // 查询渠道终端关系表单
      searchChannelTerminalForm: {
        channelsId: '',
        terminalsId: ''
      }
    }
  },
  computed: {
    // 用来接收后端表格数据
    channelTerminalListLabel() {
      return [
        { label: this.$t('lang.modificationtime'), props: 'updateTime', type: 'time' },
        { label: this.$t('lang.ordernumber'), type: 'index' },
        { label: this.$t('lang.channel'), props: 'channelsName' },
        { label: this.$t('lang.terminal'), props: 'terminalsName' },
        { label: this.$t('lang.status'), props: 'status', type: 'switch', method: 'updateStatus' },
        { label: this.$t('lang.creationtime'), props: 'createTime', type: 'time' }
      ]
    },
    // 头部搜索表单的内容
    searchChannelTerminalFormLabel() {
      return [
        {
          label: this.$t('lang.channel') + ':',
          type: 'select',
          prop: 'channelsId',
          options: this.selectChannelList
        },
        {
          label: this.$t('lang.terminal') + ':',
          type: 'select',
          prop: 'terminalsId',
          options: this.selectTerminalList
        }
      ]
    },
    // 控制对话框表单里面的数据
    channelTerminalLabel() {
      return [
        {
          type: 'selectOrg',
          label: this.$t('lang.channel') + '：',
          prop: 'channelsId',
          options: this.selectChannelList
        },
        {
          label: this.$t('lang.terminal') + '：',
          type: 'select',
          prop: 'terminalsId',
          options: this.selectTerminalList
        },
        {
          label: this.$t('lang.status') + '：',
          type: 'switch',
          prop: 'status'
        }
      ]
    }
  },
  created() {
    // 获取渠道终端列表
    this.getChannelTerminalList()
    // 获取渠道列表
    this.getChannelList()
    // 获取终端数据
    this.getTerminalList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },

  methods: {
    getHeight() {
      this.height = window.innerHeight - 250 + 'px'
      console.log(this.height)
    },
    // 更新渠道终端的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getChannelTerminalList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putChannelTerminalApi.putChannelTerminalStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getChannelTerminalList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 获取渠道数据
    getChannelList() {
      const obj = {}
      obj.status = true
      obj.name = ''
      this.$api.getChannelApi.getChannelList(obj).then(res => {
        this.channelList = res
        this.channelList.map(item => {
          this.selectChannelList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 获取终端数据
    getTerminalList() {
      const obj = {}
      obj.status = true
      obj.name = ''
      this.$api.getTerminalApi.getTerminalList(obj).then(res => {
        this.terminalList = res
        this.terminalList.map(item => {
          this.selectTerminalList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 新增渠道终端弹出框
    showAddChannelTerminalDialog() {
      this.channelList = []
      this.selectChannelList = []
      this.terminalList = []
      this.selectTerminalList = []
      this.getChannelList()
      this.getTerminalList()
      this.isAdd = true
      this.currentChannelTerminal = ''
      this.dialogVisible = true
    },
    confirm() {
      this.$refs.ypForm.validate(valid => {
        if (!valid) return
        this.$api.postChannelTerminalApi.postChannelTerminal(this.channelTerminalForm).then(res => {
          if (res.code === '200000') this.getChannelTerminalList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.dialogVisible = false
        })
      })
    },
    // 关闭弹框
    closeDialog() {
      this.$refs.ypForm.resetFields()
      this.channelTerminalForm = {
        channelsId: '',
        terminalsId: '',
        status: true
      }
    },
    // 搜索
    searchChannelTerminal() {
      this.getChannelTerminalList()
    },
    // 从后台获取数据
    getChannelTerminalList() {
      this.$api.getChannelTerminalApi.getChannelTerminalList(this.searchChannelTerminalForm).then(res => {
        console.log(res)
        this.channelTerminalList = res
      })
    },
    // 重置条件
    resetSearchChannelTerminal() {
      this.searchChannelTerminalForm = {
        channelsId: '',
        terminalsId: ''
      }
      this.getChannelTerminalList()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

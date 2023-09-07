<!--
 * @Author: 谯坤
 * @Date: 2021-06-21 10:13:24
 * @LastEditTime: 2021-06-21 10:13:24
 * @LastEditors: Please set LastEditors
 * @Description: 成长值规则
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showGrowthRuleDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="serachGrowthRuleFormLabel" :formData="serachGrowthRuleForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchGrowthRuleForm"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchGrowthRuleForm" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 成长值规则表格 begin -->
    <yp-table :propArr="growthRuleListLabel" :listInfo="growthRuleList" @updateStatus="updateStatus">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditGrowthRuleDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 成长值规则表格 end -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="40%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <el-form label-position="right" label-width="120px" :model="growthRuleForm" ref="growthRuleFormRef" :rules="growthRuleFormRule">
        <el-form-item label="规则名称：" prop="growthRule">
          <el-select filterable v-model="growthRuleForm.growthRule" :placeholder="$t('lang.pleaseselect')">
            <el-option v-for="growthRuleItem in selectGrowthRuleList" :key="growthRuleItem.value" :label="growthRuleItem.label" :value="growthRuleItem.value"></el-option> </el-select
        ></el-form-item>
        <el-form-item label="成长值：" prop="moneyParameter"
          >每消费<el-input style="width:100px;margin:0px 10px;" v-model="growthRuleForm.moneyParameter"></el-input>元，获得<el-input
            style="width:100px;margin:0px 10px;"
            v-model="growthRuleForm.growth"
          ></el-input
          >成长值</el-form-item
        >
        <el-form-item label="组织范围：" prop="organizationCode">
          <el-select filterable v-model="growthRuleForm.organizationCode" :placeholder="$t('lang.pleaseselect')" @change="selectOrganization">
            <el-option v-for="organizationItem in organizationList" :key="organizationItem.value" :label="organizationItem.label" :value="organizationItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道范围：" prop="channelsCode">
          <el-select filterable v-model="growthRuleForm.channelsCode" :placeholder="$t('lang.pleaseselect')" @change="selectChannel">
            <el-option v-for="channelItem in channelList" :key="channelItem.value" :label="channelItem.label" :value="channelItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端范围：" prop="terminalsCode">
          <el-select filterable v-model="growthRuleForm.terminalsCode" :placeholder="$t('lang.pleaseselect')" @focus="focusTerminal">
            <el-option v-for="terminalItem in terminalList" :key="terminalItem.value" :label="terminalItem.label" :value="terminalItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch v-model="growthRuleForm.status"></el-switch>
        </el-form-item>
      </el-form>
      <!-- 对话框里面的表单 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 编辑与添加对话框内容 end -->
  </div>
</template>

<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
export default {
  components: {
    YpTable,
    YpSearchForm
  },
  data() {
    var checkMoney = (rule, value, callback) => {
      var reg = /^\+?[1-9]\d*$/
      if (!this.growthRuleForm.growth) {
        callback(new Error('请输入成长值'))
      }
      if (!reg.test(value)) {
        callback(new Error('请输入大于0的整数金额'))
      }
      if (!reg.test(this.growthRuleForm.growth)) {
        callback(new Error('请输入大于0的整数成长值'))
      }
      callback()
    }
    return {
      currentGrowthRuleId: '',
      isAdd: false, // 判断是否是新增或者编辑
      dialogVisible: false, // 控制弹出框是否是显示或者隐藏
      serachGrowthRuleForm: {
        growthRule: '', // 成长规则code
        organizationCode: '', // 组织范围
        channelsCode: '', // 渠道范围
        pageIndex: 1,
        pageSize: 999
      },
      organizationList: [], // 组织列表
      channelList: [], // 所有渠道列表数据
      allChannelList: [], // 渠道数据
      terminalList: [], // 终端列表数据
      selectGrowthRuleList: [], // 选择成长值规则下拉列表
      growthRuleList: [], // 会员成长规则表格数据
      growthRuleForm: {
        growthRule: '',
        moneyParameter: 1,
        growth: 1,
        organizationCode: '',
        channelsCode: '',
        terminalsCode: '',
        status: true
      },
      growthRuleFormRule: {
        growthRule: [{ required: true, message: '请选择', trigger: 'blur' }],
        moneyParameter: [
          { required: true, message: '请填写金额', trigger: 'blur' },
          { validator: checkMoney, trigger: 'blur' }
        ],
        organizationCode: [{ required: true, message: '请选择组织范围', trigger: 'blur' }],
        channelsCode: [{ required: true, message: '请选择渠道范围', trigger: 'blur' }],
        terminalsCode: [{ required: true, message: '请选择终端范围', trigger: 'blur' }],
        status: [{ required: true, message: '请选择终端范围', trigger: 'blur' }]
      }
    }
  },
  computed: {
    serachGrowthRuleFormLabel() {
      return [
        {
          label: '规则名称：',
          type: 'select',
          prop: 'growthRule',
          options: this.selectGrowthRuleList
        },
        {
          label: '组织范围：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationList
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsCode',
          options: this.channelList
        }
      ]
    },
    growthRuleListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '规则名称',
          type: 'codeName',
          props: 'growthRule',
          render: res => {
            return res.growthRule + '-' + res.growthRuleName
          }
        },
        {
          label: '成长值规则',
          type: 'codeName',
          props: 'moneyParameter',
          render: res => {
            return `每消费${res.moneyParameter}元获得${res.growth}成长值`
          }
        },
        {
          label: '组织范围',
          type: 'codeName',
          props: 'organizationCode',
          render: res => {
            return res.organizationCode + '-' + res.organizationName
          }
        },
        {
          label: '渠道范围',
          type: 'codeName',
          props: 'channelsCode',
          render: res => {
            return res.channelsCode + '-' + res.channelsName
          }
        },
        {
          label: '终端范围',
          type: 'codeName',
          props: 'terminalsCode',
          render: res => {
            return res.terminalsCode + '-' + res.terminalsName
          }
        },
        {
          label: '状态',
          type: 'switch',
          props: 'status',
          method: 'updateStatus'
        }
      ]
    }
  },
  created() {
    // 获取组织范围
    this.getOrganizationList()
    // 获取渠道范围
    this.getChannelList()
    // 数据字典获取成长值规则
    this.getSelectGrowthRuleList()
    // 获取成长值规则列表
    this.getGrowthRuleList()
  },
  // mounted() {
  //   this.growthRuleList.push({
  //     id: '1',
  //     growthRule: '01',
  //     growthRuleName: '消费增加成长值',
  //     organizationCode: '01',
  //     organizationName: '组织名称',
  //     channelsCode: '02',
  //     channelsName: '渠道名称',
  //     terminalsCode: '03',
  //     terminalsName: '终端名称',
  //     moneyParameter: 1,
  //     growth: 1,
  //     status: true
  //   })
  // },
  methods: {
    /**
     * 描述：获取成长值规则列表
     */
    getGrowthRuleList() {
      this.$api.getGrowthRuleApi.getGrowthRuleList(this.serachGrowthRuleForm).then(res => {
        // console.log(res)
        this.growthRuleList = res.data
      })
    },
    /**
     * 描述：表格开关更新方法
     */
    async updateStatus(val) {
      console.log(val)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getGrowthRuleList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const obj = {
          status: val.status
        }
        this.$api.putGrowthRuleApi.putGrowthStatus(val.id, obj).then(res => {
          if (res.code === '200000') this.getGrowthRuleList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    /**
     * 描述：查询成长值规则方法
     */
    searchGrowthRuleForm() {
      this.getGrowthRuleList()
    },
    /**
     * 描述：重置查询成长值规则方法
     */
    resetSearchGrowthRuleForm() {
      this.serachGrowthRuleForm = {
        growthRule: '', // 成长规则code
        organizationCode: '', // 组织范围
        channelsCode: '', // 渠道范围
        pageIndex: 1,
        pageSize: 999
      }
      this.getGrowthRuleList()
    },
    /**
     * 描述：控制成长值规则新增弹出框方法
     */
    showGrowthRuleDialog() {
      this.isAdd = true
      this.dialogVisible = true
      this.growthRuleForm.moneyParameter = 1
      this.growthRuleForm.growth = 1
      this.currentGrowthRuleId = ''
    },
    /**
     * 描述：控制成长值规则编辑弹出框方法
     */
    showEditGrowthRuleDialog(data) {
      console.log(data)
      this.currentGrowthRuleId = data.id
      this.isAdd = false
      this.dialogVisible = true
      this.getGrowthRuleById()
    },
    async getGrowthRuleById() {
      const res = await this.$api.getGrowthRuleApi.getPointRuleById(this.currentGrowthRuleId)
      this.growthRuleForm = res
      this.getOrganizationList()
      this.getChannelList()
      const channelsId = this.allChannelList.filter(item => {
        return item.code === res.channelsCode
      })
      this.getTerminalList(channelsId)
    },
    /**
     * 描述：关闭弹框的方法
     */
    closeDialog() {
      this.$refs.growthRuleFormRef.resetFields()
    },
    /**
     * 描述：数据字典获取成长值规则
     */
    getSelectGrowthRuleList() {
      this.selectGrowthRuleList = []
      const obj = {}
      obj.ddCode = '10025'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.selectGrowthRuleList.push({ value: item.code, label: item.name })
        })
      })
    },
    /**
     * 描述：获取组织范围列表数据
     */
    async getOrganizationList() {
      this.organizationList = []
      const res = await this.$api.getOrganizationManagementApi.getOrganizationManagementIsPoint()
      res.map(item => {
        this.organizationList.push({ value: item.code, label: item.name })
      })
    },
    /**
     * 描述：获取渠道范围下拉列表数据
     */
    async getChannelList() {
      this.allChannelList = []
      this.channelList = []
      const res = await this.$api.getChannelApi.getDataChannelsListIsPonit()
      this.allChannelList = res
      res.map(item => {
        this.channelList.push({ value: item.code, label: item.name })
      })
    },
    // 选择组织
    selectOrganization(e) {},
    // 选择渠道
    selectChannel(e) {
      this.growthRuleForm.terminalsCode = ''
      const channelsId = this.allChannelList.filter(item => {
        return item.code === e
      })
      this.getTerminalList(channelsId[0].id)
    },
    // 选择终端获取焦点时判断
    focusTerminal() {
      if (this.growthRuleForm.channelsCode === '') {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择渠道范围',
          type: 'info'
        })
      }
    },
    /**
     * 描述：获取终端列表数据
     */
    async getTerminalList(channelsId) {
      this.terminalList = []
      const res = await this.$api.getTerminalApi.getTerminalListinPlatIsPoint(channelsId)
      res.map(item => {
        this.terminalList.push({ value: item.code, label: item.name })
      })
    },
    /**
     * 描述：提交添加数据或者编辑数据
     */
    confirm() {
      console.log(this.growthRuleForm)
      this.$refs.growthRuleFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求填写',
            type: 'info'
          })
        }
        this.growthRuleForm.moneyParameter = Number(this.growthRuleForm.moneyParameter)
        this.growthRuleForm.growth = Number(this.growthRuleForm.growth)
        /**
         * 描述：添加逻辑
         */
        if (this.isAdd) {
          this.$api.postGrowthRuleApi.postGrowthRule(this.growthRuleForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getGrowthRuleList()
            }
          })
        }
        /**
         * 描述：修改逻辑
         */
        if (!this.isAdd) {
          this.$api.putGrowthRuleApi.putGrowthRule(this.currentGrowthRuleId, this.growthRuleForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getGrowthRuleList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

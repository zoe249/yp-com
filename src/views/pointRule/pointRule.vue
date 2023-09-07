<!--
 * @Author: 谯坤
 * @Date: 2021-05-31 09:49:32
 * @LastEditTime: null
 * @LastEditors: null
 * @Description: 积分规则
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showPointRuleDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="serachPointRuleFormLabel" :formData="serachPointRuleForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchPointRule"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchPointRule" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 积分规则表格 begin -->
    <yp-table :propArr="pointRuleListLabel" :listInfo="pointRuleList" @updateStatus="updateStatus">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditPointRuleDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 积分规则表格 end -->
    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="40%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <el-form label-position="right" label-width="120px" :model="pointRuleForm" ref="pointRuleFormRef" :rules="pointRuleFormRule">
        <el-form-item label="积分类型：" prop="pointTypeCode">
          <el-select filterable v-model="pointRuleForm.pointTypeCode" :placeholder="$t('lang.pleaseselect')" @change="selectPointType">
            <el-option v-for="pointTypeItem in pointTypeList" :key="pointTypeItem.value" :label="pointTypeItem.label" :value="pointTypeItem.value"></el-option> </el-select
        ></el-form-item>
        <el-form-item label="积分规则：" v-show="isAddPoint" prop="moneyParameter"
          >每消费<el-input style="width:100px;margin:0px 10px;" v-model="pointRuleForm.moneyParameter"></el-input>元，获得<el-input
            style="width:100px;margin:0px 10px;"
            v-model="pointRuleForm.point"
          ></el-input
          >积分</el-form-item
        >
        <el-form-item label="积分规则：" v-show="!isAddPoint" prop="moneyParameter"
          >每<el-input style="width:100px;margin:0px 10px;" v-model="pointRuleForm.point"></el-input>积分，抵扣<el-input
            style="width:100px;margin:0px 10px;"
            v-model="pointRuleForm.moneyParameter"
          ></el-input
          >元</el-form-item
        >
        <!-- <el-form-item label="加减标记:">
          <el-select v-model="pointRuleForm.addFlag" disabled>
            <el-option :value="true" label="增加"></el-option>
            <el-option :value="false" label="减少"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="组织范围：" prop="organizationCode">
          <el-select filterable v-model="pointRuleForm.organizationCode" :placeholder="$t('lang.pleaseselect')" @change="selectOrganization">
            <el-option v-for="organizationItem in organizationList" :key="organizationItem.value" :label="organizationItem.label" :value="organizationItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="渠道范围：" prop="channelsCode">
          <el-select filterable v-model="pointRuleForm.channelsCode" :placeholder="$t('lang.pleaseselect')" @change="selectChannel">
            <el-option v-for="channelItem in channelList" :key="channelItem.value" :label="channelItem.label" :value="channelItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="终端范围：" prop="terminalsCode">
          <el-select filterable v-model="pointRuleForm.terminalsCode" :placeholder="$t('lang.pleaseselect')" @focus="focusTerminal">
            <el-option v-for="terminalItem in terminalList" :key="terminalItem.value" :label="terminalItem.label" :value="terminalItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
          <el-switch v-model="pointRuleForm.status"></el-switch>
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
      // console.log('钱的金额', value)
      // console.log('积分数', this.pointRuleForm.point)
      if (!this.pointRuleForm.point) {
        callback(new Error('请输入积分'))
      }
      if (!reg.test(value)) {
        callback(new Error('请输入大于0的正整数金额'))
      }
      if (!reg.test(this.pointRuleForm.point)) {
        callback(new Error('请输入大于0的正整数积分'))
      }
      callback()
    }
    return {
      currentPointRuleId: '',
      isAdd: true,
      // 积分规则查询表单
      serachPointRuleForm: {
        pageIndex: 1,
        pageSize: 999,
        pointTypeCode: '',
        organizationCode: '',
        channelsCode: ''
      },
      pointRuleForm: {
        pointTypeCode: '',
        moneyParameter: 1,
        point: 1,
        organizationCode: '',
        channelsCode: '',
        terminalsCode: '',
        status: true
      },
      pointRuleFormRule: {
        pointTypeCode: [{ required: true, message: '请选择积分类型', trigger: 'change' }],
        moneyParameter: [
          { required: true, message: '请填写金额', trigger: 'blur' },
          { validator: checkMoney, trigger: 'blur' }
        ],
        organizationCode: [{ required: true, message: '请选择组织范围', trigger: 'change' }],
        channelsCode: [{ required: true, message: '请选择渠道范围', trigger: 'change' }],
        terminalsCode: [{ required: true, message: '请选择终端范围', trigger: 'change' }],
        status: [{ required: true, message: '请选择终端范围', trigger: 'change' }]
      },
      pointRuleList: [], // 积分规则列表数据
      dialogVisible: false, // 控制添加 或 编辑弹窗 隐藏或显示
      pointTypeList: [], // 下拉积分类型数据列表
      organizationList: [], // 下拉组织范围数据列表
      channelList: [], // 获取渠道范围数据
      terminalList: [], // 获取渠道终端关系中的 终端数据
      isAddPoint: true, // 默认 积分规则 是 每 N 元积 N 分
      allChannelList: [] // 所有渠道数据列表
    }
  },
  computed: {
    serachPointRuleFormLabel() {
      return [
        {
          label: '积分类型：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
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
    pointRuleListLabel() {
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
          label: '积分类型',
          type: 'codeName',
          props: 'pointTypeId',
          render: res => {
            return res.pointTypeCode + '-' + res.pointTypeName
          }
        },
        {
          label: '积分规则',
          type: 'codeName',
          props: 'point',
          render: res => {
            if (res.pointTypeCode === '01') {
              return '每消费' + res.moneyParameter + '元,获得' + res.point + '积分'
            } else if (res.pointTypeCode === '02') {
              return '每' + res.point + '积分,抵扣' + res.moneyParameter + '元'
            }
          }
        },
        // {
        //   label: '加减标记',
        //   type: 'codeName',
        //   props: 'addFlag',
        //   render: res => {
        //     if (res.addFlag) {
        //       return '增加'
        //     } else {
        //       return '减少'
        //     }
        //   }
        // },
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
          props: 'channelsCode',
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
    // 获取积分规则列表数据
    this.getPointRuleList()
    // 获取积分类型列表
    this.getPointTypeList()
    // 获取组织范围
    this.getOrganizationList()
    // 获取渠道范围
    this.getChannelList()
  },
  mounted() {
    this.pointRuleList.push({
      id: '123412',
      pointTypeId: '123456',
      pointTypeName: '消费积分',
      pointTypeCode: '01',
      addFlag: true,
      organizationId: '456789',
      organizationCode: '888',
      organizationName: '悦朋',
      channelsId: '789',
      channelsCode: '854',
      channelsName: '渠道名称',
      terminalsId: '5555',
      terminalsCode: '4321',
      terminalsName: '终端一',
      moneyParameter: 10,
      point: 10,
      statue: true
    })
  },
  methods: {
    // 更新组织类型的状态 add by qiaokun 2020-12-27
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
        this.getPointRuleList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putPointRuleApi.putPointRuleStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getPointRuleList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 获取积分规则列表数据
    async getPointRuleList() {
      console.log('获取积分规则列表数据')
      const { data } = await this.$api.getPointRuleApi.getPointRuleList(this.serachPointRuleForm)
      console.log('积分规则列表数据:', data)
      this.pointRuleList = data
    },
    // 查询积分规则
    searchPointRule() {
      this.serachPointRuleForm.pageIndex = 1
      this.serachPointRuleForm.pageSize = 999
      this.getPointRuleList()
    },
    // 重置积分规则
    resetSearchPointRule() {
      this.serachPointRuleForm = {
        pageIndex: 1,
        pageSize: 999,
        pointTypeCode: '',
        organizationCode: '',
        channelsCode: ''
      }
      this.getPointRuleList()
    },
    // 获取积分类型列表数据
    async getPointTypeList(status = '') {
      // status 为 true 则获取有效的积分类型， 若为'' 获取所有积分类型数据
      const obj = {
        pageIndex: 1,
        pageSize: 999,
        info: '',
        species: '',
        status
      }
      const { data } = await this.$api.getPointTypeApi.getPointTypeList(obj)
      data.map(item => {
        this.pointTypeList.push({ value: item.code, label: item.name })
      })
    },
    // 获取组织范围列表数据
    async getOrganizationList() {
      this.organizationList = []
      const res = await this.$api.getOrganizationManagementApi.getOrganizationManagementIsPoint()
      console.log(res)
      res.map(item => {
        this.organizationList.push({ value: item.code, label: item.name })
      })
    },
    // 获取渠道范围下拉列表数据
    async getChannelList() {
      this.allChannelList = []
      this.channelList = []
      const res = await this.$api.getChannelApi.getDataChannelsListIsPonit()
      console.log(res)
      this.allChannelList = res
      res.map(item => {
        this.channelList.push({ value: item.code, label: item.name })
      })
    },
    // 控制添加积分规则弹出框
    showPointRuleDialog() {
      this.isAdd = true
      this.isAddPoint = true
      this.pointTypeList = []
      this.organizationList = []
      this.channelList = []
      this.allChannelList = []
      this.dialogVisible = true
      // 查询积分类型列表
      this.getPointTypeList(true)
      // 查询组织范围列表数据
      this.getOrganizationList()
      // 获取渠道终端关系中的渠道列表
      this.getChannelList()
    },
    /**
     * 描述：控制编辑对话框弹出
     */
    showEditPointRuleDialog(item) {
      this.isAdd = false
      console.log(item)
      if (item.pointTypeCode === '01') {
        this.isAddPoint = true
      }
      if (item.pointTypeCode === '02') {
        this.isAddPoint = false
      }
      this.currentPointRuleId = item.id
      // 根据积分规则 id 查询当前规则数据
      this.getPointRuleById(item.id)
      this.dialogVisible = true
    },
    /**
     * 描述：根据 积分规则id 查询具体某一条积分规则数据
     */
    async getPointRuleById(id) {
      const res = await this.$api.getPointRuleApi.getPointRuleById(id)
      console.log(res)
      this.pointRuleForm = res
      this.getOrganizationList()
      this.getChannelList()
      const channelsId = this.allChannelList.filter(item => {
        return item.code === res.channelsCode
      })
      this.getTerminalList(channelsId)
    },
    // 监听弹窗关闭事件
    closeDialog() {
      this.$refs.pointRuleFormRef.resetFields()
      this.pointRuleForm.point = 1
      this.pointRuleForm.moneyParameter = 1
    },
    // 表单中的方法
    selectPointType(e) {
      if (e === '01') {
        this.isAddPoint = true
        // this.pointRuleForm.addFlag = true
      } else if (e === '02') {
        this.isAddPoint = false
        // this.pointRuleForm.addFlag = false
      }
    },
    // 选择组织
    selectOrganization(e) {
      console.log(e)
    },
    // 选择渠道
    selectChannel(e) {
      console.log(e)
      console.log(this.allChannelList)
      this.pointRuleForm.terminalsCode = ''
      const channelsId = this.allChannelList.filter(item => {
        return item.code === e
      })
      console.log(channelsId)
      this.getTerminalList(channelsId[0].id)
    },
    // 选择终端获取焦点时判断
    focusTerminal() {
      if (this.pointRuleForm.channelsCode === '') {
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
    // 确认操作
    confirm() {
      console.log(this.pointRuleForm)
      this.$refs.pointRuleFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求填写',
            type: 'info'
          })
        }
        this.pointRuleForm.moneyParameter = Number(this.pointRuleForm.moneyParameter)
        this.pointRuleForm.point = Number(this.pointRuleForm.point)
        /**
         * 描述：添加逻辑
         */
        if (this.isAdd) {
          this.$api.postPointRuleApi.postPointRule(this.pointRuleForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointRuleList()
            }
          })
        }
        /**
         * 描述：修改逻辑
         */
        if (!this.isAdd) {
          this.$api.putPointRuleApi.putPointRule(this.pointRuleForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointRuleList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped></style>

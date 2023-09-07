<!--
 * @Author: liupennghui
 * @Date: 2021-01-12 09:21:39
 * @LastEditTime: 2021-01-29 10:38:08
 * @LastEditors: Please set LastEditors
 * @Description: 积分有效期
 * @FilePath: \celesta-web-project\src\views\pointValidPeriod\pointValidPeriod.vue
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showPointValidPeriodDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="serachPointValidPeriodFormLabel" :formData="serachPointValidPeriodForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchPointValidPeriodForm"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchPointValidPeriod" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 积分有效期表格 begin -->
    <yp-table :propArr="pointValidPeriodListLabel" :listInfo="pointValidPeriodList" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditpointValidPeriodDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 积分有效期表格 end -->

    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="40%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <el-form :model="pointValidPeriodForm" ref="ypForm" label-width="180px" label-position="right" :rules="pointValidPeriodFormRule">
        <div>
          <div v-for="(item, index) in pointValidPeriodFormLabel" :key="index">
            <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
              <el-select filterable v-model="pointValidPeriodForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'terminalSelect'" :label="item.label" :prop="item.prop">
              <el-select
                @focus="focusTerminal"
                filterable
                v-model="pointValidPeriodForm[item.prop]"
                :placeholder="$t('lang.pleaseselect')"
                :disabled="item.disabled ? true : false"
                :multiple="item.multiple"
              >
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="item.type === 'channelSelect'" :label="item.label" :prop="item.prop">
              <el-select
                @change="channelChange"
                filterable
                v-model="pointValidPeriodForm[item.prop]"
                :placeholder="$t('lang.pleaseselect')"
                :disabled="item.disabled ? true : false"
                :multiple="item.multiple"
              >
                <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
              </el-select>
            </el-form-item>
          </div>
        </div>
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
// import YpForm from '@/components/form/YpForm.vue'
export default {
  components: {
    YpSearchForm,
    YpTable
    // YpForm
  },
  computed: {
    // 积分类型搜索表单内容
    serachPointValidPeriodFormLabel() {
      return [
        {
          label: this.$t('lang.pointtype') + '：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
        },
        {
          label: this.$t('lang.organizationscope') + '：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationList
        }
      ]
    },
    // 积分有效期表格数据
    pointValidPeriodListLabel() {
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
          label: this.$t('lang.pointtype'),
          props: 'pointTypeName'
        },
        {
          label: this.$t('lang.organizationscope'),
          props: 'organizationName',
          width: '200'
        },
        {
          label: this.$t('lang.channelscope'),
          props: 'channelsName',
          width: '130'
        },
        {
          label: this.$t('lang.terminalscope'),
          props: 'terminalsName',
          width: '140'
        },
        {
          label: this.$t('lang.validetime'),
          props: 'validPeriodName',
          width: '150'
        },
        {
          label: this.$t('lang.creationtime'),
          props: 'createTime',
          type: 'time',
          width: '160'
        },
        {
          label: this.$t('lang.modificationtime'),
          props: 'updateTime',
          type: 'time',
          width: '160'
        }
      ]
    },
    // 积分有效期对话框里面的表单数据
    pointValidPeriodFormLabel() {
      return [
        {
          label: this.$t('lang.pointtype') + '：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
        },
        {
          label: this.$t('lang.organizationscope') + '：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationList
        },
        {
          label: this.$t('lang.channelscope') + '：',
          type: 'channelSelect',
          prop: 'channelsCode',
          options: this.channelList
        },
        {
          label: this.$t('lang.terminalscope') + '：',
          type: 'terminalSelect',
          prop: 'terminalsCode',
          options: this.terminalList
        },
        {
          label: this.$t('lang.validetime') + '：',
          type: 'select',
          prop: 'validPeriod',
          options: this.effectiveTimeList
        }
      ]
    }
  },
  data() {
    return {
      allChannelList: [], // 渠道的全部数据列表用于选择渠道后过滤获取选择终端列表
      channelList: [], // 接受渠道范围数据列表
      organizationList: [], // 接受组织范围数据列表
      terminalList: [], // 接受终端范围数据列表
      channelId: '', // 用于接受渠道 Id，（用于获取终端范围列表）
      effectiveTimeList: [], // 从数据字典获取有效期下拉表单
      pointTypeList: [], // 获取积分类型下拉表单数据（取得为有效状态的积分类型）

      // 积分有效期表头表单数据内容
      serachPointValidPeriodForm: {
        organizationCode: '',
        pointTypeCode: '',
        pageSize: 20,
        pageIndex: 1
      },
      // 积分对话框里面表单数据
      pointValidPeriodForm: {
        pointTypeCode: '',
        organizationCode: '',
        channelsCode: '',
        terminalsCode: '',
        validPeriod: ''
      },
      // 校验规则
      pointValidPeriodFormRule: {
        channelsCode: [{ required: true, message: this.$t('lang.selectchannels'), trigger: 'blur' }],
        pointTypeCode: [{ required: true, message: this.$t('lang.selectpointtype'), trigger: 'blur' }],
        organizationCode: [{ required: true, message: this.$t('lang.selectorganizationscope'), trigger: 'blur' }],
        terminalsCode: [{ required: true, message: this.$t('lang.selectterminal'), trigger: 'blur' }],
        validPeriod: [{ required: true, message: this.$t('lang.selectvalid'), trigger: 'blur' }]
      },
      // 积分有效期表格数据（从后端接受）
      pointValidPeriodList: [],
      // 控制对话框显示与关闭状态的元素
      dialogVisible: false,
      //   用来进行展示对话框显示的表头是什么的
      isAdd: true
    }
  },
  created() {
    this.getPointValidPeriodList() // 获取积分有效期表格数据
    this.getOrganizationList() // 获取积分有效期组织范围下拉数据
    this.getEffectiveTimeList() // 从数据词典获取积分有效期下拉表单数据
    this.getPointTypeList() // 获取积分类型下拉表单数据
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 表格样式
  },
  methods: {
    // 表格样式
    getHeight() {
      this.height = window.innerHeight - 250 + 'px'
    },
    // 从后端获取积分有效期表格数据
    getPointValidPeriodList() {
      this.$api.getPointValidPeriodApi.getPointValidPeriodList(this.serachPointValidPeriodForm).then(res => {
        this.pointValidPeriodList = res.data
      })
    },
    // 新增积分有效期数据
    showPointValidPeriodDialog() {
      this.getChannelList() // 获取渠道范围下拉框数据
      this.dialogVisible = true
      this.isAdd = true
    },
    // 编辑积分有效期数据（查看详情按钮）
    showEditpointValidPeriodDialog(item) {
      this.isAdd = false
      this.getPointValidPeriodListById(item.id)
      this.dialogVisible = true
      this.getChannelList() // 获取渠道范围数据
      this.getTerminalList() // 获取终端范围下拉框数据
    },
    // 根据 Id 获取积分有效期某一条数据
    getPointValidPeriodListById(id) {
      this.$api.getPointValidPeriodApi.getPointValidPeriodListById(id).then(res => {
        this.pointValidPeriodForm = res
      })
    },
    // 对话框最后的确认按钮
    confirm() {
      this.$refs.ypForm.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postPointValidPeriodApi.postPointValidPeriodList(this.pointValidPeriodForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointValidPeriodList()
            }
          })
        } else {
          this.$api.putPointValidPeriodApi.putPointValidPeriodList(this.pointValidPeriodForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointValidPeriodList()
            }
          })
        }
      })
    },
    // 重置积分有效期表头表单数据
    resetSearchPointValidPeriodForm() {
      this.serachPointValidPeriodForm = {
        organizationCode: '',
        pointTypeCode: '',
        pageSize: 20,
        pageIndex: 1
      }
      this.getPointValidPeriodList()
    },
    // 搜索积分有效期数据
    searchPointValidPeriod() {
      this.getPointValidPeriodList()
    },
    // 当对话框关闭之后所触发的条件
    closeDialog() {
      this.channelList = [] // 清空渠道范围下拉框数据
      this.terminalList = [] // 清空终端范围下拉框数据
      this.$refs.ypForm.resetFields() // 清空校验规则提示
      this.pointValidPeriodForm = {
        pointTypeCode: '',
        organizationCode: '',
        channelsCode: '',
        terminalsCode: '',
        validPeriod: ''
      }
      this.getPointValidPeriodList() // 获得积分有效期表格数据
    },
    // 渠道下拉框中 change 改变事件
    channelChange() {
      const currentChannel = this.allChannelList.filter(item => {
        return item.code === this.pointValidPeriodForm.channelsCode
      })
      this.channelId = currentChannel[0].id
      // this.channelId = this.pointValidPeriodForm.channelsId
      this.pointValidPeriodForm.terminalsCode = ''
      this.getTerminalList()
    },
    // 终端下拉框 foucs 事件
    focusTerminal() {
      if (this.pointValidPeriodForm.channelsCode === '') {
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.selectchannels'),
          type: 'info'
        })
      } else {
        this.terminalList = []
        console.log(this.pointValidPeriodForm.channelsCode)
        console.log(this.channelList)
        const currentChannel = this.allChannelList.filter(item => {
          return item.code === this.pointValidPeriodForm.channelsCode
        })
        console.log(currentChannel[0].id)
        this.channelId = currentChannel[0].id
        this.getTerminalList()
      }
    },
    // 获取渠道范围数据（用于对话框中的下拉框）
    getChannelList() {
      this.$api.getChannelApi.getDataChannelsListIsPonit().then(res => {
        this.allChannelList = res
        res.map(item => {
          this.channelList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取组织范围数据列表（用于对话框中的组织范围下拉框）
    getOrganizationList() {
      this.$api.getOrganizationManagementApi.getOrganizationManagementIsPoint().then(res => {
        res.map(item => {
          this.organizationList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取终端范围的数据列表（用于对话框中终端范围的下拉框）
    getTerminalList() {
      // this.channelId = this.pointValidPeriodForm.channelsId
      this.terminalList = []
      this.$api.getTerminalApi.getTerminalListinPlatIsPoint(this.channelId).then(res => {
        res.map(item => {
          this.terminalList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 从数据字典获取有效期
    getEffectiveTimeList() {
      this.effectiveTimeList = []
      const obj = {}
      obj.ddCode = '10020'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.effectiveTimeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 从积分类型里面获取积分类型（有效状态）
    getPointTypeList() {
      this.pointTypeList = []
      const obj = {}
      obj.species = ''
      obj.info = ''
      obj.status = true
      obj.pageSize = 999
      obj.pageIndex = 1
      this.$api.getPointTypeApi.getPointTypeList(obj).then(res => {
        res.data.map(item => {
          this.pointTypeList.push({ value: item.code, label: item.name })
        })
      })
    }
  }
}
</script>
<style scoped></style>

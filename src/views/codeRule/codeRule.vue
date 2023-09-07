<!--
 * @FileDescription: 编号规则
 * @Author: liupenghui
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-02-22 08:36:46
 -->
<template>
  <div>
    <div>
      <!-- 新增按钮 begin -->
      <el-button class="add-btn" size="mini" type="primary" @click="showAddCodeRulesDialog">{{ this.$t('lang.add') }}</el-button>
      <!-- 新增按钮 end -->

      <!-- 头部搜索表单 begin -->
      <div class="search-form-box">
        <yp-search-form class="search-form-wrapper" :formLabel="searchCodeRulesFormLabel" :formData="searchCodeRulesForm"></yp-search-form>
        <div class="search-btn-wrapper">
          <el-button
            class="reset-btn"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="resetSearchCodeRules"
            size="mini"
            icon="el-icon-refresh-left"
            >{{ this.$t('lang.reset') }}</el-button
          >
          <el-button class="search-btn" type="primary" @click="searchCodeRules" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
        </div>
      </div>
      <!-- 头部搜索表单 end -->

      <!-- 主表格内容 begin -->
      <div class="channel-table">
        <yp-table :propArr="codeRulesListLabel" :listInfo="codeRulesList" :height="height">
          <template v-slot:button="scope">
            <el-button type="text" icon="el-icon-edit-outline" @click="showEditCodeRulesDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
          </template>
        </yp-table>
      </div>
      <!-- 主表格内容 end -->

      <!-- 编辑与添加对话框内容 begin -->
      <div class="dialog">
        <el-dialog v-dialogDrag :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="50%" @close="closeDialog" :close-on-click-modal="false">
          <template slot="title">
            <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
              {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
            </div>
          </template>
          <!-- 对话框里面的表单 begin -->
          <el-form :model="codeRulesForm" ref="ypForm" label-width="120px" label-position="right" :rules="codeRulesFormRule">
            <div>
              <div v-for="(item, index) in codeRulesFormLabel" :key="index">
                <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                  <el-input
                    v-model.trim="codeRulesForm[item.prop]"
                    :placeholder="item.placeholder"
                    clearable
                    @change="statueChange"
                    :disabled="item.disabled ? true : false"
                    :maxlength="item.maxLength ? item.maxLength : '32'"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="item.type === 'inputsuffixExclude'" :label="item.label" :prop="item.prop">
                  <el-input
                    v-model.trim="codeRulesForm[item.prop]"
                    :placeholder="item.placeholder"
                    clearable
                    :disabled="item.disabled ? true : false"
                    :maxlength="item.maxLength ? item.maxLength : '32'"
                  ></el-input>
                </el-form-item>
                <el-form-item v-if="item.type === 'render'" :label="item.label">
                  <span>{{ codeRulesForm[item.prop] }}</span>
                </el-form-item>
                <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
                  <el-select
                    filterable
                    v-model="codeRulesForm[item.prop]"
                    @change="statueChange"
                    :placeholder="$t('lang.pleaseselect')"
                    :disabled="item.disabled ? true : false"
                    :multiple="item.multiple"
                  >
                    <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="item.type === 'selecttype'" :label="item.label" :prop="item.prop">
                  <el-select filterable v-model="codeRulesForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                    <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </div>
            </div>
          </el-form>
          <!-- 对话框里面的表单 end -->
          <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">{{ this.$t('lang.cancel') }}</el-button>
            <el-button type="primary" @click="confirm">{{ this.$t('lang.preserve') }}</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 编辑与添加对话框内容 end -->
    </div>
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
export default {
  components: {
    YpSearchForm,
    YpTable
  },
  data() {
    // num
    const re = /^[0-9]*$/
    var validateNum = (rule, value, callback) => {
      if (!re.test(value)) {
        return callback(new Error('请输入纯数字形式'))
      } else {
        return callback()
      }
    }
    return {
      // 用来进行拼接编码项值与编码类型值
      codeTypeName: '',
      // 获取编码类型（excludeExist 为 true）
      excludeExist: { excludeExist: false },
      // 获取编码类型（excludeExist 为 false）
      dialogExcludeExist: { excludeExist: true },
      // 来进行获取号码中间
      getCodeRuleMiddleArr: [],
      getCodeRuleMiddle: [],
      // 编辑
      currentCodeRulesId: '0',
      // 用来进行接受编号类型数据
      getCodeTypesLists: [],
      getCodeTypesListsArr: [],
      // 获取编号类型（用于对话框中的编号类型）
      getDialogCodeTypesLists: [],
      getDialogCodeTypesListsArr: [],
      // 控制对话框的显示与关闭
      dialogVisible: false,
      // 对话框标题内容
      isAdd: true,
      // 接受后端表格数据
      codeRulesList: [],
      // 头部搜索所需要的
      searchCodesRulesLists: { ddCode: '10002', status: true },
      // 头部搜索表单的假数据
      searchCodeRulesForm: {
        type: ''
      },
      // 编辑与新增对话框里面的表单内容
      codeRulesForm: {
        type: '',
        codePrefix: '',
        codeMiddle: '',
        codeSuffix: '',
        suffixExclude: '',
        notes: '',
        previewCode: ''
      },
      // 编号规则表单校验规则
      codeRulesFormRule: {
        type: [{ required: true, message: '请选择编号类型', trigger: 'blur' }],
        codeMiddle: [{ required: true, message: '请选择号码中间', trigger: 'blur' }],
        codeSuffix: [
          { required: true, message: '请输入号码后缀', trigger: 'blur' },
          { validator: validateNum, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    // 主表格的数据内容
    codeRulesListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation' },
        {
          label: this.$t('lang.numbertype'),
          props: 'typeName',
          type: 'status',
          render: row => {
            if (row) {
              return row.typeName + ' - ' + row.type
            }
          }
        },
        { label: this.$t('lang.numberprefix'), props: 'codePrefix' },
        { label: this.$t('lang.numbermiddle'), props: 'codeMiddleName' },
        { label: this.$t('lang.numbersuffix'), props: 'codeSuffix' },
        { label: this.$t('lang.suffixexclusion'), props: 'suffixExclude' },
        { label: this.$t('lang.remarks'), props: 'notes' },
        {
          label: this.$t('lang.previeweffect'),
          props: 'previewCode'
        }
      ]
    },
    // 对话框表单内容
    codeRulesFormLabel() {
      return [
        {
          label: this.$t('lang.previeweffect') + '：',
          type: 'render',
          prop: 'previewCode'
        },
        {
          label: this.$t('lang.numbertype') + '：',
          type: 'selecttype',
          prop: 'type',
          options: this.getDialogCodeTypesLists
        },
        { label: this.$t('lang.numberprefix') + '：', type: 'input', prop: 'codePrefix' },
        {
          label: this.$t('lang.numbermiddle') + '：',
          type: 'select',
          prop: 'codeMiddle',
          options: this.getCodeRuleMiddle
        },
        { label: this.$t('lang.numbersuffix') + '：', type: 'input', prop: 'codeSuffix' },
        { label: this.$t('lang.suffixexclusion') + '：', type: 'inputsuffixExclude', prop: 'suffixExclude' },
        { label: this.$t('lang.remarks') + '：', type: 'inputsuffixExclude', prop: 'notes' }
      ]
    },
    // 头部搜索表单的内容
    searchCodeRulesFormLabel() {
      return [
        {
          label: this.$t('lang.numbertype') + '：',
          type: 'select',
          prop: 'type',
          options: this.getCodeTypesLists
        }
      ]
    }
  },
  created() {
    this.getCodeRulesList()
    this.getCodeTypeList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 250 + 'px'
      console.log(this.height)
    },
    // 获取编号中间
    getCodesMiddleLists() {
      this.getCodeRuleMiddle = []
      this.$api.getDataDicApi.getDataDicItemListByddCode(this.searchCodesRulesLists).then(res => {
        console.log(res)
        res.map(item => {
          this.getCodeRuleMiddleArr = item
          this.getCodeRuleMiddle.push({ value: item.code, label: item.name })
        })
      })
    },
    // 编号预览方法
    statueChange() {
      this.$api.getcodeRulesApi.getCodeRulesView(this.codeRulesForm).then(res => {
        console.log(res)
        this.codeRulesForm.previewCode = res
        console.log(this.codeRulesForm.previewCode)
      })
    },
    // 头部搜索按钮
    searchCodeRules() {
      console.log('searchCodeRules')
      this.getCodeRulesList()
    },
    // 获取编码规则数据列表
    getCodeRulesList() {
      this.$api.getcodeRulesApi.getCodeRulesList(this.searchCodeRulesForm).then(res => {
        console.log(res)
        this.codeRulesList = res.data
      })
    },
    // 重置按钮
    resetSearchCodeRules() {
      this.searchCodeRulesForm.type = ''
      this.getCodeRulesList()
    },
    // 新增编码规则
    showAddCodeRulesDialog() {
      this.isAdd = true
      this.getCodesMiddleLists()
      this.getDialogCodeTypeList()
      this.dialogVisible = true
    },
    // 编辑编码规则
    showEditCodeRulesDialog(res) {
      this.isAdd = false
      this.getcodeRulesById(res.id)
      // this.getDialogCodeTypeList()
      this.getDialogCodeTypeList()
      // this.getCodeTypeList()
      this.getCodesMiddleLists()
      this.dialogVisible = true
    },
    // 根据 id 获取某一条数据
    getcodeRulesById(id) {
      this.currentCodeRulesId = id
      console.log(id)
      this.$api.getcodeRulesApi.getCodeRulesListById(id).then(res => {
        this.codeRulesForm = res
        console.log(res)
      })
    },
    // 最后确定是否新增或关闭
    confirm() {
      this.$refs.ypForm.validate(async valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postcodeRulesApi.postCodeRulesList(this.codeRulesForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getCodeRulesList()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putcodeRulesApi.putCodeRulesList(this.codeRulesForm, this.currentCodeRulesId).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getCodeRulesList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 获取头部编号类型（excludeExist 为 true）
    getCodeTypeList() {
      this.$api.getcodeRulesApi.getCodeTypeList(this.excludeExist).then(res => {
        this.getCodeTypesListsArr = res
        console.log(res)
        this.getCodeTypesListsArr.map(item => {
          this.getCodeTypesLists.push({ value: item.code, label: item.typeName })
        })
      })
    },
    // 获取对话框中的编号类型（ excludeExist 为 false）
    getDialogCodeTypeList() {
      if (this.isAdd === true) {
        this.getDialogCodeTypesLists = []
        this.$api.getcodeRulesApi.getCodeTypeList(this.dialogExcludeExist).then(res => {
          console.log(res)
          this.getDialogCodeTypesListsArr = res
          this.getDialogCodeTypesListsArr.map(item => {
            this.getDialogCodeTypesLists.push({ value: item.code, label: item.typeName })
          })
        })
      } else {
        this.getDialogCodeTypesLists = []
        this.$api.getcodeRulesApi.getCodeTypeList(this.excludeExist).then(res => {
          this.getCodeTypesListsArr = res
          console.log(res)
          this.getCodeTypesListsArr.map(item => {
            this.getDialogCodeTypesLists.push({ value: item.code, label: item.typeName })
            console.log(this.getDialogCodeTypesLists)
          })
        })
      }
    },
    // 当关闭对话框的时候，所触发的事件
    closeDialog() {
      this.codeRulesForm = {
        type: '',
        codePrefix: '',
        codeMiddle: '',
        codeSuffix: '',
        suffixExclude: '',
        notes: ''
      }
      this.$refs.ypForm.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

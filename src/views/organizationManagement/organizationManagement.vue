<!--
 * @Author: liupenghui
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-02-21 11:15:12
 * @LastEditors: Please set LastEditors
 * @Description: 组织管理
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddOrganizationManagementDialog" v-permission="{ action: 'add', effect: 'disabled' }" :disabled="isTop">{{
      this.$t('lang.add')
    }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchOrganizationManegementFormLabel" :formData="searchOrganizationManegementForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchOrganizationManagement"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchOrganizationManagement" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- <el-alert title="组织管理顶级只允许存在一条" type="info" show-icon> </el-alert> -->
    <!-- 我是表格组件 begin -->
    <yp-table :propArr="organizationManagementListLabel" :height="height" :listInfo="organizationManagementList" children="organizations" :expand="true" @updateStatus="updateStatus">
      <template v-slot:button="scope">
        <el-button type="text" v-permission="{ action: 'edit', effect: 'disabled' }" icon="el-icon-search" @click="showEditOrganizationManagementDialog(scope.scope)">{{
          $t('lang.viewDetails')
        }}</el-button>
        <el-button type="text" v-permission="{ action: 'addChild', effect: 'disabled' }" :disabled="scope.scope.isLastLevel" @click="showAddChildOrganizationManagementDialog(scope.scope)">{{
          '+ ' + $t('lang.addsubordinate')
        }}</el-button>
        <el-button type="text" v-permission="{ action: 'delete', effect: 'disabled' }" icon="el-icon-delete" @click="deleteOrganizationManagement(scope.scope)">{{ $t('lang.delete') }} </el-button>
      </template>
    </yp-table>
    <!-- 我是表格组件 end -->
    <!-- 编辑与添加对话框内容 begin -->
    <div class="dialog">
      <el-dialog v-dialogDrag :title="isAdd ? this.$t('lang.add') : this.$t('lang.edit')" :visible.sync="dialogVisible" width="50%" @close="closeDialog" :close-on-click-modal="false">
        <template slot="title">
          <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
            {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
          </div>
        </template>
        <!-- 对话框里面的表单 begin -->
        <el-form :model="organizationManagementForm" ref="ypForm" label-width="120px" label-position="right" :rules="organizationManagementFormRule">
          <div>
            <div v-for="(item, index) in organizationManagementFormLabel" :key="index">
              <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                <el-input v-model.trim="organizationManagementForm[item.prop]" placeholder="" clearable :disabled="item.disabled ? true : false"></el-input>
              </el-form-item>
              <!-- 用于地址!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!! -->
              <el-form-item v-if="item.type === 'adress'" :label="item.label" :prop="item.prop">
                <span style="margin-right:20px;">
                  <el-select
                    style="width:100px"
                    size="medium"
                    filterable
                    v-model="organizationManagementForm[item.propProvince]"
                    :placeholder="$t('lang.pleaseselect')"
                    :disabled="item.disabled ? true : false"
                    :multiple="item.multiple"
                    @change="propProvinceChanges"
                  >
                    <el-option v-for="(selectItem, index) in item.optionsPvovince" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </span>
                <span style="margin-right:20px;">
                  <el-select
                    style="width:100px"
                    size="medium"
                    filterable
                    v-model="organizationManagementForm[item.propCity]"
                    :placeholder="$t('lang.pleaseselect')"
                    :disabled="item.disabled ? true : false"
                    :multiple="item.multiple"
                    @change="propCityChanges"
                    @focus="propCityChangesValue"
                  >
                    <el-option v-for="(selectItem, index) in item.optionsCity" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </span>

                <span style="margin-right:20px;">
                  <el-select
                    style="width:100px"
                    size="medium"
                    filterable
                    v-model="organizationManagementForm[item.propArea]"
                    :placeholder="$t('lang.pleaseselect')"
                    :disabled="item.disabled ? true : false"
                    :multiple="item.multiple"
                    @focus="propAreaFoucs"
                  >
                    <el-option v-for="(selectItem, index) in item.optionsArea" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </span>

                <span style="margin-right:20px;">
                  <el-input
                    style="width:300px"
                    size="medium"
                    v-model.trim="organizationManagementForm[item.propStress]"
                    :placeholder="item.placeholderStress"
                    clearable
                    :disabled="item.disabled ? true : false"
                  >
                  </el-input>
                </span>
                <span>
                  <el-input size="medium" v-model.trim="organizationManagementForm[item.propAdress]" :placeholder="item.placeholderAdress" clearable :disabled="item.disabled ? true : false">
                  </el-input>
                </span>
              </el-form-item>
              <!-- 下拉表单 -->
              <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
                <el-select filterable v-model="organizationManagementForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                  <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
              <!-- 开关状态 -->
              <el-form-item v-if="item.type === 'switch'" :label="item.label">
                <el-switch v-model="organizationManagementForm[item.prop]" :disabled="item.disabled ? true : false"></el-switch>
              </el-form-item>
              <!-- 上传图片 -->
              <el-form-item v-if="item.type === 'img'" :label="item.label">
                <yp-single-upload utype="platformLogo" :url.sync="organizationManagementForm[item.prop]"></yp-single-upload>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <!-- 对话框里面的表单 end -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
          <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
          <el-button v-show="!isAdd" type="primary" @click="confirm" v-permission="{ action: 'edit', effect: 'disabled' }">{{ $t('lang.preserve') }}</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 编辑与添加对话框内容 end -->
  </div>
</template>
<script>
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpTable,
    YpSearchForm,
    YpSingleUpload
  },
  data() {
    // 验证邮箱
    var checkEmail = (rule, value, cb) => {
      if (value !== '') {
        const regEmail = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        if (regEmail.test(value)) {
          return cb()
        }
        cb(new Error('请输入合法正确的邮箱'))
      } else {
        return cb()
      }
    }
    // 验证手机号
    var checkMobile = (rule, value, cb) => {
      if (value !== '') {
        const phoneRegMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
        const telRegMobile = /^0\d{2,3}-?\d{7,8}$/
        if (phoneRegMobile.test(value) | telRegMobile.test(value)) {
          return cb()
        }
        cb(new Error('请输入正确的手机号或座机号'))
      } else {
        return cb()
      }
    }
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
      // 提示接口地址要换 状态：未换
      // 这句话不用复制 ：   方法中传参数  一个是输入值 ，一个是当前的id  ，在点击新增的时候，弹框方法中将此值赋值为 空字符串 ，点击编辑的时候，将传过去的值 赋值给当前id
      if (value !== '') {
        const obj = {}
        obj.name = value
        obj.code = ''
        obj.id = this.currentOrganizationManagementId
        this.$api.getOrganizationManagementApi.getCheckName(obj).then(res => {
          // console.log('success')
          if (!res) {
            // console.log(res)
            return cb()
          } else {
            cb(new Error('输入的组织名称已存在'))
          }
        })
      }
    }
    const checkCode = (rule, value, cb) => {
      // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
      // 提示接口地址要换 状态：未换
      // 这句话不用复制 ：   方法中传参数  一个是输入值 ，一个是当前的id  ，在点击新增的时候，弹框方法中将此值赋值为 空字符串 ，点击编辑的时候，将传过去的值 赋值给当前id
      if (value !== '') {
        const codeRule = /[\W]/g
        console.log(codeRule.test(value))
        if (!codeRule.test(value)) {
          const obj = {}
          obj.name = ''
          obj.code = value
          obj.id = this.currentOrganizationManagementId
          this.$api.getOrganizationManagementApi.getCheckName(obj).then(res => {
            // console.log(res)
            if (!res) {
              return cb()
            } else {
              cb(new Error('输入的组织编码已存在'))
            }
          })
        } else {
          cb(new Error('输入不合法'))
        }
      }
    }
    return {
      parentOrganizationObj: {}, // 用来进行控制编辑与新增对话框中上级组织数据
      optionsPvovinceList: [], // 接受省的数据
      optionsCityList: [], // 接受市的数据
      optionsAreaList: [], // 接受市的数据
      // 用来进行对获取地址传参数
      adressId: '0', // 获取省时所传的 id
      cityId: '0', // 获取市时所传的 id
      areaId: '0', // 获取区时所传的 id
      // 编辑时存储列表数据
      currentSelect: [],
      // 组织关系查询表单
      searchOrganizationRelationForm: {
        pageIndex: 1,
        pageSize: 999,
        parentOrganizationTypeId: '',
        organizationTypeId: ''
      },
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
      // 用于唯一性校验
      currentOrganizationManagementId: '',
      // 判断新增与编辑时的对话框显示
      isAdd: true,
      // 上传图片
      utype: '',
      // 总条数
      total: 0,
      // 判断新增按钮是否禁止
      isTop: false,
      // 组织类型过滤
      optionList: [],
      // 组织类型过滤数据接受
      optionRelation: [],
      // 用来获取组织关系中的数据
      inGetRelationsList: [],
      outGetRelationsList: '',
      // 接受对话框父级列表
      parentList: [],
      // 用来进行对对话框里禁止的组织进行接受值
      getDisOrgTypeList: [],
      parentOrganizationTypeList: [],
      organizationTypeList: [], // 获取组织类型的数据列表
      selectOrganizationTypeList: [], // 下拉选择组织类型数据
      organizationTypeRelationList: [], // 通过组织管关系获取组织类型列表
      selectOrganizationTypeRelationList: [], // 通过组织关系获取组织类型下拉列表
      selectParentList: [], // 下拉选择父级列表数据
      // 接收表格数据
      organizationManagementList: [],

      // 搜索表单数据
      searchOrganizationManegementForm: {
        pageIndex: 1,
        pageSize: 20,
        code: '',
        organizationTypeId: '',
        formats: '',
        parent: '',
        excludeUser: false,
        userCode: '',
        publish: ''
      },

      // 控制对话框的显示与关闭
      dialogVisible: false,
      title: this.$t('lang.add'),

      // 控制对话框里面的数据内容
      organizationManagementForm: {
        state: '',
        city: '',
        district: '',
        organizationTypeName: '',
        organizationTypeId: '',
        code: '',
        name: '',
        parentId: '',
        publish: true,
        contacts: '',
        phone: '',
        address: '',
        formats: '',
        logo: '',
        systemName: '',
        tagline: '',
        serviceTel: '',
        email: ''
      },
      // 表单校验规则
      organizationManagementFormRule: {
        organizationTypeId: [{ required: true, message: '请输入组织类型', trigger: 'blur' }],
        code: [
          { required: true, message: '请输入组织编码', trigger: 'blur' },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        name: [
          { required: true, message: '请输入组织名称', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        phone: [
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        serviceTel: [
          {
            validator: checkMobile,
            trigger: 'blur'
          }
        ],
        email: [
          {
            validator: checkEmail,
            trigger: 'blur'
          }
        ]
      }
    }
  },
  computed: {
    // 控制搜索表单的内容数据
    searchOrganizationManegementFormLabel() {
      return [
        { label: this.$t('lang.organizationtwo') + ':', prop: 'code', type: 'input', placeholder: '组织编码或名称' },
        {
          label: this.$t('lang.organizationtype') + ':',
          prop: 'organizationTypeId',
          type: 'select',
          options: this.selectOrganizationTypeList
        },
        { label: this.$t('lang.format') + ':', prop: 'formats', type: 'input', placeholder: '业态' },
        { label: this.$t('lang.parentorganization') + ':', prop: 'parent', type: 'input', placeholder: '组织编码或名称' }
      ]
    },
    // 主表格数据内容
    organizationManagementListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation' },
        { label: this.$t('lang.organizationcoding'), props: 'code', position: 'left' },
        { label: this.$t('lang.organizationname'), props: 'name' },
        { label: this.$t('lang.organizationtype'), props: 'organizationTypeName' },
        { label: this.$t('lang.parentorganization'), props: 'parentName' },
        { label: this.$t('lang.adress'), props: 'address' },
        { label: this.$t('lang.format'), props: 'formats' },
        { label: this.$t('lang.onlineStatus'), props: 'publish', type: 'switch', method: 'updateStatus' }
      ]
    },
    // 控制对话框表单的数据
    organizationManagementFormLabel() {
      return [
        {
          label: this.$t('lang.organizationtype') + ':',
          type: 'select',
          prop: 'organizationTypeId',
          options: this.selectOrganizationTypeRelationList,
          disabled: !this.isAdd
        },
        { label: this.$t('lang.organizationcoding') + ':', type: 'input', prop: 'code', disabled: !this.isAdd },
        { label: this.$t('lang.organizationname') + ':', type: 'input', prop: 'name', position: 'left' },
        { label: this.$t('lang.parentorganization') + ':', type: 'select', prop: 'parentId', options: this.selectParentList, disabled: true },
        { label: this.$t('lang.onlineStatus') + ':', type: 'switch', prop: 'publish' },
        { label: this.$t('lang.contacts') + ':', type: 'input', prop: 'contacts' },
        { label: '联系电话:', type: 'input', prop: 'phone' },
        // 地址
        {
          label: this.$t('lang.adress') + ':',
          type: 'adress',
          prop: 'address',
          propProvince: 'state',
          propCity: 'city',
          propArea: 'district',
          propStress: 'street',
          propAdress: 'address',
          placeholderStress: '输入街道',
          placeholderAdress: '输入详细地址',
          optionsPvovince: this.optionsPvovinceList, // 省
          optionsCity: this.optionsCityList, // 市
          optionsArea: this.optionsAreaList // 区
        },
        { label: this.$t('lang.format') + ':', type: 'input', prop: 'formats' },
        { label: 'logo：', type: 'img', prop: 'logo' },
        { label: this.$t('lang.systemname') + ':', type: 'input', prop: 'systemName' },
        { label: this.$t('lang.slogan') + ':', type: 'input', prop: 'tagline' },
        { label: this.$t('lang.hotline') + ':', type: 'input', prop: 'serviceTel' },
        { label: this.$t('lang.serviceemail') + ':', type: 'input', prop: 'email' }
      ]
    }
  },
  created() {
    this.getOrganizationManagementList()
    // 获取组织类型列表用于查询组织
    this.getOrganizationTypeList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },

  methods: {
    getHeight() {
      this.height = window.innerHeight - 250 + 'px'
      // console.log(this.height)
    },
    // 获取省（参数为0）
    getStateInfo() {
      this.optionsPvovinceList = []
      this.$api.getOrganizationManagementApi.getAdress(this.adressId).then(res => {
        // console.log(res)
        res.map(item => {
          this.optionsPvovinceList.push({ value: item.id, label: item.name })
        })
        // console.log(this.optionsPvovinceList)
      })
    },
    // 获取市
    getCityInfo() {
      this.optionsCityList = []
      this.$api.getOrganizationManagementApi.getAdress(this.cityId).then(res => {
        res.map(item => {
          this.optionsCityList.push({ value: item.id, label: item.name })
        })
        // console.log(this.optionsCityList)
      })
    },
    // 获取区
    getAreaInfo() {
      this.optionsAreaList = []
      this.$api.getOrganizationManagementApi.getAdress(this.areaId).then(res => {
        res.map(item => {
          this.optionsAreaList.push({ value: item.id, label: item.name })
        })
        // console.log(this.optionsAreaList)
      })
    },
    // 当省的下拉框发生变化之后所触发的条件
    propProvinceChanges() {
      this.cityId = this.organizationManagementForm.state
      this.organizationManagementForm.city = ''
      this.organizationManagementForm.district = ''
      this.getCityInfo()
    },
    // 当市的下拉框发生变化之后所触发的条件
    propCityChanges() {
      this.areaId = this.organizationManagementForm.city
      this.organizationManagementForm.district = ''
      this.getAreaInfo()
    },
    propCityChangesValue() {
      if (this.organizationManagementForm.state === '') {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择省',
          type: 'info'
        })
        this.optionsCityList = [] // 市
      } else {
        this.cityId = this.organizationManagementForm.state
        this.getCityInfo()
      }
    },
    propAreaFoucs() {
      if (this.organizationManagementForm.city === '') {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择市',
          type: 'info'
        })
        this.optionsAreaList = [] // 区
      } else {
        this.areaId = this.organizationManagementForm.city
        this.getAreaInfo()
      }
    },
    // 更新组织类型的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      // console.log('111')
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getOrganizationManagementList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putOrganizationManagementApi.putOrganizationManagementStatus(val.id, val).then(res => {
          console.log(res)
          if (res === undefined) {
            this.getOrganizationManagementList()
          } else {
            if (res.code === '200000') {
              this.getOrganizationManagementList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            }
          }
        })
      }
    },
    // 关闭弹框
    closeDialog() {
      this.checkedId = []
      this.getOrganizationTypeList() // 获取组织类型下拉表单数据
      this.$refs.ypForm.resetFields()
      this.organizationManagementForm = {
        organizationTypeName: '',
        code: '',
        name: '',
        publish: true,
        contacts: '',
        phone: '',
        state: '',
        city: '',
        district: '',
        street: '',
        address: '',
        formats: '',
        logo: '',
        systemName: '',
        tagline: '',
        serviceTel: '',
        email: ''
      }
    },
    // 搜索
    searchOrganizationManagement() {
      this.getOrganizationManagementList()
    },
    // 通过查询组织关系查询组织类型
    getOrganizationRelationList() {
      this.organizationTypeRelationList = []
      this.selectOrganizationTypeRelationList = []
      this.$api.getOrganizationRelationApi.getOrganizationRelationList(this.searchOrganizationRelationForm).then(res => {
        // console.log(res)
        this.organizationTypeRelationList = res.data
        this.organizationTypeRelationList.map(item => {
          this.selectOrganizationTypeRelationList.push({ value: item.organizationTypeId, label: item.organizationTypeName })
        })
      })
    },
    // 新增子功能弹出框
    showAddChildOrganizationManagementDialog(item) {
      // 用来进行获取地址（在新增的时候只用来获取省，在编辑的时候，需要获取省市区，之后通过所绑定的 change 事件来进行获取市与县的数据）
      this.getStateInfo()
      // 地址信息结束
      this.currentSelect = []
      this.selectParentList = []
      this.selectOrganizationTypeList = []
      // this.getOrganizationTypeList()
      this.searchOrganizationRelationForm.parentOrganizationTypeId = item.organizationTypeId
      this.getOrganizationRelationList()
      this.isAdd = true
      const obj = {}
      obj.label = item.name
      obj.value = item.id
      this.selectParentList.push(obj)
      this.organizationManagementForm.parentId = item.id
      this.dialogVisible = true
    },
    // 获取组织类型以及处理下拉列表   add by qiaokun 2020-12-29
    getOrganizationTypeList() {
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(this.searchOrganizationTypeForm).then(res => {
        this.organizationTypeList = res.data
        this.organizationTypeList.map((item, index) => {
          this.selectOrganizationTypeList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 从后端获取数据
    getOrganizationManagementList() {
      this.$api.getOrganizationManagementApi.getOrganizationManagementsList(this.searchOrganizationManegementForm).then(res => {
        // console.log(res)
        this.organizationManagementList = res
        if (this.organizationManagementList.length !== 0) {
          this.isTop = true
        }
      })
    },
    // 重置条件
    resetSearchOrganizationManagement() {
      this.searchOrganizationManegementForm = {
        pageIndex: 1,
        pageSize: 20,
        code: '',
        organizationTypeId: '',
        formats: '',
        parent: '',
        excludeUser: false,
        userCode: '',
        publish: ''
      }
      this.getOrganizationManagementList()
    },
    // 编辑按钮
    showEditOrganizationManagementDialog(res) {
      console.log(res)
      this.parentOrganizationObj.value = res.parentId
      this.parentOrganizationObj.label = res.parentName
      console.log(this.parentOrganizationObj)
      // 用来进行获取地址
      if (res.city !== '') {
        this.organizationManagementForm.city = res.city
        this.getStateInfo()
        this.cityId = res.state
        this.getCityInfo()
        this.areaId = res.city
        this.propCityChanges()
      } else {
        this.adressId = 0
        this.getStateInfo()
      }
      this.isAdd = false
      this.organizationTypeList = []
      this.selectOrganizationTypeList = []
      this.selectParentList = []
      this.selectOrganizationTypeList = []
      const obj = {}
      obj.label = res.organizationTypeName
      obj.value = res.organizationTypeId
      this.selectOrganizationTypeRelationList.push(obj)
      this.getOrganizationManagementById(res.id)
    },
    // 根据 id 显示数据
    getOrganizationManagementById(id) {
      this.currentOrganizationManagementId = id
      this.$api.getOrganizationManagementApi.getOrganizationManagementById(id).then(res => {
        console.log(res)
        this.organizationManagementForm = res
        const obj = {}
        // obj.label = res.parentName
        obj.value = res.parentId
        // this.parentOrganizationObj.parentName
        // this.selectParentList.push(obj)
        this.organizationManagementForm.parentId = this.parentOrganizationObj.label
        this.dialogVisible = true
        if (obj.value === '0') {
          this.organizationManagementForm.parentId = ''
        }
      })
    },
    // 新增组织管理最顶级
    showAddOrganizationManagementDialog() {
      this.getStateInfo()
      this.selectOrganizationTypeList = []
      this.currentOrganizationManagementId = ''
      this.isAdd = true
      this.getOrganizationTypeTop()
      const obj = {
        label: '平台顶级组织',
        value: '0'
      }
      this.selectParentList.push(obj)
      this.organizationManagementForm.parentId = '0'
      this.dialogVisible = true
    },
    getOrganizationTypeTop() {
      this.organizationTypeRelationList = []
      this.selectOrganizationTypeRelationList = []
      this.$api.getOrganizationTypeApi.getOrganizationTypeList(this.searchOrganizationTypeForm).then(res => {
        // console.log(res)
        const obj = res.data.find(item => {
          return item.top === true
        })
        this.organizationTypeRelationList.push(obj)
        this.organizationTypeRelationList.map(item => {
          this.selectOrganizationTypeRelationList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 确定新增
    confirm() {
      this.$refs.ypForm.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postOrganizationManagementApi.postOrganizationManagement(this.organizationManagementForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationManagementList()
              this.dialogVisible = false
            }
          })
        } else {
          if (this.organizationManagementForm.parentId === '') {
            this.organizationManagementForm.parentId = '0'
          }
          this.organizationManagementForm.parentId = this.parentOrganizationObj.value
          this.$api.putOrganizationManagementApi.putOrganizationManagement(this.organizationManagementForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getOrganizationManagementList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // 删除
    async deleteOrganizationManagement(item) {
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
        this.$api.deleteOrganizationManagementApi.deleteOrganizationManagementsListById(item.id).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            // console.log(res)
            this.getOrganizationManagementList()
          }
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/scroll.scss';
</style>

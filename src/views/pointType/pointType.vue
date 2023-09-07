<!--
 * @Author: liupenghui
 * @Date: 2021-01-11 19:10:32
 * @LastEditTime: 2021-01-29 09:11:14
 * @LastEditors: Please set LastEditors
 * @Description: 积分类型
 * @FilePath: \celesta-web-project\src\views\pointType\pointType.vue
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showPointTypeDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="serachPointTypeFormLabel" :formData="serachPointTypeForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchPointForm"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchPointType" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 积分类型表格 begin -->
    <yp-table :propArr="pointTypeListLabel" :listInfo="pointTypeList" @updateStatus="updateStatus" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditPointTypeDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 积分类型表格 end -->

    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="40%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- 对话框里面的表单 begin -->
      <yp-form :formLabel="pointTypeFormLabel" :formData="pointTypeForm" ref="ypForm" :formRule="pointTypeFormRule"></yp-form>
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
import YpForm from '@/components/form/YpForm.vue'
export default {
  components: {
    YpSearchForm,
    YpTable,
    YpForm
  },
  computed: {
    // 积分类型搜索表单内容
    serachPointTypeFormLabel() {
      return [
        {
          label: this.$t('lang.type') + '：',
          type: 'input',
          prop: 'info',
          placeholder: this.$t('lang.codeorname')
        },
        {
          label: this.$t('lang.integraltypes') + '：',
          type: 'select',
          prop: 'species',
          options: this.getPointTypesList
        },
        {
          label: this.$t('lang.status'),
          type: 'select',
          prop: 'status',
          options: [
            { label: this.$t('lang.enable'), value: true },
            { label: this.$t('lang.notenabled'), value: false }
          ]
        }
      ]
    },
    // 积分类型列表标题
    pointTypeListLabel() {
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
          label: this.$t('lang.typecode'),
          props: 'code'
        },
        {
          label: this.$t('lang.typename'),
          props: 'name'
        },
        {
          label: this.$t('lang.integraltypes'),
          props: 'species',
          type: 'codeName',
          render: row => {
            if (row.species === '01') {
              return '01-正常积分'
            } else if (row.species === '02') {
              return '02-赠送积分'
            } else if (row.species === '03') {
              return '03-不区分'
            }
          }
        },
        // {
        //   label: '加减标记',
        //   props: 'addFlag',
        //   type: 'codeName',
        //   render: row => {
        //     if (row.addFlag) {
        //       return '增加'
        //     } else {
        //       return '减少'
        //     }
        //   }
        // },
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
    // 对话框里面的表单数据
    pointTypeFormLabel() {
      return [
        {
          label: this.$t('lang.typename') + '：',
          type: 'input',
          prop: 'name'
        },
        {
          label: this.$t('lang.integraltypes') + '：',
          type: 'select',
          prop: 'species',
          options: this.getPointTypesList
        },
        // {
        //   label: '加减标记',
        //   type: 'select',
        //   prop: 'addFlag',
        //   options: [
        //     { label: '增加', value: true },
        //     { label: '减少', value: false }
        //   ]
        // },
        {
          label: this.$t('lang.status') + ':',
          type: 'switch',
          prop: 'status'
        }
      ]
    }
  },
  data() {
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getPointTypeApi.getCheckName(`${value}`, this.checkNameId).then(res => {
          console.log(res)
          if (!res) {
            return cb()
          } else {
            cb(new Error(this.$t('lang.pointtypenames')))
          }
        })
      }
    }
    return {
      // 校验规则
      pointTypeFormRule: {
        name: [
          { required: true, message: this.$t('lang.pointtypenamenull'), trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        species: [{ required: true, message: this.$t('lang.pointtypechoice'), trigger: 'blur' }],
        addFlag: [{ required: true, message: '请选择加减标记', trigger: 'blur' }],
        status: [{ required: true, message: this.$t('lang.pointtypechoicestatus'), trigger: 'blur' }]
      },

      pointTypeList: [], // 接受后端数据

      isAdd: true, // 判断对话框显示的标题是什么

      dialogVisible: false, // 判断对话框的显示条件是什么

      getPointTypesList: [], // 积分种类

      checkNameId: '', // 用来进行编辑时传的 Id

      // 积分类型搜索表单数据内容
      serachPointTypeForm: {
        pageIndex: 1,
        pageSize: 999,
        info: '',
        species: '',
        status: ''
      },
      // 对话框里面的表单数据
      pointTypeForm: {
        name: '',
        species: '03',
        addFlag: true,
        status: true
      }
    }
  },
  created() {
    this.getPointTypeList() // 从后端获取表格数据
    this.pointTypesList() // 获取积分种类下拉框数据
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 表格样式
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    // 从后端获取数据
    getPointTypeList() {
      this.$api.getPointTypeApi.getPointTypeList(this.serachPointTypeForm).then(res => {
        console.log(res)
        this.pointTypeList = res.data
      })
    },
    // 新增积分类型
    showPointTypeDialog() {
      console.log('showPointTypeDialog')
      this.checkNameId = ''
      this.isAdd = true
      // this.pointTypeForm.addFlag = ''
      this.dialogVisible = true
    },
    // 编辑积分类型
    showEditPointTypeDialog(item) {
      console.log('showEditPointTypeDialog')
      console.log(item)
      this.checkNameId = item.id
      this.isAdd = false
      this.getPointTypeById(item.id)
      this.dialogVisible = true
    },
    // 根据 Id 获取某一条数据
    getPointTypeById(id) {
      this.$api.getPointTypeApi.getPointTypeListById(id).then(res => {
        console.log(res)
        this.pointTypeForm = res
      })
    },
    // 从数据字典获取积分种类
    pointTypesList() {
      this.getPointTypesList = []
      const obj = {}
      obj.ddCode = '10019'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.getPointTypesList.push({ value: item.code, label: item.name })
        })
      })
      console.log(this.getPointTypesList)
    },
    // 重置积分类型搜索条件
    resetSearchPointForm() {
      console.log('resetSearchPointForm')
      this.serachPointTypeForm = {
        pageIndex: 1,
        pageSize: 999,
        info: '',
        species: '',
        status: ''
      }
      this.getPointTypeList()
    },
    // 搜索积分类型数据
    searchPointType() {
      console.log('searchPointType')
      this.getPointTypeList()
    },
    // 侦听表格状态的数据
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getPointTypeList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putPointTypeApi.putPointTypeStatus(val.id, val).then(res => {
          if (res.code === '200000') this.getPointTypeList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 当对话框关闭之后所触发的条件
    closeDialog() {
      this.$refs.ypForm.resetForm()
      this.pointTypeForm = {
        name: '',
        species: '03',
        addFlag: true,
        status: true
      }
    },
    // 对话框的最后确定按钮
    confirm() {
      console.log('confirm')
      this.$refs.ypForm.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postPointTypeApi.postPointTypeList(this.pointTypeForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointTypeList()
            }
          })
        } else {
          this.$api.putPointTypeApi.putPointTypeList(this.pointTypeForm).then(res => {
            console.log(res)
            console.log('edit')
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getPointTypeList()
            }
          })
        }
      })
    }
  }
}
</script>
<style scoped></style>

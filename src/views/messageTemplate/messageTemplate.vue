<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="addTemplate">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchMessageTemplateFormLabel" :formData="searchMessageTemplateForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchMessageTemplateForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchMessageTemplateFormBtn" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 表格方法 -->
    <el-table :data="messageTemplateList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column type="index" width="50" label="序号" align="center"></el-table-column>
      <el-table-column prop="templateApplicationName" label="模板用途"></el-table-column>
      <el-table-column prop="templateId" label="公众号模板ID"></el-table-column>
      <el-table-column prop="first" label="提示语"></el-table-column>
      <el-table-column prop="status" label="有效" align="center">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="putMessageTemplateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column prop="status" label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="handleViewDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格方法 -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchMessageTemplateForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchMessageTemplateForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <el-dialog
      :lock-scroll="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="isAdd ? '新增' : '查看详情'"
      :visible.sync="dialogVisible"
      width="60%"
      v-dialogDrag
      @close="closeDialog"
      top="50px"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>
      <el-form :model="templateForm" :rules="templateFormRule" ref="templateFormRef" label-width="115px" label-position="right">
        <!-- <div class="temp-wrap"> -->
        <div class="left-form">
          <div class="dialog-title-head">
            模板配置
          </div>
          <el-form-item label="模板用途:" prop="templateApplicationId">
            <el-select class="width240" v-model="templateForm.templateApplicationId" @change="handleChangeTemplateUse">
              <el-option v-for="(item, index) in templateUseList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="公众号模板ID:" prop="templateId">
            <el-input class="width240" v-model="templateForm.templateId" @blur="handleChangeWxchatTemplate" clearable></el-input>
          </el-form-item>
          <el-form-item label="有效状态:" prop="status">
            <el-switch v-model="templateForm.status"></el-switch>
          </el-form-item>
        </div>
        <div>
          <!-- <div class="dialog-title-head">
          </div> -->
          <el-form-item label="对应参数:">
            <span v-show="chooseList.length <= 0">请先选择模板用途</span>
            <el-tag v-for="(item, index) in chooseList" @click="sendData(item.parameter)" :key="index" class="tag">{{ item.name }}</el-tag>
          </el-form-item>
        </div>
        <!-- </div> -->
        <el-divider></el-divider>
        <div class="temp-wrap">
          <div class="left-form">
            <div class="dialog-title-head">模板内容区域</div>
            <el-form-item label="提示语:" prop="first">
              <el-input class="width240" id="first" placeholder="请手工输入提示内容或选择对应参数" @focus="handChangeInput('first')" @blur="handleInputBlur" v-model="templateForm.first"></el-input>
            </el-form-item>
            <el-form-item label="模板主体:">
              <div class="main-body-wrap" v-for="(item, index) in templateForm.data" :key="index">
                <!-- {{ item.name + ':' }} -->
                <el-form-item :label="item.name + ':'" lable-width="60px" :rules="dataRules" :prop="'data.' + index + '.value'">
                  <el-input class="width240" :rows="2" v-model="item.value" @focus="handChangeInput(index)" placeholder="请手工输入提示内容或选择对应参数" @blur="handleInputBlur"></el-input>
                </el-form-item>
              </div>
            </el-form-item>
            <el-form-item label="备注信息:">
              <el-input type="textarea" placeholder="请手工输入提示内容或选择对应参数" @focus="handChangeInput('note')" @blur="handleInputBlur" v-model="templateForm.note"></el-input>
            </el-form-item>
          </div>
          <div class="preview-wrap">
            <div class="dialog-title-head">模板效果预览</div>
            <div class="wxChat-wrap">
              <div>{{ formatData(templateForm.first) }}</div>
              <br />
              <!-- <div v-for="(item, index) in templateForm.data" :key="index">{{ item.name + '：' }}{{ formatData(item.value) }}</div> -->
              <div v-for="(item, index) in templateForm.data" :key="index">{{ item.name + '：' }}{{ formatData(item.value) }}</div>
              <div>{{ formatData(templateForm.note) }}</div>
              <div class="wxchat-detail">
                <span>详情</span>
                <i class="el-icon-arrow-right"></i>
              </div>
            </div>
          </div>
        </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpSearchForm
  },
  computed: {
    // 查询数据字典标题
    searchMessageTemplateFormLabel() {
      return [
        {
          label: '模板用途:',
          type: 'select',
          prop: 'templateApplicationId',
          options: this.templateUseList
        },
        {
          label: '公众号模板ID:',
          type: 'input',
          prop: 'templateId'
        }
      ]
    },
    // 预览样式过滤器
    formatData() {
      return function(val) {
        val = this.filter(val)
        for (let i = 0; i < val.length; i++) {
          this.chooseList.forEach(item => {
            if (val.includes(item.parameter)) {
              var a = item.parameter
              val = val.replace(a, item.example)
              if (val.includes(item.parameter)) {
                this.filter(val)
              }
            }
          })
        }
        return val
      }
    }
  },
  data() {
    // 检测等级名称是否通过
    const checkTemplateUse = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getMessageTemplateApi.getMessageTemplateUseExist(`${value}`, this.currentMessageTemplateId).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('模板用途已经存在'))
          }
        })
      }
    }
    return {
      currentMessageTemplateId: '', // 当前消息模板id
      dataRules: [
        // {
        //   required: true,
        //   message: '必选',
        //   trigger: 'blur'
        // }
      ],
      templateFormRule: {
        templateApplicationId: [
          {
            required: true,
            message: '必选',
            trigger: 'change'
          },
          {
            validator: checkTemplateUse,
            trigger: 'change'
          }
        ],
        templateId: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        first: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        status: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ]
      },
      messageTemplateList: [], // 消息模板数据
      templateUseList: [],
      // 查询数据字典表单
      searchMessageTemplateForm: {
        pageIndex: 1, // 当前页码
        pageSize: 20, // 当前页码数据条数
        templateApplicationId: '', // 模板用途id
        templateId: '' // 公众号模板ID
      },
      total: 0,
      list: [],
      focusType: '',
      blurIndex: '',
      isAdd: true,
      id: 'first', // 动态id
      dialogVisible: false,
      chooseList: [],
      templateForm: {
        templateApplicationId: '', // 模板用途id
        templateId: '', // 公众号模板ID
        first: '', // 提示语
        data: [],
        note: '',
        status: true
      }
    }
  },
  created() {
    // 计算当前屏幕的高度
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 调用后端接口，查询消息模板数据
    this.getMessageTemplateList()
    // 调用后端接口获取模板用途列表数据
    this.getTemplateApplicationsList()
  },
  methods: {
    /**
     * 描述：输入微信模板id查询微信模板内容
     */
    handleChangeWxchatTemplate() {
      console.log('微信模板id', this.templateForm.templateId)
      if (this.templateForm.templateId) {
        this.getWxchatTemplate(this.templateForm.templateId)
      } else {
        this.templateForm.data = []
      }
    },
    /**
     * 描述：根据微信模板id查询微信模板
     */
    async getWxchatTemplate(id) {
      const res = await this.$api.getMessageTemplateApi.getWxchatMessageTemplate(id)
      console.log('微信模板数据', res)
      var str = res.content
      if (res.content) {
        console.log(str)
        // var firstIndex = str.indexOf('\n\n') + 2
        var firstIndex = str.indexOf('\n') + 1
        var lastIndex = str.lastIndexOf('\n')
        var newStr = str.slice(firstIndex, lastIndex)
        console.log(newStr)
        console.log(firstIndex, lastIndex)
        var arr = newStr.split('\n')
        console.log('...........', arr)
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
          var t1 = arr[i].match(/(\S*)：/)[1]
          console.log(t1)
          var t2 = arr[i].match(/{{(\S*).DATA/)[1]
          console.log(t2)
          var obj = {}
          obj.name = t1
          obj.key = t2
          obj.value = ''
          newArr.push(obj)
        }
        console.log('=====================>', newArr)
        this.templateForm.data = newArr
      } else {
        this.templateForm.data = []
      }
    },
    /**
     * 描述：下拉切换选择模板用途
     */
    handleChangeTemplateUse(e) {
      console.log(e)
      console.log('模板用途id的值', this.templateForm.templateApplicationId)
      this.getChooseListByTemplateApplicationId(this.templateForm.templateApplicationId)
    },
    /**
     * 描述：根据模板用途id查询按钮列表
     */
    async getChooseListByTemplateApplicationId(id) {
      const res = await this.$api.getMessageTemplateApi.getTemplateApplicationItems(id)
      console.log('模板用途详情数据', res)
      this.chooseList = res
    },
    /**
     * 描述：修改消息模板状态
     */
    async putMessageTemplateStatus(val) {
      console.log(val)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getMessageTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const params = {
          status: val.status
        }
        this.$api.putMessageTemplateApi.putMessageTemplatesStatus(val.id, params).then(res => {
          if (res.code === '200000') this.getMessageTemplateList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    /**
     * 描述：计算中间表格的高度
     */
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    /**
     * 描述：查询消息模板设置列表数据
     */
    async getMessageTemplateList() {
      // 调用后端接口获取模板消息方法
      const res = await this.$api.getMessageTemplateApi.getMessageTemplates(this.searchMessageTemplateForm)
      console.log('消息模板数据列表数据=============>', res)
      this.messageTemplateList = res.data
      this.total = res.total
    },
    /**
     * 描述：编辑弹出框处理
     */
    handleViewDetail(item) {
      this.isAdd = false
      console.log(item)
      this.currentMessageTemplateId = item.id
      // const data = JSON.stringify(item)
      this.getMessageTemplateById(item)
    },
    /**
     * 描述：根据模板id查询消息模板
     */
    async getMessageTemplateById(item) {
      const res = await this.$api.getMessageTemplateApi.getMessageTemplateById(item.id)
      console.log('编辑详情接口', res)
      this.templateForm = res
      // 临时变量转表单的data
      let temTemplateData = JSON.stringify(res)
      temTemplateData = JSON.parse(temTemplateData)
      // this.templateForm = JSON.parse(item)
      this.getChooseListByTemplateApplicationId(item.templateApplicationId)
      // this.getWxchatTemplate(item.templateId)
      console.log('编辑时候的表单data数据', this.templateForm.data)
      const resData = await this.$api.getMessageTemplateApi.getWxchatMessageTemplate(item.templateId)
      console.log('微信模板数据', resData)
      var str = resData.content
      if (resData.content) {
        console.log(str)
        // var firstIndex = str.indexOf('\n\n') + 2
        var firstIndex = str.indexOf('\n') + 1
        var lastIndex = str.lastIndexOf('\n')
        var newStr = str.slice(firstIndex, lastIndex)
        console.log(newStr)
        console.log(firstIndex, lastIndex)
        var arr = newStr.split('\n')
        console.log('...........', arr)
        var newArr = []
        for (var i = 0; i < arr.length; i++) {
          var t1 = arr[i].match(/(\S*)：/)[1]
          console.log(t1)
          var t2 = arr[i].match(/{{(\S*).DATA/)[1]
          console.log(t2)
          var obj = {}
          obj.name = t1
          obj.key = t2
          obj.value = ''
          newArr.push(obj)
        }
        console.log('=====================>', newArr)
        this.templateForm.data = newArr
        if (this.templateForm.data.length > 0) {
          for (let i = 0; i < this.templateForm.data.length; i++) {
            this.templateForm.data[i].value = temTemplateData.data[i].value
          }
        }
        console.log('=========================================', this.templateForm.data)
        console.log(temTemplateData)
        console.log(this.templateForm)
        this.dialogVisible = true
      }
    },
    /**
     * 描述：查询分页切换条数
     */
    handleSizeChange(newPageSize) {
      this.searchMessageTemplateForm.pageSize = newPageSize
      this.getMessageTemplateList()
    },
    /**
     * 描述：查询分页切换页数
     */
    handleCurrentChange(newPage) {
      this.searchMessageTemplateForm.pageIndex = newPage
      this.getMessageTemplateList()
    },
    /**
     * 描述：获取模板用途数据列表
     */
    async getTemplateApplicationsList() {
      const res = await this.$api.getMessageTemplateApi.getTemplateApplications()
      console.log('模板用途列表数据', res)
      if (res.length > 0) {
        res.map(item => {
          this.templateUseList.push({ value: item.id, label: item.name })
        })
      }
      console.log('下拉选择模板用途列表', this.templateUseList)
    },
    // 查询消息模板数据
    searchMessageTemplateFormBtn() {
      this.getMessageTemplateList()
    },
    // 重置查询消息模板数据
    resetSearchMessageTemplateForm() {
      this.searchMessageTemplateForm = {
        pageIndex: 1, // 当前页码
        pageSize: 20, // 当前页码数据条数
        templateApplicationId: '', // 模板用途id
        templateId: '' // 公众号模板ID
      }
      this.getMessageTemplateList()
    },
    filter(val) {
      this.chooseList.forEach(item => {
        if (val.includes(item.parameter)) {
          var a = item.parameter
          val = val.replace(a, item.example)
          if (val.includes(item.parameter)) {
            this.filter(val)
          }
        }
      })
      return val
    },
    /**
     * 描述：新增或者编辑
     */
    confirm() {
      console.log(this.templateForm)
      /**
       * 描述：判断校验是否通过
       */
      this.$refs.templateFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 添加逻辑
        if (this.isAdd) {
          if (this.templateForm.data.length > 0) {
            for (let i = 0; i < this.templateForm.data.length; i++) {
              delete this.templateForm.data[i].name
            }
          }
          const res = await this.$api.postMessageTemplateApi.postMessageTemplates(this.templateForm)
          if (res.code === '200000') {
            this.getMessageTemplateList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
          }
        }
        if (!this.isAdd) {
          console.log('我是编辑逻辑')
          // 处理删除表单中data 多余name 字段
          if (this.templateForm.data.length > 0) {
            for (let i = 0; i < this.templateForm.data.length; i++) {
              delete this.templateForm.data[i].name
            }
          }
          const res = await this.$api.putMessageTemplateApi.putMessageTemplates(this.currentMessageTemplateId, this.templateForm)
          if (res.code === '200000') {
            this.getMessageTemplateList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
          }
        }
      })
    },
    handChangeInput(value) {
      console.log(value)
      this.focusType = value
    },
    addTemplate() {
      this.isAdd = true
      this.currentMessageTemplateId = ''
      this.templateForm = {
        templateApplicationId: '', // 模板用途id
        templateId: '', // 公众号模板ID
        first: '', // 提示语
        data: [],
        note: '',
        status: true
      }
      this.dialogVisible = true
    },
    sendData(value) {
      // this.$refs.templateFormRef.resetFields()
      // console.log(value)
      // this.insertInputTxt(this.id, value)
      this.insertInputTxt(value)
    },
    handleInputBlur(e) {
      console.log(e)
      console.log(this.templateForm)
      this.blurIndex = e.srcElement.selectionStart
      console.log(this.blurIndex)
    },
    /**
     * 描述：关闭弹窗触发方法
     */
    closeDialog() {
      this.chooseList = []
      this.$refs.templateFormRef.resetFields()
    },
    insertInputTxt(flg) {
      console.log('执行')
      if (this.focusType === 'first') {
        const index = this.blurIndex
        const str = this.templateForm.first
        console.log(flg)
        this.templateForm.first = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 'note') {
        const index = this.blurIndex
        const str = this.templateForm.note
        console.log(flg)
        this.templateForm.note = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 0) {
        const index = this.blurIndex
        const str = this.templateForm.data[0].value
        console.log(flg)
        this.templateForm.data[0].value = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 1) {
        const index = this.blurIndex
        const str = this.templateForm.data[1].value
        console.log(flg)
        this.templateForm.data[1].value = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 2) {
        const index = this.blurIndex
        const str = this.templateForm.data[2].value
        console.log(flg)
        this.templateForm.data[2].value = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 3) {
        const index = this.blurIndex
        const str = this.templateForm.data[3].value
        console.log(flg)
        this.templateForm.data[3].value = str.slice(0, index) + flg + str.slice(index)
      }
      if (this.focusType === 4) {
        const index = this.blurIndex
        const str = this.templateForm.data[4].value
        console.log(flg)
        this.templateForm.data[4].value = str.slice(0, index) + flg + str.slice(index)
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.width240 {
  width: 300px;
}
.tag {
  margin-right: 20px;
  cursor: pointer;
}
.tag:hover {
  // background: #6699ff;
  transform: scale(1.2);
}
.temp-wrap {
  display: flex;
  width: 100%;
}
.left-form {
  flex: 1;
}
.main-body-wrap {
  margin-bottom: 20px;
}
.preview-wrap {
  flex: 1;
  margin-left: 20px;
}
.wxChat-wrap {
  width: 355px;
  padding: 10px 10px 0px 10px;
  border: 1px solid #ccc;
}
.wxchat-detail {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 20px;
  height: 40px;
  font-size: 16px;
  line-height: 40px;
  color: #666;
  border-top: 1px solid #ccc;
}
.dialog-title-head {
  height: 28px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  margin-bottom: 20px;
}
</style>

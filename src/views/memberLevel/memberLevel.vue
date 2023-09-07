<!--
 * @Author: 谯坤
 * @Date: 2021-06-17 09:43:32
 * @LastEditTime: 2021-06-21 11:33:00
 * @LastEditors: 谯坤
 * @Description: 会员等级
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showMemmberLevelDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="serachMemberLevelFormLabel" :formData="serachMemberLevelForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchMemberLevel"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchMemberLevel" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 会员等级表格 begin -->
    <el-table :data="memberLevelList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="等级名称" align="center" prop="name"></el-table-column>
      <el-table-column label="级别" align="center" prop="level"></el-table-column>
      <el-table-column label="状态" align="center" prop="status">
        <template slot-scope="scope">
          <el-switch v-model="scope.row.status" @change="updateStatus(scope.row)"></el-switch>
        </template>
      </el-table-column>
      <el-table-column label="升降级规则" align="center">
        <el-table-column label="对应成长值" align="center" prop="growth"></el-table-column>
        <el-table-column label="等级有效期" align="center" prop="validPeriod">
          <template slot-scope="scope">
            {{ scope.row.validPeriod | validPeriodFormat }}
          </template>
        </el-table-column>
        <el-table-column label="过期扣减成长值" align="center" prop="growthDeduct"></el-table-column>
        <el-table-column label="计算周期" align="center" prop="machineCycle">
          <template slot-scope="scope">
            {{ scope.row.machineCycle | machineCycleFormat }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="规则权益" align="center">
        <el-table-column label="规则标记" align="center" prop="ruleFlag">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.ruleFlag" @change="updateRule(scope.row)"></el-switch>
          </template>
        </el-table-column>
        <el-table-column label="固定折扣" align="center" prop="discount"></el-table-column>
        <el-table-column label="N倍积分" align="center" prop="pointMultiples"></el-table-column>
        <el-table-column label="权益标记" align="center" prop="equitiesFlag">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.equitiesFlag" @change="updateEquities(scope.row)"></el-switch>
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showEditMemberLevelDialog(scope.row)">{{ $t('lang.viewDetails') }}</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="serachMemberLevelForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="serachMemberLevelForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 会员等级表格 end -->
    <!-- 对话框里面的表单 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="40%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-main class="form-content scoll">
        <el-form label-position="right" label-width="140px" :model="memberLevelForm" ref="memberLevelFormRef" :rules="memberLevelFormRule">
          <el-form-item label="等级名称：" prop="name">
            <el-input style="width:auto;" v-model.trim="memberLevelForm.name" placeholder="请输入等级名称"></el-input>
          </el-form-item>
          <el-form-item label="级别：" prop="level">
            <el-input style="width:auto;" v-model="memberLevelForm.level" placeholder="请输入级别"></el-input>
          </el-form-item>
          <el-form-item label="状态：" prop="status">
            <el-switch v-model="memberLevelForm.status"></el-switch>
          </el-form-item>
          <el-form-item label="封面颜色：" prop="coverColor">
            <el-color-picker v-model="memberLevelForm.coverColor"></el-color-picker>
          </el-form-item>
          <div style="margin-bottom:30px;">
            <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }"> | 升降级规则</span>
          </div>
          <el-form-item label="规则标记：" prop="ruleFlag">
            <el-switch v-model="memberLevelForm.ruleFlag"></el-switch>
          </el-form-item>
          <el-form-item label="对应成长值：" v-show="memberLevelForm.ruleFlag" prop="growth">
            <el-input style="width:auto;" maxlength="6" v-model="memberLevelForm.growth"></el-input>
          </el-form-item>
          <el-form-item label="等级有效期：" v-show="memberLevelForm.ruleFlag" prop="validPeriod">
            <el-select placeholder="请选择" v-model="memberLevelForm.validPeriod">
              <el-option v-for="(item, index) in validPeriodList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="过期扣减成长值：" v-show="memberLevelForm.ruleFlag" prop="growthDeduct">
            <el-input style="width:auto;" maxlength="6" v-model="memberLevelForm.growthDeduct"></el-input>
          </el-form-item>
          <el-form-item label="计算周期：" v-show="memberLevelForm.ruleFlag" prop="machineCycle">
            <el-select placeholder="请选择" v-model="memberLevelForm.machineCycle">
              <el-option v-for="(item, index) in machineCycleList" :key="index" :label="item.label" :value="item.value"></el-option>
            </el-select>
          </el-form-item>
          <div style="margin-bottom:30px;">
            <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px', marginLeft: '10px' }"> | 权益规则</span>
          </div>
          <el-form-item label="权益标记：" prop="equitiesFlag">
            <el-switch v-model="memberLevelForm.equitiesFlag"></el-switch>
          </el-form-item>
          <el-form-item label="固定折扣：" v-show="memberLevelForm.equitiesFlag" prop="discount">
            <el-input-number controls-position="right" :precision="2" :step="0.1" style="width:auto;" :min="0" :max="1" v-model="memberLevelForm.discount"></el-input-number>
          </el-form-item>
          <el-form-item label="N倍积分：" v-show="memberLevelForm.equitiesFlag" prop="pointMultiples">
            <el-input-number controls-position="right" :step="1" step-strictly style="width:auto;" :min="1" :max="100" v-model="memberLevelForm.pointMultiples"></el-input-number>
          </el-form-item>
        </el-form>
      </el-main>
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
export default {
  filters: {
    validPeriodFormat: function(val) {
      if (val === '01') {
        return '不限制'
      } else if (val === '02') {
        return '一年'
      } else if (val === '03') {
        return '半年'
      } else if (val === '04') {
        return '三个月'
      } else if (val === '05') {
        return '一个月'
      } else {
        return '未知'
      }
    },
    getFloor: function(val) {
      return Math.floor(val)
    },
    /**
     * 描述：计算周期过滤器
     */
    machineCycleFormat: function(val) {
      if (val === '01') {
        return '每月1日'
      } else if (val === '02') {
        return '实时'
      } else {
        return '未知'
      }
    }
  },
  components: {
    YpSearchForm
  },
  data() {
    // 检测等级名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getMemberLevelApi.getCheckName(`${value}`, this.currentMemberLevelId).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    const checkLevel = (rule, value, cb) => {
      var reg = /^\+?[1-9]\d*$/
      if (!reg.test(value)) {
        cb(new Error('请输入大于0的整数'))
      } else {
        this.$api.getMemberLevelApi.getCheckLevel(`${value}`, this.currentMemberLevelId).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('输入的等级已存在'))
          }
        })
      }
      // cb()
    }
    // const checkLevel = (rule, value, cb) => {
    //   var reg = /^\+?[1-9]\d*$/
    //   if (!reg.test(value)) {
    //     cb(new Error('请输入大于0的整数'))
    //   }
    //   return cb()
    // }
    const checkGrowth = (rule, value, cb) => {
      var reg = /^\+?[0-9]\d*$/
      if (!reg.test(value)) {
        cb(new Error('请输入大于等于0的整数'))
      }
      cb()
    }
    return {
      currentMemberLevelId: '',
      isAdd: true,
      dialogVisible: false,
      total: 0,
      serachMemberLevelForm: {
        name: '', // 等级名称
        level: '',
        pageIndex: 1, // 当前页
        pageSize: 20 // 当前页条数
      },
      validPeriodList: [
        { label: '不限制', value: '01' },
        { label: '一年', value: '02' },
        { label: '半年', value: '03' },
        { label: '三个月', value: '04' },
        { label: '一个月', value: '05' }
      ],
      machineCycleList: [
        { label: '每月1日', value: '01' },
        { label: '实时', value: '02' }
      ],
      memberLevelList: [],
      memberLevelForm: {
        name: '',
        level: '',
        status: true,
        coverColor: '',
        ruleFlag: true,
        growth: 0,
        validPeriod: '01',
        growthDeduct: 0,
        machineCycle: '01',
        equitiesFlag: true,
        discount: 1,
        pointMultiples: 1
      },
      memberLevelFormRule: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        level: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkLevel,
            trigger: 'blur'
          }
        ],
        coverColor: [{ required: true, message: '背景色为必选', trigger: 'change' }],
        ruleFlag: [{ required: true, message: '', trigger: 'change' }],
        growth: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkGrowth,
            trigger: 'blur'
          }
        ],
        validPeriod: [{ required: true, message: '请选择', trigger: 'change' }],
        growthDeduct: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkGrowth,
            trigger: 'blur'
          }
        ],
        equitiesFlag: [{ required: true, message: '', trigger: 'change' }],
        discount: [{ required: true, message: '请输入', trigger: 'blur' }],
        pointMultiples: [{ required: true, message: '请输入', trigger: 'blur' }]
      }
    }
  },
  computed: {
    serachMemberLevelFormLabel() {
      return [
        {
          label: '等级名称：',
          type: 'input',
          prop: 'name'
        }
      ]
    }
  },
  created() {
    // 计算当前屏幕的高度
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取会员等级列表数据
    this.getMemberLevelList()
  },
  // mounted() {
  //   this.memberLevelList.push({
  //     id: '1',
  //     code: '01',
  //     name: '普通会员',
  //     level: 1,
  //     coverColor: '#6699ff',
  //     ruleFlag: true,
  //     growth: 300,
  //     validPeriod: '01',
  //     growthDeduct: 100,
  //     machineCycle: '01',
  //     equitiesFlag: true,
  //     discount: 1,
  //     pointMultiples: 1
  //   })
  // },
  methods: {
    /* 更新状态 */
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getMemberLevelList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.putMemberLevelApi.putMemberLevel(val.id, val).then(res => {
          if (res.code === '200000') this.getMemberLevelList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    /**
     * 描述：更新规则标记开关
     */
    async updateRule(val) {
      console.log(val)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getMemberLevelList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const params = {
          ruleFlag: val.ruleFlag
        }
        this.$api.putMemberLevelApi.putRuleFlag(val.id, params).then(res => {
          if (res.code === '200000') this.getMemberLevelList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    /**
     * 描述：更新权益标记开关
     */
    async updateEquities(val) {
      console.log(val)
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getMemberLevelList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const params = {
          equitiesFlag: val.equitiesFlag
        }
        this.$api.putMemberLevelApi.putEquitiesFlag(val.id, params).then(res => {
          if (res.code === '200000') this.getMemberLevelList()
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
     * 描述：查询分页切换条数
     */
    handleSizeChange(newPageSize) {
      this.serachMemberLevelForm.pageSize = newPageSize
      this.getMemberLevelList()
    },
    /**
     * 描述：查询分页切换页数
     */
    handleCurrentChange(newPage) {
      this.serachMemberLevelForm.pageIndex = newPage
      this.getMemberLevelList()
    },
    /**
     * 描述：从后端后去会员等级列表数据
     */
    async getMemberLevelList() {
      const res = await this.$api.getMemberLevelApi.getMemberLevelList(this.serachMemberLevelForm)
      this.total = res.total
      this.memberLevelList = res.data
    },
    /**
     * 描述：控制会员等级新增弹框弹出方法
     */
    showMemmberLevelDialog() {
      this.isAdd = true
      this.dialogVisible = true
      this.currentMemberLevelId = ''
    },
    /**
     * 描述：控制会员等级编辑弹框弹出方法
     */
    showEditMemberLevelDialog(item) {
      console.log(item)
      this.isAdd = false
      this.dialogVisible = true
      this.currentMemberLevelId = item.id
      // 获取具体某一条会员等级数据
      this.getMemberLevelById()
    },
    /**
     * 描述：根据 id 查询会员等级数据
     */
    getMemberLevelById() {
      this.$api.getMemberLevelApi.getMemberLevelById(this.currentMemberLevelId).then(res => {
        this.memberLevelForm = res
      })
    },
    /**
     * 描述：关闭弹窗的方法，并且重置表单
     */
    closeDialog() {
      this.currentMemberLevelId = ''
      this.$refs.memberLevelFormRef.resetFields()
    },
    /**
     * 描述：会员等级查询方法
     */
    searchMemberLevel() {
      this.serachMemberLevelForm.pageIndex = 1
      this.getMemberLevelList()
    },
    /**
     * 描述：会员等级重置查询方法
     */
    resetSearchMemberLevel() {
      this.serachMemberLevelForm.name = ''
      this.serachMemberLevelForm.level = ''
      this.pageIndex = 1
      this.getMemberLevelList()
    },
    /**
     * 描述：用于添加、编辑、会员等级数据接口
     */
    confirm() {
      console.log(this.memberLevelForm)
      this.$refs.memberLevelFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求填写',
            type: 'info'
          })
        }
        if (this.isAdd) {
          // 处理新增
          console.log('新增')
          this.$api.postMemberLevelApi.postMemberLevel(this.memberLevelForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getMemberLevelList()
            }
          })
        }
        if (!this.isAdd) {
          // 处理编辑
          console.log('编辑')
          this.$api.putMemberLevelApi.putMemberLevel(this.currentMemberLevelId, this.memberLevelForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
              this.getMemberLevelList()
            }
          })
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-content {
  width: 100%;
  height: 500px;
}
</style>

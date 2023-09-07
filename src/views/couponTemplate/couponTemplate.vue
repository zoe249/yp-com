<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="addCouponTemplate">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchCouponTemplateFormLabel" :formData="searchCouponTemplateForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchsearchCouponTemplateForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchsearchCouponTemplateForm" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 表格内容 start -->
    <el-table :data="couponTemplateList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="券模板编号" prop="code"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="类型" prop="type" align="center">
        <template slot-scope="scope">
          <div>{{ scope.row.type }}-{{ scope.row.typeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="面值" prop="denomination" align="right">
        <template slot-scope="scope">
          <div v-if="scope.row.type === '04'">{{ scope.row.denomination / 10 }}{{ scope.row.uom }}</div>
          <div v-else>{{ scope.row.denomination }}{{ scope.row.uom }}</div>
        </template>
      </el-table-column>
      <el-table-column label="有效期" prop="denomination" width="350">
        <template slot-scope="scope">
          <div v-show="scope.row.timeRule === '1'">
            {{ scope.row.beginTime }} -
            {{ scope.row.endTime }}
          </div>
          <div v-show="scope.row.timeRule === '2'">领券后{{ scope.row.days }}天生效, 生效后{{ scope.row.validDays }}天内有效</div>
          <!-- {{ scope.row.time }} -->
        </template>
      </el-table-column>
      <el-table-column label="状态" prop="status" align="center">
        <template slot-scope="scope">
          <div>
            <span v-show="scope.row.status === '1'">1-有效</span>
            <span v-show="scope.row.status === '2'">2-过期</span>
            <span v-show="scope.row.status === '3'">3-作废</span>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="每笔限使用数" prop="limitedNumber" align="right"></el-table-column>
      <el-table-column label="操作" align="center" width="300">
        <template slot-scope="scope">
          <div>
            <el-button type="text" icon="el-icon-search" @click="viewCouponTemplateDetail(scope.row)">查看详情</el-button>
            <el-button type="text" @click="copyCouponTemplate(scope.row)">复制</el-button>
            <el-button type="text" @click="delayCouponTemplate(scope.row)" v-show="scope.row.status === '1'">券延期</el-button>
            <el-button type="text" @click="cancelCouponTemplate(scope.row)" v-show="scope.row.status === '1'">作废</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格内容 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchCouponTemplateForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchCouponTemplateForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 弹出框 start -->
    <!-- 表格方法 -->
    <el-dialog
      :lock-scroll="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="isAdd ? '新增' : '查看详情'"
      :visible.sync="dialogVisible"
      width="60%"
      top="50px"
      v-dialogDrag
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>
      <el-form :model="couponTemplateForm" :rules="couponTemplateFormRules" ref="couponTemplateFormRef" label-width="100px" label-position="right">
        <div class="dialog-title-head">
          模板信息
        </div>
        <el-form-item label="券类型:" prop="type">
          <el-select v-model="couponTemplateForm.type" :disabled="!isAdd" @change="handlerChangeType" class="width240">
            <el-option v-for="(item, index) in couponTypeList" :key="index" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="券名称:" prop="name">
          <el-input type="text" v-model="couponTemplateForm.name" :maxlength="15" show-word-limit :disabled="!isAdd" class="width240"></el-input>
          <!-- <span class="text-tip">{{ '券名称不能重复' }}</span> -->
        </el-form-item>
        <div class="coupon-money-wrap">
          <el-form-item label="券面值:" prop="denomination">
            <el-input @blur="denominationBlur" :disabled="isCount || !isAdd" v-model="couponTemplateForm.denomination" class="width120"></el-input> <span>{{ uom }}</span
            ><span class="text-tip">{{ couponTemplateForm.type === '02' ? '计次券面值只能为1' : couponTemplateForm.type === '04' ? '输入65，表示打6.5折' : '' }}</span>
          </el-form-item>
          <el-form-item label="每满:" v-show="isFullreduce" prop="fullAmount">
            <el-input :disabled="!isAdd" v-model="couponTemplateForm.fullAmount" class="width120"></el-input>{{ ' 元，可用1张' }}
          </el-form-item>
          <el-form-item label="单笔限使用:" prop="limitedNumber"> <el-input v-model="couponTemplateForm.limitedNumber" :disabled="!isAdd" class="width120"></el-input>{{ ' 张' }} </el-form-item>
        </div>
        <el-form-item label="可否转赠:">
          <el-select v-model="couponTemplateForm.forward" disabled>
            <el-option label="否" value="01"></el-option>
            <el-option label="是" value="02"></el-option> </el-select
          ><span class="text-tip">{{ '可转赠：可以将券转赠给他人使用' }}</span>
        </el-form-item>
        <div class="dialog-title-head">有效期设置</div>
        <el-form-item label="有效期:" prop="timeRule">
          <div>
            <div class="valid-time">
              <el-radio @change="handlerChangeTimeRule" :disabled="!isAdd" v-model="couponTemplateForm.timeRule" :label="'1'">{{ '' }}</el-radio>
              <el-date-picker
                :disabled="istimeRuleTime || !isAdd"
                v-model="couponTemplateForm.beginTime"
                :picker-options="startTime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="handleChangeTimeRuleBeginTime"
                type="datetime"
                placeholder="选择开始日期时间"
              >
              </el-date-picker>
              至
              <el-date-picker
                :disabled="istimeRuleTime || !isAdd"
                :picker-options="endTime"
                v-model="couponTemplateForm.endTime"
                type="datetime"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="handleChangeTimeRuleEndTime"
                placeholder="选择结束日期时间"
              >
              </el-date-picker>
            </div>
            <div>
              <el-radio @change="handlerChangeTimeRule" :disabled="!isAdd" v-model="couponTemplateForm.timeRule" :label="'2'">{{ '' }}</el-radio>
              领券后 <el-input v-model.number="couponTemplateForm.days" :disabled="!istimeRuleTime || !isAdd" class="width120"></el-input> 天生效，生效后
              <el-input :disabled="!istimeRuleTime || !isAdd" v-model.number="couponTemplateForm.validDays" class="width120"></el-input> 天内有效
            </div>
          </div>
        </el-form-item>
        <el-form-item label="可用日期:" prop="availableDayType">
          <el-radio @change="handleChangeDayType" :disabled="!isAdd" v-model="couponTemplateForm.availableDayType" :label="'1'">{{ '全部日期' }}</el-radio>
          <el-radio @change="handleChangeDayType" :disabled="!isAdd" v-model="couponTemplateForm.availableDayType" :label="'2'">{{ '指定日期' }}</el-radio>
          <div v-show="couponTemplateForm.availableDayType === '2'">
            <div>
              日期日：
            </div>
            <div class="month-wrap">
              <el-checkbox-group v-model="couponTemplateForm.availableDays">
                <el-checkbox :disabled="!isAdd" v-for="(item, index) in 31" :key="index" :label="item"></el-checkbox>
              </el-checkbox-group>
            </div>

            <div>
              日期周：
            </div>
            <el-checkbox-group v-model="couponTemplateForm.availableWeeks">
              <el-checkbox :disabled="!isAdd" v-for="(item, index) in 7" :key="index" :label="item">{{ item | weekformat }}</el-checkbox>
            </el-checkbox-group>
          </div>
        </el-form-item>
        <el-form-item label="可用时段:" prop="availablePeriodType">
          <el-radio @change="handleChangePeriodType" :disabled="!isAdd" v-model="couponTemplateForm.availablePeriodType" label="1">{{ '全部时段' }}</el-radio>
          <el-radio @change="handleChangePeriodType" :disabled="!isAdd" v-model="couponTemplateForm.availablePeriodType" label="2">{{ '指定时段' }}</el-radio>
          <div v-show="timeList.length > 0">
            <div class="time-list-wrap" v-for="(item, index) in timeList" :key="index">
              <el-form-item prop="beginTime">
                <el-time-picker
                  placeholder="开始时间"
                  v-model="item.beginTime"
                  :picker-options="{
                    selectableRange: index === 0 ? item.maxTime : timeValue(timeList[index - 1].endTime)
                  }"
                  format="HH:mm"
                  value-format="HH:mm"
                  :disabled="item.disable || index + 1 < timeList.length || !isAdd"
                  @change="handleIsEndTime(item, index)"
                ></el-time-picker>
              </el-form-item>
              <span class="timeBtn">至</span>
              <el-form-item prop="endTime">
                <el-time-picker
                  placeholder="结束时间"
                  v-model="item.endTime"
                  :picker-options="{
                    selectableRange: timeValue(item.beginTime)
                  }"
                  value-format="HH:mm"
                  format="HH:mm"
                  :disabled="item.disable || index + 1 < timeList.length || !isAdd"
                  @change="handleIsBenginTime(item, index)"
                ></el-time-picker>
              </el-form-item>
              <div class="icon-wrap">
                <i class="el-icon-circle-plus-outline" @click="addTimeList"></i
                ><i class="el-icon-circle-close" @click="deleteTimeList(index)" v-show="index + 1 === timeList.length && index !== 0 && isAdd"></i>
              </div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="使用规则:" prop="ruleExplain">
          <el-input type="textarea" v-model="couponTemplateForm.ruleExplain" maxlength="150" show-word-limit></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirm">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 弹出框 end -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="'设置延期天数'" :visible.sync="dialogDelayVisible" width="30%" v-dialogDrag @close="closeDelayDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '设置延期天数' }}
        </div>
      </template>
      <el-form :model="delayForm" :rules="delayFormRule" ref="delayFormRef" label-width="140px" label-position="right">
        <el-form-item label="输入延期天数：" prop="deferdays">
          <el-input v-model.number="delayForm.deferdays" class="width240" clearable></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogDelayVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmDelay">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  filters: {
    weekformat: function(val) {
      if (val === 1) {
        return '周一'
      } else if (val === 2) {
        return '周二'
      } else if (val === 3) {
        return '周三'
      } else if (val === 4) {
        return '周四'
      } else if (val === 5) {
        return '周五'
      } else if (val === 6) {
        return '周六'
      } else if (val === 7) {
        return '周日'
      } else {
        return '未知'
      }
    }
  },
  components: {
    YpSearchForm
  },
  data() {
    const checkSalePrice = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        if (this.isAdd) {
          this.currentCouponTemplateId = ''
        }
        this.$api.getCouponTemplateApi.getCheckName(`${value}`, this.currentCouponTemplateId).then(res => {
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    const checkMoneyRgtOne = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('请输入正整数'))
        } else {
          return cb()
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    // const checkMoney = (rule, value, cb) => {
    //   if (value !== '') {
    //     const reg = /^\+?[0-9]\d*$/
    //     if (!reg.test(value)) {
    //       cb(new Error('请输入大于等于0的整数'))
    //     } else {
    //       return cb()
    //     }
    //   } else {
    //     // 此项为非必填字段，当值为空时，校验通过
    //     return cb()
    //   }
    // }
    const checkDiscount = (rule, value, cb) => {
      if (value !== '') {
        if (this.couponTemplateForm.type === '04') {
          if (value > 100) {
            cb(new Error('折扣输入不能超过100'))
          } else {
            return cb()
          }
        } else {
          return cb()
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    const checkTimeRule = (rule, value, cb) => {
      if (value !== '') {
        if (this.couponTemplateForm.timeRule === '1') {
          if (!this.couponTemplateForm.beginTime || !this.couponTemplateForm.endTime) {
            return cb(new Error('开始或结束时间不能为空'))
          } else {
            if (this.isAdd && (new Date(this.couponTemplateForm.beginTime).getTime() < new Date().getTime() || new Date(this.couponTemplateForm.endTime).getTime() < new Date().getTime())) {
              cb(new Error('开始或结束时间不能小于当前时间'))
            } else {
              return cb()
            }
          }
        }
        if (this.couponTemplateForm.timeRule === '2') {
          if (!(this.couponTemplateForm.days + '') || !(this.couponTemplateForm.validDays + '')) {
            return cb(new Error('天数不能为空'))
          } else {
            const reg = /^\+?[0-9]\d*$/
            if (!reg.test(this.couponTemplateForm.days) || !reg.test(this.couponTemplateForm.validDays)) {
              cb(new Error('请输入大于等于0的整数'))
            } else {
              return cb()
            }
          }
        }
      }
    }
    const checkavAilableDayType = (rule, value, cb) => {
      if (value !== '') {
        if (this.couponTemplateForm.availableDayType === '2') {
          if (this.couponTemplateForm.availableDays.length === 0 && this.couponTemplateForm.availableWeeks.length === 0) {
            cb(new Error('指定日期不能为空'))
          } else {
            return cb()
          }
        } else {
          return cb()
        }
      }
    }
    const checkAvailablePeriodType = (rule, value, cb) => {
      if (value !== '') {
        if (this.couponTemplateForm.availablePeriodType === '2') {
          if (this.timeList.length > 0) {
            const i = this.timeList.findIndex(item => item.beginTime === '' || item.endTime === '')
            if (i !== -1) {
              return cb(new Error('指定时段不能为空'))
            } else {
              return cb()
            }
          } else {
            return cb
          }
        } else {
          return cb()
        }
      }
    }
    return {
      delayForm: {
        deferdays: 1
      }, // 券延期表单
      delayFormRule: {
        deferdays: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          }
        ]
      },
      dialogDelayVisible: false,
      currentCouponTemplateId: '',
      endTime: {
        disabledDate: time => {
          const beginDateVal = this.couponTemplateForm.beginTime
          if (beginDateVal) {
            return time.getTime() < new Date(beginDateVal).getTime() - 86399999
          }
        }
      },
      startTime: {
        disabledDate: time => {
          if (this.couponTemplateForm.beginTime) {
            return time.getTime() < new Date().getTime() - 86399999
          } else {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      istimeRuleTime: false,
      uom: '',
      isCount: false,
      isFullreduce: false,
      value1: '',
      radio: '',
      checkList: [1, 2, 3],
      isAdd: true,
      couponTemplateList: [],
      couponTypeSearchList: [], // 优惠券类型查询下拉列表,
      couponStatusSearchList: [], // 优惠券状态查询下拉列表
      couponTypeList: [], // 优惠券类型下拉列表查询
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '',
        pageIndex: 1,
        pageSize: 20
      },
      total: 0,
      dialogVisible: false,
      couponTemplateFormRules: {
        type: [
          {
            required: true,
            message: '必填',
            trigger: 'change'
          }
        ],
        name: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        denomination: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkSalePrice,
            trigger: 'blur'
          },
          {
            validator: checkDiscount,
            trigger: 'blur'
          }
        ],
        fullAmount: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkSalePrice,
            trigger: 'blur'
          }
        ],
        limitedNumber: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          }
        ],
        timeRule: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkTimeRule,
            trigger: 'change'
          }
        ],
        availableDayType: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkavAilableDayType,
            trigger: 'change'
          }
        ],
        availablePeriodType: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkAvailablePeriodType,
            trigger: 'change'
          }
        ],
        ruleExplain: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ]
      },
      timeList: [],
      couponTemplateForm: {
        type: '', // 券类型
        name: '', // 券名称
        denomination: 1, // 券面值。计次券面值只能为1
        limitedNumber: 1, // 单笔限使用数
        fullAmount: 0, // 每满金额
        forward: '01',
        timeRule: '1',
        beginTime: '',
        endTime: '',
        days: 0,
        validDays: 1,
        availableDayType: '1',
        availableDays: [],
        availableWeeks: [],
        availablePeriodType: '1',
        availablePeriod: '',
        ruleExplain: ''
      }
    }
  },
  computed: {
    searchCouponTemplateFormLabel() {
      return [
        {
          label: '券模板编号:',
          type: 'input',
          prop: 'code'
        },
        {
          label: '名称:',
          type: 'input',
          prop: 'name'
        },
        {
          label: '类型:',
          type: 'select',
          prop: 'type',
          options: this.couponTypeSearchList
        },
        {
          label: '状态:',
          type: 'select',
          prop: 'status',
          options: this.couponStatusSearchList
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取优惠券类型查询下拉列表数据
    this.getCouponTypeSearchList()
    // 获取优惠券状态查询下拉列表数据
    this.getCouponStatusSearchList()
    // 获取优惠券模板列表数据
    this.getCouponTemplateList()
    this.getCouponTypeList()
  },
  methods: {
    /**
     * 描述：有效期类型开始时间选择判断
     */
    handleChangeTimeRuleBeginTime(e) {
      if (this.couponTemplateForm.endTime) {
        this.couponTemplateForm.endTime = ''
        return this.$message.info('重新选择开始时间，结束时间自动清除，请重新选择结束时间')
      }
    },
    /**
     * 描述：有效期结束时间选择判断
     */
    handleChangeTimeRuleEndTime(e) {
      if (!this.couponTemplateForm.beginTime) {
        this.couponTemplateForm.endTime = ''
        return this.$message.info('请先选择开始日期时间')
      }
      var beginDateVal = this.couponTemplateForm.beginTime
      var endDateVal = this.couponTemplateForm.endTime
      beginDateVal = new Date(beginDateVal).getTime()
      endDateVal = new Date(endDateVal).getTime()
      if (beginDateVal && endDateVal) {
        if (endDateVal <= beginDateVal) {
          this.couponTemplateForm.endTime = ''
          return this.$message.info('结束时间必须大于等于开始时间')
        }
      }
      if (new Date(this.couponTemplateForm.endTime).getTime() < new Date().getTime()) {
        this.couponTemplateForm.endTime = ''
        return this.$message.info('结束时间不能小于当前时间')
      }
    },
    /**
     * 描述：可用时段结束时间清除
     */
    handleIsEndTime(item, index) {
      if (item.endTime) {
        this.timeList[index].endTime = ''
        return this.$message.info('您重新选择了开始时间，结束时间自动清除')
      }
    },
    /**
     * 描述：判断选择可用时间段的开始时间是否选择
     */
    handleIsBenginTime(item, index) {
      if (!item.beginTime) {
        this.timeList[index].endTime = ''
        return this.$message.info('请先选择开始时间')
      }
    },
    /**
     * 描述：向表单时间列表中添加时间
     */
    addTimeList() {
      if (!this.isAdd) {
        return
      }
      if (this.timeList.length >= 3) {
        return this.$message.info('指定时间段不能超过3条')
      }
      for (let i = 0; i < this.timeList.length; i++) {
        if (!this.timeList[i].beginTime || !this.timeList[i].endTime) {
          return this.$message.info('开始时间或结束时间不能为空')
        }
      }
      if (this.timeList.length > 0) {
        this.timeList[0].disable = true
      }
      if (this.timeList.length > 1) {
        this.timeList[1].disable = true
      }
      const obj = { endTime: '', beginTime: '', maxTime: '00:00:00 - 23:59:00', disable: false }
      this.timeList.push(obj)
    },
    /**
     * 描述：从表单的时间列表中删除时间
     */
    deleteTimeList(index) {
      console.log(index)
      this.timeList.splice(index, 1)
      console.log(this.timeList)
      if (this.timeList.length <= 1) {
        this.timeList[0].disable = false
      }
      if (this.timeList.length > 1 && this.timeList.length <= 2) {
        this.timeList[1].disable = false
      }
    },
    // 结束时间要大于开始时间
    timeValue(data) {
      console.log(data)
      if (data !== '') {
        data = data + ':00' + '- 23:59:00'
        return data
      }
    },
    /**
     * 描述：选择可用时段类型
     */
    handleChangePeriodType(e) {
      console.log(e)
      console.log(this.couponTemplateForm.availablePeriodType)
      if (this.couponTemplateForm.availablePeriodType === '1') {
        this.timeList = []
      }
      if (this.couponTemplateForm.availablePeriodType === '2') {
        this.timeList = [
          {
            endTime: '',
            beginTime: '',
            maxTime: '00:00:00 - 23:59:00',
            disable: false
          }
        ]
      }
    },
    /**
     * 描述：选择可用日期类型
     */
    handleChangeDayType(e) {
      console.log(e)
      console.log(this.couponTemplateForm.availableDayType)
      if (this.couponTemplateForm.availableDayType === '1') {
        this.couponTemplateForm.availableDays = []
        this.couponTemplateForm.availableWeeks = []
      }
    },
    /**
     * 描述：控制有效期单选按钮方法
     */
    handlerChangeTimeRule(e) {
      console.log(e)
      console.log(this.couponTemplateForm.timeRule)
      if (this.couponTemplateForm.timeRule === '1') {
        this.istimeRuleTime = false
        this.couponTemplateForm.days = 0
        this.couponTemplateForm.validDays = 1
      }
      if (this.couponTemplateForm.timeRule === '2') {
        this.istimeRuleTime = true
        this.couponTemplateForm.beginTime = ''
        this.couponTemplateForm.endTime = ''
      }
    },
    /**
     * 描述：选择优惠券类型
     */
    handlerChangeType(e) {
      console.log(e)
      console.log(this.couponTemplateForm.type)
      if (this.couponTemplateForm.type === '03') {
        this.isFullreduce = true
      } else {
        this.isFullreduce = false
      }
      if (this.couponTemplateForm.type === '02') {
        this.isCount = true
        this.couponTemplateForm.denomination = 1
      } else {
        this.isCount = false
      }
      if (this.couponTemplateForm.type === '01') {
        this.uom = '元'
      } else if (this.couponTemplateForm.type === '02') {
        this.uom = '次'
      } else if (this.couponTemplateForm.type === '03') {
        this.uom = '元'
      } else if (this.couponTemplateForm.type === '04') {
        this.uom = '折'
      }
      if (e !== '03') {
        this.couponTemplateForm.fullAmount = 0
      }
    },
    /**
     * 描述：计算中间表格的高度
     */
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    /**
     * 描述：获取优惠券列表数据
     */
    async getCouponTemplateList() {
      // 后端调取优惠券模板列表数据
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      this.couponTemplateList = res.data
      this.total = res.total
      // this.couponTemplateList = couponList // 假数据，到时手删除掉
    },
    /**
     * 描述：查询分页切换条数
     */
    handleSizeChange(newPageSize) {
      this.searchCouponTemplateForm.pageSize = newPageSize
      this.getCouponTemplateList()
    },
    /**
     * 描述：查询分页切换页数
     */
    handleCurrentChange(newPage) {
      this.searchCouponTemplateForm.pageIndex = newPage
      this.getCouponTemplateList()
    },
    /**
     * 优惠券类型下来列表
     */
    getCouponTypeList() {
      this.couponTypeList = []
      const obj = {}
      obj.ddCode = '10026'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.couponTypeList.push({ value: item.code, label: item.name })
        })
      })
      if (this.couponTemplateForm.type === '03') {
        this.isFullreduce = true
      } else {
        this.isFullreduce = false
      }
    },
    /**
     * 描述：获取优惠券类型查询下拉列表数据
     */
    getCouponTypeSearchList() {
      this.couponTypeSearchList = []
      const obj = {}
      obj.ddCode = '10026'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.couponTypeSearchList.push({ value: item.code, label: item.name })
        })
        const obj = {
          label: '不限',
          value: ''
        }
        this.couponTypeSearchList.unshift(obj)
      })
    },
    /**
     * 描述：获取优惠券状态查询下拉列表数据
     */
    getCouponStatusSearchList() {
      this.couponStatusSearchList = []
      const obj = {}
      obj.ddCode = '10027'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.couponStatusSearchList.push({ value: item.code, label: item.name })
        })
        const obj = {
          label: '不限',
          value: ''
        }
        this.couponStatusSearchList.unshift(obj)
      })
    },
    /**
     * 描述：添加券模板
     */
    addCouponTemplate() {
      this.istimeRuleTime = false
      this.isAdd = true
      this.couponTemplateForm = {
        type: '', // 券类型
        name: '', // 券名称
        denomination: 1, // 券面值。计次券面值只能为1
        limitedNumber: 1, // 单笔限使用数
        fullAmount: 0, // 每满金额
        forward: '01',
        timeRule: '1',
        beginTime: '',
        endTime: '',
        days: 0,
        validDays: 1,
        availableDayType: '1',
        availableDays: [],
        availableWeeks: [],
        availablePeriodType: '1',
        availablePeriod: '',
        ruleExplain: ''
      }
      this.timeList = []
      this.dialogVisible = true
      this.$refs.couponTemplateFormRef.resetFields()
      this.currentCouponTemplateId = ''
      // 获取优惠券类型下拉列表
      this.getCouponTypeList()
    },
    delayCouponTemplate(item) {
      this.currentCouponTemplateId = item.id
      this.dialogDelayVisible = true
    },
    /**
     * 描述：查看券模板详情
     */
    viewCouponTemplateDetail(item) {
      console.log('查看详情数据', item)
      this.isAdd = false
      this.currentCouponTemplateId = item.id
      this.getCouponTemplateById(item)
    },
    /**
     * 描述：复制优惠券模板
     */
    async copyCouponTemplate(item) {
      const confirmResult = await this.$confirm('您确定要按照该券模板的配置生成一个新的券模板吗？', '复制', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.isAdd = true
        this.currentCouponTemplateId = item.id
        this.getCouponTemplateById(item)
      }
    },
    /**
     * 描述：作废券
     */
    async cancelCouponTemplate(item) {
      const confirmResult = await this.$confirm('确定要将该券模板作废吗？', '作废', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const res = await this.$api.putCouponTemplateApi.putCouponTemplateCancel(item.id)
        if (res.code === '200000') {
          this.getCouponTemplateList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        }
      }
    },
    /**
     * 描述：编辑或者复制模板根据id查询处理数据
     */
    async getCouponTemplateById(item) {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateById(item.id)
      // this.couponTemplateForm = res.data
      console.log('根据id查询数据', res)
      // 假数据，到时候删除掉
      console.log('打印输出', res)
      res.availableDays.toString()
      res.availableWeeks.toString()
      // item.timeList = []
      let availableDays = ''
      let availableWeeks = ''
      if (res.availableDayType === '2') {
        if (res.availableDays) {
          availableDays = res.availableDays
          availableDays = availableDays.split(',')
          res.availableDays = availableDays
          res.availableDays = res.availableDays.map(Number)
        } else {
          res.availableDays = []
        }
        if (res.availableWeeks) {
          availableWeeks = res.availableWeeks
          availableWeeks = availableWeeks.split(',')
          res.availableWeeks = availableWeeks
          res.availableWeeks = res.availableWeeks.map(Number)
        } else {
          res.availableWeeks = []
        }
      } else {
        res.availableDays = []
        res.availableWeeks = []
      }
      if (!res.fullAmount) {
        res.fullAmount = 0
      }
      if (res.timeRule === '1') {
        this.istimeRuleTime = false
      } else {
        this.istimeRuleTime = true
      }
      // if (item.availablePeriodType === 2) {
      //   var availablePeriod = item.availablePeriod
      //   availablePeriod = availablePeriod.split(',')
      //   console.log('转换时间段', availablePeriod)
      //   for (let i = 0; i < availablePeriod.length; i++) {
      //     const obj = {
      //       beginTime: '',
      //       endTime: '',
      //       maxTime: '',
      //       disable: ''
      //     }
      //     obj.beginTime = availablePeriod[i].split('-')[0]
      //     obj.endTime = availablePeriod[i].split('-')[1]
      //     obj.maxTime = '00:00:00 - 23:59:00'
      //     obj.disable = false
      //     item.timeList.push(obj)
      //   }
      // }
      this.couponTemplateForm = res
      this.uom = this.couponTemplateForm.uom
      this.timeList = []
      if (this.couponTemplateForm.availablePeriodType === '2') {
        var availablePeriod = this.couponTemplateForm.availablePeriod
        availablePeriod = availablePeriod.split(',')
        console.log('转换时间段', availablePeriod)
        for (let i = 0; i < availablePeriod.length; i++) {
          // const obj = {
          //   beginTime: '',
          //   endTime: '',
          //   maxTime: '',
          //   disable: ''
          // }
          // obj.beginTime = availablePeriod[i].split('-')[0]
          // obj.endTime = availablePeriod[i].split('-')[1]
          // obj.maxTime = '00:00:00 - 23:59:00'
          // obj.disable = false
          this.$set(this.timeList, i, {
            beginTime: availablePeriod[i].split('-')[0],
            endTime: availablePeriod[i].split('-')[1],
            maxTime: '00:00:00 - 23:59:00',
            disable: false
          })
          // item.timeList.push(obj)
        }
      }
      console.log(this.timeList)
      // this.timeList = this.timeList
      console.log('转换之后的编辑详情的表单', this.couponTemplateForm)
      this.getCouponTypeList()
      this.dialogVisible = true
    },
    /**
     * 描述：重置查询券模板管理
     */
    resetSearchsearchCouponTemplateForm() {
      this.searchCouponTemplateForm = {
        code: '',
        name: '',
        type: '',
        status: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getCouponTemplateList()
    },
    /**
     * 描述：查询券模板管理
     */
    searchsearchCouponTemplateForm() {
      this.searchCouponTemplateForm.pageIndex = 1
      this.getCouponTemplateList()
    },
    /**
     * 描述：关闭弹窗的方法
     */
    closeDialog() {
      this.isCount = false
      this.uom = ''
      this.couponTemplateForm = {
        type: '', // 券类型
        name: '', // 券名称
        denomination: 1, // 券面值。计次券面值只能为1
        limitedNumber: 1, // 单笔限使用数
        fullAmount: 0, // 每满金额
        forward: '01',
        timeRule: '1',
        beginTime: '',
        endTime: '',
        days: 1,
        validDays: 1,
        availableDayType: '1',
        availableDays: [],
        availableWeeks: [],
        availablePeriodType: '1',
        availablePeriod: '',
        timeList: [],
        ruleExplain: ''
      }
      this.$refs.couponTemplateFormRef.resetFields()
    },
    /**
     * 描述：关闭延期天数的弹框
     */
    closeDelayDialog() {
      this.delayForm.deferdays = 1
      this.$refs.delayFormRef.resetFields()
    },
    /**
     * 描述：延期天数
     */
    confirmDelay() {
      this.$refs.delayFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const obj = {}
        obj.deferdays = this.delayForm.deferdays
        const res = await this.$api.putCouponTemplateApi.putCouponTemplateDelay(this.currentCouponTemplateId, obj)
        if (res.code === '200000') this.getCouponTemplateList()
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
        this.dialogDelayVisible = false
      })
    },
    /**
     * 描述：新增或者提交编辑 确认复制
     */
    confirm() {
      console.log(this.couponTemplateForm)
      let params = ''
      this.$refs.couponTemplateFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        params = JSON.stringify(this.couponTemplateForm)
        params = JSON.parse(params)
        if (params.availableDayType === '2') {
          if (params.availableDays.length > 0) {
            params.availableDays = params.availableDays.toString()
          } else {
            params.availableDays = ''
          }
          if (params.availableWeeks.length > 0) {
            params.availableWeeks = params.availableWeeks.toString()
          } else {
            params.availableWeeks = ''
          }
        }
        console.log(params)
        if (params.availableDayType === '1') {
          params.availableDays = ''
          params.availableWeeks = ''
        }
        if (params.availablePeriodType === '2') {
          var timeList = JSON.stringify(this.timeList)
          timeList = JSON.parse(timeList)
          console.log('存储的时间段列表', timeList)
          if (timeList.length > 0) {
            const newArr = []
            for (let i = 0; i < timeList.length; i++) {
              const obj = timeList[i].beginTime + '-' + timeList[i].endTime
              newArr.push(obj)
            }
            params.availablePeriod = newArr.toString()
          }
        }

        console.log('转换需要提交的数据', params)
        if (this.isAdd) {
          const res = await this.$api.postCouponTemplateApi.postCouponTemplate(params)
          if (res.code === '200000') this.getCouponTemplateList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.dialogVisible = false
        }
        if (!this.isAdd) {
          console.log('编辑逻辑')
          const obj = {
            ruleExplain: this.couponTemplateForm.ruleExplain
          }
          const res = await this.$api.putCouponTemplateApi.putCouponTemplate(this.currentCouponTemplateId, obj)
          if (res.code === '200000') this.getCouponTemplateList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.dialogVisible = false
        }
      })
      console.log(this.couponTemplateForm)
    },
    /**
     *  修改人：wangdandi
     * 修改内容：输入大于0
     * 时间：2021-09-29
     *
     */
    denominationBlur() {
      if (this.couponTemplateForm.denomination <= 0) {
        this.couponTemplateForm.denomination = 1
        this.$message.info('券面值不能小于0')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.width120 {
  width: 100px;
}
.coupon-money-wrap {
  width: 100%;
  display: flex;
}
.coupon-money-wrap .el-form-item {
  width: 33%;
}
.valid-time {
  margin-bottom: 20px;
}
.month-wrap {
  width: 650px;
}
.el-checkbox {
  width: 60px;
}

.width240 {
  width: 240px;
}
.text-tip {
  margin-left: 20px;
  color: blue;
}
.time-list-wrap {
  display: flex;
  align-items: center;
}
.icon-wrap {
  display: flex;
  align-items: center;
}
.el-icon-circle-plus-outline,
.el-icon-circle-close {
  color: #6699ff;
  margin-left: 16px;
  font-size: 30px;
  cursor: pointer;
}
.timeBtn {
  margin: 20px;
}
.el-icon-circle-close {
  color: rgb(173, 35, 35);
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

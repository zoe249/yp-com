<!--
 * @FileDescription: 每日签到
 * @Version: 3.0.2
 * @Author: Wangdandi
 * @Date: 2021-08-31
 -->
<template>
  <!-- <div :style="{ height: height }"> -->
  <div>
    <el-card shadow="never">
      <!-- 签到提醒 -->
      <el-form ref="signFormRef" :model="signForm" :rules="signFormRules" label-width="130px">
        <el-form-item label="是否开启：" prop="status">
          <el-switch v-model="signForm.status"></el-switch>
        </el-form-item>
        <el-form-item label="每日签到奖励：" prop="dailyBonus">
          <el-input v-model="signForm.dailyBonus" @change="dailyBonusChange" placeholder="0" clearable style="width:150px" min="0" type="number" class="input-number-no-btn"></el-input>
          <el-radio-group v-model="signForm.dailyBonusType" style="margin-left:20px;">
            <el-radio label="1">积分</el-radio>
            <el-radio label="2">成长值</el-radio>
          </el-radio-group>
          <span class="text-tip">用户每日签到可以获得的奖励</span>
        </el-form-item>
        <el-form-item label="签到周期：" prop="cycle">
          <el-input v-model="signForm.cycle" style="width:150px;" placeholder="0" @change="cycleChange" clearable type="number" min="0" class="input-number-no-btn"></el-input>
          <span style="margin-left:20px">天</span>
          <span class="text-tip">单个周期内，每个连签奖励只可被领取一次</span>
        </el-form-item>
        <el-form-item label="连续签到：">
          <el-button class="el-icon-plus" type="text" @click="continuityBtn">新增连续签到规则</el-button>
          <!-- 新增连续签到明细表 -->
          <!-- 将弹框的数据push进次列表中 -->
          <el-table v-show="continuityData.length !== 0" :data="continuityData" style="width: 70%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" max-height="300px">
            <el-table-column prop="runningDays" label="连签天数" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.scope === '1'">等于</span>
                <span v-if="scope.row.scope === '2'">大于等于</span>
                {{ scope.row.runningDays }}
              </template>
            </el-table-column>
            <el-table-column prop="bonusType" label="连签奖励" align="center">
              <!-- 积分，成长值，优惠券字段拼接 -->
              <template slot-scope="scope">
                <div v-for="(item, index) in scope.row.bonusType" :key="index">
                  <div v-if="item == 1">积分：{{ scope.row.pointPresented }}</div>
                  <div v-if="item == 2">成长值：{{ scope.row.growthPresented }}</div>
                  <div v-if="item == 3">
                    优惠券：
                    <div v-for="(item, index) in scope.row.couponTemplateList" :key="index">{{ item.code }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <!-- 编辑，删除按钮 -->
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit-outline" @click="continuityEditBtn(scope.row, scope.$index)">编辑</el-button>
                <!-- {{scope.row}} -->
                <el-button type="text" @click="continuityDeleteBtn(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="累计签到：" v-model="signForm.type">
          <el-button class="el-icon-plus" type="text" @click="cumulativeBtn">新增累计签到规则</el-button>
          <el-table
            v-if="cumulativeData.length !== 0 && cumulativeDataStatus"
            :data="cumulativeData"
            style="width:70%"
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            max-height="300px"
          >
            <el-table-column prop="sumDays" label="累计天数" align="center">
              <template slot-scope="scope">
                {{ scope.row.sumDays }}
              </template>
            </el-table-column>
            <el-table-column prop="bonusType" label="累计奖励" align="center">
              <template slot-scope="scope">
                <!-- {{ scope.row.bonusType }} -->
                <div v-for="(item, index) in scope.row.bonusType" :key="index">
                  <div v-if="item == 1">积分：{{ scope.row.pointPresented }}</div>
                  <div v-if="item == 2">成长值：{{ scope.row.growthPresented }}</div>
                  <div v-if="item == 3">
                    优惠券：
                    <div v-for="(item, index) in scope.row.couponTemplateList" :key="index">{{ item.code }}</div>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <!-- 编辑，删除按钮 -->
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit-outline" @click="cumulativeEditBtn(scope.row, scope.$index)">编辑</el-button>
                <el-button type="text" @click="cumulativeDeleteBtn(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="规则说明：" prop="ruleDescription">
          <el-input type="textarea" v-model="signForm.ruleDescription" :rows="4" maxlength="150" style="width:500px;" show-word-limit placeholder="150字以内"></el-input>
        </el-form-item>
        <el-form-item label="签到提醒：" v-show="remindShow">
          <el-switch v-model="signForm.remind" @change="remindChanges"></el-switch>
        </el-form-item>
        <el-form-item label="提醒签到：" v-if="signForm.remind" v-show="remindShow">
          <el-time-select
            v-model="signForm.remindTime"
            :picker-options="{
              start: '00:00',
              step: '00:15',
              end: '23:30'
            }"
            placeholder="选择时间"
          ></el-time-select>
          <span class="text-tip">设置定时提醒用户每日签到</span>
        </el-form-item>
        <el-form-item>
          <el-button @click="addBtn" type="primary" class="btn-copy">保存</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 连续签到弹框 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="title" :visible.sync="continuityDialog" width="70%" @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ title }}
        </div>
      </template>
      <el-form :model="continuityForm" label-width="100px" :rules="continuityFormRules" ref="continuityFormRef">
        <!-- 连续签到 -->
        <el-form-item label="连续签到：" v-if="runningDaysShow" prop="runningDays">
          <el-select v-model="continuityForm.scope" placeholder="请选择" style="width:150px;">
            <el-option v-for="item in scopeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-input
            v-if="runningDaysShow"
            v-model.number="continuityForm.runningDays"
            @change="denominationChange"
            type="number"
            clearable
            style="width:150px; margin-left:20px"
            class="input-number-no-btn"
          ></el-input>
          <span style="margin-left:20px">天</span></el-form-item
        >
        <!-- 累计签到 -->
        <el-form-item label="累计签到：" v-if="sumDaysShow" prop="sumDays">
          <!-- {{ typeof continuityForm.sumDays }} -->
          <!-- {{ sumDaysShow ? 1 : 2 }} -->
          <el-input
            v-model.number="continuityForm.sumDays"
            v-if="sumDaysShow"
            @change="sumDaysChange"
            type="number"
            clearable
            style="width:150px; margin-left:20px"
            class="input-number-no-btn"
          ></el-input>
          <span style="margin-left:20px">天</span></el-form-item
        >
        <el-form-item>
          <el-checkbox-group v-model="continuityForm.bonusType" @change="checkout">
            <el-checkbox label="1">积分</el-checkbox>
            <el-input
              v-model="continuityForm.pointPresented"
              @change="remindChange"
              clearable
              style="width:150px"
              min="0"
              type="number"
              class="input-number-no-btn"
              :disabled="remindDisabled()"
              placeholder="1"
            ></el-input>
            <el-checkbox label="2" style="margin-left:20px">成长值</el-checkbox>
            <el-input
              v-model="continuityForm.growthPresented"
              @change="ruleDescriptionChange"
              clearable
              style="width:150px"
              placeholder="0"
              type="number"
              min="0"
              class="input-number-no-btn"
              :disabled="ruleDescriptionDisabled()"
            ></el-input>
            <el-checkbox label="3" style="margin-left:20px">优惠券</el-checkbox>
            <el-button type="text" style="margin-left:20px" @click="addCoupon" :disabled="couponsDisabled()">添加优惠券</el-button>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item>
          <!-- 添加优惠券列表 -->
          <el-table
            :data="continuityForm.couponTemplateList"
            v-show="continuityForm.couponTemplateList.length !== 0"
            border
            style="width: 100%"
            stripe
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            max-height="300px"
          >
            <el-table-column prop="code" label="券模板编号" show-overflow-tooltip> </el-table-column>
            <el-table-column prop="name" label="名称" show-overflow-tooltip align="center"> </el-table-column>
            <el-table-column prop="type" label="类型" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.type }}-{{ scope.row.typeName }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="denomination" label="面值" align="center">
              <template slot-scope="scope">
                <div>{{ scope.row.facevalue ? scope.row.facevalue : scope.row.denomination + scope.row.uom }}</div>
              </template>
            </el-table-column>
            <el-table-column prop="timeRule" label="有效期" align="center" width="320">
              <template slot-scope="scope">
                <div v-show="scope.row.timeRule === '1'">
                  {{ scope.row.beginTime }} -
                  {{ scope.row.endTime }}
                </div>
                <div v-show="scope.row.timeRule === '2'">领券后{{ scope.row.days }}天生效, 生效后{{ scope.row.validDays }}天内有效</div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" @click="couponTemplateListDelete(scope.row, scope.$index)">删除</el-button>
              </template>
            </el-table-column></el-table
          >
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="continuityDialog = false">取 消</el-button>
        <el-button type="primary" @click="continuityShowDialog === 'create' ? continuityTypeDialog() : cumulativeDialog()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 添加优惠券弹框连续签到 -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="选择券" :visible.sync="addCouponDialog" width="70%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          选择券
        </div>
      </template>
      <!-- 头部搜索 -->
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
      <!-- 优惠券列表区域 show-overflow-tooltip -->
      <el-table
        :data="couponTemplateList"
        border
        ref="tableRef"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="selRow"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        max-height="300px"
      >
        <el-table-column type="selection" width="55"> </el-table-column>
        <el-table-column prop="code" label="券模板编号"> </el-table-column>
        <el-table-column prop="name" label="名称" show-overflow-tooltip> </el-table-column>
        <el-table-column prop="type" label="类型">
          <template slot-scope="scope">
            <div>{{ scope.row.type }}-{{ scope.row.typeName }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="denomination" label="面值">
          <template slot-scope="scope">
            <div>{{ scope.row.facevalue ? scope.row.facevalue : scope.row.denomination + scope.row.uom }}</div>
          </template>
        </el-table-column>
        <el-table-column prop="timeRule" label="有效期" width="320" show-overflow-tooltip>
          <template slot-scope="scope">
            <div v-show="scope.row.timeRule === '1'">
              {{ scope.row.beginTime }} -
              {{ scope.row.endTime }}
            </div>
            <div v-show="scope.row.timeRule === '2'">领券后{{ scope.row.days }}天生效, 生效后{{ scope.row.validDays }}天内有效</div>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态">
          <template slot-scope="scope">
            <div>
              <span v-show="scope.row.status === '1'">1-有效</span>
              <span v-show="scope.row.status === '2'">2-过期</span>
              <span v-show="scope.row.status === '3'">3-作废</span>
            </div>
          </template>
        </el-table-column>
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addCouponDialog = false">取 消</el-button>
        <el-button type="primary" @click="addCouponDialogBtn">确 定</el-button>
      </span>
    </el-dialog>
  </div>
  <!-- </div> -->
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import _ from 'lodash'
export default {
  components: {
    YpSearchForm
  },
  data() {
    // 校验是否一样，循环列表数据 查看是否有重复的数据
    // const changerunningDays = (rule, value, cb) => {
    //   let i
    //   for (i = 0; i < this.continuityData.length; i++) {
    //     const map = this.continuityData[i].runningDays
    //     console.log('iiii', i)
    //     console.log('length', this.continuityData.length)
    //     console.log('rrrr', map)
    //     console.log('value', value)
    //     if (map === value) {
    //       cb(new Error('输入的值已存在'))
    //       console.log('map', map)
    //     } else {
    //       return cb()
    //     }
    //   }
    // }
    // const changesumDays = (rule, value, cb) => {
    //   this.cumulativeData.forEach((item, index) => {
    //     const map = this.cumulativeData[index]
    //     // if (this.title !== '设置累计签到奖励编辑') {
    //     if (value !== '') {
    //       if (map.sumDays === value && item.sumDays) {
    //         cb(new Error('输入的值已存在'))
    //       } else {
    //         console.log('999')
    //         return cb()
    //       }
    //     }
    //     // }
    //   })
    // }
    return {
      remindShow: false,
      cumulativeDataStatus: true,
      nowType: '',
      // 保存body参数
      addOne: 1, // 新增连续签到
      nowIndex: 0, // 连续签到index
      nowsIndex: 0, // 累计签到index
      // 连续签到数据表
      continuityData: [],
      // 累计签到数据表
      cumulativeData: [],
      // 表单
      signForm: {
        status: false, // 是否开启
        dailyBonusType: '1', // 每日奖励选项
        dailyBonus: '', // 每日奖励number
        cycle: '', // 签到周期,正整数number
        // 签到规则
        dailyAttendanceRuleList: [{ couponTemplateId: '' }],
        ruleDescription: '', // 规则说明
        remind: false, // 签到提醒
        remindTime: '' // 提醒时间
      },
      couponTemplateListId: [], // 优惠券id
      continuityDataType: '', // 连续签到type值
      cumulativeDataType: '', // 累计签到type值
      runningDaysShow: false, // 连续签到
      sumDaysShow: false, // 累计签到
      continuityShowDialog: 'create',
      // 表单校验
      signFormRules: {
        status: [{ required: true, message: '必填', trigger: 'change' }],
        dailyBonus: [{ required: true, message: '必填', trigger: 'blur' }],
        cycle: [{ required: true, message: '必填', trigger: 'blur' }],
        ruleDescription: [{ required: true, message: '必填', trigger: 'blur' }]
      },
      continuityFormRules: {
        runningDays: [
          { required: true, message: '必填', trigger: 'blur' }
          // {
          //   validator: changerunningDays,
          //   trigger: 'blur'
          // }
        ],
        sumDays: [
          { required: true, message: '必填', trigger: 'blur' }
          // {
          //   validator: changesumDays,
          //   trigger: 'blur'
          // }
        ]
      },
      // 连续签到弹框
      continuityDialog: false,
      title: '',
      continuityForm: {
        runningDays: 1, // 连续签到
        sumDays: 1, // 累计签到
        scope: '1',
        pointPresented: '', // 积分输入框
        growthPresented: '', // 成长值输入框
        bonusType: [],
        type: '', // 类型
        couponTemplateList: [{ couponTemplateId: '' }] // 券模板列表数据
      },
      scopeList: [
        {
          value: '1',
          label: '等于'
        },
        {
          value: '2',
          label: '大于等于'
        }
      ],
      // 添加优惠券
      addCouponDialog: false,
      // 优惠券列表
      couponTemplateList: [],
      selectCouponTemoplateListId: [],
      selectcumulativetId: [],
      selectCouponTemoplateList: [], // 优惠券选中的数据存入数组中
      // 优惠券列表参数
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      }
    }
  },
  computed: {
    // 券模板搜索区域
    searchCouponTemplateFormLabel() {
      return [
        {
          label: '券模板编号:',
          type: 'input',
          prop: 'code',
          placeholder: '券模板编号'
        },
        {
          label: '名称:',
          type: 'input',
          prop: 'name',
          placeholder: '名称'
        },
        {
          label: '类型:',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限' },
            { value: '01', label: '01-金额券' },
            { value: '02', label: '02-计次券' },
            { value: '03', label: '03-满减券' },
            { value: '04', label: '04-折扣券' }
          ]
        }
      ]
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    // this.getHeight()
    this.getDailyAttendanceList()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - -30 + 'px'
      console.log(this.height)
    },
    // 获取页面数据
    getDailyAttendanceList() {
      // 获取页面数据接口 get防范
      // 判断是否为null返回一个空对象
      this.continuityData = []
      this.cumulativeData = []
      this.$api.getCouponInfo.getDailyAttendanceList().then(res => {
        console.log('页面数据', res)
        if (res.data !== null) {
          this.signForm = res.data
          // 将dailyAttendanceRuleList数据拆分成连续和累计两个数据
          res.data.dailyAttendanceRuleList.forEach(item => {
            if (item.type === '1') {
              this.continuityData.push(item)
            } else {
              this.cumulativeData.push(item)
            }
          })
        }
      })
    },
    remindChanges() {
      if (this.signForm.remind === false) {
        this.signForm.remindTime = ''
      }
    },
    closeDialog() {
      this.$refs.continuityFormRef.clearValidate()
    },
    // 积分，成长值，优惠券复选框
    checkout() {
      // console.log('rrrrrrrr', this.continuityForm.bonusType)
    },
    // 成长值
    ruleDescriptionChange() {
      this.continuityForm.growthPresented = this.continuityForm.growthPresented.replace(/[^.\d]/g, '')
      this.continuityForm.growthPresented = this.continuityForm.growthPresented.replace('.', '')
    },
    // 积分
    remindChange() {
      this.continuityForm.pointPresented = this.continuityForm.pointPresented.replace(/[^.\d]/g, '')
      this.continuityForm.pointPresented = this.continuityForm.pointPresented.replace('.', '')
    },
    // 连续签到
    denominationChange() {
      // 判断表中是否存在
      var status = this.continuityData.some(item => item.runningDays === this.continuityForm.runningDays)
      if (status) {
        // 如果存在则清空
        this.$message.error('签到时间重复')
        this.continuityForm.runningDays = ''
      }
    },
    // 累计签到
    sumDaysChange() {
      var status = this.cumulativeData.some(item => item.sumDays === this.continuityForm.sumDays)
      if (status) {
        // 如果存在则清空
        this.$message.error('签到时间重复')
        this.continuityForm.sumDays = ''
      }
    },
    // 每日签到奖励
    dailyBonusChange() {
      this.signForm.dailyBonus = this.signForm.dailyBonus.replace(/[^.\d]/g, '')
      this.signForm.dailyBonus = this.signForm.dailyBonus.replace('.', '')
    },
    // 签到周期
    cycleChange() {
      this.signForm.cycle = this.signForm.cycle.replace(/[^.\d]/g, '')
      this.signForm.cycle = this.signForm.cycle.replace('.', '')
    },
    // 积分禁用
    remindDisabled() {
      if (this.continuityForm.bonusType.includes('1')) {
        return false
      } else {
        this.continuityForm.pointPresented = 1
        return true
      }
    },
    // 成长值禁用
    ruleDescriptionDisabled() {
      if (this.continuityForm.bonusType.includes('2')) {
        return false
      } else {
        this.continuityForm.growthPresented = 1
        return true
      }
    },
    // 优惠券禁用
    couponsDisabled() {
      if (this.continuityForm.bonusType.includes('3')) {
        return false
      } else {
        this.continuityForm.couponTemplateList.length = 0
        return true
      }
    },
    // 添加优惠券
    addCoupon() {
      this.addCouponDialog = true
      this.getCouponTemplateList()
    },
    // 获取券模板列表接口
    async getCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      console.log('获取券列表数据', res.data)
      this.couponTemplateList = res.data
      this.$nextTick(() => {
        this.$refs.tableRef.clearSelection()
        if (this.continuityForm.couponTemplateList.length > 0) {
          this.continuityForm.couponTemplateList.forEach(item => {
            const index = this.getSelectCouponTemplateId(item.id)
            if (index === -1) return
            this.$refs.tableRef.toggleRowSelection(this.couponTemplateList[index], true)
          })
        }
      })
    },
    getSelectCouponTemplateId(selectDataId) {
      let index = -1
      for (let i = 0; i < this.couponTemplateList.length; i++) {
        const item = this.couponTemplateList[i]
        if (item.id === selectDataId) {
          index = i
          continue
        }
      }
      return index
    },
    // 券搜索
    searchsearchCouponTemplateForm() {
      this.getCouponTemplateList()
    },
    // 券重置
    resetSearchsearchCouponTemplateForm() {
      this.searchCouponTemplateForm = {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      }
      this.getCouponTemplateList()
    },
    // 新增连续签到
    continuityBtn() {
      console.log('连续签到弹框111')
      this.addOne = 0
      this.continuityDialog = true
      this.title = '设置连签奖励'
      this.runningDaysShow = true // 显示连续签到
      this.sumDaysShow = false
      this.continuityShowDialog = 'create'
      this.continuityForm.scope = '1'
      this.continuityForm.runningDays = '' // 连续签到天数
      this.continuityForm.pointPresented = '' // 积分输入框
      this.continuityForm.bonusType = [] // 积分选项
      this.continuityForm.growthPresented = '' // 成长值
      this.continuityForm.couponTemplateList = [] // 优惠券列表
      this.nowType = 1
    },
    // 新增累计签到按钮
    cumulativeBtn() {
      this.addOne = 0
      this.continuityDialog = true // 弹框
      this.title = '设置累计签到奖励'
      this.continuityShowDialog = 'but'
      this.sumDaysShow = true // 显示累计签到
      this.runningDaysShow = false
      this.continuityForm.sumDays = ''
      this.continuityForm.pointPresented = '' // 积分输入框
      this.continuityForm.scope = '1'
      this.continuityForm.bonusType = [] // 积分选项
      this.continuityForm.growthPresented = '' // 成长值
      this.continuityForm.couponTemplateList = [] // 优惠券列表
      this.nowType = 2
    },
    // 连续签到表编辑
    continuityEditBtn(row, index) {
      this.title = '设置连签奖励编辑'
      console.log('连续签到编辑', row)
      this.continuityDialog = true
      this.addOne = 1
      this.continuityShowDialog = 'create'
      // 当前的index 取编辑的index
      this.nowIndex = index
      this.sumDaysShow = false // 累计签到不显示
      this.runningDaysShow = true
      var bonusStatus = typeof row.bonusType
      if (bonusStatus === 'string') {
        row.bonusType = row.bonusType.split(',')
      }
      this.continuityForm = _.cloneDeep(row)
      this.nowType = row.type
      console.log('typeof', row.bonusType)
    },
    // 累计签到编辑
    cumulativeEditBtn(row, index) {
      this.title = '设置累计签到奖励编辑'
      this.continuityShowDialog = 'but'
      this.addOne = 1 // 区分是否为编辑弹框
      this.sumDaysShow = true
      this.runningDaysShow = false // 连续签到不显示
      this.nowsIndex = index
      console.log('this.nowsIndex', this.nowsIndex)
      this.continuityDialog = true
      // // 去除逗号
      var bonusStatus = typeof row.bonusType
      if (bonusStatus === 'string') {
        row.bonusType = row.bonusType.split(',')
      }
      this.continuityForm = _.cloneDeep(row)
      this.nowType = _.cloneDeep(row.type)
    },
    // 连续签到删除列表数据
    continuityDeleteBtn(row, index) {
      console.log('连续签到', row)
      this.continuityData.splice(index, 1)
    },
    // 累计签到列表删除
    cumulativeDeleteBtn(row, index) {
      console.log('删除数据0000', row)
      this.cumulativeData.splice(index, 1)
    },
    // 连续签到优惠券表格全选
    selRow(val) {
      console.log('选中的数据valval', val)
      // 将选中的数据给优惠券列表
      this.selectCouponTemoplateList = val
    },
    // 优惠券确定按钮
    addCouponDialogBtn() {
      console.log(' this.continuityForm.couponTemplateList', this.continuityForm.couponTemplateList)
      this.addCouponDialog = false
      this.continuityForm.couponTemplateList = this.selectCouponTemoplateList
      // 将选中的数据点击确定按钮push到列表中
    },
    // 优惠券列表删除
    couponTemplateListDelete(row, index) {
      console.log('优惠券列表删除', row)
      // 删除那条数据选中的数据取消选中状态
      this.continuityForm.couponTemplateList.splice(index, 1)
    },
    // 连续签到规则
    continuityTypeDialog() {
      // this.denominationChange()
      this.$refs.continuityFormRef.validate(val => {
        if (!val) return
        const nowcontinuityForm = this.continuityForm
        // 优惠券模板数据摘取code
        if (this.addOne === 1) {
          // 编辑
          if (nowcontinuityForm.length === 0) {
            return this.$message.warning('至少选一个签到奖励')
          }
          // 判断多选数组和添加优惠券的数据等于0
          if (nowcontinuityForm.bonusType.includes('3') && nowcontinuityForm.couponTemplateList.length === 0) {
            return this.$message.info('请选择并添加优惠券')
          } else {
            this.$set(this.continuityData, this.nowIndex, _.cloneDeep(this.continuityForm))
            this.continuityDialog = false // 关闭弹框
          }
          // 判断没有选时提醒
        } else {
          // 添加时，如果没有选多选框提示一下选 选某个则必填某个
          if (nowcontinuityForm.bonusType.length === 0) {
            return this.$message.warning('至少选一个签到奖励')
          }
          // 判断多选数组和添加优惠券的数据等于0
          if (nowcontinuityForm.bonusType.includes('3') && nowcontinuityForm.couponTemplateList.length === 0) {
            return this.$message.info('请选择并添加优惠券')
          } else {
            this.continuityData.push(_.cloneDeep(this.continuityForm))
            this.continuityDialog = false // 关闭弹框
          }
        }
      })
      // 将连续签到，积分，成长值，优惠券数据添加到连续签到表中
      console.log('连续签到规则', this.continuityForm, this.continuityData)
      // 判断是否为查看详情
    },
    // 累计确定按钮
    cumulativeDialog() {
      console.log('累计确定规则', this.continuityForm)
      this.$refs.continuityFormRef.validate(val => {
        if (!val) return
        const nowcontinuityForm = this.continuityForm
        // 判断新增按钮还是编辑按钮 编辑按钮属性1 将数据index为一样的数据编辑
        if (this.addOne === 1) {
          // 编辑
          if (nowcontinuityForm.length === 0) {
            return this.$message.warning('至少选一个签到奖励')
          }
          console.log('p', nowcontinuityForm)
          if (nowcontinuityForm.bonusType.includes('3') && nowcontinuityForm.couponTemplateList.length === 0) {
            return this.$message.info('请选择并添加优惠券')
          } else {
            console.log(this.nowsIndex)
            this.$set(this.cumulativeData, this.nowsIndex, _.cloneDeep(this.continuityForm))
            this.continuityDialog = false // 关闭弹框
          }
        } else {
          // 未选奖励判断
          if (nowcontinuityForm.bonusType.length === 0) {
            return this.$message.warning('至少选一个签到奖励')
          }
          if (nowcontinuityForm.bonusType.includes('3') && nowcontinuityForm.couponTemplateList.length === 0) {
            // if (this.continuityForm.couponTemplateList.length === 0) {
            return this.$message.info('请选择并添加优惠券')
            // }
          } else {
            this.cumulativeDataStatus = false
            // var i = JSON.stringify(nowcontinuityForm)
            this.cumulativeData.push(_.cloneDeep(this.continuityForm))
            this.cumulativeDataStatus = true
            this.continuityDialog = false // 关闭弹框
          }
          // 选优惠券和其他选项
          // 判断优惠券和添加优惠券是否同时被选中
          // 判断选中一个并且选中优惠券时提示
        }
      })
    },
    addBtn() {
      this.$refs.signFormRef.validate(async val => {
        if (!val) return
        const confirmResult = await this.$confirm('是否保存签到信息？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          return this.$message.info('您取消了操作')
        } else {
          this.continuityData.forEach(item => {
            item.type = '1'
          })
          this.cumulativeData.forEach(item => {
            item.type = '2'
          })
          this.signForm.dailyAttendanceRuleList = [...this.continuityData, ...this.cumulativeData]
          console.log(this.signForm)

          this.signForm.dailyAttendanceRuleList.forEach(item => {
            item.nowDate = []
            item.bonusTypeInfo = ''
            var bonusStatus = typeof item.bonusType
            console.log('当前', bonusStatus, item.bonusType)
            if (bonusStatus !== 'string') {
              // 数组转字符串
              item.bonusType = item.bonusType.join(',')
              // item.bonusType = item.bonusTypeInfo
            }
            if (item.couponTemplateList !== null) {
              item.couponTemplateList.forEach(itemt => {
                const map = {
                  couponTemplateId: itemt.id || itemt.couponTemplateId
                }
                item.nowDate.push(map)
              })
              item.couponTemplateList = [...item.nowDate]
              delete item.nowDate
            } else {
              item.couponTemplateList = []
            }
          })
          this.$api.postApi.postAddList(this.signForm).then(res => {
            console.log('保存666', res)
            this.$message.success('提交成功')
            this.getDailyAttendanceList()
            // 提交完数据将数据回显到页面
          })
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .input-number-no-btn {
  input[type='number']::-webkit-outer-spin-button,
  input[type='number']::-webkit-inner-spin-button {
    -webkit-appearance: none;
    -moz-appearance: textfield;
  }
}
.text-tip {
  margin-left: 20px;
  color: blue;
}
.el-card {
  overflow: scroll;
  overflow-x: hidden;
  flex-grow: 1;
  height: calc(100vh - 170px);
  border: none;
}
</style>

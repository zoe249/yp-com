<!--
 * @FileDescription: 充值活动
 * @Version: 3.0.3
 * @Author: Wangdandi
 * @Date: 2021-09-15
 -->
<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="addSavingsActivity">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索区域 start -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchSavingsActivityFormLabel" :formData="searchSavingsActivityForm">
        <div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchsearchSavingsActivityForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchsearchSavingsActivityForm" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 头部搜索区域 end -->
    <!-- 列表区域 start -->
    <el-table :data="savingsActivityList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" :height="height">
      <el-table-column prop="number" label="活动编号" width="200" align="center"> </el-table-column>
      <el-table-column prop="name" label="活动名称" align="center" show-overflow-tooltip> </el-table-column>
      <el-table-column prop="singleAmount" label="单笔充值上限" align="center" width="120"> </el-table-column>
      <el-table-column prop="activeObject" label="活动对象" align="center"> </el-table-column>
      <el-table-column label="活动时间" align="center" width="320">
        <template slot-scope="scope"> {{ scope.row.beginTime }}-{{ scope.row.endTime }} </template>
      </el-table-column>
      <el-table-column prop="status" label="活动状态" align="center" width="120">
        <template slot-scope="scope">
          <span v-if="scope.row.status === '0'">{{ scope.row.status }}-未发布</span>
          <span v-if="scope.row.status === '1'">{{ scope.row.status }}-已发布</span>
          <span v-if="scope.row.status === '2'">{{ scope.row.status }}-已过期</span>
          <span v-if="scope.row.status === '3'">{{ scope.row.status }}-撤销发布</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="240">
        <template slot-scope="scope">
          <!-- 0和3显示发布 -->
          <!-- 1显示撤销发布 -->
          <el-button type="text" icon="el-icon-search" @click="viewSavingsActivity(scope.row)">查看</el-button>
          <el-button type="text" @click="copySavingsActivityId(scope.row)">复制活动</el-button>
          <el-button type="text" @click="publishSavingsActivityId(scope.row)" v-show="scope.row.status === '0' || scope.row.status === '3'">发布</el-button>
          <el-button type="text" @click="unPublishSavingsActivityId(scope.row.id)" v-show="scope.row.status === '1'">撤销发布</el-button>
          <el-button type="text" @click="dataSavingsActivity(scope.row.number)">数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 列表区域 end -->
    <!-- 分页 start -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchSavingsActivityForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchSavingsActivityForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 新增充值活动弹框 start -->
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :lock-scroll="false"
      :modal-append-to-body="true"
      :append-to-body="true"
      :title="title"
      :visible.sync="rechargeDialogVisible"
      width="50%"
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ title }}
        </div>
      </template>
      <el-form :model="rechargeForm" label-width="130px" :rules="rechargeFormRules" ref="rechargeFormRef">
        <el-form-item label="活动名称：" prop="name">
          <el-input :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')" v-model="rechargeForm.name" maxlength="30" style="width:500px" show-word-limit placeholder="30字以内"></el-input>
        </el-form-item>
        <el-form-item label="活动时间：" prop="beginTime">
          <el-date-picker
            :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="rechargeForm.beginTime"
            type="datetime"
            @change="beginTimeChange"
            :picker-options="startTime"
            placeholder="选择开始日期时间"
          >
          </el-date-picker>
          至
          <el-date-picker
            :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')"
            value-format="yyyy-MM-dd HH:mm:ss"
            v-model="rechargeForm.endTime"
            type="datetime"
            @change="beginTimeChange"
            :picker-options="endTime"
            placeholder="选择结束日期时间"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="活动对象：" prop="activeObject">
          <el-checkbox-group v-model="rechargeForm.activeObject">
            <el-checkbox label="all" :disabled="(rechargeForm.activeObject[0] !== 'all' && rechargeForm.activeObject.length > 0) || (!isAdd && statusShow !== '0' && !(statusShow === '3'))"
              >所有顾客</el-checkbox
            >
            <br />
            <el-checkbox
              :disabled="rechargeForm.activeObject[0] === 'all' || (!isAdd && statusShow !== '0' && !(statusShow === '3'))"
              v-for="(item, index) in memberLevelList"
              :key="index"
              :label="item.code"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="单笔充值上限：" prop="singleAmount">
          <el-input disabled v-model.number="rechargeForm.singleAmount" clearable type="number" class="input-number-no-btn" learable style="width:120px" placeholder="1000"></el-input>
          <span style="margin-left:10px">元</span>
          <span class="text-tip">设置每笔充值金额的最大值</span>
        </el-form-item>
        <el-form-item label="奖励设置：">
          <el-button :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')" class="el-icon-plus" type="text" @click="addSavingsActivityPrizeBtn">新增充值奖励</el-button>
          <!-- 奖励设置表 -->
          <el-table
            v-if="addSavingsActivityPrize.length !== 0"
            :data="addSavingsActivityPrize"
            style="width: 80%"
            border
            :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            max-height="300px"
          >
            <el-table-column label="序号" align="center" type="index" width="50px">
              <template slot-scope="scope">{{ scope.$index + 1 }}</template>
            </el-table-column>
            <el-table-column prop="scope" label="范围" align="center">
              <template slot-scope="scope">
                <span v-if="scope.row.scope === '1'">等于</span>
                <span v-if="scope.row.scope === '2'">大于等于</span>
                <span v-if="scope.row.scope === '3'">大于</span>
                <span v-if="scope.row.scope === '4'">小于等于</span>
                <span v-if="scope.row.scope === '5'">小于</span>
              </template>
            </el-table-column>
            <el-table-column prop="savingsAmount" label="充值金额" align="center"> </el-table-column>
            <el-table-column prop="prizeType" label="赠送" align="center">
              <template slot-scope="scope">
                <div v-if="scope.row.prizeType === '1'">{{ scope.row.givenAmount }}元</div>
                <div v-if="scope.row.prizeType === '2'">
                  优惠券：
                  <div>{{ scope.row.couponTemplateCode }}</div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button type="text" icon="el-icon-edit-outline" @click="savingsActivityPrizeEditBtn(scope.row, scope.$index)" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')"
                  >编辑</el-button
                >
                <el-button type="text" @click="savingsActivityPrizeDeleteBtn(scope.row, scope.$index)" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')">删除</el-button>
              </template>
            </el-table-column></el-table
          >
        </el-form-item>
        <el-form-item label="规则说明：" prop="ruleDescription">
          <el-input
            :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')"
            type="textarea"
            v-model="rechargeForm.ruleDescription"
            :rows="4"
            maxlength="150"
            style="width:500px;"
            show-word-limit
            placeholder="150字以内"
          ></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-opt-btn-wrap">
        <el-button type="primary" @click="addRechargeDialog(0)" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')">保存</el-button>
        <el-button type="primary" @click="addRechargeDialog(1)" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')">保存并发布</el-button>
      </div>
    </el-dialog>
    <!-- 新增充值活动弹框 end -->
    <!-- 新增奖励设置弹框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="titles" :visible.sync="savingsDialogVisible" width="50%" @close="closeSavingsDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ titles }}
        </div>
      </template>
      <el-form :model="savingsActivityPrizeForm" label-width="100px" :rules="savingsActivityPrizeFormRules" ref="savingsActivityPrizeFormRef">
        <el-form-item label="充值金额：" prop="savingsAmount">
          <el-select v-model="savingsActivityPrizeForm.scope" placeholder="请选择" style="width:150px;">
            <el-option v-for="item in scopeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
          <el-input v-model="savingsActivityPrizeForm.savingsAmount" @change="savingsAmountChange" type="number" clearable style="width:150px; margin-left:20px" class="input-number-no-btn"></el-input>
          <span style="margin-left:20px">元</span></el-form-item
        >
        <el-form-item label="赠送：" prop="givenAmount">
          <div class="line">
            <el-radio @change="handlerChangeRule" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')" label="1" v-model="savingsActivityPrizeForm.prizeType">金额</el-radio>
            <el-input
              style="width:150px; margin-left:20px"
              :disabled="savingsActivityPrizeForm.prizeType === '2'"
              clearable
              v-model.number="savingsActivityPrizeForm.givenAmount"
              type="number"
              class="input-number-no-btn"
            ></el-input
            ><span> 元</span>
          </div>
          <div class="line">
            <el-radio @change="handlerChangeRule" :disabled="!isAdd && statusShow !== '0' && !(statusShow === '3')" label="2" v-model="savingsActivityPrizeForm.prizeType">优惠券</el-radio
            ><el-button @click="addCouponTemplate" type="text" style="width:150px;" :disabled="savingsActivityPrizeForm.prizeType === '1'">添加优惠券</el-button>
            <!-- <span v-if="couponTemplateList.length > 0">
              {{ savingsActivityPrizeForm.couponTemplateName }}
            </span> -->
            <span> {{ savingsActivityPrizeForm.couponTemplateName }}</span>
          </div>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="savingsDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="savingsDialog === 'create' ? addSavingsDialogVisibleBtn() : editSavingsDialogVisibleBtn()">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 新增奖励设置弹框 end -->
    <!-- 数据弹框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="储值明细" :visible.sync="dataSavingsActivityDialogVisible" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          储值明细
        </div>
      </template>
      <!-- 储值明细搜索区域 start -->
      <div class="search-form-box">
        <yp-search-form class="search-form-wrapper" :formLabel="searchDataSavingsActivityFormLabel" :formData="searchDataSavingsActivityForm"></yp-search-form>
        <div class="search-btn-wrapper">
          <el-button
            class="reset-btn"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="resetSearchsearchDataSavingsActivityForm"
            size="mini"
            icon="el-icon-refresh-left"
            >重置</el-button
          >
          <el-button class="search-btn" type="primary" @click="searchsearchDataSavingsActivityForm" size="mini" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <!-- 储值明细搜索区域 end -->
      <!-- 储值明细数据列表 start -->
      <el-table :data="dataSavingsActivityList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
        <el-table-column prop="cardNumber" label="会员卡号" align="center"> </el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"> </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === '0'">{{ scope.row.gender }}-未知</span>
            <span v-if="scope.row.gender === '1'">{{ scope.row.gender }}-男</span>
            <span v-if="scope.row.gender === '2'">{{ scope.row.gender }}-女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="150"> </el-table-column>
        <el-table-column prop="createTime" label="发生时间" align="center" width="180"> </el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">{{ scope.row.type }}-充值</span>
            <span v-if="scope.row.type === '2'">{{ scope.row.type }}-消费</span>
            <span v-if="scope.row.type === '3'">{{ scope.row.type }}-退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center"> </el-table-column>
        <el-table-column prop="givenAmount" label="赠送金额" align="center"> </el-table-column>
        <el-table-column prop="couponTemplateCode" label="赠送优惠券" align="center" width="170"> </el-table-column>
        <el-table-column prop="balance" label="余额" align="center"> </el-table-column>
        <el-table-column prop="organizationName" label="来源组织" align="center"> </el-table-column>
        <el-table-column prop="channelsName" label="来源渠道" align="center"> </el-table-column>
        <el-table-column prop="terminalsName" label="来源终端" align="center"> </el-table-column>
        <el-table-column prop="billNum" label="单据号" align="center"> </el-table-column>
        <el-table-column prop="number" label="充值活动" align="center"> </el-table-column>
        <el-table-column prop="description" label="备注" align="center"> </el-table-column>
      </el-table>
      <!-- 储值明细数据列表 end -->
      <!-- 储值明细分页 start -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <el-pagination
            @size-change="dataSavingsHandleSizeChange"
            @current-change="dataSavingsHandleCurrentChange"
            :current-page="searchDataSavingsActivityForm.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchDataSavingsActivityForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 储值明细分页 end -->
    </el-dialog>
    <!-- 数据弹框 end -->
    <!-- 添加优惠券弹框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="选择券" :visible.sync="couponTemplateDialogVisible" width="50%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          选择券
        </div>
      </template>
      <!-- 头部搜索区域 -->
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
      <!-- 优惠券列表数据 start -->
      <el-table
        @selection-change="handleSelectionChange"
        @current-change="chooseMcaterialChange"
        ref="addRefDialog"
        :data="couponTemplateList"
        tooltip-effect="dark"
        border
        @row-click="singleElection"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        max-height="300px"
      >
        <el-table-column label width="30">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.$index + 1">&nbsp;</el-radio>
          </template>
        </el-table-column>
        <el-input label width="30">
          <template slot-scope="scope">
            <el-radio class="radio" v-model="templateSelection" :label="scope.$index + 1">&nbsp;</el-radio>
          </template>
        </el-input>
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
      <!-- 优惠券列表数据 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="couponTemplateDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addcouponTemplateList">确认添加</el-button>
      </span>
    </el-dialog>
    <!-- 添加优惠券弹框 end -->
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import { parseTime } from '@/filters/format.js'
import _ from 'lodash'
export default {
  components: {
    YpSearchForm
  },
  data() {
    // 校验时间
    // const beginTimeChange = (rule, value, cb) => {
    //   if (this.statusShow === '1' || this.statusShow === '2') {
    //     return cb()
    //   } else {
    //     if (new Date(value).getTime() < new Date().getTime()) {
    //       cb(new Error('开始时间不能小于当前时间'))
    //     } else {
    //       if (new Date(value).getTime() >= new Date(this.rechargeForm.endTime).getTime()) {
    //         cb(new Error('结束时间不能小于或等于开始时间'))
    //       } else {
    //         return cb()
    //       }
    //     }
    //   }
    // }
    // 校验最大一千
    const singleAmountChange = (rule, value, cb) => {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      if (value !== '') {
        if (!reg.test(value) || value > 1000 || value <= 0) {
          cb(new Error('请输入合法的金额数字1-1000，最多两位小数'))
          this.rechargeForm.singleAmount = ''
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    const changesavingsAmount = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value) || value <= 0) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    const changegivenAmount = (rule, value, cb) => {
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
    return {
      editIdInfo: {},
      savingsActivityId: '', // 查看id
      statusShow: '',
      valFalse: [],
      // 头部搜索参数
      searchSavingsActivityForm: {
        name: '', // 活动名称
        status: '', // 活动状态
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      // 列表数据
      savingsActivityList: [],
      total: 0,
      title: '',
      titles: '',
      rechargeDialogVisible: false, // 弹框
      savingsDialogVisible: false, // 设置奖励弹框
      dataSavingsActivityDialogVisible: false, // 储值明细
      couponTemplateDialogVisible: false, // 优惠券弹框
      rechargeDialogShow: 'create',
      savingsDialog: 'create',
      isAdd: true,
      currentStatus: '0',
      // 新增弹框参数
      rechargeForm: {
        name: '', // 规则说明
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        activeObject: ['all'], // 活动对象多选默认all
        singleAmount: 1000, // 单笔充值上限
        ruleDescription: '', // 规则说明
        savingsActivityPrize: [] // 奖励集合
        // save: '' // 保存区分
      },
      memberLevelList: [], // 会员等级列表
      addSavingsActivityPrize: [], // 奖品设置
      rechargeFormRules: {
        name: [{ required: true, message: '必填', trigger: 'blur' }],
        beginTime: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            // validator: beginTimeChange,
            trigger: 'change'
          }
        ],
        endTime: [{ required: true, message: '必填', trigger: 'blur' }],
        activeObject: [{ required: true, message: '必填', trigger: 'blur' }],
        singleAmount: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: singleAmountChange,
            trigger: 'blur'
          }
        ]
      },
      // 设置充值奖励参数
      savingsActivityPrizeForm: {
        sequence: '', // 序号
        savingsAmount: '', // 充值金额
        scope: '1', // 等于
        prizeType: '1', // 奖品单选
        givenAmount: 1, // 赠送金额
        couponTemplateList: [],
        couponTemplateId: '', // 优惠券
        name: '',
        couponTemplateName: '',
        couponTemplateCode: ''
      },
      scopeList: [
        {
          value: '1',
          label: '等于'
        },
        {
          value: '2',
          label: '大于等于'
        },
        {
          value: '3',
          label: '大于'
        },
        {
          value: '4',
          label: '小于等于'
        },
        {
          value: '5',
          label: '小于'
        }
      ],
      savingsActivityPrizeFormRules: {
        savingsAmount: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: changesavingsAmount,
            trigger: 'blur'
          }
        ],
        givenAmount: [
          { required: true, message: '必填', trigger: 'blur' },
          {
            validator: changegivenAmount,
            trigger: 'blur'
          }
        ]
      },
      // 渠道范围参数
      searchChannelForm: {
        name: '',
        status: '',
        userCode: ''
      },
      // 储值明细搜索参数
      searchDataSavingsActivityForm: {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      totals: 0,
      // 储值明细列表数据
      dataSavingsActivityList: [],
      channelList: [], // 所有渠道列表数据
      couponTemplateList: [], // 优惠券列表
      templateSelection: '', // table单选
      // 新增选择优惠券的内容
      selectMultiple: [],
      tableData: [],
      nowIndex: 0, // 编辑index
      // 优惠券列表参数
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      },
      // 活动时间
      startTime: {
        disabledDate: time => {
          if (this.rechargeForm.beginTime) {
            return time.getTime() < new Date().getTime() - 86399999
          } else {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      endTime: {
        disabledDate: time => {
          if (this.rechargeForm.beginTime) {
            return time.getTime() < new Date(this.rechargeForm.beginTime).getTime() - 86399999
          }
          if (!this.rechargeForm.beginTime) {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      }
    }
  },
  computed: {
    searchSavingsActivityFormLabel() {
      return [
        {
          label: '活动名称：',
          type: 'input',
          placeholder: '活动名称',
          prop: 'name'
        },
        {
          label: '活动状态：',
          type: 'select',
          prop: 'status',
          options: [
            { value: '', label: '不限' },
            { value: '0', label: '0-未发布' },
            { value: '1', label: '1-已发布' },
            { value: '2', label: '2-已过期' },
            { value: '3', label: '3-撤销发布' }
          ]
        },
        {
          label: '活动时间:',
          type: 'datetimerange',
          props1: 'beginTime',
          props2: 'endTime',
          placeholder1: this.$t('lang.selectbegintime'),
          placeholder2: this.$t('lang.selectendtime'),
          span: 9
        }
      ]
    },
    // 储值明细搜索
    searchDataSavingsActivityFormLabel() {
      return [
        {
          label: '昵称：',
          type: 'input',
          placeholder: '手机号或昵称',
          prop: 'nickname'
        },
        {
          label: '充值活动：',
          type: 'input',
          placeholder: '充值活动编号',
          prop: 'number'
        },
        {
          label: '类型：',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限制' },
            { value: '1', label: '1-充值' },
            { value: '2', label: '2-消费' },
            { value: '3', label: '3-退款' }
          ]
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsId',
          options: this.channelList
        },
        {
          label: '发生开始时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: '开始日期'
        },
        {
          label: '发生结束时间：',
          type: 'time',
          props: 'endTime',
          placeholder: '结束日期'
        }
      ]
    },
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
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  created() {
    this.getHeight()
    this.getMemberLevelList()
    this.getSavingsActivityList() // 列表数据
    parseTime()
  },
  methods: {
    couponTemplateNameChange() {
      console.log('this.editIdInfo', this.editIdInfo)
      console.log('this.editIdInfo', this.couponTemplateList)
      this.couponTemplateList.forEach(item => {
        if (item.id === this.editIdInfo.id) {
          return item.name
        }
      })
    },
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      console.log(this.height)
    },
    /**
     * 描述：从后端后去会员等级列表数据
     */
    async getMemberLevelList() {
      const obj = {
        name: '', // 等级名称
        level: '',
        pageIndex: 1, // 当前页
        pageSize: 999 // 当前页条数
      }
      const res = await this.$api.getMemberLevelApi.getMemberLevelList(obj)
      console.log('rrr', res)
      this.memberLevelList = res.data
    },
    /**
     * 描述：充值活动列表数据
     */
    getSavingsActivityList() {
      this.$api.getActivityApi.getSavingsActivityList(this.searchSavingsActivityForm).then(res => {
        console.log('页面数据', res)
        this.savingsActivityList = res.data
        this.total = res.total
      })
    },
    /**
     * 描述：查询充值活动
     */
    searchsearchSavingsActivityForm() {
      this.searchSavingsActivityForm.pageIndex = 1
      this.getSavingsActivityList()
    },
    /**
     * 描述：重置查询充值活动
     */
    resetSearchsearchSavingsActivityForm() {
      this.searchSavingsActivityForm = {
        name: '', // 活动名称
        status: '', // 活动状态
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getSavingsActivityList()
    },
    /**
     * 描述：切换分页条数
     */
    handleSizeChange(newPage) {
      this.searchSavingsActivityForm.pageSize = newPage
      this.getSavingsActivityList()
    },
    /**
     * 描述：切换分页
     */
    handleCurrentChange(newPage) {
      this.searchSavingsActivityForm.pageIndex = newPage
      this.getSavingsActivityList()
    },
    /**
     * 描述：添加充值活动
     */
    addSavingsActivity() {
      this.rechargeDialogVisible = true
      this.isAdd = true
      this.title = '新增充值活动'
      this.rechargeDialogShow = 'create'
      this.rechargeForm = {
        name: '',
        beginTime: '',
        endTime: '',
        activeObject: ['all'],
        singleAmount: 1000,
        ruleDescription: ''
      }
      this.addSavingsActivityPrize = []
      // this.templateSelection = ''
    },
    /**
     * 描述：活动开始时间
     */
    beginTimeChange() {
      var businesstime = new Date(this.rechargeForm.beginTime)
      var endtime = new Date(this.rechargeForm.endTime)
      var timeEnd = endtime.getTime()
      var timeBegin = businesstime.getTime()
      if (businesstime > timeEnd || timeBegin === timeEnd) {
        this.$message.error('开始时间不能大于等于结束时间')
        this.rechargeForm.endTime = ''
      }
    },
    /**
     * 描述：添加设置奖励
     */
    addSavingsActivityPrizeBtn() {
      this.savingsDialogVisible = true
      this.titles = '新增充值奖励'
      this.savingsDialog = 'create'
      this.savingsActivityPrizeForm.scope = '1'
      this.savingsActivityPrizeForm.savingsAmount = ''
      this.savingsActivityPrizeForm.prizeType = '1'
      this.savingsActivityPrizeForm.givenAmount = 1
      this.savingsActivityPrizeForm.couponTemplateName = ''
      this.savingsActivityPrizeForm.couponTemplateId = ''
      this.selectMultiple = [] // 选中优惠券数据
      this.couponTemplateList.length = 0 // 不显示优惠券名称
    },
    /**
     * 描述：关闭新增奖励设置弹框
     */
    closeSavingsDialog() {
      this.$refs.savingsActivityPrizeFormRef.clearValidate()
    },
    /**
     * 描述：判断充值金额不能大于单笔充值上限
     */
    savingsAmountChange() {
      // 金额递增：输入大于200后就不能输入比200小的金额
      if (Number(this.rechargeForm.singleAmount) < Number(this.savingsActivityPrizeForm.savingsAmount)) {
        this.savingsActivityPrizeForm.savingsAmount = ''
        return this.$message.error(`充值金额不能大于单笔充值上限${this.rechargeForm.singleAmount}`)
      }

      /**
       * 充值大小比较 金额按顺序递增
       * 金额不能小于上一条 且不能大于下一条
       */
      let amountStatus = 0
      const tempArr = this.addSavingsActivityPrize
      const savingsAmount = Number(this.savingsActivityPrizeForm.savingsAmount)
      if (this.savingsDialog === 'create') {
        if (tempArr.length > 0) {
          // 新增：只需要大于最后一条明细金额
          amountStatus = savingsAmount <= tempArr[tempArr.length - 1].savingsAmount ? 1 : 0
        } else {
          amountStatus = 0
        }
      } else if (this.savingsDialog === 'edit') {
        if (tempArr.length === 1) {
          // 修改：明细只有一条 不做限制
          amountStatus = 0
        } else {
          // 修改：明细存在多条
          if (this.nowIndex === 0) {
            // 明细第一条，判断金额必须小于下一条
            const next = tempArr[this.nowIndex + 1].savingsAmount
            amountStatus = savingsAmount >= next ? 1 : 0
          } else if (this.nowIndex > 0 && this.nowIndex < tempArr.length) {
            // 明细第n条，金额必须大于上一条，小于下一条
            const prev = tempArr[this.nowIndex - 1].savingsAmount
            const next = tempArr[this.nowIndex + 1].savingsAmount
            amountStatus = savingsAmount >= next || savingsAmount <= prev ? 1 : 0
          } else {
            // 明细最后一条：金额必须大于上一条
            const prev = tempArr[this.nowIndex + 1].savingsAmount
            amountStatus = savingsAmount <= prev ? 1 : 0
          }
        }
      }
      // // 判断新增时必须按照金额递增
      // if (this.savingsDialog === 'create' && tempArr.length >= 2) {
      //   amountStatus = savingsAmount <= tempArr[tempArr.length - 1].savingsAmount ? 1 : 0
      // }

      // 判断充值金额不能比首次输入的值小
      if (amountStatus) {
        this.$message.warning('充值金额必须是按大小递增的')
        this.savingsActivityPrizeForm.savingsAmount = ''
      }
      // 控制编辑时输入的不能大于最后一列金额
    },
    /**
     * 描述：控制赠送单选按钮方法
     */
    handlerChangeRule() {
      console.log('单选', this.savingsActivityPrizeForm.prizeType)
      if (this.savingsActivityPrizeForm.prizeType === '1') {
        this.savingsActivityPrizeForm.couponTemplateName = ''
        this.savingsActivityPrizeForm.couponTemplateCode = ''
        this.savingsActivityPrizeForm.couponTemplateId = ''
        // this.couponTemplateList.length = 0
        this.savingsActivityPrizeForm.name = ''
        this.templateSelection = ''
        console.log('danxuan', this.selectMultiple)
      }
      if (this.savingsActivityPrizeForm.prizeType === '2') {
        this.savingsActivityPrizeForm.givenAmount = 1
      }
      console.log('fff', this.selectMultiple)
      console.log('保存', this.savingsActivityPrizeForm)
    },
    /**
     * 描述：新增优惠券
     */
    addCouponTemplate() {
      this.couponTemplateDialogVisible = true
      console.log('选中的优惠券数据66666', this.selectMultiple)
      this.templateSelection = ''
      // this.savingsActivityPrizeForm.couponTemplateName = ''
      // this.couponTemplateNameChange()
      this.getCouponTemplateList()
    },
    /**
     * 描述：确认添加优惠券按钮
     */
    addcouponTemplateList() {
      this.couponTemplateDialogVisible = false
      // 将选中的优惠券名称添加
      console.log('选中的优惠券数据', this.selectMultiple)
      this.selectMultiple.forEach(item => {
        this.savingsActivityPrizeForm.couponTemplateName = item.name
        this.savingsActivityPrizeForm.couponTemplateCode = item.code
        this.savingsActivityPrizeForm.couponTemplateId = item.id
      })
    },
    /**
     * 描述：优惠券模板列表接口
     */
    async getCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      console.log('获取券列表数据', res.data)
      this.couponTemplateList = res.data
    },
    handleSelectionChange(val) {
      this.selectMultiple = val
    },
    chooseMcaterialChange(val) {
      this.valFalse = val
      this.$refs.addRefDialog.toggleRowSelection(val)
    },
    singleElection(row) {
      this.templateSelection = this.tableData.indexOf(row)
      this.templateRadio = row.id
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
    /**
     * 描述：添加设置充值奖励
     */
    addSavingsDialogVisibleBtn() {
      console.log('addSavingsActivityPrize', this.addSavingsActivityPrize)
      this.$refs.savingsActivityPrizeFormRef.validate(val => {
        if (!val) return
        // 把优惠券id摘出来赋值上
        this.selectMultiple.forEach(item => {
          this.savingsActivityPrizeForm.couponTemplateId = item.id
        })
        // 判断选优惠券的同时选优惠券数据
        if (this.savingsActivityPrizeForm.prizeType === '2' && this.couponTemplateList.length === 0) {
          return this.$message.info('请选择并添加优惠券')
        } else {
          // 判断选金额赠送数据
          if (this.savingsActivityPrizeForm.prizeType === '1') {
            const sum = {
              scope: this.savingsActivityPrizeForm.scope,
              savingsAmount: this.savingsActivityPrizeForm.savingsAmount,
              prizeType: this.savingsActivityPrizeForm.prizeType,
              givenAmount: this.savingsActivityPrizeForm.givenAmount,
              couponTemplateId: ''
              // name: this.savingsActivityPrizeForm.name
            }
            this.addSavingsActivityPrize.push(sum)
            // 判断选优惠券赠送数据
          } else if (this.savingsActivityPrizeForm.prizeType === '2') {
            console.log('code', this.savingsActivityPrizeForm.couponTemplateCode)
            const map = {
              scope: this.savingsActivityPrizeForm.scope,
              savingsAmount: this.savingsActivityPrizeForm.savingsAmount,
              prizeType: this.savingsActivityPrizeForm.prizeType,
              givenAmount: this.savingsActivityPrizeForm.givenAmount,
              couponTemplateId: this.savingsActivityPrizeForm.couponTemplateId,
              couponTemplateList: this.selectMultiple,
              couponTemplateName: this.savingsActivityPrizeForm.couponTemplateName,
              couponTemplateCode: this.savingsActivityPrizeForm.couponTemplateCode
            }
            console.log('mapmap', map)
            this.addSavingsActivityPrize.push(map)
          }
          this.savingsDialogVisible = false
        }
        console.log('数据', this.addSavingsActivityPrize)
      })
    },
    /**
     * 描述：奖励设置编辑按钮
     */
    savingsActivityPrizeEditBtn(row, index) {
      this.editIdInfo = row
      // this.couponTemplateNameChange()
      this.savingsDialogVisible = true
      this.titles = '编辑充值奖励'
      this.savingsDialog = 'edit'
      // 回显（打印赋值过去但页面不显示）
      this.$set(this.savingsActivityPrizeForm, 'couponTemplateName', row.couponTemplateName)
      this.savingsActivityPrizeForm = _.cloneDeep(row)
      this.nowIndex = index
      console.log('编辑', row, this.savingsActivityPrizeForm)
    },
    /**
     * 描述：编辑设置充值奖励确定按钮
     */
    editSavingsDialogVisibleBtn() {
      this.$refs.savingsActivityPrizeFormRef.validate(val => {
        if (!val) return
        console.log('编辑确定', this.savingsActivityPrizeForm)
        this.$set(this.addSavingsActivityPrize, this.nowIndex, _.cloneDeep(this.savingsActivityPrizeForm))
        this.savingsDialogVisible = false
        console.log('编辑', this.addSavingsActivityPrize)
      })
    },
    /**
     * 描述：奖励设置删除按钮
     */
    savingsActivityPrizeDeleteBtn(row, index) {
      if (index === this.addSavingsActivityPrize.length - 1) {
        this.addSavingsActivityPrize.splice(index, 1)
      } else {
        this.$message.warning('不允许直接中间删除一条规则')
      }
    },
    /**
     * 描述：关闭新增充值活动弹框
     */
    closeDialog() {
      this.$refs.rechargeFormRef.clearValidate()
    },
    /**
     * 描述：根据id查看充值活动详情
     */
    viewSavingsActivity(row) {
      console.log('查看', row)
      this.statusShow = row.status // 活动状态
      this.savingsActivityId = row.id // 查看id
      console.log(this.statusShow)
      this.isAdd = false // 是否禁用
      this.getViewSavingsActivityById(row) // 根据id查看充值活动
    },
    // 根据id查看充值活动详情
    getViewSavingsActivityById(row) {
      this.$api.getActivityApi.getViewSavingsActivityById(row.id).then(res => {
        console.log('查看详情', res)
        this.rechargeForm = res
        if (typeof this.rechargeForm.activeObject === 'string') {
          this.rechargeForm.activeObject = this.rechargeForm.activeObject.split(',')
        }
        console.log('查看详情', res.savingsActivityPrize)
        if (res.savingsActivityPrize !== null) {
          this.savingsActivityPrizeForm.name = res.savingsActivityPrize.couponTemplateName
          this.addSavingsActivityPrize = [...res.savingsActivityPrize]
        } else {
          this.addSavingsActivityPrize = []
        }
      })
      // this.rechargeForm = row
      this.rechargeDialogShow = 'edit'
      this.title = '查看充值活动'
      this.rechargeDialogVisible = true
    },
    /**
     * 描述：根据id复制活动
     */
    async copySavingsActivityId(row) {
      const confirmResult = await this.$confirm('您确定要按照该充值活动的配置生成一个新的活动吗?', '复制', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getSavingsActivityList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.isAdd = true
        // 弹出查看弹框可修改内容并进行发布
        this.getViewSavingsActivityById(row)
      }
    },
    /**
     * 描述：根据id发布
     */
    async publishSavingsActivityId(row) {
      const getTime = date => {
        if (date) {
          return new Date(date).getTime()
        } else {
          return new Date().getTime()
        }
      }
      // 1. 调用详情接口
      const resDetail = await this.$api.getActivityApi.getViewSavingsActivityById(row.id)
      const tempObj = {}
      if (resDetail.savingsActivityPrize && resDetail.savingsActivityPrize.length) {
        resDetail.savingsActivityPrize.forEach(item => {
          // 2. 判断是否存在有效期券
          if (item.prizeType === '2' && item.timeRule === '1') {
            // 3. 判断券活动有效期结束时间是否比活动结束时间早
            if (getTime(item.endTime) < getTime(resDetail.endTime) && getTime(item.endTime) > getTime()) {
              tempObj.isPrize = true
              tempObj.name = item.couponTemplateName
            }
          }
        })
      }
      let title = ''
      if (tempObj.isPrize) {
        title = `存在券模板"${tempObj.name}"的失效期比充值活动结束时间早，是否继续`
      } else {
        title = '确定要发布该活动吗？'
      }
      const confirmResult = await this.$confirm(title, '发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getSavingsActivityList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        // 活动时间与当前时间比较
        const activityDetail = await this.$api.getActivityApi.getViewSavingsActivityById(row.id)
        console.log('activityDetail', activityDetail)
        if (new Date(activityDetail.endTime).getTime() < new Date().getTime()) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '活动结束时间不能小于当前时间',
            type: 'info'
          })
        } else {
          // 根据id发布接口
          this.$api.putActivityApi.putPublishSavingsActivityId(row.id).then(res => {
            console.log('根据id发布', res)
            // 判断状态码 提示成功
            if (res.code === '200000') {
              this.getSavingsActivityList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            }
          })
        }
        // 优惠券时间判断
      }
    },
    /**
     * 描述：根据id撤销发布
     */
    async unPublishSavingsActivityId(id) {
      const confirmResult = await this.$confirm('确定要将活动撤销发布吗？', '撤销发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getSavingsActivityList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        // 撤销充值活动发布接口
        const res = await this.$api.putActivityApi.putUnPublishSavingsActivity(id)
        console.log('撤销发布', res)
        // 判断状态码 提示成功
        if (res.code === '200000') {
          this.getSavingsActivityList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        }
        this.rechargeDialogVisible = false
      }
    },
    /**
     * 描述：根据id获取储值明细数据
     */
    dataSavingsActivity(number) {
      this.searchDataSavingsActivityForm.pageIndex = 1
      this.searchDataSavingsActivityForm.number = number
      this.dataSavingsActivityDialogVisible = true // 显示弹框
      // 渠道范围接口
      this.$api.getChannelApi.getChannelList(this.searchChannelForm).then(res => {
        console.log('渠道范围数据', res)
        const firstAll = {
          value: '',
          label: '不限制'
        }
        this.channelList.unshift(firstAll)
        // 后端要求传channelsId的id
        res.map(item => {
          this.channelList.push({ value: item.id, label: item.name })
        })
        console.log('this', this.channelList)
      })
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细数据列表
     */
    getDataSavingsActivityList() {
      this.$api.getActivityApi.getDataSavingsActivityList(this.searchDataSavingsActivityForm).then(res => {
        console.log('储存数据列表', res)
        this.dataSavingsActivityList = res.data
        this.totals = res.total
      })
    },
    /**
     * 描述：储值明细重置搜索
     */
    resetSearchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm = {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：查询储值明细
     */
    searchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm.pageIndex = 1
      console.log('搜索', this.searchDataSavingsActivityForm)
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页条数
     */
    dataSavingsHandleSizeChange(newPage) {
      this.searchDataSavingsActivityForm.pageSize = newPage
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页
     */
    dataSavingsHandleCurrentChange(newPage) {
      this.searchDataSavingsActivityForm.pageIndex = newPage
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：关闭新增弹框
     */
    async addRechargeDialog(save) {
      const getTime = date => {
        if (date) {
          return new Date(date).getTime()
        } else {
          return new Date().getTime()
        }
      }
      const tempObj = {}
      this.addSavingsActivityPrize.forEach(item => {
        // 2. 判断是否存在有效期券
        if (item.prizeType === '2' && item.timeRule === '1') {
          // 3. 判断券活动有效期结束时间是否比活动结束时间早
          if (getTime(item.endTime) < getTime(this.rechargeForm.endTime) && getTime(item.endTime) > getTime()) {
            tempObj.isPrize = true
            tempObj.name = item.couponTemplateName
          }
        }
      })
      let title = ''
      if (tempObj.isPrize) {
        title = `存在券模板"${tempObj.name}"的失效期比充值活动结束时间早，是否继续`
      } else {
        title = '确定要保存或保存并发布该活动吗？'
      }
      this.rechargeForm.save = save
      this.$refs.rechargeFormRef.validate(async val => {
        if (!val) return
        let isOption = true
        const confirmResult = await this.$confirm(title, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          isOption = false
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          isOption = true
          this.rechargeForm.activeObject = this.rechargeForm.activeObject.toString()
          var dataMap = []
          this.addSavingsActivityPrize.forEach((item, index) => {
            console.log('item', item)
            const map = {
              sequence: index + 1,
              scope: item.scope,
              savingsAmount: item.savingsAmount,
              prizeType: item.prizeType,
              givenAmount: item.givenAmount,
              couponTemplateId: item.couponTemplateId
            }
            dataMap.push(map)
          })
          this.rechargeForm.savingsActivityPrize = [...dataMap]
          console.log('新增保存', this.rechargeForm)
          if (this.isAdd && isOption) {
            this.$api.postActivityApi.postAddRechargeDialog(this.rechargeForm).then(res => {
              console.log('新增保存成功', res)
              // 判断状态码 提示成功
              if (res.code === '200000') {
                this.getSavingsActivityList()
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.rechargeDialogVisible = false
              }
            })
          }
          // 新增区域 end
          // 修改区域 start
          if (!this.isAdd && isOption) {
            this.rechargeForm.activeObject = this.rechargeForm.activeObject.toString()
            console.log('编辑', this.rechargeForm)
            this.$api.putActivityApi.putAddRechargeDialog(this.rechargeForm, this.savingsActivityId).then(res => {
              console.log('修改保存成功', res)
              // 判断状态码 提示成功
              if (res.code === '200000') {
                this.getSavingsActivityList()
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.rechargeDialogVisible = false
              }
            })
          }
          // 修改区域 end
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
// 表单底部按钮区域
.bottom-opt-btn-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.line {
  margin-bottom: 20px;
}
</style>

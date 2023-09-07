<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="showAddDialog">{{ '+ 新增' }}</el-button>
    <el-table :data="tableList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="方案编号" prop="number"></el-table-column>
      <el-table-column label="名称" prop="productName"></el-table-column>
      <el-table-column label="付费等级（线下）" prop="paidLevel"></el-table-column>
      <el-table-column label="销售价格" prop="salePrice"></el-table-column>
      <el-table-column label="有效期（月）" prop="validPeriod"></el-table-column>
      <el-table-column label="优惠券赠送方式" prop="presentTypeDescr"></el-table-column>
      <el-table-column label="状态" prop="statusDescr"></el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showDetail(scope.row)">查看详情</el-button>
          <el-button type="text" @click="copyPlan(scope.row)">复制方案</el-button>
          <el-button type="text" @click="publish(scope.row)" v-show="scope.row.status === '01' || scope.row.status === '03'">发布</el-button>
          <el-button type="text" @click="unPublish(scope.row)" v-show="scope.row.status === '02'">撤销发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 新增或编辑弹出框 start -->
    <el-dialog
      :lock-scroll="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="isAdd ? '新增' : '查看详情'"
      :visible.sync="dialogVisible"
      width="80%"
      v-dialogDrag
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>
      <el-form :model="formData" :rules="formDataRules" ref="formRef" label-width="140px" label-position="right">
        <div class="dialog-title-head">
          活动信息
        </div>
        <el-form-item label="名称:" prop="productName">
          <el-input :disabled="!isAdd" v-model="formData.productName" maxlength="15" class="width240"></el-input>
        </el-form-item>
        <el-form-item label="商品编码:" prop="productCode">
          <el-input :disabled="!isAdd" v-model="formData.productCode" class="width240"></el-input><span class="text-tip">只允许输入数字</span>
        </el-form-item>
        <div class="df">
          <el-form-item label="市场价:" prop="marketPrice">
            <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model="formData.marketPrice" class="width240"></el-input>
          </el-form-item>
          <el-form-item label="销售价格:" prop="salePrice">
            <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model="formData.salePrice" class="width240"></el-input>
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="有效期:" prop="validPeriod">
            <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model.number="formData.validPeriod" class="width240"></el-input>
            <span style="margin-left: 10px;">月</span>
          </el-form-item>
          <el-form-item label="付费等级:" label-width="116px" prop="paidLevel">
            <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model="formData.paidLevel" class="width240"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="活动对象:" prop="activeObject">
          <el-checkbox-group v-model="formData.activeObject">
            <el-checkbox label="all" :disabled="(formData.activeObject[0] !== 'all' && formData.activeObject.length > 0) || (!isAdd && formData.status !== '01' && !(formData.status === '03'))"
              >所有顾客</el-checkbox
            >
            <br />
            <el-checkbox
              :disabled="formData.activeObject[0] === 'all' || (!isAdd && formData.status !== '01' && !(formData.status === '03'))"
              v-for="(item, index) in memberLevelList"
              :key="index"
              :label="item.code"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="商品图片：" prop="icon">
          <el-input v-show="false" v-model="formData.icon"></el-input>
          <div v-if="formData.icon" class="upload-img-container">
            <div class="img-upload"><img :src="formData.icon" alt="" /></div>
            <div class="img-btns"><span class="priview-btn" @click="priviewImg(formData.icon)">预览</span> <span class="delete-btn" @click="deleteImg">删除</span></div>
          </div>
          <el-upload :action="domain" accept=".jpg,.jpeg,.png" :data="QiniuData" :before-upload="beforeAvatarUpload" :on-success="uploadSuccess" list-type="picture">
            <el-button size="small" type="primary" :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')">上传图片</el-button>
            <div slot="tip" class="el-upload__tip">
              格式为png、jpeg、jpg，单张小于1mb
            </div>
          </el-upload>
        </el-form-item>
        <div class="dialog-title-head">
          选择券模板
        </div>
        <el-form-item label="优惠券赠送方式:" prop="presentType">
          <el-radio-group v-model="formData.presentType">
            <el-radio v-for="(items, indexs) in radioList" :label="items.value" :key="indexs">{{ items.label }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="已选券模板:" prop="couponTemplateList">
          <el-button type="primary" class="choose-coupon-btn" :disabled="!isAdd && formData.status !== '01'" @click="openCouponTemplate">选择券</el-button>
          <span class="text-tip">可以选择多个券模板组合（只能选择有效的券模板）</span>
          <!-- 表格内容 start -->
          <el-table :data="formData.couponTemplateList" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" max-height="300px">
            <!-- :height="formData.couponTemplateList.length > 0 ? 300 : 100" -->
            <el-table-column label="券模板编号" prop="code"></el-table-column>
            <el-table-column label="名称" prop="name"></el-table-column>
            <el-table-column label="类型" prop="type">
              <template slot-scope="scope">
                <div>{{ scope.row.type }}-{{ scope.row.typeName }}</div>
              </template>
            </el-table-column>
            <el-table-column label="面值" prop="denomination">
              <template slot-scope="scope">
                <div>{{ scope.row.facevalue ? scope.row.facevalue : scope.row.denomination + scope.row.uom }}</div>
              </template>
            </el-table-column>
            <el-table-column label="有效期" prop="denomination" width="300">
              <template slot-scope="scope">
                <div v-show="scope.row.timeRule === '1'">
                  {{ scope.row.beginTime }} -
                  {{ scope.row.endTime }}
                </div>
                <div v-show="scope.row.timeRule === '2'">领券后{{ scope.row.days }}天生效, 生效后{{ scope.row.validDays }}天内有效</div>
              </template>
            </el-table-column>
            <el-table-column label="状态" prop="status">
              <template slot-scope="scope">
                <div>
                  <span v-show="scope.row.status === '1'">1-有效</span>
                  <span v-show="scope.row.status === '2'">2-过期</span>
                  <span v-show="scope.row.status === '3'">3-作废</span>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="每次领取数量" prop="quantity" align="center">
              <template slot="header">
                <span style="color:red;">*</span>
                <span>每次领取数量</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'couponTemplateList.' + scope.$index + '.quantity'" :rules="formDataRules.quantity">
                  <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model.number="scope.row.quantity"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" :disabled="!isAdd && formData.status !== '01'" @click="deleteSelectedCouponTempate(scope.row.id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="dialog-title-head">
          权益说明
        </div>
        <el-form-item label=" " prop="rightsDescription" class="textarea-item">
          <el-input :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')" v-model="formData.rightsDescription" type="textarea" :rows="5" style="width: 400px"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-opt-btn-wrap">
        <el-button type="primary" @click="submit(0)" :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')">保存</el-button>
        <el-button type="primary" @click="submit(1)" :disabled="!isAdd && formData.status !== '01' && !(formData.status === '03')">保存并发布</el-button>
      </div>
    </el-dialog>
    <el-dialog v-dialogDrag title="图片预览" append-to-body :visible.sync="preViewDialogVisible" width="50%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '图片预览' }}
        </div>
      </template>
      <div class="previewImgwrapper">
        <img class="previewImg" :src="previewImgPath" alt="" />
      </div>
    </el-dialog>
    <coupon-template ref="couponTemplateRef" :couponTypeSearchList="couponTypeSearchList" :couponTemplateList="formData.couponTemplateList" @selectItem="selectItem"></coupon-template>
  </div>
</template>
<script>
import CouponTemplate from '@/components/couponTemplate/index.vue'
export default {
  components: {
    CouponTemplate
  },
  data() {
    // 大于1等正整数校验
    const checkMoneyRgtOne = (rule, value, cb) => {
      if (value !== '' && value !== null) {
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
    // 描述：商品表面数字校验
    const checkMoney = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^\+?[0-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('只允许输入数字'))
        } else {
          return cb()
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    // 检测名称唯一性校验
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getPayMemberApi.validName(this.payMemberId, value).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      } else {
        return cb()
      }
    }
    // 检测编码唯一性校验
    const checkCode = (rule, value, cb) => {
      if (value !== '' && this.isAdd) {
        this.$api.getPayMemberApi.validCode(value).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('输入的编码已经存在'))
          }
        })
      } else {
        return cb()
      }
    }
    // 校验市场价
    const checkMarketPrice = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          if (this.formData.salePrice) {
            if (value * 1 < this.formData.salePrice * 1) {
              cb(new Error('市场价必须大于销售价格'))
            } else {
              return cb()
            }
          } else {
            return cb()
          }
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    // 校验销售价
    const checkSalePrice = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          if (this.formData.marketPrice) {
            if (value * 1 > this.formData.marketPrice * 1) {
              cb(new Error('销售价格必须小于市场价'))
            } else {
              return cb()
            }
          } else {
            return cb()
          }
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    return {
      height: null,
      searchForm: {
        pageIndex: 1,
        pageSize: 20
      },
      domain: this.$domain,
      couponTypeSearchList: [],
      memberLevelList: [], // 会员等级列表
      total: 0,
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
        data: {}
      },
      preViewDialogVisible: false,
      previewImgPath: '',
      qiniuaddr: '',
      radioList: [],
      payMemberId: null,
      formData: {
        productName: '',
        productCode: '',
        marketPrice: null,
        salePrice: null,
        validPeriod: null,
        activeObject: ['all'],
        couponTemplateList: [],
        icon: '',
        paidLevel: '',
        presentType: '',
        rightsDescription: ''
      },
      formDataRules: {
        quantity: [
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
        productName: [
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
        productCode: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoney,
            trigger: 'blur'
          },
          {
            validator: checkCode,
            trigger: 'blur'
          }
        ],
        marketPrice: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMarketPrice,
            trigger: 'blur'
          }
        ],
        salePrice: [
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
        validPeriod: [
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
        activeObject: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        icon: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        paidLevel: [
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          }
        ],
        presentType: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ]
      },
      isAdd: true,
      dialogVisible: false,
      tableList: []
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取表格列表
    this.getList()
    // 获取会员等级数据
    this.getMemberLevelList()
    // 获取优惠券模板类型查询下拉列表数据
    this.getCouponTypeSearchList()
    // 获取图片上传tokne
    this.getQiniuToken()
    // 获取优惠方式单选列表
    this.getRadioList()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    async getMemberLevelList() {
      const obj = {
        name: '', // 等级名称
        level: '',
        pageIndex: 1, // 当前页
        pageSize: 999 // 当前页条数
      }
      const res = await this.$api.getMemberLevelApi.getMemberLevelList(obj)
      this.memberLevelList = res.data
    },
    getRadioList() {
      this.radioList = [
        { label: '不赠送', value: '01' },
        { label: '每月赠送', value: '02' },
        { label: '一次性赠送', value: '03' }
      ]
    },
    getCouponTypeSearchList() {
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
    // 获取表格列表数据
    getList() {
      this.$api.getPayMemberApi.getList(this.searchForm).then(res => {
        this.tableList = res.data
        this.total = res.total
      })
    },
    // 新增弹窗
    showAddDialog() {
      this.isAdd = true
      this.payMemberId = null
      this.dialogVisible = true
      this.formData = {
        productName: '',
        productCode: '',
        marketPrice: null,
        salePrice: null,
        validPeriod: null,
        activeObject: ['all'],
        couponTemplateList: [],
        icon: '',
        paidLevel: '',
        presentType: '',
        rightsDescription: ''
      }
    },
    // 新增关闭回调
    closeDialog() {
      this.isAdd = true
      this.payMemberId = null
      this.formData = {
        productName: '',
        productCode: '',
        marketPrice: null,
        salePrice: null,
        validPeriod: null,
        activeObject: ['all'],
        couponTemplateList: [],
        icon: '',
        paidLevel: '',
        presentType: '',
        rightsDescription: ''
      }
      this.$nextTick(() => {
        this.$refs.formRef.resetFields()
      })
    },
    // 查看详情弹窗
    showDetail(item) {
      this.isAdd = false
      this.payMemberId = item.id
      this.getDetailById(item.id)
    },
    async getDetailById(id) {
      const res = await this.$api.getPayMemberApi.getDetailById(id)
      const data = res.data
      data.activeObject = data.activeObject.split(',')
      this.formData = data
      if (this.isAdd) {
        this.formData.productName = ''
        this.formData.productCode = ''
      }
      this.dialogVisible = true
    },
    // 发布
    async publish(item) {
      const confirmResult = await this.$confirm('确定要将发布该方案吗？', '发布', {
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
        const detailData = await this.$api.getPayMemberApi.getDetailById(item.id)
        const params = detailData.data
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].status !== '1') {
            return this.$notify({
              title: '业务提示',
              message: '已选择券模板中存在过期模板，不能进行保存或保存并发布操作',
              type: 'info'
            })
          }
        }
        let thanCurrentTime = []
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].timeRule === '1') {
            if (new Date(params.couponTemplateList[i].endTime).getTime() < new Date(params.endTime).getTime()) {
              thanCurrentTime.push(params.couponTemplateList[i].name)
            }
          }
        }
        if (thanCurrentTime.length > 0) {
          thanCurrentTime = thanCurrentTime.toString()
        } else {
          thanCurrentTime = ''
        }
        if (thanCurrentTime) {
          const confirmResult = await this.$confirm(`存在券模板,'${thanCurrentTime},'的失效期比券活动结束时间早，是否继续`, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          if (confirmResult !== 'confirm') {
            return this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optCancel'),
              type: 'info'
            })
          } else {
            const res = await this.$api.putPayMemberApi.release(item.id)
            if (res.code === '200000') {
              this.getList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            }
          }
        } else {
          const res = await this.$api.putPayMemberApi.release(item.id)
          if (res.code === '200000') {
            this.getList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        }
      }
    },
    // 撤销发布
    async unPublish(item) {
      const confirmResult = await this.$confirm('确定要将方案撤销发布吗？', '撤销发布', {
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
        const res = await this.$api.putPayMemberApi.revoke(item.id)
        if (res.code === '200000') {
          this.getList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        }
      }
    },
    // 复制方案
    async copyPlan(item) {
      const confirmResult = await this.$confirm('您确定要按照该方案的配置生成一个新的方案吗？', '复制', {
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
        this.isAdd = true
        this.getDetailById(item.id)
      }
    },
    handleSizeChange(newPageSize) {
      this.searchForm.pageSize = newPageSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      this.searchForm.pageIndex = newPage
      this.getList()
    },
    // 选择券模板回调
    selectItem(arr) {
      this.formData.couponTemplateList = arr
      console.log(this.formData.couponTemplateList)
    },
    // 打开选择模板组件
    openCouponTemplate() {
      this.$refs.couponTemplateRef.getCouponTemplateList()
      this.$refs.couponTemplateRef.couponTemplateDialogVisible = true
    },
    // 删除券模板
    deleteSelectedCouponTempate(id) {
      const i = this.formData.couponTemplateList.findIndex(item => {
        return item.id === id
      })
      this.formData.couponTemplateList.splice(i, 1)
    },
    // 图片预览
    priviewImg(previewImgPath) {
      this.preViewDialogVisible = true
      this.previewImgPath = previewImgPath
    },
    // 删除图片
    deleteImg() {
      this.formData.icon = ''
      this.previewImgPath = ''
    },
    // 上传之前钩子
    beforeAvatarUpload(file) {
      console.log(file)
      if (file.name.length < 70) {
        // 图片上传之前的方法
        const isLt2M = file.size > 1024 * 1024
        if (isLt2M) {
          this.$message.error('上传图片大小不能超过1mb!')
          return false
        }
        this.QiniuData.data = file
        this.QiniuData.key = `${file.uid}`
      } else {
        this.$message.error('名称长度不能超过64个')
      }
    },
    // 上传成功的钩子
    uploadSuccess(response, file) {
      this.formData.icon = `${this.qiniuaddr}/${response.key}`
    },
    // 获取七牛token
    getQiniuToken() {
      this.$api.getQiniuToken.getQiniuToken().then(res => {
        this.qiniuaddr = res.cdnDomainName
        this.QiniuData.token = res.qiniuToken
      })
    },
    // 提交表单
    submit(saveType) {
      console.log(111)
      this.$refs.formRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        const params = JSON.parse(JSON.stringify(this.formData))
        console.log(params)
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].status !== '1') {
            return this.$notify({
              title: '业务提示',
              message: '已选择券模板中存在过期模板，不能进行保存或保存并发布操作',
              type: 'info'
            })
          }
        }
        let thanCurrentTime = []
        let isOption = true
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].timeRule === '1') {
            if (new Date(params.couponTemplateList[i].endTime).getTime() < new Date(params.endTime).getTime()) {
              thanCurrentTime.push(params.couponTemplateList[i].name)
            }
          }
        }
        if (thanCurrentTime.length > 0) {
          thanCurrentTime = thanCurrentTime.toString()
        } else {
          thanCurrentTime = ''
        }
        if (thanCurrentTime) {
          var confirmResult = await this.$confirm(`存在券模板,'${thanCurrentTime},'的失效期比券活动结束时间早，是否继续`, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          // 如果用户确认，则返回字符串 confirm
          // 如果用户取消了,则返回字符串 cancel
          if (confirmResult !== 'confirm') {
            isOption = false
            return this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optCancel'),
              type: 'info'
            })
          } else {
            isOption = true
          }
        }
        params.couponTemplateList = params.couponTemplateList.map(item => ({ couponTemplateId: item.id, quantity: item.quantity }))
        params.activeObject = params.activeObject.join(',')
        params.save = saveType
        console.log(params)
        if (this.isAdd && isOption) {
          // 新增逻辑
          const res = await this.$api.postPayMemberApi.addPayMember(params)
          if (res.code === '200000') {
            this.getList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
          }
        }
        if (!this.isAdd && isOption) {
          // 编辑逻辑
          const res = await this.$api.putPayMemberApi.editPayMember(this.payMemberId, params)
          if (res.code === '200000') {
            this.getList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.dialogVisible = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .el-upload-list--picture .el-upload-list__item {
  display: none !important;
}
.df {
  display: flex;
}
.dialog-title-head {
  height: 28px;
  font-size: 20px;
  font-family: Microsoft YaHei;
  font-weight: 400;
  color: #333333;
  margin-bottom: 20px;
}
.text-tip {
  margin-left: 20px;
  color: blue;
}
.choose-coupon-btn {
  margin-bottom: 20px;
}
.bottom-opt-btn-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.width240 {
  width: 240px;
}
.upload-img-container {
  .img-upload {
    width: 80px;
    height: 80px;
    img {
      width: 100%;
      height: 100%;
    }
  }
}
.img-btns {
  height: 20px;
  width: 100%;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  span {
    margin-left: 8px;
    line-height: 30px;
    // margin-right: 10px;
    cursor: pointer;
  }
  .priview-btn {
    color: #3f78f6;
  }
  .delete-btn {
    color: red;
  }
}
.previewImgwrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .previewImg {
    width: 80%;
    height: 80%;
  }
}
.textarea-item {
  :deep(.el-textarea__inner) {
    white-space: pre-wrap;
  }
}
</style>

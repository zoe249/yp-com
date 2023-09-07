<template>
  <div>
    <el-dialog
      :lock-scroll="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="isAdd ? '新增' : '查看详情'"
      :visible="dialogVisible"
      width="80%"
      top="50px"
      v-dialogDrag
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>

      <el-form label-width="140px" label-position="right" :rules="formRules" :model="formData" ref="formRef">
        <div class="dialog-title-head">单据信息</div>
        <div class="df">
          <el-form-item label="单据号:" prop="number">
            <el-input v-model="formData.number" disabled class="width240"></el-input>
            <!-- <div class="width240">{{ formData.number }}</div> -->
          </el-form-item>
          <el-form-item label="状态:" prop="status">
            <!-- <el-input v-model="formData.status" disabled class="width240"></el-input> -->
            <el-input class="width240" disabled v-if="formData.status === '01'" value="01-未生效" />
            <el-input class="width240" disabled v-else-if="formData.status === '02'" value="02-已生效" />
            <el-input class="width240" disabled v-else></el-input>
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="面值总额:" prop="faceValueTotal">
            <el-input class="width240" disabled :value="compFaceValueTotal.toFixed(2)"></el-input>
            <!-- <div class="width240">{{ compFaceValueTotal.toFixed(2) }}</div> -->
          </el-form-item>
          <el-form-item label="赠送金额:" prop="givenAmount">
            <el-input class="width240" disabled :value="compGivenAmount.toFixed(2)"></el-input>
            <!-- <div class="width240">{{ compGivenAmount.toFixed(2) }}</div> -->
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="售卡方式:" prop="sellMethod">
            <el-select v-model="formData.sellMethod" placeholder="请选择" :disabled="customDisabled">
              <el-option v-for="item in sellMethodOptions" :key="item.code" :label="`${item.code}-${item.name}`" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="收款方式:" prop="receiptMethod">
            <el-select v-model="formData.receiptMethod" placeholder="请选择" :disabled="customDisabled">
              <el-option v-for="item in receiptMethodOptions" :key="item.code" :label="`${item.code}-${item.name}`" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="实收金额:" prop="realAmount">
            <el-input type="number" class="width240" :disabled="customDisabled" v-model="formData.realAmount" @input="handleRealAmount(formData.realAmount)"></el-input>
          </el-form-item>
          <el-form-item label="客户名称:" prop="customerName">
            <el-input class="width240" :disabled="customDisabled" v-model="formData.customerName"></el-input>
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="证件类型:" prop="certificateType">
            <el-select v-model="formData.certificateType" placeholder="请选择" :disabled="customDisabled">
              <el-option v-for="item in certificateTypeOptions" :key="item.code" :label="item.name" :value="item.code"> </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="证件号码:" prop="idCard">
            <el-input class="width240" :disabled="customDisabled" v-model="formData.idCard"></el-input>
          </el-form-item>
        </div>
        <div class="df">
          <el-form-item label="联系人:" prop="linkman">
            <el-input class="width240" :disabled="customDisabled" v-model="formData.linkman"></el-input>
          </el-form-item>
          <el-form-item label="联系电话:" prop="phone">
            <el-input class="width240" :disabled="customDisabled" v-model="formData.phone"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="备注:" prop="description">
          <el-input class="width240" :disabled="customDisabled" v-model="formData.description"></el-input>
        </el-form-item>
      </el-form>

      <!-- 方案1 -->
      <div class="plan" v-if="this.formData.sellMethod === '1'">
        <div class="dialog-title-head">选择礼品卡方案</div>
        <el-button class="add-btn" size="mini" type="primary" :disabled="customDisabled" @click="handleSelectPlan">{{ '选择方案' }}</el-button>
        <!-- 方案列表 -->
        <el-table key="table1" :data="tableData" height="300" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
          <el-table-column label="方案编号" prop="number"></el-table-column>
          <el-table-column label="商品名称" prop="productName"></el-table-column>
          <el-table-column label="面值" prop="faceValue"></el-table-column>
          <el-table-column label="是否上架" prop="published">
            <template slot-scope="scope">
              <el-switch disabled v-model="scope.row.published" />
            </template>
          </el-table-column>
          <el-table-column label="卡类型" prop="cardType">
            <template slot-scope="scope">
              <span>{{ scope.row.cardType + '-' + scope.row.cardTypeDescr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="说明" show-overflow-tooltip prop="description"></el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <span>{{ scope.row.status + '-' + scope.row.statusDescr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发售数量" prop="quantity">
            <template slot-scope="scope">
              <div class="edit-column">
                <el-input v-model="scope.row.quantity" :disabled="customDisabled" @input="handleTableInput(scope.row, scope.$index)" />
              </div>
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="120" align="center">
            <template slot-scope="scope">
              <el-button :disabled="customDisabled" type="text" icon="el-icon-delete" @click="handleDelete(scope.$index, tableData)"></el-button>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 方案2 -->
      <div class="plan" v-else>
        <div class="dialog-title-head">导入会员及方案</div>
        <div class="file-wrap">
          <div class="file-btn">
            <div class="file-btn-download">
              <el-button class="iconfont icon-xiazaimoban" size="mini" type="primary" @click="handleDownLoad"> 下载模板</el-button>
            </div>
            <div class="file-btn-upload">
              <fileUpload ref="fileUploadBtnRef" :uploadFileUrl="uploadFileUrl" showTip :fileType="fileType" :disabled="upLoadBtn" @success="successUploadBtn">
                <el-button class="iconfont icon-yunshangchuan" size="mini" :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }">
                  文件上传
                </el-button>
              </fileUpload>
            </div>
          </div>
          <div class="file-drag">
            <fileUpload ref="fileUploadDragRef" :uploadFileUrl="uploadFileUrl" drag :fileType="fileType" :disabled="upLoadDrag" @success="successUploadDrag">
              <i class="el-icon-upload"></i>
              <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            </fileUpload>
          </div>
        </div>

        <div class="table-preview-head">
          <div class="title">表格预览</div>
          <el-button
            :disabled="customDisabled"
            size="mini"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="clearPreviewTable"
          >
            清空明细
          </el-button>
        </div>
        <!-- 表格预览 一个页面使用两个table会出现样式错乱的问题 解决：添加不同的key属性 -->
        <el-table key="table2" :data="previewTable" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
          <el-table-column label="会员手机号" prop="phone"></el-table-column>
          <el-table-column label="会员卡号" prop="cardNumber"></el-table-column>
          <el-table-column label="真实姓名" prop="realName"></el-table-column>
          <el-table-column label="礼品卡方案编号" prop="number"> </el-table-column>
          <el-table-column label="面值" prop="faceValue"></el-table-column>
          <el-table-column label="名称" prop="productName"></el-table-column>
          <el-table-column label="卡类型" prop="cardType">
            <template slot-scope="scope">
              <span>{{ scope.row.cardType + '-' + scope.row.cardTypeDescr }}</span>
            </template>
          </el-table-column>
          <el-table-column label="发售数量" prop="quantity"></el-table-column>
        </el-table>
      </div>

      <!-- 提交按钮 -->
      <template slot="footer">
        <div class="footer-btn">
          <el-button size="mini" :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }" @click="handleCancelSave">取 消</el-button>
          <el-button size="mini" :disabled="customDisabled" type="primary" @click="handleSave">保 存</el-button>
        </div>
      </template>
    </el-dialog>

    <schemesTable :schemesVisible="schemesVisible" @closeDialog="closeScheme" @confirm="handleConfirm" />
  </div>
</template>
<script>
import schemesTable from './schemesTable.vue'
import fileUpload from './fileUpload.vue'
import { Message } from 'element-ui'
export default {
  components: { schemesTable, fileUpload },
  props: {
    dialogVisible: {
      type: Boolean,
      default: false
    },
    isAdd: {
      type: Boolean,
      default: false
    },
    isEdit: {
      type: Boolean,
      default: false
    }
  },
  data() {
    // 校验联系电话
    const validatePhone = (rule, value, callback) => {
      const mobileReg = /^(([1][3,4,5,7,8,9]\d{9})|([0]\d{10,11})|(\d{7,8})|(\d{4}|\d{3})-(\d{7,8}))$/
      const phoneReg = /^\d{3}-\d{8}|\d{4}-\d{7}$/
      if (value === '') return callback() // 可以为空
      if (mobileReg.test(value) || phoneReg.test(value)) {
        callback()
      } else {
        callback(new Error('请输入正确的电话号码'))
      }
    }

    // 校验证件
    const validateIdCard = (rule, value, callback) => {
      const ID_CARD_REG = /^(([1][1-5])|([2][1-3])|([3][1-7])|([4][1-6])|([5][0-4])|([6][1-5])|([7][1])|([8][1-2]))\d{4}(([1][9]\d{2})|([2]\d{3}))(([0][1-9])|([1][0-2]))(([0][1-9])|([1-2][0-9])|([3][0-1]))\d{3}[0-9xX]$/

      if (this.formData.certificateType === '01') {
        if (value === '') return callback()
        if (!ID_CARD_REG.test(value)) {
          callback(new Error('请输入正确的身份证号码'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      value: '',
      formData: {
        number: '', // 单据号
        status: '', // 状态
        faceValueTotal: '', // 面值总额
        givenAmount: '', // 赠送金额
        sellMethod: '1', // 售卡方式
        receiptMethod: '', // 收款方式
        realAmount: '', // 实收金额
        customerName: '', // 客户名称
        certificateType: '', // 证件类型
        idCard: '', // 证件号码
        linkman: '', // 联系人
        phone: '', // 联系电话
        description: '', // 备注
        id: '' // 修改用
      },
      sellMethodOptions: [], // 售卡方式下拉
      receiptMethodOptions: [], // 收款方式下拉
      certificateTypeOptions: [], // 证件类型下拉

      formRules: {
        sellMethod: [{ required: true, message: '请选择售卡方式', trigger: 'change' }],
        receiptMethod: [{ required: true, message: '请选择收款方式', trigger: 'change' }],
        realAmount: [{ required: true, message: '请输入实收金额', trigger: 'blur' }],
        phone: [{ validator: validatePhone, trigger: 'blur' }],
        idCard: [{ validator: validateIdCard, trigger: 'blur' }]
      },
      schemesVisible: false, // 是否显示会员方案弹窗

      uploadFileUrl: this.$api.postGiftCardSellApi.uploadFileUrl(), // 上传文件的地址

      tableData: [], // 方案1 会员方案表格
      fileType: ['xls', 'xlsx'],
      previewTable: [], // 上传预览的表

      upLoadDrag: false,
      upLoadBtn: false
    }
  },
  computed: {
    customDisabled() {
      if (this.isAdd || this.isEdit) return false
      return true
    },
    // 面值总额
    compFaceValueTotal() {
      let tmp = 0
      if (this.formData.sellMethod === '1') {
        tmp = this.tableData.reduce((prev, current) => {
          return prev + Number(current.faceValue) * Number(current.quantity)
        }, 0)
      } else if (this.formData.sellMethod === '2') {
        tmp = this.previewTable.reduce((prev, current) => {
          return prev + Number(current.faceValue) * Number(current.quantity)
        }, 0)
      }
      return tmp
    },
    // 计算赠送金额
    compGivenAmount() {
      return Number(this.compFaceValueTotal) - Number(this.formData.realAmount)
    }
  },
  methods: {
    /**
     * 根据id查询礼品卡发售单详情
     * @param {string} id
     */
    getGiftCardSellById(id) {
      this.$api.getGiftCardSellApi.getGiftCardSellById(id).then(res => {
        Object.keys(this.formData).forEach((key, index) => {
          this.formData[key] = res.data[key]
        })
        // 判断发售卡类型
        if (this.formData.sellMethod === '1') {
          this.tableData = res.data.giftCardSellSchemeDetails
        } else if (this.formData.sellMethod === '2') {
          this.previewTable = res.data.giftCardSellMemberDetails
        }
      })
    },
    // 响应式更新表格内容
    handleTableInput(row, index) {
      this.$set(this.tableData, index, row)
    },
    // 实收金额
    handleRealAmount(value) {
      // console.log(value)
      if (!this.formData.faceValueTotal) return
      this.formData.givenAmount = Number(this.formData.faceValueTotal) - Number(value)
    },
    // 删除单个礼品卡方案
    handleDelete(index, rows) {
      rows.splice(index, 1)
    },
    // 关闭弹窗
    closeDialog() {
      // console.log('关闭')
      this.$emit('closeDialog')
    },

    // 选择方案
    handleSelectPlan() {
      this.schemesVisible = true
    },
    // 关闭方案弹窗
    closeScheme() {
      this.schemesVisible = false
    },
    // 确认选择方案
    handleConfirm(data) {
      this.schemesVisible = false
      const tempData = data.map(item => {
        item.quantity = 1
        return item
      })

      this.tableData = [...tempData, ...this.tableData]
      const tempObj = {}
      this.tableData = this.tableData.reduce((prev, cur) => {
        if (!tempObj[cur.giftCardSchemeId]) {
          tempObj[cur.giftCardSchemeId] = true
          prev.push(cur)
        }
        return prev
      }, [])
    },

    // 查询数据字典
    async getDataDic() {
      // 10028 售卡方式
      this.sellMethodOptions = await this.$api.getDataDicApi.getDataDicItemListByddCode({ ddCode: '10028', status: false })
      // 10029 收款方式
      this.receiptMethodOptions = await this.$api.getDataDicApi.getDataDicItemListByddCode({ ddCode: '10029', status: false })
      // 10005 证件类型
      this.certificateTypeOptions = await this.$api.getDataDicApi.getDataDicItemListByddCode({ ddCode: '10005', status: false })
    },

    // 下载模板
    handleDownLoad() {
      this.$api.getGiftCardSellApi.giftCardSellsDownload().then(res => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) // 构造一个blob对象来处理数据，并设置文件类型
        const href = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = '会员模板'
        a.click()
        URL.revokeObjectURL(a.href)
      })
    },

    // 文件上传
    handleUpLoad() {
      this.$refs.elUploadRef.submit()
    },
    // 按钮上传成功
    successUploadBtn(data, file) {
      this.successUpload(data)
      this.upLoadDrag = true
    },
    // 拖拽上传成功
    successUploadDrag(data, file) {
      this.successUpload(data)
      this.upLoadBtn = true
    },
    // 上传成功
    successUpload(data) {
      this.previewTable = [...data, ...this.previewTable]
    },
    // 清空预览
    clearPreviewTable() {
      this.previewTable = []
      this.$refs.fileUploadDragRef.clearFiles()
      this.$refs.fileUploadBtnRef.clearFiles()
      this.upLoadDrag = false
      this.upLoadBtn = false
    },

    // 取消保存
    handleCancelSave() {
      this.$emit('closeDialog')
    },
    // 保存
    handleSave() {
      const params = {}
      const id = this.formData.id
      Object.keys(this.formData).forEach((key, index) => {
        if (index >= 4) params[key] = this.formData[key]
      })
      if (params.sellMethod === '1') {
        params.giftCardSellMemberDetailsFlag = false
        params.giftCardSellSchemeDetailsFlag = true
        params.giftCardSellMemberDetails = []
        params.giftCardSellSchemeDetails = this.tableData.map(item => {
          const tmpObj = {}
          tmpObj.giftCardSchemeId = item.giftCardSchemeId
          tmpObj.quantity = item.quantity
          return tmpObj
        })
        console.log(params)
      } else if (params.sellMethod === '2') {
        params.giftCardSellMemberDetailsFlag = true
        params.giftCardSellSchemeDetailsFlag = false
        params.giftCardSellSchemeDetails = []
        params.giftCardSellMemberDetails = this.previewTable.map(item => {
          const tmpObj = {}
          tmpObj.giftCardSchemeId = item.giftCardSchemeId
          tmpObj.quantity = item.quantity
          tmpObj.memberId = item.memberId
          return tmpObj
        })
      }
      this.$refs.formRef.validate(valid => {
        if (valid) {
          if (this.isAdd) {
            this.$api.postGiftCardSellApi
              .giftCardSellsAdd(params)
              .then(res => {
                if (res.code === '200000') {
                  Message.success('新增成功')
                  setTimeout(() => this.$emit('closeDialog'), 1500)
                } else {
                  Message.error(res.detail)
                }
              })
              .catch(err => {
                Message.error(err.detail)
              })
          } else if (this.isEdit) {
            this.$api.putGiftCardSellApi
              .giftCardSellsUpdate(id, params)
              .then(res => {
                if (res.code === '200000') {
                  Message.success('修改成功')
                  setTimeout(() => this.$emit('closeDialog'), 1500)
                } else {
                  Message.error(res.detail)
                }
              })
              .catch(err => {
                Message.error(err.detail)
              })
          }
        }
      })
    }
  },
  created() {
    this.getDataDic()
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

.width240 {
  width: 240px;
}

::v-deep.el-select {
  .el-input {
    width: 240px;
  }
}

.plan {
  width: 100%;
}
.file-wrap {
  padding: 0 40px;
  display: flex;
  align-items: center;
}
.file-btn-upload {
  margin-top: 10px;
}

::v-deep.file-drag {
  margin-left: 65px;
  .el-upload-dragger {
    width: 676px;
    height: 187px;
  }
}

.table-preview-head {
  width: 100%;
  display: flex;
  justify-content: space-between;
  // margin: 20px 0;
  .title {
    font-size: 18px;
    font-family: Microsoft YaHei;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }
  .el-button {
    width: 104px;
    height: 32px;
  }
}
::v-deep.footer-btn {
  .el-button {
    width: 88px;
  }
}

::v-deep.edit-column {
  .el-input {
    input {
      width: 100px;
      height: 30px;
    }
  }
}
</style>

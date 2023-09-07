<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="showAddDialog">{{ '+ 新增' }}</el-button>
    <el-table :data="tableList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column width="70px" type="index" align="center" label="序号"></el-table-column>
      <el-table-column label="协议用途" prop="name"></el-table-column>
      <el-table-column label="协议内容" prop="details" width="480px">
        <template slot-scope="scope">
          <div v-html="scope.row.details"></div>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="note"></el-table-column>
      <el-table-column label="创建时间" prop="createTime"></el-table-column>
      <el-table-column label="修改时间" prop="updateTime"></el-table-column>
      <el-table-column label="操作" width="240" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showDetail(scope.row)">查看详情</el-button>
        </template>
      </el-table-column>
    </el-table>
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchData.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchData.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="tableTotals"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 新增或编辑弹出框 start -->
    <el-dialog :lock-scroll="false" :close-on-click-modal="false" :append-to-body="true" :title="isAdd ? '新增' : '查看详情'" :visible.sync="addDialog" width="700px" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>
      <el-form :model="formData" class="form" :rules="formDataRules" ref="formRef" label-width="140px" label-position="right">
        <el-form-item label="名称:" prop="name">
          <el-input v-model="formData.name" class="width480"></el-input>
        </el-form-item>
        <el-form-item label="备注:" prop="note">
          <el-input v-model="formData.note" class="width480"></el-input>
        </el-form-item>
        <el-form-item label="协议内容:" prop="details">
          <el-input v-model="formData.details" type="textarea" :rows="8" class="width480"></el-input>
        </el-form-item>
      </el-form>
      <div class="bottom-opt-btn-wrap">
        <el-button @click="addDialog = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="submit">{{ $t('lang.preserve') }}</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
export default {
  data() {
    // 检测名称唯一性校验
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getAgreementApi.validName(this.agreementId, value).then(res => {
          if (!res.data) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    return {
      height: null,
      addDialog: false,
      agreementId: null,
      tableList: [],
      searchData: {
        pageIndex: 1,
        pageSize: 20
      },
      tableTotals: 0,
      isAdd: true,
      formData: {
        name: '',
        note: '',
        details: ''
      },
      formDataRules: {
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
        details: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    showAddDialog() {
      this.isAdd = true
      this.addDialog = true
    },
    showDetail(item) {
      this.isAdd = false
      this.agreementId = item.id
      this.getDetailById(item.id)
    },
    async getDetailById(id) {
      const res = await this.$api.getAgreementApi.getDetailById(id)
      const data = res.data
      this.formData = data
      this.addDialog = true
    },
    // 获取列表
    getList() {
      this.$api.getAgreementApi.getList(this.searchData).then(res => {
        this.tableList = res.data
        this.tableTotals = res.total
      })
    },
    handleSizeChange(newPageSize) {
      this.searchData.pageSize = newPageSize
      this.getList()
    },
    handleCurrentChange(newPage) {
      this.searchData.pageIndex = newPage
      this.getList()
    },
    closeDialog() {
      this.isAdd = true
      this.agreementId = null
      this.formData = {
        name: '',
        note: '',
        detail: ''
      }
      this.$refs.formRef.resetFields()
    },
    submit() {
      console.log(this.formData)
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        const params = JSON.parse(JSON.stringify(this.formData))
        if (this.isAdd) {
          console.log(params)
          const res = await this.$api.postAgreementApi.addAgreement(params)
          if (res.code === '200000') {
            this.getList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.addDialog = false
          }
        } else {
          const res = await this.$api.putAgreementApi.editAgreement(this.agreementId, params)
          if (res.code === '200000') {
            this.getList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.addDialog = false
          }
        }
      })
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getList()
  }
}
</script>
<style lang="scss" scoped>
.bottom-opt-btn-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.width480 {
  width: 480px;
}
.form {
  :deep(.el-textarea__inner) {
    white-space: pre-wrap;
  }
}
</style>

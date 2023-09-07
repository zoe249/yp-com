<template>
  <div>
    <el-button class="add-btn" v-permission="{ action: 'add', effect: 'disabled' }" size="mini" type="primary" @click="addCouponTemplate">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchFormLabel" :formData="searchData"><div slot="rangeSeparator" style="margin:0 10px;">-</div></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchGiftCardList"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchGiftCardList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>

    <!-- 表格 -->
    <el-table :data="tableList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column width="50" type="index" align="center" label="序号"></el-table-column>
      <el-table-column label="单据号" prop="number"></el-table-column>
      <el-table-column label="状态" width="120" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status === '01' ? '01-未生效' : '02-已生效' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="售卡方式" width="120" prop="sellMethod">
        <template slot-scope="scope">
          <span>{{ scope.row.sellMethod + '-' + scope.row.sellMethodDescr }}</span>
        </template>
      </el-table-column>
      <el-table-column label="面值总额" prop="faceValueTotal"></el-table-column>
      <el-table-column label="实收金额" prop="realAmount"></el-table-column>
      <el-table-column label="赠送金额" prop="givenAmount"></el-table-column>
      <el-table-column label="收款方式" width="120" prop="receiptMethod">
        <template slot-scope="scope">
          <span>{{ scope.row.receiptMethod + '-' + scope.row.receiptMethodDescr }} </span>
        </template>
      </el-table-column>
      <el-table-column label="备注" prop="description"></el-table-column>
      <el-table-column label="客户名称" prop="customerName"></el-table-column>
      <el-table-column label="证件类型" prop="certificateTypeDescr"></el-table-column>
      <el-table-column label="证件号码" prop="idCard"></el-table-column>
      <el-table-column label="联系人" prop="linkman"></el-table-column>
      <el-table-column label="联系电话" prop="phone"></el-table-column>
      <!-- <el-table-column label="创建者" prop="createBy">
        <template slot-scope="scope">
          <span>{{ scope.row.createBy + '-' + scope.row.createByDescr }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建者" prop="createByDescr"></el-table-column>

      <el-table-column label="创建时间" width="160" prop="createTime"></el-table-column>

      <el-table-column label="操作" width="180" align="center">
        <template slot-scope="scope">
          <div v-if="scope.row.status === '01'">
            <el-button v-permission="{ action: 'viewDetails', effect: 'disabled' }" type="text" @click="handleEdit(scope.row)">查看详情</el-button>
            <el-button v-permission="{ action: 'release', effect: 'disabled' }" type="text" @click="keepAndTakeEffect(scope.row)">生效</el-button>
          </div>
          <div v-if="scope.row.status === '02'">
            <el-button type="text" @click="showDeatail(scope.row)">查看详情</el-button>
            <el-button v-permission="{ action: 'export', effect: 'disabled' }" v-if="scope.row.sellMethod === '1'" type="text" @click="handleExport(scope.row)">导出秘钥</el-button>
          </div>
          <div v-if="scope.row.status === '03'">
            <el-button type="text" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showDeatail(scope.row)">查看详情</el-button>
          </div>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
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

    <edit v-if="dialogVisible" ref="editRef" :dialogVisible="dialogVisible" :isAdd="isAdd" :isEdit="isEdit" @closeDialog="closeDialog" />
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import edit from './components/edit.vue'
export default {
  components: { YpSearchForm, edit },
  data() {
    return {
      searchData: {
        number: '',
        status: '',
        sellMethod: '',
        pageIndex: 1,
        pageSize: 20
      },
      sellMethodOptions: [],

      tableTotals: 0,

      tableList: [],
      height: null,

      dialogVisible: false,
      isAdd: false,
      isEdit: false
    }
  },
  computed: {
    searchFormLabel() {
      return [
        {
          label: '单据号:',
          type: 'input',
          prop: 'number'
        },
        {
          label: '状态:',
          type: 'select',
          prop: 'status',
          placeholder: '请输入方案名或编码',
          options: [
            { value: '01', label: '未生效' },
            { value: '02', label: '已生效' }
          ]
        },
        {
          label: '售卡方式:',
          type: 'select',
          prop: 'sellMethod',
          options: this.sellMethodOptions
        }
      ]
    }
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    // 查询数据字典
    async getDataDic() {
      // 10028 售卡方式
      const sellMethodOptions = await this.$api.getDataDicApi.getDataDicItemListByddCode({ ddCode: '10028', status: false })
      this.sellMethodOptions = sellMethodOptions.map(item => {
        item.value = item.code
        item.label = item.name
        return item
      })
    },

    // 新增
    addCouponTemplate() {
      this.dialogVisible = true
      this.isAdd = true
      this.isEdit = false
    },
    // 关闭弹窗
    closeDialog() {
      this.dialogVisible = false
      this.getGiftCardSells()
    },
    // 重置
    resetSearchGiftCardList() {
      this.searchData = {
        number: '',
        status: '',
        sellMethod: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getGiftCardSells()
    },
    // 搜索
    searchGiftCardList() {
      this.searchData.pageIndex = 1
      this.searchData.pageSize = 20
      this.getGiftCardSells()
    },

    // 修改页容量
    handleSizeChange(value) {
      this.searchData.pageSize = value
      this.getGiftCardSells()
    },
    // 修改页码
    handleCurrentChange(value) {
      this.searchData.pageIndex = value
      this.getGiftCardSells()
    },
    // 分页查询礼品卡发售单
    getGiftCardSells() {
      this.$api.getGiftCardSellApi.getGiftCardSells({ ...this.searchData }).then(res => {
        this.tableList = res.data
        this.tableTotals = res.total
      })
    },
    // 修改/查看
    handleEdit(row) {
      this.dialogVisible = true
      this.$nextTick(() => this.$refs.editRef.getGiftCardSellById(row.id))
      this.isEdit = true
      this.isAdd = false
    },
    // 生效
    keepAndTakeEffect(row) {
      this.$api.putGiftCardSellApi.giftCardSellsRelease(row.id).then(res => {
        this.getGiftCardSells()
      })
    },
    // 查看
    showDeatail(row) {
      this.dialogVisible = true
      this.isEdit = false
      this.isAdd = false
      this.$nextTick(() => this.$refs.editRef.getGiftCardSellById(row.id))
    },
    // 导出
    handleExport(row) {
      this.$api.getGiftCardSellApi.giftCardSellsExport({ number: row.number }).then(res => {
        if (!res) return
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) // 构造一个blob对象来处理数据，并设置文件类型
        const href = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = '导出秘钥'
        a.click()
        URL.revokeObjectURL(a.href)
        // isSubmiting.value = false
      })
    }
  },
  created() {
    // 高度计算
    window.addEventListener('resize', this.getHeight)
    this.getHeight()

    // 查询数据字典
    this.getDataDic()
    // 分页查询礼品卡
    this.getGiftCardSells()
  }
}
</script>
<style lang="scss" scoped></style>

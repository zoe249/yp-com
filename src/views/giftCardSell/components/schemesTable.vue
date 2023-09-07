<template>
  <div>
    <!-- 选择礼品卡方案弹窗 -->
    <el-dialog :visible="schemesVisible" center @close="handleCancel">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">会员新增</div>
      </template>
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

      <!-- 方案列表 -->
      <el-table :data="giftCardSchemeTableData" height="300" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" @select="select" @select-all="selectAll">
        <el-table-column type="selection" width="55" fixed="left"> </el-table-column>
        <el-table-column label="方案编号" prop="number" width="180"></el-table-column>
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
        <el-table-column label="说明" show-overflow-tooltip prop="description" width="180"></el-table-column>
        <el-table-column label="状态" prop="status">
          <template slot-scope="scope">
            <span>{{ scope.row.status + '-' + scope.row.statusDescr }}</span>
          </template>
        </el-table-column>

        <!-- <el-table-column label="操作" width="120" align="center"> </el-table-column> -->
      </el-table>

      <span slot="footer" class="dialog-footer">
        <el-button size="mini" icon="el-icon-close" :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }" @click="handleCancel"
          >取 消</el-button
        >
        <el-button size="mini" icon="el-icon-check" type="primary" @click="handleConfirm">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: { YpSearchForm },
  props: {
    schemesVisible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      searchData: {
        number: '',
        productName: '',
        faceValue: ''
      },
      giftCardSchemeTableData: [], // 接口返回的方案
      selectScheme: [] // 已选方案
    }
  },
  computed: {
    searchFormLabel() {
      return [
        {
          label: '方案编号:',
          type: 'input',
          prop: 'number'
        },
        {
          label: '名称:',
          type: 'input',
          prop: 'productName'
        },
        {
          label: '面值:',
          type: 'input',
          prop: 'faceValue'
        }
      ]
    }
  },
  created() {
    this.giftCardSchemesAll()
  },
  methods: {
    // 重置
    resetSearchGiftCardList() {
      this.searchData = {
        number: '',
        productName: '',
        faceValue: ''
      }
      this.giftCardSchemesAll()
    },
    // 搜索
    searchGiftCardList() {
      this.giftCardSchemesAll()
    },
    // 查询礼品卡方案
    giftCardSchemesAll() {
      const params = { ...this.searchData }
      this.$api.getGiftCardSellApi.giftCardSchemesAll(params).then(res => {
        this.giftCardSchemeTableData = res.data
      })
    },
    // 选择
    select(e) {
      this.selectScheme = e
    },
    // 全选
    selectAll(e) {
      this.selectScheme = e
    },
    // 取消礼品卡选择
    handleCancel() {
      this.$emit('closeDialog')
    },
    // 确认礼品卡选择
    handleConfirm() {
      this.$emit('confirm', this.selectScheme)
    }
  }
}
</script>
<style lang="scss" scoped></style>

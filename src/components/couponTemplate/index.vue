<template>
  <el-dialog :lock-scroll="false" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag title="选择券" :visible.sync="couponTemplateDialogVisible" width="60%">
    <template slot="title">
      <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
        {{ '选择券' }}
      </div>
    </template>
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
    <el-table :data="itemList" stripe border max-height="300px" @selection-change="selRow" ref="tableRef" :row-key="getRowKeys" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column type="selection" min-width="55" align="center" :reserve-selection="true"></el-table-column>
      <el-table-column label="券模板编号" prop="code"></el-table-column>
      <el-table-column label="名称" prop="name"></el-table-column>
      <el-table-column label="类型" prop="type">
        <template slot-scope="scope">
          <div>{{ scope.row.type }}-{{ scope.row.typeName }}</div>
        </template>
      </el-table-column>
      <el-table-column label="面值" prop="denomination">
        <template slot-scope="scope">
          <div>{{ scope.row.denomination }}{{ scope.row.uom }}</div>
        </template>
      </el-table-column>
      <el-table-column label="有效期" prop="denomination" width="350">
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
      <el-table-column label="每笔限使用数" prop="limitedNumber" align="center"></el-table-column>
    </el-table>
    <!-- 表格内容 end -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="cancelSelectCouponTemplate">取 消</el-button>
      <el-button type="primary" @click="confirmSelectCouponTemplate">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
export default {
  components: {
    YpSearchForm
  },
  props: {
    couponTemplateList: {
      type: Array,
      default: () => []
    },
    couponTypeSearchList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      }, // 优惠券查询
      itemList: [],
      selectItemList: [], // 选择优惠券模板的中转数组
      couponTemplateDialogVisible: false
    }
  },
  methods: {
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
    getRowKeys(row) {
      return row.id
    },
    selRow(val) {
      this.selectItemList = []
      this.selectItemList = val
    },
    cancelSelectCouponTemplate() {
      this.$refs.tableRef.clearSelection()
      this.couponTemplateDialogVisible = false
    },
    confirmSelectCouponTemplate() {
      this.$emit('selectItem', this.selectItemList)
      this.couponTemplateDialogVisible = false
    },
    searchsearchCouponTemplateForm() {
      this.getCouponTemplateList()
    },
    getSelectCouponTemplateId(selectDataId) {
      let index = -1
      for (let i = 0; i < this.itemList.length; i++) {
        const item = this.itemList[i]
        if (item.id === selectDataId) {
          index = i
          continue
        }
      }
      return index
    },
    async getCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].quantity = 1
        }
      }
      this.itemList = res.data
      this.$nextTick(() => {
        this.$refs.tableRef.clearSelection()
        if (this.couponTemplateList.length > 0) {
          this.couponTemplateList.forEach(item => {
            const index = this.getSelectCouponTemplateId(item.id)
            if (index === -1) return
            this.$refs.tableRef.toggleRowSelection(this.itemList[index], true)
          })
        }
      })
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
        }
      ]
    }
  }
}
</script>

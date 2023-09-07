<!--
 * @Author: liupenghui
 * @Date: 2021-01-13 16:08:33
 * @LastEditTime: 2021-02-20 15:52:14
 * @LastEditors: Please set LastEditors
 * @Description: 礼品卡列表
 * @FilePath: \celesta-web-project\src\views\giftCardList\giftCardList.vue
-->
<template>
  <div>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchGiftCardListFormLabel" :formData="searchGiftCardListForm"></yp-search-form>
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
    <!-- 头部搜索表单 end -->

    <!-- 礼品卡列表表格内容 begin -->
    <yp-table :propArr="giftCardListListLabel" :listInfo="giftCardListList" :id="'index'" :height="height">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" v-if="scope.scope.memberId" @click="showEditGiftCardListDialog(scope.scope)">{{ $t('lang.viewmember') }}</el-button>
      </template>
    </yp-table>
    <!-- 礼品卡列表表格内容 end -->

    <!-- 查看会员详情弹出框 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" :title="$t('lang.viewDetails')" :visible.sync="dialogVisible" :lock-scroll="false" v-if="dialogVisible" :append-to-body="true" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.viewDetails') }}
        </div>
      </template>
      <member-details :id="currentMemberId"></member-details>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogVisible = false">{{ $t('lang.confirm') }}</el-button>
      </span>
    </el-dialog>
    <!-- 查看会员详情弹出框 end -->

    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchGiftCardListForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchGiftCardListForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
import memberDetails from '@/components/memberDetails/memberDetails.vue'
import { parseTime } from '@/filters/format.js'
export default {
  components: {
    YpSearchForm,
    YpTable,
    memberDetails
  },
  data() {
    return {
      currentMemberId: '', // 会员 Id
      // 礼品卡列表表头绑定数据
      searchGiftCardListForm: {
        cardNumber: '',
        schemeId: '',
        status: '',
        cardType: '',
        pageIndex: 1,
        pageSize: 20
      },

      cardTypeList: [], // 获取卡类型下拉表单数据
      giftCardSchemeList: [], // 获取礼品卡方案下拉数据表单

      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg', // 查看会员无头像时候，所默认的图片

      dialogVisible: false, // 对话框的显示与隐藏（用于礼品卡对话框）

      giftCardListList: [], // 表格数据（礼品卡列表）

      total: 1 // 分页的总条数
    }
  },
  computed: {
    // 礼品卡列表头部搜索表单数据
    searchGiftCardListFormLabel() {
      return [
        { label: this.$t('lang.cardnumber') + '：', type: 'input', prop: 'cardNumber' },
        {
          label: this.$t('lang.giftcardscheme') + '：',
          type: 'select',
          prop: 'schemeId',
          options: this.giftCardSchemeList
        },
        {
          label: this.$t('lang.status') + '：',
          type: 'select',
          prop: 'status',
          options: [
            { value: '0', label: this.$t('lang.notforsale') },
            { value: '1', label: this.$t('lang.sold') },
            { value: '2', label: this.$t('lang.bound') },
            { value: '3', label: this.$t('lang.giftinvalid') }
          ]
        },
        {
          label: this.$t('lang.tradetype') + '：',
          type: 'select',
          prop: 'cardType',
          options: this.cardTypeList
        }
      ]
    },
    // 礼品卡列表表格
    giftCardListListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: this.$t('lang.ordernumber'),
          type: 'index'
        },
        {
          label: this.$t('lang.giftcardscheme'),
          props: 'schemeNumber',
          width: '150'
        },
        {
          label: this.$t('lang.giftcardnumber'),
          props: 'cardNumber',
          width: '160'
        },
        {
          label: this.$t('lang.tradename'),
          props: 'productName'
        },
        {
          label: this.$t('lang.tradetype'),
          props: 'cardType',
          type: 'status',
          width: '180',
          render: row => {
            if (row.cardType === '1') {
              return this.$t('lang.electroniccard')
            } else if (row.cardType === '2') {
              return this.$t('lang.physicalcard')
            }
          }
        },
        {
          label: this.$t('lang.faceValue'),
          props: 'faceValue',
          type: 'right'
        },
        {
          label: this.$t('lang.balance'),
          props: 'balance',
          type: 'right'
        },
        {
          label: this.$t('lang.status'),
          props: 'status',
          type: 'status',
          render: row => {
            if (row.status === '0') {
              return this.$t('lang.notforsale')
            } else if (row.status === '1') {
              return this.$t('lang.sold')
            } else if (row.status === '2') {
              return this.$t('lang.bound')
            } else if (row.status === '3') {
              return this.$t('lang.giftinvalid')
            }
          }
        },
        {
          label: this.$t('lang.effectivestarttime'),
          props: 'beginTime',
          type: 'status',
          width: '200',
          render: row => {
            return row.beginTime ? parseTime(new Date(row.beginTime), '{y}-{m}-{d}') : ''
          }
        },
        {
          label: this.$t('lang.validendtime'),
          props: 'endTime',
          type: 'status',
          width: '200',
          render: row => {
            return row.endTime ? parseTime(new Date(row.endTime), '{y}-{m}-{d}') : ''
          }
        }
      ]
    }
  },
  created() {
    this.getGiftListList() // 从后端获取样式
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式
    this.getCardTypeList() // 获取卡类型下拉数据列表
    this.getGiftCardSchemeList() // 获取礼品卡方案下拉表单数据
  },
  methods: {
    // 样式
    getHeight() {
      this.height = window.innerHeight - 265 + 'px'
    },
    // 从后端获取礼品卡列表数据
    getGiftListList() {
      this.$api.getGiftListApi.getGiftListList(this.searchGiftCardListForm).then(res => {
        this.giftCardListList = res.data
        this.total = res.total
      })
    },
    // 礼品卡列表查看详情（编辑）事件
    showEditGiftCardListDialog(item) {
      this.currentMemberId = item.memberId
      this.dialogVisible = true
    },
    // 重置礼品卡列表数据表头事件
    resetSearchGiftCardList() {
      this.searchGiftCardListForm = {
        cardNumber: '',
        schemeId: '',
        status: '',
        cardType: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getGiftListList()
    },
    // 搜索礼品卡列表数据表头事件
    searchGiftCardList() {
      this.getGiftListList()
    },
    // 切换分页条数
    handleSizeChange(newPage) {
      this.searchGiftCardListForm.pageSize = newPage
      this.getGiftListList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchGiftCardListForm.pageIndex = newPage
      this.getGiftListList()
    },
    // 获取礼品卡方案下拉数据列表
    getGiftCardSchemeList() {
      this.giftCardSchemeList = []
      const obj = {}
      obj.info = ''
      obj.status = ''
      obj.published = true
      obj.cardType = ''
      obj.pageIndex = 1
      obj.pageSize = 999
      this.$api.getGiftCardSchemeApi.getGiftCardSchemeList(obj).then(res => {
        res.data.map(item => {
          this.giftCardSchemeList.push({ value: item.id, label: item.productName })
        })
      })
    },
    // 获取卡类型下拉数据列表
    getCardTypeList() {
      this.cardTypeList = []
      const obj = {}
      obj.ddCode = '10024'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.cardTypeList.push({ value: item.code, label: item.name })
        })
      })
    }
  }
}
</script>
<style scoped></style>

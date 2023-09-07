<!--
 * @Author: liupenghui
 * @Date: 2021-01-19 16:33:22
 * @LastEditTime: 2021-01-29 17:03:39
 * @LastEditors: Please set LastEditors
 * @Description: 广告管理
 * @FilePath: \celesta-web-project\src\views\slideShow\slideShow.vue
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" type="primary" size="mini" @click="showAddSlideShowDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 主表格内容 begin -->
    <yp-table :propArr="slideShowListLabel" :listInfo="slideShowList" @switchChange="switchChange">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditSlideShowDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <el-button type="text" icon="el-icon-delete" @click="deleteSlideShowDialog(scope.scope)">{{ $t('lang.delete') }}</el-button>
      </template>
    </yp-table>
    <!-- 主表格内容 end -->
    <!-- 编辑与添加对话框内容 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="50%" v-dialogDrag @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <div>
        <el-form :model="slideShowForm" ref="formRef" label-width="155px" label-position="right" :rules="slideShowRules">
          <div>
            <div v-for="(item, index) in slideShowFormLabel" :key="index">
              <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                <el-input
                  v-model.trim="slideShowForm[item.prop]"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled ? true : false"
                  :maxlength="item.maxLength ? item.maxLength : '32'"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'productCodeInput' && slideShowForm.publicityType === 1" :label="item.label" :prop="item.prop">
                <el-input
                  v-model.trim="slideShowForm[item.prop]"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled ? true : false"
                  :maxlength="item.maxLength ? item.maxLength : '32'"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'promotionNumberInput' && slideShowForm.publicityType === 2" :label="item.label" :prop="item.prop">
                <el-input
                  v-model.trim="slideShowForm[item.prop]"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled ? true : false"
                  :maxlength="item.maxLength ? item.maxLength : '32'"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'pageUrlInput' && slideShowForm.publicityType === 3" :label="item.label" :prop="item.prop">
                <el-input
                  v-model.trim="slideShowForm[item.prop]"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled ? true : false"
                  :maxlength="item.maxLength ? item.maxLength : '32'"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'inputShow' && giftCardSchemeIsAdd === false" :label="item.label" :prop="item.prop">
                <el-input
                  v-model.trim="slideShowForm[item.prop]"
                  :placeholder="item.placeholder"
                  clearable
                  :disabled="item.disabled ? true : false"
                  :maxlength="item.maxLength ? item.maxLength : '32'"
                ></el-input>
              </el-form-item>
              <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
                <el-select filterable v-model="slideShowForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
                  <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
              <el-form-item v-if="item.type === 'imgEject' && slideShowForm.site === '1'" :label="item.label" :prop="item.prop">
                <yp-single-upload :utype="utype" :url.sync="slideShowForm[item.prop]"></yp-single-upload>
              </el-form-item>
              <el-form-item v-if="item.type === 'imgCarousel' && slideShowForm.site === '2'" :label="item.label" :prop="item.prop">
                <yp-single-upload :utype="utype" :url.sync="slideShowForm[item.prop]"></yp-single-upload>
              </el-form-item>
              <el-form-item v-if="item.type === 'switch'" :label="item.label" :prop="item.prop">
                <el-switch @change="statusChanges(slideShowForm.disabled)" v-model="slideShowForm[item.prop]" :disabled="item.disabled ? true : false"></el-switch>
              </el-form-item>
              <el-form-item v-if="item.type === 'radio'" :label="item.label" :prop="item.prop">
                <el-radio v-for="selectItem in item.options" :key="selectItem.value" v-model="slideShowForm[item.prop]" :label="selectItem.value">{{ selectItem.label }}</el-radio>
              </el-form-item>
              <el-form-item v-if="item.type === 'radioSite'" :label="item.label" :prop="item.prop">
                <el-radio v-for="selectItem in item.options" :key="selectItem.value" v-model="slideShowForm[item.prop]" :label="selectItem.value" :disabled="disabled">{{ selectItem.label }}</el-radio>
              </el-form-item>
            </div>
          </div>
        </el-form>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 编辑与添加对话框内容 end -->
    <!-- 分页（礼品卡方案总分页） begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="slideShowSizeChange"
          @current-change="slideShowCurrentChange"
          :current-page="searchSlideShowForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchSlideShowForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="slideShowTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页（礼品卡方案总分页） end -->
  </div>
</template>
<script>
// 表格组件
import YpTable from '@/components/table/YpTable.vue'
// 上传图片组件
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
export default {
  components: {
    YpTable,
    YpSingleUpload
  },
  data() {
    // 检验排序号规则
    const checkdisplayOrder = (rule, value, cb) => {
      const regMobile = /^\+?[1-9]\d*$/
      if (regMobile.test(value)) {
        return cb()
      }
      cb(new Error(this.$t('lang.yjslideshowtrueorder')))
    }
    return {
      sitenum: 0, // 用于表格进行switch开关

      displayedBox: false, // 用于解决编辑时对话框中switch按钮回显问题

      slideShowTotal: 0, // 用于接收广告管理的数据的总条数

      editId: '', // 编辑所需要传的Id

      disabled: false, // 控制对话框中广告位置单选按钮是否进行禁止使用

      slideShowList: [], // 接受后端所传过来的广告管理数据

      dialogVisible: false, // 控制广告管理新增与编辑对话框是否显示

      isAdd: false, // 控制广告管理新增与编辑对话框表头显示内容

      // 广告管理对话框校验规则
      slideShowRules: {
        site: [{ required: true, trigger: 'blur' }], // 广告位置校验
        name: [{ required: true, message: this.$t('lang.yjslideshownamenonull'), trigger: 'blur' }], // 广告名称校验
        pictureURL: [{ required: true, message: this.$t('lang.yjslideshowupload'), trigger: 'blur' }], // 图片路径校验
        displayOrder: [
          // 排序号校验
          { required: true, message: this.$t('lang.yjslideshownonull'), trigger: 'blur' },
          { validator: checkdisplayOrder, trigger: 'blur' }
        ]
      },

      // 查询所需要传的数据
      searchSlideShowForm: {
        pageSize: 20,
        pageIndex: 1,
        site: '',
        displayed: ''
      },

      slideShowForm: {
        site: '1',
        name: '',
        pictureUrl: '',
        displayOrder: '',
        publicityType: 1,
        productCode: '',
        promotionNumber: '',
        pageUrl: '',
        displayed: true
      } // 对话框表单数据
    }
  },
  computed: {
    // 控制上传图片组件【一共给了两个，1 是控制首屏弹出页，2 是控制首页轮播页】
    utype() {
      if (this.slideShowForm.site === '1') {
        return 'homePoster'
      } else {
        return 'homeBanner'
      }
    },
    // 表格数据
    slideShowListLabel() {
      return [
        { label: this.$t('lang.operation'), type: 'operation' },
        { label: this.$t('lang.displayOrder'), props: 'displayOrder', width: '120' },
        {
          label: this.$t('lang.advertisinglocation'),
          props: 'site',
          type: 'status',
          render: row => {
            if (row.site === '1') {
              return this.$t('lang.firstscreenpopuppage')
            } else if (row.site === '2') {
              return this.$t('lang.homepagecarouselpage')
            }
          }
        },
        { label: this.$t('lang.advertisingname'), props: 'name' },
        { label: this.$t('lang.sketch'), props: 'pictureUrl', type: 'img' },
        {
          label: this.$t('lang.typesofpublicity'),
          props: 'publicityType',
          type: 'status',
          render: row => {
            if (row.publicityType === 1) {
              return this.$t('lang.commoditycategory')
            } else if (row.publicityType === 2) {
              return this.$t('lang.activities')
            } else if (row.publicityType === 3) {
              return this.$t('lang.other')
            }
          }
        },
        { label: this.$t('lang.display'), props: 'displayed', type: 'switch', method: 'switchChange' }
      ]
    },
    // 对话框数据
    slideShowFormLabel() {
      return [
        {
          type: 'radioSite',
          label: this.$t('lang.advertisinglocation') + '：',
          prop: 'site',
          options: [
            { value: '1', label: this.$t('lang.firstscreenpopuppage') + '：' },
            { value: '2', label: this.$t('lang.homepagecarouselpage') + '：' }
          ]
        },
        { type: 'input', label: this.$t('lang.advertisingname') + '：', prop: 'name' },
        { type: 'imgEject', label: this.$t('lang.pictureupload') + '：', prop: 'pictureUrl' },
        { type: 'imgCarousel', label: this.$t('lang.pictureupload') + '：', prop: 'pictureUrl' },
        { type: 'input', label: this.$t('lang.displaynumber') + '：', prop: 'displayOrder', placeholder: this.$t('lang.yjslideshowtip') },
        {
          type: 'radio',
          label: this.$t('lang.typesofpublicity') + '：',
          prop: 'publicityType',
          options: [
            { value: 1, label: this.$t('lang.commoditycategory') },
            { value: 2, label: this.$t('lang.activities') },
            { value: 3, label: this.$t('lang.other') }
          ]
        },
        { type: 'productCodeInput', label: this.$t('lang.commoditynumber') + '：', prop: 'productCode' },
        { type: 'promotionNumberInput', label: this.$t('lang.activitynumber') + '：', prop: 'promotionNumber' },
        { type: 'pageUrlInput', label: this.$t('lang.jumptopagelink') + '：', prop: 'pageUrl' },
        { type: 'switch', label: this.$t('lang.display'), prop: 'displayed' }
      ]
    }
  },
  created() {
    this.getSlideShowTableList() // 从后端获取数据
  },
  methods: {
    // 从后端获取表格数据
    getSlideShowTableList() {
      this.$api.getSlideShowApi.getSlideShowTableList(this.searchSlideShowForm).then(res => {
        this.slideShowList = res.data
        this.slideShowTotal = res.total
      })
    },
    // 新增广告对话框事件
    showAddSlideShowDialog() {
      this.sitenum = 0
      this.slideShowForm.displayed = false
      this.isAdd = true
      this.disabled = false
      this.dialogVisible = true
    },
    // 编辑广告对话框事件
    showEditSlideShowDialog(item) {
      this.slideShowForm.displayed = true
      this.siteArr = []
      this.slideShowList.forEach(item => {
        if (item.site === '1') {
          this.siteArr.push(item)
        }
      })
      this.displayedBox = item.displayed
      this.getSlideShowListById(item.id) // 根据 id 获取某一条广告管理的数据
      this.editId = item.id // 编辑时，所需要传的 Id
      this.isAdd = false
      this.disabled = true
      this.dialogVisible = true
    },
    // 根据 Id 获取某一条广告管理数据
    getSlideShowListById(id) {
      this.$api.getSlideShowApi.getSlideShowListById(id).then(res => {
        this.slideShowForm = res
      })
    },
    // 对话框最后确定按钮
    confirm() {
      this.$refs.formRef.validate(async valid => {
        if (!valid) return
        if (this.isAdd) {
          this.$api.postSlideShowApi.postSlideShowList(this.slideShowForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getSlideShowTableList()
              this.dialogVisible = false
            }
          })
        } else {
          this.$api.putSlideShowApi.putSlideShowList(this.editId, this.slideShowForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.getSlideShowTableList()
              this.dialogVisible = false
            }
          })
        }
      })
    },
    // switch开关事件（对话框开关事件）
    statusChanges() {
      if (this.isAdd === false) {
        const siteable = this.siteArr.every(v => !v.displayed)
        if (!siteable) {
          if (!this.displayedBox) {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.yjslideshowtips'),
              type: 'warning'
            })
            this.slideShowForm.displayed = false
          }
        }
      } else {
        if (this.slideShowForm.site === '1') {
          for (let i = 0; i < this.slideShowList.length; i++) {
            if (this.slideShowList[i].site === '1' && this.slideShowList[i].displayed === true) {
              this.sitenum = 0
              this.sitenum++
              if (this.sitenum < 2) {
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.yjslideshowtips'),
                  type: 'warning'
                })
                this.slideShowForm.displayed = !this.slideShowForm.displayed
                return
              }
            }
          }
        }
      }
    },
    // switch开关事件（表格开关事件）
    async switchChange(item) {
      if (item.site === '1') {
        const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.getSlideShowTableList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          if (item.displayed === true) {
            const obj = {}
            obj.site = '1'
            obj.displayed = item.displayed
            this.$api.getSlideShowApi.getSlideShowListChangeStatus(obj).then(res => {
              if (res.total < 1) {
                this.$api.putSlideShowApi.putSlideShowStatus(item.id, item).then(res => {
                  if (res.code === '200000') this.getSlideShowTableList()
                  this.$notify({
                    title: this.$t('lang.tip'),
                    message: this.$t('lang.optSuccess'),
                    type: 'success'
                  })
                })
              } else {
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.yjslideshowtips'),
                  type: 'warning'
                })
                item.displayed = !item.displayed
              }
            })
          } else {
            this.$api.putSlideShowApi.putSlideShowStatus(item.id, item).then(res => {
              if (res.code === '200000') this.getSlideShowTableList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            })
          }
        }
      } else {
        const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.getSlideShowTableList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          this.$api.putSlideShowApi.putSlideShowStatus(item.id, item).then(res => {
            if (res.code === '200000') this.getSlideShowTableList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          })
        }
      }
    },
    // 删除（删除某一条广告管理数据）
    async deleteSlideShowDialog(item) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getSlideShowTableList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.$api.deleteSlideShowApi.deleteSlideShowList(item.id).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
            this.getSlideShowTableList()
          }
        })
      }
    },
    // 切换分页条数事件
    slideShowSizeChange(newSize) {
      this.searchSlideShowForm.pageSize = newSize
      this.getSlideShowTableList()
    },
    // 切换分页页数事件
    slideShowCurrentChange(newPage) {
      this.searchSlideShowForm.pageIndex = newPage
      this.getSlideShowTableList()
    },
    // 对话框关闭事件
    closeDialog() {
      this.slideShowForm = {
        site: '1',
        name: '',
        pictureUrl: '',
        displayOrder: '',
        publicityType: 1,
        productCode: '',
        promotionNumber: '',
        pageUrl: '',
        displayed: true
      } // 对话框表单数据
      this.$refs.formRef.resetFields() // 清楚校验
    }
  }
}
</script>
<style lang="scss" scoped></style>

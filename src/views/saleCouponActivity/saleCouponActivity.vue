<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="addSaleCouponActivity">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchSaleCouponActivityFormLabel" :formData="searchSaleCouponActivityForm"
        ><div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchSaleCouponActivityForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchSaleCouponActivityFormbtn" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 券活动列表表格内容 start -->
    <el-table :data="saleCouponActivityList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="活动编号" prop="number"></el-table-column>
      <el-table-column label="活动名称" prop="name"></el-table-column>
      <el-table-column label="商品编码" prop="code"></el-table-column>
      <el-table-column label="商品图片" prop="productImg" align="center">
        <template slot-scope="scope">
          <div class="table-img">
            <img :src="scope.row.productImg" alt="" />
          </div>
        </template>
      </el-table-column>
      <el-table-column label="库存数量" prop="stockQuantity" align="right"></el-table-column>
      <el-table-column label="初始库存" prop="initialStockQuantity" align="right"></el-table-column>
      <el-table-column label="活动时间" prop="beginTime" width="200">
        <template slot-scope="scope">
          <div>{{ scope.row.beginTime ? scope.row.beginTime : '售券活动时间' }}-</div>
          <div>
            {{ scope.row.endTime }}
          </div>
        </template>
      </el-table-column>
      <el-table-column label="活动状态" prop="status" align="center">
        <template slot-scope="scope">
          {{ formatStatus(scope.row.status) }}
        </template>
      </el-table-column>
      <el-table-column label="操作" width="320" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="viewSaleCouponActivity(scope.row)">查看详情</el-button>
          <el-button type="text" @click="copySaleCouponActivity(scope.row)">复制活动</el-button>
          <el-button type="text" @click="adjustStock(scope.row)" v-show="scope.row.status !== '2'">调库存</el-button>
          <el-button type="text" @click="publishSaleCouponActivity(scope.row)" v-show="scope.row.status === '0' || scope.row.status === '3'">发布</el-button>
          <el-button type="text" @click="unPublishSaleCouponActivity(scope.row)" v-show="scope.row.status === '1'">撤销发布</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表格内容 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchSaleCouponActivityForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchSaleCouponActivityForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
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
      <el-form :model="saleCouponActivityForm" :rules="saleCouponActivityFormRule" ref="saleCouponActivityFormRef" label-width="140px" label-position="right">
        <div class="dialog-title-head">
          选择券模板
        </div>
        <el-form-item label="已选券模板:" prop="couponTemplateList">
          <el-button type="primary" class="choose-coupon-btn" :disabled="!isAdd && saleCouponActivityForm.status !== '0'" @click="handleSelectCouponTemplateTable">选择券</el-button>
          <span class="text-tip">可以选择多个券模板组合（只能选择有效的券模板）</span>
          <!-- 表格内容 start -->
          <el-table :data="saleCouponActivityForm.couponTemplateList" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266' }" max-height="300px">
            <!-- :height="saleCouponActivityForm.couponTemplateList.length > 0 ? 300 : 100" -->
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
                <el-form-item class="form-table-item" :prop="'couponTemplateList.' + scope.$index + '.quantity'" :rules="saleCouponActivityFormRule.quantity">
                  <el-input :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')" v-model.number="scope.row.quantity"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <div>
                  <el-button type="text" :disabled="!isAdd && saleCouponActivityForm.status !== '0'" @click="deleteSelectedCouponTempate(scope.row.id)">删除</el-button>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <div class="dialog-title-head">活动信息</div>
        <el-form-item label="活动名称:" prop="name">
          <el-input :disabled="!isAdd && saleCouponActivityForm.status !== '0'" v-model="saleCouponActivityForm.name" class="width240" clearable></el-input
          ><span class="text-tip">不允许重复，作为商品名称显示给客户</span>
        </el-form-item>
        <el-form-item label="商品编码:" prop="code">
          <el-input :disabled="!isAdd && saleCouponActivityForm.status !== '0'" clearable v-model="saleCouponActivityForm.code" class="width240"></el-input><span class="text-tip">只允许输入数字</span>
        </el-form-item>
        <div class="product-price-wrap">
          <el-form-item label="市场价:" prop="marketPrice">
            <el-input
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              clearable
              v-model="saleCouponActivityForm.marketPrice"
              class="width240"
            ></el-input
          ></el-form-item>
          <el-form-item label="销售价格:" prop="salePrice">
            <el-input
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              v-model="saleCouponActivityForm.salePrice"
              clearable
              class="width240"
            ></el-input
            ><span class="text-tip">销售价格必须小于市场价</span>
          </el-form-item>
        </div>
        <div class="product-price-wrap">
          <el-form-item label="初始库存:" prop="initialStockQuantity">
            <el-input :disabled="!isAdd && saleCouponActivityForm.status !== '0'" clearable v-model.number="saleCouponActivityForm.initialStockQuantity" class="width240"></el-input>
          </el-form-item>
          <el-form-item label="消耗积分:" prop="usePoint">
            <el-input
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              clearable
              v-model="saleCouponActivityForm.usePoint"
              class="width240"
            ></el-input
          ></el-form-item>
        </div>
        <el-form-item label="上架时间:" prop="published">
          <el-switch
            :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
            v-model="saleCouponActivityForm.published"
            @change="handleChangePublish"
          ></el-switch
          ><span> 立即上架 </span><span class="text-tip">打开表示活动发布后立刻上架</span>
          <div>
            <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              @change="handleChangeBeginTime"
              v-model="saleCouponActivityForm.beginTime"
              :disabled="isBeginTime || (!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3'))"
              :picker-options="startTime"
              type="datetime"
              placeholder="选择开始日期时间"
            >
            </el-date-picker>
            至
            <el-date-picker
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              @change="handleChangeEndTime"
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="saleCouponActivityForm.endTime"
              type="datetime"
              placeholder="选择结束日期时间"
              :picker-options="end"
            >
            </el-date-picker>
          </div>
        </el-form-item>
        <el-form-item label="活动对象:" prop="activeObject">
          <el-checkbox-group v-model="saleCouponActivityForm.activeObject" @change="handleChangeActiveObject">
            <el-checkbox
              label="all"
              :disabled="
                (saleCouponActivityForm.activeObject[0] !== 'all' && saleCouponActivityForm.activeObject.length > 0) ||
                  (!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3'))
              "
              >所有顾客</el-checkbox
            >
            <br />
            <el-checkbox
              :disabled="saleCouponActivityForm.activeObject[0] === 'all' || (!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3'))"
              v-for="(item, index) in memberLevelList"
              :key="index"
              :label="item.code"
              >{{ item.name }}</el-checkbox
            >
          </el-checkbox-group>
        </el-form-item>
        <div class="product-price-wrap">
          <el-form-item label="每人每日限购:" prop="limitCount">
            <el-input
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              v-model.number="saleCouponActivityForm.limitCount"
              class="width240"
            ></el-input
            ><span> 张</span></el-form-item
          >
          <el-form-item label="每人总限购:" prop="sumLimitCount">
            <el-input
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              v-model.number="saleCouponActivityForm.sumLimitCount"
              class="width240"
            ></el-input
            ><span> 张</span>
          </el-form-item>
        </div>
        <div class="product-price-wrap">
          <el-form-item label="是否允许退款:" prop="refund">
            <el-select class="width240" v-model="saleCouponActivityForm.refund" disabled>
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option> </el-select
          ></el-form-item>
          <el-form-item><el-checkbox v-model="saleCouponActivityForm.automaticRefund" disabled>支持过期自动退款</el-checkbox> <span class="text-tip">勾选后，券过期自动退款给用户</span></el-form-item>
        </div>
        <div class="product-price-wrap">
          <el-form-item label="是否参与积分:" prop="pointAdd">
            <el-select class="width240" v-model="saleCouponActivityForm.pointAdd" :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option> </el-select
          ></el-form-item>
          <el-form-item label="是否参与成长值:" prop="growthAdd">
            <el-select class="width240" v-model="saleCouponActivityForm.growthAdd" :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')">
              <el-option label="是" :value="true"></el-option>
              <el-option label="否" :value="false"></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="product-price-wrap">
          <el-form-item label="商品图片：" prop="imgList" class="changeImg" label-width="120px" ref="mianPictureRef">
            <el-input v-show="false" v-model="saleCouponActivityForm.imgList"></el-input>
            <div class="uploadContainer">
              <div class="upload-img-container">
                <div v-for="item in subPictures" :key="item.id" class="upload-wrapper">
                  <img :src="item.url" alt="" class="img-upload" />
                  <div class="btns">
                    <span v-show="item.mainPicture === true">商品主图</span>
                    <span @click="setMainPicture(item)" v-show="item.mainPicture === false">设为主图</span>
                    <i class="el-icon-delete" v-show="!item.mainPicture" @click="deleteSubPicture(item)"></i>
                    <i class="el-icon-delete" v-show="subPictures.length === 1" @click="deleteSubPicture(item)"></i>
                  </div>
                </div>
              </div>
              <el-upload
                :action="domain"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.JPG,.JPEG,.PBG,.GIF,.BMP,.PDFg"
                :data="QiniuData"
                :on-remove="handleRemove"
                :on-success="uploadSuccess"
                :before-upload="beforeAvatarUpload"
                multiple
                :on-exceed="handleExceed"
                :file-list="pictures"
                list-type="picture"
                :limit="isLimiteNum"
              >
                <el-button size="small" type="primary" :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')">上传图片</el-button>
                <div slot="tip">
                  <!-- <el-button size="small" type="primary" @click="selectAlbum">从图库选择</el-button> -->
                </div>
                <div slot="tip" class="el-upload__tip">
                  最多上传5张，格式为png、jpeg、jpg，单张小于500kb，建议750*750像素的白底正方形图片
                </div>
              </el-upload>
            </div>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="图文介绍：" prop="fullDescription" label-width="120px" ref="fullDescriptionRef">
            <div>
              <span class="goods-tip">可介绍商品亮点、特写图片等内容，便于顾客更好的了解商品。</span>
              <el-button type="primary" @click="showPictureExplain">图文详情上传说明</el-button>
            </div>
            <!-- 富文本编辑器组件 -->
            <yp-quill-editor
              :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')"
              :content.sync="saleCouponActivityForm.fullDescription"
            ></yp-quill-editor>
          </el-form-item>
        </div>
      </el-form>
      <div class="bottom-opt-btn-wrap">
        <el-button type="primary" @click="confirm(0)" :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')">保存</el-button>
        <el-button type="primary" @click="confirm(1)" :disabled="!isAdd && saleCouponActivityForm.status !== '0' && !(saleCouponActivityForm.status === '3')">保存并发布</el-button>
      </div>
    </el-dialog>
    <!-- 弹出框 end -->
    <!-- 单个转移图片弹出框 -->
    <el-dialog :lock-scroll="false" :append-to-body="true" v-dialogDrag title="移动端上传说明" :visible.sync="singleMoveDialogVisible" width="40%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '移动端上传说明' }}
        </div>
      </template>
      <h4>一、基本要求</h4>
      <p>1、手机详情总体大小：图片+文字，图片不超过20张，文字不超过5000字；</p>
      <p>建议：所有图片都是本宝贝相关的图片。</p>
      <h4>二、图片大小</h4>
      <p>1、建议使用宽度480 ~ 620像素、高度小于等于960像素的图片；</p>
      <p>2、格式为：JPG\JEPG\GIF\PNG； 举例：可以上传一张宽度为480，高度为960像素，格式为JPG的图片。</p>
      <h4>三、文字要求</h4>
      <p>1、每次插入文字不能超过500个字，标点、特殊字符按照一个字计算；</p>
      <p>2、请手动输入文字，不要复制粘贴网页上的文字，防止出现乱码；</p>
      <p>3、以下特殊字符“&lt;”、“>”、“"”、“'”、“\”会被替换为空。</p>
      <p>建议：不要添加太多的文字，这样看起来更清晰。</p>
    </el-dialog>
    <!-- 单个转移图片弹出框 -->
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
      <el-table
        :data="couponTemplateList"
        stripe
        border
        max-height="300px"
        @selection-change="selRow"
        ref="tableRef"
        :row-key="getRowKeys"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
      >
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
    <!-- 单个转移图片弹出框 -->
    <el-dialog :lock-scroll="false" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag title="调整库存" :visible.sync="stockDialogVisible" @close="closeDelayDialog" width="30%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '调整库存' }}
        </div>
      </template>
      <el-form :model="adjustStockForm" label-width="100px" :rules="adjustStockFormRule" ref="adjustStockFormRef">
        <el-form-item label="调整库存：" prop="type">
          <el-radio v-model.number="adjustStockForm.type" :label="1">增加库存</el-radio>
          <el-radio v-model.number="adjustStockForm.type" :label="2">减少库存</el-radio>
        </el-form-item>
        <el-form-item label="调整数量：" prop="number">
          <el-input class="width240" v-model.number="adjustStockForm.number"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="stockDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmAdjustStock">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 单个转移图片弹出框 -->
  </div>
</template>

<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpQuillEditor from '@/components/editor/YpQuillEditor'
export default {
  components: {
    YpSearchForm,
    YpQuillEditor
  },
  computed: {
    formatStatus() {
      return function(val) {
        const obj = this.statusList.filter(item => item.value === val)
        console.log(obj)
        val = obj[0].value + '-' + obj[0].label
        return val
      }
    },
    isLimiteNum: function() {
      return 5
    },
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
    },
    searchSaleCouponActivityFormLabel() {
      return [
        {
          label: '活动名称:',
          type: 'input',
          prop: 'name'
        },
        {
          label: '商品编码:',
          type: 'input',
          prop: 'code'
        },
        {
          label: '活动状态:',
          type: 'select',
          prop: 'status',
          options: this.statusList
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
    }
  },
  data() {
    const checkMarketPrice = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          if (this.saleCouponActivityForm.salePrice) {
            if (value * 1 <= this.saleCouponActivityForm.salePrice * 1) {
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
    const checkPushlish = (rule, value, cb) => {
      console.log(value)
      if (value) {
        if (this.saleCouponActivityForm.endTime === '') {
          cb(new Error('结束时间不能为空'))
        } else {
          if ((this.isAdd || this.saleCouponActivityForm.status === '3') && new Date(this.saleCouponActivityForm.endTime).getTime() < new Date().getTime()) {
            cb(new Error('开始或结束时间不能小于当前时间'))
          } else {
            return cb()
          }
          // return cb()
        }
      } else {
        if (this.saleCouponActivityForm.beginTime === '' || this.saleCouponActivityForm.endTime === '') {
          cb(new Error('开始或结束时间不能为空'))
        } else {
          if (
            (this.isAdd || this.saleCouponActivityForm.status === '3') &&
            (new Date(this.saleCouponActivityForm.beginTime).getTime() < new Date().getTime() || new Date(this.saleCouponActivityForm.endTime).getTime() < new Date().getTime())
          ) {
            cb(new Error('开始或结束时间不能小于当前时间'))
          } else {
            return cb()
          }
        }
        // if (this.saleCouponActivityForm.endTime === '' || this.saleCouponActivityForm.beginTime === '') {
        //   cb(new Error('开始或结束时间不能为空'))
        // } else {
        //   if (new Date(this.saleCouponActivityForm.endTime).getTime() < new Date().getTime()) {
        //     cb(new Error('开始时间不能小于当前时间'))
        //   } else {
        //     return cb()
        //   }
        //   if (new Date(this.saleCouponActivityForm.endTime).getTime() < new Date().getTime()) {
        //     cb(new Error('开始时间不能小于当前时间'))
        //   } else {
        //     return cb()
        //   }
        // }
      }
    }
    const checkSalePrice = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的金额数字，最多两位小数'))
        } else {
          if (this.saleCouponActivityForm.marketPrice) {
            if (value * 1 >= this.saleCouponActivityForm.marketPrice * 1) {
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
    const checkUsePoint = (rule, value, cb) => {
      const reg = /^([0]|[1-9][0-9]*)$/
      if (!reg.test(value)) {
        cb(new Error('积分只能输入零或正整数!'))
      } else {
        return cb()
      }
    }
    const checkLimitCount = (rule, value, cb) => {
      if (value !== '') {
        if (value > this.saleCouponActivityForm.sumLimitCount) {
          cb(new Error('每人每日限购不能大于每人总限购'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    const checkSumLimitCount = (rule, value, cb) => {
      if (value !== '') {
        if (value < this.saleCouponActivityForm.limitCount) {
          cb(new Error('每人总限购不能小于每人每日限购'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    // 检测等名称唯一性校验
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getSaleCouponActivityApi.getCheckName(`${value}`, this.currentSaleCouponTemplateId).then(res => {
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    // 检测等名称唯一性校验
    const checkCode = (rule, value, cb) => {
      if (value !== '') {
        this.$api.getSaleCouponActivityApi.getCheckCode(`${value}`, this.currentSaleCouponTemplateId).then(res => {
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的编码已经存在'))
          }
        })
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
    // 大于1等正整数校验
    const checkMoneyRgtOne = (rule, value, cb) => {
      if (value !== '') {
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
    const checkImgList = (rule, value, cb) => {
      if (value !== '') {
        if (this.subPictures.length === 0) {
          cb(new Error('商品图片不能为空'))
        } else {
          return cb()
        }
      } else {
        return cb()
      }
    }
    return {
      adjustStockForm: {
        type: 1,
        number: 1
      },
      adjustStockFormRule: {
        type: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        number: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          }
        ]
      },
      stockDialogVisible: false, // 调整库存弹出框的显示与隐藏
      imgList: '789',
      end: {
        disabledDate: time => {
          if (this.saleCouponActivityForm.beginTime) {
            return time.getTime() < new Date(this.saleCouponActivityForm.beginTime).getTime() - 86399999
          }
          if (!this.saleCouponActivityForm.beginTime) {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      startTime: {
        disabledDate: time => {
          if (this.saleCouponActivityForm.beginTime) {
            return time.getTime() < new Date(this.saleCouponActivityForm.beginTime).getTime()
          } else {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      isBeginTime: false,
      currentSaleCouponTemplateId: '', // 当前售券的id
      selectCouponTemoplateList: [], // 选择优惠券模板的中转数组
      couponTypeSearchList: [], // 优惠券模板类型查询下拉列表,
      pictures: [],
      couponTemplateList: [], // 优惠券模板列表
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      }, // 优惠券查询
      couponTemplateDialogVisible: false, // 选择优惠券模板弹出框
      total: 0,
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
        data: {}
      },
      domain: this.$domain,
      subPictures: [],
      singleMoveDialogVisible: false,
      memberLevelList: [], // 会员等级列表
      isAdd: true,
      dialogVisible: false,
      searchSaleCouponActivityForm: {
        name: '',
        code: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      statusList: [
        { label: '不限', value: '' },
        { label: '未发布', value: '0' },
        { label: '已发布', value: '1' },
        { label: '已过期', value: '2' },
        { label: '撤销发布', value: '3' }
      ],
      saleCouponActivityList: [],
      saleCouponActivityFormRule: {
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
        couponTemplateList: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        usePoint: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkUsePoint,
            trigger: 'blur'
          }
        ],
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
        code: [
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
        initialStockQuantity: [
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
        published: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkPushlish,
            trigger: 'change'
          }
        ],
        activeObject: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        limitCount: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          },
          {
            validator: checkLimitCount,
            trigger: 'blur'
          }
        ],
        sumLimitCount: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkMoneyRgtOne,
            trigger: 'blur'
          },
          {
            validator: checkSumLimitCount,
            trigger: 'blur'
          }
        ],
        refund: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        pointAdd: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        growthAdd: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        imgList: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkImgList,
            trigger: 'blur'
          }
        ]
      }, // 表单校验规则
      saleCouponActivityForm: {
        couponTemplateList: [], // 优惠券的券模板集合
        productImgList: [], // 商品图片集合
        name: '', // 活动名称
        code: '', // 商品编码
        marketPrice: '', // 市场价
        salePrice: '', // 销售价格
        initialStockQuantity: '', // 初始库存
        fullDescription: '', // 图文详情
        published: false, // 立即上架
        beginTime: '', // 开始时间。yyyy-MM-dd HH:mm:ss
        endTime: '', // 结束时间。yyyy-MM-dd HH:mm:ss
        refund: false, // 是否允许退款
        automaticRefund: false, // 过期自动退款
        pointAdd: false, // 是否增加积分
        growthAdd: false, // 是否增加成长值
        limitCount: 999, // 每人每日限购
        sumLimitCount: 999, // 每人总限购
        activeObject: ['all'], // 活动对象。多个用英文逗号分割，选所有传
        imgList: '123456',
        usePoint: ''
      }
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取优惠券活动列表
    this.getSaleCouponActivityList()
    // 获取会员等级数据
    this.getMemberLevelList()
    // 获取优惠券模板类型查询下拉列表数据
    this.getCouponTypeSearchList()
    this.getQiniuToken()
  },
  methods: {
    /**
     * 描述：开始时间
     */
    handleChangeBeginTime(e) {
      if (this.saleCouponActivityForm.endTime) {
        this.saleCouponActivityForm.endTime = ''
        return this.$message.info('重新选择开始时间，结束时间自动清除，请重新选择结束时间')
      }
    },
    /**
     * 描述：选择结束时间
     */
    handleChangeEndTime(e) {
      if (!this.isBeginTime && this.saleCouponActivityForm.beginTime) {
        if (new Date(this.saleCouponActivityForm.beginTime).getTime() > new Date(this.saleCouponActivityForm.endTime).getTime()) {
          this.saleCouponActivityForm.endTime = ''
          return this.$message.info('结束时间不能小于开始时间')
        }
      }
    },
    /**
     * 描述：立即上架方法
     */
    handleChangePublish(e) {
      if (e) {
        this.isBeginTime = true
      } else {
        this.isBeginTime = false
      }
      this.saleCouponActivityForm.beginTime = ''
      this.saleCouponActivityForm.endTime = ''
    },
    // 获取row的key值
    getRowKeys(row) {
      return row.id
    },
    /**
     * 表格全选方法
     */
    selRow(val) {
      this.selectCouponTemoplateList = []
      this.selectCouponTemoplateList = val
    },
    /**
     * 描述：取消选择表格中的优惠券模板
     */
    cancelSelectCouponTemplate() {
      this.$refs.tableRef.clearSelection()
      this.couponTemplateDialogVisible = false
    },
    /**
     * 描述：确认选择表格中的优惠券模板
     */
    confirmSelectCouponTemplate() {
      this.saleCouponActivityForm.couponTemplateList = this.selectCouponTemoplateList
      this.couponTemplateDialogVisible = false
    },
    /**
     * 描述：删除已经已经选择的优惠券模板
     */
    deleteSelectedCouponTempate(id) {
      const i = this.saleCouponActivityForm.couponTemplateList.findIndex(item => {
        return item.id === id
      })
      this.saleCouponActivityForm.couponTemplateList.splice(i, 1)
    },
    /**
     * 描述：获取优惠券类型查询下拉列表数据
     */
    getCouponTypeSearchList() {
      this.couponTypeSearchList = []
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
    /**
     * 描述：选择优惠券模板表格数据
     */
    handleSelectCouponTemplateTable() {
      console.log('走了这里')
      this.couponTemplateDialogVisible = true
      this.getCouponTemplateList()
    },
    /**
     * 描述：获取有效状态券模板列表
     */
    async getCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      console.log(res.data)
      // this.couponTemplateList = res.data
      if (res.data.length > 0) {
        for (let i = 0; i < res.data.length; i++) {
          res.data[i].quantity = 1
          console.log('走了这里')
        }
      }
      this.couponTemplateList = res.data
      this.$nextTick(() => {
        this.$refs.tableRef.clearSelection()
        if (this.saleCouponActivityForm.couponTemplateList.length > 0) {
          this.saleCouponActivityForm.couponTemplateList.forEach(item => {
            const index = this.getSelectCouponTemplateId(item.id)
            if (index === -1) return
            this.$refs.tableRef.toggleRowSelection(this.couponTemplateList[index], true)
          })
        }
      })
    },
    /**
     * 描述：查询
     */
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
    /**
     * 描述：重置查询券模板管理
     */
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
     * 描述：查询券模板管理
     */
    searchsearchCouponTemplateForm() {
      this.getCouponTemplateList()
    },
    /**
     * 描述：查询分页切换条数
     */
    handleSizeChange(newPageSize) {
      this.searchSaleCouponActivityForm.pageSize = newPageSize
      this.getSaleCouponActivityList()
    },
    /**
     * 描述：查询分页切换页数
     */
    handleCurrentChange(newPage) {
      this.searchSaleCouponActivityForm.pageIndex = newPage
      this.getSaleCouponActivityList()
    },
    beforeRemove(file, fileList) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleRemove(file, fileList) {
      this.uploadPicUrl = ''
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 5 张图片，如需更换，请删除上一张图片在重新选择！')
    },
    beforeAvatarUpload(file) {
      console.log(file)
      console.log('====')
      console.log(file.name.length)
      if (file.name.length < 70) {
        // 图片上传之前的方法
        const isPNG = file.type === 'image/png'
        const isJPEG = file.type === 'image/jpeg'
        const isJPG = file.type === 'image/jpg'
        const isLt2M = file.size / 1024 / 1024 < 0.5

        if (!isPNG && !isJPEG && !isJPG) {
          this.$message.error('上传商品图片只能是 jpg、png、jpeg 格式!')
          return false
        }
        if (!isLt2M) {
          this.$message.error('上传图片大小不能超过500kb!')
          return false
        }
        this.QiniuData.data = file
        this.QiniuData.key = `${file.uid}`
      } else {
        this.$message.error('名称长度不能超过64个')
      }

      // 图片名称
    },
    uploadSuccess(response, file, fileList) {
      console.log(this.pictures)
      // 图片上传成功的方法
      this.uploadPicUrl = `${this.qiniuaddr}/${response.key}`
      if (this.subPictures.length < 1) {
        const obj = {}
        obj.id = response.key
        obj.name = file.name
        obj.url = this.uploadPicUrl
        obj.mainPicture = true
        this.subPictures.push(obj)
      } else {
        const obj1 = {}
        obj1.id = file.uid
        obj1.name = file.name
        obj1.url = this.uploadPicUrl
        obj1.mainPicture = false
        this.subPictures.push(obj1)
      }
      // this.product.pictures = this.subPictures
      console.log(this.subPictures)
    },
    // 设为主图的方法
    setMainPicture(item) {
      const i = this.subPictures.findIndex(x => x.id === item.id)
      console.log(i)
      const middle = this.subPictures[0]
      console.log(middle)
      // delete subPictures[0].mainPicture
      // delete subPictures[i].mainPicture
      this.subPictures[0] = this.subPictures[i]
      this.subPictures[i] = middle
      this.subPictures[0].mainPicture = true
      this.subPictures[i].mainPicture = false
      console.log(this.subPictures)
      // this.product.pictures = this.subPictures
    },
    // 删除主图的方法
    deleteMainPicture() {
      this.product.mainPicture.url = ''
      this.showMianPicture = false
    },
    // 删除副图数组中的图片信息
    deleteSubPicture(item) {
      console.log(item)
      console.log(this.subPictures)
      // if (this.selectArray) {
      //   const k = this.selectArray.findIndex(k => {
      //     return k.url === item.url
      //   })
      //   this.selectArray.splice(k, 1)
      // }
      // console.log(this.selectArray)
      const i = this.subPictures.findIndex(x => x.id === item.id)
      console.log(i)
      this.subPictures.splice(i, 1)
      console.log(this.subPictures)
      this.pictures = this.subPictures
    },
    /**
     * 描述：获取七牛token
     */
    getQiniuToken() {
      this.$api.getQiniuToken.getQiniuToken().then(res => {
        this.qiniuaddr = res.cdnDomainName
        this.QiniuData.token = res.qiniuToken
      })
    },
    // 图文详情上传说明
    showPictureExplain() {
      this.singleMoveDialogVisible = true
    },
    handleChangeActiveObject(e) {
      console.log(e)
      console.log(e.toString())
    },
    /**
     * 描述：延期表单清除
     */
    closeDelayDialog() {
      this.adjustStockForm = {
        type: 1,
        number: 1
      }
      this.$refs.adjustStockFormRef.resetFields()
    },
    /**
     * 描述：关闭弹框操作
     */
    closeDialog() {
      this.isBeginTime = false
      this.isAdd = true
      this.saleCouponActivityForm = {
        couponTemplateList: [], // 优惠券的券模板集合
        productImgList: [], // 商品图片集合
        name: '', // 活动名称
        code: '', // 商品编码
        marketPrice: '', // 市场价
        salePrice: '', // 销售价格
        initialStockQuantity: '', // 初始库存
        fullDescription: '', // 图文详情
        published: false, // 立即上架
        beginTime: '', // 开始时间。yyyy-MM-dd HH:mm:ss
        endTime: '', // 结束时间。yyyy-MM-dd HH:mm:ss
        refund: false, // 是否允许退款
        automaticRefund: false, // 过期自动退款
        pointAdd: false, // 是否增加积分
        growthAdd: false, // 是否增加成长值
        limitCount: 999, // 每人每日限购
        sumLimitCount: 999, // 每人总限购
        activeObject: ['all'], // 活动对象。多个用英文逗号分割，选所有传
        imgList: '123456',
        usePoint: ''
      }
      this.subPictures = []
      this.pictures = []
      this.$refs.saleCouponActivityFormRef.resetFields()
    },
    /**
     * 描述：计算中间表格的高度
     */
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    /**
     * 描述：获取售券活动列表数据
     */
    async getSaleCouponActivityList() {
      const res = await this.$api.getSaleCouponActivityApi.getSaleCouponActivityList(this.searchSaleCouponActivityForm)
      this.saleCouponActivityList = res.data
      this.total = res.total
    },
    /**
     * 描述：添加售券活动
     */
    addSaleCouponActivity() {
      this.saleCouponActivityForm = {
        couponTemplateList: [], // 优惠券的券模板集合
        productImgList: [], // 商品图片集合
        name: '', // 活动名称
        code: '', // 商品编码
        marketPrice: '', // 市场价
        salePrice: '', // 销售价格
        initialStockQuantity: '', // 初始库存
        fullDescription: '', // 图文详情
        published: false, // 立即上架
        beginTime: '', // 开始时间。yyyy-MM-dd HH:mm:ss
        endTime: '', // 结束时间。yyyy-MM-dd HH:mm:ss
        refund: false, // 是否允许退款
        automaticRefund: false, // 过期自动退款
        pointAdd: false, // 是否增加积分
        growthAdd: false, // 是否增加成长值
        limitCount: 999, // 每人每日限购
        sumLimitCount: 999, // 每人总限购
        activeObject: ['all'], // 活动对象。多个用英文逗号分割，选所有传
        imgList: '123456',
        usePoint: ''
      }
      this.currentSaleCouponTemplateId = ''
      this.dialogVisible = true
      this.$refs.saleCouponActivityFormRef.resetFields()
    },
    /**
     * 描述：查看活动优惠券详情
     */
    viewSaleCouponActivity(item) {
      this.isAdd = false
      this.currentSaleCouponTemplateId = item.id
      this.getSaleCouponActivityById(item)
    },
    async copySaleCouponActivity(item) {
      const confirmResult = await this.$confirm('您确定要按照该售券活动的配置生成一个新的活动吗？', '复制', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        this.isAdd = true
        // this.currentSaleCouponTemplateId = item.id
        this.getSaleCouponActivityById(item)
      }
    },
    // 列表发布活动
    async publishSaleCouponActivity(item) {
      const confirmResult = await this.$confirm('确定要将发布该活动吗？', '发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        // this.isAdd = true
        const saleCouponDetail = await this.$api.getSaleCouponActivityApi.getSaleCouponActivityById(item.id)
        console.log('售券活动详情', saleCouponDetail)
        const params = saleCouponDetail.data
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].status !== '1') {
            return this.$notify({
              title: '业务提示',
              message: '已选择券模板中存在过期模板，不能进行保存或保存并发布操作',
              type: 'info'
            })
          }
        }
        // params.endTime

        let thanCurrentTime = []
        // let isOption = true
        console.log('选中的优惠券列表', params.couponTemplateList)
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
        console.log('打印的布尔值', thanCurrentTime)
        if (thanCurrentTime) {
          const confirmResult = await this.$confirm(`存在券模板,'${thanCurrentTime},'的失效期比券活动结束时间早，是否继续`, '提示', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning'
          }).catch(err => err)
          // 如果用户确认，则返回字符串 confirm
          // 如果用户取消了,则返回字符串 cancel
          if (confirmResult !== 'confirm') {
            return this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optCancel'),
              type: 'info'
            })
          } else {
            this.currentSaleCouponTemplateId = item.id
            const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivityRelease(this.currentSaleCouponTemplateId)
            if (res.code === '200000') this.getSaleCouponActivityList()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        } else {
          this.currentSaleCouponTemplateId = item.id
          const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivityRelease(this.currentSaleCouponTemplateId)
          if (res.code === '200000') this.getSaleCouponActivityList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        }
      }
    },
    /**
     * 描述：判断上架时间大于券模板时间确认框
     */
    async justEndTimeTip() {
      const confirmResult = await this.$confirm('确定要将发布该活动吗？', '发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        // 确认按钮
        // 调用接口处理发布
        const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivityRelease(this.currentSaleCouponTemplateId)
        if (res.code === '200000') this.getSaleCouponActivityList()
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
      }
    },
    /**
     * 描述：撤销发布接口
     */
    async unPublishSaleCouponActivity(item) {
      const confirmResult = await this.$confirm('确定要将活动撤销发布吗？', '撤销发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        // 调用接口处理撤销发布
        const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivityRevoke(item.id)
        if (res.code === '200000') this.getSaleCouponActivityList()
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
        this.dialogVisible = false
      }
    },
    /**
     * 描述：根据id查询活动优惠券
     */
    async getSaleCouponActivityById(item) {
      const res = await this.$api.getSaleCouponActivityApi.getSaleCouponActivityById(item.id)
      console.log('券活动详情界面', res)
      const data = res.data
      data.activeObject = data.activeObject.split(',')
      console.log(data.activeObject)
      data.marketPrice = data.marketPrice + ''
      data.salePrice = data.salePrice + ''
      this.subPictures = data.productImgList
      this.saleCouponActivityForm = data
      this.saleCouponActivityForm.imgList = '123456' //
      if (this.saleCouponActivityForm.published && this.isAdd) {
        this.saleCouponActivityForm.beginTime = ''
      }
      if (!this.saleCouponActivityForm.beginTime) {
        this.saleCouponActivityForm.beginTime = ''
      }
      if (data.published) {
        this.isBeginTime = true
      } else {
        this.isBeginTime = false
      }
      if (this.isAdd) {
        this.saleCouponActivityForm.code = ''
        this.saleCouponActivityForm.name = ''
      }
      this.dialogVisible = true
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
      this.memberLevelList = res.data
      console.log('会员等级数据列表========>', (this.memberLevelList = res.data))
    },
    /**
     * 描述：查询售券列表数据
     */
    searchSaleCouponActivityFormbtn() {
      this.searchSaleCouponActivityForm.pageIndex = 1
      this.getSaleCouponActivityList()
    },
    /**
     * 描述：重置查询售券列表数据
     */
    resetSearchSaleCouponActivityForm() {
      this.searchSaleCouponActivityForm = {
        name: '',
        code: '',
        status: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getSaleCouponActivityList()
    },
    adjustStock(item) {
      this.currentSaleCouponTemplateId = item.id
      this.stockDialogVisible = true
    },
    // 确认调整库存
    confirmAdjustStock() {
      this.$refs.adjustStockFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) return
        // 调整库存接口
        const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivityChangeStock(this.currentSaleCouponTemplateId, this.adjustStockForm)
        if (res.code === '200000') this.getSaleCouponActivityList()
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
        this.stockDialogVisible = false
      })
    },
    /**
     * 描述：确认提交
     */
    confirm(save) {
      let params = ''
      this.$refs.saleCouponActivityFormRef.validate(async valid => {
        console.log(valid)
        // 校验不通过则返回
        if (!valid) return
        // 校验通过处理转换表单
        params = JSON.stringify(this.saleCouponActivityForm)
        params = JSON.parse(params)
        params.marketPrice = Number(params.marketPrice)
        params.salePrice = Number(params.salePrice)
        params.activeObject = params.activeObject.toString()
        params.productImgList = this.subPictures
        params.save = save
        delete params.imgList
        for (let i = 0; i < params.couponTemplateList.length; i++) {
          if (params.couponTemplateList[i].status !== '1') {
            return this.$notify({
              title: '业务提示',
              message: '已选择券模板中存在过期模板，不能进行保存或保存并发布操作',
              type: 'info'
            })
          }
        }
        // params.endTime
        let isOption = true
        let thanCurrentTime = []
        console.log('选中的优惠券列表', params.couponTemplateList)
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
        console.log(thanCurrentTime)
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
        let tempData = JSON.stringify(params.couponTemplateList)
        tempData = JSON.parse(tempData)
        params.couponTemplateList = tempData.map(item => {
          const obj = {}
          obj.couponTemplateId = item.id
          obj.quantity = item.quantity
          return (item = obj)
        })
        console.log('转换之后的数据', params)
        if (this.isAdd && isOption) {
          // 新增逻辑
          const res = await this.$api.postSaleCouponActivityApi.postSaleCouponActivity(params)
          if (res.code === '200000') this.getSaleCouponActivityList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.dialogVisible = false
        }
        if (!this.isAdd && isOption) {
          // 编辑逻辑
          const res = await this.$api.putSaleCouponActivityApi.putSaleCouponActivity(this.currentSaleCouponTemplateId, params)
          if (res.code === '200000') this.getSaleCouponActivityList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.dialogVisible = false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.table-img {
  width: 80px;
  height: 80px;
  margin: 0 auto;
}
.table-img img {
  width: 80px;
  height: 80px;
}
.width240 {
  width: 240px;
}
.product-price-wrap {
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
// 图片上传区域样式
::v-deep .el-upload-list--picture .el-upload-list__item {
  display: none !important;
}
.upload-img-container {
  display: flex !important;
  width: 100%;
}
.upload-wrapper {
  display: flex;
  flex-direction: column;
  width: 150px;
  height: 180px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: #eee;
  overflow: hidden;
}
// 图片上传组件
.img-upload {
  width: 100%;
  height: 150px;
}
// 图片按钮
.btns {
  display: flex;
  justify-content: space-between;
  align-items: center;
  span {
    margin-left: 10px;
    line-height: 30px;
    cursor: pointer;
  }
}
// 图片删除按钮
.el-icon-delete {
  color: red;
  cursor: pointer;
  margin-right: 10px;
}

// 表单底部按钮区域
.bottom-opt-btn-wrap {
  margin-top: 30px;
  display: flex;
  justify-content: center;
}
.form-table-item {
  margin-top: 20px;
  margin-bottom: 20px;
}
.choose-coupon-btn {
  margin-bottom: 20px;
}
</style>

<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddPictureNavigationDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchPictureNavigationLabel" :formData="searchPictureNavigationForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchPictureNavigation"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchPictureNavigation" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->
    <!-- 图片导航列表区域 begin -->
    <yp-table :propArr="pictureNavigationListLabel" :listInfo="pictureNavigationList" @updateStatus="updateStatus">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditPictureNavigationDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
      </template>
    </yp-table>
    <!-- 图片导航列表区域 end -->
    <!-- 新增或编辑表单区域 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')" :visible.sync="dialogVisible" width="80%" v-dialogDrag @close="closeDialog">
      <!-- 对话框里面的表单 begin -->
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
      </template>
      <el-main class="form-wrapper scoll">
        <el-row :gutter="40">
          <el-col :span="16">
            <el-row>
              <el-col :span="4" :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }">图片导航</el-col>
            </el-row>
            <el-form :model="pictureNavigationForm" label-position="right" ref="pictureNavigationFormRef" :rules="pictureNavigationFormRule" label-width="100px">
              <el-form-item label="名称:" prop="name">
                <el-input v-model="pictureNavigationForm.name" clearable></el-input>
              </el-form-item>
              <el-form-item label="样式:" prop="style">
                <el-radio-group v-model="pictureNavigationForm.style">
                  <el-radio :label="'1'">上下型</el-radio>
                  <el-radio :label="'2'">左右型</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="图标显示:" prop="iconDisplay">
                <el-radio-group v-model="pictureNavigationForm.iconDisplay" @change="isIconDisplay">
                  <el-radio :label="true">显示</el-radio>
                  <el-radio :label="false">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="描述显示:" prop="descriptionDisplay">
                <el-radio-group v-model="pictureNavigationForm.descriptionDisplay" @change="isDescriptionDisplay">
                  <el-radio :label="true">显示</el-radio>
                  <el-radio :label="false">隐藏</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="列数:" prop="columns">
                <el-radio-group v-model="pictureNavigationForm.columns">
                  <el-radio :label="1">一列</el-radio>
                  <el-radio :label="2">两列</el-radio>
                  <el-radio :label="3">三列</el-radio>
                  <el-radio :label="4">四列</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="位置:" prop="site">
                <el-select v-model="pictureNavigationForm.site" placeholder="请选择">
                  <el-option v-for="item in selectSiteList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="有效状态:" prop="status">
                <el-radio-group v-model="pictureNavigationForm.status">
                  <el-radio :label="true">有效</el-radio>
                  <el-radio :label="false">无效</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item label="图片列表:" prop="list">
                <span style="color:#6699ff;fontSize:10px;marginTop:10px;"
                  >提示：“三列、左右型”、“四列、左右型”图片像素不超过240像素*240像素，正方形；除上述要求外，其他样式图片像素不超过240像素*60像素，长方形；大小500kb，jpg、jpeg或png格式</span
                >
                <el-main class="picture-list scoll">
                  <el-form :model="pictureNavigationForm" ref="pictureListRef" :rules="pictureListRule">
                    <el-table :data="pictureNavigationForm.list" class="customer-no-border-table">
                      <template slot="empty">
                        <span style="color: #969799;">暂无图片信息</span>
                      </template>
                      <el-table-column>
                        <template slot-scope="scope" class="picture-list-item">
                          <div class="close-wrapper" @click="deletePicture(scope.$index)">
                            <i class="el-icon-close"></i>
                          </div>
                          <div>
                            <el-form-item class="upload-wrapper">
                              <img :src="noAvatar" alt="" class="no-avatar" v-show="scope.row.pictureUrl ? false : true" />
                              <yp-single-upload class="upload" :utype="'pictureNavigation'" :url.sync="scope.row.pictureUrl"></yp-single-upload>
                            </el-form-item>
                          </div>
                          <div class="picture-text-wrapper">
                            <el-form-item class="text-form-item" :prop="'list.' + scope.$index + '.description'" :rules="pictureListRule.description">
                              <div class="label-wrapper">
                                <div class="label-text"><span style="color:red;">*</span>描述:</div>
                                <el-input v-model="scope.row.description" maxlength="6" style="width:auto;" show-word-limit></el-input>
                              </div>
                            </el-form-item>
                            <el-form-item class="text-form-item" :prop="'list.' + scope.$index + '.pageUrl'" :rules="pictureListRule.pageUrl">
                              <div class="label-wrapper">
                                <div class="label-text"><span style="color:red;">*</span>链接:</div>
                                <el-input v-model="scope.row.pageUrl" style="width:auto;"></el-input>
                              </div>
                            </el-form-item>
                            <el-form-item class="text-form-item" :prop="'list.' + scope.$index + '.displayOrder'" :rules="pictureListRule.displayOrder">
                              <div class="label-wrapper">
                                <div class="label-text"><span style="color:red;">*</span>排序:</div>
                                <el-input v-model="scope.row.displayOrder" style="width:auto;"></el-input>
                              </div>
                            </el-form-item>
                            <el-form-item class="text-form-item">
                              <div class="label-wrapper" v-show="pictureNavigationForm.site === '01'">
                                <div class="label-text">会员等级:</div>
                                <!-- <el-input v-model="scope.row.cardLevel" style="width:auto;"></el-input> -->
                                <el-select v-model="scope.row.cardLevel" placeholder="请选择" style="width:auto;">
                                  <el-option v-for="item in cardLevelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                                </el-select>
                              </div>
                            </el-form-item>
                          </div>
                        </template>
                      </el-table-column>
                    </el-table>
                  </el-form>
                  <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="addPicture">添加一个图片</el-button> 已经添加了{{ pictureNavigationForm.list.length }}组
                </el-main>
              </el-form-item>
            </el-form>
          </el-col>
          <el-col :span="8">
            <div :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px', marginBottom: '20px' }">
              预览区域
            </div>
            <div class="pre-wrapper">
              <div class="space"></div>
              <div class="pre-content scoll">
                <div class="static-content">
                  <div class="static-member-right" v-show="!pictureNavigationForm.site || pictureNavigationForm.site === '02'">
                    <div class="static-member-right-tip">
                      静态区域
                    </div>
                    <img class="static-member-right-img" src="http://qiaokun.yuepong.com/%E9%9D%99%E6%80%81%E4%BC%9A%E5%91%98%E6%9D%83%E7%9B%8A.jpg" alt="" />
                  </div>
                  <div class="dynamic-member-right" v-show="pictureNavigationForm.site && pictureNavigationForm.site === '01'">
                    <div class="dynamic-member-right-tip tip">
                      预览区域
                    </div>
                    <div v-show="pictureNavigationForm.list.length === 0">
                      提示：暂无图片请上传图片进行预览
                    </div>
                    <!-- <div :style="{ flexDirection: style, width: columns }" class="dynamic-member-right-item" v-for="(item, index) in sortList" :key="index">
                      <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="" class="dynamic-member-right-img" />
                      <span v-show="pictureNavigationForm.descriptionDisplay">{{ item.description }}</span>
                    </div> -->
                    <!-- 一列 包含上下 、左右 start-->
                    <div v-show="pictureNavigationForm.columns === 1" :class="pictureNavigationForm.style === '1' ? 'text-bottom-1' : 'text-right-1'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 一列 包含上下 、左右 end  -->
                    <!-- 两列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns === 2" :class="pictureNavigationForm.style === '1' ? 'text-bottom-2' : 'text-right-2'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 两列 包含上下 、左右 end -->
                    <!-- 三列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns === 3" :class="pictureNavigationForm.style === '1' ? 'text-bottom-3' : 'text-right-3'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 三列 包含上下 、左右 end -->
                    <!-- 四列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns === 4" :class="pictureNavigationForm.style === '1' ? 'text-bottom-4' : 'text-right-4'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 四列 包含上下 、左右 end -->
                  </div>

                  <div class="static-banner">
                    <div class="static-banner-tip">
                      静态区域
                    </div>
                    <img class="static-banner-img" src="http://qiaokun.yuepong.com/%E9%9D%99%E6%80%81%E8%BD%AE%E6%92%AD%E5%9B%BE.jpg" alt="" />
                  </div>
                  <div class="static-skip" v-show="!pictureNavigationForm.site || pictureNavigationForm.site === '01'">
                    <div class="static-skip-tip">
                      静态区域
                    </div>
                    <img class="static-skip-img" src="http://qiaokun.yuepong.com/%E9%9D%99%E6%80%81%E8%B7%AF%E5%BE%84%E8%B7%B3%E8%BD%AC.jpg" alt="" />
                  </div>
                  <div class="dynamic-skip" v-show="pictureNavigationForm.site && pictureNavigationForm.site === '02'">
                    <div class="dynamic-skip-tip tip">
                      预览区域
                    </div>
                    <div v-show="pictureNavigationForm.list.length === 0">
                      提示：暂无图片请上传图片进行预览
                    </div>
                    <!-- <div :style="{ flexDirection: style, width: columns }" class="dynamic-skip-item" v-for="(item, index) in sortList" :key="index">
                      <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="" class="dynamic-skip-img" />
                      <span v-show="pictureNavigationForm.descriptionDisplay">{{ item.description }}</span>
                    </div> -->
                    <!-- 一列 包含上下 、左右 start-->
                    <div v-show="pictureNavigationForm.columns == 1" :class="pictureNavigationForm.style === '1' ? 'text-bottom-1' : 'text-right-1'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 一列 包含上下 、左右 end  -->
                    <!-- 两列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns == 2" :class="pictureNavigationForm.style === '1' ? 'text-bottom-2' : 'text-right-2'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 两列 包含上下 、左右 end -->
                    <!-- 三列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns == 3" :class="pictureNavigationForm.style === '1' ? 'text-bottom-3' : 'text-right-3'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 三列 包含上下 、左右 end -->
                    <!-- 四列 包含上下 、左右 start  -->
                    <div v-show="pictureNavigationForm.columns == 4" :class="pictureNavigationForm.style === '1' ? 'text-bottom-4' : 'text-right-4'">
                      <div class="item-img-text" v-for="(item, index) in sortList" :key="index">
                        <img v-show="pictureNavigationForm.iconDisplay" :src="item.pictureUrl" alt="暂无图片" />
                        <div v-show="pictureNavigationForm.descriptionDisplay" class="item-name">
                          {{ item.description }}
                        </div>
                      </div>
                    </div>
                    <!-- 四列 包含上下 、左右 end -->
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </el-main>
      <!-- 对话框里面的表单 end -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button v-show="isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
        <el-button v-show="!isAdd" type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 新增或编辑表单区域 end -->
  </div>
</template>

<script>
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
export default {
  components: {
    YpTable,
    YpSearchForm,
    YpSingleUpload
  },
  data() {
    // 检测类型名称是否通过
    const checkName = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        this.$api.getPictureNavigationApi.getCheckName(`${value}`, this.currentPictureNavigationId).then(res => {
          if (!res) {
            return cb()
          } else {
            cb(new Error('输入的名称已存在'))
          }
        })
      }
    }
    // 检测排序是否通过
    const checkDisplayOrder = (rule, value, cb) => {
      if (value !== '') {
        // 发起请求，判断返回的值是否为空，若为空，则通过，若不为空则证明已经存在
        // 提示接口地址要换 状态：未换
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0请输入大于0的正整数'))
        } else {
          return cb()
        }
      } else {
        // 此项为非必填字段，当值为空时，校验通过
        return cb()
      }
    }
    return {
      // isAdd: true, // 判断是否是添加还是编辑
      currentPictureNavigationId: '', // 当前图片导航的id
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg',
      space: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0', // 校验空格占位符
      isAdd: true, // 判断是否是编辑还是新增
      dialogVisible: false, // 表单弹出框
      pictureNavigationList: [], // 图片导航表格数据
      pictureNavigationForm: {
        name: '', // 名称
        style: '1', // 样式
        iconDisplay: true, // 图片显示
        columns: 4, // 列数
        descriptionDisplay: true, // 描述显示
        site: '', // 位置
        status: true, // 有效
        list: [] // 图片列表
      },
      cardLevelList: [], // 会员等级选择下拉列表
      pictureNavigationFormRule: {
        name: [
          { required: true, message: '请输入', trigger: 'blur' },
          {
            validator: checkName,
            trigger: 'blur'
          }
        ],
        style: [{ required: true, message: '请输入', trigger: 'blur' }],
        iconDisplay: [{ required: true, message: '请输入', trigger: 'blur' }],
        columns: [{ required: true, message: '请输入', trigger: 'blur' }],
        descriptionDisplay: [{ required: true, message: '请输入', trigger: 'blur' }],
        site: [{ required: true, message: '请选择', trigger: 'blur' }],
        status: [{ required: true, message: '请输入', trigger: 'blur' }],
        list: [{ required: true, message: '请添加图片' }]
      },
      pictureListRule: {
        description: [
          {
            required: true,
            message: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0请输入',
            trigger: 'blur'
          }
        ],
        pageUrl: [
          {
            required: true,
            message: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0请输入',
            trigger: 'blur'
          }
        ],
        displayOrder: [
          {
            required: true,
            message: '\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0\xa0请输入',
            trigger: 'blur'
          },
          {
            validator: checkDisplayOrder,
            trigger: 'blur'
          }
        ]
      }, // 图片表单校验规则
      // 图片导航查询表单
      searchPictureNavigationForm: {
        name: '', // 名称
        site: '', // 位置
        status: '' // 状态
      },
      selectSiteList: [
        { label: '会员权益', value: '01' },
        { label: '跳转功能', value: '02' }
      ] // 选择位置列表
    }
  },
  computed: {
    // 动态样式设定
    // 上下样式
    style() {
      if (this.pictureNavigationForm.style === '1') {
        return 'column'
      } else {
        return 'row'
      }
    },
    // 图片显示与隐藏 直接用表单的 iconDisplay 值来控制
    // 描述显示与隐藏 直接用表单的 descriptionDisplay 值来进行控制
    // 列数控制
    columns() {
      if (this.pictureNavigationForm.columns === 1) {
        return '100%'
      } else if (this.pictureNavigationForm.columns === 2) {
        return '50%'
      } else if (this.pictureNavigationForm.columns === 3) {
        return 100 / 3 + '%'
      } else {
        return '25%'
      }
    },
    // 图片导航查询标签
    searchPictureNavigationLabel() {
      return [
        { label: '名称:', prop: 'name', type: 'input' },
        {
          label: '位置:',
          prop: 'site',
          type: 'select',
          options: [
            { label: '会员权益', value: '01' },
            { label: '跳转功能', value: '02' }
          ]
        }
      ]
    },
    // 图片导航表格标签
    pictureNavigationListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        { label: '名称', props: 'name' },
        {
          label: '样式',
          props: 'style',
          type: 'codeName',
          render: res => {
            if (res.style === '1') {
              return res.style + '-' + '上下型'
            }
            if (res.style === '2') {
              return res.style + '-' + '左右型'
            }
            if (res.style !== '1' || res.style !== '2') {
              return '未知'
            }
          }
        },
        {
          label: '图标显示',
          props: 'iconDisplay',
          type: 'tag',
          render: res => {
            if (res.iconDisplay) {
              return '显示'
            } else {
              return '隐藏'
            }
          },
          renderStyle: res => {
            if (res.iconDisplay) {
              return 'success'
            } else {
              return 'danger'
            }
          }
        },
        {
          label: '描述显示',
          props: 'descriptionDisplay',
          type: 'tag',
          render: res => {
            if (res.descriptionDisplay) {
              return '显示'
            } else {
              return '隐藏'
            }
          },
          renderStyle: res => {
            if (res.descriptionDisplay) {
              return 'success'
            } else {
              return 'danger'
            }
          }
        },
        {
          label: '列数',
          props: 'columns'
        },
        {
          label: '位置',
          props: 'site',
          type: 'codeName',
          render: res => {
            if (res.site === '01') {
              return res.site + '-' + '会员权益'
            }
            if (res.site === '02') {
              return res.site + '-' + '跳转功能'
            }
          }
        },
        {
          label: '有效状态',
          props: 'status',
          type: 'tag',
          render: res => {
            if (res.status) {
              return '有效'
            } else {
              return '无效'
            }
          },
          renderStyle: res => {
            if (res.status) {
              return 'success'
            } else {
              return 'danger'
            }
          }
        },
        { label: this.$t('lang.reviser'), props: 'updateBy' },
        { label: this.$t('lang.modificationtime'), props: 'updateTime', type: 'time', width: '200' }
      ]
    },
    // 动态计算预览排序
    sortList() {
      const arr = JSON.parse(JSON.stringify(this.pictureNavigationForm.list))
      return this.sortBykey(arr, 'displayOrder')
    }
  },
  created() {
    // 获取图片导航列表
    this.getPictureNavigationList()
    // 获取当前会员等级
    this.getCardLevelList()
  },
  methods: {
    // 更新组织类型的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      // 特殊处理 判断当前是否是顶级
      const hasMemberSite = this.pictureNavigationList.filter(item => {
        return item.site === '01' && item.status === true
      })
      const hasSkipSite = this.pictureNavigationList.filter(item => {
        return item.site === '02' && item.status === true
      })
      console.log(hasMemberSite)
      if (hasMemberSite.length > 1 || hasSkipSite.length > 1) {
        this.getPictureNavigationList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '该位置已经存在一条有效状态不允许修改为有效状态',
          type: 'warning'
        })
      } else {
        const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        // 如果用户确认，则返回字符串 confirm
        // 如果用户取消了,则返回字符串 cancel
        if (confirmResult !== 'confirm') {
          this.getPictureNavigationList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          this.$api.getPictureNavigationApi.getPictureNavigationById(val.id).then(res => {
            console.log(res)
            res.status = !res.status
            this.$api.putPictureNavigationApi.putPictureNavigation(val.id, res).then(res => {
              if (res.code === '200000') this.getPictureNavigationList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            })
          })
        }
      }
    },
    // 判断图片显示或者隐藏
    isIconDisplay(e) {
      if (!e && !this.pictureNavigationForm.descriptionDisplay) {
        this.pictureNavigationForm.iconDisplay = true
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '图片显示与描述显示不能同时为隐藏！',
          type: 'info'
        })
      }
    },
    // 判断描述是否显示或者隐藏
    isDescriptionDisplay(e) {
      if (!e && !this.pictureNavigationForm.iconDisplay) {
        this.pictureNavigationForm.descriptionDisplay = true
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '图片显示与描述显示不能同时为隐藏！',
          type: 'info'
        })
      }
    },
    // 获取会员等级列表的数据
    getCardLevelList() {
      this.cardLevelList = []
      const obj = {}
      obj.ddCode = '10018'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.cardLevelList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 排序方法
    sortBykey(array, key) {
      return array.sort(function(a, b) {
        var x = a[key]
        var y = b[key]
        return x < y ? -1 : x > y ? 1 : 0
      })
    },
    // 获取图片导航列表
    getPictureNavigationList() {
      this.$api.getPictureNavigationApi.getPictureNavigationList(this.searchPictureNavigationForm).then(res => {
        console.log(res)
        this.pictureNavigationList = res
      })
    },
    // 关闭弹窗触发的方法
    closeDialog() {
      this.$refs.pictureNavigationFormRef.resetFields()
      this.$refs.pictureListRef.resetFields()
      this.pictureNavigationForm.name = ''
      this.pictureNavigationForm.style = '1'
      this.pictureNavigationForm.iconDisplay = true
      this.pictureNavigationForm.columns = 4
      this.pictureNavigationForm.site = ''
      this.pictureNavigationForm.status = true
      this.pictureNavigationForm.list = []
    },
    // 添加图片导航弹出框
    showAddPictureNavigationDialog() {
      this.currentPictureNavigationId = ''
      this.isAdd = true
      this.dialogVisible = true
    },
    // 编辑图片导航弹出框
    showEditPictureNavigationDialog(row) {
      console.log(row)
      this.isAdd = false
      this.currentPictureNavigationId = row.id
      this.getPictureNavigationById(this.currentPictureNavigationId)
    },
    // 通过id查询某一条图片导航信息
    getPictureNavigationById(id) {
      this.$api.getPictureNavigationApi.getPictureNavigationById(id).then(res => {
        console.log(res)
        this.pictureNavigationForm = res
        this.dialogVisible = true
      })
    },
    // 查询图片导航
    searchPictureNavigation() {
      this.getPictureNavigationList()
    },
    // 重置查询图片导航
    resetSearchPictureNavigation() {
      this.searchPictureNavigationForm.name = ''
      this.searchPictureNavigationForm.site = ''
      this.getPictureNavigationList()
    },
    // 确认新增或者编辑
    confirm() {
      console.log(this.pictureNavigationForm)
      // 新增方法或者编辑方法先触发校验
      this.$refs.pictureNavigationFormRef.validate(valid => {
        console.log(valid)
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求填写表单区域！',
            type: 'warning'
          })
        } else {
          this.$refs.pictureListRef.validate(valid => {
            if (!valid) {
              return this.$notify({
                title: this.$t('lang.tip'),
                message: '请按照要求填写图片列表！',
                type: 'warning'
              })
            } else {
              const exist = this.pictureNavigationForm.list.findIndex(item => {
                return item.pictureUrl === ''
              })
              console.log(exist)
              if (exist !== -1) {
                return this.$notify({
                  title: this.$t('lang.tip'),
                  message: '图片列表有图片未上传',
                  type: 'warning'
                })
              } else {
                if (this.isAdd) {
                  this.$api.postPictureNavigationApi.postPictureNavigation(this.pictureNavigationForm).then(res => {
                    console.log(res)
                    if (res.code === '200000') {
                      this.$notify({
                        title: this.$t('lang.tip'),
                        message: this.$t('lang.optSuccess'),
                        type: 'success'
                      })
                      this.dialogVisible = false
                      this.getPictureNavigationList()
                    }
                  })
                } else {
                  this.$api.putPictureNavigationApi.putPictureNavigation(this.currentPictureNavigationId, this.pictureNavigationForm).then(res => {
                    console.log(res)
                    if (res.code === '200000') {
                      this.$notify({
                        title: this.$t('lang.tip'),
                        message: this.$t('lang.optSuccess'),
                        type: 'success'
                      })
                      this.dialogVisible = false
                      this.getPictureNavigationList()
                    }
                  })
                }
              }
            }
          })
        }
      })
      console.log(this.$refs.pictureNavigationFormRef)
      // this.$refs.pictureNavigationFormRef.validate(valid => {
      //   console.log(valid)
      // })
      // this.$refs.pictureListRef.validate(valid => {
      //   console.log(valid)
      // })
    },
    // 添加图片列表
    addPicture() {
      if (!this.pictureNavigationForm.site) {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择位置信息！',
          type: 'info'
        })
      } else {
        const obj = {
          pictureUrl: '',
          description: '',
          pageUrl: '',
          displayOrder: '',
          cardLevel: ''
        }
        this.pictureNavigationForm.list.push(obj)
      }
    },
    // 删除图片列表
    deletePicture(index) {
      console.log(this.pictureNavigationForm.list)
      console.log(index)
      this.pictureNavigationForm.list.splice(index, 1)
    }
  }
}
</script>

<style lang="scss" scoped>
.picture-list {
  width: 100%;
  height: 300px;
  border: 1px solid #efefef;
  padding: 10px;
}
.picture-list-item {
  // margin: 10px auto;
  position: relative;
  width: 100%;
  height: 160px;
  display: flex;
  background: red;
  margin-bottom: 10px;
}

.close-wrapper {
  position: absolute;
  width: 40px;
  height: 40px;
  font-size: 24px;
  line-height: 40px;
  text-align: center;
  color: #000;
  top: 0;
  right: 0;
  cursor: pointer;
}
.upload-wrapper {
  width: 160px;
  height: 160px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f7f6fb;
  border-radius: 10px;
}
.no-avatar {
  width: 80px;
  height: 80px;
}
.upload {
}
.picture-text-wrapper {
  position: absolute;
  top: 0;
  left: 170px;
  height: 100%;
  right: 40px;
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  // background: chocolate;
}

.text-form-item {
  width: 50%;
  margin-bottom: 20px;
  margin-top: 20px;
}
.label-wrapper {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}
.label-text {
  height: 40px;
  width: 110px;
  line-height: 40px;
  text-align: right;
  padding-right: 10px;
}
// 静态预览
.pre-wrapper {
  border: 1px solid #efefef;
  width: 375px;
  height: 628px;
  background: red;
  background: url('https://qiaokun.yuepong.com/back-member-center.jpg');
  background-size: 100% 100%;
}
.space {
  width: 100%;
  height: 1px;
}
.pre-content {
  margin-top: 338px;
  width: 100%;
  height: 288px;
  background: #fff;
}
.static-content {
  width: 100%;
}
.static-member-right {
  position: relative;
  width: 375px;
}
.static-member-right-tip,
.static-banner-tip,
.static-skip-tip,
.dynamic-member-right-tip,
.dynamic-skip-tip {
  position: absolute;
  text-align: center;
  font-size: 12px;
  width: 70px;
  height: 20px;
  border-radius: 20px;
  line-height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
  color: #fff;
  right: 0;
  top: 0;
}
.tip {
  // right: 20px;
  background-color: rgba(255, 0, 0, 0.5);
}
.static-member-right-img {
  width: 100%;
  height: 100%;
}
.static-banner {
  position: relative;
  width: 100%;
}
.static-banner-img {
  width: 100%;
  height: 100%;
}
.static-skip {
  position: relative;
  width: 100%;
}
.static-skip-img {
  width: 100%;
  height: 100%;
}
// 静态预览区域结束
// 动态区域样式
.dynamic-member-right {
  width: 375px;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  // padding: 0 10px;
}
.dynamic-member-right-item {
  display: flex;
  justify-self: center;
  align-items: center;
}
.dynamic-member-right-img {
  width: 30px;
  height: 30px;
}
.dynamic-skip {
  width: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
  // padding: 0 10px;
}
// .dynamic-skip-item {
//   display: flex;
//   justify-self: center;
//   align-items: center;
// }
// .dynamic-skip-img {
//   width: 14px;
//   height: 14px;
// }
/*去掉表格单元格边框*/
.el-table__header tr,
.el-table__header th {
  padding: 0;
  height: 0;
}
.customer-no-border-table td,
.customer-no-border-table th.is-leaf {
  border: none;
}
/*表格最外边框*/
.customer-no-border-table .el-table--border,
.el-table--group {
  border: none;
}
/*头部边框*/
.customer-no-border-table thead tr th.is-leaf {
  border: 0px solid #ebeef5;
  border-right: none;
}
.customer-no-border-table thead tr th:nth-last-of-type(2) {
  border-right: 0px solid #ebeef5;
}
/*表格最外层边框-底部边框*/
.customer-no-border-table .el-table--border::after,
.customer-no-border-table .el-table--group::after {
  width: 0;
}
.customer-no-border-table::before {
  width: 0;
}
.customer-no-border-table .el-table__fixed-right::before,
.el-table__fixed::before {
  width: 0;
}
.customer-no-border-table .el-table__header tr th {
  background: #fff;
  color: #333333;
  padding: 3px;
  font-weight: 550;
  // height: 36px;
  border: 0px;
  font-size: 15px;
}
.el-table_2_column_11 .is-leaf {
  height: 0 !important;
}
.customer-no-border-table {
  margin-top: -51px;
}
// 新的动态预览区域样式
// 会员权益 一列开始
// 一列 上下 start
.text-bottom-1 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;

  .item-img-text {
    width: 355px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .item-img-text > img {
    width: 355px;
    height: 88.75px;
  }
  .item-img-text > div {
    font-size: 14px;
    line-height: 25px;
    color: #666666;
  }
}
// 一列上下 end
// 一列左右 start
.text-right-1 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;
  .item-img-text {
    display: flex;
  }
  .item-img-text > img {
    width: 120px;
    height: 30px;
  }
  .item-img-text > div {
    margin-left: 10px;
    font-size: 12.5px;
    line-height: 30px;
    color: #666666;
  }
}
// 一列左右 end
// 一列结束
// 两列开始
// 两列上下开始 start
.text-bottom-2 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;
  .item-img-text {
    width: 165px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .item-img-text > img {
    width: 157.5px;
    height: 39.5px;
  }

  .item-img-text > div {
    font-size: 10px;
    line-height: 25px;
    color: #666;
  }
}
// 两列上下结束 end
// 两列左右开始 start
.text-right-2 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;

  .item-img-text {
    margin-top: 10px;
    width: 177.5px;
    display: flex;
    align-items: center;
  }

  .item-img-text > img {
    width: 80px;
    height: 30px;
  }

  .item-img-text > div {
    font-size: 12px;
    line-height: 20px;
    color: #666666;
  }
}

// 两列左右结束 end
// 两列结束
// 三列开始
// 三列上下开始 start
.text-bottom-3 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 10px;
  .item-img-text {
    width: 118.3px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .item-img-text > img {
    width: 110px;
    height: 30px;
  }
  .item-img-text > div {
    font-size: 14px;
    line-height: 25px;
    color: #666666;
  }
}
// 三列上下结束 end
// 三列左右 左右start
.text-right-3 {
  display: flex;
  flex-wrap: wrap;
  margin: 0 auto;

  .item-img-text {
    width: 118.3px;
    display: flex;
    align-items: center;
  }

  .item-img-text > img {
    width: 30px;
    height: 30px;
  }

  .item-img-text > div {
    // margin-left: 20rpx;
    font-size: 12px;
    line-height: 30px;
    color: #666666;
  }
}
// 三列结束 左右 end
// 三列结束
// 四列开始
// 四列上下 开始 start
.text-bottom-4 {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 10px;

  .item-img-text {
    width: 88.75px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  .item-img-text > img {
    width: 87px;
    height: 30px;
  }

  .item-img-text > div {
    text-align: center;
    font-size: 13px;
    line-height: 25px;
    color: #666666;
  }
}
// 四列上下 结束 end
.text-right-4 {
  display: flex;
  flex-wrap: wrap;
  margin: 10px 10px;

  .item-img-text {
    width: 88.75px;
    display: flex;
    align-items: center;
  }

  .item-img-text > img {
    width: 20px;
    height: 20px;
  }

  .item-img-text > div {
    font-size: 10px !important;
    line-height: 20px;
    color: #666666;
  }
  .item-name {
    font-size: 8px;
  }
}

// 四列结束
</style>

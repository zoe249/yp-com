<!--
 * @Author: liupenghui
 * @Date: 2021-01-13 16:00:55
 * @LastEditTime: 2021-01-29 17:25:53
 * @LastEditors: Please set LastEditors
 * @Description: 礼品卡方案
 * @FilePath: \celesta-web-project\src\views\giftCardScheme\giftCardScheme.vue
-->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button size="mini" class="add-btn" type="primary" @click="showAddGiftCardSchemeDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->

    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchGiftCardSchemeFormLabel" :formData="searchGiftCardSchemeForm"></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchGiftCardScheme"
          size="mini"
          icon="el-icon-refresh-left"
          >{{ this.$t('lang.reset') }}</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchGiftCardScheme" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索表单 end -->

    <!-- 主表格内容 begin -->
    <yp-table :height="height" :propArr="giftCardSchemeListLabel" :listInfo="giftCardSchemeList" @switchChange="switchChange">
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showEditGiftCardSchemeDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <el-button type="text" icon="el-icon-check" v-show="scope.scope.status === '01'" @click="takeEffectEvent(scope.scope)">生效</el-button>
        <el-button type="text" icon="el-icon-close" v-show="scope.scope.status === '02'" @click="toVoidEvent(scope.scope)">作废</el-button>
      </template>
    </yp-table>
    <!-- 主表格内容 end -->

    <!-- 分页（礼品卡方案总分页） begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="giftCardSchemeHandleSizeChange"
          @current-change="giftCardSchemeHandleCurrentChange"
          :current-page="searchGiftCardSchemeForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchGiftCardSchemeForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="giftCardSchemeTotal"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页（礼品卡方案总分页） end -->

    <!-- 对话框（礼品卡方案新增与查看详情对话框） begin -->
    <el-dialog
      v-if="giftCardSchemeDialogVisible"
      :lock-scroll="true"
      :append-to-body="true"
      :close-on-click-modal="false"
      :title="giftCardSchemeIsAdd ? $t('lang.add') : $t('lang.viewDetails')"
      :visible.sync="giftCardSchemeDialogVisible"
      width="60%"
      v-dialogDrag
      @close="giftCardSchemeCloseDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ giftCardSchemeIsAdd ? $t('lang.titleAdd') : $t('lang.viewDetails') }}
        </div>
        <!-- <div ref="infoDialogContent" class="infoDialog-content"></div> -->
      </template>
      <!-- <div ref="infoDialogContent" class="infoDialog-content"> -->
      <el-main class="form-content scoll" ref="giftcardRef">
        <el-form ref="formRef" :model="giftCardSchemeForm" label-width="120px" :rules="giftCardSchemeRules">
          <div style="margin-bottom:30px;">
            <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 方案信息</span>
          </div>
          <el-form-item label="状态：" v-if="this.giftCardSchemeIsAdd === false">
            <el-select filterable v-model="giftCardSchemeForm.status" disabled>
              <el-option label="未生效" value="01"></el-option>
              <el-option label="已生效" value="02"></el-option>
              <el-option label="已作废" value="03"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="方案编号：" v-if="this.giftCardSchemeIsAdd === false" prop="number">
            <el-input v-model="giftCardSchemeForm.number" disabled></el-input>
          </el-form-item>
          <el-form-item label="商品编码：" prop="productCode">
            <el-input placeholder="手工输入编码" v-model="giftCardSchemeForm.productCode"></el-input>
          </el-form-item>
          <el-form-item label="商品名称：" prop="productName">
            <el-input v-model="giftCardSchemeForm.productName"></el-input>
          </el-form-item>
          <el-form-item label="面值：" prop="faceValue">
            <el-input placeholder="输入数值" v-model="giftCardSchemeForm.faceValue"></el-input>
          </el-form-item>
          <el-form-item label="是否上架：" prop="published">
            <el-switch v-model="giftCardSchemeForm.published" :disabled="this.giftCardSchemeForm.status === '01' || this.giftCardSchemeForm.status === '03' ? true : false"></el-switch>
            <span style="margin-left:60px;color:blue;" v-if="this.giftCardSchemeForm.status === '01'">在方案未生效时，不可以改变方案状态</span>
            <span style="margin-left:60px;color:blue;" v-if="this.giftCardSchemeForm.status === '03'">方案已作废</span>
          </el-form-item>
          <el-form-item label="卡类型：" prop="cardType">
            <el-radio-group v-model="giftCardSchemeForm.cardType">
              <el-radio label="1">电子卡</el-radio>
              <el-radio label="2">实体卡</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="卡系列：">
            <el-select filterable v-model="giftCardSchemeForm.billNum">
              <el-option label="生日卡" value="01"></el-option>
              <el-option label="星座卡" value="02"></el-option>
              <el-option label="节日卡" value="03"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="卡用途：">
            <el-select filterable v-model="giftCardSchemeForm.application">
              <el-option label="生日" value="01"></el-option>
              <el-option label="答谢" value="02"></el-option>
              <el-option label="节日" value="03"></el-option>
            </el-select>
          </el-form-item>
          <div style="margin-bottom:30px;">
            <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 范围设置</span>
          </div>
          <el-form-item label="有效期：" prop="validPeriod">
            <el-input placeholder="请输入有效期月数，0为无限期" v-model="giftCardSchemeForm.validPeriod"></el-input>
          </el-form-item>
          <el-form-item label="组织范围：" prop="organizationScope">
            <el-radio-group v-model="giftCardSchemeForm.organizationScope">
              <el-radio label="01">不限制</el-radio>
              <el-radio label="02">指定组织</el-radio>
              <el-button
                size="mini"
                type="primary"
                :disabled="this.giftCardSchemeForm.organizationScope === '01' ? true : false"
                v-if="this.giftCardSchemeForm.status === '01' || this.giftCardSchemeForm.status === ''"
                @click="showChoiceOrganizationDialog"
                >选择组织</el-button
              >
              <el-button size="mini" type="primary" v-if="this.giftCardSchemeForm.status === '02' || this.giftCardSchemeForm.status === '03'" @click="showCheckedOrganizationDialog"
                >查看组织</el-button
              >
            </el-radio-group>
          </el-form-item>
          <el-form-item label="渠道范围：" prop="channelsScope">
            <el-radio-group v-model="giftCardSchemeForm.channelsScope">
              <el-radio label="01">不限制</el-radio>
              <el-radio label="02">指定渠道</el-radio>
              <el-button
                size="mini"
                type="primary"
                :disabled="this.giftCardSchemeForm.channelsScope === '01' ? true : false"
                v-if="this.giftCardSchemeForm.status === '01' || this.giftCardSchemeForm.status === ''"
                @click="showChoiceTerminalDialog"
                >选择渠道</el-button
              >
              <el-button size="mini" type="primary" v-if="this.giftCardSchemeForm.status === '02' || this.giftCardSchemeForm.status === '03'" @click="showCheckedTerminalDialog">查看渠道</el-button>
            </el-radio-group>
          </el-form-item>
          <div style="margin-bottom:30px;">
            <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 礼品卡详情</span>
          </div>
          <el-row :gutter="80">
            <el-col :span="12">
              <el-form-item label="说明：" prop="description">
                <!-- 修改人：wangdandi 修改时间：2021-09-30 修改内容：看板bug说明没控制字数 -->
                <el-input v-model="giftCardSchemeForm.description" placeholder="30个字以内" maxlength="30" show-word-limit clearable></el-input>
              </el-form-item>
              <el-form-item label="卡logo：" prop="logo">
                <yp-single-upload utype="giftCardLogo" :url.sync="giftCardSchemeForm.logo"></yp-single-upload>
              </el-form-item>
              <el-form-item label="卡封面类型：" prop="coverType">
                <el-radio-group v-model="giftCardSchemeForm.coverType">
                  <el-radio label="1">颜色</el-radio>
                  <el-radio label="2">图片</el-radio>
                </el-radio-group>
              </el-form-item>
              <el-form-item v-if="this.giftCardSchemeForm.coverType === '2'">
                <yp-single-upload utype="giftCardBackground" :url.sync="giftCardSchemeForm.coverPicture"></yp-single-upload>
              </el-form-item>
              <el-form-item v-if="this.giftCardSchemeForm.coverType === '1'">
                <el-color-picker @change="pickerColorChange" v-model="giftCardSchemeForm.coverColor"></el-color-picker>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <div
                :class="['backgroundColor']"
                :style="{
                  background: giftBackground,
                  backgroundImage: `url(${giftBackground})`
                }"
              >
                <div class="fuzhu"></div>
                <div class="background-logo">
                  <div class="logo-name">
                    <div>
                      <img class="logo-img" :src="this.giftCardSchemeForm.logo ? this.giftCardSchemeForm.logo : this.noAvatar" alt="" />
                    </div>
                    <div class="cardName">
                      <div class="card-name">{{ cardName }}</div>
                      <div class="card-faceValue">
                        面值: <span>{{ faceValueCopy }}</span>
                      </div>
                    </div>
                  </div>
                  <div class="actully-money">余额:{{ moneyCopy }}</div>
                </div>
                <div class="details-descrtion">{{ descriptionValue }}</div>
                <div class="details"></div>
                <div style="width:30px;height:10px;"></div>
              </div>
            </el-col>
          </el-row>

          <div style="margin-top:30px;margin-left:40px;display:flex;justify-content:space-between;">
            <div>
              <span style="margin-right:25px;font-weight:600;">图文详情</span>
              <span>可以介绍礼品卡用途，特写图片等内容，便于用户更好的了解礼品</span>
            </div>
            <div style="margin-top:-7px;">
              <el-button size="mini" type="primary" @click="graphicDetails">图文详情上传说明</el-button>
            </div>
          </div>
          <el-form-item>
            <yp-quill-editor v-if="giftCardSchemeDialogVisible" :content.sync="giftCardSchemeForm.details" size="large"></yp-quill-editor>
          </el-form-item>
        </el-form>
      </el-main>
      <!-- </div> -->
      <span slot="footer" class="dialog-footer" v-if="giftCardSchemeIsAdd === true || giftCardSchemeForm.status === '01'">
        <el-button @click="onlyPreservation" :disabled="giftCardSchemeForm.published === true && giftCardSchemeIsAdd === true ? true : false">保存</el-button>
        <el-button type="primary" @click="keepAndTakeEffect">保存并生效</el-button>
      </span>
    </el-dialog>
    <!-- 对话框（礼品卡方案新增与查看详情对话框） end -->

    <!-- 图文详情对话框 begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" title="移动端上传说明" :visible.sync="graphicDetailsDialog" width="50%" v-dialogDrag>
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '移动端上传说明' }}
        </div>
      </template>
      <div style="font-weight:600;margin-left:30px;margin-bottom:20px;">一，基本要求</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:20px;">1、手机详情总体大小：图片+文字，图片不超过20张，文字不超过5000字；</div>
      <div style="font-weight:600;margin-left:70px;margin-bottom:30px;">建议：所有图片都是本宝贝相关的图片。</div>
      <div style="font-weight:600;margin-left:30px;margin-bottom:20px;">二、图片大小</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:20px;">1、建议使用宽度480 ~ 620像素、高度小于等于960像素的图片；</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:30px;">2、格式为：JPG\JEPG\GIF\PNG； 举例：可以上传一张宽度为480，高度为960像素，格式为JPG的图片。</div>
      <div style="font-weight:600;margin-left:30px;margin-bottom:30px;">三、文字要求</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:20px;">1、每次插入文字不能超过500个字，标点、特殊字符按照一个字计算；</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:20px;">2、请手动输入文字，不要复制粘贴网页上的文字，防止出现乱码</div>
      <div style="font-weight:600;margin-left:50px;margin-bottom:20px;">3、以下特殊字符“&gt;“、“&lt;”、“"”、“'”、“\”会被替换为空。</div>
      <div style="font-weight:600;margin-left:70px;margin-bottom:50px;">建议：不要添加太多的文字，这样看起来更清晰。</div>
    </el-dialog>
    <!-- 图文详情对话框 end -->

    <!-- 选择组织对话框（礼品卡方案对话框里面） begin -->
    <el-dialog
      v-if="choiceOrganizationDialog"
      :lock-scroll="false"
      :append-to-body="true"
      title="选择组织"
      :visible.sync="choiceOrganizationDialog"
      width="50%"
      v-dialogDrag
      @close="choiceOrganizationCloseDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '选择组织' }}
        </div>
      </template>
      <!-- <el-main class="form-content-organization scoll"> -->
      <div style="width:100%;" v-if="this.giftCardSchemeForm.status === '01' || this.giftCardSchemeForm.status === ''">
        <div>
          <div class="search-form-box">
            <yp-search-form class="search-form-wrapper" :formLabel="searchSelectOrganizationLeftFormLabel" :formData="searchSelectOrganizationLeftForm"></yp-search-form>
            <div class="search-btn-wrapper">
              <el-button
                class="reset-btn"
                :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
                @click="resetSearchChioceOrganization"
                size="mini"
                icon="el-icon-refresh-left"
                >{{ this.$t('lang.reset') }}</el-button
              >
              <el-button class="search-btn" type="primary" @click="searchChioceOrganization" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
            </div>
          </div>
          <div v-if="this.giftCardSchemeIsAdd === true">
            <el-table
              :data="selectOrganizationLeftList"
              stripe
              default-expand-all
              border
              class="scoll"
              ref="multipleTableOrganization"
              row-key="id"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
              :tree-props="{ children: 'organizations', hasChildren: 'hasChildren' }"
            >
              <!-- 循环表格标签以及类型 -->
              <el-row v-for="(item, index) in selectOrganizationLeftListLabel" :key="index">
                <el-table-column v-if="item.type === 'customChecked'">
                  <template slot="header" slot-scope="scope">
                    <el-checkbox v-model="checkAllValue" style="padding-left:10px" @change="checkAllIn(scope)" />
                    <span>全选</span>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checks" style="padding-left:10px" @change="checkChange(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
              </el-row>
            </el-table>
          </div>
          <div v-if="this.giftCardSchemeIsAdd === false">
            <el-table
              :tree-props="{ children: 'organizations', hasChildren: 'hasChildren' }"
              default-expand-all
              :data="organizationCompare"
              stripe
              border
              class="scoll"
              ref="multipleTableOrganization"
              row-key="id"
              :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
            >
              <!-- 循环表格标签以及类型 -->
              <el-row v-for="(item, index) in selectOrganizationLeftListLabel" :key="index">
                <el-table-column v-if="item.type === 'customChecked'">
                  <template slot="header" slot-scope="scope">
                    <el-checkbox v-model="checkAllValue" style="padding-left:10px" @change="checkAllIn(scope)" />
                    <span>全选</span>
                  </template>
                  <template slot-scope="scope">
                    <el-checkbox v-model="scope.row.checks" style="padding-left:10px" @change="checkChange(scope.row)" />
                  </template>
                </el-table-column>
                <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
              </el-row>
            </el-table>
          </div>
        </div>
      </div>
      <div v-if="this.giftCardSchemeForm.status === '02' || this.giftCardSchemeForm.status === '03'">
        <yp-table :propArr="selectOrganizationRightListLabel" :listInfo="checkedOrganizationTableList"></yp-table>
      </div>
      <!-- </el-main> -->
      <div v-if="this.giftCardSchemeForm.status === '01' || this.giftCardSchemeForm.status === ''" style="width:100%;display:flex;flex-direction:row-reverse;">
        <span slot="footer" class="dialog-footer">
          <el-button @click="choiceOrganizationDialog = false">{{ $t('lang.cancel') }}</el-button>
          <el-button type="primary" @click="organizationButton">{{ $t('lang.preserve') }}</el-button>
        </span>
      </div>
    </el-dialog>
    <!-- 选择组织对话框（礼品卡方案对话框里面） end -->

    <!-- 选择渠道对话框（礼品卡方案对话框里面）begin -->
    <el-dialog :lock-scroll="false" :append-to-body="true" title="选择渠道" :visible.sync="choiceTerminalDialog" width="50%" v-dialogDrag @close="choiceTerminalCloseDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '选择渠道' }}
        </div>
      </template>
      <div v-if="this.giftCardSchemeForm.status === ''">
        <!-- 头部搜索表单 begin -->
        <div class="search-form-box">
          <el-form class="search-form-wrapper" :model="searchChannelForm">
            <el-form-item label="渠道名称：">
              <el-row
                ><el-col :span="7"> <el-input placeholder="渠道编码或名称" v-model="searchChannelForm.name"></el-input> </el-col
              ></el-row>
            </el-form-item>
          </el-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchSelectTerminal"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchSelectTerminal" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
        <!-- 头部搜索表单 end -->
        <!-- 表格 begin -->
        <el-table
          ref="multipleTable"
          @selection-change="setTerminalSelRow"
          :data="selectTerminalList"
          stripe
          border
          class="scoll"
          :row-key="rowKeys"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <!-- 循环表格标签以及类型 -->
          <el-row v-for="(item, index) in selectTerminalListLabel" :key="index">
            <el-table-column v-if="item.type === 'customChecked'" type="selection" width="55" :reserve-selection="true"> </el-table-column>
            <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
          </el-row>
        </el-table>
        <!-- 表格 end -->
        <div style="width:100%;display:flex;flex-direction:row-reverse;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="choiceTerminalDialog = false">{{ $t('lang.cancel') }}</el-button>
            <el-button type="primary" @click="choiceTerminalTableDialog">{{ $t('lang.preserve') }}</el-button>
          </span>
        </div>
      </div>
      <div v-if="this.giftCardSchemeForm.status === '02' || this.giftCardSchemeForm.status === '03'">
        <el-table
          :row-key="getRowKeys"
          @selection-change="setTerminalRightSelRow"
          :data="checkedTerminalTableList"
          stripe
          border
          class="scoll"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <!-- 循环表格标签以及类型 -->
          <el-row v-for="(item, index) in selectTerminalListLabel" :key="index">
            <el-table-column v-if="item.type === 'customChecked'" :reserve-selection="true" type="selection" width="55"> </el-table-column>
            <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
          </el-row>
        </el-table>
      </div>
      <div v-if="this.giftCardSchemeForm.status === '01'">
        <!-- 头部搜索表单 begin -->
        <div class="search-form-box">
          <el-form class="search-form-wrapper" :model="searchChannelForm">
            <el-form-item label="渠道aa名称：">
              <el-row
                ><el-col :span="7"> <el-input placeholder="渠道编码或名称" v-model="searchChannelForm.name"></el-input> </el-col
              ></el-row>
            </el-form-item>
          </el-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchSelectTerminal"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchSelectTerminal" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
        <!-- 头部搜索表单 end -->
        <!-- 表格 begin -->
        <el-table
          ref="multipleTable"
          @selection-change="setTerminalSelRow"
          :data="selectTerminalList"
          stripe
          border
          class="scoll"
          :row-key="rowKeys"
          :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        >
          <!-- 循环表格标签以及类型 -->
          <el-row v-for="(item, index) in selectTerminalListLabel" :key="index">
            <el-table-column v-if="item.type === 'customChecked'" width="50">
              <template slot-scope="scope">
                <el-checkbox v-model="scope.row.checksChannelsValue" style="padding-left:10px" @change="checkTerminalChange(scope.row)" />
              </template>
            </el-table-column>
            <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
          </el-row>
        </el-table>
        <!-- 表格 end -->
        <div style="width:100%;display:flex;flex-direction:row-reverse;">
          <span slot="footer" class="dialog-footer">
            <el-button @click="choiceTerminalDialog = false">{{ $t('lang.cancel') }}</el-button>
            <el-button type="primary" @click="choiceTerminalTableClose">{{ $t('lang.preserve') }}</el-button>
          </span>
        </div>
      </div>
    </el-dialog>
    <!-- 选择渠道对话框（礼品卡方案对话框里面）end -->
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
import YpQuillEditor from '@/components/editor/YpQuillEditor.vue'
export default {
  components: {
    YpSearchForm,
    YpTable,
    YpSingleUpload,
    YpQuillEditor
  },
  data() {
    // 校验商品编码唯一性
    const checkProductCode = (rule, value, cb) => {
      var reg = /^\d+$|^\d+[.]?\d+$/
      this.$api.getGiftCardSchemeApi.getCheckProductCode(`${value}`, this.currentProductCodeId).then(res => {
        if (res) {
          return cb(new Error('商品编码重复'))
        } else if (!reg.test(value)) {
          return cb(new Error('请输入纯数字类型的值'))
        } else {
          return cb()
        }
      })
    }
    // 校验商品名称唯一性
    const checkProductName = (rule, value, cb) => {
      this.$api.getGiftCardSchemeApi.getCheckProductName(`${value}`, this.currentProductCodeId).then(res => {
        if (!res) {
          return cb()
        } else {
          return cb(new Error('商品名称重复'))
        }
      })
    }
    // 有效期与面值规则校验
    /**
     * 修改人：wangdandi
     * 修改内容：面值控制1000
     * 时间：2021-09-30
     */
    // var validPeriod = /^\d{1,}$/
    // const checkValidperiod = (rule, value, cb) => {
    //   if (validPeriod.test(value)) {
    //     return cb()
    //   } else {
    //     return cb(new Error('请输入纯数字类型的值'))
    //   }
    // }
    const checkValidperiod = (rule, value, cb) => {
      const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
      if (!reg.test(value) || value > 1000) {
        return cb(new Error('请输入合法的金额数字1-1000，最多两位小数'))
      } else {
        return cb()
      }
    }
    // 校验组织范围
    const checkOrganizationScope = (rule, value, cb) => {
      if (value === '01') {
        return cb()
      } else {
        if (this.giftCardSchemeForm.organizationScopes.length === 0) {
          return cb(new Error('组织范围不可以为空'))
        } else {
          return cb()
        }
      }
    }
    // 校验渠道范围
    const checkChannelsScope = (rule, value, cb) => {
      if (value === '01') {
        return cb()
      } else {
        if (this.giftCardSchemeForm.channelsScopes.length === 0) {
          return cb(new Error('渠道范围不可以为空'))
        } else {
          return cb()
        }
      }
    }
    return {
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg', // 当logo为空时
      checkAllAddValue: false, // 新增时选择组织
      terminalList: [], // 回显去打问题
      organizationTypeList: [], // 组织类型为 true 的数据（用于选择组织对话框中）
      organizationCompare: [], // 没有选择的（用于比较）
      choiceOrganizationCompare: [], // 已经选择的（用于比较）
      arr: [], // 假的空数组

      logoValue: '', // 用来接受默认的 logo（无头像时，默认为平台logo）

      isAllSelect: false, // 用于判断组织表格是否进行了全选
      isSelect: false, // 用于判断组织表格（表体所选）
      isIndeterminate: false, // 选择渠道全选按钮侦听事件
      checkAllValue: false, // 组织全选所绑定的值

      editId: '', // 当点击编辑时，所需要的Id（仅保存）
      currentProductCodeId: '', // 商品编码唯一性校验（新增或编辑的时候，所用到的 Id）
      viewTableId: '', // 用于查看已生效的组织与渠道的表格数据

      giftCardSchemeIsAdd: true, // 控制表头提示（礼品卡方案对话框）

      giftCardSchemeList: [], // 表格（礼品卡方案表格数据）
      selectTerminalList: [], // 表格（选择渠道表格数据）
      checkedTerminalTableList: [], // 表格（用于已经生效的渠道表格）
      selectOrganizationLeftList: [], // 表格（选择组织对话框中表格数据）
      checkedOrganizationTableList: [], // 表格（用于已经生效的组织表格）

      giftCardSchemeTotal: 1, // 礼品卡方案主表格页数总数

      billNumList: [], // 获取卡系列下拉表单数据
      applicationList: [], // 获取卡用途下拉表单数据
      cardTypeList: [], // 获取卡类型下拉表单数据

      giftCardSchemeDialogVisible: false, // 对话框关闭与显示（礼品卡方案新增对话框）
      graphicDetailsDialog: false, // 对话框关闭与显示（图文详情）
      choiceOrganizationDialog: false, // 对话框关闭与显示（选择组织）
      choiceTerminalDialog: false, // 对话框关闭与显示（选择渠道）[{ validator: checkEmail, trigger: 'blur' }],

      // 校验规则
      giftCardSchemeRules: {
        number: [{ required: true, message: '方案编号不可为空', trigger: 'blur' }],
        productCode: [
          { required: true, message: '商品编码不可为空', trigger: 'blur' },
          { validator: checkProductCode, trigger: 'blur' }
        ],
        productName: [
          { required: true, message: '商品名称不可为空', trigger: 'blur' },
          { validator: checkProductName, trigger: 'blur' }
        ],
        faceValue: [
          { required: true, message: '面值不可为空', trigger: 'blur' },
          { validator: checkValidperiod, trigger: 'blur' }
        ],
        published: [{ required: true, trigger: 'blur' }],
        // organizationScope: [{ required: true, trigger: 'blur' }],
        channelsScope: [
          { required: true, trigger: 'blur' },
          { validator: checkChannelsScope, trigger: 'blur' }
        ],
        cardType: [{ required: true, message: '请选择卡类型', trigger: 'blur' }],
        validPeriod: [
          { required: true, message: '请输入有效期月数，0为无限期', trigger: 'blur' },
          { validator: checkValidperiod, trigger: 'blur' }
        ],
        logo: [{ required: true, message: 'logo不可为空', trigger: 'blur' }],
        coverType: [{ required: true, message: '请选择卡类型', trigger: 'blur' }],
        organizationScope: [
          { required: true, trigger: 'blur' },
          { validator: checkOrganizationScope, trigger: 'blur' }
        ]
      },

      searchGiftCardSchemeForm: {
        info: '',
        status: '',
        published: '',
        cardType: '',
        pageIndex: 1,
        pageSize: 20
      }, // 头部搜索框表单数据（主搜索）

      giftCardSchemeForm: {
        status: '',
        number: '',
        productCode: '',
        productName: '',
        faceValue: '',
        published: false,
        cardType: '1',
        billNum: '',
        application: '',
        validPeriod: '',
        organizationScopes: [],
        organizationScope: '01',
        channelsScopes: [],
        channelsScope: '01',
        details: '',
        description: '',
        logo: '',
        coverType: '1',
        coverPicture: '',
        coverColor: '#AB82E8'
      }, // 对话框表单数据（礼品卡方案新增与查看详情对话框）

      searchChannelForm: {
        name: '',
        status: true,
        userCode: ''
      }, // 选择渠道搜索表单数据

      searchSelectOrganizationLeftForm: {
        code: '',
        organizationTypeId: '',
        publish: true,
        formats: '',
        parent: '',
        excludeUser: '',
        userCode: ''
      } // 选择组织左方头部表头搜索数据
    }
  },
  computed: {
    // 卡所绑定的卡名称
    cardName() {
      if (this.giftCardSchemeForm.productName === '') {
        return '暂无名称'
      } else {
        return this.giftCardSchemeForm.productName
      }
    },
    // 卡所绑定的说明详情
    descriptionValue() {
      if (this.giftCardSchemeForm.description === '') {
        return ''
      } else {
        return this.giftCardSchemeForm.description
      }
    },
    // 卡所绑定的面值
    faceValueCopy() {
      if (this.giftCardSchemeForm.faceValue === '') {
        return ''
      } else {
        return this.giftCardSchemeForm.faceValue + '.00' + '元'
      }
    },
    // 卡所绑定的钱
    moneyCopy() {
      if (this.giftCardSchemeForm.faceValue === '') {
        return '￥' + ' ' + '.00'
      } else {
        return '￥' + this.giftCardSchemeForm.faceValue + '.00'
      }
    },
    // 背景颜色
    giftBackground() {
      if (this.giftCardSchemeForm.coverType === '1') {
        return this.giftCardSchemeForm.coverColor
      } else {
        return this.giftCardSchemeForm.coverPicture
      }
    },
    // 头部搜索框表单数据
    searchGiftCardSchemeFormLabel() {
      return [
        { label: '商品：', prop: 'info', type: 'input', placeholder: '商品名称或编码' },
        {
          label: '状态：',
          prop: 'status',
          type: 'select',
          options: [
            { value: '01', label: '未生效' },
            { value: '02', label: '已生效' },
            { value: '03', label: '已作废' }
          ]
        },
        {
          label: '是否上架：',
          prop: 'published',
          type: 'select',
          options: [
            { value: true, label: '上架' },
            { value: false, label: '下架' }
          ]
        },
        {
          label: '卡类型：',
          prop: 'cardType',
          type: 'select',
          options: this.cardTypeList
        }
      ]
    },
    // 头部表头搜索框数据（用于选择组织搜索）
    searchSelectOrganizationLeftFormLabel() {
      return [
        { label: '组织：', prop: 'code', type: 'input' },
        {
          label: '组织类型：',
          prop: 'organizationTypeId',
          type: 'select',
          options: this.organizationTypeList
        }
      ]
    },
    // 表格（礼品卡方案主表格）
    giftCardSchemeListLabel() {
      return [
        { label: '操作', type: 'operation' },
        // { label: '选择', type: 'customChecked' },
        { label: '方案编号', props: 'number' },
        { label: '商品编码', props: 'productCode' },
        { label: '商品名称', props: 'productName' },
        { label: '面值', props: 'faceValue', type: 'right' },
        { label: '是否上架', props: 'published', type: 'switch', method: 'switchChange' },
        {
          label: '卡类型',
          props: 'cardType',
          type: 'status',
          render: row => {
            if (row.cardType === '1') {
              return '电子卡'
            } else if (row.cardType === '2') {
              return '实体卡'
            }
          }
        },
        { label: '说明', props: 'description' },
        {
          label: '状态',
          props: 'status',
          type: 'status',
          render: row => {
            if (row.status === '01') {
              return '未生效'
            } else if (row.status === '02') {
              return '已生效'
            } else if (row.status === '03') {
              return '已作废'
            }
          }
        },
        { label: '修改者', props: 'updateBy' },
        { label: '修改时间', props: 'updateTime', type: 'time' }
      ]
    },
    // 表格（选择渠道表格）
    selectTerminalListLabel() {
      return [
        { label: '渠道名称', props: 'channelsName' },
        { label: '全选', type: 'customChecked', props: 'checked' },
        { label: '渠道编码', props: 'channelsCode' }
      ]
    },
    // 表格（选择组织对话框左边的表格数据）
    selectOrganizationLeftListLabel() {
      return [
        { label: '组织类型', props: 'organizationTypeName' },
        { label: '全选', type: 'customChecked', props: 'checked' },
        { label: '组织编码', props: 'code' },
        { label: '组织名称', props: 'name' }
      ]
    },
    // 表格（选择组织对话框右边的表格数据）
    selectOrganizationRightListLabel() {
      return [
        { label: '组织类型', props: 'organizationTypeName' },
        { label: '全选', type: 'customChecked', props: 'checked' },
        { label: '组织编码', props: 'organizationCode' },
        { label: '组织名称', props: 'organizationName' }
      ]
    }
  },
  created() {
    this.getBillNumList() // 获取卡系列下拉表单数据
    this.getApplicationList() // 获取卡用途下拉表单数据
    this.getCardTypeList() // 获取卡类型下拉表达数据
    this.getGiftCardSchemeList() // 获取表格数据（礼品卡方案主表格）
    this.getLogo() // 获取平台logo
    window.addEventListener('resize', this.getHeight)
    this.getHeight() // 样式问题
  },
  methods: {
    // 获取 row-key 值（渠道 左）
    rowKeys(row) {
      return row.id
    },
    // 获取 row-key 值（渠道 右）
    getRowKeys(row) {
      return row.id
    },
    // 颜色选择器的 Change 事件
    pickerColorChange(color) {
      console.log(color)
    },
    // 用于表格样式问题
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
      // console.log(this.height)
    },
    // 表格 switch 事件
    async switchChange(row) {
      console.log('switchChange')
      console.log(row)
      if (row.published === false) {
        const confirmResult = await this.$confirm('此操作将会使礼品卡方案下架，是否继续此操作？', this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.getGiftCardSchemeList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          if (row.status === '01') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: '状态未生效不可以进行修改状态',
              type: 'warning'
            })
            row.published = !row.published
          } else if (row.status === '02') {
            console.log(row.published)
            const obj = {}
            obj.published = row.published
            this.$api.putGiftCardSchemeApi.putGiftStatusPublished(row.id, obj).then(res => {
              console.log(res)
              this.getGiftCardSchemeList()
            })
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          } else if (row.status === '03') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: '状态已作废不可以进行修改状态',
              type: 'warning'
            })
            row.published = !row.published
          }
        }
      } else {
        const confirmResult = await this.$confirm('此操作将会使礼品卡方案上架，是否继续此操作？', this.$t('lang.tip'), {
          confirmButtonText: this.$t('lang.confirm'),
          cancelButtonText: this.$t('lang.cancel'),
          type: 'warning'
        }).catch(err => err)
        if (confirmResult !== 'confirm') {
          this.getGiftCardSchemeList()
          return this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optCancel'),
            type: 'info'
          })
        } else {
          if (row.status === '01') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: '状态未生效不可以进行修改状态',
              type: 'warning'
            })
            row.published = !row.published
          } else if (row.status === '02') {
            console.log(row.published)
            const obj = {}
            obj.published = row.published
            this.$api.putGiftCardSchemeApi.putGiftStatusPublished(row.id, obj).then(res => {
              console.log(res)
              this.getGiftCardSchemeList()
            })
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          } else if (row.status === '03') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: '状态已作废不可以进行修改状态',
              type: 'warning'
            })
            row.published = !row.published
          }
        }
      }
    },
    // arr1:原数组   arr2:与原数组重复的数组
    remove(arr1, arr2) {
      for (let i = 0; i < arr2.length; i++) {
        console.log(arr2[i])
        for (let j = 0; j < arr1.length; j++) {
          console.log(arr1[j])
          if (arr2[i].code === arr1[j].code) {
            var indexs = arr1.indexOf(arr1[j])
            console.log(indexs)
            arr1.splice(indexs, 1)
          }
        }
      }
      return arr1
    },
    // 编辑礼品卡方案
    showEditGiftCardSchemeDialog(row) {
      this.viewTableId = row.id // 用于获取已生效的组织与渠道的表格数据
      this.getOrganizationTableList() // organizationCompare（存放正常的组织表格）
      this.getCheckedOrganizationTable() // choiceOrganizationCompare（存放已经选中的表格）
      console.log('showEditChannelDialog')
      console.log(row)
      this.editId = row.id // 用于编辑
      this.getChannelList() // 获取渠道
      this.getChoiceOrganizationLeftList() // 选择组织对话框获取数据
      this.getCheckedTerminalTable() // 获取已经生效的渠道信息
      this.currentProductCodeId = row.id // 用于进行校验编码与名称唯一性
      this.getGiftCardSchemeListById(row.id) // 通过 Id 获取某一行数据内容
      this.giftCardSchemeIsAdd = false // 控制对话框表头提示内容
      this.giftCardSchemeDialogVisible = true // 控制礼品卡对话框的现实与隐藏
      console.log(this.$refs.myQuillEditor)
    },
    // 根据 Id 获取单个礼品卡方案数据
    getGiftCardSchemeListById(id) {
      console.log('getGiftCardSchemeListById')
      this.$api.getGiftCardSchemeApi.getGiftCardSchemeListById(id).then(res => {
        console.log(res)
        this.giftCardSchemeForm = res
        if (res.status === '01') {
          console.log('状态为未生效')
          if (res.organizationScope === '02') {
            this.giftCardSchemeForm.organizationScopes = []
            console.log('组织范围为限制')
            this.$api.getGiftCardSchemeApi.getCheckedOrganizationTable(this.viewTableId).then(res => {
              res.map(item => {
                this.giftCardSchemeForm.organizationScopes.push(item.organizationId)
              })
            })
          }
          if (res.channelsScope === '02') {
            this.giftCardSchemeForm.channelsScopes = []
            console.log('渠道范围为限制')
            this.$api.getGiftCardSchemeApi.getCheckedTerminalTable(this.viewTableId).then(res => {
              res.map(item => {
                this.giftCardSchemeForm.channelsScopes.push(item.channelsId)
              })
            })
          }
        }
      })
    },
    // 新增礼品卡方案
    showAddGiftCardSchemeDialog() {
      this.getOrganizationTableList()
      this.giftCardSchemeForm.logo = this.logoValue
      console.log('showAddGiftCardSchemeDialog')
      // this.getChannelList()
      this.currentProductCodeId = ''
      this.getChannelList() // 获取渠道
      this.giftCardSchemeIsAdd = true // 控制礼品卡方案标题
      this.giftCardSchemeDialogVisible = true // 控制礼品卡方案新增与编辑对话框
      this.getChoiceOrganizationLeftList() // 选择组织对话框获取数据
    },
    // 仅保存事件
    onlyPreservation() {
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.giftCardSchemeIsAdd) {
          this.giftCardSchemeForm.status = '01'
          this.$api.postGiftCardSchemeApi.postGiftCardSchemeList(this.giftCardSchemeForm).then(res => {
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: '操作成功',
                type: 'success'
              })
            }
            console.log(res)
            this.getGiftCardSchemeList()
            this.giftCardSchemeDialogVisible = false
          })
        } else {
          this.giftCardSchemeForm.status = '01'
          this.$api.putGiftCardSchemeApi.putGiftCardSchemeList(this.editId, this.giftCardSchemeForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: '操作成功',
                type: 'success'
              })
            }
            this.getGiftCardSchemeList()
            this.giftCardSchemeDialogVisible = false
          })
        }
      })
      // this.giftCardSchemeDialogVisible = false
    },
    // 保存并生效按钮事件
    keepAndTakeEffect() {
      console.log('keepAndTakeEffect')
      this.$refs.formRef.validate(valid => {
        if (!valid) return
        if (this.giftCardSchemeIsAdd) {
          console.log('onlyPreservation')
          this.giftCardSchemeForm.status = '02'
          this.$api.postGiftCardSchemeApi.postGiftCardSchemeList(this.giftCardSchemeForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: '操作成功',
                type: 'success'
              })
            }
            this.getGiftCardSchemeList()
            this.giftCardSchemeDialogVisible = false
          })
        } else {
          this.giftCardSchemeForm.status = '02'
          this.$api.putGiftCardSchemeApi.putGiftCardSchemeList(this.editId, this.giftCardSchemeForm).then(res => {
            console.log(res)
            if (res.code === '200000') {
              this.$notify({
                title: this.$t('lang.tip'),
                message: '操作成功',
                type: 'success'
              })
            }
            this.getGiftCardSchemeList()
            this.giftCardSchemeDialogVisible = false
          })
        }
      })
      // this.giftCardSchemeDialogVisible = false
    },
    // 选择渠道保存事件
    choiceTerminalTableDialog() {
      console.log('choiceTerminalTableDialog')
      console.log(this.giftCardSchemeForm.channelsScopes)
      this.choiceTerminalDialog = false
    },
    // 未生效已选择的渠道最后点击保存按钮
    choiceTerminalTableClose() {
      this.giftCardSchemeForm.channelsScopes = []
      console.log(this.selectTerminalList)
      this.selectTerminalList.map(item => {
        if (item.checksChannelsValue === true) {
          this.giftCardSchemeForm.channelsScopes.push(item.id)
        }
      })
      console.log(this.giftCardSchemeForm.channelsScopes)
      this.choiceTerminalDialog = false
      // this.terminalList.map(item => {
      // })
      // this.
    },
    // 生效事件（礼品卡方案表格里面的生效按钮）
    async takeEffectEvent(row) {
      console.log('takeEffectEvent')
      console.log(row)
      const confirmResult = await this.$confirm('此操作将会使此礼品卡方案生效，是否继续此操作？', this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getGiftCardSchemeList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const obj = {}
        obj.status = '02'
        this.$api.putGiftCardSchemeApi.putGiftStatusPublished(row.id, obj).then(res => {
          console.log(res)
          this.getGiftCardSchemeList()
        })
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
      }
    },
    // 作废事件（礼品卡方案表格里面的作废按钮）
    async toVoidEvent(row) {
      console.log('toVoidEvent')
      console.log(row)
      const confirmResult = await this.$confirm('此操作将会使此礼品卡方案作废，是否继续此操作？', this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getGiftCardSchemeList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        if (row.published === false) {
          const obj = {}
          obj.status = '03'
          this.$api.putGiftCardSchemeApi.putGiftStatusPublished(row.id, obj).then(res => {
            console.log(res)
            this.getGiftCardSchemeList()
          })
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        } else {
          this.$notify({
            title: this.$t('lang.tip'),
            message: '状态为开启，不允许作废',
            type: 'warning'
          })
        }
      }
    },
    // 重置礼品卡方案头部表单（主搜索表单）
    resetSearchGiftCardScheme() {
      console.log('resetSearchGiftCardScheme')
      this.searchGiftCardSchemeForm = {
        info: '',
        status: '',
        published: '',
        cardType: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getGiftCardSchemeList()
    },
    // 重置选择组织头部表单
    resetSearchChioceOrganization() {
      console.log('resetSearchChioceOrganization')
      this.searchSelectOrganizationLeftForm = {
        code: '',
        organizationTypeId: '',
        publish: true,
        formats: '',
        parent: '',
        excludeUser: '',
        userCode: ''
      }
      this.getChoiceOrganizationLeftList()
    },
    // 重置选择渠道搜索表单
    resetSearchSelectTerminal() {
      console.log('resetSearchSelectTerminal')
      this.searchChannelForm = {
        name: '',
        status: true,
        userCode: ''
      }
      this.getChannelList()
    },
    // 搜索礼品卡方案表单（主表单）
    searchGiftCardScheme() {
      console.log('searchGiftCardScheme')
      this.getGiftCardSchemeList()
    },
    // 搜索选择组织表单
    searchChioceOrganization() {
      console.log('searchChioceOrganization')
      this.getChoiceOrganizationLeftList()
    },
    // 搜索选择渠道搜索表单
    searchSelectTerminal() {
      console.log('searchSelectTerminal')
      this.getChannelList()
    },
    // 切换分页条数（主分页）
    giftCardSchemeHandleSizeChange(newPage) {
      this.searchGiftCardSchemeForm.pageSize = newPage
      this.getGiftCardSchemeList()
    },
    // 切换分页（主分页）
    giftCardSchemeHandleCurrentChange(newPage) {
      this.searchGiftCardSchemeForm.pageIndex = newPage
      this.getGiftCardSchemeList()
    },
    // 关闭：对话框关闭所触发的事件（新增与查看详情：礼品卡方案对话框）
    giftCardSchemeCloseDialog() {
      console.log('giftCardSchemeCloseDialog')
      this.giftCardSchemeForm = {
        status: '',
        number: '',
        productCode: '',
        productName: '',
        faceValue: '',
        published: false,
        cardType: '1',
        billNum: '',
        application: '',
        validPeriod: '',
        organizationScopes: [],
        organizationScope: '01',
        channelsScopes: [],
        channelsScope: '01',
        details: '',
        description: '',
        logo: '',
        coverType: '1',
        coverPicture: '',
        coverColor: '#AB82E8'
      }
      this.$refs.formRef.resetFields()
      if (this.giftCardSchemeIsAdd === true) {
        this.giftCardSchemeForm.organizationScopes = []
        console.log(this.giftCardSchemeForm.channelsScopes)
        this.$refs.multipleTable.clearSelection() // 清空选择渠道的全选样式状态
        this.giftCardSchemeForm.channelsScopes = [] // 使所选择的渠道 id 数组为空
      }
    },
    // 关闭：对话框触发事件（选择渠道对话框表单侦听事件）
    choiceTerminalCloseDialog() {
      console.log('choiceTerminalCloseDialog')
      console.log(this.giftCardSchemeForm.channelsScopes)
    },
    // 关闭：对话框触发事件（选择组织对话框表单侦听事件）
    choiceOrganizationCloseDialog() {
      console.log('choiceOrganizationCloseDialog')
    },
    // 图文详情（对话框打开事件）
    graphicDetails() {
      console.log('graphicDetails')
      this.graphicDetailsDialog = true
    },
    // 显示选择组织对话框事件
    showChoiceOrganizationDialog() {
      console.log('showChoiceOrganizationDialog')
      this.getOrganizationTypeLeft()
      if (this.giftCardSchemeIsAdd === false) {
        if (this.organizationCompare.length > 1) {
          console.log(this.organizationCompare)
          this.giftCardSchemeForm.organizationScopes = []
          // 进行 Id 的匹配
          for (var i = 0; i < this.organizationCompare.length; i++) {
            for (var j = 0; j < this.choiceOrganizationCompare.length; j++) {
              if (this.organizationCompare[i].id === this.choiceOrganizationCompare[j].organizationId) {
                this.organizationCompare[i].checks = true
              }
            }
          }
          const arr = JSON.parse(JSON.stringify(this.organizationCompare))
          // 用来进行逆向递归函数的使用
          const newArr = arr.filter(v => {
            return v.parentId === '0'
          })
          this.organizationCompare = newArr
          console.log(this.organizationCompare)
          // this.organizationCompare
          this.handelMakeTree(newArr, arr)
          console.log(this.organizationCompare)
          this.choiceOrganizationDialog = true
          this.choiceOrganizationCompare.map(item => {
            this.giftCardSchemeForm.organizationScopes.push(item.organizationId)
          })
        }
      } else {
        // this.getChoiceOrganizationLeftList()
      }
      this.choiceOrganizationDialog = true
    },
    // 显示已经生效的组织表格数据
    showCheckedOrganizationDialog() {
      this.getCheckedOrganizationTable()
      this.choiceOrganizationDialog = true
    },
    // 查看已经生效的渠道表格数据
    showCheckedTerminalDialog() {
      this.getCheckedTerminalTable()
      this.choiceTerminalDialog = true
    },
    // 显示选择渠道对话框事件
    showChoiceTerminalDialog() {
      console.log('showChoiceTerminalDialog')
      if (this.giftCardSchemeIsAdd === false) {
        console.log('11111')
        console.log(this.terminalList)
        console.log(this.selectTerminalList)
        for (var x = 0; x < this.terminalList.length; x++) {
          for (var r = 0; r < this.selectTerminalList.length; r++) {
            if (this.terminalList[x].channelsId === this.selectTerminalList[r].id) {
              console.log('222')
              this.selectTerminalList[r].checksChannelsValue = true
              console.log(this.selectTerminalList[r].checksChannelsValue)
            }
            // console.log('1')
          }
        }
        // this.terminalList
      }
      this.choiceTerminalDialog = true
    },
    // 获取表格数据（礼品卡方案主表格）
    getGiftCardSchemeList() {
      this.$api.getGiftCardSchemeApi.getGiftCardSchemeList(this.searchGiftCardSchemeForm).then(res => {
        console.log(res)
        this.giftCardSchemeList = res.data
        this.giftCardSchemeTotal = res.total
      })
    },
    // 获取表格数据（选择渠道表格）
    getChannelList() {
      console.log('getChannelList')
      this.selectTerminalList = []
      this.$api.getChannelApi.getChannelList(this.searchChannelForm).then(res => {
        console.log(res)
        res.map(item => {
          item.checksChannelsValue = false
          this.selectTerminalList.push({ id: item.id, channelsCode: item.code, channelsName: item.name, checksChannelsValue: item.checksChannelsValue })
        })
      })
      console.log(this.selectTerminalList)
    },
    // 获取表格数据（用于选择组织对话框）
    getChoiceOrganizationLeftList() {
      console.log('getChoiceOrganizationLeftList')
      this.$api.getOrganizationManagementApi.getOrganizationManagementsList(this.searchSelectOrganizationLeftForm).then(res => {
        console.log(res)
        this.selectOrganizationLeftList = res
      })
    },
    // 获取表格数据（用于已生效的组织对话框表格数据）
    getCheckedOrganizationTable() {
      this.checkedOrganizationTableList = []
      console.log('getCheckedOrganizationTable')
      this.$api.getGiftCardSchemeApi.getCheckedOrganizationTable(this.viewTableId).then(res => {
        console.log(res)
        this.checkedOrganizationTableList = res
        this.choiceOrganizationCompare = res
        console.log(this.checkedOrganizationTableList)
      })
    },
    // 获取表格数据（用于已生效的渠道对话框表格数据）
    getCheckedTerminalTable() {
      this.$api.getGiftCardSchemeApi.getCheckedTerminalTable(this.viewTableId).then(res => {
        console.log('getCheckedTerminalTable')
        console.log(res)
        this.checkedTerminalTableList = res
        this.terminalList = res
        console.log(this.checkedTerminalTableList)
      })
    },
    // 获取组织类型（用于选择组织对话框中搜索表单中的组织类型之中）
    getOrganizationTypeLeft() {
      this.organizationTypeList = []
      console.log('getOrganizationTypeLeft')
      this.$api.getOrganizationTypeApi.getPerOrgList().then(res => {
        console.log(res)
        res.data.map(item => {
          this.organizationTypeList.push({ value: item.id, label: item.name })
        })
      })
    },
    // 获取卡系列下拉数据（从数据字典中获取）
    getBillNumList() {
      this.billNumList = []
      const obj = {}
      obj.ddCode = '10022'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        // console.log(res)
        res.map(item => {
          this.billNumList.push({ value: item.code, label: item.name })
        })
      })
      // console.log(this.billNumList)
    },
    // 获取卡用途数据列表（从数据字典中获取）
    getApplicationList() {
      this.applicationList = []
      const obj = {}
      obj.ddCode = '10021'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        res.map(item => {
          this.applicationList.push({ value: item.code, label: item.name })
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
    },
    // 获取平台 logo（用于选择礼品卡方案对话框中logo默认）
    getLogo() {
      this.$api.getOrganizationManagementApi.getOrganizationsTop().then(res => {
        this.logoValue = res.logo
      })
    },
    // 全选按钮事件（渠道表格【用于新增时候，进行赋值 Id 的事件】）
    setTerminalSelRow(res) {
      this.giftCardSchemeForm.channelsScopes = []
      console.log(res)
      res.map(item => {
        this.giftCardSchemeForm.channelsScopes.push(item.id)
      })
      console.log(this.giftCardSchemeForm.channelsScopes)
    },
    // 全选按钮事件（渠道表格【用于新增时候，进行赋值 Id 的事件】【右边】）
    setTerminalRightSelRow() {
      console.log('setTerminalRightSelRow')
    },
    // 点击编辑时，回显
    checkTerminalChange(row) {
      console.log(row)
    },
    // 获取组织管理网状形表格数据
    getOrganizationTableList() {
      this.$api.getOrganizationManagementApi.getOrganizationManagementInGift().then(res => {
        console.log(res)
        res.map(item => {
          item.checks = false
        })
        this.organizationCompare = res
        console.log(res)
      })
    },
    // 逆向递归函数（组织网状表格转化成树形表格）
    handelMakeTree(nodes, arr) {
      console.log(arr) // 数组
      console.log(nodes) // 0
      nodes.forEach(v => {
        console.log(v)
        v.organizations = arr.filter(v1 => {
          return v1.parentId === v.id
        })
        console.log(v.organizations)
        if (v.organizations.length > 0) {
          console.log('22222222222')
          this.handelMakeTree(v.organizations, arr)
        }
      })
    },
    // 所选组织最后确保按钮
    organizationButton() {
      console.log('organizationButton')
      console.log(this.giftCardSchemeForm.organizationScopes)
      // 进行匹配 Id
      for (var i = 0; i < this.giftCardSchemeForm.organizationScopes.length; i++) {
        for (var j = i + 1; j < this.giftCardSchemeForm.organizationScopes.length; j++) {
          if (this.giftCardSchemeForm.organizationScopes[i] === this.giftCardSchemeForm.organizationScopes[j]) {
            this.giftCardSchemeForm.organizationScopes.splice(j, 1)
            j--
          }
        }
      }
      // 最后进行现实判断（新增时候进行判断）
      if (this.giftCardSchemeIsAdd === true) {
        this.giftCardSchemeForm.organizationScopes = []
        this.getCheckValueBox(this.selectOrganizationLeftList)
      } else {
        this.giftCardSchemeForm.organizationScopes = []
        this.getCheckValueBox(this.organizationCompare)
      }
      this.choiceOrganizationDialog = false
      console.log(this.giftCardSchemeForm.organizationScopes)
    },
    getCheckValueBox(data) {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i])
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = []
        } else {
          this.getCheckValueBox(data[i].organizations)
        }
        if (data[i].checks === true) {
          this.giftCardSchemeForm.organizationScopes.push(data[i].id)
          console.log(this.giftCardSchemeForm.organizationScopes)
        }
      }

      return data
    },
    // 组织全选按钮
    checkAllIn(all) {
      console.log(all)
      console.log('我选择了全部')
      this.giftCardSchemeForm.organizationScopes = []
      this.getAllTreeData(this.$refs.multipleTableOrganization.data)
    },
    getAllTreeData(data) {
      for (var i = 0; i < data.length; i++) {
        console.log(data[i])
        this.$set(data[i], 'checks', this.checkAllValue)
        if (data[i].checks === true) {
          this.giftCardSchemeForm.organizationScopes.push(data[i].id)
        }
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = []
        } else {
          this.getAllTreeData(data[i].organizations)
        }
        console.log(this.giftCardSchemeForm.organizationScopes)
      }
      return data
    },
    // 单个组织全选按钮
    checkChange(row) {
      console.log('checkChange')
      // 父选子（样式问题）
      if (row.organizations) {
        if (row.checks) {
          row.organizations.map(item => {
            this.$set(item, 'checks', true)
            if (item.organizations) {
              item.organizations.map(item => {
                this.$set(item, 'checks', true)
              })
            }
          })
          this.$set(row, 'checks', true)
        } else {
          row.organizations.map(item => {
            this.$set(item, 'checks', false)
            if (item.organizations) {
              item.organizations.map(item => {
                this.$set(item, 'checks', false)
              })
            }
          })
          this.$set(row, 'checks', false)
        }
      }
      // 父选子（数据问题）
      this.arr.push(row)
      if (this.giftCardSchemeIsAdd === true) {
        this.giftCardSchemeForm.organizationScopes = []
        this.getGiftCardTreeData(this.arr)
      } else {
        this.getGiftCardTreeData(this.arr)
      }
    },
    getGiftCardTreeData(data) {
      // // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = []
        } else {
          this.getGiftCardTreeData(data[i].organizations)
        }
      }
      return data
    }
  }
}
</script>
<style scoped>
.form-content {
  width: 100%;
  height: 500px;
}
.form-content-organization {
  width: 100%;
  height: 500px;
}
.backgroundColor {
  width: 335px;
  height: 199px;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border-radius: 20px;
}
.background-logo {
  width: 100%;
  margin-top: 5px;
  margin-left: 10px;
}
.cardName {
  width: 100%;
  /* height: 35px; */
  margin-left: 6px;
  margin-right: 10px;
  font-size: 14px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #fff;
}
.logo-img {
  border-radius: 50%;
  margin: 0;
  padding: 0;
  width: 30px;
  height: 30px;
}
.logo-name {
  display: flex;
  justify-content: space-evenly;
}
.selectOrganizationLeft {
  width: 100%;
  height: 700px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: 20px;
}
.card-faceValue {
  margin-top: 18px;
  margin-right: 5px;
  font-size: 11px;
  color: #fff;
}
.actully-money {
  width: 100%;
  font-size: 11px;
  font-weight: 600;
  margin-top: 22px;
  margin-bottom: 65px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}
.details-descrtion {
  margin-left: 10px;
  font-size: 9px;
  width: 92%;
  color: #fff;
}
.fuzhu {
  width: 10px;
  height: 10px;
}
.card-name {
  margin-top: -7px;
}
</style>

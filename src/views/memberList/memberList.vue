<!--
 * @FileDescription: 会员列表
 * @Author: qiaokun
 * @Date: 2020-12-02
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-01-29 10:26:52
 -->
<template>
  <div>
    <!-- 新增按钮 begin -->
    <el-button class="add-btn" size="mini" type="primary" @click="showAddMemberDialog">{{ this.$t('lang.add') }}</el-button>
    <!-- 新增按钮 end -->
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchMembermLabel" :formData="searchMemberForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div></yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchMember"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchMember" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 会员列表数据表格 start -->
    <yp-table :propArr="memberListLabel" :listInfo="memberList" @updateStatus="updateStatus" :height="height">
      <template v-slot:tableItem="scope">
        <span v-if="scope.scope.paidMember"
          ><img class="member-icon" src="../../assets/images/member-icon.png" alt="" /><span>{{ scope.scope.realName }}</span></span
        >
        <span v-else>{{ scope.scope.realName }}</span>
      </template>
      <template v-slot:button="scope">
        <el-button type="text" icon="el-icon-search" @click="showViewMemberDialog(scope.scope)">{{ $t('lang.viewDetails') }}</el-button>
        <el-button type="text" @click="handlePointEdit(scope.scope)">{{ $t('lang.pointEdit') }}</el-button>
      </template>
    </yp-table>
    <!-- 会员列表数据表格 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchMemberForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchMemberForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <el-dialog
      v-dialogDrag
      :close-on-click-modal="false"
      :title="isAdd ? $t('lang.add') : $t('lang.viewDetails')"
      :visible.sync="dialogVisible"
      :lock-scroll="false"
      :append-to-body="true"
      width="80%"
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? $t('lang.add') : $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- <yp-form :formData="permissionForm" :formLabel="permissionFormLabel" :formRule="permissionFormRule" ref="ypForm"></yp-form> -->
      <el-main class="form-content scoll">
        <el-form :label-position="'right'" ref="memberFormAllRef" label-width="auto" :model="memberForm" :rules="memberFormRule">
          <el-row class="top-wrapper">
            <el-col :span="6" class="avatar">
              <div class="avatar-wrapper">
                <img v-if="!isAdd && paidMember && memberForm.avatar" class="member-icon" src="../../assets/images/member-icon.png" alt="">
                <img :src="noAvatar" alt="" class="no-avatar" v-show="memberForm.avatar ? false : true" />
                <yp-single-upload class="upload" :utype="'memberAvatar'" :url.sync="memberForm.avatar"></yp-single-upload>
                <!-- <span style="color:#6699ff;fontSize:10px;" v-show="memberForm.avatar ? false : true">建议不超过120像素*120像素，大小500kb内，正方形，jpg、jpeg或png格式 </span> -->
                <span style="color:#6699ff;fontSize:10px;marginTop:10px;" v-show="memberForm.avatar ? false : true">提示：建议不超过120像素*120像素，大小500kb内，正方形 </span>
              </div>
            </el-col>
            <el-col :span="18" class="member-label">
              <el-main class="member-label-wrapper scoll">
                <el-row>
                  <el-col :span="20">
                    <span v-show="memberAndTagMappingList.length < 1">暂无会员标签</span>
                    <el-tag class="member-tag" v-show="memberAndTagMappingList.length >= 1" v-for="item in memberAndTagMappingList" :key="item.id" effect="plain">
                      {{ item.name }}
                    </el-tag></el-col
                  >
                  <el-col :span="4">
                    <el-button type="primary" size="mini" v-show="!isAdd" @click="showManageMemberTagDialog">管理会员标签</el-button>
                  </el-col>
                </el-row>
              </el-main>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="会员卡号:">
                <el-input v-model.trim="memberForm.cardNumber" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="姓名:">
                <el-input v-model.trim="memberForm.realName"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model.trim="memberForm.phone"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="合并卡号:">
                <el-input v-model.trim="memberForm.mergeCardNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="会员等级:">
                <el-select v-model="memberForm.cardLevelCode" placeholder="请选择" style="width:100%;" disabled>
                  <el-option v-for="item in detailCardLevelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别:">
                <el-select v-model="memberForm.gender" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生日:">
                <el-date-picker v-model="memberForm.birthday" style="width:100%;" @change="selectBirthday" :picker-options="pickerOptions" type="date" value-format="timestamp" placeholder="选择生日">
                </el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="年龄:">
                <el-input v-model.trim="age" placeholder="根据生日自动计算" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="等级变更日期:">
                <!-- <el-input v-model.trim="memberForm.cardLevelTime" disabled></el-input> -->
                <el-date-picker v-model="memberForm.cardLevelTime" style="width:100%;" disabled type="date" value-format="timestamp" placeholder="等级变更日期"></el-date-picker>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="昵称:">
                <el-input v-model.trim="memberForm.nickname"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="民族:">
                <el-select v-model.trim="memberForm.nation" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in nationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱:" prop="email">
                <el-input v-model.trim="memberForm.email"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="有效状态:">
                <el-select v-model="memberForm.status" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件类型:">
                <el-select v-model="memberForm.certificateType" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in certificateTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件号码:" prop="idCard">
                <el-input v-model.trim="memberForm.idCard"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册日期:">
                <el-date-picker v-model.trim="memberForm.registrationDate" style="width:100%;" type="date" value-format="timestamp" disabled></el-date-picker>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="注册企业:">
                <el-input v-model.trim="memberForm.registrationCompanyId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册组织:" prop="registrationOrganizationCode">
                <el-select v-model="memberForm.registrationOrganizationCode" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in organizationList" :key="item.code" :label="item.name" :value="item.code"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册渠道:">
                <el-select v-model="memberForm.registrationChannelCode" placeholder="请选择" disabled style="width:100%;">
                  <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册终端:">
                <el-select v-model="memberForm.registrationTerminalCode" placeholder="请选择" disabled style="width:100%;">
                  <el-option v-for="item in terminalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职业:">
                <el-select v-model="memberForm.professional" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in professionalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职务:">
                <el-select v-model="memberForm.position" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="企业名称:">
                <el-input v-model.trim="memberForm.company"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工龄:">
                <el-select v-model="memberForm.workingYears" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in workingYearsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="月收入:">
                <el-select v-model="memberForm.monthlyIncome" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in monthlyIncomeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文化水平:">
                <el-select v-model="memberForm.diploma" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in diplomaList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="宗教信仰:">
                <el-select v-model="memberForm.religion" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in religionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="家庭状况:">
                <el-select v-model="memberForm.familyStatus" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in familyStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="婚姻状况:">
                <el-select v-model="memberForm.maritalStatus" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in maritalStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="政治面貌:">
                <el-select v-model="memberForm.politicsStatus" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in politicsStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出行方式:">
                <el-select v-model="memberForm.tripMode" placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in tripModeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号:" prop="carNumber">
                <el-input v-model.trim="memberForm.carNumber"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="推荐会员:">
                <el-input v-model.trim="memberForm.referrerMemberId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="推荐员工:">
                <el-input v-model.trim="memberForm.referrerUserId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="服务员工:">
                <el-input v-model.trim="memberForm.serviceUserId"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原会员卡号:">
                <el-input v-model.trim="memberForm.oldCardNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div v-show="isAdd ? false : true">
          <el-row style="margin-bottom:20px;"
            ><el-col :span="2"> <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 账户信息</span></el-col></el-row
          >
          <!-- 主表格内容 begin -->
          <!-- <yp-table :propArr="memberAccountListLabel" :listInfo="memberAccountList"> </yp-table> -->
          <el-table :data="memberAccountList" stripe border :header-cell-style="{ background: '#eef1f6', color: '#606266', textAlign: 'center' }">
            <el-row v-for="(item, index) in memberAccountListLabel" :key="index">
              <el-table-column v-if="item.type === 'operation'" :prop="item.props" :label="item.label" align="center">
                <template slot-scope="scope">
                  <el-button type="text" @click="viewMemberAccountDetails(scope.row)">查看详情</el-button>
                </template>
              </el-table-column>
              <el-table-column v-else-if="item.type === 'codeName'" :prop="item.props" :label="item.label" align="center">
                <template slot-scope="scope">
                  {{ item.render(scope.row) }}
                </template>
              </el-table-column>
              <!-- 显示默认值 -->
              <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'right'"></el-table-column>
            </el-row>
          </el-table>
        </div>
        <div>
          <el-row style="margin-top:20px;">
            <el-col :span="2"> <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 地址信息</span></el-col>
            <el-col :span="2" :offset="20">
              <el-button type="primary" size="mini" @click="addAddress" style="margin-bottom:20px;">新增地址</el-button>
            </el-col>
          </el-row>
        </div>
        <el-form :model="memberForm" ref="memberFormRef" :rules="addressFormRule">
          <el-table :data="memberForm.memberAddressList" border>
            <el-table-column label="地址类型" align="center">
              <template slot="header">
                <span style="color:red;">*</span>
                <span>地址类型</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.type'" :rules="addressFormRule.type">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.type">
                    <el-option v-for="selectItem in typeList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在国家" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.country'" :rules="addressFormRule.country">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.country" @focus="selectCountry(scope.row)">
                    <el-option v-for="selectItem in scope.row.countryList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在省份" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.state'" :rules="addressFormRule.state">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.state" @focus="selectState(scope.row)" @change="clearState(scope.row)">
                    <el-option v-for="selectItem in scope.row.stateList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在城市" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.city'" :rules="addressFormRule.city">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.city" @focus="selectCity(scope.row)">
                    <el-option v-for="selectItem in scope.row.cityList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在区" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.district'" :rules="addressFormRule.district">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.district" @focus="selectDistrict(scope.row)">
                    <el-option v-for="selectItem in scope.row.districtList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在街道" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.street'" :rules="addressFormRule.street">
                  <el-input v-model.trim="scope.row.street"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="详细地址" align="center">
              <template slot="header">
                <span style="color:red;">*</span>
                <span>详细地址</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.address'" :rules="addressFormRule.address">
                  <el-input v-model.trim="scope.row.address"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="操作" v-if="isAdd ? true : false">
              <template slot-scope="scope">
                <el-button type="text" :disabled="isAdd ? false : true" @click="deleteAddress(scope)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirm">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 选择标签对话框 begin -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      title="选择会员标签"
      :visible.sync="manageMemberTagDialog"
      width="55%"
      :close-on-click-modal="false"
      @close="closeMemberTagDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '选择会员标签' }}
        </div>
      </template>
      <div class="search-form-box-wrapper">
        <el-form :model="searchSelectMemberTagForm" label-width="80px" label-position="left">
          <div class="form-content" style="display:flex;">
            <div v-for="(item, index) in searchSelectMemberTagFormLabel" :key="index">
              <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                <el-input v-model.trim="searchSelectMemberTagForm[item.prop]" placeholder="输入标签名称" clearable></el-input>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="search-btn-wrapper">
          <el-button
            class="reset-btn"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="resetSearchMemberTag"
            size="mini"
            icon="el-icon-refresh-left"
            >{{ this.$t('lang.reset') }}</el-button
          >
          <el-button class="search-btn" type="primary" @click="searchMemberTag" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          <el-checkbox class="is-show-select" @change="isAllShowSelectedMemberTags" v-model="isShowSelectedMemberTags">显示已选中标签</el-checkbox>
        </div>
      </div>
      <el-alert show-icon title="提示:默认显示的是已选中标签，可以取消选中，来删除标签!" type="info"> </el-alert>
      <el-table
        :data="selectMemberTagList"
        stripe
        border
        height="500"
        class="scoll"
        :default-expand-all="true"
        row-key="id"
        :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        :tree-props="{ children: 'memberTags' }"
        ><el-table-column v-if="!isShowSelectedMemberTags" align="center" width="50"> </el-table-column>
        <el-row v-for="(item, index) in selectMemberTagListLabel" :key="index">
          <el-table-column v-if="item.type === 'tag'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <el-tag effect="plain" :type="item.renderStyle(scope.row)">{{ item.render(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'checkedAll'" width="50" align="center" :label="item.label">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row[item.props]" @change="selectMemberTagCheck(scope.row, $event)" :disabled="scope.row.level === '3' ? false : true"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'switch'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row[item.props]" :disabled="item.disabled ? true : false"> </el-switch>
            </template>
          </el-table-column>
          <!-- 显示默认值 -->
          <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
        </el-row>
      </el-table>
      <!-- </el-main> -->
      <!-- 选择标签对话框中的表格 end -->

      <span slot="footer" class="dialog-footer">
        <el-button @click="manageMemberTagDialog = false">{{ $t('lang.cancel') }}</el-button>
        <el-button type="primary" @click="confirmManageMemberTag">{{ $t('lang.preserve') }}</el-button>
      </span>
    </el-dialog>
    <!-- 账户积分明细列表 add by qiaokun 2021/01/25 begin-->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      title="积分明细"
      :visible.sync="memberAccountDialog"
      width="80%"
      :close-on-click-modal="false"
      @close="closeMemberAccountDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '积分明细' }}
        </div>
      </template>
      <el-row>
        <div class="search-form-box-wrapper" :style="{ height: isBrandFold ? '40px' : '130px' }">
          <el-form :model="searchPointListForm" label-width="auto" label-position="left">
            <el-row>
              <el-col :span="7" v-for="(item, index) in showSearchList" :key="index">
                <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                  <el-input v-model.trim="searchPointListForm[item.prop]" style="width:auto" :placeholder="item.placeholder" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
                  <el-select v-model="searchPointListForm[item.prop]" filterable style="width:auto" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" clearable>
                    <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="item.type === 'time'" :label="item.label" :prop="item.prop">
                  <el-date-picker style="width:auto" value-format="yyyy-MM-dd HH-mm-ss" v-model="searchPointListForm[item.props]" type="datetime" :placeholder="item.placeholder"> </el-date-picker>
                </el-form-item>
              </el-col>
              <el-button size="mini" style="marginTop:5px;marginLeft:20px;" v-show="searchPointListFormLabel.length > 3" @click="changeIsBrandFold"
                ><span>{{ isBrandFold ? '更多查询' : '收起查询' }}</span
                ><i :class="isBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
              ></el-button>
            </el-row>
          </el-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchPointList"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchPointList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
      </el-row>
      <el-table :data="pointListList" height="300" stripe border row-key="id" :header-cell-style="{ background: '#eef1f6', color: '#606266' }"
        ><el-table-column v-if="!isShowSelectedMemberTags" align="center" width="50"> </el-table-column>
        <el-row v-for="(item, index) in pointListListLabel" :key="index">
          <el-table-column v-if="item.type === 'tag'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <el-tag effect="plain" :type="item.renderStyle(scope.row)">{{ item.render(scope.row) }}</el-tag>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'index'" width="70px" type="index" align="center" :label="item.label"></el-table-column>
          <el-table-column v-else-if="item.type === 'checkedAll'" width="50" align="center" :label="item.label">
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row[item.props]" @change="selectMemberTagCheck(scope.row, $event)" :disabled="scope.row.level === '3' ? false : true"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'switch'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              <el-switch v-model="scope.row[item.props]" :disabled="item.disabled ? true : false"> </el-switch>
            </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'time'" :prop="item.props" :label="item.label" align="center" :width="item.width">
            <template slot-scope="scope"> {{ scope.row[item.props] | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }} </template>
          </el-table-column>
          <el-table-column v-else-if="item.type === 'codeName'" :prop="item.props" :label="item.label" align="center">
            <template slot-scope="scope">
              {{ item.render(scope.row) }}
            </template>
          </el-table-column>
          <!-- 显示默认值 -->
          <el-table-column v-else :prop="item.props" :label="item.label" :align="item.position ? item.position : 'center'"></el-table-column>
        </el-row>
      </el-table>
      <!-- 分页 begin -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <el-pagination
            @size-change="handlePointListSizeChange"
            @current-change="handlePointListCurrentChange"
            :current-page="searchPointListForm.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchPointListForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="pointListTotal"
          >
          </el-pagination>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="memberAccountDialog = false">{{ '关闭' }}</el-button>
      </span>
    </el-dialog>
    <!-- 账户积分明细列表 add by qiaokun 2021/01/25 end -->
    <!-- member growthList  add by qiaokun 2021/06/23  start -->
    <el-dialog
      :lock-scroll="false"
      :append-to-body="true"
      v-dialogDrag
      title="成长值明细"
      :visible.sync="memberGrowthListDialog"
      width="80%"
      :close-on-click-modal="false"
      @close="closeMemberGrowthListDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '成长值明细' }}
        </div>
      </template>
      <el-row>
        <div class="search-form-box-wrapper" :style="{ height: isBrandFold ? '40px' : '80px' }">
          <el-form :model="searchGrowthListForm" label-width="auto" label-position="left">
            <el-row>
              <el-col :span="7" v-for="(item, index) in showGrowthSearchList" :key="index">
                <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
                  <el-input v-model.trim="searchGrowthListForm[item.prop]" style="width:auto" :placeholder="item.placeholder" clearable></el-input>
                </el-form-item>
                <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
                  <el-select v-model="searchGrowthListForm[item.prop]" filterable style="width:auto" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" clearable>
                    <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
                <el-form-item v-if="item.type === 'time'" :label="item.label" :prop="item.prop">
                  <el-date-picker style="width:auto" value-format="yyyy-MM-dd HH-mm-ss" v-model="searchGrowthListForm[item.props]" type="datetime" :placeholder="item.placeholder"> </el-date-picker>
                </el-form-item>
              </el-col>
              <el-button size="mini" style="marginTop:5px;marginLeft:20px;" v-show="searchGrowthListFormLabel.length > 3" @click="changeIsBrandFold"
                ><span>{{ isBrandFold ? '更多查询' : '收起查询' }}</span
                ><i :class="isBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
              ></el-button>
            </el-row>
          </el-form>
          <div class="search-btn-wrapper">
            <el-button
              class="reset-btn"
              :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
              @click="resetSearchGrowthList"
              size="mini"
              icon="el-icon-refresh-left"
              >{{ this.$t('lang.reset') }}</el-button
            >
            <el-button class="search-btn" type="primary" @click="searchGrowthList" size="mini" icon="el-icon-search">{{ this.$t('lang.search') }}</el-button>
          </div>
        </div>
      </el-row>
      <!-- 主表格内容 begin -->
      <yp-table :propArr="growthListListLabel" :listInfo="growthListList" style="width: 100%" :height="'300'">
        <template v-slot:button="scope">
          <el-button type="text" icon="el-icon-search" v-permission="{ action: 'viewDetails', effect: 'disabled' }" @click="showEditPointListDialog(scope.scope)">{{
            $t('lang.viewDetails')
          }}</el-button>
        </template>
      </yp-table>
      <!-- 分页 begin -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <el-pagination
            @size-change="handleGrowthSizeChange"
            @current-change="handleGrowthCurrentChange"
            :current-page="searchGrowthListForm.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchGrowthListForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="growthTotal"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 分页 end -->
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="memberGrowthListDialog = false">{{ '关闭' }}</el-button>
      </span>
    </el-dialog>
    <!-- member growthList  add by qiaokun 2021/06/23  end -->
    <!-- 储值明细弹框 修改人:wangdandi 时间：2021-09-27 start -->
    <el-dialog v-dialogDrag :close-on-click-modal="false" title="储值明细" :visible.sync="dataSavingsActivityDialogVisible" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          储值明细
        </div>
      </template>
      <!-- 储值明细搜索区域 start -->
      <div class="search-form-box">
        <yp-search-form class="search-form-wrapper" :formLabel="searchDataSavingsActivityFormLabel" :formData="searchDataSavingsActivityForm"></yp-search-form>
        <div class="search-btn-wrapper">
          <el-button
            class="reset-btn"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="resetSearchsearchDataSavingsActivityForm"
            size="mini"
            icon="el-icon-refresh-left"
            >重置</el-button
          >
          <el-button class="search-btn" type="primary" @click="searchsearchDataSavingsActivityForm" size="mini" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <!-- 储值明细搜索区域 end -->
      <!-- 储值明细数据列表 start -->
      <el-table :data="dataSavingsActivityList" style="width: 100%" border :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column type="index" label="序号" align="center" width="50"> </el-table-column>
        <el-table-column prop="cardNumber" label="会员卡号" align="center"> </el-table-column>
        <el-table-column prop="nickname" label="昵称" align="center"> </el-table-column>
        <el-table-column prop="gender" label="性别" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.gender === '0'">{{ scope.row.gender }}-未知</span>
            <span v-if="scope.row.gender === '1'">{{ scope.row.gender }}-男</span>
            <span v-if="scope.row.gender === '2'">{{ scope.row.gender }}-女</span>
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="手机号" align="center" width="150"> </el-table-column>
        <el-table-column prop="createTime" label="发生时间" align="center" width="180"> </el-table-column>
        <el-table-column prop="type" label="类型" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.type === '1'">{{ scope.row.type }}-充值</span>
            <span v-if="scope.row.type === '2'">{{ scope.row.type }}-消费</span>
            <span v-if="scope.row.type === '3'">{{ scope.row.type }}-退款</span>
          </template>
        </el-table-column>
        <el-table-column prop="amount" label="金额" align="center"> </el-table-column>
        <el-table-column prop="givenAmount" label="赠送金额" align="center"> </el-table-column>
        <el-table-column prop="couponTemplateCode" label="赠送优惠券" align="center" width="170"> </el-table-column>
        <el-table-column prop="balance" label="余额" align="center"> </el-table-column>
        <el-table-column prop="organizationName" label="来源组织" align="center"> </el-table-column>
        <el-table-column prop="channelsName" label="来源渠道" align="center"> </el-table-column>
        <el-table-column prop="terminalsName" label="来源终端" align="center"> </el-table-column>
        <el-table-column prop="billNum" label="单据号" align="center"> </el-table-column>
        <el-table-column prop="description" label="备注" align="center"> </el-table-column>
        <el-table-column prop="number" label="充值活动" align="center"> </el-table-column>
      </el-table>
      <!-- 储值明细数据列表 end -->
      <!-- 储值明细分页 start -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <el-pagination
            @size-change="dataSavingsHandleSizeChange"
            @current-change="dataSavingsHandleCurrentChange"
            :current-page="searchDataSavingsActivityForm.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="searchDataSavingsActivityForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totals"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 储值明细分页 end -->
    </el-dialog>
    <!-- 数据弹框 end -->
    <!-- 储值明细弹框 修改人:wangdandi 时间：2021-09-27 end -->
    <!--积分调整弹框start-->
    <el-dialog v-dialogDrag width="30%" :close-on-click-modal="false" :visible.sync="pointEditDialogVisible">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          积分调整
        </div>
      </template>
      <el-form ref="formRefPoint" :model="pointEditForm" :rules="pointRules" label-width="80px" style="width:80%;padding-left:20px;">
        <el-form-item label="积分调整" prop="pointEditNum">
          <div style="display: flex">
            <el-input clearable type="number" placeholder="请输入积分" @input="onInput()" v-model.trim="pointEditForm.pointEditNum"></el-input>
            <el-checkbox v-model="isPointReduce" label="积分扣减" style="margin-left:20px;" />
          </div>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="pointEditForm.description" placeholder="请输入备注"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <div class="point_dialogFooter">
          <el-button @click="pointEditDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSavePointEdit">保存</el-button>
        </div>
      </template>
    </el-dialog>
    <!--积分调整弹框end-->
    <!--确认是否提交积分调整dialog start-->
    <el-dialog width="30%" v-dialogDrag :close-on-click-modal="false" :visible.sync="pointEditSureDialogVisible">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          积分调整
        </div>
      </template>
      <div class="point_dialogBody">
        <div class="point_account">会员账户：{{ currentMemberName }}，{{ currentMemberPhone }}</div>
        <div>
          <span class="point_text" :class="isPointReduce ? 'point_text_orange' : 'point_text_blue'">
            <span v-if="isPointReduce">-</span>
            <span v-else>+</span>
            {{ pointEditForm.pointEditNum }}&nbsp;&nbsp;</span
          >
          <span class="point_text">积分, 是否确认？</span>
        </div>
      </div>
      <template #footer>
        <div class="point_dialogFooter">
          <el-button @click="pointEditSureDialogVisible = false">取消</el-button>
          <el-button type="primary" @click="handleSure">确认</el-button>
        </div>
      </template>
    </el-dialog>
    <!--确认是否提交积分调整dialog end-->
  </div>
</template>

<script>
import YpTable from '@/components/table/YpTable.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
import { parseTime } from '@/filters/format.js'
import { Loading } from 'element-ui'
export default {
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  components: {
    YpTable,
    YpSearchForm,
    YpSingleUpload
  },
  data() {
    // 校验手机号规则
    const checkPhone = (rule, value, cb) => {
      const phoneRegMobile = /^1(3|4|5|6|7|8|9)\d{9}$/
      const telRegMobile = /^0\d{2,3}-?\d{7,8}$/
      if (phoneRegMobile.test(value) | telRegMobile.test(value)) {
        cb()
      } else {
        cb(Error(this.$t('lang.truephone')))
      }
    }
    // 邮箱校验规则
    const checkEmail = (rule, value, cb) => {
      const email = /^([a-zA-Z]|[0-9])(\w|\\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/
      if (value === '' || !value) {
        return cb()
      } else {
        if (!email.test(value)) {
          return cb(Error('请输入正确的邮箱格式'))
        } else {
          return cb()
        }
      }
    }
    // 车牌号校验规则 含有新能源车牌号
    const carPhoneValid = (rule, value, callback) => {
      const plateNumber = /^([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}(([0-9]{5}[DF])|([DF]([A-HJ-NP-Z0-9])[0-9]{4})))|([京津沪渝冀豫云辽黑湘皖鲁新苏浙赣鄂桂甘晋蒙陕吉闽贵粤青藏川宁琼使领A-Z]{1}[A-Z]{1}[A-HJ-NP-Z0-9]{4}[A-HJ-NP-Z0-9挂学警港澳]{1})$/
      if (value === '' || !value) {
        callback()
      } else {
        if (plateNumber.test(value)) {
          callback()
        } else {
          callback(new Error('请输入正确的车牌号'))
        }
      }
    }
    /**
     * 身份证号码校验
     */
    const checkIdCard = (rule, value, callback) => {
      if (this.memberForm.certificateType === '01' && value !== '') {
        if (value && (!/\d{17}[\d|x]|\d{15}/.test(value) || (value.length !== 15 && value.length !== 18))) {
          callback(new Error('身份证号码不符合规范'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    /*
     * 校验积分
     * */
    const checkPoint = (rule, value, callback) => {
      if (this.isPointReduce) {
        if (Math.abs(value) > 999999999) {
          return callback(new Error('扣减的积分数值超出范围'))
        }
        if (value > this.pointTotal) {
          return callback(new Error('扣减的积分超出您的当前总积分'))
        }
      }
      return callback()
    }
    return {
      growthOrganizationList: [],
      growthChannelList: [],
      growthTotal: 0,
      growthListList: [], // 成长值列表数据
      memberGrowthListDialog: false,
      loadings: '',
      isShowSelectedMemberTags: true, // 是否显示已选会员标签信息
      selectMemberTagList: [], // 选择会员标签table列表数据
      searchSelectMemberTagForm: {
        pageIndex: 1,
        pageSize: 999,
        name: '',
        level: '',
        memberId: '',
        handmade: true
      }, // 查询会员标签列表表单
      manageMemberTagDialog: false, // 管理会员标签弹出框
      // 生日选择控制
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now()
        }
      },
      memberFormRule: {
        phone: [
          { required: true, message: this.$t('lang.phoneisnotnull'), trigger: 'blur' },
          { validator: checkPhone, trigger: 'blur' }
        ],
        email: [{ validator: checkEmail, trigger: 'blur' }],
        carNumber: [{ validator: carPhoneValid, trigger: 'blur' }],
        idCard: [{ validator: checkIdCard, trigger: 'blur' }],
        registrationOrganizationCode: [{ required: true, message: '请选择', trigger: 'change' }]
      }, // 会员表单校验规则

      isAdd: true, // 判断是否是新增
      age: '',
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg',
      total: 0,
      address: {
        type: '',
        country: '',
        state: '',
        city: '',
        district: '',
        street: '',
        address: ''
      },
      typeList: [], // 选择地址类型下拉列表
      memberList: [], // 会员列表数据
      addressFormRule: {
        country: [{ required: true, message: '请选择', trigger: 'change' }],
        state: [{ required: true, message: '请选择', trigger: 'change' }],
        city: [{ required: true, message: '请选择', trigger: 'change' }],
        district: [{ required: true, message: '请选择', trigger: 'change' }],
        street: [{ required: true, message: '请输入', trigger: 'blur' }],
        address: [{ required: true, message: '请输入', trigger: 'blur' }],
        type: [{ required: true, message: '请选择', trigger: 'change' }]
      },
      dialogVisible: false,
      searchMemberForm: {
        cardInfo: '',
        cardLevelCode: '',
        // 暂时写死
        oldCardNumberCondition: 'eq',
        oldCardNumber: '',
        phone: '',
        beginTime: '',
        endTime: '',
        memberTagId: '',
        paidMember: false,
        pageIndex: 1,
        pageSize: 20,
        status: '',
        filterMemberTagId: '',
        info: '',
        pointFrom: '', // 积分起始范围
        pointTo: '', // 积分结束范围
        storedValueFrom: '', // 储值起始范围
        storedValueTo: '' // 储值结束范围
      }, // 查询会员表单
      cardLevelList: [], // 选择会员等级下拉列表
      genderList: [], // 选择性别下拉列表
      nationList: [], // 选择民族下拉列表
      statusList: [
        { label: '有效', value: true },
        {
          label: '无效',
          value: false
        }
      ], // 选择有效无效列表
      certificateTypeList: [], // 选择证件类型下拉列表
      organizationList: [], // 获取注册组织下拉列表
      channelList: [], // 获取注册渠道下拉列表
      terminalList: [], // 获取注册终端下拉列表
      professionalList: [], //  选择职业下拉列表
      positionList: [], // 选择职务下拉列表
      workingYearsList: [], // 选择工龄下拉列表
      monthlyIncomeList: [], // 选择月收入下拉列表
      diplomaList: [], // 选择文化水平下拉列表
      religionList: [], // 选择宗教信仰下拉列表
      familyStatusList: [], // 选择家庭状况下拉列表
      maritalStatusList: [], // 选择婚姻状况下拉列表
      politicsStatusList: [], // 选择政治面貌下拉列表
      tripModeList: [], // 选择出行方式下拉列表
      selectMemberTagIds: [], // 已经选择的标签的id
      currentMemberId: '', // 当前会员信息Id
      pointTotal: null, // 当前总积分
      currentMemberPhone: '', // 当前会员信息手机号
      currentMemberName: '', // 当前会员姓名
      memberAndTagMappingList: [], // 展示会员标签列表
      memberAccountList: [], // 会员账户信息
      memberForm: {
        avatar: '', // 头像
        cardNumber: '', // 会员卡号
        realName: '', // 真实姓名
        phone: '', // 手机号码
        mergeCardNumber: '', // 合并卡号
        openId: '', // 微信ID
        cardLevelCode: '01', // 会员等级
        gender: '', // 性别
        birthday: '', // 生日
        cardLevelTime: '', // 等级变更日期
        nickname: '', // 昵称
        nation: '01', // 民族
        email: '', // 邮箱
        status: true, // 有效状态
        certificateType: '', // 证件类型
        idCard: '', // 证件号码
        registrationDate: '', // 注册日期
        registrationCompanyId: '', // 注册企业
        registrationOrganizationCode: '', // 注册组织
        registrationChannelCode: '', // 注册渠道
        registrationTerminalCode: '', // 注册终端
        professional: '', // 职业
        position: '', // 职务
        company: '', // 企业名称
        workingYears: '', // 工龄
        monthlyIncome: '', // 月收入
        diploma: '', // 文化水平
        religion: '', // 宗教信仰
        familyStatus: '', // 家庭状况
        maritalStatus: '', // 婚姻状况
        politicsStatus: '', // 政治面貌
        tripMode: '', // 出行方式
        carNumber: '', // 车牌号
        referrerMemberId: '', // 推荐会员
        referrerUserId: '', // 推荐员工
        serviceUserId: '', // 服务员工
        oldCardNumber: '', // 原会员卡号
        memberAddressList: []
      },
      memberAccountDialog: false, // 控制会员账户弹窗 add by qiaokun 2021/01/25
      // 搜索积分明细表头表单数据
      searchPointListForm: {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        cardNumber: '',
        billNum: ''
      },
      // 搜索成长值表头表单数据
      searchGrowthListForm: {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        info: '',
        memberId: '',
        pageSize: 20,
        pageIndex: 1
      },
      pointTypeList: [], // 获取积分类型的下拉表单数据
      organizationAndPointList: [], // 获取来源组织下拉表单数据
      channelAndPointList: [], // 获取来源渠道下拉表单数据
      isBrandFold: true, // 搜索折叠
      pointListList: [], // 积分明细表数据
      pointListTotal: 0,
      // add by qiaokun 2021/01/25
      currentChannelsId: '',
      detailCardLevelList: [],
      /**
       * 修改人：wangdandi
       * 修改内容：储存明细
       * 修改时间：2021-09-27
       */
      dataSavingsActivityDialogVisible: false, // 储值明细弹框
      dataSavingsActivityList: [], // 储值明细列表数据
      // 储值明细搜索参数
      searchDataSavingsActivityForm: {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      },
      totals: 0,
      pointEditDialogVisible: false, // 积分调整弹框
      pointEditSureDialogVisible: false, // 积分调整确认弹出框
      // isSaveBtn: true, // 没有输入积分数字，不允许保存
      pointEditForm: {
        point: null,
        pointEditNum: null, // 复制一份
        description: '',
        organizationCode: '', // 来源组织
        channelsCode: '', // 来源渠道
        terminalsCode: '' // 来源终端
      },
      isPointReduce: true, // 积分默认扣减
      pointRules: {
        pointEditNum: [
          { required: true, pattern: /^[1-9]\d*$/, message: '请输入正整数', trigger: 'blur' },
          { trigger: 'blur', validator: checkPoint }
        ]
      }
    }
  },
  computed: {
    // 成长值明细搜索表头数据
    searchGrowthListFormLabel() {
      return [
        {
          label: '姓名：',
          type: 'input',
          prop: 'info',
          placeholder: this.$t('lang.phoneorname')
        },
        {
          label: '组织范围：',
          type: 'select',
          prop: 'organizationCode',
          options: this.growthOrganizationList
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsCode',
          options: this.growthChannelList
        },
        {
          label: '开始时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: this.$t('lang.selectbegintime')
        },
        {
          label: '结束时间：',
          type: 'time',
          props: 'endTime',
          placeholder: this.$t('lang.selectendtime')
        }
      ]
    },
    // 成长值明细表格数据
    growthListListLabel() {
      return [
        {
          label: '摘要',
          props: 'description'
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '会员卡号',
          props: 'cardNumber',
          width: '160'
        },
        {
          label: '会员等级',
          props: 'levelName'
        },
        {
          label: '会员姓名',
          props: 'realName'
        },
        {
          label: '性别',
          props: 'gender',
          type: 'codeName',
          render: res => {
            if (res.gender === '0') {
              return '0-未知'
            }
            if (res.gender === '1') {
              return '1-男'
            }
            if (res.gender === '2') {
              return '2-女'
            }
          }
        },
        {
          label: '手机号',
          props: 'phone',
          width: '160'
        },
        {
          label: '发生时间',
          props: 'createTime',
          type: 'time',
          width: '160'
        },

        {
          label: '变更前成长值',
          props: 'growthBefore',
          type: 'right',
          width: '170'
        },
        {
          label: '成长值增加',
          props: 'growthAdd',
          type: 'right',
          width: '160'
        },
        {
          label: '成长值减少',
          props: 'growthSubtract',
          type: 'right',
          width: '160'
        },
        {
          label: '变更后成长值',
          props: 'growthAfter',
          type: 'right',
          width: '160'
        },
        {
          label: '来源组织',
          props: 'organizationName',
          width: '160'
        },
        {
          label: '来源渠道',
          props: 'channelsName',
          width: '160'
        },
        {
          label: '来源终端',
          props: 'terminalsName',
          width: '160'
        },
        {
          label: '事件',
          props: 'event',
          width: '160'
        },
        {
          label: '单据号',
          props: 'billNum',
          width: '160'
        }
      ]
    },
    // 积分明细搜索表头数据  add by qiaokun 2021/01/25
    // 积分明细表格数据
    pointListListLabel() {
      return [
        {
          label: '摘要',
          props: 'description'
        },
        {
          label: '序号',
          type: 'index'
        },
        {
          label: '会员卡号',
          props: 'cardNumber'
        },
        {
          label: '姓名',
          props: 'memberName'
        },
        {
          label: '性别',
          props: 'gender'
        },
        {
          label: '手机号',
          props: 'phone'
        },
        {
          label: '发生时间',
          props: 'createTime',
          type: 'time',
          width: '200'
        },
        {
          label: '积分类型',
          props: 'pointTypeName'
        },
        {
          label: '积分种类',
          props: 'species',
          type: 'codeName',
          render: row => {
            if (row.species === '01') {
              return '正常积分'
            } else if (row.species === '02') {
              return '赠送积分'
            }
          }
        },
        {
          label: '变动前积分',
          props: 'pointBefore',
          position: 'right'
        },
        {
          label: '积分增加',
          props: 'pointAdd',
          position: 'right'
        },
        {
          label: '积分减少',
          props: 'pointSubtract',
          position: 'right'
        },
        {
          label: '变更后积分',
          props: 'pointAfter',
          position: 'right'
        },
        {
          label: '来源组织',
          props: 'organizationName'
        },
        {
          label: '来源渠道',
          props: 'channelsName'
        },
        {
          label: '来源终端',
          props: 'terminalsName'
        },
        {
          label: '用途',
          props: 'application'
        },
        {
          label: '事件',
          props: 'event'
        },
        {
          label: '单据号',
          props: 'billNum'
        }
      ]
    },
    // 积分列表折叠写法
    showSearchList: {
      get: function() {
        if (this.isBrandFold) {
          if (this.searchPointListFormLabel.length < 4) {
            return this.searchPointListFormLabel
          }
          const newArr = []
          for (var i = 0; i < 3; i++) {
            const item = this.searchPointListFormLabel[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.searchPointListFormLabel
      },
      set: function(val) {
        this.showSearchList = val
      }
    },
    // 成长值列表折叠写法
    showGrowthSearchList: {
      get: function() {
        if (this.isBrandFold) {
          if (this.searchGrowthListFormLabel.length < 4) {
            return this.searchGrowthListFormLabel
          }
          const newArr = []
          for (var i = 0; i < 3; i++) {
            const item = this.searchGrowthListFormLabel[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.searchGrowthListFormLabel
      },
      set: function(val) {
        this.showGrowthSearchList = val
      }
    },
    searchPointListFormLabel() {
      return [
        {
          label: '单据号：',
          type: 'input',
          prop: 'billNum',
          placeholder: '单据号'
        },
        {
          label: '会员卡号：',
          type: 'input',
          prop: 'cardNumber',
          placeholder: '会员卡号'
        },
        {
          label: '姓名：',
          type: 'input',
          prop: 'info',
          placeholder: '手机号或姓名'
        },
        {
          label: '积分类型：',
          type: 'select',
          prop: 'pointTypeCode',
          options: this.pointTypeList
        },
        {
          label: '来源组织：',
          type: 'select',
          prop: 'organizationCode',
          options: this.organizationAndPointList
        },
        {
          label: '来源渠道：',
          type: 'select',
          prop: 'channelsCode',
          options: this.channelAndPointList
        },
        {
          label: '发生时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: '请选择开始时间'
        },
        {
          label: '发生时间：',
          type: 'time',
          props: 'endTime',
          placeholder: '请选择结束时间'
        }
      ]
    }, // add by qiaokun 2021/01/25 end
    // 查询会员标签表单
    searchSelectMemberTagFormLabel() {
      return [{ label: '标签名称', prop: 'name', type: 'input' }]
    },
    // 选择会员标签表格标题
    selectMemberTagListLabel() {
      return [
        // { label: ' ', type: 'space' },
        { label: '标签描述', props: 'description' },
        { label: '选择', props: 'hasThis', type: 'checkedAll' },
        { label: '标签名称', props: 'name' },
        {
          label: '级别',
          props: 'level',
          type: 'tag',
          render: res => {
            if (res.level === '1') {
              return '一级'
            } else if (res.level === '2') {
              return '二级'
            } else {
              return '三级'
            }
          },
          renderStyle: res => {
            if (res.level === '1') {
              return 'success'
            } else if (res.level === '2') {
              return ''
            } else {
              return 'danger'
            }
          }
        },
        { label: '手工标签', props: 'handmade', type: 'switch', disabled: 'true' }
      ]
    },
    // 查询会员表单标签
    searchMembermLabel() {
      return [
        { label: '会员卡号:', type: 'input', prop: 'cardInfo', placeholder: '卡号或姓名', span: 6 },
        { label: '会员原卡号:', type: 'input', prop: 'oldCardNumber', placeholder: '会员原卡号', span: 6 },
        { label: '手机号:', type: 'input', prop: 'phone', placeholder: '手机号', span: 6 },
        { label: '会员等级:', type: 'select', prop: 'cardLevelCode', options: this.cardLevelList, span: 6 },
        {
          label: '积分范围:',
          type: 'inputrange',
          prop1: 'pointFrom',
          prop2: 'pointTo',
          placeholder1: '起始积分',
          placeholder2: '结束积分',
          span: 8
        },
        {
          label: '储值范围:',
          type: 'inputrange',
          prop1: 'storedValueFrom',
          prop2: 'storedValueTo',
          placeholder1: '起始储值',
          placeholder2: '结束储值',
          span: 9,
          style: { margin: '0 20px' }
        },
        {
          label: '注册日期:',
          type: 'daterange',
          prop1: 'beginTime',
          prop2: 'endTime',
          placeholder1: this.$t('lang.selectbegintime'),
          placeholder2: this.$t('lang.selectendtime'),
          span: 8
        }
      ]
    },
    // 会员账户列表表格标签
    memberAccountListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: '账户类型',
          props: 'type',
          type: 'codeName',
          position: 'center',
          render: row => {
            if (row.type === '01') {
              return row.type + '-积分账户'
            } else if (row.type === '02') {
              return row.type + '-成长值'
            } else if (row.type === '03') {
              return row.type + '-储值明细'
            }
          }
        },
        { label: '总额', props: 'total' },
        { label: '余额', props: 'balance' },
        { label: '赠送额', props: 'gift' },
        { label: '扣减额', props: 'deduction' }
      ]
    },
    // 会员数据列表表格标签
    memberListLabel() {
      return [
        {
          label: this.$t('lang.operation'),
          type: 'operation'
        },
        {
          label: '会员卡号',
          width: 150,
          props: 'cardNumber'
        },
        {
          label: '会员原卡号',
          props: 'oldCardNumber'
        },
        {
          label: '会员姓名',
          props: 'realName',
          width: 160,
          type: 'slot'
        },
        {
          label: '性别',
          props: 'gender',
          type: 'codeName',
          render: res => {
            if (res.gender === '0') {
              return '未知'
            }
            if (res.gender === '1') {
              return '男'
            }
            if (res.gender === '2') {
              return '女'
            }
          }
        },
        {
          label: '手机号',
          props: 'phone'
        },
        {
          label: '会员等级',
          props: 'cardLevelCode',
          type: 'codeName',
          render: res => {
            return res.cardLevelCode + '-' + res.cardLevelName
          }
        },
        {
          label: '积分',
          props: 'pointTotal'
        },
        {
          label: '储值',
          props: 'storedValueTotal'
        },
        {
          label: '有效状态',
          props: 'status',
          type: 'switch',
          method: 'updateStatus',
          disabled: true
        },
        {
          label: '注册日期',
          props: 'registrationDate',
          type: 'date'
        },
        {
          label: '等级变更日期',
          props: 'cardLevelTime',
          type: 'date'
        }
      ]
    },
    // 储值明细搜索
    /**
     * 修改人：wangdandi
     * 修改时间：2021-09-27
     *
     */
    searchDataSavingsActivityFormLabel() {
      return [
        {
          label: '昵称：',
          type: 'input',
          placeholder: '手机号或昵称',
          prop: 'nickname'
        },
        {
          label: '充值活动：',
          type: 'input',
          placeholder: '充值活动编号',
          prop: 'number'
        },
        {
          label: '类型：',
          type: 'select',
          prop: 'type',
          options: [
            { value: '', label: '不限制' },
            { value: '1', label: '1-充值' },
            { value: '2', label: '2-消费' },
            { value: '3', label: '3-退款' }
          ]
        },
        {
          label: '渠道范围：',
          type: 'select',
          prop: 'channelsId',
          options: this.growthChannelList
        },
        {
          label: '发生开始时间：',
          type: 'time',
          props: 'beginTime',
          placeholder: '开始日期'
        },
        {
          label: '发生结束时间：',
          type: 'time',
          props: 'endTime',
          placeholder: '结束日期'
        }
      ]
    }
    // 储值明细搜索 end
  },
  created() {
    // 获取会员列表信息
    this.getMemberList()
    // 获取当前平台信息，处理注册组织、注册渠道、注册终端
    this.getPlatforms()
    // 获取新增、编辑下拉的所有数据
    // 获取会员等级下拉列表
    this.getCardLevelList()
    // 获取性别下拉列表
    this.getGenderList()
    // 获取民族下拉列表
    this.getNationList()
    // 获取证件类型列表
    this.getCertificateTypeList()
    // 获取职业列表
    this.getProfessionalList()
    // 获取职务列表
    this.getPositionList()
    // 获取工龄列表
    this.getWorkingYearsList()
    // 获取月收入列表
    this.getMonthlyIncomeList()
    // 获取文化水平列表
    this.getDiplomaList()
    // 获取宗教信仰列表
    this.getReligionList()
    // 获取家庭状况列表
    this.getFamilyStatusList()
    // 获取婚姻状况列表
    this.getMaritalStatusList()
    // 获取政治面貌列表
    this.getPoliticsStatusList()
    // 获取出行方式列表
    this.getTripModeList()
    // 获取地址类型列表
    this.getTypeList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取平台信息
    this.getPlatformsList()
    this.getOrginationInfo()
  },
  methods: {
    // 从后端获取平台信息
    getPlatformsList() {
      this.$api.getPlatformsApi.getPlatformsList().then(res => {
        this.pointEditForm.organizationCode = res.organizationCode // 来源组织
        this.pointEditForm.channelsCode = res.channelsCode // 来源渠道
        this.pointEditForm.terminalsCode = res.terminalsCode // 来源终端
      })
    },
    getOrginationInfo() {
      // 获取组织相关信息
      this.$api.getOrganizationManagementApi.getOrganizationManagementInGift().then(res => {
        if (res) {
          this.organizationList = res || []
        }
      })
    },
    /**
     * 描述：切换成长值列表分页条数
     */
    handleGrowthSizeChange(newPage) {
      this.searchGrowthListForm.pageSize = newPage
      this.getGrowthListList()
    },
    /**
     * 描述：切换成长值列表分页
     */
    handleGrowthCurrentChange(newPage) {
      this.searchGrowthListForm.pageIndex = newPage
      this.getGrowthListList()
    },
    /**
     * 描述：查询成长值方法
     */
    searchGrowthList() {
      this.searchGrowthListForm.pageIndex = 1
      this.getGrowthListList()
    },
    /**
     * 描述：重置查询成长值方法
     */
    resetSearchGrowthList() {
      this.searchGrowthListForm = {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: this.currentMemberPhone,
        pageSize: 20,
        pageIndex: 1,
        memberId: ''
      }
      this.getGrowthListList()
    },
    // 从后端获取成长值明细表格数据
    getGrowthListList() {
      this.$api.getGrowthListApi.getGrowthListList(this.searchGrowthListForm).then(res => {
        this.growthListList = res.data
        this.growthTotal = res.total
      })
    },
    closeMemberGrowthListDialog() {
      this.searchGrowthListForm = {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: this.currentMemberPhone,
        pageSize: 20,
        pageIndex: 1,
        memberId: ''
      }
    },
    // add by qiaokun 2021/01/25
    // 积分明细查询重置
    resetSearchPointList() {
      this.searchPointListForm.beginTime = ''
      this.searchPointListForm.endTime = ''
      this.searchPointListForm.channelsCode = ''
      this.searchPointListForm.pointTypeCode = ''
      this.searchPointListForm.organizationCode = ''
      this.searchPointListForm.info = this.currentMemberPhone
      this.searchPointListForm.pageSize = 20
      this.searchPointListForm.pageIndex = 1
      this.searchPointListForm.memberId = ''
      this.searchPointListForm.billNum = ''
      this.searchPointListForm.cardNumber = ''
      this.getPointListList()
    },
    searchPointList() {
      this.searchPointListForm.info = ''
      this.searchPointListForm.memberId = ''
      this.searchPointListForm.pageIndex = 1
      this.getPointListList()
    },
    // 切换积分明细条数
    handlePointListSizeChange(newPageSize) {
      this.searchPointListForm.pageSize = newPageSize
      this.getPointListList()
    },
    // 切换积分明细页码
    handlePointListCurrentChange(newPage) {
      this.searchPointListForm.pageIndex = newPage
      this.getPointListList()
    },
    // 改变查询折叠按钮
    changeIsBrandFold() {
      this.isBrandFold = !this.isBrandFold
    },
    /**
     * 描述：储值明细数据列表
     */
    getDataSavingsActivityList() {
      this.$api.getActivityApi.getDataSavingsActivityList(this.searchDataSavingsActivityForm).then(res => {
        this.dataSavingsActivityList = res.data
        this.totals = res.total
      })
    },
    // 查看会员账户详情
    viewMemberAccountDetails(row) {
      this.isBrandFold = true
      // 查看会员积分详情
      if (row.type === '01') {
        this.searchPointListForm.memberId = row.memberId
        this.getPointTypeList()
        this.getOrganizationList()
        this.getChannelList()
        this.getPointListList()
        this.memberAccountDialog = true
      }
      // 查看会员成长值详情
      if (row.type === '02') {
        console.log('查看会员成长值详情')
        this.getGrowthOrganizationList() // 获取成长值来源组织
        this.getGrowthChannelList() // 获取成长值来源渠道
        this.getGrowthListList()
        this.memberGrowthListDialog = true
      }
      // 查看会员储值明细
      if (row.type === '03') {
        this.dataSavingsActivityDialogVisible = true // 显示弹框
        this.searchDataSavingsActivityForm.pageIndex = 1
        // this.searchDataSavingsActivityForm.nickname = row.nickname
        this.getDataSavingsActivityList()
        // 渠道范围接口
        this.growthChannelList = []
        this.$api.getChannelApi.getDataChannelsList().then(res => {
          console.log(res)
          res.map(item => {
            this.growthChannelList.push({ value: item.id, label: item.name })
          })
        })
      }
    },
    // 获取来源组织
    getGrowthOrganizationList() {
      console.log('getChannelList')
      this.growthOrganizationList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getMemberList(res)
      })
    },

    /**
     * 描述：储值明细重置搜索
     */
    resetSearchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm = {
        nickname: '', // 昵称
        type: '', // 类型
        channelsId: '', // 渠道范围
        number: '',
        beginTime: '',
        endTime: '',
        pageIndex: 1,
        pageSize: 20
      }
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：查询储值明细
     */
    searchsearchDataSavingsActivityForm() {
      this.searchDataSavingsActivityForm.pageIndex = 1
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页条数
     */
    dataSavingsHandleSizeChange(newPage) {
      this.searchDataSavingsActivityForm.pageSize = newPage
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细切换分页
     */
    dataSavingsHandleCurrentChange(newPage) {
      this.searchDataSavingsActivityForm.pageIndex = newPage
      this.getDataSavingsActivityList()
    },
    /**
     * 修改人：wangdandi
     * 修改时间：2021-09-27
     * 修改内容：添加储值明细弹框
     * end
     *
     */
    getGrowthTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        this.growthOrganizationList.push({ value: data[i].code, label: data[i].name })
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = undefined
        } else {
          // organizations若不为空数组，则继续 递归调用 本方法
          this.getGrowthTreeData(data[i].organizations)
        }
      }
      return data
    },
    // 获取来源渠道
    getGrowthChannelList() {
      this.growthChannelList = []
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log(res)
        res.map(item => {
          this.growthChannelList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 从后端获取积分明细表格数据
    getPointListList() {
      console.log(this.searchPointListForm)
      this.$api.getPointListApi.getPointListList(this.searchPointListForm).then(res => {
        this.pointListList = res.data
        this.pointListTotal = res.total
      })
    },
    // 关闭会员账户详情
    closeMemberAccountDialog() {
      this.searchPointListForm.beginTime = ''
      this.searchPointListForm.endTime = ''
      this.searchPointListForm.channelsId = ''
      this.searchPointListForm.pointTypeId = ''
      this.searchPointListForm.organizationId = ''
      this.searchPointListForm.info = this.currentMemberPhone
      this.searchPointListForm.pageSize = 20
      this.searchPointListForm.pageIndex = 1
      this.searchPointListForm.memberId = ''
    },
    // 获取积分类型
    getPointTypeList() {
      const obj = {}
      obj.species = ''
      obj.info = ''
      obj.status = ''
      obj.pageIndex = 1
      obj.pageSize = 999
      this.pointTypeList = []
      this.$api.getPointTypeApi.getPointTypeList(obj).then(res => {
        res.data.map(item => {
          this.pointTypeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取来源组织
    getOrganizationList() {
      this.organizationAndPointList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getTreeData(res)
      })
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        this.organizationAndPointList.push({ value: data[i].code, label: data[i].name })
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = undefined
        } else {
          // organizations若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].organizations)
        }
      }
      return data
    },
    // 获取来源渠道
    getChannelList() {
      this.channelAndPointList = []
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log(res)
        res.map(item => {
          this.channelAndPointList.push({ value: item.code, label: item.name })
        })
      })
    },

    // add by qiaokun 2021/01/25  end
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    // 更新组织类型的状态 add by qiaokun 2020-12-27
    async updateStatus(val) {
      const confirmResult = await this.$confirm(this.$t('lang.confirmOperation'), this.$t('lang.tip'), {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      // 如果用户确认，则返回字符串 confirm
      // 如果用户取消了,则返回字符串 cancel
      if (confirmResult !== 'confirm') {
        this.getMemberList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const obj = {}
        obj.id = val.id
        obj.status = val.status
        this.$api.putMemberApi.putMemberStatus(val.id, obj).then(res => {
          console.log(res)
          if (res.code === '200000') this.getMemberList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
        })
      }
    },
    // 获取当前平台信息
    getPlatforms() {
      /* update by qiaokun 2021-05-17 新增时候将id换成code start */
      // this.organizationList = [] // 获取注册组织下拉列表
      this.channelList = [] // 获取注册渠道下拉列表
      this.terminalList = [] // 获取注册终端下拉列表
      this.$api.getPlatformsApi.getPlatformsList().then(res => {
        if (this.isAdd) {
          this.memberForm.registrationOrganizationCode = res.organizationCode
          this.memberForm.registrationTerminalCode = res.terminalsCode
          this.memberForm.registrationChannelCode = res.channelsCode
        }
        // 获取组织相关信息
        // this.$api.getOrganizationManagementApi.getOrganizationManagementsByCode(this.memberForm.registrationOrganizationCode).then(res => {
        //   if (res) {
        //     this.organizationList = res
        //   }
        // })
        // 获取注册渠道相关信息
        this.$api.getChannelApi.getChannelByCode(this.memberForm.registrationChannelCode).then(res => {
          this.currentChannelsId = res[0].id
          const obj = {}
          obj.value = res[0].code
          obj.label = res[0].name
          this.channelList.push(obj)
        })
        const obj = {}
        obj.channelsId = this.currentChannelsId
        obj.terminalsId = ''
        this.$api.getChannelTerminalApi.getChannelTerminalList(obj).then(res => {
          res.map(item => {
            this.terminalList.push({ label: item.terminalsName, value: item.terminalsCode })
          })
        })
      })
      /* update by qiaokun 2021-05-17 新增时候将id换成code end */
    },
    // 切换分页条数方法
    handleSizeChange(newPage) {
      this.searchMemberForm.pageSize = newPage
      this.getMemberList()
    },
    // 切换分页
    handleCurrentChange(newPage) {
      this.searchMemberForm.pageIndex = newPage
      this.getMemberList()
    },
    // 获取会员列表数据
    getMemberList() {
      this.$api.getMemberApi.getMemberList(this.searchMemberForm).then(res => {
        this.total = res.total
        this.memberList = res.data
      })
    },
    // 查看会员详情（编辑）
    showViewMemberDialog(row) {
      this.isAdd = false
      this.currentMemberId = row.id
      this.paidMember = row.paidMember
      const option = {
        lock: true,
        background: '#fff'
      }
      this.loadings = Loading.service(option)
      this.getMemberById(row.id)
      // this.getPlatforms()
      this.getMemberAndTagMapping()
    },
    // 显示积分调整弹框
    handlePointEdit(row) {
      this.pointTotal = row.pointTotal
      this.currentMemberId = row.id
      this.currentMemberPhone = row.phone
      this.currentMemberName = row.realName
      this.pointEditDialogVisible = true
      // 每次dialog显示时置空
      this.isPointReduce = true
      this.pointEditForm.pointEditNum = null
      this.pointEditForm.description = ''
    },
    onInput() {
      this.$forceUpdate()
    },
    // 保存积分调整
    handleSavePointEdit() {
      this.$refs.formRefPoint.validate(valide => {
        if (valide) {
          // 如果勾选积分扣减，传值为负数，反之正数
          this.pointEditSureDialogVisible = true
          if (this.isPointReduce) {
            this.pointEditForm.point = Number(0 - this.pointEditForm.pointEditNum)
          } else {
            this.pointEditForm.point = Number(this.pointEditForm.pointEditNum)
          }
        }
      })
    },
    changeInput(value) {
      if (Math.abs(value) > 999999999) {
        return
      }
      this.pointEditForm.pointEditNum = value.replace(/^(0+)|[^\d]+/g, '')
      // this.pointEditForm.pointEditNum = Number(value.replace('-', ''))
    },
    // 是否确认提交积分调整
    handleSure() {
      delete this.pointEditForm.pointEditNum
      this.$api.postPointEditApi.postPointEdit(this.currentMemberId, this.pointEditForm).then(res => {
        if (res.code === '200000') {
          this.getMemberList()
          this.$notify({
            title: this.$t('lang.tip'),
            message: this.$t('lang.optSuccess'),
            type: 'success'
          })
          this.pointEditSureDialogVisible = false
          this.pointEditDialogVisible = false
        } else {
          // 返回失败直接回到填写积分页面
          setTimeout(() => {
            this.pointEditSureDialogVisible = false
          }, 2000)
        }
      })
    },
    // 管理会员标签弹出框
    showManageMemberTagDialog() {
      this.isShowSelectedMemberTags = true
      this.manageMemberTagDialog = true
      this.getMemberAndTagMapping()
    },
    // 是否展示全部会员标签
    isAllShowSelectedMemberTags(e) {
      if (e) {
        this.getMemberAndTagMapping()
      } else {
        this.searchSelectMemberTagForm.name = ''
        this.getSelectMemberTagList()
      }
    },
    // 根据会员id查询会员标签
    getMemberAndTagMapping() {
      const obj = {}
      obj.name = ''
      obj.level = ''
      obj.pageIndex = 1
      obj.pageSize = 999
      obj.memberId = this.currentMemberId
      obj.handmade = ''
      this.$api.getMemberTagApi.getMemberTagList(obj).then(res => {
        this.selectMemberTagList = res.data
        this.selectMemberTagList = this.selectMemberTagList.filter(item => {
          return item.hasThis === true
        })
        this.memberAndTagMappingList = this.selectMemberTagList
      })
    },
    // 获取全部会员全部标签列表
    getSelectMemberTagList() {
      if (!this.searchSelectMemberTagForm.name) {
        this.$api.getMemberTagApi.getMemberTagList(this.searchSelectMemberTagForm).then(res => {
          console.log(res)
          // this.selectMemberTagList = res.data
          const arr = res.data.filter(v => {
            return v.parentId === '0'
          })
          console.log(arr)
          this.selectMemberTagList = arr
          console.log(this.selectMemberTagList)
          this.handelMakeTree(arr, res.data)
          // console.log(arr)
          this.manageMemberTagDialog = true
        })
      } else {
        this.$api.getMemberTagApi.getMemberTagList(this.searchSelectMemberTagForm).then(res => {
          this.selectMemberTagList = res.data
          this.manageMemberTagDialog = true
        })
      }
    },
    // 将普通数据处理为树形数据
    handelMakeTree(nodes, arr) {
      nodes.forEach(v => {
        v.memberTags = arr.filter(v1 => {
          return v1.parentId === v.id
        })
        if (v.memberTags.length > 0) {
          this.handelMakeTree(v.memberTags, arr)
        }
      })
    },
    // 选择会员标签 处理会员标签id集合
    selectMemberTagCheck(row, e) {
      if (!e && this.isShowSelectedMemberTags) {
        const obj = {}
        obj.deleteMemberIds = []
        obj.deleteMemberIds.push(this.currentMemberId)
        this.$api.deleteMemberTagApi.deleteMemberTagByIds(row.id, obj).then(res => {
          if (res.code === '200000') {
            this.getMemberAndTagMapping()
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        })
      }
      if (!this.isShowSelectedMemberTags) {
        if (e) {
          this.selectMemberTagIds.push(row)
        }
        if (!e) {
          const i = this.selectMemberTagIds.findIndex(item => {
            return item.id === row.id
          })
          this.selectMemberTagIds.splice(i, 1)
        }
      }
    },
    // 确认选择会员标签
    confirmManageMemberTag() {
      if (this.isShowSelectedMemberTags) {
        this.manageMemberTagDialog = false
      } else {
        if (this.selectMemberTagIds.length > 0) {
          for (let i = 0; i < this.selectMemberTagIds.length; i++) {
            this.selectMemberTagIds[i] = this.selectMemberTagIds[i].id
          }
          const obj = {}
          obj.addMemberIds = []
          obj.addMemberIds.push(this.currentMemberId)
          obj.addMemberTagIds = this.selectMemberTagIds
          this.$api.postMemberTagApi.postMemberTagMappings(obj).then(res => {
            if (res.code === '200000') {
              this.getMemberAndTagMapping()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.manageMemberTagDialog = false
            }
          })
        }
      }
    },
    // 查询会员标签
    searchMemberTag() {
      if (this.isShowSelectedMemberTags) {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先取消显示已选中标签',
          type: 'info'
        })
      } else {
        this.getSelectMemberTagList()
      }
    },
    // 重置会员标签
    resetSearchMemberTag() {
      if (this.isShowSelectedMemberTags) {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先取消显示已选中标签',
          type: 'info'
        })
      } else {
        this.searchSelectMemberTagForm.name = ''
        this.getSelectMemberTagList()
      }
    },
    // 关闭选择会员标签弹出框
    closeMemberTagDialog() {
      console.log('关闭了选择会员标签弹出框')
    },

    // 通过id查询会与账号信息
    getMemberAccountById(id) {
      this.$api.getMemberApi.getMemberAccountById(id).then(res => {
        console.log(res)
        this.memberAccountList = res
        // // 临时添加，联调时去掉 ，2021/06/23 add by qiaokun
        // const obj = {
        //   type: '02',
        //   total: 0,
        //   memberId: '1394488749785747456',
        //   gift: 0,
        //   frozenIntegral: 0,
        //   deduction: 0,
        //   balance: 0
        // }
        // this.memberAccountList.push(obj)
        console.log('会员账户信息列表', res)
        // 临时添加，联调时去掉 ，2021/06/23
      })
    },
    // 通过id查询会员详情信息
    getMemberById(id) {
      this.detailCardLevelList = []
      // this.organizationList = [] // 获取注册组织下拉列表
      this.channelList = [] // 获取注册渠道下拉列表
      this.terminalList = [] // 获取注册终端下拉列表
      this.$api.getMemberApi.getMemberById(id).then(res => {
        console.log('会员详情信息：', res)
        const obj = {
          value: res.cardLevelCode,
          label: res.cardLevelName
        }
        this.detailCardLevelList.push(obj)
        this.searchPointListForm.info = res.phone
        this.searchGrowthListForm.info = res.phone
        this.searchDataSavingsActivityForm.nickname = res.phone
        this.currentMemberPhone = res.phone
        this.memberForm = res
        // if (this.memberForm.registrationChannelId) {
        //   this.getPlatforms()
        // }
        // update by qiaokun 2021-05-17 start
        // 在此处理当前会员信息的 注册组织， 注册渠道 注册终端
        // 处理组织
        // const organObj = {
        //   value: res.registrationOrganizationCode,
        //   label: res.registrationOrganizationName
        // }
        // // 处理渠道
        // this.organizationList.push(organObj)
        const channelObj = {
          value: res.registrationChannelCode,
          label: res.registrationChannelName
        }
        this.channelList.push(channelObj)
        // 处理终端
        const terminalObj = {
          value: res.registrationTerminalCode,
          label: res.registrationTerminalName
        }
        this.terminalList.push(terminalObj)
        // update by qiaokun 2021-05-17 end
        if (this.memberForm.birthday) {
          this.age = this.toAge(this.memberForm.birthday)
        }
        this.getMemberAccountById(id)
        this.getMemberAddressById(id)
      })
    },
    // 通过会员id查询 会员信息
    getMemberAddressById(id) {
      this.$api.getMemberApi.getMemberAddressById(id).then(res => {
        console.log(res)
        this.loadings.close()
        this.memberForm.memberAddressList = res
        for (let i = 0; i < this.memberForm.memberAddressList.length; i++) {
          // 处理国家列表
          if (this.memberForm.memberAddressList[i].country) {
            this.$set(this.memberForm.memberAddressList[i], 'countryList', [])
            this.memberForm.memberAddressList[i].countryList.push({ label: '中国', value: '0' })
          }
          // 处理省份列表
          if (this.memberForm.memberAddressList[i].state) {
            this.$set(this.memberForm.memberAddressList[i], 'stateList', [])
            this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].country).then(res => {
              res.map(item => {
                this.memberForm.memberAddressList[i].stateList.push({ label: item.name, value: item.id })
              })
            })
          }
          // 处理城市
          if (this.memberForm.memberAddressList[i].city) {
            this.$set(this.memberForm.memberAddressList[i], 'cityList', [])
            this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].state).then(res => {
              res.map(item => {
                this.memberForm.memberAddressList[i].cityList.push({ label: item.name, value: item.id })
              })
            })
          }
          // 处理区
          if (this.memberForm.memberAddressList[i].district) {
            this.$set(this.memberForm.memberAddressList[i], 'districtList', [])
            this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].city).then(res => {
              res.map(item => {
                this.memberForm.memberAddressList[i].districtList.push({ label: item.name, value: item.id })
              })
            })
          }
        }
        this.dialogVisible = true
      })
    },
    // 重置查询会员
    resetSearchMember() {
      this.searchMemberForm.cardInfo = ''
      this.searchMemberForm.phone = ''
      this.searchMemberForm.beginTime = ''
      this.searchMemberForm.oldCardNumberCondition = 'eq'
      this.searchMemberForm.oldCardNumber = ''
      this.searchMemberForm.endTime = ''
      this.searchMemberForm.cardLevelCode = ''
      this.searchMemberForm.pointFrom = ''
      this.searchMemberForm.pointTo = ''
      this.searchMemberForm.storedValueFrom = ''
      this.searchMemberForm.storedValueTo = ''
      this.getMemberList()
    },
    // 查询会员
    searchMember() {
      this.searchMemberForm.pageIndex = 1
      this.getMemberList()
    },
    // 添加地址
    addAddress() {
      const obj = {
        code: this.guid(),
        type: '',
        country: '',
        state: '',
        city: '',
        district: '',
        street: '',
        address: ''
      }
      this.memberForm.memberAddressList.push(obj)
    },
    // 生成UUID的方法
    guid() {
      return this.S4() + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + '-' + this.S4() + this.S4() + this.S4()
    },
    S4() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
    },
    reset() {},
    showAddMemberDialog() {
      this.memberForm.cardLevelCode = ''
      this.memberForm.unionId = ''
      this.getPlatforms()
      this.currentMemberId = ''
      this.memberAndTagMappingList = []
      this.isAdd = true
      this.dialogVisible = true
    },
    async getCardLevelList() {
      // 获取会员等级列表的数据
      /* updata v2.0.3 qiaokun 2021-06-30 start */
      this.cardLevelList = []
      const obj = {
        name: '', // 等级名称
        level: '',
        pageIndex: 1, // 当前页
        pageSize: 999 // 当前页条数
      }
      const res = await this.$api.getMemberLevelApi.getMemberLevelList(obj)
      res.data.map(item => {
        this.cardLevelList.push({
          value: item.code,
          label: item.name
        })
      })
      /* updata v2.0.3 qiaokun 2021-06-30 end */
    },
    // 获取性别下拉列表
    getGenderList() {
      this.genderList = []
      const obj = {}
      obj.ddCode = '10003'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.genderList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取民族列表
    getNationList() {
      this.nationList = []
      const obj = {}
      obj.ddCode = '10004'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.nationList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取证件类型列表
    getCertificateTypeList() {
      this.certificateTypeList = []
      const obj = {}
      obj.ddCode = '10005'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.certificateTypeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取职业列表
    getProfessionalList() {
      this.professionalList = []
      const obj = {}
      obj.ddCode = '10006'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.professionalList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取职务列表
    getPositionList() {
      this.positionList = []
      const obj = {}
      obj.ddCode = '10007'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.positionList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取工龄列表
    getWorkingYearsList() {
      this.workingYearsList = []
      const obj = {}
      obj.ddCode = '10008'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.workingYearsList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取月收入列表
    getMonthlyIncomeList() {
      this.monthlyIncomeList = []
      const obj = {}
      obj.ddCode = '10009'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.monthlyIncomeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取文化水平列表
    getDiplomaList() {
      this.diplomaList = []
      const obj = {}
      obj.ddCode = '10010'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.diplomaList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取宗教信仰列表
    getReligionList() {
      this.religionList = []
      const obj = {}
      obj.ddCode = '10011'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.religionList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取家庭状况列表
    getFamilyStatusList() {
      this.familyStatusList = []
      const obj = {}
      obj.ddCode = '10012'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.familyStatusList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取婚姻状况的列表
    getMaritalStatusList() {
      this.maritalStatusList = []
      const obj = {}
      obj.ddCode = '10013'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.maritalStatusList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取政治面貌列表
    getPoliticsStatusList() {
      this.politicsStatusList = []
      const obj = {}
      obj.ddCode = '10014'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.politicsStatusList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取出行方式下拉列表
    getTripModeList() {
      this.tripModeList = []
      const obj = {}
      obj.ddCode = '10015'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.tripModeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取地址类型列表
    getTypeList() {
      this.typeList = []
      const obj = {}
      obj.ddCode = '10016'
      obj.status = true
      this.$api.getDataDicApi.getDataDicItemListByddCode(obj).then(res => {
        console.log(res)
        res.map(item => {
          this.typeList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 选择年龄时间戳值
    selectBirthday(e) {
      console.log(e)
      this.age = this.toAge(e)
    },
    // 根据返回的日期计算间隔
    toAge(timeStamp) {
      const birthDate = this.toDate(timeStamp).substr(0, 4)
      const newDate = new Date().getFullYear()
      return newDate - parseInt(birthDate)
    },
    // 时间戳转日期
    toDate(number) {
      const n = number
      const date = new Date(n)
      const Y = date.getFullYear() + '/'
      const M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '/'
      const D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
      return Y + M + D
    },
    closeDialog() {
      this.$refs.memberFormAllRef.resetFields()
      this.memberForm.avatar = '' // 头像
      this.memberForm.cardNumber = '' // 会员卡号
      this.memberForm.realName = '' // 真实姓名
      this.memberForm.phone = '' // 手机号码
      this.memberForm.openId = '' // 微信ID
      this.memberForm.cardLevel = '01' // 会员等级
      this.memberForm.gender = '' // 性别
      this.memberForm.birthday = '' // 生日
      this.memberForm.cardLevelTime = '' // 等级变更日期
      this.memberForm.nickname = '' // 昵称
      this.memberForm.nation = '01' // 民族
      this.memberForm.email = '' // 邮箱
      this.memberForm.status = true // 有效状态
      this.memberForm.certificateType = '' // 证件类型
      this.memberForm.idCard = '' // 证件号码
      this.memberForm.registrationDate = '' // 注册日期
      this.memberForm.registrationCompanyId = '' // 注册企业
      this.memberForm.registrationOrganizationCode = '' // 注册组织
      this.memberForm.registrationChannelCode = '' // 注册渠道
      this.memberForm.registrationTerminalCode = '' // 注册终端
      this.memberForm.professional = '' // 职业
      this.memberForm.position = '' // 职务
      this.memberForm.company = '' // 企业名称
      this.memberForm.workingYears = '' // 工龄
      this.memberForm.monthlyIncome = '' // 月收入
      this.memberForm.diploma = '' // 文化水平
      this.memberForm.religion = '' // 宗教信仰
      this.memberForm.familyStatus = '' // 家庭状况
      this.memberForm.maritalStatus = '' // 婚姻状况
      this.memberForm.politicsStatus = '' // 政治面貌
      this.memberForm.tripMode = '' // 出行方式
      this.memberForm.carNumber = '' // 车牌号
      this.memberForm.referrerMemberId = '' // 推荐会员
      this.memberForm.referrerUserId = '' // 推荐员工
      this.memberForm.serviceUserId = '' // 服务员工
      this.memberForm.oldCardNumber = '' // 原会员卡号
      this.memberForm.memberAddressList = []
    },
    // 删除地址的方法
    deleteAddress(row) {
      console.log()
      console.log(row)
      if (this.isAdd) {
        const i = this.memberForm.memberAddressList.findIndex(item => {
          return item.code === row.code
        })
        this.memberForm.memberAddressList.splice(i, 1)
      }
    },
    // 选择国家，处理获取国家列表方法
    selectCountry(row) {
      console.log(row)
      const i = this.memberForm.memberAddressList.findIndex(item => {
        return item.code === row.code
      })
      console.log(i)
      this.$set(this.memberForm.memberAddressList[i], 'countryList', [])
      this.memberForm.memberAddressList[i].countryList.push({ label: '中国', value: '0' })
    },
    // 选择省份时通过选择国家 查询省份列表
    selectState(row) {
      if (row.country !== '') {
        const i = this.memberForm.memberAddressList.findIndex(item => {
          return item.code === row.code
        })
        console.log(i)
        this.$set(this.memberForm.memberAddressList[i], 'stateList', [])
        this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].country).then(res => {
          res.map(item => {
            this.memberForm.memberAddressList[i].stateList.push({ label: item.name, value: item.id })
          })
        })
      } else {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择国家',
          type: 'info'
        })
      }
    },
    // 重新选择省份 清除所在城市
    clearState(row) {
      if (row.state !== '') {
        const i = this.memberForm.memberAddressList.findIndex(item => {
          return item.code === row.code
        })
        this.memberForm.memberAddressList[i].city = ''
      }
    },
    // 选择城市
    selectCity(row) {
      if (row.state !== '') {
        const i = this.memberForm.memberAddressList.findIndex(item => {
          return item.code === row.code
        })
        console.log(i)
        this.$set(this.memberForm.memberAddressList[i], 'cityList', [])
        this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].state).then(res => {
          res.map(item => {
            this.memberForm.memberAddressList[i].cityList.push({ label: item.name, value: item.id })
          })
        })
      } else {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择省份',
          type: 'info'
        })
      }
    },
    selectDistrict(row) {
      if (row.city !== '') {
        const i = this.memberForm.memberAddressList.findIndex(item => {
          return item.code === row.code
        })
        console.log(i)
        this.$set(this.memberForm.memberAddressList[i], 'districtList', [])
        this.$api.getAddressApi.getAddress(this.memberForm.memberAddressList[i].city).then(res => {
          res.map(item => {
            this.memberForm.memberAddressList[i].districtList.push({ label: item.name, value: item.id })
          })
        })
      } else {
        return this.$notify({
          title: this.$t('lang.tip'),
          message: '请先选择城市',
          type: 'info'
        })
      }
    },
    confirm() {
      console.log(this.memberForm)
      this.$refs.memberFormAllRef.validate(valid => {
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '会员基本信息请按照正确格式填写',
            type: 'info'
          })
        } else {
          this.$refs.memberFormRef.validate(valid => {
            if (!valid) {
              return this.$notify({
                title: this.$t('lang.tip'),
                message: '地址信息请按照正确格式填写',
                type: 'info'
              })
            } else {
              if (this.isAdd) {
                this.$api.postMemberApi.postMember(this.memberForm).then(res => {
                  if (res.code === '200000') {
                    this.$notify({
                      title: this.$t('lang.tip'),
                      message: this.$t('lang.optSuccess'),
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.getMemberList()
                  }
                })
              } else {
                this.$api.putMemberApi.putMember(this.currentMemberId, this.memberForm).then(res => {
                  console.log(res)
                  if (res.code === '200000') {
                    this.$notify({
                      title: this.$t('lang.tip'),
                      message: this.$t('lang.optSuccess'),
                      type: 'success'
                    })
                    this.dialogVisible = false
                    this.getMemberList()
                  }
                })
              }
            }
          })
        }
      })
    }
  },
  watch: {
    memberForm: {
      handler(val, oldVal) {
        // 处理会员表单中的 选择生日值为空时，让age = 空
        if (!val.birthday) {
          this.age = ''
        }
      },
      deep: true
    }
  }
}
</script>

<style lang="scss" scoped>
// @import '~@/assets/scss/scroll.scss';
.label-text {
  text-align: center;
}
.form-content {
  width: 100%;
  height: 500px;
}
.top-wrapper {
  margin-bottom: 20px;
}
.no-avatar {
  width: 80px;
  height: 80px;
  border-radius: 100px;
}
.avatar {
  border: none;
  height: 200px;
}
.upload {
  margin-top: 20px;
}
.avatar-wrapper {
  height: 200px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f7f6fb;
  border-radius: 10px;
  position: relative;
  .member-icon{
    position: absolute;
    top: 20px;
    left: 50%;
    transform: translateX(-50%);
    width: 40px;
  }
}
.member-icon {
  margin-right: 6px;
}
.member-label {
  border: none;
  height: 200px;
}
.member-label-wrapper {
  // width: 100%;
  height: 200px;
  margin-left: 20px;
  background: #f7f6fb;
  border-radius: 10px;
}
.el-input {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.el-select {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.el-date-editor.el-input,
.el-date-editor.el-input__inner {
  // width: 80%;
  // margin-left: 10%;
  border: none !important;
}
.form-table-item {
  margin-top: 10px;
}
.member-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.pre-select-wrapper {
  margin: 20px;
}
.search-form-box-wrapper {
  height: 40px;
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 20px;
}
.el-tag {
  cursor: pointer;
}
.select-condition {
  margin: 5px 0px;
}
.checkbox-wrapper {
  margin-bottom: 20px;
}
.opt-btn {
  margin-bottom: 20px;
}
.select-btn {
  margin-bottom: 20px;
}
// .reset-btn {
//   margin-left: 10px;
// }
.is-show-select {
  margin-right: 40px;
}
.el-input .el-select .el-date-picker {
  width: 150px;
}
// .el-table {
//   margin-top: 20px;
// }
// ::v-deep .el-table--scrollable-y .el-table__body-wrapper {
//   overflow-y: auto;
//   &::-webkit-scrollbar {
//     // 滚动条整体样式
//     width: 10px; // 高宽分别对应横竖滚动条的尺寸
//     height: 1px;
//   }
//   &::-webkit-scrollbar-thumb {
//     // 滚动条里面小方块
//     border-radius: 10px;
//     box-shadow: inset 0 0 5px rgba(66, 122, 246, 1) rgba(66, 122, 246, 1);
//     background: rgba(66, 122, 246, 0.5);
//     opacity: 0.5;
//   }
//   &::-webkit-scrollbar-track {
//     // 滚动条里面轨道
//     box-shadow: inset 0 0 5px rgba(66, 122, 246, 1);
//     opacity: 0.5;
//     border-radius: 10px;
//     background: #ededed;
//   }
// }
.point_dialogBody {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  .point_account {
    color: #0d1528;
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 20px;
  }
}
.point_text {
  font-size: 18px;
  color: #0d1528;
}
.point_text_orange {
  color: #ff6336;
}
.point_text_blue {
  color: #00a3ff;
}
.point_dialogFooter {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>

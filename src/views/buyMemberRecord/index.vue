<template>
  <div>
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchFormLabel" :formData="searchData"><div slot="rangeSeparator" style="margin:0 10px;">-</div> </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="handleReset"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="handleSearch" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <el-table :data="tableList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column width="70px" type="index" align="center" label="序号"></el-table-column>
      <el-table-column label="会员卡号" prop="cardNumber"></el-table-column>
      <el-table-column label="会员姓名" prop="nickname"> </el-table-column>
      <el-table-column label="手机号" prop="phone"></el-table-column>
      <el-table-column label="付费会员方案名" prop="productName"></el-table-column>
      <el-table-column label="付费会员方案" prop="number"></el-table-column>
      <el-table-column label="购买时间" prop="timeOfBuy"></el-table-column>
      <el-table-column label="状态" prop="status">
        <template slot-scope="scope">
          <span>{{ scope.row.status ? '有效' : '无效' }}</span>
        </template>
      </el-table-column>
      <el-table-column label="有效开始时间" prop="beginTime"></el-table-column>
      <el-table-column label="有效结束时间" prop="endTime"></el-table-column>
      <el-table-column label="操作" width="120" align="center">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-search" @click="showViewMemberDialog(scope.row)">查看会员</el-button>
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
    <el-dialog v-dialogDrag :title="$t('lang.viewDetails')" :visible.sync="dialogVisible" :lock-scroll="false" :append-to-body="true" width="80%" @close="closeDialog">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ $t('lang.viewDetails') }}
        </div>
      </template>
      <!-- <yp-form :formData="permissionForm" :formLabel="permissionFormLabel" :formRule="permissionFormRule" ref="ypForm"></yp-form> -->
      <el-main class="form-content scoll">
        <el-form :label-position="'right'" ref="memberFormAllRef" label-width="auto" :model="memberForm">
          <el-row class="top-wrapper">
            <el-col :span="6" class="avatar">
              <div class="avatar-wrapper">
                <img v-if="!memberForm.avatar" :src="noAvatar" alt="" class="img-avatar" />
                <img v-else :src="memberForm.avatar" alt="" class="img-avatar" />
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
                <el-input v-model.trim="memberForm.realName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="手机号:" prop="phone">
                <el-input v-model.trim="memberForm.phone" disabled></el-input>
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
                <el-input v-model.trim="memberForm.cardLevelName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="性别:">
                <el-select v-model="memberForm.gender" placeholder="请选择" style="width:100%;" disabled>
                  <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="生日:">
                <el-input v-model.trim="memberForm.birthday" disabled></el-input>
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
                <el-input v-model.trim="memberForm.cardLevelTime" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="昵称:">
                <el-input v-model.trim="memberForm.nickname" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="民族:">
                <el-select v-model.trim="memberForm.nation" placeholder="请选择" style="width:100%;" disabled>
                  <el-option v-for="item in nationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="邮箱:" prop="email">
                <el-input v-model.trim="memberForm.email" disabled></el-input>
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
                <el-select v-model="memberForm.certificateType" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in certificateTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="证件号码:" prop="idCard">
                <el-input v-model.trim="memberForm.idCard" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册日期:">
                <el-input v-model.trim="memberForm.registrationDate" disabled></el-input>
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
              <el-form-item label="注册组织:" prop="registrationOrganizationName">
                <el-input v-model.trim="memberForm.registrationOrganizationName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册渠道:">
                <el-input v-model.trim="memberForm.registrationChannelName" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="注册终端:">
                <el-input v-model.trim="memberForm.registrationTerminalName" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="职业:">
                <el-select v-model="memberForm.professional" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in professionalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="职务:">
                <el-select v-model="memberForm.position" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="企业名称:">
                <el-input v-model.trim="memberForm.company" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="工龄:">
                <el-select v-model="memberForm.workingYears" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in workingYearsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="月收入:">
                <el-select v-model="memberForm.monthlyIncome" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in monthlyIncomeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="文化水平:">
                <el-select v-model="memberForm.diploma" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in diplomaList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="宗教信仰:">
                <el-select v-model="memberForm.religion" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in religionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="家庭状况:">
                <el-select v-model="memberForm.familyStatus" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in familyStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="婚姻状况:">
                <el-select v-model="memberForm.maritalStatus" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in maritalStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="政治面貌:">
                <el-select v-model="memberForm.politicsStatus" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in politicsStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="出行方式:">
                <el-select v-model="memberForm.tripMode" disabled placeholder="请选择" style="width:100%;">
                  <el-option v-for="item in tripModeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="车牌号:" prop="carNumber">
                <el-input v-model.trim="memberForm.carNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="6">
              <el-form-item label="推荐会员:">
                <el-input v-model.trim="memberForm.referrerMemberId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="推荐员工:">
                <el-input v-model.trim="memberForm.referrerUserId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="服务员工:">
                <el-input v-model.trim="memberForm.serviceUserId" disabled></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="6">
              <el-form-item label="原会员卡号:">
                <el-input v-model.trim="memberForm.oldCardNumber" disabled></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div>
          <el-row style="margin-bottom:20px;"
            ><el-col :span="2"> <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 账户信息</span></el-col></el-row
          >
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
          <el-row style="margin-top:20px;margin-bottom: 20px;">
            <el-col :span="2"> <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 地址信息</span></el-col>
          </el-row>
        </div>
        <el-form :model="memberForm" ref="memberFormRef">
          <el-table :data="memberForm.memberAddressList" border>
            <el-table-column label="地址类型" align="center">
              <template slot="header">
                <span style="color:red;">*</span>
                <span>地址类型</span>
              </template>
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.type'">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.type">
                    <el-option v-for="selectItem in typeList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在国家" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.country'">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.country">
                    <el-option v-for="selectItem in scope.row.countryList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在省份" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.state'">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.state">
                    <el-option v-for="selectItem in scope.row.stateList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在城市" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.city'">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.city">
                    <el-option v-for="selectItem in scope.row.cityList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在区" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.district'">
                  <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.district">
                    <el-option v-for="selectItem in scope.row.districtList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                  </el-select>
                </el-form-item>
              </template>
            </el-table-column>
            <el-table-column label="所在街道" align="center">
              <template slot-scope="scope">
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.street'">
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
                <el-form-item class="form-table-item" :prop="'memberAddressList.' + scope.$index + '.address'">
                  <el-input v-model.trim="scope.row.address"></el-input>
                </el-form-item>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">{{ $t('lang.cancel') }}</el-button>
      </span>
    </el-dialog>
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
              <el-button size="mini" style="marginTop:5px;marginLeft:20px;" v-show="searchPointListFormLabel.length > 3" @click="isBrandFold = !isBrandFold"
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
      <el-table :data="pointListList" height="300" stripe border row-key="id" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
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
              <el-button size="mini" style="marginTop:5px;marginLeft:20px;" v-show="searchGrowthListFormLabel.length > 3" @click="isBrandFold = !isBrandFold"
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
      <yp-table :propArr="growthListListLabel" :listInfo="growthListList" style="width: 100%" :height="'300'"> </yp-table>
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
            :total="savingsActivityTotals"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 储值明细分页 end -->
    </el-dialog>
  </div>
</template>
<script>
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
import { Loading } from 'element-ui'
import { parseTime } from '@/filters/format.js'
export default {
  // 时间格式过滤器
  filters: {
    parseTime(time, cFormat) {
      return parseTime(time, cFormat)
    }
  },
  components: {
    YpTable,
    YpSearchForm
  },
  data() {
    return {
      currentMemberId: '',
      height: null,
      searchData: {
        phone: '',
        status: '',
        searchInfo: '',
        pageIndex: 1,
        pageSize: 20
      },
      tableTotals: 0,
      tableList: [],
      memberAndTagMappingList: [],
      dialogVisible: false,
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg',
      memberForm: {
        avatar: '', // 头像
        cardNumber: '', // 会员卡号
        realName: '', // 真实姓名
        phone: '', // 手机号码
        mergeCardNumber: '', // 合并卡号
        openId: '', // 微信ID
        cardLevelCode: '01', // 会员等级
        cardLevelName: '',
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
        memberAddressList: [],
        registrationOrganizationName: '',
        registrationChannelName: '',
        registrationTerminalName: ''
      },
      currentMemberPhone: '',
      genderList: [],
      nationList: [],
      payOptionsList: [],
      statusList: [
        { label: '有效', value: true },
        { label: '无效', value: false }
      ], // 选择有效无效列表
      certificateTypeList: [],
      professionalList: [],
      positionList: [],
      workingYearsList: [],
      monthlyIncomeList: [],
      diplomaList: [],
      religionList: [],
      familyStatusList: [],
      maritalStatusList: [],
      politicsStatusList: [],
      tripModeList: [],
      age: '',
      memberAccountList: [],
      typeList: [],
      loadings: '',
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
      growthOrganizationList: [],
      growthChannelList: [],
      growthTotal: 0,
      growthListList: [], // 成长值列表数据
      memberGrowthListDialog: false,
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
      savingsActivityTotals: 0
    }
  },
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    this.getList()
    this.getGenderList()
    this.getNationList()
    this.getCertificateTypeList()
    this.getProfessionalList()
    this.getPositionList()
    this.getWorkingYearsList()
    this.getMonthlyIncomeList()
    this.getDiplomaList()
    this.getReligionList()
    this.getFamilyStatusList()
    this.getMaritalStatusList()
    this.getPoliticsStatusList()
    this.getTripModeList()
    this.getTypeList()
  },

  methods: {
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
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
    // 获取性别下拉列表
    getGenderList() {
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
    // 获取列表
    getList() {
      this.$api.getPayMemberApi.getRecordList(this.searchData).then(res => {
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
    // 搜索
    handleSearch() {
      this.searchData.pageIndex = 1
      this.getList()
    },
    handleReset() {
      this.searchData = { phone: '', status: '', searchInfo: '', pageIndex: 1, pageSize: 20 }
      this.getList()
    },
    // 查看会员详情
    showViewMemberDialog(row) {
      this.currentMemberId = row.memberId
      this.currentMemberPhone = row.phone
      const option = {
        lock: true,
        background: '#fff'
      }
      this.loadings = Loading.service(option)
      this.getMemberById(row.memberId)
      // this.getPlatforms()
      this.getMemberAndTagMapping()
    },
    // 关闭回调
    closeDialog() {
      this.memberForm = {
        avatar: '', // 头像
        cardNumber: '', // 会员卡号
        realName: '', // 真实姓名
        phone: '', // 手机号码
        mergeCardNumber: '', // 合并卡号
        openId: '', // 微信ID
        cardLevelCode: '01', // 会员等级
        cardLevelName: '',
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
        memberAddressList: [],
        registrationOrganizationName: '',
        registrationChannelName: '',
        registrationTerminalName: ''
      }
    },
    // 通过id查询会员详情信息
    getMemberById(id) {
      this.$api.getMemberApi.getMemberById(id).then(res => {
        console.log('会员详情信息：', res)
        this.memberForm = res
        if (this.memberForm.birthday) {
          this.age = this.toAge(this.memberForm.birthday)
        }
        this.getMemberAccountById(id)
        this.getMemberAddressById(id)
      })
    },
    // 通过id查询会与账号信息
    getMemberAccountById(id) {
      this.$api.getMemberApi.getMemberAccountById(id).then(res => {
        this.memberAccountList = res
      })
    },
    // 通过会员id查询 会员信息
    getMemberAddressById(id) {
      this.$api.getMemberApi.getMemberAddressById(id).then(res => {
        this.loadings.close()
        console.log('111', res)
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
    // 查看会员账户详情
    viewMemberAccountDetails(row) {
      console.log(row)
      this.isBrandFold = true
      // 查看会员积分详情
      if (row.type === '01') {
        this.searchPointListForm.memberId = row.memberId
        this.searchPointListForm.info = this.currentMemberPhone
        this.getPointTypeList()
        this.getOrganizationList()
        this.getChannelList()
        this.getPointListList()
        this.memberAccountDialog = true
      }
      // 查看会员成长值详情
      if (row.type === '02') {
        this.searchGrowthListForm.memberId = row.memberId
        this.searchGrowthListForm.info = this.currentMemberPhone
        this.getGrowthOrganizationList() // 获取成长值来源组织
        this.getGrowthChannelList() // 获取成长值来源渠道
        this.getGrowthListList()
        this.memberGrowthListDialog = true
      }
      // 查看会员储值明细
      if (row.type === '03') {
        this.dataSavingsActivityDialogVisible = true // 显示弹框
        this.getDataSavingsActivityList()
        this.getGrowthChannelList() // 获取成长值来源渠道
      }
    },
    /**
     * 描述：储值明细数据列表
     */
    getDataSavingsActivityList() {
      this.$api.getActivityApi.getDataSavingsActivityList(this.searchDataSavingsActivityForm).then(res => {
        this.dataSavingsActivityList = res.data
        this.savingsActivityTotals = res.total
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
    // 获取来源组织
    getGrowthOrganizationList() {
      this.growthOrganizationList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getGrowthTreeData(res)
      })
    },
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
    // 积分明细查询重置
    resetSearchPointList() {
      this.searchPointListForm = {
        beginTime: '',
        endTime: '',
        channelsCode: '',
        organizationCode: '',
        pointTypeCode: '',
        info: this.currentMemberPhone,
        pageSize: 20,
        pageIndex: 1,
        memberId: '',
        cardNumber: '',
        billNum: ''
      }
      this.getPointListList()
    },
    searchPointList() {
      this.searchPointListForm.pageIndex = 1
      this.getPointListList()
    },
    // 关闭会员账户详情
    closeMemberAccountDialog() {
      this.searchPointListForm = {
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
      }
    },
    // 从后端获取积分明细表格数据
    getPointListList() {
      console.log(this.searchPointListForm)
      this.$api.getPointListApi.getPointListList(this.searchPointListForm).then(res => {
        this.pointListList = res.data
        this.pointListTotal = res.total
      })
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
        info: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: ''
      }
    }
  },
  computed: {
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
    searchFormLabel() {
      return [
        {
          label: '手机号:',
          type: 'input',
          prop: 'phone'
        },
        {
          label: '付费会员方案:',
          type: 'input',
          prop: 'searchInfo',
          placeholder: '请输入方案名或编码'
        },
        {
          label: '状态:',
          type: 'select',
          prop: 'status',
          options: this.statusList
        }
      ]
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
    },
    // 储值明细
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
    },
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
  .img-avatar {
    width: 100px;
    height: 100px;
    border-radius: 100%;
  }
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
.member-icon {
  margin-right: 6px;
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
.is-show-select {
  margin-right: 40px;
}
.el-input .el-select .el-date-picker {
  width: 150px;
}
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

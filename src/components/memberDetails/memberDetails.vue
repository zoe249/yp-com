<template>
  <div class="text">
    <el-main class="form-content scoll">
      <el-form :label-position="'right'" label-width="auto" :model="memberForm">
        <el-row class="top-wrapper">
          <el-col :span="6" class="avatar">
            <div class="avatar-wrapper">
              <img v-show="!memberForm.avatar" :src="memberForm.avatar ? memberForm.avatar : noAvatar" alt="" class="no-avatar" />
              <img v-show="memberForm.avatar" :src="memberForm.avatar" alt="" class="no-avatar" />
            </div>
          </el-col>
          <el-col :span="18" class="member-label">
            <el-main class="member-label-wrapper scoll">
              <el-row>
                <el-col :span="24">
                  <span v-show="memberAndTagMappingList.length < 1">暂无会员标签</span>
                  <el-tag class="member-detail-tag" v-show="memberAndTagMappingList.length >= 1" v-for="item in memberAndTagMappingList" :key="item.id" effect="plain">
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
              <el-input v-model.trim="memberForm.cardNumber" style="width:100%;" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="姓名:">
              <el-input v-model.trim="memberForm.realName" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="手机号:" prop="phone">
              <el-input v-model.trim="memberForm.phone" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="合并卡号:">
              <el-input v-model.trim="memberForm.mergeCardNumber" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="会员等级:">
              <el-select v-model="memberForm.cardLevelCode" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in cardLevelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="性别:">
              <el-select v-model="memberForm.gender" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in genderList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="生日:">
              <el-date-picker v-model="memberForm.birthday" style="width:100%" type="date" value-format="timestamp" placeholder="选择生日" disabled> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="年龄:">
              <el-input v-model.trim="age" placeholder="根据生日自动计算" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="等级变更日期:">
              <el-date-picker v-model="memberForm.cardLevelTime" style="width:100%" type="date" value-format="timestamp" placeholder="暂无" disabled> </el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="昵称:">
              <el-input v-model.trim="memberForm.nickname" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="民族:">
              <el-select v-model.trim="memberForm.nation" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in nationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="邮箱:" prop="email">
              <el-input v-model.trim="memberForm.email" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="有效状态:">
              <el-select v-model="memberForm.status" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in statusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证件类型:">
              <el-select v-model="memberForm.certificateType" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in certificateTypeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="证件号码:" prop="idCard">
              <el-input v-model.trim="memberForm.idCard" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册日期:">
              <el-date-picker v-model.trim="memberForm.registrationDate" type="date" value-format="timestamp" style="width:100%" disabled></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="注册企业:">
              <el-input v-model.trim="memberForm.registrationCompanyId" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册组织:">
              <el-select v-model="memberForm.registrationOrganizationCode" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in organizationList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册渠道:">
              <el-select v-model="memberForm.registrationChannelCode" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in channelList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="注册终端:">
              <el-select v-model="memberForm.registrationTerminalCode" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in terminalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="职业:">
              <el-select v-model="memberForm.professional" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in professionalList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="职务:">
              <el-select v-model="memberForm.position" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in positionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="企业名称:">
              <el-input v-model.trim="memberForm.company" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="工龄:">
              <el-select v-model="memberForm.workingYears" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in workingYearsList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="月收入:">
              <el-select v-model="memberForm.monthlyIncome" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in monthlyIncomeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="文化水平:">
              <el-select v-model="memberForm.diploma" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in diplomaList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="宗教信仰:">
              <el-select v-model="memberForm.religion" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in religionList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="家庭状况:">
              <el-select v-model="memberForm.familyStatus" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in familyStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="婚姻状况:">
              <el-select v-model="memberForm.maritalStatus" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in maritalStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="政治面貌:">
              <el-select v-model="memberForm.politicsStatus" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in politicsStatusList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="出行方式:">
              <el-select v-model="memberForm.tripMode" placeholder="请选择" style="width:100%" disabled>
                <el-option v-for="item in tripModeList" :key="item.value" :label="item.label" :value="item.value"> </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="车牌号:" prop="carNumber">
              <el-input v-model.trim="memberForm.carNumber" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="6">
            <el-form-item label="推荐会员:">
              <el-input v-model.trim="memberForm.referrerMemberId" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="推荐员工:">
              <el-input v-model.trim="memberForm.referrerUserId" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="服务员工:">
              <el-input v-model.trim="memberForm.serviceUserId" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="原会员卡号:">
              <el-input v-model.trim="memberForm.oldCardNumber" style="width:100%" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <div>
        <el-row style="margin-bottom:20px;"
          ><el-col :span="2"> <span :style="{ color: this.$store.state.header.themeColor, fontWeight: 'bold', fontSize: '16px' }"> | 账户信息</span></el-col></el-row
        >
        <!-- 主表格内容 begin -->
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
        <el-row style="margin-top:20px;margin-bottom:20px;">
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
              <el-form-item class="form-table-item">
                <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.type" disabled>
                  <el-option v-for="selectItem in typeList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所在国家" align="center">
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.country" @focus="selectCountry(scope.row)" disabled>
                  <el-option v-for="selectItem in scope.row.countryList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所在省份" align="center">
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.state" @focus="selectState(scope.row)" @change="clearState(scope.row)" disabled>
                  <el-option v-for="selectItem in scope.row.stateList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所在城市" align="center">
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.city" @focus="selectCity(scope.row)" disabled>
                  <el-option v-for="selectItem in scope.row.cityList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所在区" align="center">
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-select :placeholder="$t('lang.pleaseselect')" v-model="scope.row.district" disabled>
                  <el-option v-for="selectItem in scope.row.districtList" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
                </el-select>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="所在街道" align="center">
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-input v-model.trim="scope.row.street" disabled></el-input>
              </el-form-item>
            </template>
          </el-table-column>
          <el-table-column label="详细地址" align="center">
            <template slot="header">
              <span style="color:red;">*</span>
              <span>详细地址</span>
            </template>
            <template slot-scope="scope">
              <el-form-item class="form-table-item">
                <el-input v-model.trim="scope.row.address" disabled></el-input>
              </el-form-item>
            </template>
          </el-table-column>
        </el-table>
      </el-form>
    </el-main>
    <!-- 积分明细数据弹框 -->
    <el-dialog title="积分明细" :visible.sync="dialogVisible" :lock-scroll="false" v-dialogDrag :close-on-click-modal="false" :append-to-body="true" v-if="dialogVisible" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '积分明细' }}
        </div>
      </template>
      <point-details :id="currentMemberId" :viewDetailsPhone="viewDetailsPhone"></point-details>
      <!-- <span slot="footer" class="dialog-footer"> -->
        <!-- <el-button @click="dialogVisible = false">取 消</el-button> -->
        <!-- <el-button type="primary" @click="dialogVisible = false">关闭</el-button> -->
      <!-- </span> -->
    </el-dialog>
    <!-- 成长值数据弹框 -->
    <!-- 修改人：wangdandi 修改内容：点击查看详情时显示成长值数据 start -->
    <el-dialog title="成长值" :visible.sync="memberGrowthListDialog" :lock-scroll="false" v-dialogDrag :close-on-click-modal="false" :append-to-body="true" v-if="memberGrowthListDialog" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '成长值' }}
        </div>
      </template>
      <div class="search-form-box">
        <yp-search-form class="search-form-wrapper" :formLabel="searchGrowthListFormLabel" :formData="searchGrowthListForm"></yp-search-form>
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
      <!-- 主表格内容 begin -->
      <yp-table :propArr="growthListListLabel" :listInfo="growthListList" style="width: 100%" :height="'300'"> </yp-table>
      <!-- 分页 -->
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
    </el-dialog>
    <!-- 修改人：wangdandi 修改内容：点击查看详情时显示成长值数据 end -->
    <!-- 储存明细 -->
    <!-- 修改人：wangdandi 修改内容：点击查看详情时显示储存明细数据 start -->
    <el-dialog
      title="储存明细"
      :visible.sync="dataSavingsActivityDialogVisible"
      :lock-scroll="false"
      v-dialogDrag
      :close-on-click-modal="false"
      :append-to-body="true"
      v-if="dataSavingsActivityDialogVisible"
      width="80%"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '储存明细' }}
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
      <!-- 储存明细数据列表区域 start -->
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
      <!-- 储存明细数据列表区域 end -->
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
    <!-- 修改人：wangdandi 修改内容：点击查看详情时显示储存明细数据 start -->
  </div>
</template>

<script>
import pointDetails from '@/components/pointDetails/pointDetails.vue'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpTable from '@/components/table/YpTable.vue'
import { Loading } from 'element-ui'
export default {
  /*
   * @params id:会员id
   */
  props: {
    id: {
      type: String,
      default: ''
    }
  },
  components: {
    pointDetails,
    YpSearchForm,
    YpTable
  },
  data() {
    return {
      viewDetailsPhone: '', // 用来进行接受查看详情中的手机号
      dialogVisible: false,
      memberGrowthListDialog: false, // 成长值弹框
      dataSavingsActivityDialogVisible: false, // 储存明细弹框
      // cardLevelList: [], // 选择会员等级下拉列表
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
      memberAndTagMappingList: [], // 展示会员标签列表
      memberAccountList: [], // 会员账户信息
      memberForm: {
        avatar: '', // 头像
        cardNumber: '', // 会员卡号
        realName: '', // 真实姓名
        phone: '', // 手机号码
        openId: '', // 微信ID
        cardlevelCode: '01', // 会员等级
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
      }, // 会员表单对象
      noAvatar: 'http://qiaokun.yuepong.com/%E6%9A%82%E6%97%A0%E5%9B%BE%E7%89%87.jpg', // 无头像时
      age: '', // 会员年龄
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
      growthListList: [], // 成长值数据列表
      growthOrganizationList: [],
      growthChannelList: [],
      growthTotal: 0, // 成长值分页
      /**
       * 修改人：wangdandi
       * 修改内容：储存明细
       * 修改时间：2021-10-08
       */
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
      totals: 0
    }
  },
  created() {
    const option = {
      lock: true,
      background: '#fff',
      target: document.querySelector('.text')
    }
    this.loadings = Loading.service(option)
    // 获取会员等级下拉列表
    // this.getCardLevelList()
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
    if (this.id) {
      console.log('不等于空')
      this.currentMemberId = this.id
      this.getMemberById(this.currentMemberId)
      this.getMemberAndTagMapping()
      setTimeout(() => {
        this.loadings.close()
      }, 2000)
    }
  },
  computed: {
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
    // 查看详情成长值搜索区域
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
    /**
     * 修改人：wangdandi
     * 修改时间：2021-10-08
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
  // 组件挂载的时候调用
  mounted() {},
  methods: {
    /**
     * 修改人：wangdandi
     * 修改内容：查看详情成长值和储存明细弹框数据
     * 修改时间：2021-10-08
     * start
     */
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
        info: '',
        pageSize: 20,
        pageIndex: 1,
        memberId: ''
      }
      this.getGrowthListList()
    },
    /**
     * 描述：查询成长值方法
     */
    searchGrowthList() {
      this.searchGrowthListForm.pageIndex = 1
      this.getGrowthListList()
    },
    // 从后端获取成长值明细表格数据
    getGrowthListList() {
      this.$api.getGrowthListApi.getGrowthListList(this.searchGrowthListForm).then(res => {
        this.growthListList = res.data
        this.growthTotal = res.total
      })
    },
    // 获取来源组织
    getGrowthOrganizationList() {
      console.log('getChannelList')
      this.growthOrganizationList = []
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        res.map(item => {
          this.growthOrganizationList.push({ value: item.code, label: item.name })
        })
      })
    },
    // 获取来源渠道
    getGrowthChannelList() {
      this.growthChannelList = []
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        console.log('渠道范围', res)
        res.map(item => {
          this.growthChannelList.push({ value: item.code, label: item.name })
        })
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
      console.log('搜索', this.searchDataSavingsActivityForm)
      this.getDataSavingsActivityList()
    },
    /**
     * 描述：储值明细数据列表
     */
    getDataSavingsActivityList() {
      this.$api.getActivityApi.getDataSavingsActivityList(this.searchDataSavingsActivityForm).then(res => {
        console.log('储存数据列表', res)
        this.dataSavingsActivityList = res.data
        this.totals = res.total
      })
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
     * 修改内容：查看详情成长值和储存明细弹框数据
     * 修改时间：2021-10-08
     * end
     */
    // 查看会员账户详情
    viewMemberAccountDetails(row) {
      console.log('查看详情', row)
      /**
       * 修改人：wangdandi
       * 修改内容：查看详情弹框内容
       * 修改时间：2021-10-08
       * start
       */
      // 查看详情积分账户
      if (row.type === '01') {
        this.dialogVisible = true
      }
      // 查看详情成长值
      if (row.type === '02') {
        this.memberGrowthListDialog = true
        this.getGrowthListList()
        this.getGrowthChannelList()
        this.getGrowthOrganizationList()
      }
      // 查看详情储存明细
      if (row.type === '03') {
        this.dataSavingsActivityDialogVisible = true
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
      /**
       * 修改人：wangdandi
       * 修改内容：查看详情弹框内容
       * 修改时间：2021-10-08
       * end
       */
    },
    // 通过id查询会员详情信息
    getMemberById(id) {
      this.cardLevelList = []
      this.$api.getMemberApi.getMemberById(id).then(res => {
        console.log(res)
        this.viewDetailsPhone = res.phone
        this.searchGrowthListForm.info = res.phone
        this.searchDataSavingsActivityForm.nickname = res.phone
        this.memberForm = res
        console.log('会员信息', res)
        if (this.memberForm.birthday) {
          this.age = this.toAge(this.memberForm.birthday)
        }
        // update by qiaokun 2021-05-17 start
        // 在此处理当前会员信息的 注册组织， 注册渠道 注册终端
        // 处理组织
        const organObj = {
          value: res.registrationOrganizationCode,
          label: res.registrationOrganizationName
        }
        // 处理渠道
        this.organizationList.push(organObj)
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
        /* 处理会员等级 */
        const obj = {
          value: res.cardLevelCode,
          label: res.cardLevelName
        }
        this.cardLevelList.push(obj)
        // this.getPlatforms()
        this.getMemberAccountById(id)
        this.getMemberAddressById(id)
      })
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
    // 获取当前平台信息
    getPlatforms() {
      this.organizationList = [] // 获取注册组织下拉列表
      this.channelList = [] // 获取注册渠道下拉列表
      this.terminalList = [] // 获取注册终端下拉列表
      this.$api.getPlatformsApi.getPlatformsList().then(res => {
        console.log(this.memberForm.registrationOrganizationId)
        console.log(this.memberForm.registrationTerminalId)
        console.log(this.memberForm.registrationChannelId)
        console.log(res)
        this.$api.getOrganizationManagementApi.getOrganizationManagementById(this.memberForm.registrationOrganizationId).then(res => {
          console.log(res)
          if (res) {
            const obj = {}
            obj.value = res.id
            obj.label = res.name
            this.organizationList.push(obj)
          }
        })
        this.$api.getChannelApi.getChannelById(this.memberForm.registrationChannelId).then(res => {
          console.log(res)
          const obj = {}
          obj.value = res.id
          obj.label = res.name
          this.channelList.push(obj)
        })
        console.log(this.memberForm.registrationChannelId)
        const obj = {}
        obj.channelsId = this.memberForm.registrationChannelId
        obj.terminalsId = ''
        this.$api.getChannelTerminalApi.getChannelTerminalList(obj).then(res => {
          console.log(res)

          this.$emit('closeLoding', 'close')
          res.map(item => {
            this.terminalList.push({ label: item.terminalsName, value: item.terminalsId })
          })
        })
      })
    },
    // 通过id查询会与账号信息
    getMemberAccountById(id) {
      this.$api.getMemberApi.getMemberAccountById(id).then(res => {
        console.log(res)
        this.memberAccountList = res
      })
    },
    // 通过会员id查询 会员信息
    getMemberAddressById(id) {
      this.$api.getMemberApi.getMemberAddressById(id).then(res => {
        console.log(res)
        // this.loadings.close()
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
      })
    },
    // 获取会员等级下拉列表数据
    getCardLevelList() {
      // 获取会员等级列表的数据
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
    }
  },
  watch: {}
}
</script>

<style lang="scss" scoped>
.form-content {
  // width: 100%;
  height: 500px;
}
.top-wrapper {
  margin-bottom: 20px;
}
.no-avatar {
  width: 100px;
  height: 100px;
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
}
.member-label {
  border: none;
  height: 200px;
}
.member-label-wrapper {
  height: 200px;
  margin-left: 20px;
  background: #f7f6fb;
  border-radius: 10px;
}
.member-detail-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}
.el-select {
  border: none !important;
}
</style>

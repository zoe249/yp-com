<template>
  <div>
    <el-button class="add-btn" size="mini" type="primary" @click="addLuckDraw">{{ '+ 新增' }}</el-button>
    <!-- 头部搜索表单 begin -->
    <div class="search-form-box">
      <yp-search-form class="search-form-wrapper" :formLabel="searchLuckDrawLabel" :formData="searchLuckDrawForm"><div slot="rangeSeparator" style="margin:0 10px;">-</div>
      </yp-search-form>
      <div class="search-btn-wrapper">
        <el-button
          class="reset-btn"
          :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
          @click="resetSearchLuckDrawForm"
          size="mini"
          icon="el-icon-refresh-left"
          >重置</el-button
        >
        <el-button class="search-btn" type="primary" @click="searchSearchLuckDrawForm" size="mini" icon="el-icon-search">搜索</el-button>
      </div>
    </div>
    <!-- 头部搜索 end -->
    <!-- 幸运抽奖 表格内容区域 start -->
    <el-table :data="luckDrawList" stripe border :height="height" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
      <el-table-column label="活动编号" prop="number"></el-table-column>
      <el-table-column label="活动名称" prop="name"></el-table-column>
      <el-table-column label="抽奖形式" prop="drawStyle">
        <template slot-scope="scope">
          <div v-show="scope.row.drawStyle === '1'">{{ scope.row.drawStyle }}-九宫格</div>
          <div v-show="scope.row.drawStyle === '2'">{{ scope.row.drawStyle }}-大转盘</div>
        </template>
      </el-table-column>
      <el-table-column label="限制次数" prop="triesLimitType" align="center">
        <template slot-scope="scope">
          <div v-show="scope.row.triesLimitType === '1'">一天{{ scope.row.triesLimit }}次</div>
          <div v-show="scope.row.triesLimitType === '2'">一人{{ scope.row.triesLimit }}次</div>
        </template>
      </el-table-column>
      <el-table-column label="抽奖类型" prop="drawType">
        <template slot-scope="scope">
          <div v-show="scope.row.drawType === '1'">{{ scope.row.drawType }}-无限制抽奖</div>
          <div v-show="scope.row.drawType === '2'">{{ scope.row.drawType }}-积分抽奖</div>
        </template>
      </el-table-column>
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
          <el-button type="text" icon="el-icon-search" @click="viewLuckDrawDetail(scope.row.id)">查看详情</el-button>
          <el-button type="text" @click="copyLuckDrawById(scope.row.id)">复制活动</el-button>
          <el-button type="text" @click="publishLuckDrawById(scope.row.id)" v-show="scope.row.status === '0' || scope.row.status === '3'">发布</el-button>
          <el-button type="text" @click="unPublishLuckDrawById(scope.row.id)" v-show="scope.row.status === '1'">撤销发布</el-button>
          <el-button type="text" @click="viewData(scope.row.number)">数据</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 幸运抽奖 表格内容区域 end -->
    <!-- 分页 begin -->
    <div class="pagination-wrapper">
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="searchLuckDrawForm.pageIndex"
          :page-sizes="[10, 20, 30, 40]"
          :page-size="searchLuckDrawForm.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
    <!-- 分页 end -->
    <!-- 新增幸运抽奖方法 -->
    <el-dialog
      :lock-scroll="false"
      :close-on-click-modal="false"
      :append-to-body="true"
      :title="isAdd ? '新增' : '查看详情'"
      :visible.sync="dialogVisible"
      width="60%"
      v-dialogDrag
      @close="closeDialog"
    >
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ isAdd ? '新增' : '查看详情' }}
        </div>
      </template>
      <div>
        <div v-show="isFirstStep" class="first">
          <div class="form-wrap">
            <div class="left-wrap">
              <img :src="firstForm.drawStyle === '1' ? ninthStatic : orcleStatic" alt="" />
            </div>
            <div>
              <el-form :model="firstForm" :rules="firstFormRule" label-width="100px" ref="firstFormRef" label-position="rigth">
                <el-form-item label="抽奖形式：" prop="drawStyle">
                  <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" label="1" @change="handleChangeDrawStyle" v-model="firstForm.drawStyle">九宫格抽奖</el-radio>
                  <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" label="2" @change="handleChangeDrawStyle" v-model="firstForm.drawStyle">大转盘抽奖</el-radio>
                </el-form-item>
                <el-form-item label="活动名称：" prop="name">
                  <el-input :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="firstForm.name" maxlength="15" show-word-limit></el-input>
                </el-form-item>
                <el-form-item label="活动时间：" prop="beginTime">
                  <el-date-picker
                    :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="handleChangeBeginTime"
                    :picker-options="startTime"
                    v-model="firstForm.beginTime"
                    type="datetime"
                    placeholder="选择开始日期时间"
                  >
                  </el-date-picker>
                  至
                  <el-date-picker
                    :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    @change="handleChangeEndTime"
                    :picker-options="endTime"
                    v-model="firstForm.endTime"
                    type="datetime"
                    placeholder="选择结束日期时间"
                  >
                  </el-date-picker>
                </el-form-item>
                <el-form-item label="抽奖类型：" prop="drawType">
                  <el-radio label="1" :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" @change="handleChangeDrawType" v-model="firstForm.drawType">无限制抽奖</el-radio>
                  <br />
                  <div class="line">
                    <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" label="2" @change="handleChangeDrawType" v-model="firstForm.drawType">积分抽奖</el-radio
                    ><span>消耗 </span
                    ><el-input class="width120" :disabled="!drawTypeIsPiont || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))" v-model.number="firstForm.usePoint"></el-input
                    ><span> 积分</span>
                  </div>
                </el-form-item>
                <el-form-item label="参与次数：" prop="triesLimitType">
                  <div class="line">
                    <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" label="1" v-model="firstForm.triesLimitType" @change="handleTriesLimitType">一天N次</el-radio>
                    <span>每人每天可抽 </span
                    ><el-input
                      class="width120"
                      :disabled="firstForm.triesLimitType === '2' || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                      v-model.number="firstForm.triesLimit1"
                    ></el-input
                    ><span> 次</span>
                  </div>
                  <div class="line">
                    <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" label="2" v-model="firstForm.triesLimitType" @change="handleTriesLimitType">一人N次</el-radio
                    ><span>每人一共可抽 </span
                    ><el-input
                      class="width120"
                      :disabled="firstForm.triesLimitType === '1' || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                      v-model.number="firstForm.triesLimit2"
                    ></el-input
                    ><span> 次</span>
                  </div>
                </el-form-item>
                <el-form-item label="活动对象:" prop="activeObject">
                  <el-checkbox-group v-model="firstForm.activeObject">
                    <el-checkbox label="all" :disabled="(firstForm.activeObject[0] !== 'all' && firstForm.activeObject.length > 0) || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                      >所有顾客</el-checkbox
                    >
                    <br />
                    <el-checkbox
                      :disabled="firstForm.activeObject[0] === 'all' || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                      v-for="(item, index) in memberLevelList"
                      :key="index"
                      :label="item.code"
                      >{{ item.name }}</el-checkbox
                    >
                  </el-checkbox-group>
                </el-form-item>
                <el-form-item label="规则说明:" prop="ruleDescription">
                  <el-input
                    :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')"
                    type="textarea"
                    :rows="3"
                    v-model="firstForm.ruleDescription"
                    maxlength="150"
                    show-word-limit
                  ></el-input>
                </el-form-item>
              </el-form>
            </div>
          </div>
          <div class="btn-wrap">
            <el-button @click="dialogVisible = false">取消</el-button>
            <el-button @click="nextStep" type="primary">下一步</el-button>
          </div>
        </div>
        <div v-show="!isFirstStep" class="second">
          <div class="form-wrap">
            <div class="left-wrap">
              <!-- 九宫格的样式 start -->
              <div class="ninth-wrap" v-show="firstForm.drawStyle === '1'">
                <!-- 顶部导航 -->
                <div class="top-nav">
                  幸运抽奖
                </div>
                <!-- 头部标题 -->
                <div class="ninth-title-wrap">
                  <div class="ninth-love">
                    <img src="../../assets/images/love.png" alt="" />
                  </div>
                  <div class="win-price">
                    <img src="../../assets/images/winprize.png" alt="" />
                  </div>
                  <div class="ninth-activity-name">
                    {{ firstForm.name }}
                  </div>
                  <div class="ninth-activity-time">{{ firstForm.beginTime | dateFormat }} - {{ firstForm.endTime | dateFormat }}</div>
                </div>
                <!-- 抽奖区域 -->
                <div class="ninth-choose-prize">
                  <div class="ninth-prize-wrap">
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 0">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 1">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 2">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 7">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div class="start-choose">
                        <img src="../../assets/images/start-choose.png" alt="" />
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 3">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 6">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 5">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                    <div class="ninth-item">
                      <div v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index">
                        <div class="prize-item" v-show="index === 4">
                          <div>
                            <img :src="item.url" alt="" />
                          </div>
                          <span>{{ item.name | nameFomat }}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- 九宫格的样式 end -->
              <div class="round-wrap" v-show="firstForm.drawStyle === '2'">
                <!-- 顶部导航 -->
                <div class="top-nav">
                  幸运抽奖
                </div>
                <!-- 头部标题 -->
                <div class="orcle-title-wrap">
                  <div class="orcle-activity-name">
                    {{ firstForm.name }}
                  </div>
                  <div class="orcle-time">{{ firstForm.beginTime | dateFormat }} - {{ firstForm.endTime | dateFormat }}</div>
                </div>
                <div class="orcle-container">
                  <div class="orcle-wrap">
                    <div
                      v-for="(item, index) in sencondForm.luckyDrawPrizeList"
                      :key="index"
                      class="sector"
                      :style="{ transform: `rotate(${item.start}deg) skewY(${item.scale}deg)`, background: item.colour }"
                    >
                      <div class="name">
                        <span>{{ item.name | nameFomat }}</span>
                        <img :src="item.url" alt="" />
                      </div>
                    </div>
                    <div class="pointer"><img src="../../assets/images/pointer.png" alt="" /></div>
                  </div>
                </div>
              </div>
            </div>
            <div>
              <div class="add-prize">
                <!-- <el-button @click="addPrize" v-show="firstForm.drawStyle === '2'" type="text">+ 新增奖品</el-button> -->
              </div>
              <el-form :model="sencondForm" ref="sencondFormRef" label-width="100px" label-position="rigth">
                <el-tabs v-model="activeIndex" :tab-position="'left'" @tab-click="handleTabClick" :before-leave="beforeTabLeave">
                  <el-tab-pane v-for="(item, index) in sencondForm.luckyDrawPrizeList" :key="index" :label="'奖品' + item.location">
                    <el-form-item ref="name" :rules="luckyDrawPrizeRules.name" label="奖品名称：" :prop="'luckyDrawPrizeList.' + index + '.name'">
                      <el-input :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model.trim="item.name" maxlength="10" show-word-limit></el-input
                    ></el-form-item>
                    <el-form-item ref="prizeType" :rules="luckyDrawPrizeRules.prizeType" label="奖品选择：" :prop="'luckyDrawPrizeList.' + index + '.prizeType'">
                      <div>
                        <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="item.prizeType" @change="handleChangePeizeType" label="1">谢谢参与</el-radio>
                      </div>
                      <div>
                        <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="item.prizeType" @change="handleChangePeizeType" label="3">积分</el-radio>
                        <el-input
                          v-show="item.prizeType === '3'"
                          v-model.number="item.point"
                          @change="handleChangePeizeType"
                          :disabled="item.prizeType !== '3' || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                          class="width100"
                        ></el-input>
                      </div>
                      <div>
                        <el-radio :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="item.prizeType" label="2">优惠券</el-radio>
                        <el-button
                          v-show="item.prizeType === '2'"
                          size="mini"
                          type="primary"
                          @click="handleChooseCouponTemplate"
                          :disabled="item.prizeType !== '2' || (!isAdd && currentStatus !== '0' && !(currentStatus === '3'))"
                          >添加优惠券</el-button
                        >
                        <br />
                        <span v-show="item.prizeType === '2'">{{ formatTransCouponName(item.couponTemplateId) }}</span>
                      </div>
                    </el-form-item>
                    <el-form-item label="奖品跨度：" v-show="firstForm.drawStyle === '2'" :rules="luckyDrawPrizeRules.span" :prop="'luckyDrawPrizeList.' + index + '.span'">
                      <el-input disabled v-model.number="item.span" class="width100"></el-input><span class="tip-text">大转盘共360度，每个奖项占用的45度</span>
                    </el-form-item>
                    <el-form-item label="图片：">
                      <yp-single-upload :utype="'prizeImg'" :url.sync="item.url"></yp-single-upload>
                    </el-form-item>
                    <el-form-item label="背景色：" v-show="firstForm.drawStyle === '2'" :rules="luckyDrawPrizeRules.colour" :prop="'luckyDrawPrizeList.' + index + '.colour'">
                      <div class="bg-color">
                        <el-color-picker :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="item.colour"></el-color-picker
                        ><span class="tip-text">设置每个奖项的背景色</span>
                      </div>
                    </el-form-item>
                    <el-form-item label="奖品数量：" :rules="luckyDrawPrizeRules.stockQuantity" :prop="'luckyDrawPrizeList.' + index + '.stockQuantity'">
                      <el-input :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model.number="item.stockQuantity" class="width100"></el-input>
                    </el-form-item>
                    <el-form-item label="中奖概率：" :rules="luckyDrawPrizeRules.probability" :prop="'luckyDrawPrizeList.' + index + '.probability'">
                      <el-input :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')" v-model="item.probability" class="width100"></el-input> %
                      <span class="tip-text">每个用户每次中奖的概率</span>
                    </el-form-item>
                  </el-tab-pane>
                </el-tabs>
              </el-form>
            </div>
          </div>
          <div class="btn-wrap">
            <el-button type="primary" @click="preStep">上一步</el-button>
            <el-button type="primary" @click="confirm(1)" :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')">保存</el-button>
            <el-button type="primary" @click="confirm(2)" :disabled="!isAdd && currentStatus !== '0' && !(currentStatus === '3')">保存并发布</el-button>
          </div>
        </div>
      </div>
    </el-dialog>
    <!-- 弹出框 end -->
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
        @select="select"
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
    <!-- 弹出框 end -->
    <el-dialog :lock-scroll="false" :close-on-click-modal="false" :append-to-body="true" v-dialogDrag title="幸运抽奖明细" :visible.sync="luckDrawDetailDialogVisible" width="80%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '幸运抽奖明细' }}
        </div>
      </template>
      <!-- 头部搜索表单 begin -->
      <div class="search-form-box">
        <yp-search-form class="search-form-wrapper" :formLabel="searchLockDrawDetailLabel" :formData="serachLuckDrawDetailForm"></yp-search-form>
        <div class="search-btn-wrapper">
          <el-button
            class="reset-btn"
            :style="{ border: `1px solid ${this.$store.state.header.themeColor}`, color: this.$store.state.header.themeColor }"
            @click="resetSearchsearchLockDrawDetailForm"
            size="mini"
            icon="el-icon-refresh-left"
            >重置</el-button
          >
          <el-button class="search-btn" type="primary" @click="searchsearchLockDrawDetailForm" size="mini" icon="el-icon-search">搜索</el-button>
        </div>
      </div>
      <!-- 头部搜索 end -->
      <!-- 数据表格内容 start -->
      <el-table :data="viewDataList" stripe border max-height="300px" :header-cell-style="{ background: '#eef1f6', color: '#606266' }">
        <el-table-column label="会员卡号" prop="cardNumber"></el-table-column>
        <el-table-column label="手机号" prop="phone"></el-table-column>
        <el-table-column label="昵称" prop="nickName"></el-table-column>
        <el-table-column label="抽奖时间" prop="drawTime"></el-table-column>
        <el-table-column label="中奖信息" prop="name"></el-table-column>
        <el-table-column label="抽奖活动编号" prop="number"></el-table-column>
      </el-table>
      <!-- 分页 begin -->
      <div class="pagination-wrapper">
        <div class="pagination">
          <el-pagination
            @size-change="handleViewSizeChange"
            @current-change="handleViewDataCurrentChange"
            :current-page="serachLuckDrawDetailForm.pageIndex"
            :page-sizes="[10, 20, 30, 40]"
            :page-size="serachLuckDrawDetailForm.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="detailTotal"
          >
          </el-pagination>
        </div>
      </div>
      <!-- 分页 end -->
    </el-dialog>
    <!-- 数据表格内容 end -->
  </div>
</template>

<script>
import ninthData from './data.js'
import YpSearchForm from '@/components/form/YpSearchForm.vue'
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
export default {
  components: {
    YpSearchForm,
    YpSingleUpload
  },
  data() {
    // 校验结束时间不能为空
    const checkEndTime = (rule, value, cb) => {
      if (this.currentStatus === '1' || this.currentStatus === '2') {
        return cb()
      } else {
        if (!this.firstForm.endTime && value) {
          cb(new Error('结束时间不能为空'))
        } else {
          if (new Date(value).getTime() < new Date().getTime()) {
            cb(new Error('开始时间不能小于当前时间'))
          } else {
            if (new Date(value).getTime() >= new Date(this.firstForm.endTime).getTime()) {
              cb(new Error('结束时间不能小于或等于开始时间'))
            } else {
              return cb()
            }
          }
        }
      }
    }
    // 校验消耗积分不能为空，且为正整数
    const checkUsePoint = (rule, value, cb) => {
      if (this.firstForm.drawType === '2') {
        if (!this.firstForm.usePoint) {
          cb(new Error('消耗积分不能为空'))
        } else {
          const reg = /^\+?[1-9]\d*$/
          if (!reg.test(this.firstForm.usePoint)) {
            cb(new Error('请输入正整数'))
          } else {
            return cb()
          }
        }
      } else {
        return cb()
      }
    }
    // 限制参数次数不能为空且为正整数
    const checkTriesLimit = (rule, value, cb) => {
      if (!this.firstForm.triesLimit1 || !this.firstForm.triesLimit2) {
        cb(new Error('可抽次数不能为空'))
      } else {
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(this.firstForm.triesLimit1) || !reg.test(this.firstForm.triesLimit2)) {
          cb(new Error('请输入正整数'))
        } else {
          return cb()
        }
      }
    }
    // 校验当奖品选择为积分时，积分不能为空，并且是正整数
    const checkPrizeUsepoint = (rule, value, cb) => {
      // console.log(value)
      // console.log(this.activeIndex)
      // console.log(this.sencondForm)
      if (value === '3') {
        if (!this.sencondForm.luckyDrawPrizeList[this.activeIndex * 1].point) {
          cb(new Error('必填，请输入正整数'))
        } else {
          const reg = /^\+?[1-9]\d*$/
          if (!reg.test(this.sencondForm.luckyDrawPrizeList[this.activeIndex * 1].point)) {
            cb(new Error('请输入正整数'))
          } else {
            return cb()
          }
        }
      } else {
        return cb()
      }
    }
    // 校验奖品为优惠券时，优惠券模板不能为空
    const checkPrizeCoupon = (rule, value, cb) => {
      console.log('校验打印当前索引值', value)
      // if (value === '2') {
      //   if (!this.sencondForm.luckyDrawPrizeList[this.activeIndex * 1].couponTemplateId) {
      //     cb(new Error('优惠券模板为必选'))
      //   } else {
      //     return cb()
      //   }
      // } else {
      //   return cb()
      // }
      cb()
    }
    const checkSpan = (rule, value, cb) => {
      if (value === 0) {
        cb(new Error('奖品跨度不能为0'))
      } else {
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('请输入正整数'))
        } else {
          if (value > 120) {
            cb(new Error('奖品跨度不能超过120'))
          } else {
            return cb()
          }
        }
      }
    }
    const checkStockQuantity = (rule, value, cb) => {
      if (value === 0) {
        cb(new Error('奖品数量不能为0'))
      } else {
        const reg = /^\+?[1-9]\d*$/
        if (!reg.test(value)) {
          cb(new Error('请输入正整数'))
        } else {
          return cb()
        }
      }
    }
    const checkProbability = (rule, value, cb) => {
      if (value !== '') {
        const reg = /^(([1-9]{1}\d*)|(0{1}))(\.\d{1,2})?$/
        if (!reg.test(value)) {
          cb(new Error('请输入合法的中奖概率，最多两位小数'))
        } else {
          if (value > 100 || value === '0') {
            cb(new Error('中奖概率不能超过100或等于0'))
          } else {
            return cb()
          }
        }
      } else {
        return cb()
      }
    }
    return {
      currentStatus: '0',
      detailTotal: 0, // 抽奖记录的分页总条数
      viewDataList: [],
      luckDrawDetailDialogVisible: false, // 幸运抽奖明细
      currentLuckDrawId: '',
      serachLuckDrawDetailForm: {
        pageIndex: 1,
        pageSize: 20,
        memberId: '',
        memberName: '',
        number: '',
        drawBeginTime: '',
        drawEndTime: '',
        exclude: ''
      },
      searchCouponTemplateForm: {
        code: '',
        name: '',
        type: '',
        status: '1',
        pageIndex: 1,
        pageSize: 999
      }, // 优惠券查询
      couponTemplateDialogVisible: false, // 选择优惠券模板弹出框
      couponTemplateList: [], // 优惠券模板列表
      drawTypeIsPiont: false,
      startTime: {
        disabledDate: time => {
          if (this.firstForm.beginTime) {
            return time.getTime() < new Date().getTime() - 86399999
          } else {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      endTime: {
        disabledDate: time => {
          if (this.firstForm.beginTime) {
            return time.getTime() < new Date(this.firstForm.beginTime).getTime() - 86399999
          }
          if (!this.firstForm.beginTime) {
            // 不能小于当前日期
            return time.getTime() < Date.now() - 86399999 // 加- 8.64e7则表示包当天
          }
        }
      },
      isJump: true,
      activeIndex: '0',
      roundData: [
        {
          location: 1,
          name: '',
          prizeType: '1',
          couponTemplateId: '',
          point: 1,
          stockQuantity: 1,
          probability: 1,
          url: 'https://qiaokun.yuepong.com/defaultprize.png',
          colour: '#ffffff',
          span: 45
        }
      ],
      memberLevelList: [], // 会员等级列表
      ninthStatic: require('@/assets/images/ninthStatic.png'),
      orcleStatic: require('@/assets/images/orcleStatic.png'),
      isFirstStep: true,
      dialogVisible: false,
      isAdd: true,
      total: 0, // 分页总条数
      luckDrawList: [], // 幸运抽奖活动列表
      searchLuckDrawForm: {
        name: '', // 活动名称
        drawStyle: '', // 抽奖形式
        status: '', // 活动状态
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        pageIndex: 1, // 当前页数
        pageSize: 20 // 当前条数
      },
      drawStyleSelectList: [
        { label: '不限', value: '' },
        { label: '九宫格', value: '1' },
        { label: '大转盘', value: '2' }
      ],
      statusList: [
        { label: '不限', value: '' },
        { label: '未发布', value: '0' },
        { label: '已发布', value: '1' },
        { label: '已过期', value: '2' },
        { label: '撤销发布', value: '3' }
      ],
      luckDrawForm: {},
      firstForm: {
        drawStyle: '1', // 抽奖形式
        name: '', // 活动名称
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        drawType: '1', // 抽奖类型
        usePoint: 1, // 消耗积分
        triesLimitType: '1', // 限制次数类型
        triesLimit1: 1,
        triesLimit2: 1,
        activeObject: ['all'], // 活动对象
        ruleDescription: '' // 规则说明
      },
      firstFormRule: {
        drawStyle: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        name: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        beginTime: [
          {
            required: true,
            message: '开始时间不能为空',
            trigger: 'blur'
          },
          {
            validator: checkEndTime,
            trigger: 'change'
          }
        ],
        drawType: [
          {
            required: true,
            message: '必填',
            trigger: 'change'
          },
          {
            validator: checkUsePoint,
            trigger: 'change'
          }
        ],
        triesLimitType: [
          {
            required: true,
            message: '必填',
            trigger: 'change'
          },
          {
            validator: checkTriesLimit,
            trigger: 'change'
          }
        ],
        activeObject: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ]
      },
      sencondForm: {
        luckyDrawPrizeList: []
      },
      luckyDrawPrizeRules: {
        name: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          }
        ],
        prizeType: [
          {
            required: true,
            message: '必选',
            trigger: 'change'
          },
          {
            validator: checkPrizeUsepoint,
            trigger: 'change'
          },
          {
            validator: checkPrizeCoupon,
            trigger: 'change'
          }
        ],
        stockQuantity: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkStockQuantity, // 校验正整数
            trigger: 'blur'
          }
        ],
        probability: [
          {
            required: true,
            message: '必填',
            trigger: 'blur'
          },
          {
            validator: checkProbability, // 校验正整数
            trigger: 'blur'
          }
        ],
        span: [
          {
            validator: checkSpan, // 校验正整数
            trigger: 'blur'
          }
        ],
        colour: [
          {
            required: true,
            message: '必选',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  filters: {
    nameFomat: function(val) {
      if (!val) {
        return ''
      } else {
        if (val.length > 4) {
          return val.substring(0, 4) + '..'
        } else {
          return val
        }
      }
    },
    dateFormat: function(value) {
      if (!value) return ''
      const newdate = value.substring(0, 10)
      return newdate
    }
  },
  computed: {
    // 奖品设置中 优惠券模板Id转换显示为优惠券模板名称
    formatTransCouponName() {
      return function(val) {
        const obj = this.transformCouponTemplateList.filter(item => item.id === val)
        if (val.length > 0) {
          val = obj[0].name
          return val
        } else {
          return '请添加优惠券'
        }
      }
    },
    // 幸运列表数据状态转换
    formatStatus() {
      return function(val) {
        const obj = this.statusList.filter(item => item.value === val)
        val = obj[0].value + '-' + obj[0].label
        return val
      }
    },
    searchLockDrawDetailLabel() {
      return [
        {
          label: '昵称:',
          type: 'input',
          prop: 'memberName',
          placeholder: '手机号或昵称'
        },
        {
          label: '活动编号:',
          type: 'input',
          prop: 'number'
        },
        {
          label: '抽奖开始时间:',
          type: 'time',
          props: 'drawBeginTime',
          placeholder: '开始日期'
        },
        {
          label: '抽奖结束时间:',
          type: 'time',
          props: 'drawEndTime',
          placeholder: '结束日期'
        }
      ]
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
    searchLuckDrawLabel() {
      return [
        {
          label: '活动名称:',
          type: 'input',
          prop: 'name'
        },
        {
          label: '活动形式:',
          type: 'select',
          prop: 'drawStyle',
          options: this.drawStyleSelectList
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
  created() {
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
    // 获取优惠券模板界面，渲染静态界面
    this.getHasSelectedCouponTemplateList()
    // 获取会员等级数据
    this.getMemberLevelList()
    // 获取幸运抽奖列表数据
    this.getLuckDrawList()
  },
  methods: {
    handleTriesLimitType() {
      if (this.firstForm.triesLimitType === '1') {
        this.firstForm.triesLimit2 = 1
      } else {
        this.firstForm.triesLimit1 = 1
      }
    },
    /**
     * 描述：通过id查看详情
     */
    viewLuckDrawDetail(id) {
      // 设置为编辑模式
      this.isAdd = false
      this.currentLuckDrawId = id
      this.getLuckDrawListDetailById(id)
    },
    /**
     * 描述：复制活动
     */
    copyLuckDrawById(id) {
      this.isAdd = true
      this.getLuckDrawListDetailById(id)
    },
    // 通过id查询详情数据并调起弹窗
    async getLuckDrawListDetailById(id) {
      this.activeIndex = '0'
      const { data } = await this.$api.getLuckDrawApi.getLuckDrawListDetailById(id)
      if (this.isAdd) {
        this.currentStatus = '0'
      } else {
        this.currentStatus = data.status
      }

      // 数据处理
      this.firstForm.drawStyle = data.drawStyle
      this.firstForm.name = data.name
      this.firstForm.beginTime = data.beginTime
      this.firstForm.endTime = data.endTime
      this.firstForm.drawType = data.drawType
      this.firstForm.usePoint = data.usePoint
      this.firstForm.triesLimitType = data.triesLimitType
      this.firstForm.triesLimit = data.triesLimit
      this.firstForm.activeObject = data.activeObject.split(',')
      this.firstForm.ruleDescription = data.ruleDescription
      if (this.firstForm.drawType === '1') {
        this.drawTypeIsPiont = false
      } else {
        this.drawTypeIsPiont = true
      }
      if (data.triesLimitType === '1') {
        this.firstForm.triesLimit1 = this.firstForm.triesLimit
        this.firstForm.triesLimit2 = 1
      }
      if (data.triesLimitType === '2') {
        this.firstForm.triesLimit2 = this.firstForm.triesLimit
        this.firstForm.triesLimit1 = 1
      }
      delete this.firstForm.triesLimit
      console.log('根据id查询处理之后****************', this.firstForm)
      if (this.isAdd) {
        this.firstForm.beginTime = ''
        this.firstForm.endTime = ''
        // 处理复制的逻辑
        this.sencondForm.luckyDrawPrizeList = [...ninthData]
      }
      if (!this.isAdd) {
        // 处理编辑的逻辑
        this.sencondForm.luckyDrawPrizeList = data.luckyDrawPrizeList
        let tempStart = 0
        let tempScale = 0
        this.sencondForm.luckyDrawPrizeList.forEach((item, i) => {
          item.scale = item.span - 90 // 所占弧度的度数
          item.scaleText = tempScale + (90 + (item.span - 90)) / 2 // 文字的回旋角度
          item.sin = Math.sin((Math.PI * 2 * item.scaleText) / 360) * 160 // 正弦
          item.cos = Math.cos((Math.PI * 2 * item.scaleText) / 360) * 160 // 余弦
          tempScale = tempScale + 90 + (item.span - 90)
          if (i !== 0) {
            tempStart = tempStart + this.sencondForm.luckyDrawPrizeList[i - 1].span
          }
          item.start = tempStart
        })
      }
      this.dialogVisible = true
    },
    /**
     * 描述：根据id发布活动
     */
    async publishLuckDrawById(id) {
      const confirmResult = await this.$confirm('确定要将发布该活动吗？', '发布', {
        confirmButtonText: this.$t('lang.confirm'),
        cancelButtonText: this.$t('lang.cancel'),
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.getCouponTemplateList()
        return this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optCancel'),
          type: 'info'
        })
      } else {
        const luckDetail = await this.$api.getLuckDrawApi.getLuckDrawListDetailById(id)
        if (new Date(luckDetail.data.endTime).getTime() < new Date().getTime()) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '活动结束时间不能小于当前时间',
            type: 'info'
          })
        } else {
          let couponName = []
          const arr = luckDetail.data.luckyDrawPrizeList
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].couponTemplateId) {
              const resData = await this.$api.getCouponTemplateApi.getCouponTemplateById(arr[i].couponTemplateId)
              console.log('优惠券信息', resData)
              if (resData.timeRule === '1' && new Date(resData.endTime).getTime() < new Date(luckDetail.data.endTime).getTime()) {
                couponName.push(resData.name)
              }
            }
          }
          if (couponName.length !== 0) {
            couponName = couponName.toString()
            const confirmResult = await this.$confirm(`存在券模板 ${couponName} 的失效期比抽奖活动结束时间早，是否继续?`, '提示', {
              confirmButtonText: this.$t('lang.confirm'),
              cancelButtonText: this.$t('lang.cancel'),
              type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
              this.getCouponTemplateList()
              return this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optCancel'),
                type: 'info'
              })
            } else {
              const res = await this.$api.putLuckDrawApi.putReleaseLuckDraw(id)
              // // 判断状态码 提示成功
              if (res.code === '200000') {
                this.getLuckDrawList()
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
              }
            }
          }
          if (couponName.length === 0) {
            const res = await this.$api.putLuckDrawApi.putReleaseLuckDraw(id)
            // // 判断状态码 提示成功
            if (res.code === '200000') {
              this.getLuckDrawList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
            }
          }
        }
      }
    },
    /**
     * 描述：通过id撤销发布
     */
    async unPublishLuckDrawById(id) {
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
        // 处理撤销发布逻辑
        const res = await this.$api.putLuckDrawApi.putUnpublishLuckDraw(id)
        if (res.code === '200000') this.getLuckDrawList()
        this.$notify({
          title: this.$t('lang.tip'),
          message: this.$t('lang.optSuccess'),
          type: 'success'
        })
      }
    },
    /**
     * 描述：查看数据
     */
    viewData(number) {
      this.serachLuckDrawDetailForm.pageIndex = 1
      this.serachLuckDrawDetailForm.number = number
      this.getViewDataList()
    },
    /**
     * 描述：查询抽奖记录分页列表数据
     */
    async getViewDataList() {
      const res = await this.$api.getLuckDrawApi.getViewDataDetailList(this.serachLuckDrawDetailForm)
      this.viewDataList = res.data
      this.detailTotal = res.total
      this.luckDrawDetailDialogVisible = true
    },
    /**
     * 描述：后端接口返回幸运抽奖数据
     */
    async getLuckDrawList() {
      const res = await this.$api.getLuckDrawApi.getLuckDrawList(this.searchLuckDrawForm)
      console.log(res)
      this.total = res.total
      this.luckDrawList = res.data
    },
    /**
     * 描述：修改奖品选择的类型
     */
    handleChangePeizeType() {
      if (this.sencondForm.luckyDrawPrizeList[this.activeIndex].prizeType !== '3') {
        this.sencondForm.luckyDrawPrizeList[this.activeIndex].point = 1
      }
      if (this.sencondForm.luckyDrawPrizeList[this.activeIndex].prizeType !== '2') {
        this.sencondForm.luckyDrawPrizeList[this.activeIndex].couponTemplateId = ''
      }
    },
    // 获取row的key值
    getRowKeys(row) {
      return row.id
    },
    /**
     * 描述：选择优惠券弹出框
     */
    handleChooseCouponTemplate() {
      this.couponTemplateDialogVisible = true
      this.getCouponTemplateList()
    },
    resetSearchsearchLockDrawDetailForm() {
      this.serachLuckDrawDetailForm = {
        pageIndex: 1,
        pageSize: 20,
        memberId: '',
        memberName: '',
        number: '',
        drawBeginTime: '',
        drawEndTime: '',
        exclude: ''
      }
      this.getViewDataList()
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
    searchsearchLockDrawDetailForm() {
      this.serachLuckDrawDetailForm.pageIndex = 1
      this.getViewDataList()
    },
    /**
     * 描述：查询券模板管理
     */
    searchsearchCouponTemplateForm() {
      this.getCouponTemplateList()
    },
    async select(selection, row) {
      // 清除 所有勾选项
      await this.$refs.tableRef.clearSelection()
      // 当表格数据都没有被勾选的时候 就返回
      // 主要用于将当前勾选的表格状态清除
      if (selection.length === 0) return
      this.$refs.tableRef.toggleRowSelection(row, true)
    },
    /**
     * 获取表格当前选中的值
     */
    selRow(val) {
      console.log('当前选中的值', val)
      this.currentSelectCouponTemplateObject = val
      console.log('当前选择优惠券对象', this.currentSelectCouponTemplateObject)
    },
    /**
     * 描述：取消选择优惠券
     */
    cancelSelectCouponTemplate() {
      this.couponTemplateDialogVisible = false
    },
    /**
     * 描述：确认选择优惠券
     */
    confirmSelectCouponTemplate() {
      this.sencondForm.luckyDrawPrizeList[this.activeIndex].couponTemplateId = this.currentSelectCouponTemplateObject[0].id
      this.couponTemplateDialogVisible = false
    },
    /**
     * 描述：获取优惠券列表数据
     */
    async getHasSelectedCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      this.transformCouponTemplateList = res.data
    },
    /**
     * 描述：获取有效状态券模板列表
     */
    async getCouponTemplateList() {
      const res = await this.$api.getCouponTemplateApi.getCouponTemplateList(this.searchCouponTemplateForm)
      this.couponTemplateList = res.data
      this.$nextTick(() => {
        this.$refs.tableRef.clearSelection()
        if (this.sencondForm.luckyDrawPrizeList[this.activeIndex].couponTemplateId !== '') {
          const index = this.couponTemplateList.findIndex(item => {
            return item.id === this.sencondForm.luckyDrawPrizeList[this.activeIndex].couponTemplateId
          })
          this.$refs.tableRef.toggleRowSelection(this.couponTemplateList[index], true)
        }
      })
    },
    /**
     * 描述：修改抽奖类型
     */
    handleChangeDrawType() {
      if (this.firstForm.drawType === '1') {
        this.drawTypeIsPiont = false
        this.firstForm.usePoint = 1
      } else {
        this.drawTypeIsPiont = true
      }
    },
    /**
     * 描述：开始时间
     */
    handleChangeBeginTime(e) {
      if (this.firstForm.endTime) {
        this.firstForm.endTime = ''
        return this.$message.info('重新选择开始时间，结束时间自动清除，请重新选择结束时间')
      }
    },
    /**
     * 描述：选择结束时间
     */
    handleChangeEndTime(e) {
      if (this.firstForm.beginTime) {
        if (new Date(this.firstForm.beginTime).getTime() > new Date(this.firstForm.endTime).getTime()) {
          this.firstForm.endTime = ''
          return this.$message.info('结束时间不能小于开始时间')
        }
      }
    },

    beforeTabLeave(tab) {
      console.log('离开tab之前的方法', tab)
      this.isJump = true
      console.log('离开之前需要做的事情', tab - 1)
      this.$refs.sencondFormRef.validate((valid, error) => {
        console.log(valid)
        if (!valid) {
          console.log(error)
          const keyName = Object.keys(error)
          console.log(keyName)
          for (let i = 0; i < keyName.length; i++) {
            if (keyName[i].includes(tab - 1 + '')) {
              console.log('包含了index值', tab)
              this.isJump = false
            }
          }
        }
      })
      if (!this.isJump) {
        this.$notify({
          title: this.$t('lang.tip'),
          message: '请先完成当前或上一个奖品设置',
          type: 'info'
        })
        // if (!this.isJump) {
        //   this.activeIndex = tab
        // }
        return this.isJump
      }
    },
    handleTabClick(e) {
      console.log(e)
      console.log('奖品高亮', this.activeIndex)
    },
    /**
     * 描述：大转盘添加奖品
     */
    addPrize() {
      console.log(this.sencondForm.luckyDrawPrizeList)
      const obj = {
        location: this.sencondForm.luckyDrawPrizeList.length + 1,
        name: '',
        prizeType: '1',
        couponTemplateId: '',
        point: 1,
        stockQuantity: 1,
        probability: 1,
        url: 'https://qiaokun.yuepong.com/defaultprize.png',
        colour: '#ffffff',
        span: 45
      }
      this.sencondForm.luckyDrawPrizeList.push(obj)
      let tempStart = 0
      let tempScale = 0
      this.sencondForm.luckyDrawPrizeList.forEach((item, i) => {
        item.scale = item.span - 90 // 所占弧度的度数
        item.scaleText = tempScale + (90 + (item.span - 90)) / 2 // 文字的回旋角度
        item.sin = Math.sin((Math.PI * 2 * item.scaleText) / 360) * 160 // 正弦
        item.cos = Math.cos((Math.PI * 2 * item.scaleText) / 360) * 160 // 余弦
        tempScale = tempScale + 90 + (item.span - 90)
        if (i !== 0) {
          tempStart = tempStart + this.sencondForm.luckyDrawPrizeList[i - 1].span
        }
        item.start = tempStart
      })
      console.log('转变之后的奖品数据格式', this.sencondForm.luckyDrawPrizeList)
    },
    /**
     * 描述：根据选择抽奖形式改变九宫格或大转盘数据
     */
    handleChangeDrawStyle() {
      this.sencondForm.luckyDrawPrizeList = []
      let temData = JSON.stringify(ninthData)
      temData = JSON.parse(temData)
      if (this.firstForm.drawStyle === '1') {
        this.sencondForm.luckyDrawPrizeList = temData
      }
      if (this.firstForm.drawStyle === '2') {
        this.sencondForm.luckyDrawPrizeList = temData
        let tempStart = 0
        let tempScale = 0
        this.sencondForm.luckyDrawPrizeList.forEach((item, i) => {
          item.scale = item.span - 90 // 所占弧度的度数
          item.scaleText = tempScale + (90 + (item.span - 90)) / 2 // 文字的回旋角度
          item.sin = Math.sin((Math.PI * 2 * item.scaleText) / 360) * 160 // 正弦
          item.cos = Math.cos((Math.PI * 2 * item.scaleText) / 360) * 160 // 余弦
          tempScale = tempScale + 90 + (item.span - 90)
          if (i !== 0) {
            tempStart = tempStart + this.sencondForm.luckyDrawPrizeList[i - 1].span
          }
          item.start = tempStart
        })
      }
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
    },
    /**
     * 描述：计算中间表格的高度
     */
    getHeight() {
      this.height = window.innerHeight - 300 + 'px'
    },
    /**
     * 描述：跳转下一步的方法
     */
    nextStep() {
      this.$refs.firstFormRef.validate(valid => {
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求完成表单',
            type: 'info'
          })
        }
        this.isFirstStep = false
      })
    },
    /**
     * 描述：跳转上一步的方法
     */
    preStep() {
      this.isFirstStep = true
    },
    /**
     * 描述：添加幸运抽奖弹出框
     */
    addLuckDraw() {
      this.isAdd = true
      this.activeIndex = '0'
      this.currentStatus = '0'
      this.addLuckDraw = false
      this.sencondForm.luckyDrawPrizeList = []
      let temData = JSON.stringify(ninthData)
      temData = JSON.parse(temData)
      this.sencondForm.luckyDrawPrizeList = temData
      this.isFirstStep = true
      this.dialogVisible = true
    },
    /**
     * 描述：幸运抽奖列表查询
     */
    searchSearchLuckDrawForm() {
      this.searchLuckDrawForm.pageIndex = 1
      this.getLuckDrawList()
    },
    /**
     * 描述：重置幸运抽奖列表查询
     */
    resetSearchLuckDrawForm() {
      this.searchLuckDrawForm = {
        name: '', // 活动名称
        drawStyle: '', // 抽奖形式
        status: '', // 活动状态
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        pageIndex: 1, // 当前页数
        pageSize: 20 // 当前条数
      }
      this.getLuckDrawList()
    },
    handleViewSizeChange(newPageSize) {
      this.serachLuckDrawDetailForm.pageSize = newPageSize
      this.getViewDataList()
    },
    /**
     * 描述：查询分页切换条数
     */
    handleSizeChange(newPageSize) {
      this.searchLuckDrawForm.pageSize = newPageSize
      this.getLuckDrawList()
    },
    handleViewDataCurrentChange(newPage) {
      this.serachLuckDrawDetailForm.pageIndex = newPage
      this.getViewDataList()
    },
    /**
     * 描述：查询分页切换页数
     */
    handleCurrentChange(newPage) {
      this.searchLuckDrawForm.pageIndex = newPage
      this.getLuckDrawList()
    },
    /**
     * 描述：关闭弹窗的方法
     */
    closeDialog() {
      this.$refs.firstFormRef.resetFields()
      this.$refs.sencondFormRef.resetFields()
      this.firstForm = {
        drawStyle: '1', // 抽奖形式
        name: '', // 活动名称
        beginTime: '', // 开始时间
        endTime: '', // 结束时间
        drawType: '1', // 抽奖类型
        usePoint: 1, // 消耗积分
        triesLimitType: '1', // 限制次数类型
        triesLimit1: 1,
        triesLimit2: 1,
        activeObject: ['all'], // 活动对象
        ruleDescription: '' // 规则说明
      }
      this.sencondForm.luckyDrawPrizeList = [...ninthData]
      this.isFirstStep = true
    },
    // 幸运抽奖的保存或发布
    confirm(save) {
      this.$refs.sencondFormRef.validate(async valid => {
        console.log(valid)
        if (!valid) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '请按照要求填写表单',
            type: 'info'
          })
        }
        let obj = {}
        obj = { ...this.firstForm, ...this.sencondForm }
        console.log('提交数据', obj)
        for (let i = 0; i < obj.luckyDrawPrizeList.length; i++) {
          delete obj.luckyDrawPrizeList[i].scale
          delete obj.luckyDrawPrizeList[i].cos
          delete obj.luckyDrawPrizeList[i].sin
          delete obj.luckyDrawPrizeList[i].scaleText
          delete obj.luckyDrawPrizeList[i].start
          obj.luckyDrawPrizeList[i].probability = obj.luckyDrawPrizeList[i].probability * 1
        }
        if (obj.triesLimitType === '1') {
          obj.triesLimit = obj.triesLimit1
          delete obj.triesLimit1
          delete obj.triesLimit2
        }
        if (obj.triesLimitType === '2') {
          obj.triesLimit = obj.triesLimit2
          delete obj.triesLimit1
          delete obj.triesLimit2
        }
        obj.activeObject = obj.activeObject.toString()
        obj.save = save
        console.log(obj)
        const justCoupon = []
        for (let i = 0; i < obj.luckyDrawPrizeList.length; i++) {
          if (obj.luckyDrawPrizeList[i].prizeType === '2' && !obj.luckyDrawPrizeList[i].couponTemplateId) {
            justCoupon.push(i)
          }
        }
        if (justCoupon.length > 0) {
          this.activeIndex = justCoupon[0] + ''
          return this.$notify({
            title: this.$t('lang.tip'),
            message: `奖品${this.activeIndex * 1 + 1}的优惠券信息不能为空`,
            type: 'info'
          })
        }
        // 判断中奖概率不能大于一百
        let sumProbability = 0
        for (let i = 0; i < obj.luckyDrawPrizeList.length; i++) {
          sumProbability += obj.luckyDrawPrizeList[i].probability
        }
        console.log(sumProbability)
        if (sumProbability * 1 > 100) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '奖品概率所加之和不能大于100',
            type: 'info'
          })
        }
        // 判断优惠券模板
        if (obj.save === 2 && new Date(obj.endTime).getTime() <= new Date().getTime()) {
          return this.$notify({
            title: this.$t('lang.tip'),
            message: '活动结束时间不能小于等于当前时间',
            type: 'info'
          })
        }
        if (obj.save === 1) {
          if (this.isAdd) {
            // 新增逻辑 或者 复制逻辑
            const res = await this.$api.postLusckDrawApi.postLuckDraw(obj)
            if (res.code === '200000') {
              this.getLuckDrawList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
            }
          } else {
            // 编辑逻辑
            const res = await this.$api.putLuckDrawApi.putLuckDrawById(this.currentLuckDrawId, obj)
            if (res.code === '200000') {
              this.getLuckDrawList()
              this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optSuccess'),
                type: 'success'
              })
              this.dialogVisible = false
            }
          }
        } else {
          let couponName = []
          const arr = obj.luckyDrawPrizeList
          console.log(arr)
          for (let i = 0; i < arr.length; i++) {
            if (arr[i].couponTemplateId) {
              console.log('走了这里')
              const resData = await this.$api.getCouponTemplateApi.getCouponTemplateById(arr[i].couponTemplateId)
              if (resData.timeRule === '1' && new Date(resData.endTime).getTime() < new Date(obj.endTime).getTime()) {
                couponName.push(resData.name)
              }
            }
          }
          if (couponName.length !== 0) {
            couponName = couponName.toString()
            const confirmResult = await this.$confirm(`存在券模板 ${couponName} 的失效期比抽奖活动结束时间早，是否继续?`, '提示', {
              confirmButtonText: this.$t('lang.confirm'),
              cancelButtonText: this.$t('lang.cancel'),
              type: 'warning'
            }).catch(err => err)
            if (confirmResult !== 'confirm') {
              this.getCouponTemplateList()
              return this.$notify({
                title: this.$t('lang.tip'),
                message: this.$t('lang.optCancel'),
                type: 'info'
              })
            } else {
              if (this.isAdd) {
                // 新增逻辑 或者 复制逻辑
                const res = await this.$api.postLusckDrawApi.postLuckDraw(obj)
                if (res.code === '200000') {
                  this.getLuckDrawList()
                  this.$notify({
                    title: this.$t('lang.tip'),
                    message: this.$t('lang.optSuccess'),
                    type: 'success'
                  })
                  this.dialogVisible = false
                }
              } else {
                // 编辑逻辑
                const res = await this.$api.putLuckDrawApi.putLuckDrawById(this.currentLuckDrawId, obj)
                if (res.code === '200000') {
                  this.getLuckDrawList()
                  this.$notify({
                    title: this.$t('lang.tip'),
                    message: this.$t('lang.optSuccess'),
                    type: 'success'
                  })
                  this.dialogVisible = false
                }
              }
            }
          }
          if (couponName.length === 0) {
            if (this.isAdd) {
              // 新增逻辑 或者 复制逻辑
              const res = await this.$api.postLusckDrawApi.postLuckDraw(obj)
              if (res.code === '200000') {
                this.getLuckDrawList()
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.dialogVisible = false
              }
            } else {
              // 编辑逻辑
              const res = await this.$api.putLuckDrawApi.putLuckDrawById(this.currentLuckDrawId, obj)
              if (res.code === '200000') {
                this.getLuckDrawList()
                this.$notify({
                  title: this.$t('lang.tip'),
                  message: this.$t('lang.optSuccess'),
                  type: 'success'
                })
                this.dialogVisible = false
              }
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.form-wrap {
  display: flex;
}
.left-wrap {
  width: 40%;
}
.left-wrap img {
  width: 375px;
  height: 628px;
  // height: 895px;
}
.line {
  display: flex;
  align-items: center;
}
.line span {
  margin: 3px 10px;
}
.width120 {
  width: 120px;
}
.width100 {
  width: 100px;
}
.btn-wrap {
  display: flex;
  justify-content: center;
}

.add-prize {
  width: 300px;
  height: 40px;
  margin-top: -40px;
}

::v-deep .el-table__header-wrapper .el-checkbox {
  display: none;
}
.tip-text {
  margin-left: 20px;
  color: blue;
}
.bg-color {
  display: flex;
  align-items: center;
}
// 九宫格抽奖动态样式 start
.ninth-wrap {
  width: 375px;
  height: 628px;
  // background: red;
  background: url(../../assets/images/ninthbg.png);
}
.top-nav {
  width: 100%;
  height: 64px;
  text-align: center;
  line-height: 64px;
  color: #fff;
  font-size: 16px;
}
.ninth-title-wrap {
  position: relative;
  display: flex;
  width: 100%;
  height: 145px;
  justify-content: space-between;
}
.ninth-love {
  width: 158px;
  height: 135px;
  margin-top: 10px;
  margin-left: 20px;
}
.ninth-love img {
  width: 100%;
  height: 100%;
}
.win-price {
  width: 24px;
  height: 124px;
}
.win-price img {
  margin-top: 20px;
  width: 24px;
  height: 124px;
}
.ninth-activity-name {
  position: absolute;
  width: 100%;
  height: 54px;
  font-size: 42px;
  color: #ffffff;
  line-height: 54px;
  top: 50%;
  left: 50%;
  text-align: center;
  transform: translate(-50%, -50%);
}
.ninth-activity-time {
  position: absolute;
  width: 277px;
  height: 37px;
  bottom: 0px;
  left: 50%;
  transform: translateX(-50%);
  background: url(../../assets/images/ninthtime.png) no-repeat;
  color: #ff859d;
  text-align: center;
  line-height: 30px;
}
.ninth-choose-prize {
  position: relative;
  margin: 35px auto;
  width: 324px;
  height: 324px;
  background: url(../../assets/images/choosebg.png) no-repeat;
  background-size: 100% 100%;
}
.ninth-prize-wrap {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: 272px;
  height: 272px;
  top: 40px;
  left: 26px;
  box-sizing: border-box;
}
.start-choose,
.start-choose img {
  width: 100%;
  height: 100%;
}
.ninth-item {
  width: 76px;
  height: 76px;
  border: 4px solid #ffffff;
  border-radius: 10px;
  background: #efefef;
  margin: 3px;
}
.prize-item {
  width: 60px;
  height: 60px;
  margin: 8px auto;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.prize-item img {
  width: 40px;
  height: 40px;
}
.prize-item span {
  color: #f69bac;
}

// 九宫格抽奖动态样式 end
// 大转盘抽奖动态样式 start
.round-wrap {
  width: 375px;
  height: 628px;
  background: url(../../assets/images/orclebg.png) no-repeat;
  background-size: 100% 100%;
}
.orcle-title-wrap {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.orcle-activity-name {
  width: 100%;
  text-align: center;
  color: #fff;
  font-size: 30px;
}
.orcle-time {
  width: 100%;
  text-align: center;
  color: #fff;
}
.orcle-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 340px;
  height: 340px;
  margin: 70px auto;
  background: url(../../assets/images/transbg.png) no-repeat;
  background-size: 100% 100%;
}
.orcle-wrap {
  // overflow: hidden;
  position: relative;
  width: 290px;
  height: 290px;
  // position: fixed;
  z-index: 1;
  border-radius: 50%;
  overflow: hidden;
  transform: rotate(0deg);
  > .sector {
    overflow: hidden;
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 50%;
    transform-origin: 0% 100%;
    text-align: left;
    font-size: 12px;
  }
  .name {
    display: flex;
    flex-direction: column;
    position: absolute;
    bottom: 10px;
    transform: rotate(57deg);
    color: #e43b71;
    // text-align: center;
    justify-content: center;
    align-items: center;
  }
  .name img {
    flex: 1;
    margin-left: 20px;
    width: 50px;
    height: 47px;
    transform: rotateX(65deg);
  }
  .pointer {
    z-index: 888;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 64px;
    height: 83px;
  }
  .pointer img {
    width: 100%;
    height: 100%;
  }
}
</style>

<!--
 * @Description: 功能描述
 * @Version: 1.5.1
 * @Author: Yuchuan
 * @Date: 2020-11-22 22:10:04
-->
<template>
  <div style="box">
    <el-form class="demo-form-inline" label-position="right" label-width="100px">
      <el-row class="query-info-container">
        <el-col :span="item.span" v-for="(item, index) in propArrSearch" :key="index" style="padding-right:60px">
          <!-- 下拉选择框 -->
          <el-form-item :label="item.lable" :prop="item.props" :label-width="item.width" v-if="item.type === 'list'">
            <el-select v-model="queryInfo[item.props]" placeholder="请选择">
              <el-option v-for="items in item.listInfo" :key="items.value" :value="items.value" :label="items.name"></el-option>
            </el-select>
          </el-form-item>
          <!-- 时间 -->
          <el-form-item :label="item.lable" :prop="item.props" :label-width="item.width" v-else-if="item.type === 'time'">
            <el-date-picker v-model="queryInfo[item.props]" type="datetime" :placeholder="item.lable" clearable value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
          </el-form-item>
          <!-- 普通的input -->
          <el-form-item :label="item.lable" :prop="item.props" :label-width="item.width" v-else>
            <el-input clearable :placeholder="item.lable" v-model.trim="queryInfo[item.props]" :style="'width' + ':' + `${item.styleWidth}`"></el-input>
          </el-form-item>
        </el-col>
        <!-- 搜索表单的重置与搜索 -->
        <el-col :span="search.span" class="query-info-btns">
          <el-button type="text" class="underline" @click="restting">{{ search.resetSearch }}</el-button>
          <el-button icon="el-icon-refresh" type="primary" class="searchButton" @click="searchBtn">{{ search.searchForm }}</el-button>
        </el-col>
      </el-row>
    </el-form>
  </div>
</template>
<script>
export default {
  props: {
    propArrSearch: {
      type: Array
    },
    search: {
      type: Object
    },
    resetSearch: {
      type: String
    },
    searchForm: {
      type: String
    }
  },
  data() {
    return {
      queryInfo: {}
    }
  },
  created() {
    // 初始加载时让输入到默认值
    this.dataInsert()
  },
  methods: {
    // 赋值入数组将默认值赋值到数组中
    dataInsert() {
      const acceptList = this.propArrSearch
      // console.log(acceptList)
      acceptList.forEach(item => {
        this.$set(this.queryInfo, item.props, item.default)
      })
      this.queryInfo.pageIndex = 1
      this.queryInfo.pageSize = 20
      // console.log(this.queryInfo)
    },
    // 搜索返回输入后的数组
    searchBtn() {
      this.$emit('searchList', this.queryInfo)
    },
    // 重置数据并且返回初始数组
    restting() {
      this.dataInsert()
      this.$emit('restting', this.queryInfo)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  margin-top: 20px;
}
</style>

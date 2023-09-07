<!--
 * @Author: qiaokun
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-20 11:42:45
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\components\form\YpSearchForm.vue
-->
<template>
  <el-form :model="formData" label-width="auto" :label-position="'left'" ref="formRef">
    <el-row type="flex" justify="start" style="flexWrap:wrap;">
      <el-col :span="item.span ? item.span : 7" v-for="(item, index) in showSearchList" :key="index">
        <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
          <el-input v-model.trim="formData[item.prop]" :placeholder="item.placeholder ? item.placeholder : '请输入'" style="width:auto" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="item.type === 'select'" :label="item.label">
          <el-select v-model="formData[item.prop]" filterable :placeholder="$t('lang.pleaseselect')" style="width:auto" :disabled="item.disabled ? true : false" clearable>
            <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type === 'date'" :label="item.label">
          <el-date-picker v-model="formData[item.prop]" type="date" value-format="yyyy-MM-dd" style="width:auto" :placeholder="item.placeholder ? item.placeholder : '请输入或选择'"> </el-date-picker>
        </el-form-item>
        <el-form-item v-if="item.type === 'time'" :label="item.label">
          <div class="block" style="display:flex;">
            <span>
              <el-date-picker value-format="yyyy-MM-dd HH:mm:ss" v-model="formData[item.props]" type="datetime" style="width:auto" :placeholder="item.placeholder"> </el-date-picker>
            </span>
          </div>
        </el-form-item>
        <!--zhh datetimerange 新增 start-->
        <el-form-item v-if="item.type === 'datetimerange'" :label="item.label">
          <div class="block" style="display:flex;">
            <span>
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData[item.props1]"
                type="datetime"
                :picker-options="item.pickerOptionsStart"
                style="width:auto;"
                :placeholder="item.placeholder1">
              </el-date-picker>
            </span>
            <slot name="rangeSeparator"></slot>
            <span>
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd HH:mm:ss"
                v-model="formData[item.props2]"
                type="datetime"
                :picker-options="item.pickerOptionsEnd"
                style="width:auto"
                :placeholder="item.placeholder2">
              </el-date-picker>
            </span>
          </div>
        </el-form-item>
        <!--daterange 部分-->
        <el-form-item v-if="item.type === 'daterange'" :label="item.label">
          <div class="block" style="display:flex;">
            <span>
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="formData[item.prop1]"
                type="date"
                style="width:auto"
                :placeholder="item.placeholder1">
              </el-date-picker>
            </span>
            <slot name="rangeSeparator"></slot>
            <span>
              <el-date-picker
                clearable
                value-format="yyyy-MM-dd"
                v-model="formData[item.prop2]"
                type="date"
                style="width:auto"
                :placeholder="item.placeholder2">
              </el-date-picker>
            </span>
          </div>
        </el-form-item>
        <!--inputrange 部分-->
        <el-form-item v-if="item.type === 'inputrange'" :label="item.label" :style="item.style">
          <div class="block" style="display:flex;">
            <span>
              <el-input
                min="0"
                clearable
                v-model="formData[item.prop1]"
                type="number"
                style="width:auto"
                :placeholder="item.placeholder1">
              </el-input>
            </span>
            <slot name="rangeSeparator"></slot>
            <span>
              <el-input
                min="0"
                clearable
                v-model="formData[item.prop2]"
                type="number"
                style="width:auto"
                :placeholder="item.placeholder2">
              </el-input>
            </span>
          </div>
        </el-form-item>
        <!--zhh 新增end-->
        <el-form-item v-if="item.type === 'selectOrg'" :label="item.label">
          <el-select v-model="formData[item.prop]" :placeholder="$t('lang.pleaseselect')" style="width:auto" :disabled="item.disabled ? true : false">
            <el-option v-for="(selectItem, index) in item.options" :key="index" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-button size="mini" class="search-btn-more" v-show="formLabel.length > 3" @click="changeIsBrandFold"
      ><span>{{ isBrandFold ? '更多查询' : '收起查询' }}</span
      ><i :class="isBrandFold ? 'el-icon-arrow-down' : 'el-icon-arrow-up'"></i
      ></el-button>
      <!-- <el-button size="mini" v-if="showSearchList.length > 3" @click="changeIsBrandFold">收起</el-button> -->
    </el-row>
  </el-form>
</template>
<script>
export default {
  props: {
    formData: {
      type: Object,
      default() {
        return {}
      }
    },
    formLabel: {
      type: Array,
      default() {
        return {}
      }
    },
    formRule: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      isBrandFold: true
    }
  },
  computed: {
    // 查询条件列表（展开折叠)
    showSearchList: {
      get: function() {
        if (this.isBrandFold) {
          if (this.formLabel.length < 4) {
            return this.formLabel
          }
          const newArr = []
          for (var i = 0; i < 3; i++) {
            const item = this.formLabel[i]
            newArr.push(item)
          }
          return newArr
        }
        return this.formLabel
      },
      set: function(val) {
        this.showSearchList = val
      }
    }
  },
  methods: {
    changeIsBrandFold() {
      this.isBrandFold = !this.isBrandFold
    },
    resetForm() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.el-input {
  width: auto;
}
.search-btn-more {
  width: 120px;
  height: 40px;
  margin-left:20px;
  margin-bottom: 10px;
}
</style>

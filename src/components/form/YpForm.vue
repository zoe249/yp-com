<!--
 * @Author: your name
 * @Date: 2020-12-14 10:16:03
 * @LastEditTime: 2021-01-29 09:03:01
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \celesta-web-project\src\components\form\YpForm.vue
-->
<template>
  <el-form :model="formData" ref="formRef" label-width="120px" label-position="right" :rules="formRule">
    <div>
      <div v-for="(item, index) in formLabel" :key="index">
        <el-form-item v-if="item.type === 'input'" :label="item.label" :prop="item.prop">
          <el-input v-model.trim="formData[item.prop]" :placeholder="item.placeholder" clearable :disabled="item.disabled ? true : false" :maxlength="item.maxLength ? item.maxLength : '32'"></el-input>
        </el-form-item>
        <el-form-item v-if="item.type === 'pwd'" :label="item.label" :prop="item.prop">
          <el-input type="password" v-model.trim="formData[item.prop]" :placeholder="item.placeholder" clearable></el-input>
        </el-form-item>
        <el-form-item v-if="item.type === 'displayOrder'" :label="item.label" :prop="item.prop">
          <el-input v-model.number="formData[item.prop]" :placeholder="item.placeholder" clearable :disabled="item.disabled ? true : false"></el-input>
        </el-form-item>
        <el-form-item v-if="item.type === 'render'" :label="item.label">
          <span v-for="itemtwo in item.prop" :key="itemtwo.id">{{ formData[itemtwo.props] }}</span>
        </el-form-item>
        <el-form-item v-if="item.type === 'select'" :label="item.label" :prop="item.prop">
          <el-select filterable v-model="formData[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
            <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="item.type === 'switch'" :label="item.label" :prop="item.prop">
          <el-switch v-model="formData[item.prop]" :disabled="item.disabled ? true : false"></el-switch>
        </el-form-item>
        <el-form-item v-if="item.type === 'icon'" :label="item.label">
          <yp-icon :icon.sync="formData[item.prop]"></yp-icon>
        </el-form-item>
        <el-form-item v-if="item.type === 'tree'" :label="item.label">
          <el-tree
            :data="item.options"
            node-key="id"
            :check-strictly="item.checkStrictly"
            :default-checked-keys="item.checkedId"
            accordion
            show-checkbox
            default-expand-all
            ref="tree"
            :props="item.defaultProps"
          >
          </el-tree>
        </el-form-item>
      </div>
    </div>
  </el-form>
</template>
<script>
import YpIcon from '@/components/icon/YpIcon.vue'
export default {
  components: {
    YpIcon
  },
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
  methods: {
    resetForm() {
      this.$refs.formRef.resetFields()
    }
  }
}
</script>
<style lang="scss" scoped>
.form-content {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: 100%;
  // background: red;
}
.form-item {
  width: 100%;
}
.el-form-item {
  margin-right: 0px;
}
// .el-tree {
//   height: 400px;
//   overflow-y: auto;
//   width: 100%;
// }
</style>

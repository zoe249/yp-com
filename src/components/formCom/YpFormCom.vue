<!--
 * @Description: 功能描述
 * @Version: 1.5.1
 * @Author: Yuchuan
 * @Date: 2020-11-22 22:10:04YpFormCom
-->
<template>
  <div class="box">
    <el-form ref="form" :model="form" :label-width="formList.formWidth" :rules="formRule">
      <el-row :span="item.span" v-for="(item, index) in formInfo" :key="index">
        <!-- 下拉框 -->
        <el-col :span="item.span" v-if="item.type === 'list'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-select v-model="form[item.props]" placeholder="请选择">
              <el-option v-for="items in item.listInfo" :key="items.value" :value="items.value" :label="items.name"></el-option>
            </el-select>
          </el-form-item>
        </el-col>
        <!-- 单选按钮 -->
        <el-col :span="item.span" v-else-if="item.type === 'radio'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-radio-group v-model="form[item.props]">
              <el-radio :label="items.label" v-for="(items, indexs) in item.radioList" :key="indexs">{{ items.info }}</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <!-- 上传图片 -->
        <el-col :span="item.span" v-else-if="item.type === 'img'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <yp-single-upload :url.sync="form[item.props]" :utype="item.imgType"></yp-single-upload>
          </el-form-item>
        </el-col>
        <!-- 开关 -->
        <el-col :span="item.span" v-else-if="item.type === 'switch'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-switch v-model="form[item.props]"> </el-switch>
          </el-form-item>
        </el-col>
        <!-- 按钮 -->
        <el-col :span="item.span" v-else-if="item.type === 'button'">
          <el-form-item :label="item.label">
            <el-button :type="item.btntype" :size="item.btnsize" @click="handleButton">{{ item.btnlabel }}</el-button>
          </el-form-item>
        </el-col>
        <!-- 输入数字 -->
        <el-col :span="item.span" v-else-if="item.type === 'inputNum'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-input-number v-model.trim="form[item.props]" :precision="item.precision" controls-position="right" :step="item.step" :min="item.min"></el-input-number>
          </el-form-item>
        </el-col>
        <!-- 富文本编辑器 -->
        <el-col :span="item.span" v-else-if="item.type === 'quillEditor'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <yp-quill-editor :content.sync="form[item.props]"></yp-quill-editor>
          </el-form-item>
        </el-col>
        <!-- 输入限制输入框 -->
        <el-col :span="item.span" v-else-if="item.type === 'limitInput'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-input
              v-model.trim="form[item.props]"
              type="textarea"
              :placeholder="'请输入' + `${item.label}`"
              :maxlength="item.maxlength"
              show-word-limit
              :style="'width' + ':' + `${item.styleWidth}`"
            ></el-input>
          </el-form-item>
        </el-col>
        <!--时间  -->
        <el-col :span="item.span" v-else-if="item.type === 'timePicke'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-time-select
              v-model="form[item.props]"
              :picker-options="{
                start: item.start,
                step: item.step,
                end: item.end
              }"
              :placeholder="item.placeholder"
            >
            </el-time-select>
          </el-form-item>
        </el-col>
        <el-col :span="item.span" v-else-if="item.type === 'dataTimePick'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-date-picker v-model="form[item.props]" :type="item.datetime" :placeholder="item.placeholder" :value-format="item.valueFormat"> </el-date-picker>
          </el-form-item>
        </el-col>
        <!-- 复选框 -->
        <el-col :span="item.span" v-else-if="item.type === 'checkbox'">
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-checkbox :label="items.label" v-model="form[items.value]" v-for="(items, indexs) in item.checkboxList" :key="indexs"></el-checkbox>
          </el-form-item>
        </el-col>
        <!-- 万能的 -->
        <el-col :span="item.span" v-else>
          <el-form-item :label="item.label" :prop="item.props" :label-width="item.width">
            <el-input
              v-model.trim="form[item.props]"
              :type="item.text"
              :placeholder="'请输入' + `${item.label}`"
              :style="'width' + ':' + `${item.styleWidth}`"
              :clearable="item.clearable"
              :disabled="item.disabled"
              :suffix-icon="item.suffixIcon"
              :prefix-icon="item.prefixIcon"
            ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <div class="footer">
      <el-button @click="scanle" class="scanle">取 消</el-button>
      <el-button type="primary" @click="makeSure" class="makeSure">确 定</el-button>
    </div>
  </div>
</template>
<script>
import YpSingleUpload from '@/components/upload/YpSingleUpload.vue'
import YpQuillEditor from '@/components/editor/YpQuillEditor'
export default {
  components: {
    YpSingleUpload,
    YpQuillEditor
  },
  props: {
    formList: {
      type: Object
    },
    formInfo: {
      type: Array
    },
    formRule: {
      type: Object
    },
    formEdit: {
      type: Object
    }
  },
  data() {
    return {
      form: {},
      editForm: {}
    }
  },
  watch: {
    formEdit: function(val) {
      // console.log('left')
      this.editForm = val
      // console.log(this.editForm)
      if (this.formList.formType !== 'add') {
        this.dataInsert()
        // console.log(this.form)
        // console.log(this.editForm)
        // console.log('99999')
        for (const j in this.form) {
          // console.log(this.form[j])
          // console.log(j)
          // console.log('88888')
          for (const i in this.editForm) {
            if (j === i) {
              this.form[j] = this.editForm[i]
            }
          }
        }
        // console.log(this.form)
        // console.log('0000')
      }
    }
  },
  created() {
    // 初始加载时让输入到默认值
    if (this.formList.formType === 'add') {
      this.dataInsert()
    } else {
      this.editDataInsert()
    }
  },
  methods: {
    // 按钮事件
    handleButton() {
      this.$emit('allEvent', '')
    },
    // 赋值入数组将默认值赋值到数组中
    dataInsert(val) {
      this.formInfo.forEach(item => {
        this.$set(this.form, item.props, item.default)
      })
    },
    // 编辑返回赋值入数组将默认值赋值到数组中
    editDataInsert() {
      this.dataInsert()
      // console.log(this.form)
      // console.log(this.editForm)
      // console.log('99999')
      for (const j in this.form) {
        for (const i in this.editForm) {
          if (j === i) {
            this.form.j = this.editForm.i
          }
        }
      }
      // console.log(this.form)
      // console.log('0000')
    },
    // 确认按钮
    makeSure() {
      this.$refs.form.validate(valid => {
        if (!valid) return
        this.$emit('makeSureForm', this.form)
      })
    },
    // 取消按钮
    scanle() {
      // 重置
      this.formInfo.forEach(item => {
        this.$set(this.form, item.props, item.default)
      })
      this.$refs.form.clearValidate()
      this.$emit('scanle', this.form)
    }
  }
}
</script>
<style lang="scss" scoped>
.box {
  margin-top: 20px;
  padding: 20px;
  width: 100%;
  // border: 1px solid black;
}
.footer {
  margin-top: 40px;
}
.scanle {
  margin-left: 22%;
}
</style>

<!--
 * @Author: liupenghui
 * @Date: 2021-01-03 17:03:42
 * @LastEditTime: 2021-01-29 10:39:04
 * @LastEditors: Please set LastEditors
 * @Description: 平台
 * @FilePath: \celesta-web-project\src\views\platforms\platforms.vue
-->
<template>
  <div class="form-div" :style="{ height: height }">
    <!-- 下拉表单 begin -->
    <el-form :data="platformsForm" ref="formRef" label-width="120px" label-position="right" :rules="platformsFormRules">
      <div>
        <div v-for="(item, index) in platformsFormLabel" :key="index">
          <!-- 所属组织 begin -->
          <el-form-item v-if="item.type === 'organizationSelect'" :label="item.label" :prop="item.prop">
            <el-select v-model="platformsForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
              <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 所属组织 end -->

          <!-- 所属渠道 begin -->
          <el-form-item v-if="item.type === 'channelSelect'" :label="item.label" :prop="item.prop">
            <el-select @change="channelBtn" v-model="platformsForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
              <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 所属渠道 end -->

          <!-- 所属终端 begin -->
          <el-form-item v-if="item.type === 'teminalSelect'" :label="item.label" :prop="item.prop">
            <el-select @focus="foucsChange" v-model="platformsForm[item.prop]" :placeholder="$t('lang.pleaseselect')" :disabled="item.disabled ? true : false" :multiple="item.multiple">
              <el-option v-for="selectItem in item.options" :key="selectItem.value" :label="selectItem.label" :value="selectItem.value"></el-option>
            </el-select>
          </el-form-item>
          <!-- 所属终端 end -->
        </div>
      </div>
    </el-form>
    <div class="btn-div">
      <el-button type="primary" class="btn-copy" @click="preservation">保存</el-button>
    </div>
    <!-- 下拉表单 end -->
  </div>
</template>

<script>
export default {
  components: {},
  computed: {
    // 主表单（下拉所绑定的数据内容）
    platformsFormLabel() {
      return [
        {
          label: this.$t('lang.organization') + '：',
          type: 'organizationSelect',
          prop: 'organizationCode',
          options: this.getOrganizationTypesList
        },
        {
          label: this.$t('lang.channelplat') + '：',
          type: 'channelSelect',
          prop: 'channelsCode',
          options: this.getChannelsList
        },
        {
          label: this.$t('lang.terminalplat') + '：',
          type: 'teminalSelect',
          prop: 'terminalsCode',
          options: this.getTerminalList
        }
      ]
    }
  },
  data() {
    return {
      // 用来进行获取渠道的 id
      channelId: '',
      // 用来接受 id
      crrentId: 0,

      // 用来接受组织类型的数据
      getOrganizationTypesListArr: [],
      getOrganizationTypesList: [],

      // 接受渠道数据
      getChannelsListArr: [],
      getChannelsList: [],

      // 接受终端数据
      getTerminalListArr: [],
      getTerminalList: [],

      // 用来进行控制主表单的数据
      platformsForm: {
        organizationCode: '',
        channelsCode: '',
        terminalsCode: ''
      },
      // 校验规则
      platformsFormRules: {
        organizationId: [{ required: true, message: '请选择所属组织', trigger: 'blur' }]
      }
    }
  },
  created() {
    // 从后端获取平台信息
    this.getPlatformsList()
    // 获取组织类型
    this.getOrganizationTypeLit()
    // 获取渠道数据
    this.getTrueChannelsList()
    // 获取终端数据
    this.getTerminalsList()
    window.addEventListener('resize', this.getHeight)
    this.getHeight()
  },
  methods: {
    getHeight() {
      this.height = window.innerHeight - 160 + 'px'
      console.log(this.height)
    },
    // 从后端获取平台信息
    getPlatformsList() {
      this.$api.getPlatformsApi.getPlatformsList().then(res => {
        this.platformsForm = res
        console.log('平台信息', this.platformsForm)
        this.crrentId = res.id
      })
    },
    // 这个为渠道下拉框的绑定事件
    channelBtn() {
      this.channelsCode = this.platformsForm.channelsCode
      this.getTerminalList = []
      this.getTerminalsList()
      this.platformsForm.terminalsCode = ''
    },
    // 获取为开启状态的组织（组织管理里面的数据）
    getOrganizationTypeLit() {
      this.$api.getOrganizationManagementApi.getOrganizationManagementsListStatus().then(res => {
        this.getOrganizationTypesListArr = this.getTreeData(res)
      })
    },
    getTreeData(data) {
      // 循环遍历json数据
      for (var i = 0; i < data.length; i++) {
        if (data[i].organizations === null || data[i].organizations.length === 0) {
          data[i].organizations = undefined
        } else {
          // children若不为空数组，则继续 递归调用 本方法
          this.getTreeData(data[i].organizations)
        }
        this.getOrganizationTypesList.push({ value: data[i].code, label: data[i].name })
      }
      return data
    },

    // 获取渠道数据内容
    getTrueChannelsList() {
      this.$api.getChannelApi.getDataChannelsList().then(res => {
        this.getChannelsListArr = res
        this.getChannelsListArr.map(item => {
          this.getChannelsList.push({ value: item.code, label: item.name })
        })
      })
    },

    // foucs 事件
    foucsChange() {
      this.getTerminalList = []
      this.channelCode = this.platformsForm.channelsCode
      this.getTerminalsList()
      if (this.getTerminalListArr.length === 0) {
        this.platformsForm.terminalsCode = ''
      }
    },

    // 获取终端数据内容
    getTerminalsList() {
      // update by qiaokun  2021-05-17 根据渠道code 查询 终端数据 start
      this.$api.getTerminalApi.getTerminalListinPlatByCode(this.platformsForm.channelsCode).then(res => {
        console.log(res)
        this.getTerminalListArr = res
        this.getTerminalListArr.map(item => {
          this.getTerminalList.push({ value: item.code, label: item.name })
        })
      })
      // update by qiaokun  2021-05-17 根据渠道code 查询 终端数据 end
    },
    // 当选中之后点击保存所触发的事件
    async preservation() {
      const confirmResult = await this.$confirm('此操作将改变平台信息, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        return this.$message.info('您取消了保存')
      } else {
        this.$api.putPlatformsApi.putPermissionList(this.platformsForm, this.crrentId).then(res => {
          if (res.code === '200000') {
            this.$notify({
              title: this.$t('lang.tip'),
              message: this.$t('lang.optSuccess'),
              type: 'success'
            })
          }
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import '~@/assets/scss/common/platforms.scss';
</style>

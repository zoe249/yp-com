<!--
 * @FileDescription: 字体图标库
 * @Author: qiaokun
 * @Date: 2020-12-11
 * @LastEditors: 无
 * @LastEditTime: 无
 -->
<template>
  <div>
    <i :class="icon" id="icon-fonts"></i>
    <el-button type="primary" @click="showSelectIcon" size="mini">选择图标</el-button>
    <el-dialog v-dialogDrag title="选择图标" :visible.sync="dialogVisible" width="30%" append-to-body>
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '选择图标' }}
        </div>
      </template>
      <el-main class="select-wrapper">
        <div class="select-icons-wrapper">
          <div class="icon-wrapper" v-for="(item, index) in iconsList" :key="item.id">
            <div class="icon-content" :class="{ activeIcon: index === selectIconIndex }" @click="selectIconValue(item)">
              <div class="icon-name">
                <i :class="item.icon" id="icon-font"></i>
              </div>
              <div>
                <span>{{ item.name }}</span>
              </div>
              <div class="icon-wrapper-text">
                <span class="icon-text">{{ item.icontext }}</span>
              </div>
            </div>
          </div>
        </div>
      </el-main>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmSelectIcon">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import icons from './icon'
export default {
  props: {
    icon: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      selectIconIndex: '',
      selectIcon: ''
    }
  },
  created() {
    // 获取自定义图标库数据
    this.iconsList = icons.icons.data
  },
  methods: {
    showSelectIcon() {
      this.dialogVisible = true
    },
    // 选择图标值
    selectIconValue(item) {
      const i = this.iconsList.findIndex(x => x.id === item.id)
      this.selectIconIndex = i
      this.selectIcon = item
    },
    confirmSelectIcon() {
      this.$emit('update:icon', this.selectIcon.icon)
      this.dialogVisible = false
    }
  }
}
</script>
<style lang="scss" scoped>
// 对话框样式
// /deep/.el-dialog {
//   border-radius: 10px !important;
//   overflow: hidden;
//   // background: #3f78f6;
// }
// /deep/.el-dialog__header {
//   padding: 5px 5px 5px;
//   height: 36px;
//   background: #3f78f6;
//   .el-dialog__title {
//     line-height: 36px;
//     color: #fff;
//     font-size: 16px;
//     margin-left: 20px;
//   }
//   .el-dialog__headerbtn {
//     top: 15px;
//     right: 20px;
//     color: #fff !important;
//   }
//   .el-icon-close {
//     color: #fff;
//   }
// }
.select-wrapper {
  box-sizing: border-box;
  width: 100%;
  height: 300px;
}
.select-icons-wrapper {
  box-sizing: content-box;
  display: flex;
  flex-wrap: wrap;
}
.icon-wrapper {
  width: 20%;
  height: 130px;
  background: #fff;
}
.icon-content {
  height: 100%;
  width: 100%;
  margin: 1px;
  background: #efefef;
  display: flex;
  flex-direction: column;
  align-items: center;
  .iconfont {
    font-size: 40px !important;
  }
}
.icon-content:hover {
  background: #6699ff;
  cursor: pointer;
}
.icon-name {
  flex: 1;
  padding-top: 30px;
}
.icon-wrapper-text {
  margin-bottom: 10px;
  width: 100%;
  overflow: hidden;
  text-align: center;
}
.icon-text {
  width: 100%;
  overflow: hidden;
  font-size: 4px;
}
.activeIcon {
  background-color: #fff;
}
#icon-fonts {
  margin-right: 20px;
}
</style>

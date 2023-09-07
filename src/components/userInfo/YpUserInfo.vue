<template>
  <div class="userinfo-wraper">
    <!-- <div class="user-title">
      个人信息
    </div> -->
    <div class="avatr-wrapper" :style="{ background: this.$store.state.header.themeColor }"><img :src="currentUser.avatar" alt="" /></div>
    <div class="info-warpper">
      <div class="title">
        个人信息
      </div>
      <div>
        <el-form :label-position="'right'" label-width="80px">
          <el-form-item label="账号:"
            ><span>{{ currentUser.code }}</span></el-form-item
          >
          <el-form-item label="真实姓名:"
            ><span>{{ currentUser.realName }}</span></el-form-item
          >
          <el-form-item label="性别:"
            ><span v-show="!currentUser.gender">未知</span>
            <span v-show="currentUser.gender === '0'">未知</span>
            <span v-show="currentUser.gender === '1'">男</span>
            <span v-show="currentUser.gender === '2'">女</span>
          </el-form-item>
          <el-form-item label="联系电话:"
            ><span>{{ currentUser.phone }}</span></el-form-item
          >
          <el-form-item label="所属组织:"
            ><span v-show="currentUser.organizationName">{{ currentUser.organizationName }}</span>
            <span v-show="!currentUser.organizationName">未知</span>
          </el-form-item>
          <el-form-item label="状态:">
            <el-tag type="success" v-show="currentUser.status">有效</el-tag>
            <el-tag type="danger" v-show="!currentUser.status">无效</el-tag>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <div class="btn-wrapper">
      <div class="close-btn">
        <i class="el-icon-circle-close" @click="closeDrawer"></i>
      </div>
    </div>
    <!-- <div class="user-avatar">
    </div>
    <div class="common-li">姓名：{{ currentUser.realName }}</div>
    <el-button @click="closeDrawer">关闭</el-button> -->
  </div>
</template>

<script>
export default {
  props: {
    currentUser: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  data() {
    return {
      close: false
    }
  },
  methods: {
    closeDrawer() {
      this.$emit('closeDrawer', this.close)
    }
  }
}
</script>

<style lang="scss" scoped>
.userinfo-wraper {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  // background: red;
}

.avatr-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 250px;
}
.info-warpper {
  display: flex;
  flex-direction: column;
  align-items: center;
  // justify-content: center;
  width: 500px;
  height: 500px;
  background: #fff;
  border-radius: 140px;
  margin-top: -30px;
}
.el-form-item {
  padding: 0;
  margin: 0;
}
.el-form-item_label {
  padding: 0 !important;
  line-height: 0;
}
.title {
  height: 100px;
  width: 100%;
  line-height: 100px;
  text-align: center;
  font-size: 20px;
  font-weight: bold;
}
span {
  color: #606266;
}
.btn-wrapper {
  position: relative;
  flex: 1;
  width: 100%;
  color: #fff;
  margin-bottom: 0px;
}
.close-btn {
  position: absolute;
  bottom: 0;
  height: 48px;
  width: 100%;
  background: #ff6336;
  line-height: 48px;
  text-align: center;
  color: #fff;
  cursor: pointer;
  font-size: 24px;
}
.user-avatar {
  width: 100%;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
img {
  width: 120px;
  height: 120px;
  border-radius: 50%;
}
</style>

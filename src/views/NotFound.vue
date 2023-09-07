<template>
  <div class="container">
    <img src="http://qiaokun.yuepong.com/notfound.png" alt="您访问的压面不存在" class="not-found-img" />
    <el-button @click="backHome">返回首页</el-button>
  </div>
</template>
<script>
export default {
  methods: {
    backHome() {
      this.$router.push('/home')
    }
  }
}
</script>
<style lang="scss" scoped>
.container {
  width: 100%;
  height: 80%;
  text-align: center;
}
.not-found-img {
  width: 600;
  height: 500px;
}
.el-button {
  background-color: #3f78f6;
  color: #fff;
  border-color: #3f78f6;
}
</style>

<template>
  <div>
    <div class="upload-img-container">
      <div :style="uploadWrapper" v-show="isShowImg">
        <img :src="url" alt="" :style="utypeInfo.imgUpload" mode="widthFix" id="imgId" />
      </div>
      <div v-show="isShowImg" class="img-btns"><span class="priview-btn" @click="priviewImg(url)">预览</span> <span class="delete-btn" @click="deleteImg">删除</span></div>
    </div>
    <el-upload
      :action="domain"
      :data="QiniuData"
      :on-remove="handleRemove"
      :on-success="uploadSuccess"
      :before-remove="beforeRemove"
      :before-upload="beforeAvatarUpload"
      :limit="10"
      multiple
      :on-exceed="handleExceed"
      :file-list="fileList"
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
      <div slot="tip" class="el-upload__tip" v-if="utypeInfo.message">{{ utypeInfo.message }}</div>
    </el-upload>
    <el-dialog v-dialogDrag title="图片预览" append-to-body :visible.sync="preViewDialogVisible" width="50%">
      <template slot="title">
        <div class="dialog-title" :style="{ background: this.$store.state.header.themeColor, paddingLeft: '20px' }">
          {{ '图片预览' }}
        </div>
      </template>
      <div class="previewImgwrapper">
        <img class="previewImg" :src="previewImgPath" alt="" />
      </div>
    </el-dialog>
  </div>
</template>
<script>
// import { mapState } from 'vuex'
import imgInfo from './YpSingleUpload.js'
export default {
  props: {
    utype: {
      type: String,
      default: 'common'
    },
    url: {
      type: String
    }
  },
  data() {
    return {
      domain: this.$domain,
      test: '600px',
      isShowImg: true,
      preViewDialogVisible: false,
      fileList: [],
      previewImgPath: '',
      uploadWrapper: {
        width: '80px',
        height: '80px'
      },
      imgUpload: {
        width: '100%',
        height: '100%'
        // borderRadius: '100%'
      },
      // 判断上传前是否检验成功
      isLt500kb: true,
      // 根据js判断的信息
      utypeInfo: '',
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
        data: {}
      },
      qiniuaddr: '' // 七牛云的图片外链地址 七牛云空间的外链地址
    }
  },
  created() {
    // console.log(this.utype)
    // 根据传值来筛选内容
    imgInfo.imgInfo.forEach(item => {
      if (item.utype === this.utype) {
        this.utypeInfo = item
      }
      // console.log(this.utypeInfo)
    })
    this.uploadWrapper.width = this.utypeInfo.widthUse ? this.utypeInfo.widthUse : this.uploadWrapper.width
    this.uploadWrapper.height = this.utypeInfo.heightUse ? this.utypeInfo.heightUse : this.uploadWrapper.height
    // console.log(this.uploadWrapper)
    this.getQiniuToken()
    // 为编辑时回显数据做判断
    if (this.url === '' || this.url === null) {
      this.isShowImg = false
    }
  },
  // computed: {
  //   ...mapState(['domain'])
  // },
  methods: {
    getQiniuToken() {
      this.$api.getQiniuToken.getQiniuToken().then(res => {
        this.qiniuaddr = res.cdnDomainName
        this.QiniuData.token = res.qiniuToken
      })
    },
    priviewImg(previewImgPath) {
      this.preViewDialogVisible = true
      this.previewImgPath = previewImgPath
    },
    async deleteImg() {
      const confirmResult = await this.$confirm('此操作将永久删除, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).catch(err => err)
      if (confirmResult !== 'confirm') {
        this.$message.info('用户取消了删除')
      } else {
        this.handleRemove()
        this.$message.success('删除成功')
      }
    },
    handleRemove(file, fileList) {
      // console.log(this.fileList)
      // console.log(file)
      this.fileList = []
      this.$emit('update:url', '')
    },
    handleExceed(files, fileList) {
      this.$message.warning('当前限制选择 1 张图片，如需更换，请删除上一张图片在重新选择！')
    },
    beforeAvatarUpload(file) {
      // 图片上传之前的方法
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      // 根据图片的大小来进行比对
      var fileSize = file.size / 1000
      if (fileSize < this.utypeInfo.imgSize) {
        this.isLt500kb = true
      } else {
        this.$message.error('上传图标大小不能超过' + this.utypeInfo.imgSize + 'kb')
        this.isLt500kb = false
      }
      // console.log(this.isLt500kb)
      if (!isPNG && !isJPEG && !isJPG) {
        this.$message.error('上传头像图片只能是 jpg、png、jpeg 格式!')
        return false
      }
      this.QiniuData.data = file
      this.QiniuData.key = `${file.uid}`
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      if (this.isLt500kb) {
        // console.log(file, fileList)
        // console.log(this.fileList)
        const uploadUrl = `${this.qiniuaddr}/${response.key}`
        const image = new Image()
        image.src = uploadUrl
        const that = this
        // 根据上传图片的大小进行比对
        image.onload = function() {
          if (image.width <= that.utypeInfo.width && image.height <= that.utypeInfo.height) {
            that.$message.success('上传成功！')
            that.$emit('update:url', uploadUrl)
          } else {
            that.$message.error('上传图片大小不超过' + that.utypeInfo.width + '像素' + '*' + that.utypeInfo.height + '像素' + '请重新上传')
            that.handleRemove()
          }
        }
      }
    },
    // 删除图片
    beforeRemove(file, fileList) {
      this.handleRemove()
      return this.$confirm(`确定移除 ${file.name}？`)
    }
  },
  watch: {
    url: {
      handler() {
        if (this.url !== '') {
          this.isShowImg = true
        } else {
          this.isShowImg = false
          this.handleRemove()
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="scss" scoped>
// 图片上传区域样式
::v-deep .el-upload-list--picture .el-upload-list__item {
  display: none !important;
}
.upload-img-container {
  // display: flex !important;
  width: 100%;
}
.uploadWrapper {
  display: flex;
  flex-direction: column;
  // width: 150px;
  // height: 180px;
  margin-right: 20px;
  margin-bottom: 20px;
  border-radius: 10px;
  background: #eee;
  overflow: hidden;
}
// 图片上传组件
.img-upload {
  width: 100%;
  height: 150px;

  // border-radius: 10px;
}
.ddd {
  width: 100%;
  height: 500px;
}
// 图片按钮
.img-btns {
  height: 20px;
  width: 100%;
  display: flex;
  // justify-content: space-between;
  align-items: center;
  span {
    margin-left: 10px;
    line-height: 30px;
    // margin-right: 10px;
    cursor: pointer;
  }
  .priview-btn {
    color: #3f78f6;
  }
  .delete-btn {
    color: red;
  }
}
.previewImgwrapper {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .previewImg {
    width: 80%;
    height: 80%;
  }
}
.el-upload__tip {
  color: #3f78f6;
}
</style>

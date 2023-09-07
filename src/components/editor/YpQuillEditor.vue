<template>
  <div>
    <!-- 图片上传组件辅助-->
    <el-upload class="avatar-uploader" :action="domain" name="file" :data="QiniuData" multiple :show-file-list="false" :on-success="uploadSuccess" :before-upload="beforeUpload"> </el-upload>
    <!--富文本编辑器组件-->
    <el-row v-loading="quillUpdateImg">
      <quill-editor v-model="detailContent" ref="myQuillEditor" :options="editorOption" @change="quillChange"> </quill-editor>
    </el-row>
  </div>
</template>
<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 工具栏配置
const toolbarOptions = [
  ['bold', 'italic', 'underline', 'strike'], // toggled buttons
  ['blockquote', 'code-block'],

  [{ header: 1 }, { header: 2 }], // custom button values
  [{ list: 'ordered' }, { list: 'bullet' }],
  [{ script: 'sub' }, { script: 'super' }], // superscript/subscript
  [{ indent: '-1' }, { indent: '+1' }], // outdent/indent
  [{ direction: 'rtl' }], // text direction

  [{ size: ['small', false, 'large', 'huge'] }], // custom dropdown
  [{ header: [1, 2, 3, 4, 5, 6, false] }],

  [{ color: [] }, { background: [] }], // dropdown with defaults from theme
  [{ font: [] }],
  [{ align: [] }],
  ['link', 'image', 'video'],
  ['clean'] // remove formatting button
]
export default {
  props: {
    content: {
      type: String
    }
  },
  data() {
    return {
      domain: this.$domain,
      quillUpdateImg: false, // 根据图片上传状态来确定是否显示loading动画，刚开始是false,不显示
      detailContent: '', // 富文本内容
      QiniuData: {
        key: '', // 图片名字处理
        token: '', // 七牛云token
        data: {}
      },
      // 富文本编辑器配置
      editorOption: {
        placeholder: '',
        theme: 'snow', // or 'bubble'
        modules: {
          toolbar: {
            container: toolbarOptions, // 工具栏
            handlers: {
              image: function(value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              },
              video: function(value) {
                if (value) {
                  document.querySelector('.avatar-uploader input').click()
                } else {
                  this.quill.format('image', false)
                }
              }
            }
          }
        }
      }
    }
  },
  created() {
    if (this.content) {
      this.detailContent = this.content
    }
    this.getQiniuToken()
  },
  mounted() {
    console.log(this.$refs.myQuillEditor)
    this.$refs.myQuillEditor.quill.enable(false)
    setTimeout(() => {
      this.$refs.myQuillEditor.quill.enable(true)
    }, 2000)
  },
  methods: {
    quillChange() {
      this.$emit('update:content', this.detailContent)
    },
    getQiniuToken() {
      this.$api.getQiniuToken.getQiniuToken().then(res => {
        // console.log(res)
        this.qiniuaddr = res.cdnDomainName
        this.QiniuData.token = res.qiniuToken
      })
    },
    beforeUpload(file) {
      // 显示loading动画
      this.quillUpdateImg = true
      // 图片上传之前的方法
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isMP4 = file.type === 'video/mp4'
      const isLt500kb = file.size / 1024 / 1024 < 3
      if (!isPNG && !isJPEG && !isJPG && !isMP4) {
        this.$message.error('上传内容只能是 jpg、png、jpeg 或mp4格式!')
        this.quillUpdateImg = false
        return false
      }
      if (!isLt500kb) {
        this.$message.error('上传内容大小不能超过3m!')
        this.quillUpdateImg = false
        return false
      }
      this.QiniuData.data = file
      this.QiniuData.key = `${file.uid}`
      console.log(file)
    },
    // 上传成功
    uploadSuccess(response, file, fileList) {
      console.log(response)
      const uploadUrl = `${this.qiniuaddr}/${response.key}`
      this.$message.success('上传成功！')
      var quill = this.$refs.myQuillEditor.quill
      var length = quill.getSelection().index
      var fileType = '(.jpg|.png|.jpeg)$'
      var res = new RegExp(fileType)
      if (res.test(response.key)) {
        quill.insertEmbed(length, 'image', uploadUrl)
        this.$emit('update:content', this.detailContent)
      } else {
        quill.insertEmbed(length, 'image', uploadUrl)
        this.$emit('update:content', this.detailContent)
      }
      quill.setSelection(length + 1)
      // loading动画消失
      this.quillUpdateImg = false
    }
  },
  watch: {
    content: {
      handler() {
        if (this.content !== this.detailContent) {
          this.detailContent = this.content
        }
      }
    }
  }
}
</script>
<style lang="less" scoped></style>

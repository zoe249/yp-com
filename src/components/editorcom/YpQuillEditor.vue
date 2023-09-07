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
// import { mapState } from 'vuex'
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
                console.log('当前的value++++++++++++++', value)
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
                  this.quill.format('video', false)
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
  computed: {
    // ...mapState(['domain'])
  },
  mounted() {
    //  自定义粘贴图片功能
    const quill = this.$refs.myQuillEditor.quill
    if (!this.disableFlag) {
      toolbarOptions[0] = ['image']
    }
    this.$forceUpdate()
    quill.root.addEventListener(
      'paste',
      evt => {
        console.log('走了')
        if (evt.clipboardData && evt.clipboardData.files && evt.clipboardData.files.length) {
          console.log('走了1')
          evt.preventDefault()
          console.log('走了2')
          ;[].forEach.call(evt.clipboardData.files, file => {
            if (!file.type.match(/^image\/(gif|jpe?g|a?png|bmp)/i)) {
              return
            }

            this.beforeUploads(file)

            // this.uploadSuccess(file)
            //   this.beforeUpload(file, res => {
            //     console.log('走了4')
            //     // 获取光标内容
            //     var range = quill.getSelection()
            //     if (range) {
            //       this.uploadSuccess(res, file, null)
            //       //  将光标移动到图片后面
            //       this.$refs.myQuillEditor.quill.setSelection(range.index + 1)
            //     }
            //   })
          })
        }
      },
      false
    )
  },
  methods: {
    // 上传
    upLoadImg() {
      // const that = this
      this.qa.myserver.postProductApi.imgPost({
        responseType: 'binary',
        data: this.QiniuData,
        file: this.QiniuData,
        type: 'post',
        success: function(res) {

        }
      })
    },
    quillChange() {
      console.log('当前的', this.detailContent)
      this.$emit('update:content', this.detailContent)
    },
    getQiniuToken() {
      const that = this
      this.qa.myserver.getQiniuToken.getQiniuToken({
        success: function(res) {
          that.qiniuaddr = res.data.cdnDomainName
          that.QiniuData.token = res.data.qiniuToken
        }
      })
    },
    beforeUpload(file) {
      // 显示loading动画
      this.quillUpdateImg = true
      console.log('--------------------', file.type)
      // 图片上传之前的方法
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isMP4 = file.type === 'video/mp4'
      const isLt500kb = file.size / 1024 / 1024 < 3
      console.log('当前的大小', isLt500kb)
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
      console.log('当前的大小', isLt500kb)
      console.log(file)
    },
    beforeUploads(file) {
      const that = this
      // 显示loading动画
      this.quillUpdateImg = true
      console.log('--------------------', file.type)
      // 图片上传之前的方法
      const isPNG = file.type === 'image/png'
      const isJPEG = file.type === 'image/jpeg'
      const isJPG = file.type === 'image/jpg'
      const isMP4 = file.type === 'video/mp4'
      const isLt500kb = file.size / 1024 / 1024 < 3
      console.log('当前的大小', isLt500kb)
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
      console.log(' console.log(file)', file)
      this.QiniuData.data = file

      this.QiniuData.key = `${file.lastModified}`
      console.log('当前的大小', isLt500kb)
      console.log('当前的大小', this.QiniuData)
      console.log(file)
      const FormDatas = new FormData()
      FormDatas.append('file', file)
      FormDatas.append('key', `${file.lastModified}`)
      FormDatas.append('token', this.QiniuData.token)
      FormDatas.append('data', file)
      this.qa.myserver.postProductApi.imgPost({
        responseType: 'binary',
        data: FormDatas,
        file: FormDatas,
        type: 'post',
        success: function(res) {
          that.uploadSuccess(res.data)
        }
      })
    },

    // 上传成功
    uploadSuccess(response, file, fileList) {
      console.log('当前的respone', response)
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

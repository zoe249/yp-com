<template>
  <el-upload
    ref="elUploadRef"
    class="upload-demo"
    :headers="headers"
    :drag="drag"
    :action="uploadFileUrl"
    :limit="1"
    :disabled="disabled"
    :show-file-list="false"
    :on-success="success"
    :on-error="error"
  >
    <slot></slot>
    <template #tip v-if="showTip">
      <div class="el-upload__tip">
        请上传
        <template v-if="fileType">
          格式为 <b style="color: #cb0000">{{ fileType.join('/') }}</b>
        </template>
        的文件
      </div>
    </template>
  </el-upload>
</template>

<script>
import { Message } from 'element-ui'
export default {
  props: {
    uploadFileUrl: {
      type: String,
      required: true
    },
    drag: {
      type: Boolean,
      default: false
    },
    showTip: {
      type: Boolean,
      default: false
    },
    fileType: {
      type: Array,
      default: () => []
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      headers: {
        ContentType: 'multipart/form-data',
        Authorization: 'bearer ' + window.sessionStorage.getItem('token')
      }
    }
  },
  methods: {
    success(res, file) {
      if (res.code === '200000') {
        this.$emit('success', res.data, file)
      }
    },
    error(err, file) {
      const temp = JSON.parse(err.message)
      if (temp.code !== '210500') return Message.error(temp.detail)
      const fd = new FormData() // FormData 对象
      fd.append('file', file.raw) // 文件对象
      this.$api.postGiftCardSellApi.downloadErrorFile(fd).then(res => {
        const blob = new Blob([res], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }) // 构造一个blob对象来处理数据，并设置文件类型
        const href = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.style.display = 'none'
        a.href = href // 指定下载链接
        a.download = '异常文件反写'
        a.click()
        URL.revokeObjectURL(a.href)
        Message.error('上传失败')
      })
    },
    /**
     * 清空已上传的文件列表
     */
    clearFiles() {
      this.$refs.elUploadRef.clearFiles()
    }
  }
}
</script>

<style lang="scss" scoped></style>

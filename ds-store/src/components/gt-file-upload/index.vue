<template>
  <div class="gt-file-upload">
    <div class="file-container">
      <span class="file" :key="file.id" v-for="file in fileList">{{file.name}}</span>
    </div>
    <gt-button size="default" type="choose" txt="选择文件" @click.native="upload()" v-if="selfBusinessFlag"/>
    <input :id="id" type="file" class="file-input" :accept="accept" :multiple="multiple" @change="inputChange" style="display: none"/>
    <slot></slot>
  </div>
</template>

<script>
import * as api from '@/service/goods'
export default {
  name: 'gt-file-upload',
  props: {
    // 输入框ID
    id: {
      type: String,
      default: 'file-upload'
    },
    // 最大可以同时上传的文件数量
    max: {
      type: Number,
      default: 1
    },
    // 允许上传的文件格式
    accept: {
      type: String,
      default: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel'
    },
    // 是否允许一次上传多个文件
    multiple: {
      type: Boolean,
      default: false
    },
    // 允许上传的文件大小 单位： MB
    size: {
      type: Number,
      default: 10
    },
    // 已上传的文件
    fileList: {
      default: []
    }
  },
  data(){
    return{
      selfBusinessFlag:null,
    }
  },
  created(){
      this.getSelfBusiness()
  },
  methods: {
     async getSelfBusiness(){
      const { data } = await  api.getSelfBusiness()
      if (data.code === 0) {
        console.log(data.data);
        this.selfBusinessFlag = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    // 检查上传文件变化
    inputChange(e) {
      const uploadFiles = Array.from(e.target.files)
      if (this.multiple && uploadFiles.length > this.max) {
        this.$message.error(`最多允许同时上传${this.max}个文件`)
      } else {
        let flag = false
        uploadFiles.forEach(file => {
          if (this.beforeCheck(file)){
            flag = true
          }
        })
        if (flag) {
          return
        }
        const result = Promise.all(uploadFiles.map(file => this.ajaxup(file)))
      }
    },
    upload() {
      const ele = document.getElementById(this.id)
      if (ele) {
        ele.click()
      }
    },
    // 检查单个文件
    beforeCheck(file) {
      // 检查文件大小
      let isLtSize = file.size / 1024 / 1024 <= this.size
      if (!isLtSize) {
        this.$message.warning(`单个文件大小不允许超过${this.size}M`)
        return true
      }
      // 检查文件格式
      const fileName = file.name
      const suffixIndex=fileName.lastIndexOf('.')
      const suffix=fileName.substring(suffixIndex+1).toUpperCase()
      if (suffix!='CVS'&&suffix!='XLSX'&&suffix!='XLS') {
        this.$message.warning('文件类型必须是.xlsx,.xls中的一种')
        return true
      }
      return false
    },
    // 调用请求ajax
    ajaxup(file){
      // 清空input，防止两次不能传相同的文件
      let ele = document.getElementById(this.id)
      ele.value = ''
      this.$emit('finishUpload', [file])
      // return new Promise(async (resolve, reject) => {
      //   this.$message.warning('上传文件中...')
      //   let form = new FormData()
      //   form.append('file', file)
      // }).catch(error => {
      //   this.$message.error('上传出现错误!')
      //   reject(error)
      // })
    },
  }
}
</script>
<style lang="scss" scoped>
$height: 33px;
.gt-file-upload{
  .file-container{
    float: left;
    margin-right: 10px;
    margin-top: 2px;
    padding: 0 10px;
    height: $height;
    line-height: $height;
    width: 200px;
    border: 1px solid #dcdfe6;
    border-radius: 4px;
  }
}
</style>

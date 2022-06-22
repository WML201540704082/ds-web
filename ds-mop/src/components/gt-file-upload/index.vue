<template>
  <div class="gt-file-upload">
    <div class="control-container">
      <span class="upload-control"  @click="upload">上传附件</span>
      <span class="upload-tip" v-show="fileList && fileList.length > 0">{{percent}}%，已上传{{humanFileSize(uploadSize)}}，总文件大小{{humanFileSize(totalSize)}}</span>
    </div>

    <div class="file-container">
      <div class="file" :key="file.name" v-for="(file, index) in fileList">
        <img class="icon" :src="`static/img/file/${file.type || 'default'}.png`" alt="文件类型"/>
        <div class="info">
          <div class="name">{{file.name}}</div>
          <div class="tip">{{humanFileSize(file.size)}} <span class="status" :class="{'green': file.status === 'FINISH'}" v-if="file.status">{{filterStatus(file.status, statusType)}}</span></div>
        </div>
        <img class="delete" src="static/img/desk/close.png" alt="删除" @click="() => deleteFile(index)"/>
      </div>
    </div>
    <input :id="id" type="file" class="file-input" :multiple="multiple" @change="inputChange" style="display: none"/>
  </div>
</template>

<script>
import { getFileType, humanFileSize, filterStatus } from '@/utils'

import _ from 'lodash'
export default {
  name: 'gt-file-upload',
  data() {
    return {
      statusType: [{
        value: 'FINISH',
        label: '上传完成'
      }, {
        value: 'PROCESSING',
        label: '上传中...'
      }],
      // percent: 0,
      totalSize: 0,
      uploadSize: 0,
      filterStatus,
      humanFileSize
    }
  },
  computed: {
    percent: function() {
      return ((this.uploadSize / this.totalSize) * 100).toFixed(2)
    }
  },
  props: {
    // 输入框ID
    id: {
      type: String,
      default: 'file-upload'
    },
    // 最大可以同时上传的文件数量
    max: {
      type: Number,
      default: 5
    },
    type: {
      type: String,
      default: ''
    },
    // 是否允许一次上传多个文件
    multiple: {
      type: Boolean,
      default: true
    },
    // 允许上传的文件大小 单位： MB
    size: {
      type: Number,
      default: 50
    },
    // 已上传的文件
    fileList: {
      default: []
    }
  },
  methods: {
    // 检查上传文件变化
    inputChange(e) {
      const uploadFiles = Array.from(e.target.files)
      if (this.multiple && uploadFiles.length > this.max) {
        this.$message.error(`最多允许同时上传${this.max}个文件`)
      } else {
        uploadFiles.forEach(file => {
          this.totalSize += file.size,
          this.beforeCheck(file)
        })
        // 显示上传的文件
        let fileList = uploadFiles.map(item => {
          return {
            name: item.name,
            type: getFileType(item.name),
            url: '',
            size: item.size,
            status: 'PROCESSING'
          }
        })
        this.$emit('refreshList', fileList)
        const result = Promise.all(uploadFiles.map(file => this.ajaxup(file)))
      }
    },
    upload() {
      const ele = document.getElementById(this.id)
      if (ele) {
        ele.click()
      }
    },
    deleteFile(index) {
      let fileList = _.cloneDeep(this.fileList)
      // 重新计算数值
      const file = fileList[index]
      if (file.status === 'FINISH') {
        this.uploadSize -= file.size
      }
      this.totalSize -= file.size

      fileList.splice(index, 1)

      this.$emit('refreshList', fileList)
    },
    // 检查单个文件
    beforeCheck(file) {
      // 检查文件大小
      let isLtSize = file.size / 1024 / 1024 <= this.size
      if (!isLtSize) {
        this.$message.warning(`单个文件大小不允许超过${this.size}`)
        return
      }
    },


    // 调用请求ajax
    ajaxup(file){
      // 清空input，防止两次不能传相同的文件
      let ele = document.getElementById(this.id)
      ele.value = ''
      return new Promise(async (resolve, reject) => {
        let form = new FormData()
        form.append('file', file)
        form.append('fileName', file.name)//根据上传入参添加参数
        form.append('applicationName', '萌百格')//根据上传入参添加参数
        let result = await this.$http({
          url: this.$http.adornUrl('/common/oss/upload'),
          selfHandleError: true,
          method: 'post',
          data: form
        }).then(({data}) =>{
          if(data && data.code === 0){
            let fileList = _.cloneDeep(this.fileList)
            let findIndex = 0
            fileList.forEach((item, index) => {
              if (item.name === file.name) {
                findIndex = index
              }
            })
            fileList[findIndex] = {
              ...fileList[findIndex],
              url: data.data.fileVisitUrl,
              status: 'FINISH'
            }
            this.uploadSize += file.size
            this.$emit('refreshList', fileList)
            resolve(data)
          }else{
            //失败处理
            this.$message.error(data.msg)
            resolve(data)
          }
        }).catch(error => {
          this.$message.error('上传出现错误!')
          reject(error)
        })
      })
    },
  }
}
</script>

<template>
  <div class="gt-advertisement-image-upload">
    <div class="fileCon">
      <div class="list">
        <div v-for="(item,index) in list" :key="index">
          <div class="close" @click="close(index)"></div>
          <!-- @click='handlePictureCardPreview(item.url)' -->
          <img :src="item.url" @click='openImgPic(item.url)'/>
        </div>
        <div class="add" v-show="maxStatus">
          <div v-if="hasMask" v-loading="true" class="box"></div>
          <div style="width: 100%; height: 100%; padding: 0 !important;" @click="chooseType">
            <i class="el-icon-plus el-upload-card"></i>
          </div>
        </div>
      </div>
    </div>
    <div slot="tip" class="el-upload__tip">{{tip}}</div>
    <input :id="names" type="file" class="file-input" accept="image/png,image/jpeg,image/jpg" :multiple="multiple" @change="inputChange" style="display: none" />
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </div>
</template>
<script>
export default {
  data() {
    return {
      hasMask: false,
      maxStatus: true,
      dialogImageUrl: null,
      showImgPic: null,
      dialogVisible: false,
      list:[],
      isInfo: false
    }
  },
  props: {
    names:Number,
    tip:{
      type:String,
    //   default: '(建议尺寸640px*640px，大小不超过5M)'
    },
    multiple: Boolean,
    max: Number,
    reallist: String,
    moreReal: Array,
    cb: Function,
    realistStr:String
  },
  components: {},
  watch:{
    async reallist(n, o) {
      if (!this.isInfo) {

        // 单张图片上传
        if(this.reallist) {
          this.list = []
          this.list.push({
            url:'http://'+this.reallist,
          })
        }
        this.init()
      }
    },
    async moreReal(n, o) {
      if (!this.isInfo) {
        // 多张图片上传
        if(this.moreReal && this.moreReal.length>0){
          this.list = []
          const realTemp = this.moreReal
          for(var i in realTemp) {
            this.list.push({
              url: 'http://'+realTemp[i].url,
              name: realTemp[i].name
            })
          }
        }
        this.init()
      }
    },
  },
  methods: {
    //图片展示
    openImgPic:function(url){
      this.showImgPic = url
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    async init() {
      if (this.list.length == this.max) {
        this.maxStatus = false
      }else{
        this.maxStatus = true
      }
      this.isInfo = true
    },
    chooseType() {
      document.getElementById(this.names).click()
    },
    close(index) {
      this.list.splice(index, 1)
      if(this.moreReal){
        this.moreReal.splice(index,1)
      }
      this.maxStatus = this.list == this.max ? false : true
      if(this.max == 1) {
        let realObj = {str:this.realistStr,value:null}
        this.$emit('updatePicUrl', realObj)
        this.cb('')
      }
    },
    async inputChange(e) {
      let files = e.target.files
      let len = this.list.length + files.length
      if (len > this.max) {
        document.getElementById(this.names).value = ''
        this.$message.warning(`最多允许上传${this.max}张`)
        return
      }

      let uploadAll = Array.from(files).map(this.upload)
      let result = await Promise.all(uploadAll)
      document.getElementById(this.names).value = ''
    },
    beforeCheck(file,index){
      let isLt5 = file.size /1024/1024 <= 5
      let fileName = file.name
      let suffixIndex=fileName.lastIndexOf('.')
      let suffix=fileName.substring(suffixIndex+1).toUpperCase()
      if (suffix!='BMP'&&suffix!='JPG'&&suffix!='JPEG'&&suffix!='PNG'&&suffix!='GIF') {
        this.$message.warning('图片类型必须是.gif,jpeg,jpg,png中的一种')
        return
      }else{
        if (!isLt5) {
          this.$message.warning('上传图片大小不能超过5M!')
          return
        }else{
          this.isExsit(file,index)
        }
      }
    },
    // 是否存在
    isExsit:function(file,index){
      console.log(this.list)
      if (this.list&&this.list.length!== 0) {
        for (let i in this.list) {
          if (this.list[i].name === file.name) {
            this.$message.warning('文件已经存在')
            return false
          }
        }
        this.ajaxup(file, index)
      }else{
        this.ajaxup(file, index)
      }
    },
    upload(file, index) {
      this.beforeCheck(file,index)
    },
    // 调用请求ajax
    ajaxup(file, index){
      return new Promise(async (resolve, reject) => {
        this.hasMask = true
        // var message = this.$message({
        //   duration: 0,
        //   message: '上传图片中...',
        //   type: 'warning'
        // })
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
          this.hasMask = false
          // message.close()
          if(data.code == 0){
            this.$message.success('图片上传完成')
            var imgSrc = data.data.fileVisitUrl
            if(this.max == 1) {
              this.list.push({
                url:'http://'+imgSrc,
                name: file.name
              })
              let realObj = {str:this.realistStr,value:imgSrc}
              this.$emit('updatePicUrl', realObj)
              this.cb(imgSrc)
              // this.reallist = imgSrc // 提交数据
              // this.cb(imgSrc)
            }else{
              this.isInfo = false
              this.list.push({
                url: 'http://'+imgSrc,
                name: file.name
              })
              this.moreReal.push({
                url: imgSrc,
                name: file.name
              })
            }

            if (this.list.length == this.max) {
              this.maxStatus = false
            }
            resolve(result)
          }else{
            //失败处理
            this.$message.warning('上传出错(已忽略)')
            resolve(result)
            return
          }
        })

      })
    },
    //本地图片显示
    getObjectURL:function(file) {
      var url = null
      if (window.createObjectURL != undefined) { // basic
        url = window.createObjectURL(file)
      } else if (window.URL != undefined) { // mozilla(firefox)
        url = window.URL.createObjectURL(file)
      } else if (window.webkitURL != undefined) { // webkit or chrome
        url = window.webkitURL.createObjectURL(file)
      }
      return url
    },
    // 查看图片
    handlePictureCardPreview(url) {
      this.dialogImageUrl =url
      this.dialogVisible = true
    }
  }
}
</script>

<template>
  <section
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-card>
      <el-form :model="advertisement" ref="advertisement" :rules="advertisementRules" label-width="100px">
        <gt-subtitle title="营销活动封面图片(图片尺寸：750px*350px,最多上传5张)" style="display: block;"/>
        <el-form-item label="" prop="activityFrontPictures">
          <gt-image-upload :names="1" :multiple="true" :max=5 :more-real="advertisement.activityFrontPictures" tip="（单张大小不超过5M）"/>
        </el-form-item>
        <gt-subtitle title="营销活动内容背景图片(图片尺寸：750px*750px,最多上传5张)" style="display: block;"/>
        <el-form-item label="" prop="activityBackPictures">
          <gt-image-upload :names="2" :multiple="true" :max=5 :more-real="advertisement.activityBackPictures" tip="（单张大小不超过5M）"/>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="dialog-footer-inner">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消"/>
      <gt-button size="large" :loading="$store.state.loading.global" @click.native="advertisementSubmit" txt="保存"/>
    </div>
  </section>
</template>
<script>
import { advertisementSave } from '@/service/advertisement'
import gtSubtitle from '@/components/gt-sub-title'
import gtImageUpload from '@/components/gt-image-upload'
// import * as api from '@/service/setting'
export default {
  name:'sys-activityCoveList',
  components: {
    gtImageUpload,gtSubtitle
  },
  data () {
    return {
      loading: false,
      advertisement: {
        mAdvertisements: [],
        pAdvertisements: [],
        mPdvertisements: [],
        activityBackPictures: [],
        activityFrontPictures: [],
      },
      advertisementRules:{
        // businessLicensePic:[{required: true, message: '广告照片', trigger: 'change'}],
      }
    }
  },
  created(){
    this.init()
  },
  methods: {
    updatePicUrl:function(imgoBJ){
      this.advertisement[imgoBJ.str] = imgoBJ.value
    },
    //取消
    goBack(){
      history.go(-1)
    },
    //获取信息
    async init () {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/banners/list', true),
        method: 'get',
        selfHandleError: true
      })
      if (data.code === 0 && data.data) {
        this.advertisement = {
          mAdvertisements: data.data.mAdvertisements.map(item => {
            return {
              url: item,
              name: ''
            }
          }),
          pAdvertisements: data.data.pAdvertisements.map(item => {
            return {
              url: item,
              name: ''
            }
          }),
          mPdvertisements:data.data.mPdvertisements.map(item => {
            return {
              url: item,
              name: ''
            }
          }),
          activityBackPictures: data.data.activityBackPictures.map(item => {
            return {
              url: item,
              name: ''
            }
          }),
          activityFrontPictures: data.data.activityFrontPictures.map(item => {
            return {
              url: item,
              name: ''
            }
          })
        }
      } else {
        this.$message.error(data.msg)
      }
    },
    // 保存
    advertisementSubmit () {
      console.log(this.advertisement)
      this.$refs['advertisement'].validate(async (valid) => {
        if (valid) {
          const res = await advertisementSave({
            ...this.advertisement,
            mAdvertisements: this.advertisement.mAdvertisements.map(item => item.url),
            pAdvertisements: this.advertisement.pAdvertisements.map(item => item.url),
            mPdvertisements: this.advertisement.mPdvertisements.map(item => item.url),
            activityBackPictures: this.advertisement.activityBackPictures.map(item => item.url),
            activityFrontPictures: this.advertisement.activityFrontPictures.map(item => item.url),
          })
          this.$router.push({name:'home'})
        }
      })
    }
  }
}
</script>
<style lang="scss" scope>
  .dialog-footer-inner {
    width: 100%;
    display: block;
    margin: 20px 0;
    text-align: center;
  }
  .el-select {
    width: auto!important;
  }
  .locations {
    .el-input__inner {
      width: 300px!important;
    }
  }
  .storeNames input {
    padding-left:15px!important;
  }
  .el-form-item__error1 {
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 4px;
    position: absolute;
    top: 100%;
    left: 0;
  }
</style>

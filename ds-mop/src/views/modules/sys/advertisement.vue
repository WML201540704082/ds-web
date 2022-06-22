<template>
  <section
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-card>
      <el-form :model="advertisement" ref="advertisement" :rules="advertisementRules" label-width="100px">
        <gt-subtitle title="云店“首页”顶部轮播图(图片尺寸：750px*300px,最多上传5张)" style="display: block;"/>
        <el-form-item label="" prop="mAdvertisements">
          <gt-image-upload :names="1" :multiple="true" :max=5 :more-real="advertisement.mAdvertisements" tip="（单张大小不超过5M）"/>
        </el-form-item>
        <el-form-item label="广告显示" prop='selectOne' style="float: right;margin-top: -160px;margin-right: 20px;">
          <el-select v-model="selectOne" placeholder="请选择广告优先显示" clearable>
            <el-option
              v-for="item in priorityType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <gt-subtitle title="POS客显广告(图片尺寸：1600px*900px,最多上传5张)" style="display: block;"/>
        <el-form-item label="" prop="pAdvertisements">
          <gt-image-upload :names="2" :multiple="true" :max=5 :more-real="advertisement.pAdvertisements" tip="（单张大小不超过5M）"/>
        </el-form-item>
        <el-form-item label="广告显示" prop='selectTwo' style="float: right;margin-top: -160px;margin-right: 20px;">
          <el-select v-model="selectTwo" placeholder="请选择广告优先显示" clearable>
            <el-option
              v-for="item in priorityType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <gt-subtitle title="云店“分类”广告图(图片尺寸：550px*200px,最多上传2张)" style="display: block;"/>
        <el-form-item label="" prop="mPdvertisements">
          <gt-image-upload :names="3" :multiple="true" :max=2 :more-real="advertisement.mPdvertisements" tip="（单张大小不超过5M）"/>
        </el-form-item>
        <el-form-item label="广告显示" prop='selectThree' style="float: right;margin-top: -160px;margin-right: 20px;">
          <el-select v-model="selectThree" placeholder="请选择广告优先显示" clearable>
            <el-option
              v-for="item in priorityType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <gt-subtitle title="【妈咪全知道门店】店务助手“门店小程序”分享海报图片(图片尺寸：688px*476px，只可上传1张)" style="display: block;"/>
        <el-form-item label="" prop="mMposters">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'mMposters'" :names="5" :max=1 :reallist="advertisement.mMposters" :cb="value => advertisement.mMposters = value" />
        </el-form-item>
        <gt-subtitle title="【萌百格门店】店务助手“门店小程序”分享海报图片(图片尺寸：688px*476px，只可上传1张)" style="display: block;"/>
        <el-form-item label="" prop="mBposters">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'mBposters'" :names="6" :max=1 :reallist="advertisement.mBposters" :cb="value => advertisement.mBposters = value" />
        </el-form-item>
        <gt-subtitle title="店务助手直播分享海报图片(图片尺寸：476px*688px，只可上传1张)" style="display: block;"/>
        <el-form-item label="" prop="livePictures">
          <!-- :cb="value => advertisement.livePictures.url = value" -->
          <!-- <gt-image-upload :names="4" :multiple="true" :max=2 :more-real="advertisement.livePictures" tip="（单张大小不超过5M）"/> -->
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'livePictures'" :names="4" :max=1 :reallist="advertisement.livePictures" :cb="value => advertisement.livePictures = value" />
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
import { priorityType } from '@/utils/dict'
import { advertisementSave } from '@/service/advertisement'
import gtSubtitle from '@/components/gt-sub-title'
import gtImageUpload from '@/components/gt-image-upload'
// import * as api from '@/service/setting'
export default {
  name:'sys-advertisement',
  components: {
    gtImageUpload,gtSubtitle
  },
  data () {
    return {
      priorityType,
      loading: false,
      advertisement: {
        mAdvertisements: [],
        pAdvertisements: [],
        mPdvertisements: [],
        mMposters:null,//妈咪全知道
        mBposters:null,//萌百格
        livePictures: null,
        activityBackPictures: [],
        activityFrontPictures: [],
      },
      selectOne:'STORE',
      selectTwo:'STORE',
      selectThree:'STORE',
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
          mMposters:data.data.mMposters ? data.data.mMposters.toString() : '',
          mBposters:data.data.mBposters ? data.data.mBposters.toString() : '',
          livePictures:data.data.livePictures ? data.data.livePictures.toString() : '',
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
        this.selectOne = data.data.configs[0].priority
        this.selectTwo = data.data.configs[1].priority
        this.selectThree = data.data.configs[2].priority
      } else {
        this.$message.error(data.msg)
      }
    },
    // 保存
    advertisementSubmit () {
      console.log(this.advertisement)
      this.$refs['advertisement'].validate(async (valid) => {
        if (valid) {
          const { data } = await advertisementSave({
            ...this.advertisement,
            mAdvertisements: this.advertisement.mAdvertisements.map(item => item.url),
            pAdvertisements: this.advertisement.pAdvertisements.map(item => item.url),
            mPdvertisements: this.advertisement.mPdvertisements.map(item => item.url),
            mMposters: this.advertisement.mMposters.split(','),
            mBposters: this.advertisement.mBposters.split(','),
            livePictures: this.advertisement.livePictures.split(','),
            activityBackPictures: this.advertisement.activityBackPictures.map(item => item.url),
            activityFrontPictures: this.advertisement.activityFrontPictures.map(item => item.url),
            configs:[{type:'mAdvertisements',priority:this.selectOne},{type:'pAdvertisements',priority:this.selectTwo},{type:'mPdvertisements',priority:this.selectThree}]
          })
          if (data.code == 0) {
            this.$message.success('修改成功')
            this.$router.push({name:'sys-advertisement'})
          }else {
            this.$message.error(data.msg)
          }
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

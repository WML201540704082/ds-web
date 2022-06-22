<template>
  <section
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-card>
      <!-- <gt-subtitle :title="!dataForm.id ? '新增门店' : '修改门店'"/> -->
      <el-form :model="dataForm" ref="dataForm" :rules="dataFormRules" label-width="130px">
        <!-- 编辑页面有的-门店编号 -->
        <el-form-item label="门店编号" v-if="dataForm.id">
          <el-input v-model="dataForm.code" :disabled='true'></el-input>
        </el-form-item>
        <el-form-item label="门店名称" prop="name"  class="gt-input-tip">
          <el-input :maxlength="30" v-model="dataForm.name" class="storeNames" placeholder='请输入门店名称'></el-input>
        </el-form-item>
        <el-form-item label="云店名称" prop="weshopName" v-if="newStore == 'true'" class="gt-input-tip">
          <el-input :maxlength="30" v-model="dataForm.weshopName" class="storeNames" placeholder='请输入云店名称'></el-input>
        </el-form-item>
        <el-form-item label="门店营业执照名称" v-if="newStore == 'true'" prop="storeNameAcc" class="gt-input-tip">
          <el-input v-model="dataForm.storeNameAcc" class="storeNames" :maxlength="30" placeholder='请输入门店营业执照名称'><span slot="prefix" style="left: 210px;">*请输入和营业执照上一致的名称</span></el-input>
        </el-form-item>
        <el-form-item label="门店类型" prop="type" v-if="newStore == 'true'">
          <el-radio-group v-model="dataForm.type">
            <el-radio label="NEW_RETAIL">新零售</el-radio>
            <el-radio label="NEW_RETAIL_AND_DRINK">新零售+茶饮</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-form-item label="门店类型" prop="type" v-else>
          <el-radio-group v-model="dataForm.storeCategory">
            <el-radio :disabled="dataForm.id ? true : false" v-for="item in storeB" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="dataForm.linkman" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="小店联系电话" prop="storeLinkPhone">
          <el-input v-model="dataForm.storeLinkPhone" placeholder="请输入萌百小店联系电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="openRangeAm">
          上午&nbsp;&nbsp;
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.forenoonOpenHours"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '12:00',
              maxTime: dataForm.forenoonCloseHours
            }">
          </el-time-select>
          至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.forenoonCloseHours"
            :picker-options="{
              start: '06:00',
              step: '00:15',
              end: '12:00',
              minTime: dataForm.forenoonOpenHours
            }">
          </el-time-select>
        </el-form-item>
        <el-form-item prop="openRangePm">
          下午&nbsp;&nbsp;
          <el-time-select
            placeholder="起始时间"
            v-model="dataForm.afternoonOpenHours"
            :picker-options="{
              start: '12:00',
              step: '00:15',
              end: '23:00',
              maxTime: dataForm.afternoonCloseHours
            }">
          </el-time-select>
          至&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
          <el-time-select
            placeholder="结束时间"
            v-model="dataForm.afternoonCloseHours"
            :picker-options="{
              start: '12:00',
              step: '00:15',
              end: '23:00',
              minTime: dataForm.afternoonOpenHours
            }">
          </el-time-select>
        </el-form-item>
        <!-- <el-form-item label="营业时间" prop="openRangeAm">
          上午&nbsp;&nbsp;
          <el-time-picker
            is-range
            v-model="dataForm.openRangeAm"
            format= 'HH:mm'
            value-format="HH:mm"
            range-separator="至"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item>
        <el-form-item prop="openRangePm">
          下午&nbsp;&nbsp;
          <el-time-picker
            is-range
            v-model="dataForm.openRangePm"
            format= 'HH:mm'
            value-format="HH:mm"
            range-separator="至"
            :editable="false"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item> -->
        <el-form-item label="门店位置" style="margin-bottom: 5px;" prop="storeLocation" class="lefts">
          <gt-select-location ref="storeLocation" :provinceId="dataForm.provinceId" :cityId="dataForm.cityId" :districtId="dataForm.districtId" />
        </el-form-item>
        <el-form-item prop="address" style="padding-top: 15px">
          <!-- @input="showMap"  -->
          <el-input style=" width: 220px;float: left" @input="showMap" class="locations" v-model="dataForm.address" placeholder="门店具体地址详细道牌号"></el-input>
          <gt-border-button @click.native="getLan" type="select" txt="查询地址" style="cursor: pointer;float: left;margin-left: 100px;margin-top:3px;"/>
        </el-form-item>
        <el-form-item>
          <gt-map @refreshDataList = 'getObj' :width="400" :height="300" :search="location"/>
        </el-form-item>
        <el-form-item label="经营许可证" prop="businessLicensePic">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'businessLicensePic'" :names="2"  :multiple="true" :max=1 :reallist="dataForm.businessLicensePic" :cb="value => dataForm.businessLicensePic = value" />
        </el-form-item>
        <el-form-item label="门店LOGO" prop="storeLogo">
           <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'storeLogo'" :names="1" :multiple="true" :max=1 :reallist="dataForm.storeLogo" :cb="value => dataForm.storeLogo = value" />
        </el-form-item>
        <el-form-item label="门头照" prop="doorwayPic">
           <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'doorwayPic'" :names="3" :multiple="true" :max=1 :reallist="dataForm.doorwayPic" :cb="value => dataForm.doorwayPic = value" />
        </el-form-item>
        <el-form-item label="店内实景照" prop="innerPic">
          <gt-image-upload :names="4" :multiple="true" :max=5 :more-real="imgList" tip="（单张大小不超过5M，最多5张）"/>
        </el-form-item>
        <el-form-item label="门店直播分享码" prop="share" class="view-img">
          <img v-if="dataForm.liveCode" :src="'http://'+ dataForm.liveCode" alt="" @click="openImgPic('liveCode')">
          <span v-else class="itemInput">--</span>
        </el-form-item>

        <el-form-item label="短信验证码" prop="verificationCode">
          <el-input v-model="dataForm.verificationCode" class ="verCode" placeholder="请输入短信验证码" style="width: 200px;float: left;"></el-input>
          <gt-getvarcode :phone="phone" style="float: left;margin-right: 5px;" />
          <div class="el-upload__tip" style="margin-left: 5px;">验证码会发送到企业用户绑定的手机上，注意查收</div>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="dialog-footer-inner">
      <gt-button size="large" is-default :loading="$store.state.loading.global" @click.native="dataFormSubmit(false)" txt="仅保存"/>
      <gt-button size="large" :loading="$store.state.loading.global" @click.native="dataFormSubmit(true)" txt="保存并提交"/>
    </div>
  </section>
</template>

<script>
import gtImageUpload from '@/components/gt-image-upload'
import gtGetvarcode from '@/components/gt-getvarcode'
import gtSelectLocation from '@/components/gt-select-location'
import { storeB } from '@/utils/dict'
// import gtSubtitle from '@/components/gt-sub-title'
import { isphone, validatenull,isMobile } from '@/utils/validate'
import { getStore } from '@/utils/storage'
import { locations } from '@/utils'
import * as api from '@/service/setting'
import gtMap from '@/components/gt-map'
import _ from 'lodash'
export default {
  name: 'store-add-or-update',
  components: { gtImageUpload, gtSelectLocation, gtGetvarcode, gtMap },
  data () {
    var selectLocation = (rule,value,callback) =>{
      if(validatenull(this.$refs['storeLocation'].province)){
        $('.lefts .el-form-item__error1').remove()
        return callback(new Error('请先选择省份'))
      }else if(validatenull(this.$refs['storeLocation'].city)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__content').append('<div class="el-form-item__error1">请先选择市</div>')
        $('.lefts .el-form-item__error1').css('left',210)
        return callback(new Error('.'))
      }else if(validatenull(this.$refs['storeLocation'].district)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__error').css('left', 420)
        return callback(new Error('请先选择区/县'))
      }else{
        return callback()
      }
    }
    const isRight =(rule,value,callback)=>{
      if(validatenull(this.dataForm.longitude)&&validatenull(this.dataForm.latitude)){
        return callback(new Error('请输入正确的详细地址'))
      }else{
        return callback()
      }
    }

    const validateOpenRangeAm = (rule,value,callback) => {
      if (validatenull(this.dataForm.forenoonOpenHours) && validatenull(this.dataForm.forenoonCloseHours)){
        return callback(new Error('请选择营业时间'))
      } else if(validatenull(this.dataForm.forenoonOpenHours)){
        return callback(new Error('请选择开始营业时间'))
      } else if(validatenull(this.dataForm.forenoonCloseHours)){
        return callback(new Error('请选择结束营业时间'))
      } else{
        return callback()
      }
    }
    const validateOpenRangePm = (rule,value,callback) => {
      if (validatenull(this.dataForm.afternoonOpenHours) && validatenull(this.dataForm.afternoonCloseHours)){
        return callback(new Error('请选择营业时间'))
      } else if(validatenull(this.dataForm.afternoonOpenHours)){
        return callback(new Error('请选择开始营业时间'))
      } else if(validatenull(this.dataForm.afternoonCloseHours)){
        return callback(new Error('请选择结束营业时间'))
      } else{
        return callback()
      }
    }
    const isasync = (rule,value,callback) => {
      if(!isMobile(value)){
        return callback(new Error('手机号格式不正确!'))
      }else{
        if(!validatenull(this.dataForm.storeLinkPhone)){
          return callback()
        }else{
          this.dataForm.storeLinkPhone = value
          return callback()
        }
      }
    }
    return {
      newStore:null,
      imgList:[], //暂存图
      storeB,
      loading: false,
      phone: null,
      location: '',
      dataForm: {
        id: 0,
        name: null,
        storeNameAcc: null,
        storeCategory:0,
        phone:null,
        storeLinkPhone: null,
        linkman:null,
        businessLicensePic: null,
        // openRangeAm: ['09:00:00', '11:30:00'],
        // openRangePm: ['13:00:00', '18:00:00'],
        forenoonOpenHours:'09:00',
        forenoonCloseHours:'12:00',
        afternoonOpenHours:'12:00',
        afternoonCloseHours:'18:00',
        doorwayPic: null,
        innerPic: null,
        storeLogo: null,
        province:null,
        city:null,
        district:null,
        provinceId:null,
        cityId:null,
        districtId:null,
        address: '',
        submit: false,
        verificationCode:null,
        longitude: null,
        latitude: null,
        type:"NEW_RETAIL",//门店类型
      },
      dataFormRules:{
        weshopName:[{required: true, message: '请输入云店名称', trigger: 'change'}],
        name:[{required: true, message: '请输入门店名称', trigger: 'change'}],
        storeNameAcc:[{required: true, message: '请输入门店营业执照名称', trigger: 'change'}],
        stortypeeCategory:[{required: true, message: '请选择门店类别', trigger: 'change'}],
        type:[{required: true, message: '请选择门店类型', trigger: 'change'}],
        linkman:[{required: true, message: '请输入联系人', trigger: 'change'}],
        phone:[{required: true, message: '请输入联系电话', trigger: 'change'},
          {validator: isasync, trigger: 'change'}],
        storeLinkPhone:[{required: true, message: '请输入萌百小店联系电话', trigger: 'change'},
          {validator: isphone, trigger: 'change'}],
        address:[ {required: true, message: '请输入门店具体地址详细道牌号', trigger: 'change'},
          {validator: isRight, trigger: 'blur'}],
        storeLocation:[ {required: true, validator: selectLocation, trigger: 'change'} ],
        // businessLicensePic:[ {required: true, message: '请选择经营许可证', trigger: 'change'}],
        verificationCode:[{required: true, message: '请输入短信验证码', trigger: 'change'}],
        openRangeAm: [{required: true, validator: validateOpenRangeAm, trigger: 'change'}],
        openRangePm: [{required: true, validator: validateOpenRangePm, trigger: 'change'}]
      }
    }
  },
  created(){
    this.dataForm.id = this.$route.query.id || ''
    this.phone = getStore({name: 'company-userName'})
    this.newStore = getStore({name:'commenInfo'}).newStore
    this.init(this.dataForm.id)
  },
  methods: {
    getObj(obj){
      console.log(JSON.stringify(obj))
      if(!validatenull(obj)){
        this.dataForm.longitude = obj.lng
        this.dataForm.latitude = obj.lat
      }else{
        this.dataForm.longitude = null
        this.dataForm.latitude = null
      }
    },

    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = 'http://'+ url
      }else{
        this.showImgPic = 'http://'+this.dataForm[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    updatePicUrl:function(imgoBJ){
      this.dataForm[imgoBJ.str] = imgoBJ.value
    },
    showMap: _.debounce(function(value, isFirst) {
      if (isFirst) {
        this.location = value
      } else {
        const { province, city, district } = locations(this.$refs['storeLocation']) || {}
        this.location = `${province || ''}${city || ''}${district || ''}${value}`
      }
    }, 1000),
    // 获取经纬度
    getLan(){
      const { province, city, district } = locations(this.$refs['storeLocation']) || {}
      this.location = `${province || ''}${city || ''}${district || ''}`+this.dataForm.address||''
      // alert(this.location)
    },
    async init (id) {
      if (id) {
        const data = await api.getStoresDetail(id)
        this.dataForm = {
          ...this.dataForm,
          ...data
        }
        if(data.innerPic){
          this.imgList = JSON.parse(this.dataForm.innerPic)
        }
        // 绑定上午营业时间
        // if (data.forenoonOpenHours && data.forenoonCloseHours) {
        //   this.dataForm.openRangeAm = [data.forenoonOpenHours, data.forenoonCloseHours]
        // }
        // 绑定下午营业时间
        // if (data.afternoonOpenHours && data.afternoonCloseHours) {
        //   this.dataForm.openRangeAm = [data.afternoonOpenHours, data.afternoonCloseHours]
        // }
        // 获取地图位置
        this.$nextTick(() => {
          const { province, city, district, address } = this.dataForm
          this.showMap(`${province || ''}${city || ''}${district || ''}${address || ''}`, true)
        })
      }
    },
    // 表单提交
    dataFormSubmit (submit) {
      console.log(this.dataForm)
      this.getLan()
      this.$refs['dataForm'].validate(async(valid) => {
        if (valid) {
          this.loading = true
          var local = locations(this.$refs['storeLocation'])
          console.log(this.dataForm)
          const { data } = await api.getStoresData({
            ...this.dataForm,
            provinceId: local.provinceId,
            province: local.province,
            cityId: local.cityId,
            city: local.city,
            districtId: local.districtId,
            district: local.district,
            innerPic: JSON.stringify(this.imgList) || null,
            submit: submit,
            type:this.newStore == 'true' ? this.dataForm.type : null,
          })
          this.loading = false
          if(data.code == 0){
            this.$router.push({name:'settings-storeManagement-store'})
          }else{
            this.$message.error(data.msg)
          }
        } else {
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    }
  }
}
</script>
<style lang="scss">
.el-date-editor.el-input__inner{
  padding-bottom: 0;
  padding-top: 0;
  height: 33px;
  line-height: 33px;
  .el-range-separator{
    width: 10%;
  }
}
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

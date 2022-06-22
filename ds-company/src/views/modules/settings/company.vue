<template>
  <section>
    <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
      <div class="common-title">
        <!-- <img class="image" src="static/img/setting/company-title.png" alt="logo"> -->
          <icon-svg name="company" class="theme-color image" style="font-size: 35px;vertical-align: middle;"></icon-svg>
        <div class="info-container">
          <p class="main-info">企业基本信息认证</p>
          <span class="sub-info">完成商户基本信息认证可以有效提高店铺在萌百格平台的信用等级，同时提高在售商品的推荐机会，更好增加消费者购买欲</span>
        </div>
        <div class="status"><span :class="filterColor(filterStatus(company.status, companyStatus))">当前状态： {{filterStatus(company.status, companyStatus)}}</span></div>
      </div>
    </el-card>
    <el-card v-if="company.status !== 0">
      <company-view v-if="isAuth('company:company:approve')" :company="company"/>
    </el-card>
    <div v-if="company.status === 0">
      <el-card v-if="isAuth('update:company:company:approve')">
        <gt-sub-title title="实体信息" />
        <el-form ref="company-form" :rules="dataFormRules"  label-width="140px" :model="company">
          <el-form-item label="实体类别" prop="entityCategory">
            <el-radio-group v-model="company.entityCategory">
              <el-radio :key="item.value" v-for="item in companyType" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="企业名称" class="gt-input-tip" prop="name">
            <el-input :maxlength="30" v-model="company.name"><span slot="prefix" >*请输入和营业执照上一致的名称</span></el-input>
          </el-form-item>
          <el-form-item label="法人" class="gt-input-tip" prop="legalPerson">
            <el-input placeholder="" v-model="company.legalPerson"><span slot="prefix" >*请输入和营业执照上一致的法人</span></el-input>
          </el-form-item>
          <!-- <el-form-item label="商户号">
            <el-input v-model="company.fuiouMerchantNo"></el-input>
          </el-form-item> -->
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="company.phone"></el-input>
          </el-form-item>
          <el-form-item label="企业级别" prop="level">
            <el-select v-model="company.level" :disabled="true">
              <el-option :key="level.value" :label="level.label" :value="level.value" v-for="level in companyLevel"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照编号" prop="businessLicenseCode">
            <el-input v-model="company.businessLicenseCode"></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="companyLocation" class="lefts">
            <gt-select-location v-if="company.phone" ref="companyLocation" :provinceId="company.provinceId" :cityId="company.cityId" :districtId="company.districtId"/>
          </el-form-item>
          <!-- label="详细地址" -->
          <el-form-item prop="address">
            <el-input style=" width: 220px;float: left" @input="showMap" v-model="company.address" placeholder="门店具体地址详细道牌号"></el-input>
            <gt-border-button @click.native="getLan" type="select" txt="查询地址" style="cursor: pointer;float: left;margin-left: 100px;margin-top:3px;"/>
          </el-form-item>
          <el-form-item>
            <gt-map @refreshDataList = 'getObj' :width="400" :height="300" :search="location"/>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证(正面)" prop="legalPersonIdPositivePic" class="pics">
                <gt-image-upload @updatePicUrl="updatePicUrl" :comp="12" :realistStr="'legalPersonIdPositivePic'" :names="1" :multiple="true" :max=1 :reallist="company.legalPersonIdPositivePic" :cb="value => company.legalPersonIdPositivePic = value" />
                <el-input v-model="company.legalPersonIdPositivePic" style="display: none!important;"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证(反面)" prop="legalPersonIdBackPic">
                <gt-image-upload @updatePicUrl="updatePicUrl" :comp="12" :realistStr="'legalPersonIdBackPic'" :names="2" :multiple="true" :max=1 :reallist="company.legalPersonIdBackPic" :cb="value => company.legalPersonIdBackPic = value" />
                <el-input v-model="company.legalPersonIdBackPic" style="display: none!important;"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="营业执照" prop="businessLicensePic">
            <gt-image-upload @updatePicUrl="updatePicUrl" :comp="12" :realistStr="'businessLicensePic'" :names="3"  :multiple="true" :max=1 :reallist="company.businessLicensePic" :cb="value => company.businessLicensePic = value" />
            <el-input v-model="company.businessLicensePic" style="display: none!important;"></el-input>
          </el-form-item>
        </el-form>
      </el-card>
      <div v-if="company.status === 0&&isAuth('update:company:company:approve')" class="gt-form-bottom-submit">
        <gt-button size="large" :loading="$store.state.loading.global" @click.native="handleUpdate" txt="提交认证"/>
      </div>
    </div>
  </section>
</template>
<script>
import gtImageUpload from '@/components/gt-image-upload'
import gtSubTitle from '@/components/gt-sub-title'
import gtButton from '@/components/gt-button'
import gtSelectLocation from '@/components/gt-select-location'
import companyView from './company-view'
import { getCompany, approveCompany } from '@/service/company'
import { filterStatus, filterColor } from '@/utils'
import { companyLevel, companyType, companyStatus } from '@/utils/dict'
import { isMobile, validatenull } from '@/utils/validate'
import { locations } from '@/utils'
import { getStore,setStore } from '@/utils/storage'
import gtMap from '@/components/gt-map'
import _ from 'lodash'
export default {
  name: 'settings-company',
  data() {
    const validatePhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    const selectLocation = (rule,value,callback) =>{
      if(validatenull(this.$refs['companyLocation'].province)){
        $('.lefts .el-form-item__error1').remove()
        return callback(new Error('请先选择省份'))
      }else if(validatenull(this.$refs['companyLocation'].city)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__content').append('<div class="el-form-item__error1">请先选择市</div>')
        $('.lefts .el-form-item__error1').css('left',210)
        return callback(new Error('.'))
      }else if(validatenull(this.$refs['companyLocation'].district)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__error').css('left', 420)
        return callback(new Error('请先选择区/县'))
      }else{
        return callback()
      }
    }
    const isRight =(rule,value,callback)=>{
      if(validatenull(this.company.longitude)&&validatenull(this.company.latitude)){
        return callback(new Error('请输入正确的详细地址'))
      }else{
        return callback()
      }
    }
    return {
      company: {
        entityCategory: null,
        legalPerson: null,
        level: 1,
        phone: null,
        number: null,
        city: null,
        cityId: null,
        province: null,
        provinceId: null,
        district: null,
        districtId: null,
        address: '',
        businessLicenseCode: null,
        businessLicensePic: null,
        legalPersonIdPositivePic: null,
        legalPersonIdBackPic: null,
        status: null,
        remarkStatus: null,
        longitude: null,
        latitude: null
      },
      location: null,
      companyLevel,
      companyType,
      companyStatus,
      filterStatus,
      filterColor,
      dataFormRules:{
        entityCategory:[{required: true, message: '请选择实体类型'}],
        name:[{required: true, message: '请输入企业名称'}],
        legalPerson:[{required: true, message: '请输入法人'}],
        level: [{required: true, message: '请选择企业级别'}],
        phone: [{required: true, message: '请输入手机号'}, { validator: validatePhone, trigger: 'blur' }],
        companyLocation: [{required: true, validator: selectLocation, trigger: 'change' }],
        address: [{required: true, message: '请输入地址',trigger: 'change' },
          {validator: isRight, trigger: 'blur'}],
        businessLicenseCode: [{required: true, message: '请输入营业执照编号',trigger: 'change'}],
        legalPersonIdPositivePic: [{required: true,message: '请上传身份证正面照',trigger: 'change'},],
        legalPersonIdBackPic: [{required: true, message: '请上传身份证反面照',trigger: 'change'}],
        businessLicensePic: [{required: true, message: '请上传营业执照',trigger: 'change'}],
        status: [{required: true, message: '请选择企业状态',trigger: 'change'}],
      }
    }
  },
  components: { gtImageUpload, gtSubTitle, gtSelectLocation, companyView, gtMap },
  methods: {
    getObj(obj){
      console.log(JSON.stringify(obj))
      if(!validatenull(obj)){
        this.company.longitude = obj.lng
        this.company.latitude = obj.lat
      }else{
        this.company.longitude = null
        this.company.latitude = null
      }
    },
    updatePicUrl:function(imgoBJ){
      this.company[imgoBJ.str] = imgoBJ.value
    },
    showMap: _.debounce(function(value, isFirst) {
      if (isFirst) {
        this.location = value
      } else {
        const { province, city, district } = locations(this.$refs['companyLocation']) || {}
        this.location = `${province || ''}${city || ''}${district || ''}${value}`
      }
    }, 1000),
    // 获取经纬度
    getLan(){
      const { province, city, district } = locations(this.$refs['companyLocation']) || {}
      this.location = `${province || ''}${city || ''}${district || ''}`+this.company.address||''
      // alert(this.location)
    },
    handleUpdate() {
      this.getLan()
      this.$refs['company-form'].validate(async (valid) => {
        if (valid) {
          this.dataListLoading = true
          var local = locations(this.$refs['companyLocation'])
          // 企业认证
          const data = await approveCompany({
            ...this.company,
            provinceId: local.provinceId || null,
            province: local.province || null,
            cityId: local.cityId || null,
            city: local.city || null,
            districtId: local.districtId || null,
            district: local.district || null,
          })
          this.dataListLoading = false
          const dataResult = await getCompany()
          this.company = { ...this.company, ...dataResult }
        }else{
          // this.$nextTick(() => {
          //   let top = document.querySelector('.is-error').offsetTop
          //   $('html,body').animate({scrollTop: top}, 500, 'linear')

          // })
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    },
  },
  async created() {
    if(this.isAuth('company:company:approve')){
      const data = await getCompany()
      this.company = { ...this.company, ...data }
      // 获取地图位置
      this.$nextTick(() => {
        const { province, city, district, address } = this.company
        this.showMap(`${province || ''}${city || ''}${district || ''}${address || ''}`, true)
      })
      if(this.company.status === 2) {
        setStore({ name: 'company-info', content: 1})
        this.$store.commit('common/updateIsAuthentication')
      }else{
        setStore({ name: 'company-info', content: 0})
        this.$store.commit('common/updateIsAuthentication')
      }
    }
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
.serverTime {
  .el-col.serverOne {
    width: 200px;
  }
}
.common-title {
  overflow: hidden;
  position: relative;
  .image{
    width: 40px;
    float: left;
    margin-right: 10px;
  }
  .info-container{
    float: left;
    .main-info{
      margin: 5px 0 10px;
      font-size: 18px;
      color: $info--main-font-color;
    }
    .sub-info {
      color: $info--sub-font-color;
    }
  }
  .status{
    position: absolute;
    top: 10px;
    right: 15px;
  }
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


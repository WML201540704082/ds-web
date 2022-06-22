<template>
  <section>
    <el-card>
      <el-row>
        <el-form ref="company-form" :rules="dataFormRules" label-width="135px" :model="company">
          <el-form-item label="行业类别" prop="industryCategory">
            <el-radio-group v-model="company.industryCategory">
              <el-radio :key="item.value" v-for="item in industryType" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="实体类别" prop="entityCategory">
            <el-radio-group v-model="company.entityCategory">
              <el-radio :key="item.value" v-for="item in companyType" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="企业名称" class="gt-input-tip" prop="name">
            <el-input v-model="company.name" :maxlength="30"><span slot="prefix" >*请输入和营业执照上一致的名称</span></el-input>
          </el-form-item>
          <!-- <el-form-item label="商户号" class="gt-input-tip" prop="fuiouMerchantNo">
            <el-input v-model="company.fuiouMerchantNo" :maxlength="15"></el-input>
          </el-form-item> -->
          <el-form-item label="法人" prop="legalPerson" class="gt-input-tip">
            <el-input v-model="company.legalPerson"><span slot="prefix" >*请输入和营业执照上一致的法人</span></el-input>
          </el-form-item>
          <el-form-item label="联系电话" prop="phone">
            <el-input v-model="company.phone"></el-input>
          </el-form-item>
          <el-form-item label="企业级别" prop="level">
            <el-select v-model="company.level" disabled>
              <el-option :key="level.value" :label="level.label" :value="level.value" v-for="level in companyLevel"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="营业执照编号" prop="businessLicenseCode">
            <el-input v-model="company.businessLicenseCode"></el-input>
          </el-form-item>
          <el-form-item label="企业地址" prop="companyLocation" class="lefts">
            <gt-select-location ref="companyLocation" :provinceId="company.provinceId" :cityId="company.cityId" :districtId="company.districtId"/>
          </el-form-item>
          <el-form-item prop="address" class="long-input" >
            <!-- @input="showMap" -->
            <el-input style=" width: 300px;float: left" @input="showMap" placeholder="具体地址详细道路牌号" v-model="company.address" ></el-input>
            <gt-border-button @click.native="getLan" type="select" txt="查询地址" style="cursor: pointer;float: left;margin-left: 100px;margin-top:3px;"/>
          </el-form-item>
          <el-form-item>
            <gt-map @refreshDataList = 'getObj' :width="400" :height="300" :search="location"/>
          </el-form-item>
          <el-form-item label="服务时间" class="gt-inline-item">
            <gt-time-range
              start-time-prop="serviceBeginDate"
              :start-time-value="company.serviceBeginDate"
              :end-time-value="company.serviceEndDate"
              end-time-prop="serviceEndDate"
              @changeStartValue="value => company.serviceBeginDate = value"
              @changeEndValue="value => company.serviceEndDate = value"
            ></gt-time-range>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照" prop="businessLicensePic">
                <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'businessLicensePic'" :names="3" :multiple="true" :max=1 :reallist="company.businessLicensePic" :cb="value => company.businessLicensePic = value" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业logo" prop="companyLogo">
                <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'companyLogo'" :names="4" :multiple="true" :max=1 :reallist="company.companyLogo" :cb="value => company.companyLogo = value" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证(正面)" prop="legalPersonIdPositivePic">
                <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'legalPersonIdPositivePic'" :names="1" :multiple="true" :max=1 :reallist="company.legalPersonIdPositivePic" :cb="value => company.legalPersonIdPositivePic = value" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证(反面)" prop="legalPersonIdBackPic">
                <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'legalPersonIdBackPic'" :names="2" :multiple="true" :max=1 :reallist="company.legalPersonIdBackPic" :cb="value => company.legalPersonIdBackPic = value" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="手持身份证" prop="handIdCardPic">
            <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'handIdCardPic'" :names="5" :multiple="true" :max=1 :reallist="company.handIdCardPic" :cb="value => company.handIdCardPic = value" />
          </el-form-item>
          <el-form-item label="提现账户" class="gt-input-tip" prop="accountNo">
            <el-input v-model="company.accountNo"></el-input>
          </el-form-item>
          <el-form-item label="开户名" class="gt-input-tip" prop="accountName">
            <el-input v-model="company.accountName"></el-input>
          </el-form-item>
          <el-form-item label="开户银行" class="gt-input-tip" prop="accountBank">
            <el-input v-model="company.accountBank"></el-input>
          </el-form-item>
          <el-form-item label="收款账户" prop="accountPic">
              <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'accountPic'" :names="6" :multiple="true" :max=1 :reallist="company.accountPic" :cb="value => company.accountPic = value" />
            </el-form-item>
          <el-form-item label="企业状态" prop="status" v-if="this.id">
            <el-radio-group v-model="company.status">
              <el-radio :key="item.value" v-for="item in companyStatus" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="备注" prop="statusRemark" v-if="this.id">
            <el-input type="textarea" v-model="company.statusRemark" style="width: 300px;"></el-input>
          </el-form-item>
          <!-- <el-form-item label="入驻品牌" prop="brandFlag">
            <el-radio-group v-model="company.brandFlag">
              <el-radio :label="0" >无</el-radio>
              <el-radio :label="1" >妈咪全知道</el-radio>
            </el-radio-group>
          </el-form-item> -->

        <el-form-item label="入驻品牌" prop="brandId">
          <el-select v-model="company.brandId" multiple placeholder="请选择入驻品牌">
            <el-option
              v-for="item in mbgInList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span style="font-size: 12px;color: #c0c4cc;padding-left:5px;">*请务必入驻“萌百格”，否则企业无法新增供应商。</span>
        </el-form-item>
        <!-- <el-form-item label="系统版本" prop="version">
          <el-select v-model="company.version" :disabled="id ? true : false">
            <el-option :key="version.value" :label="version.label" :value="version.value" v-for="version in companyVersion"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="订单支付状态" prop="orderStatus">
          <span class="itemInput">{{filterStatus(company.orderStatus, companyOrderStatus)}}</span>
        </el-form-item>
        <el-form-item label="合同签约状态" prop="signed">
          <!-- <span class="itemInput">{{company.signed ? '已签约' : '未签约'}}</span> -->
          <span class="itemInput">已签约</span>
        </el-form-item>
        <el-form-item label="主题色" prop="systemThemeColor">
          <el-radio-group v-model="company.systemThemeColor">
            <!-- <el-radio :key="item.value" v-for="item in systemThemeColor" :label="item.value">{{item.label}}</el-radio> -->
            <el-radio label="ORANGEWHITE"><div class="orange color-box">橘白</div></el-radio>
            <el-radio label="TIFFANYWHITE"><div class="tiffany color-box">蒂芙尼白</div></el-radio>
          </el-radio-group>
        </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <div class="gt-form-bottom-submit" >
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消"/>
      <gt-button size="large" :loading="$store.state.loading.global"  @click.native="handleUpdate" txt="提交"/>
    </div>
  </section>
</template>
<script>
import { filterStatus } from '@/utils'
import gtImageUpload from '@/components/gt-image-upload'
import gtSelectLocation from '@/components/gt-select-location'
import gtMap from '@/components/gt-map'
import { companyLevel, companyType, companyStatus, industryType, systemThemeColor, companyOrderStatus, companyVersion } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { isMobile, validatenull } from '@/utils/validate'
import { locations } from '@/utils'
import { mbgEnter } from '@/service/company'
import _ from 'lodash'
export default {
  name:'company-add-or-update',
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
      mbgInList: [],
      company: {
        industryCategory: null,
        version: 'PROFESSIONAL',
        entityCategory: null,
        legalPerson: null,
        level: 1,
        phone: null,
        city: null,
        number: null,
        cityId: null,
        province: null,
        provinceId: null,
        district: null,
        districtId: null,
        address: '',
        orderStatus: 'PAID',
        storeNumber: null,
        businessLicenseCode: null,
        legalPersonIdPositivePic: null,
        legalPersonIdBackPic: null,
        serviceBeginDate: null,
        serviceEndDate: null,
        status: null,
        accountNo: null,
        accountName: null,
        accountBank: null,
        fuiouMerchantNo: null,
        statusRemark: null,
        brandFlag: null,
        systemThemeColor: 'ORANGEWHITE',
        longitude: null,//经度
        latitude: null,//纬度
      },
      location: '',
      companyLevel,
      industryType,
      companyType,
      filterStatus,
      companyVersion,
      companyOrderStatus,
      companyStatus,
      dataFormRules:{
        industryCategory: [{required: true, message: '请选择行业类别'}],
        entityCategory:[{required: true, message: '请选择实体类型'}],
        name:[{required: true, message: '请输入企业名称'}],
        legalPerson:[{required: true, message: '请输入法人'}],
        level: [{required: true, message: '请选择企业级别'}],
        companyLocation: [{required: true, validator: selectLocation, trigger: 'change' }],
        address: [{required: true, message: '请输入地址',trigger: 'change' },
          {validator: isRight, trigger: 'blur'}],
        version: [{required: true, message: '请选择企业版本号'}],
        phone: [{required: true, message: '请输入手机号'}, { validator: validatePhone, trigger: 'blur' }],
      }
    }
  },
  components: { gtImageUpload, gtSelectLocation, gtTimeRange, gtMap },

  methods: {
    // 获取品牌列表
    async getMbgInList() {
      const { data } = await mbgEnter({
        currentPage: 1,
        pageSize: 100
      })
      if (data.code === 0) {
        this.mbgInList = data.data.records
      } else {
        this.mbgInList = []
        this.$message.error(data.msg)
      }
    },
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
      console.log(JSON.stringify(this.company))
      this.$refs['company-form'].validate((valid) => {
        if (valid) {
          this.dataListLoading = true
          var local = locations(this.$refs['companyLocation'])
          if (this.id) {
            this.$easyConfirm.show({
              title: '提示',
              content: '确定提交修改内容？',
              confirm: async () => {
                await this.submitData(local)
              }
            })
          } else {
            this.submitData(local)
          }
        }else{
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    },
    async submitData(local) {
      // 创建企业
      const { data } = await this.$http({
        url: this.$http.adornUrl(`/baseinfo/mop/company/${!this.id ? 'add' : 'update'}`),
        method: 'post',
        data: this.$http.adornData({
          ...this.company,
          brandId:this.company.brandId.join(','),
          provinceId: local.provinceId || null,
          province: local.province || null,
          cityId: local.cityId || null,
          city: local.city || null,
          districtId: local.districtId || null,
          district: local.district || null,
        })
      })
      this.dataListLoading = false
      if (data.code === 0 ) {
        this.$router.push({name: 'company-company'})
      } else {
        this.$message.error(data.msg)
      }
    },
    async getCompanyInfo() {
      const { data } = await this.$http({
        url: this.$http.adornUrl(`/baseinfo/mop/company/detail/${this.id}`),
        method: 'get',
      })
      this.dataListLoading = false
      if(data.code == 0){
        this.company = {
          ...data.data,
          brandId: data.data.brandId || []
        }
        // 获取地图位置
        this.$nextTick(() => {
          const { province, city, district, address } = this.company
          this.showMap(`${province || ''}${city || ''}${district || ''}${address || ''}`, true)
        })
      }
    }
  },
  created() {
    // 获取萌百格入驻列表
    this.getMbgInList()

    const { id } = this.$route.query
    if (!id) {
      this.id = ''
    } else {
      this.id = id
      // 获取企业详情
      if(this.isAuth('mop:company:detail')){
        this.getCompanyInfo()
      }
    }
  },
}
</script>
<style lang="scss" scope>
.orange{
  background: #F48442;
}
.tiffany{
  background: #4cbbb4;
}
.color-box{
  display: inline-block;
  position: relative;
  height: 24px;
  width: 70px;
  text-align: center;
  border-radius: 3px;
  line-height: 24px;
  color: white !important;
}
.serverTime {
  .el-col.serverOne {
    width: 200px;
  }
}
.long-input{
  .el-input__inner{
    width: 360px;
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


<template>
  <section
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-card>
      <el-form :model="dataForm" ref="dataForm" :rules="dataFormRules" label-width="130px">
        <!-- 编辑时有的字段 -->
        <el-form-item label="门店编码" v-if="dataForm.id">
          <el-input v-model="dataForm.code" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="门店名称" prop="name" class="gt-input-tip">
          <el-input v-model="dataForm.name" class="storeNames" :maxlength="30" placeholder='请输入门店名称'></el-input>
        </el-form-item>
        <el-form-item label="云店名称" prop="weshopName" class="gt-input-tip">
          <el-input v-model="dataForm.weshopName"  :maxlength="30" placeholder='请输入云店名称'></el-input>
        </el-form-item>
        <el-form-item label="门店营业执照名称" prop="storeNameAcc" class="gt-input-tip">
          <el-input v-model="dataForm.storeNameAcc" class="storeNames" :maxlength="30" placeholder='请输入门店营业执照名称'><span slot="prefix" style="left: 210px;">*请输入和营业执照上一致的名称</span></el-input>
        </el-form-item>
        <el-form-item label="所属企业" prop="companyId" v-if="isAuth('mop:company:select1')">
          <el-select v-model="dataForm.companyId" filterable placeholder="请选择所属企业">
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id" :disabled="dataForm.id ? true : false">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商户号" class="gt-input-tip" prop="fuiouMerchantNo">
          <el-input v-model="dataForm.fuiouMerchantNo" :maxlength="15" :disabled="isNo"></el-input>
        </el-form-item>
        <!-- <el-form-item label="门店类型" prop="storeCategory">
          <el-radio-group v-model="dataForm.storeCategory">
            <el-radio v-for="item in storeB" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <el-form-item label="联系人" prop="linkman">
          <el-input v-model="dataForm.linkman" placeholder="请输入联系人"></el-input>
        </el-form-item>
        <el-form-item label="联系电话" prop="phone">
          <el-input v-model="dataForm.phone" placeholder="请输入联系电话" maxlength="11"></el-input>
        </el-form-item>
        <!-- <el-form-item label="小店联系电话" prop="storeLinkPhone">
          <el-input v-model="dataForm.storeLinkPhone" placeholder="请输入萌百小店联系电话" maxlength="11"></el-input>
        </el-form-item>
        <el-form-item label="营业时间" prop="openRange">
          <el-time-picker
            is-range
            v-model="dataForm.openRange"
            format="HH:mm"
            :editable="false"
            value-format="HH:mm"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            placeholder="选择时间范围">
          </el-time-picker>
        </el-form-item> -->
        <el-form-item label="加盟品牌" prop="leagueBrand">
          <el-input v-model="dataForm.leagueBrand" placeholder="请输入加盟品牌"></el-input>
        </el-form-item>
        <el-form-item label="加盟授权编码" prop="leagueAuthorizationCode">
          <el-input v-model="dataForm.leagueAuthorizationCode" placeholder="请输入加盟授权编码"></el-input>
        </el-form-item>
        <el-form-item label="门店位置" style="margin-bottom: 5px;" prop="storeLocation" class="lefts">
          <gt-select-location ref="storeLocation" :provinceId="dataForm.provinceId" :cityId="dataForm.cityId" :districtId="dataForm.districtId" />
        </el-form-item>
        <el-form-item prop="address" style="padding-top: 15px;">
          <!-- @input="showMap" -->
          <el-input style=" width: 220px;float: left" @input="showMap" class="locations" v-model="dataForm.address"  placeholder="门店具体地址详细道牌号"></el-input>
          <gt-border-button @click.native="getLan" type="select" txt="查询地址" style="cursor: pointer;float: left;margin-left: 100px;margin-top:3px;"/>
        </el-form-item>
        <el-form-item>
          <gt-map @refreshDataList = 'getObj' :width="400" :height="300" :search="location"/>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="POS1-SN码">
              <el-input v-model="dataForm.fuiouPos1SnNo" placeholder="请输入POS1-SN码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端号1">
              <el-input v-model="dataForm.fuiouPos1TermNo" placeholder="请输入终端号1"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item label="POS2-SN码">
              <el-input v-model="dataForm.fuiouPos2SnNo" placeholder="请输入POS2-SN码"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="终端号2">
              <el-input v-model="dataForm.fuiouPos2TermNo" placeholder="请输入终端号2"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="服务时间" class="gt-inline-item" required>
          <gt-time-range
            class="stores1"
            start-time-prop="serviceBeginDate"
            :start-time-value="dataForm.serviceBeginDate"
            :end-time-value="dataForm.serviceEndDate"
            end-time-prop="serviceEndDate"
            @changeStartValue="value => dataForm.serviceBeginDate = value"
            @changeEndValue="value => dataForm.serviceEndDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-row>
          <el-col :span="12">
            <el-form-item label="门店LOGO" prop="storeLogo">
              <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'storeLogo'" :names="1" :multiple="true" :max=1 :reallist="dataForm.storeLogo" :cb="value => dataForm.storeLogo = value" />
            </el-form-item>
          </el-col>
          <el-col :span="12" v-if="dataForm.liveCode" >
            <el-form-item label="门店直播分享码" prop="share" class="view-img">
              <img v-if="dataForm.liveCode" :src="'http://'+ dataForm.liveCode" alt="" @click="openImgPic('liveCode')">
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-col>
        </el-row>
        <el-form-item label="经营许可证" prop="businessLicensePic">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'businessLicensePic'" :names="2"  :multiple="true" :max=1 :reallist="dataForm.businessLicensePic" :cb="value => dataForm.businessLicensePic = value" />
        </el-form-item>
        <el-form-item label="门头照" prop="doorwayPic">
           <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'doorwayPic'" :names="3" :multiple="true" :max=1 :reallist="dataForm.doorwayPic" :cb="value => dataForm.doorwayPic = value" />
        </el-form-item>
        <el-form-item label="店内实景照" prop="innerPic">
          <gt-image-upload :names="4" :multiple="true" :max=5 :more-real="imgList" tip="（单张大小不超过5M，最多5张）"/>
        </el-form-item>
        <el-form-item label="状态设置" prop="status" v-if="dataForm.id">
          <el-radio-group v-model="dataForm.status">
            <el-radio v-for="item in storeStatus" :key="item.value" :label="item.value" >{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- 新增入驻品牌字段 -->
        <!-- <el-form-item label="入驻品牌" prop="brandFlag" v-if="dataForm.id">
          <el-radio-group v-model="dataForm.brandFlag">
            <el-radio :label="0" >无</el-radio>
            <el-radio :label="1" >妈咪全知道</el-radio>
          </el-radio-group>
        </el-form-item> -->
        <!-- <el-form-item label="备注" prop="statusRemark" v-if="dataForm.id">
          <el-input type="textarea" v-model="dataForm.statusRemark"  style="width: 300px;"></el-input>
        </el-form-item> -->
        <el-form-item label="系统版本" prop="version" required>
          <el-select v-model="dataForm.version">
            <el-option :key="version.value" :label="version.label" :value="version.value" v-for="version in companyVersion"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="星级" prop="level" >
          <el-select v-model="dataForm.level">
            <el-option :key="level.value" :label="level.label" :value="level.value" v-for="level in companyStarlevel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="毛利率" prop="rateOfMargin" v-if="dataForm.version=='MARKETING'">
           <el-input v-model="dataForm.rateOfMargin" placeholder="请输入毛利率" style="display: inline;"></el-input>&nbsp;%
        </el-form-item>
           <el-form-item label="运送方式" prop="shipType" v-if="dataForm.version=='MARKETING'">
              <el-checkbox-group  v-model="dataForm.shipType" >
                <el-checkbox v-for="item in shipTypedate" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
        </el-form-item>
        <el-form-item label="区域自定义" prop="brandArea">
          <el-input v-model="dataForm.brandArea" placeholder="请输入区域自定义"></el-input>
        </el-form-item>
        <el-form-item label="大区" prop="region">
          <el-input v-model="dataForm.region" placeholder="请输入大区"></el-input>
        </el-form-item>
        <el-form-item label="门店面积" prop="acreage">
          <el-input v-model="dataForm.acreage" placeholder="请输入门店面积" style="display: inline;"></el-input>&nbsp;平
        </el-form-item>
      </el-form>
    </el-card>

    <div class="gt-form-bottom-submit" >
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" v-if="isAuth('mop:store:update')" :loading="$store.state.loading.global" @click.native="dataFormSubmit()" txt="提交" />
    </div>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>

<script>
import gtImageUpload from '@/components/gt-image-upload'
import gtSelectLocation from '@/components/gt-select-location'
import { isphone, validatenull,isMobile,limitInputName,number,priceRange} from '@/utils/validate'
import { storeStatus, storeB, companyVersion,shipTypedate,companyStarlevel} from '@/utils/dict'
import { locations } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import gtMap from '@/components/gt-map'
import _ from 'lodash'
export default {
  name:'store-add-or-update',
  components: { gtImageUpload, gtSelectLocation, gtTimeRange, gtMap},
  data () {
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }

    const selectLocation = (rule,value,callback) =>{
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

    const validateOpenRange = (rule,value,callback) => {
      if (!value) {
        return callback(new Error('请选择营业时间'))
      } else if(validatenull(value[0])&&validatenull(value[1])){
        return callback(new Error('请选择营业时间'))
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
    const isNumber =(rule,value,callback)=>{
      if (!priceRange(value, 100, 0)) {
        callback(new Error('请输入0-100数字，最多保留小数点后两位'))
      } else {
        callback()
      }
    }
    const acreageNumber = (rule,value,callback) => {
      if (this.dataForm.acreage) {
        if(!(/^\+?[1-9][0-9]*$/.test((this.dataForm.acreage)))){
          return callback('请输入正整数')
        }else if(this.dataForm.acreage > 2000){
          return callback('请输入小于等于2000的正整数')
        }else{
          return callback()
        } 
      }else{
        return callback()
      }
    }
    return {
      shipTypedate,
      isNo: false,
      imgList:[], //暂存图
      storeStatus,
      storeB,
      loading: false,
      location: '',
      companyList:[],
      pageC: 1,
      pageZ: 1000,
      defaultValue: null,
      companyVersion,
      companyStarlevel,
      dataForm: {
        shipType:[''],
        id: 0,
        name: null,
        storeNameAcc: null,
        storeCategory:null,
        status:null,
        companyId: null,
        phone:null,
        version: 'PROFESSIONAL',
        level:'',
        // storeLinkPhone: null,
        linkman:null,
        businessLicensePic: null,
        doorwayPic: null,
        innerPic: null,
        qrCode: null,
        // openRange: ['', ''],
        serviceBeginDate:null,
        serviceEndDate:null,
        statusRemark:null,
        province:null,
        city:null,
        district:null,
        provinceId:null,
        cityId:null,
        districtId:null,
        address: '',
        fuiouPos1SnNo: null,
        fuiouPos1TermNo: null,
        fuiouPos2SnNo: null,
        fuiouPos2TermNo: null,
        brandFlag: 0,
        longitude: null,
        latitude: null
      },
      showImgPic:null,
      dataFormRules:{
        shipType:[{required: true, message: '请输入运送方式', trigger: 'change'}],
        weshopName:[{required: true, message: '请输入云店名称', trigger: 'change'}],
        name:[{required: true, message: '请输入门店名称', trigger: 'change'}],
        storeNameAcc:[{required: true, message: '请输入门店营业执照名称', trigger: 'change'}],
        storeCategory:[{required: true, message: '请选择门店类别', trigger: 'change'}],
        companyId:[{required: true, message: '请选择所属企业', trigger: 'change'}],
        linkman:[{required: true, message: '请输入联系人', trigger: 'change'}],
        phone:[{required: true, message: '请输入联系电话', trigger: 'change'},
          {validator: isasync, trigger: 'blur'}],
        // storeLinkPhone:[{required: true, message: '请输入萌百小店联系电话', trigger: 'change'},
        //   {validator: isphone, trigger: 'blur'}],
        storeLocation: [{required: true, validator: selectLocation, trigger: 'change' }],
        address: [{required: true, message: '请输入地址',trigger: 'change' },
          {validator: isRight, trigger: 'blur'}],
        status:[ {required: true, message: '请选择门店状态', trigger: 'change'}],
        serviceBeginDate:[{ required: true, message: '请选择服务日期(起)'}],
        serviceEndDate:[{ required: true, message: '请选择服务日期(止)'}],
        statusRemark: [{validator: validateRemark, trigger: 'blur' }],
        brandFlag: [{required: true, message: '请选择入驻品牌', trigger: 'change'}],
        // openRange: [{required: true, validator: validateOpenRange,  trigger: 'change'}]
        acreage:[{validator: acreageNumber,trigger:'blur'}],
        rateOfMargin: [{required: true, validator: isNumber, trigger: 'change'}]
      }
    }
  },
  watch: {

  },
  mounted(){
    this.$nextTick(()=>{

    })
  },
  created(){
    this.dataForm.id = this.$route.query.id || ''
    if(this.isAuth('mop:store:detail')){
      this.init(this.dataForm.id)
    }
    if(this.isAuth('mop:company:select1')){
      this.selectCompany()
    }
  },
  methods: {
    // changePhone(val) {
    //   debugger
    //   // storeLinkPhone
    //   if (value!=this.dataForm.storeLinkPhone) {
    //     this.dataForm.storeLinkPhone = this.dataForm.storeLinkPhone
    //   }else{
    //     this.dataForm.storeLinkPhone = val
    //   }
    // },



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
    // 所选企业
    selectCompany(){
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageZ,
          currentPage: this.pageC,
        })
      }).then(({data}) => {
        if(data && data.code === 0) {
          this.companyList = data.data.records
        }else{
          this.companyList = []
        }
      })
    },
    init (id) {
      if (id) {
        this.$http({
          url: this.$http.adornUrl('/baseinfo/mop/store/detail/'+id),
          method: 'get',
          params: this.$http.adornParams()
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.dataForm = {
              ...this.dataForm,
              ...data.data,
              shipType:[]
            }
            if(this.dataForm.fuiouMerchantNo){
              this.isNo = true
            }else{
              this.isNo = false
            }
            if(data.data.innerPic){
              this.imgList = JSON.parse(this.dataForm.innerPic)
            }
            // 绑定营业时间
            // if (data.data.openHours && data.data.closeHours) {
            //   this.dataForm.openRange = [data.data.openHours, data.data.closeHours]
            // }
            // 获取地图位置
            this.$nextTick(() => {
              const { province, city, district, address } = this.dataForm
              this.showMap(`${province || ''}${city || ''}${district || ''}${address || ''}`, true)
            })
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      this.getLan()
      console.log(JSON.stringify(this.dataForm))
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.loading = true
          var local = locations(this.$refs['storeLocation'])
          this.$http({
            url: this.$http.adornUrl(`/baseinfo/mop/store/${!this.dataForm.id ? 'add' : 'update'}`),
            method: 'post',
            data: this.$http.adornData({
              ...this.dataForm,
              shipType:this.dataForm.shipType.join(","),
              rateOfMargin:Number(this.dataForm.rateOfMargin),
              acreage:this.dataForm.acreage ? this.dataForm.acreage : 0,
              fuiouMerchantNo: _.trim(this.dataForm.fuiouMerchantNo),
              // openHours: this.dataForm.openRange[0] || '',
              // closeHours: this.dataForm.openRange[1] || '',
              provinceId: local.provinceId || null,
              province: local.province || null,
              cityId: local.cityId || null,
              city: local.city || null,
              districtId: local.districtId || null,
              district: local.district || null,
              innerPic: JSON.stringify(this.imgList) || null,
            })
          }).then(({data}) => {
            this.loading = false
            if (data && data.code === 0) {
              this.$router.push({name:'store-store'})
            } else {
              this.$message.error(data.msg)
            }
          })
        }else{
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
.el-form-item__content{
  .el-date-editor.el-input__inner{
    padding-bottom: 0;
    padding-top: 0;
    height: 33px;
    line-height: 33px;
    .el-range-separator{
      width: 10%;
    }
  }
}

.serverTime {
  .el-col.serverOne {
    width: 200px;
  }
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
.el-picker-panel__footer {
  .el-button--text {
    display: none!important;
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

<template>
<el-dialog
  :title="type === 'view' ? '查看' : (type === 'edit' ? '修改账户' : '创建账户')"
  :close-on-click-modal="false"
  :visible.sync="visible"
  v-if="visible"
  class="company-distribute-modal"
  width="80%"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
    <el-row>
      <el-form-item class="id-form-item" label="身份证号" prop="certifId">
        <el-input v-if="type === 'create'" placeholder="请输入身份证号" v-model="dataForm.certifId" @blur="getIdCard">
        </el-input>
        <span v-else class="itemInput">{{dataForm.certifId}}</span>
        <el-button v-if="type === 'create' && hasInfo" class="sync-button" @click="syncInfo">一键同步</el-button>
      </el-form-item>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="手机号" prop="mobileNo">
          <el-input v-if="type === 'create' && !useCopy" placeholder="请输入手机号"  v-model="dataForm.mobileNo"></el-input>
          <span v-else class="itemInput">{{dataForm.mobileNo}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12" class="vercode-form-item" v-show="useCopy && type === 'create'">
        <el-form-item  label="验证码" prop="verificationCode">
					<el-input v-model="dataForm.verificationCode" type="text" placeholder="验证码"></el-input>
          <gt-get-varcode :phone="dataForm.mobileNo" />
				</el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="12">
        <el-form-item label="银行" prop="parentBankId">
          <el-select v-if="type === 'create'  && !useCopy" placeholder="请选择银行" v-model="dataForm.parentBankId">
            <el-option :label="item.bankName" :value="item.bankId" :key="item.bankId" v-for="item in bankList"></el-option>
          </el-select>
          <span v-else class="itemInput">{{dataForm.bankNm}}</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="开户人姓名" prop="artifNm">
          <el-input v-if="type === 'create'  && !useCopy" placeholder="请输入开户人姓名" v-model="dataForm.artifNm"></el-input>
          <span v-else class="itemInput">{{dataForm.artifNm}}</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="银行卡号" prop="capAcntNo">
      <el-input v-if="type === 'create'  && !useCopy" placeholder="请输入银行卡号" v-model="dataForm.capAcntNo"></el-input>
      <span v-else class="itemInput">{{dataForm.capAcntNo}}</span>
    </el-form-item>
    <el-form-item label="开户所在地" prop="bankAddress">
      <span v-if="type === 'create'  && !useCopy" >
        <gt-fuyou-location ref="bankAddress" v-if="refresh" :provinceId="dataForm.provinceId" :cityId="dataForm.cityId" :districtId="dataForm.districtId"/>
      </span>
      <span v-else class="itemInput">{{`${dataForm.province}-${dataForm.city}-${dataForm.district}`}}</span>
    </el-form-item>
    <el-row>
      <el-col :span="12">
        <el-form-item label="身份证正面照片" v-if="type === 'create'  && !useCopy" prop="accessory1">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'accessory1'" :names="1" :multiple="true" :max=1 :reallist="dataForm.accessory1" :cb="value => dataForm.accessory1 = value" />
        </el-form-item>
        <el-form-item label="身份证正面照片" class="view-img" v-else>
          <img :src="`${dataForm.accessory1}`" alt="身份证正面照片" v-if='dataForm.accessory1'>
          <span v-else class="itemInput">--</span>
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证反面照片" v-if="type === 'create'  && !useCopy" prop="accessory2">
          <gt-image-upload v-if="refresh" @updatePicUrl="updatePicUrl" :realistStr="'accessory2'" :names="2" :multiple="true" :max=1 :reallist="dataForm.accessory2" :cb="value => dataForm.accessory2 = value" />
        </el-form-item>
        <el-form-item label="身份证反面照片" class="view-img" v-else>
          <img :src="`${dataForm.accessory2}`" alt="身份证反面照片" v-if='dataForm.accessory2'>
          <span v-else class="itemInput">--</span>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="绑定门店" prop="bindStoreRange">
      <span v-if="type === 'create' || type === 'edit'">
        <el-checkbox-group v-if="storeList && storeList.length > 0" v-model="dataForm.bindStoreRange">
          <el-checkbox :label="`${item.storeId}`" :key="item.storeId" v-for="item in storeList">{{item.storeName}}</el-checkbox>
        </el-checkbox-group>
        <span v-else class="itemInput">无门店可以绑定，请先创建门店或修改其他账户</span>
      </span>
      <span v-else class="itemInput">{{dataForm.bindStoreRangeName}}</span>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button v-if="type === 'create' || type === 'edit'" @click="visible = false">取消</el-button>
    <el-button v-if="type === 'create' || type === 'edit'" type="primary" v-loading="submitLoading" @click="dataFormSubmit()">确定</el-button>
    <el-button v-if="type === 'view'" type="primary" @click="visible = false">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { isMobile, validatenull, isIdentify, limitInputName,isURL } from '@/utils/validate'
import gtImageUpload from '@/components/gt-image-upload'
import gtFuyouLocation from '@/components/gt-fuyou-location'
import { locations } from '@/utils'
import gtGetVarcode from '@/components/gt-getvarcode'
export default {
  data () {
    const validateIdentify = (rule, value, callback) => {
      if (!isIdentify(value)) {
        callback(new Error('请输入正确的身份证号'))
      } else {
        callback()
      }
    }

    const validatePhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }

    const validateName = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('开户人姓名不能超过30个汉字'))
      } else{
        callback()
      }
    }

    const validCode = (rule, value, callback) => {
      if (this.useCopy && this.type === 'create') {
        if (!value) {
          callback(new Error('请输入验证码！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateCard = (rule, value, callback) => {
      if (!/^\d+$/.test(value)) {
        callback(new Error('只能输入数字！'))
      } else if (value.length > 30) {
        callback(new Error('银行卡号不能超过30个数字！'))
      }else{
        callback()
      }
    }

    const selectLocation = (rule,value,callback) =>{
      if (this.type === 'create' && !this.useCopy) {
        if(validatenull(this.$refs['bankAddress'].province)){
          $('.lefts .el-form-item__error1').remove()
          return callback(new Error('请先选择省份'))
        }else if(validatenull(this.$refs['bankAddress'].city)){
          $('.lefts .el-form-item__error1').remove()
          $('.lefts .el-form-item__content').append('<div class="el-form-item__error1">请先选择市</div>')
          $('.lefts .el-form-item__error1').css('left',210)
          return callback(new Error('.'))
        }else if(validatenull(this.$refs['bankAddress'].district)){
          $('.lefts .el-form-item__error1').remove()
          $('.lefts .el-form-item__error').css('left', 420)
          return callback(new Error('请先选择区/县'))
        }else{
          return callback()
        }
      } else
      {
        callback()
      }
    }
    return {
      visible: false,
      storeList: [],
      bankList: [],
      type: 'view',
      companyId: null,
      submitLoading: false,
      useCopy: false,
      hasInfo: false,
      refresh: true, // 刷新组件
      dataForm: {
        id: null,
        accountId: null,
        certifId: null,
        mobileNo: null,
        artifNm: null,
        parentBankId: null,
        capAcntNo: null,
        province: null,
        provinceId: null,
        city: null,
        cityId: null,
        district: null,
        districtId: null,
        accessory1: null,
        accessory2: null,
        bindStoreRange: []
      },
      dataRule: {
        certifId: [{ required: true, message: '身份证号不能为空'}, { validator: validateIdentify, trigger: 'blur' }],
        mobileNo: [{required: true, message: '手机号不能为空'}, { validator: validatePhone, trigger: 'blur' }],
        parentBankId: [{required: true, message: '银行不能为空', trigger: 'change'}],
        artifNm: [{required: true, message: '开户人姓名不能为空'}, { validator: validateName, trigger: 'blur' }],
        capAcntNo: [{required: true, message: '银行卡号不能为空'}, { validator: validateCard, trigger: 'blur' }],
        accessory1: [{required: true, message: '身份证正面照片'}],
        accessory2: [{required: true, message: '身份证反面照片'}],
        bankAddress: [{required: true, validator: selectLocation, trigger: 'change' }],
        bindStoreRange: [{required: true, message: '绑定门店不能为空'}],
        verificationCode: [{required: true, validator: validCode, message: '验证码不能为空'}]
      }
    }
  },
  components: {
    gtImageUpload,
    gtFuyouLocation,
    gtGetVarcode
  },
  methods: {
    updatePicUrl:function(imgoBJ){
      this.dataForm[imgoBJ.str] = imgoBJ.value
    },
    //图片展示
    openImgPic:function(str){
      this.showImgPic = 'http://'+this.dataForm[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    refreshData(id, certifId = null) {
      this.useCopy = false
      this.hasInfo = false
      this.refresh = false
      this.dataForm = {
        id: id,
        accountId: null,
        certifId: certifId,
        mobileNo: null,
        artifNm: null,
        parentBankId: null,
        capAcntNo: null,
        province: null,
        provinceId: null,
        city: null,
        cityId: null,
        district: null,
        districtId: null,
        accessory1: null,
        accessory2: null,
        bindStoreRange: []
      }
      this.$nextTick(() => {
        this.refresh = true

      })
    },


    async init (type, id, companyId) {
      this.visible = true
      this.refreshData(id)
      this.companyId = companyId
      this.type = type || 'view'
      this.submitLoading = false

      // 获取银行列表
      this.getBankList()
      await this.detail()
      // 获取门店列表
      await this.getStoreList()
    },
    async detail(){
      if (this.dataForm.id) {
        const { data } = await this.$http({
          url: this.$http.adornUrl('/baseinfo/mop/company/userAccount/detail'),
          method: 'get',
          params: this.$http.adornParams({
            id: this.dataForm.id
          })
        })
        if (data && data.code === 0) {
          const bindStoreRange = data.data.bindStoreRange.split(',')
          this.dataForm = {
            ...data.data,
            accessory1: isURL(data.data.accessory1)?data.data.accessory1:('https://'+data.data.accessory1),
            accessory2: isURL(data.data.accessory2)?data.data.accessory2:('https://'+data.data.accessory2),
            bindStoreRange
          }
        } else {

          this.$message.error(data.msg)
        }
      }
    },

    // 获取银行列表
    async getBankList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/subaccount/bank', false, 'fuyou'),
        method: 'get',
        params: this.$http.adornParams({
          bankType: 1
        })
      })
      if (data.code === '0000') {
        this.bankList = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/userAccount/bindStoreRange'),
        method: 'get',
        params: this.$http.adornParams({
          companyId: this.companyId,
          accountId: this.dataForm.accountId
        })
      })
      if (data && data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error(data.msg)
      }

    },


    // 获取身份证件
    getIdCard() {
      this.$refs['dataForm'].validateField('certifId', async (errorMessage) => {
        if (!errorMessage) {
          const { data } = await this.$http({
            url: this.$http.adornUrl('/subaccount/queryAddUser', false, 'fuyou'),
            method: 'get',
            params: this.$http.adornParams({
              certifId: this.dataForm.certifId,
            })
          })
          if (data.code === '0000') {
            if (data.data) {
              this.hasInfo = true

              this.copyInfo = {
                ...data.data,
                accountId: data.data.userId
              }
            } else {
              this.refreshData(this.dataForm.id, this.dataForm.certifId)
            }
          } else {
            this.refreshData(this.dataForm.id,  this.dataForm.certifId)
            this.$refs['dataForm'].clearValidate()
            this.$message.error(data.msg)
          }
        }
        else {
          this.refreshData(this.dataForm.id,  this.dataForm.certifId)
        }
      })

    },

    syncInfo() {
      delete this.copyInfo.userId
      this.useCopy = true
      this.dataForm = {
        ...this.dataForm,
        ...this.copyInfo,
        accessory1: isURL(this.copyInfo.accessory1)?this.copyInfo.accessory1:('https://'+this.copyInfo.accessory1),
        accessory2: isURL(this.copyInfo.accessory2)?this.copyInfo.accessory2:('https://'+this.copyInfo.accessory2)
      }
      console.log(this.copyInfo)
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      // 查询可以绑定门店
      this.getStoreList()
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          let local = {}
          if (this.type === 'create' && !this.useCopy) {
            local = locations(this.$refs['bankAddress'], 'cityId', 'cityName')
          }
          const bindStoreRangeName = this.dataForm.bindStoreRange.map(storeId => {
            const item = this.storeList.find(store => store.storeId == storeId)
            return item ? item.storeName : ''
          })
          const bank = this.bankList.find(item => item.bankId === this.dataForm.parentBankId)
          const { data } = await this.$http({
            url: this.$http.adornUrl(`/baseinfo/mop/company/userAccount/${this.dataForm.id ? 'modify' : 'addUserAccount'}`),
            method: 'post',
            data: this.$http.adornData({
              ...this.dataForm,
              companyId: this.companyId,
              bankNm: bank ? bank.bankName : '',
              bindStoreRange: this.dataForm.bindStoreRange.join(','),
              bindStoreRangeName: bindStoreRangeName.join(','),
              provinceId: this.dataForm.provinceId ? this.dataForm.provinceId : local.provinceId,
              province: this.dataForm.province ? this.dataForm.province : local.province,
              cityId: this.dataForm.cityId ? this.dataForm.cityId : local.cityId,
              city: this.dataForm.city  ? this.dataForm.city : local.city,
              districtId: this.dataForm.districtId ? this.dataForm.districtId : local.districtId,
              district: this.dataForm.district ? this.dataForm.district : local.district,
            })
          })
          this.submitLoading = false
          if (data && data.code === 0) {
            this.visible = false
            this.$emit('refreshData')
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
.company-distribute-modal{
  .el-checkbox{
    margin-right: 30px;
    margin-left: 0;
  }
  .el-button{
    .el-loading-spinner{
      top: 70%;
      .circular{
        width: 30px;
        height: 30px;
      }
    }
  }
  .id-form-item{
    .el-input{
      width: 200px;
    }
  }
  .vercode-form-item{
    .el-input{
      width: 120px;
      .el-input__inner{
        width: 120px;
      }
    }
  }
  .gt-getvarcode{
    display: inline-block;
    .commenButton{
      border-radius: 5px;
    }
  }
  .sync-button{
    height: 33px;
    line-height: 33px;
    padding: 0 10px !important;
    margin-top: 2px;
  }
}
</style>

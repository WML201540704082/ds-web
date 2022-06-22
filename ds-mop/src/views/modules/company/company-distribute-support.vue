<template>
<el-dialog
  title="账户进件"
  :close-on-click-modal="false"
  :visible.sync="visible"
  class="company-distribute-modal"
  width="80%"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="110px">
    <gt-subtitle title="基本信息"/>
    <el-row>
      <el-col :span="8">
        <el-form-item label="商品名称" prop="commercialName">
          <el-input placeholder="请输入身份证号" v-model="dataForm.commercialName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="商户简称" prop="commercialNickName">
          <el-input placeholder="请输入手机号"  v-model="dataForm.commercialNickName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="商户真实名称" prop="commercialRealName">
      <el-input placeholder="请输入商户真实名称" v-model="dataForm.commercialRealName"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="证件类型" prop="certifyType">
          <el-select v-model="dataForm.certifyType">
            <el-option value="">请选择</el-option>
            <el-option value="certifyId">身份证</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件号码" prop="certifyNo">
          <el-input placeholder="请输入证件号"  v-model="dataForm.certifyNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="证件到期日" prop="certifyNo">
          <el-input placeholder="请输入证件号"  v-model="dataForm.certifyNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="法人身份证号" prop="personCid">
          <el-input placeholder="请输入证件号"  v-model="dataForm.certifyNo"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人身份证号到期日期" prop="">
          <el-input placeholder="请输入证件号"  v-model="dataForm.certifyNo"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="联系人姓名" prop="contactName">
          <el-input placeholder="请输入联系人姓名"  v-model="dataForm.contactName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系电话" prop="">
          <el-input placeholder="请输入联系电话"  v-model="dataForm.contactPhone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="客服电话" prop="contactName">
          <el-input placeholder="请输入客服电话"  v-model="dataForm.contactName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="联系邮箱" prop="">
          <el-input placeholder="请输入联系邮箱"  v-model="dataForm.contactPhone"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="经营范围代码" prop="contactName">
          <el-input placeholder="请输入客服电话"  v-model="dataForm.contactName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="省市区" prop="">
           <gt-fuyou-location ref="bankAddress" :provinceId="dataForm.provinceId" :cityId="dataForm.cityId" :districtId="dataForm.districtId"/>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="入账卡类型" prop="cardType">
          <el-select v-model="dataForm.certifyType">
            <el-option value="private">对私</el-option>
            <el-option value="public">对公</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="支行信息" prop="">
          <el-select v-model="dataForm.certifyType">
            <el-option value="">请选择</el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="银行卡账号" prop="cardType">
          <el-select v-model="dataForm.certifyType">
            <el-option value="private">对私</el-option>
            <el-option value="public">对公</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="法人姓名" prop="">
          <el-select v-model="dataForm.certifyType">
            <el-option value="">请选择</el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="8">
        <el-form-item label="入账" prop="cardType">
          <el-radio-group v-modal="">
            <el-radio label="">法人入账</el-radio>
            <el-radio label="">非法人入账</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入账人身份证号" prop="">
          <el-input placeholder="请输入入账人身份证号"  v-model="dataForm.contactName"></el-input>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="入账证件到期日" prop="">
          <el-input placeholder="请输入入账人身份证号"  v-model="dataForm.contactName"></el-input>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="联系地址" prop="">
      <el-input placeholder="请输入入账人身份证号"  v-model="dataForm.contactName"></el-input>
    </el-form-item>
    <el-row>
      <el-col :span="8">
        <el-form-item label="收单商户类型码" prop="cardType">
          <el-select v-model="dataForm.certifyType">
            <el-option value="private">对私</el-option>
            <el-option value="public">对公</el-option>
          </el-select>
        </el-form-item>
      </el-col>
      <el-col :span="8">
        <el-form-item label="合同编号" prop="">
          <el-select v-model="dataForm.certifyType">
            <el-option value="">请选择</el-option>
          </el-select>
        </el-form-item>
      </el-col>
    </el-row>
    <el-form-item label="联系人身份证" prop="">
      <el-select v-model="dataForm.certifyType">
        <el-option value="">请选择</el-option>
      </el-select>
    </el-form-item>



    <gt-subtitle title="证件图片"/>
    <el-row>
      <el-col :span="12">
        <el-form-item label="身份证正面照片" prop="accessory1">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'accessory1'" :names="1" :multiple="true" :max=1 :reallist="dataForm.accessory1" :cb="value => dataForm.accessory1 = value" />
        </el-form-item>
      </el-col>
      <el-col :span="12">
        <el-form-item label="身份证反面照片" prop="accessory2">
          <gt-image-upload @updatePicUrl="updatePicUrl" :realistStr="'accessory2'" :names="2" :multiple="true" :max=1 :reallist="dataForm.accessory2" :cb="value => dataForm.accessory2 = value" />
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
      <span v-else class="itemInput">{{dataForm.bindStoreRange.join(',')}}</span>
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
import { isMobile, validatenull, isIdentify, limitInputName } from '@/utils/validate'
import gtImageUpload from '@/components/gt-image-upload'
import gtFuyouLocation from '@/components/gt-fuyou-location'
import { locations } from '@/utils'
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
      if (this.type === 'create') {
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
        bindStoreRange: [{required: true, message: '绑定门店不能为空'}]
      }
    }
  },
  components: {
    gtImageUpload, gtFuyouLocation
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
    async init (id, companyId) {
      this.visible = true
      this.dataForm = {
        id: id,
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
      this.companyId = companyId
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

    // 表单提交
    dataFormSubmit () {
      this.$refs['dataForm'].validate(async (valid) => {
        if (valid) {
          this.submitLoading = true
          let local = {}
          if (this.type === 'create') {
            local = locations(this.$refs['bankAddress'], 'cityId', 'cityName')
          }
          const bank = this.bankList.find(item => item.bankId === this.dataForm.parentBankId)
          const { data } = await this.$http({
            url: this.$http.adornUrl(`/baseinfo/mop/company/userAccount/${this.dataForm.id ? 'modify' : 'addUserAccount'}`),
            method: 'post',
            data: this.$http.adornData({
              ...this.dataForm,
              companyId: this.companyId,
              bankNm: bank ? bank.bankName : '',
              bindStoreRange: this.dataForm.bindStoreRange.join(','),
              provinceId: this.dataForm.id ? this.dataForm.provinceId : local.provinceId,
              province: this.dataForm.id ? this.dataForm.province : local.province,
              cityId: this.dataForm.id ? this.dataForm.cityId : local.cityId,
              city: this.dataForm.id ? this.dataForm.city : local.city,
              districtId: this.dataForm.id ? this.dataForm.districtId : local.districtId,
              district: this.dataForm.id ? this.dataForm.district : local.district,
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

}
</style>

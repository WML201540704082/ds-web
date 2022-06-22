<template>
  <section v-loading="$store.state.loading.global">
    <el-card>
      <el-row>
        <el-form label-width="135px" :model="company">
          <el-form-item label="行业类别">
            <span class="itemInput">{{filterStatus(company.industryCategory, industryType)}}</span>
          </el-form-item>
          <el-form-item label="实体类别">
            <span class="itemInput">{{filterStatus(company.entityCategory, companyType)}}</span>
          </el-form-item>
          <el-form-item label="企业名称">
            <span class="itemInput">{{company.name}}</span>
          </el-form-item>
          <!-- <el-form-item label="商户号">
            <span class="itemInput">{{company.fuiouMerchantNo || '--'}}</span>
          </el-form-item> -->
          <el-form-item label="法人">
            <span class="itemInput">{{company.legalPerson}}</span>
          </el-form-item>
          <el-form-item label="联系电话">
            <span class="itemInput">{{company.phone}}</span>
          </el-form-item>
          <el-form-item label="企业级别">
            <span class="itemInput">{{filterStatus(company.level, companyLevel)}}</span>
          </el-form-item>
          <el-form-item label="企业状态">
            <span class="itemInput" :class="filterColor(filterStatus(company.status, companyStatus))">{{filterStatus(company.status, companyStatus)}}</span>
          </el-form-item>
          <el-form-item label="营业执照编号">
            <span class="itemInput">{{company.businessLicenseCode}}</span>
          </el-form-item>
          <el-form-item label="门店数量">
            <span class="itemInput">{{company.storeNumber}}</span>
          </el-form-item>
          <el-form-item label="企业地址">
            <span class="itemInput">{{`${company.province || ''}${company.city || ''}${company.district || ''}${company.address || ''}` || '--'}}</span>
          </el-form-item>
          <el-form-item label="服务时间" class="serverTime">
            <span class="itemInput">{{company.serviceBeginDate || '-'}}<span v-if="company.serviceBeginDate!=null && company.serviceEndDate!=null"> 至 </span>{{company.serviceEndDate || '-'}}</span>
          </el-form-item>
          <el-row>
            <el-col :span="12">
              <el-form-item label="营业执照" class="view-img">
                <img :src="`https://${company.businessLicensePic}`" alt="营业执照" @click="openImgPic('businessLicensePic')" v-if='company.businessLicensePic'>
                <span v-else class="itemInput">--</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="企业LOGO" class="view-img">
                <img :src="`https://${company.companyLogo}`" alt="企业LOGO" @click="openImgPic('companyLogo')" v-if='company.businessLicensePic'>
                <span v-else class="itemInput">--</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="法人身份证(正面)" class="view-img">
                <img :src="`https://${company.legalPersonIdPositivePic}`" alt="法人身份证正面" @click="openImgPic('legalPersonIdPositivePic')"   v-if='company.legalPersonIdPositivePic'>
                <span v-else class="itemInput">--</span>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="法人身份证(反面)" class="view-img">
                <img :src="`https://${company.legalPersonIdBackPic}`" alt="法人身份证反面" @click="openImgPic('legalPersonIdBackPic')" v-if='company.legalPersonIdBackPic'>
                <span v-else class="itemInput">--</span>
              </el-form-item>
            </el-col>
          </el-row>
          <el-form-item label="手持身份证" class="view-img">
            <img :src="`https://${company.handIdCardPic}`" alt="法人身份证正面" @click="openImgPic('handIdCardPic')"   v-if='company.handIdCardPic'>
            <span v-else class="itemInput">--</span>
          </el-form-item>
          <el-form-item label="提现账户">
            <span class="itemInput">{{company.accountNo || '--'}}</span>
          </el-form-item>

          <el-form-item label="开户名">
            <span class="itemInput">{{company.accountName || '--'}}</span>
          </el-form-item>

          <el-form-item label="开户银行">
            <span class="itemInput">{{company.accountBank || '--'}}</span>
          </el-form-item>
          <el-form-item label="收款账户" class="view-img">
            <img :src="`https://${company.accountPic}`" alt="收款账户" @click="openImgPic('accountPic')" v-if='company.accountPic'>
            <span v-else class="itemInput">--</span>
          </el-form-item>
          <el-form-item label="入驻品牌" prop="brandId">
            <span class="itemInput">{{company.brandName}}</span>
          </el-form-item>
          <!-- <el-form-item label="系统版本" prop="version">
            <span class="itemInput">{{company.version ? filterStatus(company.version, companyVersion) : '专业版'}}</span>
          </el-form-item> -->
          <el-form-item label="订单支付状态" prop="orderStatus">
            <span class="itemInput">{{filterStatus(company.orderStatus, companyOrderStatus)}}</span>
          </el-form-item>
          <el-form-item label="合同签约状态" prop="signed">
            <!-- <span class="itemInput">{{company.signed ? '已签约' : '未签约'}}</span> -->
            <span class="itemInput">已签约</span>
          </el-form-item>
          <el-form-item label="主题色" >
            <div v-if="company.systemThemeColor === 'ORANGEWHITE'" class="orange color-box">橘白</div>
            <div v-if="company.systemThemeColor === 'TIFFANYWHITE'" class="tiffany color-box">蒂芙尼白</div>
          </el-form-item>
        </el-form>
      </el-row>
    </el-card>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import { filterStatus, filterColor } from '@/utils'
import { companyLevel, companyType, companyStatus, industryType, companyOrderStatus, companyVersion } from '@/utils/dict'
import { mbgEnter } from '@/service/company'
export default {
  name:'company-view',
  data() {
    return {
      mbgInList:[],
      company: {
        industryCategory: null,
        entityCategory: null,
        legalPerson: null,
        level: null,
        phone: null,
        city: null,
        province: null,
        district: null,
        address: null,
        businessLicenseCode: null,
        businessLicensePic: null,
        legalPersonIdPic: null,
        legalPersonIdPositivePic: null,
        legalPersonIdBackPic: null,
        serviceBeginDate: null,
        serviceEndDate: null,
        accountPic: null
      },
      filterStatus,
      filterColor,
      companyVersion,
      companyOrderStatus,
      companyLevel,
      industryType,
      companyType,
      companyStatus,
      showImgPic:null
    }
  },
  async created() {
    // 获取萌百格入驻列表
    await this.getMbgInList()

    const { id } = this.$route.query
    if(this.isAuth('mop:company:detail')){
      const { data } = await this.$http({
        url: this.$http.adornUrl(`/baseinfo/mop/company/detail/${id}`),
        method: 'get',
      })
      if(data.code == 0){
        this.company = data.data
        // const brandName = this.mbgInList.filter(item => this.company.brandId.indexOf(item.id)  != -1).map(ele=> ele.name).join(',')
        let brandNames = []
        this.mbgInList.forEach(item => {
          if (this.company && this.company.brandId) {
            if (this.company.brandId.indexOf(item.id) != -1) {
              brandNames.push(item.name)
            }
          }
        })
        this.company.brandName = brandNames.join(',')
      }
    }

  },
  methods:{
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
    //图片展示
    openImgPic:function(str){
      this.showImgPic = 'http://'+this.company[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
  }
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
</style>


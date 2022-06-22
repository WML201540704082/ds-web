<template>
  <section v-loading="$store.state.loading.global">
    <div class="top">
      <div class="left">
        <el-card>
          <gt-subtitle title="合同基本信息" style="display: block;"/>
          <el-form label-width="135px" :model="company">
            <el-form-item label="合同编号">
              <span class="itemInput">{{company.contractNo}}</span>
            </el-form-item>
            <el-form-item label="订单编号">
              <span class="itemInput">{{company.name}}</span>
            </el-form-item>
            <el-form-item label="签约城市">
              <span class="itemInput">{{company.signCity}}</span>
            </el-form-item>
            <el-form-item label="签约/下单时间" class="serverTime">
              <span class="itemInput">{{company.signDate || '--'}} </span>
            </el-form-item>
            <el-form-item label="销售姓名">
              <span class="itemInput">{{company.salerName}}</span>
            </el-form-item>
            <el-form-item label="企业名称">
              <span class="itemInput">{{company.enterpriseName || '--'}}</span>
            </el-form-item>
            <el-form-item label="服务项目">
              <span class="itemInput">{{company.phone}}</span>
            </el-form-item>
            <el-form-item label="收货地址">
              <span class="itemInput">{{`${company.province || ''}${company.city || ''}${company.district || ''}${company.address || ''}` || '--'}}</span>
            </el-form-item>
            <el-form-item label="合同金额">
              <span class="itemInput">{{company.contractMoney}}</span>
            </el-form-item>
            <el-form-item label="优惠类型">
              <span class="itemInput">{{company.discountType === 'DISCOUNT_TYPE_1' ? '类型1' : '类型2'}}</span>
            </el-form-item>
            <el-form-item label="优惠金额">
              <span class="itemInput">{{company.discountMoney || '--'}}</span>
            </el-form-item>
            <el-form-item label="实付金额">
              <span class="itemInput" :class="filterColor(filterStatus(company.status, companyStatus))">{{filterStatus(company.status, companyStatus)}}</span>
            </el-form-item>
            <el-form-item label="支付方式">
              <span class="itemInput">{{company.payWay === 'ALIPAY' ? '支付宝' :
                                        company.payWay === 'WECHAT' ? '微信' :
                                        company.payWay === 'CASH' ? '现金' :
                                        company.payWay === 'CARD' ? '储蓄卡' :'其他'}}</span>
            </el-form-item>
            <el-form-item label="合同/订单状态">
              <span class="itemInput">{{company.state === 'DRAFT' ? '草稿' :
                                        company.state === 'UN_AUDIT' ? '未审核' :
                                        company.state === 'APPROVAL' ? '审核通过' :'驳回'}}</span>
            </el-form-item>
            <el-form-item label="合同" class="view-img">
              <img :src="`https://${company.contractPicture}`" alt="合同上传图片" @click="openImgPic('contractPicture')"   v-if='company.contractPicture'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="收款凭证" class="view-img">
              <img :src="`https://${company.actualReceiptPicture}`" alt="收款凭证图片" @click="openImgPic('actualReceiptPicture')" v-if='company.actualReceiptPicture'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
      <div class="right">
        <el-card>
          <gt-subtitle title="企业基本信息" style="display: block;"/>
          <el-form label-width="135px" :model="company">
            <el-form-item label="行业类别">
              <span class="itemInput">{{company.companyInfo.entityCategory === 0 ? '个人' : '企业'}}</span>
            </el-form-item>
            <el-form-item label="实体类别">
              <span class="itemInput">{{company.companyInfo.level === 1 ? '新母婴计划' : 
                                        company.companyInfo.level === 2 ? '新零售计划':
                                        company.companyInfo.level === 3 ? '新冠军计划':
                                                                                  '--'}}</span>
            </el-form-item>
            <el-form-item label="企业名称">
              <span class="itemInput">{{company.companyInfo.name || '--'}}</span>
            </el-form-item>
            <el-form-item label="企业编号">
              <span class="itemInput">{{company.companyInfo.fuiouMerchantNo || '--'}}</span>
            </el-form-item>
            <el-form-item label="商户号">
              <span class="itemInput">{{company.companyInfo.fuiouMerchantNo || '--'}}</span>
            </el-form-item>
            <el-form-item label="企业法人">
              <span class="itemInput">{{company.companyInfo.legalPerson || '--'}}</span>
            </el-form-item>
            <el-form-item label="联系电话">
              <span class="itemInput">{{company.companyInfo.phone || '--'}}</span>
            </el-form-item>
            <el-form-item label="营业执照编号">
              <span class="itemInput">{{company.companyInfo.businessLicenseCode || '--'}}</span>
            </el-form-item>
            <el-form-item label="企业地址">
              <span class="itemInput">{{`${company.companyInfo.province || ''}${company.companyInfo.city || ''}${company.companyInfo.district || ''}${company.companyInfo.address || ''}` || '--'}}</span>
            </el-form-item>
            <el-form-item label="收款账户">
              <span class="itemInput">{{company.companyInfo.accountNo || '--'}}</span>
            </el-form-item>
            <el-form-item label="开户名称">
              <span class="itemInput">{{company.companyInfo.accountName || '--'}}</span>
            </el-form-item>
            <el-form-item label="开户银行">
              <span class="itemInput">{{company.companyInfo.accountBank || '--'}}</span>
            </el-form-item>
            <el-form-item label="企业营业执照" class="view-img">
              <img :src="`https://${company.companyInfo.businessLicensePic}`" alt="营业执照" @click="openImgPic('businessLicensePic')" v-if='company.companyInfo.businessLicensePic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="法人身份证(正面)" class="view-img">
              <img :src="`https://${company.companyInfo.legalPersonIdPositivePic}`" alt="法人身份证正面" @click="openImgPic('legalPersonIdPositivePic')"   v-if='company.companyInfo.legalPersonIdPositivePic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="法人身份证(反面)" class="view-img">
              <img :src="`https://${company.companyInfo.legalPersonIdBackPic}`" alt="法人身份证反面" @click="openImgPic('legalPersonIdBackPic')" v-if='company.companyInfo.legalPersonIdBackPic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="法人手持身份证" class="view-img">
              <img :src="`https://${company.companyInfo.legalPersonIdBackPic}`" alt="法人手持身份证" @click="openImgPic('legalPersonIdBackPic')" v-if='company.companyInfo.legalPersonIdBackPic'>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <div class="dashed"></div>
    <div class="footer" v-if="company.state === 'UN_AUDIT'">
      <el-card>
          <gt-subtitle title="审核信息" style="display: block;"/>
          <el-form ref="company-form" :rules="dataFormRules" label-width="135px" :model="audit">
            <el-form-item label="有效期设置:" class="gt-inline-item">
              <el-form-item label="门店一:" class="gt-inline-item">
                <gt-time-range
                  start-time-prop="storeOneBeginDate"
                  :start-time-value="audit.storeOneBeginDate"
                  :end-time-value="audit.storeOneEndDate"
                  end-time-prop="storeOneEndDate"
                  @changeStartValue="value => audit.storeOneBeginDate = value"
                  @changeEndValue="value => audit.storeOneEndDate = value"
                ></gt-time-range>
              </el-form-item>
              <el-form-item label="门店二:" class="gt-inline-item">
                <gt-time-range
                  start-time-prop="storeTwoBeginDate"
                  :start-time-value="audit.storeTwoBeginDate"
                  :end-time-value="audit.storeTwoEndDate"
                  end-time-prop="storeTwoEndDate"
                  @changeStartValue="value => audit.storeTwoBeginDate = value"
                  @changeEndValue="value => audit.storeTwoEndDate = value">
                </gt-time-range>
              </el-form-item>
              <el-form-item label="社区团购:" class="gt-inline-item">
                <gt-time-range
                  start-time-prop="communityBuyBeginDate"
                  :start-time-value="audit.communityBuyBeginDate"
                  :end-time-value="audit.communityBuyEndDate"
                  end-time-prop="communityBuyEndDate"
                  @changeStartValue="value => audit.communityBuyBeginDate = value"
                  @changeEndValue="value => audit.communityBuyEndDate = value">
                </gt-time-range>
              </el-form-item>
              <el-form-item label="爆款秒杀:" class="gt-inline-item">
                <gt-time-range
                  start-time-prop="explosiveSpikeBeginDate"
                  :start-time-value="audit.explosiveSpikeBeginDate"
                  :end-time-value="audit.explosiveSpikeEndDate"
                  end-time-prop="explosiveSpikeEndDate"
                  @changeStartValue="value => audit.explosiveSpikeBeginDate = value"
                  @changeEndValue="value => audit.explosiveSpikeEndDate = value">
                </gt-time-range>
              </el-form-item>
            </el-form-item>
            <el-form-item label="审核意见:" class="gt-inline-item">
              <el-input type="textarea" rows="5" v-model="audit.checkExplain" />
            </el-form-item>
          </el-form>
      </el-card>
    </div>
    <div class="gt-form-bottom-submit" v-if="company.state === 'UN_AUDIT'">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="驳回"/>
      <gt-button size="large" v-if="isAuth('mop:company:update')" :loading="$store.state.loading.global"  @click.native="handleUpdate" txt="通过"/>
    </div>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import gtTimeRange from '@/components/gt-time-range'
import gtSubtitle from '@/components/gt-sub-title'
import { filterStatus, filterColor } from '@/utils'
import { companyLevel, companyType, companyStatus } from '@/utils/dict'
import { getOnlyContract } from '@/service/contract'
export default {
  data() {
    return {
      audit:{
        storeOneBeginDate:null,
        storeOneEndDate:null,
        storeTwoBeginDate:null,
        storeTwoEndDate:null,
        communityBuyBeginDate:null,
        communityBuyEndDate:null,
        explosiveSpikeBeginDate:null,
        explosiveSpikeEndDate:null,
      },
      company: {
        companyInfo:{
          entityCategory: null,
        },
        legalPerson: null,
        level: null,
        phone: null,
        city: null,
        province: null,
        district: null,
        address: null,
        businessLicenseCode: null,
        businessLicensePic: null,
        legalPersonIdPositivePic: null,
        legalPersonIdBackPic: null,
        serviceBeginDate: null,
        serviceEndDate: null,
      }, 
      filterStatus,
      filterColor,
      companyLevel,
      companyType,
      companyStatus,
      showImgPic:null,
      dataFormRules:{}
    }
  },
  // async created() {
  //   const { id } = this.$route.query
  //   if(this.isAuth('mop:company:detail')){
  //     const { data } = await this.$http({
  //       url: this.$http.adornUrl(`/baseinfo/mop/company/detail/${id}`),
  //       method: 'get',
  //     })
  //     if(data.code == 0){
  //       this.company = data.data
  //     }
  //   }
  // },
  components: {
    gtSubtitle,gtTimeRange
  },
  created () {
    const { id } = this.$route.query
    this.id = id
    this.init(id)
  },
  methods:{
    //取消
    goBack(){
      history.go(-1)
    },
    //图片展示
    openImgPic:function(str){
      this.showImgPic = 'http://'+this.company[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    async init(id) {
      const { data } = await getOnlyContract(id)
      if (data.code === 0) {
        this.company = data.data
      } else {
        this.$message.error(data.msg)
      }  
    },
    //合同审核
    handleUpdate() {
      console.log(this.audit)
      this.$refs['contract-form'].validate(async (valid) => {
        if (valid) {
          const res = await getContractUpdate({
            ...this.audit,
          })
          this.$router.push({name:'contract-contract'})
        }
      }) 
    },
  }
}
</script>
<style lang="scss" scope>
  .serverTime {
    .el-col.serverOne {
      width: 200px;
    }
  }
  .left{
    float: left;
    width: 50%;
    height: 100%;
  }
  .right{
    float: right;
    width: 50%;
    height: 100%;
  }
  .top{
    width: 100%;
    height: 70%;
  }
  .footer{
    // background-color:green;
    width: 100%;
    height: 30%;
    overflow:auto;
  }
  .dashed{
    width: 100%;
    border: 1px dashed #8a979e;
  }
</style>


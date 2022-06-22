
<template>
  <el-card class="page-intergral-rule" style="padding-bottom: 20px;">
    <el-form class="form-inline-detail" ref="intergral-form" :rules="dataFormRules" :model="intergral">
      <el-row>
        <el-col :span="12">
          <span class="main-title theme-color">积分规则</span>
        </el-col>
      </el-row>
      <gt-subtitle title="储值卡积分">
        <el-tooltip placement="top">
            <div slot="content" style="width: 360px;">1、若开启了储值卡积分，则在充值时会进行积分；<br/>2、在pos进行储值卡退款时，系统会判断当前储值卡积分是否开启：若积分开启，则会按照目前系统内最新的积分规则，反算出退款金额的扣除积分，与当时储值得的积分无关；若当前储值卡积分关闭，则在pos储值卡退款时不会扣除积分。</div>
            <img class="tip-icon" style="margin-left: 10px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        &nbsp;
        <span class="status-label" :class="{'active': intergral.cardStatus}" >{{intergral.cardStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item class="form-item-inline" prop="cardValue">
          充值每
          <span >{{intergral.cardValue}}</span>
          人民币，赠送1订单积分，不满1人民币赠送0积分（按实收金额计算）
          <div class="tip">（储值卡消费会计入积分，若开启了储值卡充值积分，则充值也会计算积分，建议谨慎开启）</div>
        </el-form-item>
      </div>
      <gt-subtitle title="礼品卡积分" style="margin-top: 30px;">
        &nbsp;
        <span class="status-label" :class="{'active': intergral.giftCardStatus}" >{{intergral.giftCardStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item class="form-item-inline" prop="giftCardValue">
          购买每
          <span >{{intergral.giftCardValue}}</span>
          人民币，赠送1订单积分，不满1人民币赠送0积分（按实收金额计算）
          <div class="tip">（礼品卡消费不计入积分）</div>
        </el-form-item>
      </div>
      <gt-subtitle title="订单积分" style="margin-top: 30px;">
        &nbsp;
        <span class="status-label" :class="{'active': intergral.productStatus}" >{{intergral.productStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-row >
          <div class="integral-product-type theme-color" v-if="intergral.productIntegralType === 'ORDER'">按订单金额</div>
          <div class="integral-product-type theme-color" v-else>按商品积分</div>
          <el-form-item class="form-item-inline" prop="orderValue" v-if="intergral.productIntegralType === 'ORDER'" style="margin-bottom: 15px;">
            每消费
            <span>{{intergral.orderValue}}</span>
            人民币，赠送1订单积分，不满1人民币赠送0积分
              <div class="tip">（消费累计积分，按订单消费实收金额计算；无码商品实收金额参与订单积分）</div>
          </el-form-item>
          <div class="tip" style="margin-bottom: 10px;" v-else>（按商品设置的积分规则进行计算，无码商品不参与积分）</div>
        </el-row>
        <integral-rule-list v-if="intergral.productIntegralType === 'PRODUCT'" />
        <multiple-integral ref="multipleIntegral" :page-type="'detail'"/>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import integralRuleList from './integral-rule-list'
import multipleIntegral from './multiple-integral'
import { integralPlanDetail } from '@/service/integral'
import { priceRange } from '@/utils/validate'
import { levelList} from '@/service/mycustomer'
export default {
  name: 'campaign-intergralExchange-integralRule',
  data() {
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99)) {
          callback(new Error('请输入0.01-499999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      pageType: 'edit', // detail详情页面， edit编辑页面
      intergral: {
        cardStatus: false,
        cardValue: 0,
        giftCardStatus: false,
        giftCardValue: 0,
        orderValue: 0,
        productIntegralType: 'ORDER',
        productStatus: false
      },
      memberLevel:[],
      dataFormRules: {
        cardValue:[{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
        giftCardValue:[{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
        orderValue:[{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
      }
    }
  },
  components: {
    gtSubtitle,
    integralRuleList,
    multipleIntegral
  },
  created(){
    this.getMemberList()
  },
  methods: {
    async getMemberList() {
      const { data } = await levelList()
      if (data && data.code === 0) {
        this.memberLevel = data.data.map(item => {
          return {
            vipName: item.vipName,
            levelId: item.vipId
          }
        })
        this.detail(this.memberLevel)
      } else {
        this.memberLevel = []
        this.$message.warning(data.msg)
      }

    },
    async detail(memberLevel){
      const { data } = await integralPlanDetail()
      if (data.code === 0) {
        this.intergral = {
          ...data.data,
          cardValue: this.priceNum(data.data.cardValue),
          giftCardValue: this.priceNum(data.data.giftCardValue),
          orderValue: this.priceNum(data.data.orderValue)
        }
        if(data.data.vipLevelPlans&&data.data.vipLevelPlans.length>0){
          var list=[]
          data.data.vipLevelPlans.forEach(o=>{
            memberLevel&&memberLevel.forEach(item=>{
              if(o.levelId == item.levelId){
                list.push({
                  id: o.id,
                  levelId: o.levelId,
                  multiple: o.multiple,
                  vipName: item.vipName
                })
              }
            })
          })
          // 多倍积分规则
          this.$refs['multipleIntegral'].getLevel(data.data,list)
        }else{
          // 多倍积分规则
          this.$refs['multipleIntegral'].getLevel(data.data,memberLevel)
        }
      } else {
        this.$message.error(data.msg)
      }
    },
  },
}
</script>
<style lang="scss">
@import '~@/assets/scss/_variables.scss';
.page-intergral-rule{
  font-size: 14px;
  .integral-product-type{
    font-size: 16px;
    margin-bottom: 10px;
  }
  .form-inline-detail{
    .form-item-inline{
      display: inline-block;
      margin-bottom: 0;
      .el-form-item__content{
        line-height: 20px;
      }
      .inputs1{
        display: inline-block;
        padding: 0 !important;
        width: 100px;
        .el-input__inner{
          width: 100px;
        }
      }
    }
    .block-radio{
      width: 100%;
      .el-input__inner, .el-radio__label{
        font-size: 14px;
      }
      .el-radio{
        display: block;
        margin-bottom: 15px;
        &.inline{
          display: inline;
        }
      }
    }
  }

  .main-title {
    font-size: 18px;
  }
  .basic-button{
    width: 100px;
    text-align: center;
    padding: 10px !important;
    font-size: 12px;
  }
  .status-label{
    display: inline-block;
    padding: 2px 7px;
    border-radius: 3px;
    font-size: 14px;
    color: #fff;
    background-color: #ccc;
  }
  .inner-pannel{
    padding-left: 15px;
    .tip{
      margin-top: 5px;
      color: $info--sub-font-color;
    }
  }
}
</style>



<template>
  <el-card class="page-intergral-rule" style="padding-bottom: 20px;" v-loading="dataListLoading">
    <el-form class="form-inline-detail" ref="intergral-form" :rules="dataFormRules" :model="intergral">
      <el-row>
        <el-col :span="12">
          <span class="main-title theme-color">积分规则</span>
        </el-col>
        <el-col :span="12" class="commissionBt" style="text-align: right;">
          <el-button class="basic-button" v-show="this.pageType === 'edit'" @click="changePageType('detail')">取消</el-button>
          <el-button class="basic-button border" v-show="this.pageType === 'edit'" type="primary" @click="save">保存</el-button>
          <el-button class="basic-button" v-show="this.pageType === 'detail'" type="primary" @click="changePageType('edit')">更改设置</el-button>
        </el-col>
      </el-row>
      <gt-subtitle title="储值卡/购物卡积分">
         <el-tooltip placement="top">
            <div slot="content" style="width: 360px;">1、若开启了储值卡/购物卡积分，则在充值时会进行积分；<br/>2、在pos进行储值卡/购物卡退款时，系统会判断当前储值卡/购物卡积分是否开启：若积分开启，则会按照目前系统内最新的积分规则，反算出退款金额的扣除积分，与当时储值得的积分无关；若当前储值卡/购物卡积分关闭，则在pos储值卡/购物卡退款时不会扣除积分。</div>
            <img class="tip-icon" style="margin-left: 10px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        &nbsp;
        <el-form-item class="form-item-inline" v-show="pageType === 'edit'" prop="cardStatus">
          <el-switch v-model="intergral.cardStatus"></el-switch>
        </el-form-item>
        <span class="status-label" :class="{'active': intergral.cardStatus}" v-show="pageType === 'detail'">{{intergral.cardStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item class="form-item-inline" prop="cardValue">
          充值每
          <el-input v-model="intergral.cardValue" class="cus-mini-input" v-show="pageType === 'edit'"/>
          <span v-show="pageType === 'detail'">{{intergral.cardValue}}</span>
          人民币，赠送1订单积分，不满1人民币赠送0积分（按实收金额计算）
          <div class="tip">（储值卡/购物卡消费会计入积分，若开启了储值卡/购物卡充值积分，则充值也会计算积分，建议谨慎开启）</div>
        </el-form-item>
      </div>
      
      <gt-subtitle title="签到积分" style="margin-top: 30px;">
        &nbsp;
        <el-form-item class="form-item-inline" v-show="pageType === 'edit'" prop="signInStatus">
          <el-switch v-model="intergral.signInStatus"></el-switch>
        </el-form-item>
        <span class="status-label" :class="{'active': intergral.signInStatus}" v-show="pageType === 'detail'">{{intergral.signInStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item class="form-item-inline" prop="daySignInIntegral">
          每天签到赠送
          <el-input v-model="intergral.daySignInIntegral" class="cus-mini-input" v-show="pageType === 'edit'"/>
          <span v-show="pageType === 'detail'">{{intergral.daySignInIntegral}}</span>
          积分
          <div class="tip">（积分范围：1-100的整数）</div>
        </el-form-item>
      </div>
      <div class="inner-pannel" style="margin-top: 20px !important">
        <el-checkbox v-model="intergral.checked" :disabled="this.pageType !== 'edit'" @change="changeChecked"></el-checkbox>
        <el-form-item class="form-item-inline" prop="day">
          连续签到满
          <el-input v-model="intergral.day" class="cus-mini-input" :disabled="!intergral.checked" v-show="pageType === 'edit'"/>
          <span v-show="pageType === 'detail'">{{intergral.day}}</span>
          天，
        </el-form-item>
        <el-form-item class="form-item-inline" prop="dayGiveIntegral" style="display:inline-block">
          额外赠送<el-input v-model="intergral.dayGiveIntegral" class="cus-mini-input" :disabled="!intergral.checked" v-show="pageType === 'edit'"/>
          <span v-show="pageType === 'detail'">{{intergral.dayGiveIntegral}}</span>
          积分
          <span class="tip">（天数范围：1-30的整数，积分范围：1-100的整数）</span>
        </el-form-item>
      </div>

      <gt-subtitle title="礼品卡积分" style="margin-top: 30px;">
        &nbsp;
        <el-form-item class="form-item-inline" v-show="pageType === 'edit'" prop="giftCardStatus">
          <el-switch v-model="intergral.giftCardStatus"></el-switch>
        </el-form-item>
        <span class="status-label" :class="{'active': intergral.giftCardStatus}" v-show="pageType === 'detail'">{{intergral.giftCardStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item class="form-item-inline" prop="giftCardValue">
          购买每
          <el-input v-model="intergral.giftCardValue" class="cus-mini-input" v-show="pageType === 'edit'"/>
          <span v-show="pageType === 'detail'">{{intergral.giftCardValue}}</span>
          人民币，赠送1订单积分，不满1人民币赠送0积分（按实收金额计算）
          <div class="tip">（礼品卡消费不计入积分）</div>
        </el-form-item>
      </div>
      <gt-subtitle title="订单积分" style="margin-top: 30px;">
        &nbsp;
        <el-form-item class="form-item-inline" v-show="pageType === 'edit'" prop="productStatus">
          <el-switch v-model="intergral.productStatus"></el-switch>
        </el-form-item>
        <span class="status-label" :class="{'active': intergral.productStatus}" v-show="pageType === 'detail'">{{intergral.productStatus ? '启用' : '禁用'}}</span>
      </gt-subtitle>
      <div class="inner-pannel">
        <el-form-item prop="productIntegralType" v-show="pageType === 'edit'">
          <el-radio-group class="block-radio" v-model="intergral.productIntegralType">
            <el-radio label="ORDER">
              按订单金额积分
            </el-radio>
            <el-form-item class="form-item-inline" style="margin-left: 20px;" prop="orderValue">
              每消费
              <el-input v-model="intergral.orderValue" class="cus-mini-input"/>
              人民币，赠送1订单积分，不满1人民币赠送0积分
              <div class="tip">（消费累计积分，按订单消费实收金额计算；无码商品实收金额参与订单积分）</div>
            </el-form-item>
            <!-- <el-form-item prop="noBarcodeOrder" style="margin-left: 20px; margin-bottom: 20px;">
              <el-checkbox v-model="intergral.noBarcodeOrder">无码商品参与积分</el-checkbox>
            </el-form-item> -->
            <el-radio label="PRODUCT" style="margin-top: 30px;">
              按商品积分
            </el-radio>
            <el-form-item class="form-item-inline" style="margin-left: 20px;margin-top: -10px;">
              <div class="tip">（按商品设置的积分规则进行计算，无码商品不参与积分）</div>
            </el-form-item>
            <!-- <el-form-item prop="noBarcodeGoods" style="margin-left: 20px;">
              <el-checkbox v-model="intergral.noBarcodeGoods">无码商品参与积分</el-checkbox>
            </el-form-item>
            <el-form-item prop="nogoodsType">
              <el-radio-group v-if="intergral.noBarcodeGoods" style="margin-left: 40px;" v-model="intergral.nogoodsType">
                <el-radio label="ORDER" class="inline">
                  按订单金额积分
                  <el-form-item class="form-item-inline" prop="barcodeOrderValue">
                    <el-input v-model="intergral.barcodeOrderValue" class="cus-mini-input"/>
                    分
                  </el-form-item>
                </el-radio>
                <el-radio label="PERCENTAGE" class="inline">
                  实收金额百分比
                  <el-form-item class="form-item-inline" prop="barcodePercentageValue">
                    <el-input v-model="intergral.barcodePercentageValue" class="cus-mini-input"/>
                    %
                  </el-form-item>
                </el-radio>
              </el-radio-group>
            </el-form-item> -->
          </el-radio-group>
        </el-form-item>

        <el-row v-show="pageType === 'detail'">
          <div class="integral-product-type theme-color" v-if="intergral.productIntegralType === 'ORDER'">按订单金额</div>
          <div class="integral-product-type theme-color" v-else>按商品积分</div>
          <el-form-item class="form-item-inline" prop="orderValue" v-if="intergral.productIntegralType === 'ORDER'" style="margin-bottom: 15px;">
            每消费
            <span>{{intergral.orderValue}}</span>
            人民币，赠送1订单积分，不满1人民币赠送0积分
            <div class="tip">（消费累计积分，按订单消费应付金额计算；无码商品应付金额参与订单积分）</div>
          </el-form-item>
          <div class="tip" style="margin-bottom: 10px;" v-else>（按商品设置的积分规则进行计算，无码商品不参与积分）</div>
        </el-row>
        <integral-rule-list v-show="!(pageType === 'detail' && intergral.productIntegralType === 'ORDER')" :type="pageType" />
        <mutiple-integral ref="multipleIntegral" :page-type="pageType"/>
      </div>
    </el-form>
  </el-card>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import integralRuleList from './integral-rule-list'
import mutipleIntegral from './mutiple-integral'
import { integralPlanDetail, setIntegralPlan } from '@/service/integral'
import { levelList } from '@/service/mycustomer'
import {validatenull, priceRange } from '@/utils/validate'
export default {
  name: 'campaign-intergralExchange-integralRule',
  data() {
    const validatePrice = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value || value == 0) {
        if (!reg.test(value)) {
          callback(new Error('请输入0-99999的正整数！'))
        } else if (value < 0 || value > 99999){
          callback(new Error('请输入0-99999的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateCardPrice = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value) {
        if (!reg.test(value)) {
          callback(new Error('请输入1-5之间的正整数！'))
        } else if (value < 1 || value > 5){
          callback(new Error('请输入1-5的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateIntegral = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value || value == 0) {
        if (!reg.test(value)) {
          callback(new Error('请输入1-100的正整数！'))
        } else if (value < 1 || value > 100){
          callback(new Error('请输入1-100的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const validateDay = (rule, value, callback) => {
      const reg = /^\d+$/
      if (this.intergral.checked) {
        if (value || value == 0) {
          if (!reg.test(value)) {
            callback(new Error('请输入1-30的正整数！'))
          } else if (value < 1 || value > 30){
            callback(new Error('请输入1-30的正整数！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    const validateExtraIntegral = (rule, value, callback) => {
      const reg = /^\d+$/
      if (this.intergral.checked) {
        if (value || value == 0) {
          if (!reg.test(value)) {
            callback(new Error('请输入1-100的正整数！'))
          } else if (value < 1 || value > 100){
            callback(new Error('请输入1-100的正整数！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    return {
      dataListLoading:false,
      memberLevel: [],
      pageType: 'detail', // detail详情页面， edit编辑页面
      intergral: {
        cardStatus: false,
        cardValue: 0,
        giftCardStatus: false,
        signInStatus: false,
        giftCardValue: 0,
        daySignInIntegral: 1,
        orderValue: 0,
        productIntegralType: 'ORDER',
        productStatus: false,
        checked:true,
      },
      dataFormRules: {
        cardValue:[{required: true, message: '请输入金额'}, {validator: validateCardPrice, trigger: 'blur' }],
        giftCardValue:[{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
        daySignInIntegral:[{required: true, message: '请输入积分'}, {validator: validateIntegral, trigger: 'blur' }],
        day:[{validator: validateDay, trigger: 'blur' }],
        dayGiveIntegral:[{validator: validateExtraIntegral, trigger: 'blur' }],
        orderValue:[{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
      }
    }
  },
  components: {
    gtSubtitle,
    integralRuleList,
    mutipleIntegral
  },
  created(){
    this.getMemberList()

  },
  methods: {
    changeChecked(val){
      if(!val){
        this.intergral.day = 0,
        this.intergral.dayGiveIntegral = 0
      }
    },
    async detail(memberLevel){
      const { data } = await integralPlanDetail()
      if (data.code === 0) {
        this.intergral = {
          ...data.data,
          cardValue: this.priceNum(data.data.cardValue),
          giftCardValue: this.priceNum(data.data.giftCardValue),
          orderValue: this.priceNum(data.data.orderValue),
          day: data.data.signInIntegralSetup ? data.data.signInIntegralSetup.day : 0,
          dayGiveIntegral: data.data.signInIntegralSetup ? data.data.signInIntegralSetup.dayGiveIntegral : 0,
          daySignInIntegral: data.data.signInIntegralSetup ? data.data.signInIntegralSetup.daySignInIntegral : 0,
          signInStatus: data.data.signInIntegralSetup ? data.data.signInIntegralSetup.signInStatus : false,
          checked: (data.data.signInIntegralSetup.day != 0 || data.data.signInIntegralSetup.dayGiveIntegral != 0) ? true : false
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
    async save(){
      this.$refs['intergral-form'].validate(async (valid) => {
        if (valid) {
          // 获取会员等级多倍积分
          const { vipList = [],vipDatePlans={} } = this.$refs['multipleIntegral']
          console.log(this.$refs['multipleIntegral'])
          let vipLevelPlans = []
          let flag = true
          for(var i = 0; i < vipList.length ; i++) {
            const item = vipList[i]
            if (!priceRange(item.multiple, 999, 1)) {
              this.$message.warning('积分倍数请输入1-999的数字！(最多保留小数点后两位)')
              flag = false
              break
            } else {
              vipLevelPlans.push({
                ...item,
                multiple: this.priceNum(item.multiple, 'out')
              })
            }
          }
          if (!flag) {
            return
          }else{
            if(vipDatePlans&&vipDatePlans.cycleType=='WEEK'){
              vipDatePlans.dayOfMonth = 1
              vipDatePlans.monthVal = 1
              if(!validatenull(vipDatePlans.dayOfWeek)){
                if (!priceRange(vipDatePlans.weekVal, 999, 1)) {
                  this.$message.warning('积分倍数请输入1-999的数字！(最多保留小数点后两位)')
                  flag = false
                }
              }else{
                this.$message.warning('请先选择指定周期！')
                flag = false
              }
            }else{
              vipDatePlans.dayOfWeek = 1
              vipDatePlans.weekVal = 1
              if(!validatenull(vipDatePlans.dayOfMonth)){
                var CS = /^[0-9]+$/
                if (!CS.test(vipDatePlans.dayOfMonth)||vipDatePlans.dayOfMonth<1||vipDatePlans.dayOfMonth>31) {
                  this.$message.warning('只能选择1-31的正整数')
                  flag = false
                }else{
                  if (!priceRange(vipDatePlans.monthVal, 999, 1)) {
                    this.$message.warning('积分倍数请输入1-999的数字！(最多保留小数点后两位)')
                    flag = false
                  }
                }

              }else{
                this.$message.warning('请输入指定周期！')
                flag = false
              }
            }
            if(!flag){
              return
            }
          }
          this.dataListLoading = true
          let submitData = {
            ...this.intergral,
            vipDatePlans: null,
            vipLevelPlans: [],
            vipLevelPlanFormList:vipLevelPlans,
            vipDatePlanForm:{
              ...vipDatePlans,
              monthVal: vipDatePlans.monthVal?this.priceNum(vipDatePlans.monthVal, 'out'): null,
			        weekVal: vipDatePlans.weekVal?this.priceNum(vipDatePlans.weekVal, 'out'):null,
            },
            signInIntegralSetupForm:{
              day:this.intergral.day,
              dayGiveIntegral:this.intergral.dayGiveIntegral,
              daySignInIntegral:this.intergral.daySignInIntegral,
              signInStatus:this.intergral.signInStatus ? true : false
              // day:2,
              // dayGiveIntegral:1,
              // daySignInIntegral:1,
              // signInStatus:this.intergral.signInStatus ? true : false
            },
            cardValue: this.priceNum(this.intergral.cardValue, 'out'),
            giftCardValue: this.priceNum(this.intergral.giftCardValue, 'out'),
            orderValue: this.priceNum(this.intergral.orderValue, 'out'),
          }
          console.log(submitData)
          const { data } = await setIntegralPlan(submitData)
          if (data.code === 0) {
            this.getMemberList()
            this.pageType = 'detail'
            this.dataListLoading = false
          } else {
            this.dataListLoading = false
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 更改页面状态
    changePageType(type) {
      if (type === 'detail') {
        this.getMemberList()
      }
      this.pageType = type
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
      .cus-mini-input{
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


<template>
<div>
  <div v-if="newStore =='false'|| companyRoleName =='数据运维（技术服务）'">
    <div v-for="item in list" :key="item.name" class="allBox">
      <div class="listY" v-if="hasName(item.list)">{{item.name}}</div>
      <div class="listY1">
        <div v-for="item1 in item.list" :key="item1.name" >
          <div v-if="isAuthMenu(item1.isauth || '')" class="listBox" @click="goList(item1.router,item1.type)"  :style="item1.disabled?'background:#d3d3d3':''">
            <span class="imgs"><icon-svg :name="item1.icon" class="th-size theme-color" :class="{'special-theme-icon': item1.icon === 'campaignTogether'}"></icon-svg></span>
            <span class="imgTitle">
              <div class="name">{{item1.name}}</div>
              <div class="title">{{item1.title}}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
    <div v-if="newStore=='true' && companyRoleName !='数据运维（技术服务）'">
    <div v-for="item in newlist" :key="item.name" class="allBox">
      <div class="listY" v-if="hasName(item.list)">{{item.name}}</div>
      <div class="listY1">
        <div v-for="item1 in item.list" :key="item1.name" >
          <div v-if="isAuthMenu(item1.isauth || '')" class="listBox" @click="goList(item1.router,item1.type)"  :style="item1.disabled?'background:#d3d3d3':''">
            <span class="imgs"><icon-svg :name="item1.icon" class="th-size theme-color" :class="{'special-theme-icon': item1.icon === 'campaignTogether'}"></icon-svg></span>
            <span class="imgTitle">
              <div class="name">{{item1.name}}</div>
              <div class="title">{{item1.title}}</div>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>
<script>
import { getStore } from '@/utils/storage'
export default {
  name:'campaign-index',
  data(){
    return{
      newStore:null,
      companyRoleName:null,
      list:[{
        'name':'店铺促销',
        list:[{'router':'campaign-storePromotion-coupon-campaign', isauth: 'campaign_coupon', 'name':'优惠券','icon':'campaignCoupon','title':'随劵客动，营销不停'},
          {'router':'campaign-storePromotion-countCard-countCard',isauth: 'campaign_count_card', 'name':'礼品卡','icon':'campaignCouponTime','title':'服务礼品卡，营销必备'},
          {'router':'campaign-storePromotion-shortmessage-index', isauth: 'campaign_sms', 'name':'短信营销','icon':'campaignMessage','title':'直接高效，准确到达'},
          {'router':'campaign-storePromotion-promote-list', isauth: 'campaign_promote', 'name':'促销政策','icon':'campaignPromote','title':'单品促销&商品组合销售'}
        ]},
      {'name':'微信营销',
        list:[{'type':'SPECIAL','router':'campaign-wechatMarketing-activeList-specailadd',isauth: 'campaign_special','name':'特卖活动','icon':'campaignActive','title':'专属话题，限时优惠'},
          {'type':'TURN','router':'campaign-wechatMarketing-activeList-bigWheeladd',isauth: 'campaign_wheel','name':'大转盘','icon':'campaignFlowGift','title':'拼手气，看运气'},
          {'type':'PAIDGIFT','router':'campaign-wechatMarketing-activeList-payGiftadd',isauth: 'campaign_pay_gift','name':'支付有礼','icon':'campaignPayGift','title':'支付后推送营销活动'},
          {'type':'GROUP','router':'campaign-wechatMarketing-activeList-communityGroup',isauth: 'campaign_community','name':'社区拼团','icon':'campaignGroupBuy','title':'抢好物，就在一瞬间'},
          {'router':'1', isauth: 'campaign', 'disabled':true,'name':'拼团','icon':'campaignGroup','title':'大家一起买更便宜'},
          {'router':'1',isauth: 'campaign', 'disabled':true,'name':'爆款秒杀','icon':'campaignBuyCheap','title':'抢好物，就在一瞬间'}
        ]},
      {'name':'积分与分销',
        list:[{'router':'campaign-intergralExchange-integralRule',isauth: 'campaign_intergral','name':'积分规则','icon':'campaignCoreRules','title':'消费者积分规则'},
          // {'router':'campaign-intergralExchange-mami',isauth: 'campaign_mami','name':'门店合伙人','icon':'campaignTogether','title':'让顾客成为合作伙伴'},
          {'router':'1',isauth: 'campaign','disabled':true,'name':'积分商城','icon':'campaignChange','title':'积分当钱花'},
          {'router':'campaign-intergralExchange-shoppingCards-shoppingCardsList',isauth: 'campaign_shoppingCards','name':'购物卡','icon':'campaignCoreRules','title':'专项项目储值'},
        ]
      }],
      newlist:[{
        'name':'店铺促销',
        list:[
          {'router':'campaign-storePromotion-countCard-countCard',isauth: 'campaign_count_card', 'name':'礼品卡','icon':'campaignCouponTime','title':'服务礼品卡，营销必备'},
          {'router':'campaign-storePromotion-shortmessage-index', isauth: 'campaign_sms', 'name':'短信营销','icon':'campaignMessage','title':'直接高效，准确到达'},
        ]},
      {'name':'积分与分销',
        list:[{'router':'campaign-intergralExchange-integralRule',isauth: 'campaign_intergral','name':'积分规则','icon':'campaignCoreRules','title':'消费者积分规则'},
          // {'router':'campaign-intergralExchange-mami',isauth: 'campaign_mami','name':'门店合伙人','icon':'campaignTogether','title':'让顾客成为合作伙伴'},
          {'router':'1',isauth: 'campaign','disabled':true,'name':'积分商城','icon':'campaignChange','title':'积分当钱花'},
          {'router':'campaign-intergralExchange-shoppingCards-shoppingCardsList',isauth: 'campaign_shoppingCards','name':'购物卡','icon':'campaignCoreRules','title':'专项项目储值'},
        ]
      }]
    }
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      vm.reload()
    })
  },
  created() {
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    goList(url,type){
      if(url == 1){
        this.$message.success('敬请期待！！！')
      }else{
        // ,query:{type:type||''}
        this.$router.push({name:url})
      }
    },
    hasName(auths) {
      if (auths && auths.length > 0) {
        const flag = auths.some(item => {
          return this.isAuthMenu(item.isauth || '')
        })
        return flag
      } else {
        return false
      }
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/campaign/campaignIndex.scss';
.th-size {
  font-size: 40px;
}
</style>

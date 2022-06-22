<template>
  <div>
    <div v-if="storeType== 'NEW_RETAIL_AND_DRINK'">
      <div v-for="item in list" :key="item.name" class="allBox">
        <div class="listY" v-if="hasName(item.list)">{{item.name}}</div>
        <div class="listY1">
          <div v-for="item1 in item.list" :key="item1.name">
            <div v-if="isAuthMenu(item1.isauth || '')" class="listBox" @click="goList(item1.router,item1.type)"  :style="item1.disabled?'background:#d3d3d3':''">
              <span class="imgs"><icon-svg :name="item1.icon" class="th-size theme-color"></icon-svg></span>
              <span class="imgTitle">
                <div class="name">{{item1.name}}</div>
                <div class="title">{{item1.title}}</div>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="item in oldlist" :key="item.name" class="allBox">
        <div class="listY" v-if="hasName(item.list)">{{item.name}}</div>
        <div class="listY1">
          <div v-for="item1 in item.list" :key="item1.name">
            <div v-if="isAuthMenu(item1.isauth || '')" class="listBox" @click="goList(item1.router,item1.type)"  :style="item1.disabled?'background:#d3d3d3':''">
              <span class="imgs"><icon-svg :name="item1.icon" class="th-size theme-color"></icon-svg></span>
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
export default {
  name:'campaign-index',
  data(){
    return{
      list:[{'name':'店铺促销',list:[{'router':'campaign-storePromotion-coupon-campaign',isauth: 'campaign_coupon','name':'优惠券','icon':'campaignCoupon','img':'/static/img/campaign/campaignCoupon.png','title':'随劵客动，营销不停'},
        {'router':'campaign-storePromotion-countCard-countCard',isauth: 'campaign_count_card', 'name':'礼品卡','icon':'campaignCouponTime','img':'/static/img/campaign/campaignCouponTime.png','title':'服务礼品卡，营销必备'},
        {'router':'campaign-storePromotion-shortmessage-index', isauth: 'campaign_sms', 'name':'短信营销','icon':'campaignMessage','img':'/static/img/campaign/campaignMessage.png','title':'直接高效，准确到达'}]},
        {'name':'微信营销',list:[{'type':'SPECIAL','router':'campaign-wechatMarketing-activeList-specailadd', isauth: 'campaign_special', 'icon':'campaignActive','name':'特卖活动','img':'/static/img/campaign/campaignActive.png','title':'专属话题，限时优惠'},
        {'type':'TURN','router':'campaign-wechatMarketing-activeList-bigWheeladd', isauth: 'campaign_wheel','name':'大转盘','icon':'campaignFlowGift','img':'/static/img/campaign/campaignFlowGift.png','title':'拼手气，看运气'},
        // {'type':'PAIDGIFT','router':'campaign-wechatMarketing-activeList-activeList', isauth: 'campaign_pay_gift','name':'支付有礼','icon':'campaignPayGift','img':'/static/img/campaign/campaignPayGift.png','title':'支付后推送营销活动'},
        {'type':'GROUP','router':'campaign-wechatMarketing-activeList-communityGroupadd','name':'社区拼团',isauth: 'campaign_community','icon':'campaignGroupBuy','img':'/static/img/campaign/campaignGroupBuy.png','title':'抢好物，就在一瞬间'},
        {'router':'1','disabled':true,'name':'拼团', isauth: 'campaign','img':'/static/img/campaign/campaignGroup.png','icon':'campaignGroup','title':'大家一起买更便宜'},
        {'router':'1','disabled':true,'name':'爆款秒杀',isauth: 'campaign','img':'/static/img/campaign/campaignBuyCheap.png','icon':'campaignBuyCheap','title':'抢好物，就在一瞬间'}]},
        {'name':'积分与兑换',list:[{'router':'campaign-intergralExchange-integralRule',isauth: 'campaign_intergral','name':'积分规则','icon':'campaignCoreRules','img':'/static/img/campaign/campaignCoreRules.png','title':'消费者积分规则'},
        {'router':'1','disabled':true,'name':'积分商城',isauth: 'campaign','img':'/static/img/campaign/campaignChange.png','icon':'campaignChange','title':'积分当钱花'}]}],
        storeType: null,
      oldlist:[{'name':'店铺促销',list:[{'router':'campaign-storePromotion-coupon-campaign',isauth: 'campaign_coupon','name':'优惠券','icon':'campaignCoupon','img':'/static/img/campaign/campaignCoupon.png','title':'随劵客动，营销不停'},
        {'router':'campaign-storePromotion-countCard-countCard',isauth: 'campaign_count_card', 'name':'礼品卡','icon':'campaignCouponTime','img':'/static/img/campaign/campaignCouponTime.png','title':'服务礼品卡，营销必备'},
        {'router':'campaign-storePromotion-shortmessage-index', isauth: 'campaign_sms', 'name':'短信营销','icon':'campaignMessage','img':'/static/img/campaign/campaignMessage.png','title':'直接高效，准确到达'}]},
        {'name':'微信营销',list:[{'type':'SPECIAL','router':'campaign-wechatMarketing-activeList-activeList', isauth: 'campaign_special', 'icon':'campaignActive','name':'特卖活动','img':'/static/img/campaign/campaignActive.png','title':'专属话题，限时优惠'},
        {'type':'TURN','router':'campaign-wechatMarketing-activeList-activeList', isauth: 'campaign_wheel','name':'大转盘','icon':'campaignFlowGift','img':'/static/img/campaign/campaignFlowGift.png','title':'拼手气，看运气'},
        // {'type':'PAIDGIFT','router':'campaign-wechatMarketing-activeList-activeList', isauth: 'campaign_pay_gift','name':'支付有礼','icon':'campaignPayGift','img':'/static/img/campaign/campaignPayGift.png','title':'支付后推送营销活动'},
        {'type':'GROUP','router':'campaign-wechatMarketing-activeList-activeList','name':'社区拼团',isauth: 'campaign_community','icon':'campaignGroupBuy','img':'/static/img/campaign/campaignGroupBuy.png','title':'抢好物，就在一瞬间'},
        {'router':'1','disabled':true,'name':'拼团', isauth: 'campaign','img':'/static/img/campaign/campaignGroup.png','icon':'campaignGroup','title':'大家一起买更便宜'},
        {'router':'1','disabled':true,'name':'爆款秒杀',isauth: 'campaign','img':'/static/img/campaign/campaignBuyCheap.png','icon':'campaignBuyCheap','title':'抢好物，就在一瞬间'}]},
        {'name':'积分与兑换',list:[{'router':'campaign-intergralExchange-integralRule',isauth: 'campaign_intergral','name':'积分规则','icon':'campaignCoreRules','img':'/static/img/campaign/campaignCoreRules.png','title':'消费者积分规则'},
        {'router':'1','disabled':true,'name':'积分商城',isauth: 'campaign','img':'/static/img/campaign/campaignChange.png','icon':'campaignChange','title':'积分当钱花'}]}],
        
    }
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      vm.reload()
    })
  },
    created(){
    const { storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeType = storeType
    },
  methods:{
    goList(url,type){
      if(url == 1){
        this.$message.success('敬请期待！！！')
      }else{
        this.$router.push({name:url,query:{type:type||''}})
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
.th-size {
  font-size: 40px;
}
.allBox {
  // display: inline-block;
}
.listY {
  font-size: 16px;
  color: #535353;
}
.listY1{
  overflow: hidden;
}
.listY1 .listBox {
  width: 250px;
  height: 100px;
  float: left;
  margin: 20px 20px 20px 0;
  background: #fff;
  padding: 30px 0 30px 30px;
  cursor: pointer;
}
.listY1 .listBox:hover {
  box-shadow: 0 2px 6px rgba(0,0,0,.2)
}
.imgs {
  margin-right: 15px;
  float: left;
  width: 50px;
}
.imgs img {
  width: 50px;
  height:45px;
}
.imgTitle .name {
  margin-bottom: 15px;
  font-size: 16px;
  color: #7F7F7F;
}
.imgTitle .title {
  font-size: 13px;
  color: #ABABAB;
}
</style>


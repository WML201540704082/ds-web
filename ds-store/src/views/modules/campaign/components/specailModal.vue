<template>
  <div class="lefts">
    <div class="phoneTop">
      <img src="static/img/goods/phone/meng_zhuan_title.png" alt="">
      <span>{{activeadd.title}}</span>
    </div>
    <div class="specails" v-for="item in activeadd.items" :key="item.productId">
      <img :src="item.specailcover?'http://'+item.specailcover:'static/img/goods/phone/no_pic1.png'" alt="">
      <div class="productList">
        <div :class="item.products.length<2 ?'productItem':'productItem productItem1'" v-for="good in item.products" :key="good.id">
          <span class="goodSrc">
            <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic1.png'" alt="">
          </span>
          <span :class="item.products.length<2 ?'goodInfo1 goodInfo':'goodInfo'">
            <div :class="item.products.length<2 ?'goodName':'goodName goodName1'">{{good.name}}</div>
            <div :class="item.products.length<2 ?'goodPrice goodPrice1':'goodPrice'">￥{{good.price}}<span style="margin-right: 5px;text-decoration:line-through;color:#1B1814;font-size: 12px;">￥{{priceNum(good.retailPrice)}}</span></div>
            <span  :class="item.products.length<2 ?'goodClick goodClick1':'goodClick'">点击抢购 <span>></span></span>
          </span>
        </div>
      </div>
    </div>
    <img style="width:100%" src="static/img/goods/phone/meng_zhuan_label.png" alt="" v-if="activeadd.products.length>0">
    <div class="product" v-for="(item, index) in activeadd.products" :key="index">
      <div class="productList">
        <div class="productItem" v-for="good in item.first" :key="good.id">
          <span class="goodSrc">
            <img :src="good.pic?'http://'+good.pic:'static/img/goods/phone/no_pic1.png'" alt="">
          </span>
          <span class="goodInfo">
            <div class="goodName">{{good.name}}</div>
            <div style="margin-top: 10px;">
              <b style="float: none!important" class="goodPrice">￥{{good.price}}<span style="text-decoration:line-through;color:#1B1814;font-size: 12px;margin-right: 5px;">￥{{priceNum(good.retailPrice)}}</span></b>
              <div style="float: none!important;margin-top: 5px;"  class="goodClick">点击抢购</div>
            </div>
          </span>
        </div>
      </div>
    </div>
    <!-- <div class="phoneBottom">
      <img src="static/img/goods/phone/meng_zhuan_tab.png" alt="">
    </div> -->
  </div>
</template>
<script>
export default {
  data(){
    return{
    }
  },
  props:{
    activeadd:{
      type: Object
    }
  }

}
</script>

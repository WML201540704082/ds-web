<template>
  <div class="com-product">
    <el-carousel height="375px">
      <el-carousel-item v-for="(item, index) in detail.pics" :key="index">
        <img v-if="typeof item === 'string'" class="header-img" :src="'https://' + item" alt="图片"/>
        <img v-else class="header-img" :src="'https://' + item.url" alt="图片"/>
      </el-carousel-item>
    </el-carousel>
    <div class="product-info">
      <div class="name">{{detail.name}}</div>
      <div class="price">￥ {{detail.retailPrice}} 元</div>
      <el-row v-if="detail.type === 'ENTITY'">
        <el-col :span="12" class="product-label">商品品牌：{{detail.brandName}}</el-col>
        <el-col :span="12" class="product-label">适用年龄：{{detail.suitableAge}}</el-col>
        <el-col :span="12" class="product-label">商品产地：{{detail.placeOfOrigin}}</el-col>
        <el-col :span="12" class="product-label">包装方式：{{detail.packingType}}</el-col>
      </el-row>
    </div>
    <div class="product-detail-title">商品详情</div>
    <div class="main-item" :key="item.id" v-for="item in detail.description	">
      <div v-if="item.type === 'TITLE'" class="title">{{item.content}}</div>
      <div v-if="item.type === 'CONTENT'" class="content">{{item.content}}</div>
      <img v-if="item.type === 'IMAGE'" :src="'https://' + item.content" class="pic">
    </div>
  </div>
</template>
<script>
export default {
  name: 'gt-product-detail',
  props: {
    detail: Object
  },
  created() {

  },
  methods: {

  }
}
</script>
<style lang="scss">
.com-product{
  background-color: #fff;
  .no-product{
    text-align: center;
    font-size: 16px;
    padding: 120px 0;
    color: #858585;
  }
  .header-img{
    width: 100%;
  }
  .product-detail-title{
    font-size: 22px;
    color: #333;
    text-align: center;
    height: 50px;
    line-height: 50px;
  }
  .product-info{
    padding: 15px;
    .price{
      color: #f15a24;
      height: 30px;
      line-height: 30px;
      font-size: 18px;
    }
    .name{
      display:-webkit-box;
      color: #333;
      font-size: 22px;
      margin: 10px 0;
      width: 320px;
      overflow:hidden;
      text-overflow:ellipsis;
      word-wrap:break-word;
      white-space:normal !important;
      -webkit-box-orient:vertical;
      -webkit-line-clamp:2;
    }
    .product-label{
      color: #858585;
      font-size: 12px;
      margin-bottom: 10px;
    }

  }
  .title{
    padding: 0 15px;
    font-size: 16px;
    color: #333;
    margin: 10px 0;
  }
  .content{
    padding: 0 15px;
    font-size: 12px;
    color: #858585;
    line-height: 14px;
    margin: 10px 0;
  }
  .pic{
    width: 100%;
  }
}
</style>

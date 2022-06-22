<template>
  <section class="page-product-view">
    <div class="product-container">
      <div class="phone-container">
        <img class="pic" src="static/img/goods/phone-header.png" alt="头部">
        <gt-product-detail :detail="goods" />
        <img class="pic" src="static/img/goods/phone-product-bottom.png" alt="底部">
      </div>
      <div class="baseinfo-container">
        <el-card>
          <el-form :model="goods" ref="dataForm" label-width="100px" class="viewForm">
            <el-form-item label="启用状态">
              <span class="itemInput">{{filterStatus(goods.saleStatus, productSaleStatus)}}</span>
            </el-form-item>
            <el-form-item label="商品类别">
              <span class="itemInput">{{filterStatus(goods.type, productHaveBulkType)}}</span>
            </el-form-item>
            <el-form-item label="商品名称">
              <span class="itemInput">{{goods.name}}</span>
            </el-form-item>
            <div v-if="goods.type == 'ENTITY'">
              <el-form-item label="规格信息">
                <div class="sku-edit spec-table">
                  <el-table v-if="tableList && tableList.length > 0" :data="tableList" border style="width: 100%">
                    <el-table-column :label="item.specKey" :key="item.id" width="100" v-for="(item, index) in tableList[0].specInfo">
                      <template slot-scope="scope">
                        <span>{{tableList[scope.$index].specInfo[index].text}}</span>
                      </template>
                    </el-table-column>
                    <el-table-column prop="barcode" label="商品条码"></el-table-column>
                    <el-table-column prop="stock" label="库存"></el-table-column>
                    <el-table-column
                      prop="newCode"
                      label="自编码"
                    ></el-table-column>
                    <el-table-column prop="pic" label="规格图片">
                      <template slot-scope="scope">
                        <img v-if="scope.row.pic" class="spec-pic" :src="'http://'+scope.row.pic" alt="规格图片" @click="openImgPic('innerPic',scope.row.pic)" />
                      </template>
                    </el-table-column>
                  </el-table>
                </div>
              </el-form-item>
              <el-form-item label="商品分类">
                <span class="itemInput">{{goods.firstCategory}}-{{goods.category}}-{{goods.thirdCategory}}</span>
              </el-form-item>
              <el-form-item label="商品品牌">
                <span class="itemInput">{{goods.brand ? goods.brand.name : '--'}}</span>
              </el-form-item>
              <el-form-item label="单位">
                <span class="itemInput">{{goods.packingType || '--'}}</span>
              </el-form-item>
              <el-form-item label="适用年龄">
                <span class="itemInput">{{goods.suitableAge || '--'}}</span>
              </el-form-item>
              <el-form-item label="商品产地">
                <span class="itemInput">{{goods.placeOfOrigin || '--'}}</span>
              </el-form-item>
              <!-- <el-form-item label="包装方式">
                <span class="itemInput">{{goods.packingType || '--'}}</span>
              </el-form-item> -->
            </div>
            <!-- <el-form-item label="成本价" v-if="(goods.ownership === 'COMPANY' && storeRoleName === '店长' && hasAuthorization) || goods.ownership === 'STORE'"> -->
            <el-form-item label="成本价" v-if="(goods.ownership === 'COMPANY' && storeRoleName === '店长' && hasAuthorization) || (goods.ownership === 'STORE' && storeRoleName === '店长')">
              <span class="itemInput" v-if="goods.ownership === 'COMPANY' && goods.type != 'SERVICE'">{{goods.wholesalePrice || goods.wholesalePrice === 0 ? number(goods.wholesalePrice) : '--'}} 元</span>
              <span class="itemInput" v-else-if="goods.ownership === 'STORE' || (goods.ownership === 'COMPANY' && goods.type == 'SERVICE')">{{goods.costPrice || goods.costPrice === 0 ? number(goods.costPrice) : '--'}} 元</span>
              <span class="itemInput" v-else>--</span>
            </el-form-item>
            <el-form-item label="零售价">
              <span class="itemInput" v-if="goods.retailPrice !== null">{{number(goods.retailPrice)}} 元</span>
              <span class="itemInput" v-else>--</span>
            </el-form-item>
            <el-form-item label="会员价">
              <span class="itemInput" v-if="goods.priceType === 'NONE'">{{number(goods.retailPrice)}} 元</span>
              <span class="itemInput" v-else-if="goods.priceType === 'UNIFIED'">{{number(goods.vipPrice)}} 元</span>
              <div class="sku-edit spec-table" v-else-if="goods.priceType === 'MEMBER'">
                <el-table :data="memberLevelData" border>
                  <el-table-column :prop="item.vipId" min-width="60" :key="item.id" v-for="item in memberLevelList" :label="item.vipName">
                    <template slot="header" slot-scope="scope">
                      <span style="overflow: hidden;">
                        <div class="percent-header-label">{{item.vipName}}</div>
                        <div class="percent-header theme-color">{{item.vipDiscount}}%</div>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <div class="sku-edit spec-table" v-else-if="goods.priceType === 'CUSTOMER'">
                <el-table :data="customerMemberData" border>
                  <el-table-column min-width="60" label="会员等级" label-class-name="member-table-column">
                    <template slot-scope="scope">
                      <span>会员价</span>
                    </template>
                  </el-table-column>
                  <el-table-column :prop="item.vipId" width="180" :key="item.id" v-for="item in memberLevelList">
                    <template slot="header" slot-scope="scope">
                      <span style="overflow: hidden;">
                        <div class="percent-header-label">{{item.vipName}}</div>
                        <div class="percent-header theme-color">{{item.vipDiscount}}%</div>
                      </span>
                    </template>
                  </el-table-column>
                </el-table>
              </div>
              <!-- 兼容老数据 -->
              <span class="itemInput" v-else>{{number(goods.vipPrice)}} 元</span>
            </el-form-item>
            <el-form-item label="卡扣技师提成" v-if="goods.type != 'ENTITY' && goods.type != 'BULK'">
              <span class="itemInput">{{goods.serviceCommission || '--'}} 元/件</span>
            </el-form-item>
            <el-form-item label="销售渠道">
              <span class="itemInput">{{goods.saleChannel === 0 ? '线上，线下' : (goods.saleChannel === -1 ? '线上' : '线下' )}}</span>
            </el-form-item>
            <el-form-item label="销售提成">
              <span class="itemInput">{{goods.commissionType === 'FIXED_AMOUNT' ? `${goods.commission}元` : `${goods.commission}%`}}</span>
            </el-form-item>
            <el-form-item label="商品积分" v-if="integral.productStatus && integral.productIntegralType === 'PRODUCT'">
              <span class="itemInput">{{goods.integralPlan ? goods.integralPlan.name : '无'}}</span>
            </el-form-item>
            <el-form-item label="商品主图">
              <span v-if="goods.pics&&goods.pics.length>0">
                <div v-for='(item, index) in goods.pics' :key="index" class="view-img">
                  <img class="theme-border" :src="'http://'+item" alt="" @click="openImgPic('innerPic',item)">
                  <div class="text">显示在第{{index + 1}}张</div>
                </div>
              </span>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="线上商品列表图">
              <span v-if="goods.linePicture">
                <div class="view-img">
                  <img class="theme-border" :src="'http://'+goods.linePicture" alt="" @click="openImgPic('innerPic',goods.linePicture)">
                </div>
              </span>
              <span v-else class="itemInput">--</span>
            </el-form-item>
            <el-form-item label="直播商品图片">
              <span v-if="goods.livePicture">
                <div class="view-img">
                  <img class="theme-border" :src="'http://'+goods.livePicture" alt="" @click="openImgPic('innerPic',goods.livePicture)">
                </div>
              </span>
              <span v-else class="itemInput">--</span>
            </el-form-item>
          </el-form>
        </el-card>
      </div>
    </div>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic"></gt-show-pic>
  </section>
</template>
<script>
import gtProductDetail from "./goods-detail";
import NP from "number-precision";
import { levelList } from "@/service/mycustomer";
import {
  companyLevel,
  companyType,
  companyStatus,
  productHaveBulkType,
  productSaleStatus
} from "@/utils/dict";
import { getGoodsDetail } from "@/service/goods";
import { filterStatus } from "@/utils";
import { number } from "@/utils/validate";
import { integralPlanDetail } from "@/service/integral";
export default {
  name: "goods-view",
  data() {
    return {
      hasAuthorization: false,
      goods: {
        storeNames: [],
        pricePlans: [],
        retailPrice: 0
      },
      productSaleStatus,
      storeRoleName: "",
      integral: {},
      memberLevelList: [], // 会员等级
      number,
      showImgPic: null,
      productHaveBulkType,
      filterStatus
    };
  },
  components: {
    gtProductDetail
  },
  computed: {
    tableList() {
      if (this.goods.skus && this.goods.skus.length > 0) {
        return this.goods.skus.map(item => {
          const temp = {
            ...item,
            specInfo: item.specInfo ? JSON.parse(item.specInfo) : []
          };
          return temp;
        });
      } else {
        return [];
      }
    },
    // 会员等级数量
    memberLevelData() {
      let percent = {};
      let price = {};
      this.memberLevelList.forEach(item => {
        price[item.vipId] = NP.times(
          NP.divide(item.vipDiscount, 100),
          this.goods.retailPrice
        )
          .toString()
          .match(/^\d+(?:\.\d{0,2})?/);
      });
      return [price];
    },
    // 自定义会员等级
    customerMemberData() {
      let price = {};
      // this.goods.pricePlans.forEach(item => {
      //   price[item.mark] = item.price
      // })
      this.memberLevelList.forEach(item => {
        const pricePlan = this.goods.pricePlans.find(
          ele => ele.mark === item.vipId
        );
        if (pricePlan) {
          price[item.vipId] = pricePlan.price;
        } else {
          price[item.vipId] = this.goods.retailPrice
            ? this.goods.retailPrice
            : 0;
        }
      });
      return [price];
    }
  },
  methods: {
    /**
     * 获取商品详情
     * @id 商品编码
     */
    async init(id) {
      const data = await getGoodsDetail(id);

      const commissionType = data.commissionPlan
        ? data.commissionPlan.commissionType
        : null;

      // 商品会员价
      let pricePlans = [];
      if (data.pricePlans && data.pricePlans.length > 0) {
        pricePlans = data.pricePlans.map(item => {
          const memberItem = this.memberLevelList.find(
            ele => ele.vipId === item.mark
          );
          return {
            ...memberItem,
            ...item,
            price: this.priceNum(item.price)
          };
        });
      }
      this.goods = {
        ...data,
        pricePlans,
        pics: data.pics && data.pics.split(","),
        commission: data.commissionPlan
          ? this.priceNum(data.commissionPlan.commission)
          : 0,
        commissionType,
        serviceCommission: data.commissionPlan
          ? this.priceNum(data.commissionPlan.technicianVal)
          : 0,
        costPrice: this.priceNum(data.costPrice),
        wholesalePrice: this.priceNum(data.wholesalePrice),
        retailPrice: this.priceNum(data.retailPrice),
        vipPrice: this.priceNum(data.vipPrice)
        // stores
      };
    },
    //图片展示
    openImgPic: function(str, url) {
      if (str === "innerPic") {
        this.showImgPic = "http://" + url;
      } else {
        this.showImgPic = "http://" + this.dataForm[str];
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init();
      });
    },
    // 获取会员等级
    async getLevelList() {
      const { data } = await levelList();
      if (data.code === 0) {
        this.memberLevelList = data.data;
      } else {
        this.memberLevelList = [];
        this.$message.error(data.msg);
      }
    },

    // 获取积分规则
    async getIntegralPlan() {
      const { data } = await integralPlanDetail();
      if (data.code === 0) {
        this.integral = data.data;
      } else {
        this.$message.error(data.msg);
      }
    }
  },
  async created() {
    const { id } = this.$route.query;
    const { storeRoleName = "", hasAuthorization } = JSON.parse(this.$cookie.get("store-info")) || {};
    this.storeRoleName = storeRoleName;
    this.hasAuthorization = hasAuthorization;
    await this.getLevelList();
    await this.getIntegralPlan();
    this.init(id);
  }
};
</script>
<style lang="scss">
.page-product-view {
  .product-container {
    overflow: hidden;
    .phone-container {
      float: left;
      width: 375px;
    }
    .baseinfo-container {
      float: left;
      width: calc(100% - 400px);
    }
  }
  .member-table-column {
    height: 54px;
    line-height: 38px;
  }
  .percent-header-label {
    float: left;
    padding: 0 !important;
  }
  .percent-header {
    float: left;
    font-size: 10px;
    width: 60px;
    height: 20px;
    line-height: 20px;
    border-radius: 10px;
    text-align: center;
    background-color: #fff !important;
    margin-left: 5px;
    margin-top: 10px;
    padding: 0 !important;
  }
  .el-form-item {
    margin-bottom: 15px !important;
  }
  .view-img {
    float: left;
    margin-right: 15px;
    img {
      width: 150px;
      height: 150px;
      border-radius: 5px;
    }
    .text {
      width: 150px;
      text-align: center;
    }
  }
  .spec-pic {
    width: 50px;
    height: 50px;
  }
  .pic {
    width: 100%;
  }
  .phone-container {
    margin-right: 15px;
  }
}
</style>

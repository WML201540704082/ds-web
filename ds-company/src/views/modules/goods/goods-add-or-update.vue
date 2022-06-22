<template>
  <section class="page-product">
    <div class="product-container">
      <div class="phone-container">
        <img class="pic" src="static/img/goods/phone-header.png" alt="头部">
        <gt-product-detail :detail="goods"/>
        <img class="pic" src="static/img/goods/phone-product-bottom.png" alt="底部">
      </div>
      <div class="baseinfo-container">
        <el-form v-loading="loadingData" ref="goods-form" :rules="dataFormRules" label-width="110px" :model="goods">
          <gt-subtitle title="基本信息" style="display: block;"/>
          <el-card style="margin-top: 10px" class="com-goods-edit">
            <el-form-item label="启用状态" prop="saleStatus">
              <el-switch 
                v-model="goods.saleStatus" 
                active-value="ON" 
                inactive-value="OFF"
              >
              </el-switch>
            </el-form-item>
            <!-- 二代店 -->
            <el-form-item label="商品类别" prop="type" v-if="newStore == 'true'">
              <el-radio-group v-if="id ? false: true" v-model="goods.type"  @change="changestartQuantity">
                <el-radio v-for="item in productHaveBulkType" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
              <span class="category-show" v-else>{{goods.type === 'ENTITY' ? '零售类商品' : goods.type === 'SERVICE' ? '服务类商品' : '散称类商品'}}</span>
            </el-form-item>
            <!-- 非二代店 -->
            <el-form-item label="商品类别" prop="type" v-else>
              <el-radio-group v-if="id ? false: true" v-model="goods.type">
                <el-radio v-for="item in productType" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
              <span class="category-show" v-else>{{goods.type === 'ENTITY' ? '零售类商品' : '服务类商品'}}</span>
            </el-form-item>
            <el-form-item label="商品名称" class="gt-input-tip large" prop="name">
              <el-input v-model="goods.name" :maxlength="30">
                <span slot="prefix">*名称限制30个汉字以内</span>
              </el-input>
            </el-form-item>
            <!-- 零售类商品 -->
            <div v-if="goods.type == 'ENTITY' || goods.type == 'BULK'">
              <el-form-item label="商品规格">
                <goods-spec 
                 v-if="id ? goods.specValues && goods.specValues.length > 0 : specSelect.length > 0" 
                 :id="id" 
                 ref="specComp" 
                 :food="goods.type === 'BULK' ? true : false" 
                 :specSelect="specSelect" 
                 :edit="id ? 'edit' : ''" 
                 :table-list="goods.specValues" 
                 :addOption="addOption" 
                 />
                <router-link v-else to="/goods-goods-specification" style="color: red">去设置</router-link>
              </el-form-item>
              <el-form-item label="商品分类" class="goods-add-container" prop="category" v-if="isAuth('product:category:select')">
                <el-form-item prop="firstCategoryId" class="inline-input">
                  <el-select v-model="goods.firstCategoryId" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
                    <el-option v-for="item in mainOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <el-form-item prop="categoryId" class="inline-input">
                  <el-select v-model="goods.categoryId" @change="changeSecondCatetory" placeholder="请选择二级分类" v-if="isAuth('product:category:select:parentId')" clearable>
                    <el-option value="" disabled label="请选择二级分类"></el-option>
                    <el-option v-for="item in secondOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                    <span v-show="goods.firstCategoryId" class="goods-spec-create" @click="addSubcategoryOption">
                      <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
                      新增二级分类
                    </span>
                  </el-select>
                </el-form-item>
                <el-form-item prop="thirdCategoryId" class="inline-input" v-if="thirdOptions.length>0 || goods.thirdCategoryId">
                  <el-select v-model="goods.thirdCategoryId" placeholder="请选择三级分类" clearable>
                    <el-option value="" disabled label="请选择三级分类"></el-option>
                    <el-option v-for="item in thirdOptions" :key="item.id" :label="item.name" :value="item.id">
                    </el-option>
                  </el-select>
                </el-form-item>
                <!-- <div class="category-tip">*请选择准确的商品类目， 商品新增后不可修改</div> -->
              </el-form-item>
              <el-form-item label="商品品牌" prop="brandId">
                <el-select filterable v-model="goods.brandId" @change="changeBrand" placeholder="请选择商品品牌">
                  <el-option value="" disabled label="请选择商品品牌"></el-option>

                  <el-option v-for="item in brands" :key="item.id" :value="item.id" :label="item.name"></el-option>
                  <span class="goods-spec-create" @click="addBrandOption">
                    <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
                    新增品牌
                  </span>
                </el-select>
              </el-form-item>
               <el-form-item label="单位" prop="packingType" v-if="goods.type == 'ENTITY' && newStore == 'true'">
                  <el-input v-model="goods.packingType" :maxlength="50" placeholder="请输入商品最小销售单位"></el-input>
               </el-form-item>
            </div>
            <el-form-item label="成本价" class="gt-input-tip large" prop="costPrice" :rules="[{required: goods.type == 'ENTITY' || goods.type == 'BULK', message:'请填写商品成本价'}, {validator: validateCost, trigger: 'blur' }]">
              <el-input v-model="goods.costPrice" :placeholder="tip">
                <span slot="prefix">
                  <span class="unit">元</span>*商品的进货价</span>
              </el-input>
            </el-form-item>

            <div v-if="goods.type == 'ENTITY' || goods.type == 'BULK'">
              <el-form-item label="配送价" style="margin-bottom: 18px;" class="gt-input-tip large" prop="wholesalePrice">
                <el-input v-model="goods.wholesalePrice" :placeholder="tip">
                  <span slot="prefix">
                    <span class="unit">元</span>*商品对于门店的配送价</span>
                </el-input>
              </el-form-item>
              <div class="price-tip">单店模式：配送价=成本价； 其它模式：请按实际情况设置</div>
            </div>

            <el-form-item label="零售价" class="gt-input-tip large" prop="retailPrice">
              <el-input v-model="goods.retailPrice" :placeholder="tip">
                <span slot="prefix">
                  <span class="unit">元</span>*商品针对普通消费者的实际销售价格</span>
              </el-input>
            </el-form-item>

            <el-form-item v-if="newStore=='true'&& goods.type == 'BULK'" label="起订数量" class="gt-input-tip large" prop="startQuantity">
              <el-input v-model="goods.startQuantity" :placeholder="tip" >
                  <span slot="prefix">
                  <span class="unit">kg</span></span>
              </el-input>
            </el-form-item>
            <el-form-item v-if="newStore=='true'&& goods.type == 'ENTITY'" label="起订数量" prop="startQuantity" class="gt-input-tip">
                  <el-input v-model.number="goods.startQuantity" placeholder="请输入起订数量" maxlength="15">
                    <span slot="prefix" style="left: 210px;">如：1(只能输入正整数)</span></el-input>
              </el-form-item>
            
            <el-form-item label="销售门店" prop="storeIds">
              <span>{{goods.storeNames}}</span>
              <span v-show="this.type === 'company'" class="selectSale theme-background" @click="selectSalestore">选择门店</span>
            </el-form-item>
            <el-form-item label="卡扣技师提成" class="gt-input-tip service-commission-label" v-if="goods.type != 'ENTITY' && goods.type != 'BULK'" prop="serviceCommission">
              <el-input v-model="goods.serviceCommission" placeholder="请填写提成金额">
                <span slot="prefix">
                  <span class="unit">元</span>*以礼品卡的方式消费时，技师的提成金额</span>
              </el-input>
            </el-form-item>
            <el-form-item label="销售渠道" prop="saleChannel">
              <el-checkbox-group v-if="goods.type != 'BULK'" v-model="goods.saleChannel">
                <el-checkbox v-for="item in saleChannel" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
              <el-checkbox-group v-else v-model="goods.saleChannel">
                <el-checkbox v-for="item in saleOnlyOneChannel" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-checkbox>
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="云店营销版显示" v-if="newStore == 'true'" prop="isShowMarketing">
              <el-radio-group  v-model="goods.isShowMarketing">
                <el-radio v-for="item in isShowMarketing" :key="item.value" :label="item.value">
                  {{item.label}}
                </el-radio>
              </el-radio-group>
            </el-form-item>
            <div class="more-detail-control" @click="changeDetail">
              <div class="base-line"></div>
              <div class="middle-info theme-color">完善更多商品信息
                <icon-svg class="down-arrow" :class="{'up': showDetail}" name="double-arrow"></icon-svg>
              </div>
              <div class="base-line"></div>
            </div>
            <div v-show="showDetail">
              <el-form-item label="销售提成" v-if="goods.type != 'BULK'" prop="commissionType">
                <el-radio-group v-model="goods.commissionType">
                  <el-radio label="RATIO">按比例</el-radio>
                  <el-radio label="FIXED_AMOUNT">按固定金额</el-radio>
                  <div class="category-tip commission">(若按比例提成，商品销售提成=商品实收金额 * 提成比例)</div>
                </el-radio-group>
                <el-form-item class="gt-input-tip" prop="commission">
                  <el-input v-model="goods.commission" placeholder="请填写提成数值">
                    <span slot="prefix">
                      <span class="unit">{{goods.commissionType === 'RATIO' ? '%' : '元'}}</span>
                    </span>
                  </el-input>
                </el-form-item>
              </el-form-item>
              <el-form-item v-if="integral.productStatus && integral.productIntegralType === 'PRODUCT' && goods.type != 'BULK'" label="商品积分" prop="integralPlanId" class="inline-input">
                <el-select v-model="goods.integralPlanId" placeholder="请选择积分规则" clearable>
                  <el-option label="无" value=""></el-option>
                  <el-option v-for="item in rules" :key="item.id" :label="item.name" :value="item.id">
                  </el-option>
                  <span class="goods-spec-create" @click="addIntegralOption">
                    <icon-svg name="create" class="theme-color" style="font-size: 22px;vertical-align: middle;"></icon-svg>
                    新增积分规则
                  </span>
                </el-select>
              </el-form-item>
              <el-form-item label="会员价方案" prop="priceType">
                <el-radio-group class="member-radio" v-model="goods.priceType" @change="changePriceType">
                  <el-radio label="NONE">
                    <div class="member-label">会员无优惠</div>
                    <el-form-item class="gt-input-tip">
                      <el-input v-model="goods.retailPrice" disabled>
                        <span slot="prefix">
                          <span class="unit">元</span>
                        </span>
                      </el-input>
                    </el-form-item>
                  </el-radio>
                  <el-radio label="UNIFIED">
                    <div class="member-label">统一会员价</div>
                    <el-form-item class="gt-input-tip" prop="vipPrice">
                      <el-input v-model="goods.vipPrice" :placeholder="tip">
                        <span slot="prefix">
                          <span class="unit">元</span>
                        </span>
                      </el-input>
                    </el-form-item>
                  </el-radio>
                  <el-radio label="MEMBER" class="radio-table" :disabled="!memberLevelList || memberLevelList.length === 0">
                    <div>等级会员价</div>
                    <el-form-item class="gt-input-tip" prop="memberSwitch">
                      <el-switch :disabled="!memberLevelList || memberLevelList.length === 0" v-model="goods.memberSwitch" @change="changeMemberType">
                      </el-switch>
                      <span>手动设置</span>
                      <span class="tip-prefix">*打开【手动设置】开关，可对各等级的会员价进行手动设置</span>
                    </el-form-item>
                    <div class="sku-edit spec-table" v-show="memberLevelList && memberLevelList.length > 0">
                      <el-table :data="memberLevelData" border>
                        <el-table-column min-width="100" label="会员等级" label-class-name="member-table-column">
                          <template slot-scope="scope">
                            <span>会员价</span>
                          </template>
                        </el-table-column>
                        <el-table-column :prop="item.vipId" :key="item.id" width="180" v-for="item in memberLevelList" :label="item.vipName">
                          <template slot="header" slot-scope="scope">
                            <span style="overflow: hidden;">
                              <div class="percent-header-label">{{item.vipName}}</div>
                              <div class="percent-header theme-color">{{item.vipDiscount}}%</div>
                            </span>
                          </template>
                          <template slot-scope="scope">
                            <el-input v-show="goods.memberSwitch" v-model="scope.row[item.vipId]" />
                            <span v-show="!goods.memberSwitch">{{scope.row[item.vipId]}}</span>
                          </template>
                        </el-table-column>
                      </el-table>
                    </div>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <div v-if="goods.type == 'ENTITY' || goods.type == 'BULK'">
                <el-form-item label="商品属性" class="goods-add-container">
                  <el-form-item prop="suitableAge" class="inline-input">
                    <el-input v-model="goods.suitableAge" :maxlength="50" placeholder="请输入商品适应年龄"></el-input>
                  </el-form-item>
                  <el-form-item prop="placeOfOrigin" class="inline-input">
                    <el-input v-model="goods.placeOfOrigin" :maxlength="50" placeholder="请输入商品产地"></el-input>
                  </el-form-item>
                </el-form-item>
              </div>
              
              <el-form-item label="商品主图" prop="pics">
                <gt-image-upload showIndex :names="0" :more-real="goods.pics" tip="(建议尺寸750px*750px，单张大小不超过5M，最多6张)" :multiple="true" :max="6" />
              </el-form-item>
              <el-form-item label="线上商品列表图" prop="linePicture">
                <gt-image-upload :names="1" :reallist="goods.linePicture" :cb="value => goods.linePicture = value + (value ? '?x-oss-process=image/resize,m_lfit,h_200,w_200,limit_0' : '')" tip="(建议尺寸200px*200px，单张大小不超过5M，最多1张)" :multiple="true" :max="1" />
              </el-form-item>
              <el-form-item label="直播商品图片" prop="livePicture">
                <gt-image-upload :names="2" :reallist="goods.livePicture" :cb="value => goods.livePicture = value + (value ? '?x-oss-process=image/resize,m_lfit,h_300,w_300,limit_0' : '')" tip="(建议尺寸300px*300px，单张大小不超过5M，最多1张)" :multiple="true" :max="1" />
              </el-form-item>
            </div>
          </el-card>

          <gt-subtitle title="商品详情" style="display: block; margin-top: 20px;" />
          <el-card style="margin-top: 10px" class="com-goods-edit">
            <gt-article-form :array="goods.description" @changeArray="value => changeArray(value)" />
            <el-button type="primary" @click="addGroup" style="margin: 0 0 20px 120px;">
              <img class="gt-icon-add" src="static/img/goods/add.png" /> 再添加一组
            </el-button>
          </el-card>
        </el-form>
      </div>
    </div>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="handleUpdate" txt="保存" />
      <gt-button size="large" v-if="!id" :loading="loading" @click.native="() => handleUpdate('again')" txt="保存并继续新增" />
    </div>
    <gt-dialog-checkbox ref="checkboxs" :double="id?false:true" cancel :initSelectList="initSelectList" @list="listBox" />
    <add-or-update ref="addOrUpdate" @refreshDataList="getSpecKey"></add-or-update>
    <brand-modal ref="brandModal" @refreshBrand="getBrandList"></brand-modal>
    <integral-modal ref="integralModal" @refreshRuleList="getIntegralRule"></integral-modal>
    <subcategory-modal ref="subcategoryModal" @refreshSubcategory="categoryId => getSubCategoryList(goods.firstCategoryId, categoryId)" />
  </section>
</template>
<script>
// import gtSubTitle from '@/components/gt-sub-title'
import { mapState, mapMutations } from "vuex";
import NP from "number-precision";
import {
  companyLevel,
  companyType,
  companyStatus,
  productType,
  productHaveBulkType,
  saleChannel,
  saleOnlyOneChannel,
  memberPriceType,
  productSaleStatus,
  isShowMarketing
} from "@/utils/dict";
import gtImageUpload from "@/components/gt-image-upload";
import gtArticleForm from "@/components/gt-article-form";
import gtSubtitle from "@/components/gt-sub-title";
import * as api from "@/service/goods";
import { levelList } from "@/service/mycustomer";
import { filterStatus } from "@/utils";
import _ from "lodash";
import { getStore } from '@/utils/storage'
import {
  isMobile,
  validatenull,
  priceRange,
  isName,
  limitInputName,
  twoDecimal
} from "@/utils/validate";
import gtDialogCheckbox from "@/components/gt-dialog-checkbox";
import goodsSpec from "./components/goods-spec";
import addOrUpdate from "./components/goods-specification-modal";
import brandModal from "./components/goods-brand-setting-modal";
import subcategoryModal from "./commission/subcategory-add-or-update";
import integralModal from "../campaign/intergralExchange/integral-rule-list-modal";
import gtProductDetail from "./goods-detail";
import { integralPlanSelect, integralPlanDetail } from "@/service/integral";
export default {
  name: "goods-add-or-update",
  data() {
    const validateName = (rule, value, callback) => {
      if (limitInputName(value, 60) == 1) {
        callback(new Error("商品名称不能超过30个汉字"));
      } else {
        callback();
      }
    };
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (
          this.goods.commissionType === "RATIO" &&
          !priceRange(value, 100, 0)
        ) {
          callback(new Error("请输入0-100数字，最多保留小数点后两位"));
        } else if (
          this.goods.commissionType === "FIXED_AMOUNT" &&
          !priceRange(value, 1000, 0)
        ) {
          callback(new Error("请输入0-1000数字，最多保留小数点后两位"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateCost = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99, 0)) {
          callback(
            new Error("请输入0.00-499999.99的价格数字，最多保留小数点后两位")
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateCostQuantity = (rule, value, callback) => {
      if (value && this.goods.type=='BULK') {
        if (!priceRange(value, 499999.99, 0)) {
          callback(
            new Error("请输入0.00-499999.99的价格数字，最多保留小数点后两位")
          );
        } else {
          callback();
        }
      } 
      if (value && this.goods.type =='ENTITY') {
        if (!priceRange(value, 499999, 0)) {
          callback(
            new Error("请输入正整数且小于499999")
          );
        } else {
          callback();
        }
      }
      else {
        callback();
      }
    };
    const validateMemberPrice = (rule, value, callback) => {
      if (this.goods.priceType === "UNIFIED") {
        if (value) {
          if (!priceRange(value, 499999.99)) {
            callback(
              new Error("请输入0.01-499999.99的价格数字，最多保留小数点后两位")
            );
          } else {
            callback();
          }
        } else {
          callback(new Error("请输入统一会员价"));
        }
      } else {
        callback();
      }
    };
    const validateDiscount = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 100, 0)) {
          callback(new Error("请输入0-100数字，最多保留小数点后两位"));
        } else {
          callback();
        }
      } else {
        callback();
      }
    };
    const validateStore = (rule, value, callback) => {
      if (!value || (value instanceof Array && value.length === 0)) {
        this.$message.warning("请选择门店");
      } else {
        callback();
      }
    };

    const validateDec = (rule, value, callback) => {
      if (!twoDecimal(value)) {
        callback(new Error("请输入大于等于零的两位小数"));
      } else {
        callback();
      }
    };
    const validateServiceCommission = (rule, value, callback) => {
      if (value) {
        // if (!priceRange(value, this.goods.retailPrice, 0)) {
        //   callback(new Error('请输入小于等于零售价的数字，最多保留小数点后两位'))
        // } else {
        //   callback()
        // }
        if (!priceRange(value, 499999.99, 0)) {
          callback(
            new Error("请输入0.00-499999.99的价格数字，最多保留小数点后两位")
          );
        } else {
          callback();
        }
      } else {
        callback();
      }
    };

    const validateCategory = (rule, value, callback) => {
      if (!this.goods.categoryId) {
        callback(new Error("请选择商品分类"));
      } else {
        callback();
      }
    };

    return {
      type: "company", // company 企业统管商品 store 门店自营商品
      // 一级分类选项
      mainOptions: [],
      // 二级分类选项
      secondOptions: [],
      // 三级分类选项
      thirdOptions: [],
      // 商品详情
      loadingData: false,
      // 规格参数
      specSelect: [],
      initSelectList: [],
      productType,
      productHaveBulkType,
      specCb: null, // 修改规格值的回调方法
      saleChannel,
      isShowMarketing,
      saleOnlyOneChannel,
      brands: [], // 品牌列表
      id: "",
      memberLevelList: [], // 会员等级
      rules: [],
      backendPriceType: null,
      validateCost,
      showDetail: false,
      productSaleStatus,
      goods: {
        isShowMarketing:"",
        saleStatus: "ON",
        saleChannel: [1],
        type: "ENTITY",
        pics: [],
        linePicture: "",
        livePicture: "",
        firstCategoryId: null,
        categoryId: null,
        thirdCategoryId: null,
        brandId: "",
        suitableAge: null,
        placeOfOrigin: null,
        packingType: null,
        name: null,
        costPrice: null,
        commissionType: "RATIO",
        retailPrice: null,
        vipPrice: null,
        priceType: "NONE",
        storeIds: null,
        storeNames: "",
        commission: 0,
        serviceCommission: 0,
        memberSwitch: false,
        description: [],
        integralPlanId: ""
      },
      integral: {}, // 积分规则
      storeList: [],
      tip: "只能填写数字，可支持两位小数",
      dataFormRules: {
        type: [{ required: true, message: "请填写商品类别" }],
        saleChannel: [{ required: true, message: "请填写选择销售渠道" }],
        brandId: [{ required: true, message: "请填写选择商品品牌" }],
        packingType: [{ required: true, message: "请填写商品包装单位" }],
        name: [
          { required: true, message: "请填写商品名称" },
          { validator: validateName, trigger: "blur" }
        ],
        // costPrice:[{validator: validateCost, trigger: 'blur' }],
        wholesalePrice: [
          { required: true, message: "请输入商品配送价" },
          { validator: validateCost, trigger: "blur" }
        ],
        retailPrice: [
          { required: true, message: "请输入商品零售价" },
          { validator: validateCost, trigger: "blur" }
        ],
        startQuantity: [
          { validator: validateCostQuantity, trigger: "blur" }
        ],
        vipPrice: [{ validator: validateMemberPrice, trigger: "blur" }],
        memberPriceType: [{ required: true, message: "请选择会员类型" }],
        storeIds: [{ required: true, validator: validateStore }],
        commissionType: [{ message: "请选择提成类型" }],
        category: [
          {
            required: true,
            validator: validateCategory,
            message: "请选择商品分类"
          }
        ],
        firstCategoryId: [{ required: true, message: "请选择商品分类" }],
        categoryId: [{ required: true, message: "请选择商品分类" }],
        serviceCommission: [
          { required: true, message: "请输入金额" },
          { validator: validateServiceCommission, trigger: "blur" }
        ],
        // amount: [{required: true, message: '请输入金额'}, {validator: validatePrice, trigger: 'blur' }],
        // discount: [{required: true, message: '请输入比例'}, {validator: validateDec, trigger: 'blur' }],
        commission: [
          { required: true, message: "请输入提成比例" },
          { validator: validatePrice, trigger: "blur" }
        ]
        // integralPlanId: [{required: true, message: '请选择积分规则'}]
      },
      showStoreName: ""
    };
  },
  computed: {
    ...mapState({
      // loading: state => state.loading['/product/company/product/add']
      loading: state => state.loading.global,
      tempGoods: state => state.goods.info
    }),
    // 会员等级数量
    memberLevelData() {
      let price = {};
      if (this.memberLevelList && this.memberLevelList.length > 0) {
        this.memberLevelList.forEach(item => {
          // 自定义会员价
          if (this.backendPriceType === "CUSTOMER") {
            const pricePlan = this.goods.pricePlans.find(
              ele => ele.mark === item.vipId
            );
            if (pricePlan) {
              price[item.vipId] = this.priceNum(pricePlan.price);
            } else {
              price[item.vipId] = this.goods.retailPrice
                ? this.goods.retailPrice
                : 0;
            }
          } else {
            price[item.vipId] = NP.times(
              NP.divide(item.vipDiscount || 0, 100),
              this.goods.retailPrice || 0
            ).toFixed(2);
          }
        });
      }
      return [price];
    }
  },
  inject: ["reload"],
  components: {
    gtDialogCheckbox,
    goodsSpec,
    addOrUpdate,
    gtSubtitle,
    gtImageUpload,
    gtArticleForm,
    gtProductDetail,
    brandModal,
    integralModal,
    subcategoryModal
  },
  methods: {
    ...mapMutations({
      saveInfo: "goods/SAVE"
    }),
    // 修改商品启用状态
    async changeProductStatus() {
      if (this.id) {
        const { data } = await api.batchStatus({
          id: this.id,
          status: this.goods.saleStatus === "ON"
        });
        if (data.code === 0) {
          return true;
        } else {
          this.$message.error(data.msg);
          return false;
        }
      } else {
        return true;
      }
    },
    // 获取分类提成
    async getGoodsCommission() {
      const { data } = await api.getCommission({
        firstCategoryId: this.goods.firstCategoryId,
        categoryId: this.goods.categoryId,
        brandId: this.goods.brandId
      });
      if (data.code === 0) {
        this.goods.commissionType = data.data.commissionType;
        this.goods.commission = this.priceNum(data.data.commission);
      } else {
        this.$message.error(data.msg);
      }
    },

    changeDetail() {
      this.showDetail = !this.showDetail;
    },

    // 选择门店
    selectSalestore() {
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList);
      });
    },

    // 添加一组
    addGroup() {
      this.goods.description.push({
        type: "TITLE",
        content: ""
      });
      this.goods.description.push({
        type: "CONTENT",
        content: ""
      });
      this.goods.description.push({
        type: "IMAGE",
        content: ""
      });
    },

    // 改变品牌积分
    changeBrand(value) {
      const brand = this.brands.find(ele => ele.id == value);
      if (brand) {
        this.goods.brandName = brand.name;
      }
      if (
        this.goods.firstCategoryId &&
        this.goods.categoryId &&
        this.goods.brandId
      ) {
        this.getGoodsCommission();
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
    },
    changestartQuantity(value){
    this.goods.startQuantity = null
    },
    changeArray(array) {
      this.goods.description = array;
    },
    //弹框复选
    listBox(obj) {
      var obj1 = JSON.parse(obj);
      this.storeList = obj1;
      var storeVal = [];
      var storeIds = [];
      for (var i in obj1) {
        if (obj1[i].name) {
          storeVal.push(obj1[i].name);
        }
        storeIds.push(obj1[i].id);
      }
      this.goods.storeNames = storeVal.join(",");
      this.goods.storeIds = storeIds;
    },

    // 添加规格参数
    addOption(data, cb) {
      this.$nextTick(() => {
        this.specCb = cb;
        this.$refs.addOrUpdate.init(data);
      });
    },

    // 添加商品品牌
    addBrandOption() {
      this.$nextTick(() => {
        this.$refs.brandModal.init();
      });
    },

    // 添加积分规则
    addIntegralOption() {
      this.$nextTick(() => {
        this.$refs.integralModal.init();
      });
    },

    // 添加积分规则
    addSubcategoryOption() {
      const firstCategoryItem = this.mainOptions.find(
        ele => ele.id === this.goods.firstCategoryId
      );
      this.$nextTick(() => {
        this.$refs["subcategoryModal"].init({
          firstCategoryId: firstCategoryItem.id,
          firstCategoryName: firstCategoryItem.name,
          categoryId: null,
          categoryName: null
        });
      });
    },

    // 获取积分规则
    async getIntegralRule() {
      const { data } = await integralPlanSelect();
      if (data.code === 0) {
        this.rules = data.data;
      } else {
        this.$message.error(data.msg);
      }
    },

    // 检查规格参数是否填写完整
    checkSpecs(barList = [], specItemOne, specItemTwo) {
      let flag = true;
      for (var i = 0; i < barList.length; i++) {
        // 检查规格
        const item = barList[i];
        for (let j = i+1; j < barList.length; j++) {
          const newItem = barList[j]
          if (item.newCode === newItem.newCode && item.newCode && newItem.newCode) {
            this.$message.warning(`自编码不能重复！`);
            flag = false;
            break;
          }
        }
        if (this.newStore == 'true') {
          for (let j = i+1; j < barList.length; j++) {
            const newItem = barList[j]
            if (item.jdyCode === newItem.jdyCode) {
              this.$message.warning(`精斗云编码不能重复！`);
              flag = false;
              break;
            }
          }
        }
        if (specItemOne && !item.specOne) {
          this.$message.warning(`请将规格-${specItemOne.name}填写完整！`);
          flag = false;
          break;
        }
        if (specItemTwo && !item.specTwo) {
          this.$message.warning(`请将规格-${specItemTwo.name}填写完整！`);
          flag = false;
          break;
        }

        var CS = /[^\u4e00-\u9fa5a-zA-Z0-9]/;
        var DS = /^[0-9a-zA-Z]*$/g;
        // 检查条码
        if (!item.barcode) {
          this.$message.warning("规格信息中“商品条码”必填！");
          flag = false;
          break;
        } else if (CS.test(item.barcode)) {
          this.$message.warning("规格信息中“商品条码”不能输入特殊字符");
          flag = false;
          break;
        }
        if (this.newStore == 'true' && item.jdyCode) {
          if (item.jdyCode.split('').length > 8) {
            this.$message.warning("规格信息中“精斗云编码”只能8位以内！");
            flag = false;
            break;
          }
        }else if (this.newStore == 'true' && !item.jdyCode) {
          this.$message.warning("规格信息中“精斗云编码”必填！");
          flag = false;
          break;
        }
        if (!DS.test(item.jdyCode)) {
          this.$message.warning("规格信息中“精斗云编码”只能输入字母，数字或字母数字组合");
          flag = false;
          break;
        }
        // 新增商品-检查库存
        if (!this.id) {
          const reg = /^\d+$/;
          const bulkReg = /^(0|[1-9]\d*)(\s|$|\.\d{1,3}\b)/
          if (this.goods.type === 'BULK') {
            if (item.stock || item.stock == 0) {
              if (!bulkReg.test(item.stock)) {
                this.$message.warning(
                  "规格信息中“商品库存”请填写最多三位小数的正值！"
                );
                flag = false;
                break;
              } else if (item.stock > 99999) {
                this.$message.warning(
                  "规格信息中“商品库存”请填写小于等于99999的整数！"
                );
                flag = false;
                break;
              }
            } else {
              this.$message.warning("规格信息中“商品库存”必填！");
              flag = false;
              break;
            }
          } else {
            if (item.stock || item.stock == 0) {
              if (!reg.test(item.stock)) {
                this.$message.warning(
                  "规格信息中“商品库存”请填写大于等于0的整数！"
                );
                flag = false;
                break;
              } else if (item.stock > 99999) {
                this.$message.warning(
                  "规格信息中“商品库存”请填写小于等于99999的整数！"
                );
                flag = false;
                break;
              }
            } else {
              this.$message.warning("规格信息中“商品库存”必填！");
              flag = false;
              break;
            } 
          }
          if (item.newCode) {
            if (item.newCode.split('').length != 10) {
              this.$message.warning("规格信息中“自编码”只能十位！");
              flag = false;
              break;
            }
          }
        }
      }
      return flag;
    },

    changeMemberType(value) {
      if (!value) {
        this.getLevelList();
      }
    },

    changePriceType(value) {
      if (value !== "MEMBER") {
        if (this.goods.memberSwitch) {
          this.goods.memberSwitch = false;
        }
        this.getLevelList();
      }
    },

    // 检查会员价方案
    checkMemberPrice() {
      if (this.goods.priceType === "MEMBER" && this.goods.memberSwitch) {
        const memberPriceItem =
          this.memberLevelData && this.memberLevelData.length > 0
            ? this.memberLevelData[0]
            : null;
        if (memberPriceItem) {
          const keys = Object.keys(memberPriceItem);
          let flag = true;
          for (var i = 0; i < keys.length; i++) {
            const value = memberPriceItem[keys[i]];
            if (value) {
              if (!priceRange(value, 499999.99)) {
                this.$message.warning(
                  "会员价请输入0.01-499999.99的价格数字，最多保留小数点后两位！"
                );
                flag = false;
                break;
              }
            } else {
              this.$message.warning("请手动设置会员价！");
              flag = false;
              break;
            }
          }
          return flag;
        } else {
          this.$message.warning("请先在顾客模块中设置会员等级！");
          return false;
        }
        return true;
      } else {
        return true;
      }
    },

    handleUpdate(createType) {
      const handleSubmit = async () => {
        this.dataListLoading = true;
        let specInfoList = [];
        if (this.goods.type === "ENTITY" || this.goods.type === "BULK") {
          /** 新交互方式处理逻辑 */
          const { barList = [], specItemOne, specItemTwo } =
            this.$refs["specComp"] || {};
          if (!this.checkSpecs(barList, specItemOne, specItemTwo)) {
            return;
          }
          if (barList && barList.length > 0) {
            specInfoList = barList.map(item => {
              let { barcode, pic, stock, specOne, specTwo,newCode,jdyCode } = item;
              let specValueIds = [];
              if (specOne) {
                specValueIds.push(specOne);
              }
              if (specTwo) {
                specValueIds.push(specTwo);
              }
              return {
                specValueIds,
                barcode,
                stock:(this.goods.type === "BULK" && !this.id) ? stock*1000 : stock,
                newCode,
                jdyCode,
                pic
              };
            });
          }
        } else {
          // 清空已填零售类信息
          this.goods.firstCategoryId = null;
          this.goods.categoryId = null;
          this.goods.brandId = "";
          this.goods.brandName = null;
          this.goods.suitableAge = null;
          this.goods.placeOfOrigin = null;
          this.goods.packingType = null;
          this.goods.wholesalePrice = null;
        }

        // 转换pricePlans
        let pricePlans = this.goods.pricePlans;
        let priceType = this.goods.priceType;
        if (this.goods.priceType === "MEMBER" && this.goods.memberSwitch) {
          pricePlans = Object.keys(this.memberLevelData[0]).map(key => {
            const value = this.memberLevelData[0][key];
            const item = this.memberLevelList.find(ele => ele.vipId === key);
            if (item) {
              return {
                key,
                name: item.vipName,
                val: this.priceNum(value, "out")
              };
            } else {
              return null;
            }
          });
          priceType = "CUSTOMER";
        }

        // 转换门店
        const storeIds = this.storeList.map(item => Number(item.id));
        if (this.goods.specList) {
          delete this.goods.specList;
        }
        let pics = this.goods.pics
          .map(item => {
            return item.url;
          })
          .join(",");
        let saleChannel = null;
        if (this.goods.saleChannel && this.goods.saleChannel.length === 2) {
          saleChannel = 0;
        } else if (
          this.goods.saleChannel &&
          this.goods.saleChannel.length === 1
        ) {
          saleChannel = this.goods.saleChannel[0];
        }
        // 分类
        let submitData = {
          ...this.goods,
          id: this.id,
          pics,
          saleChannel,
          ownership: "COMPANY",
          pricePlans,
          priceType,
          cover:
            this.goods.pics && this.goods.pics.length > 0
              ? this.goods.pics[0].url
              : null,
          livePicture: this.goods.livePicture //直播图需要强制转化
            ? this.goods.livePicture
            : this.goods.pics && this.goods.pics.length > 0
              ? this.goods.pics[0].url +
                "?x-oss-process=image/resize,m_lfit,h_300,w_300,limit_0"
              : null,
          linePicture: this.goods.linePicture
            ? this.goods.linePicture
            : this.goods.pics && this.goods.pics.length > 0
              ? this.goods.pics[0].url +
                "?x-oss-process=image/resize,m_lfit,h_200,w_200,limit_0"
              : null,
          // commissionValue: this.goods.commissionType === 'FIXED_AMOUNT' ? this.priceNum(this.goods.amount, 'out') : this.priceNum(this.goods.discount, 'out'),
          costPrice:
            this.goods.costPrice !== null
              ? this.priceNum(this.goods.costPrice, "out")
              : null,
          wholesalePrice:
            this.goods.wholesalePrice !== null
              ? this.priceNum(this.goods.wholesalePrice, "out")
              : null,
          retailPrice: this.priceNum(this.goods.retailPrice, "out"),
          vipPrice: this.priceNum(this.goods.vipPrice, "out"),
          commission: this.priceNum(this.goods.commission, "out"),
          serviceCommission: this.priceNum(this.goods.serviceCommission, "out"),
          saleStores: storeIds,
          specValues: specInfoList,
          startQuantity: this.goods.type =='BULK' ? this.goods.startQuantity*1000 : this.goods.startQuantity
        };
        if (!this.id) {
          // 创建企业
          const data = await api.createGoods(submitData);
        } else {
          // 编辑商品
          const data = await api.updateGoods(submitData);
        }
        this.dataListLoading = false;
        if (createType === "again") {
          const goodsTemp = {
            saleChannel: this.goods.saleChannel,
            type: this.goods.type,
            firstCategoryId: this.goods.firstCategoryId,
            categoryId: this.goods.categoryId
          };
          this.saveInfo(goodsTemp);
          this.reload();

          this.$nextTick(() => {
            $("html,body").animate({ scrollTop: 0 }, 500, "linear");
          });
        } else {
          if (this.type === "company") {
            this.$router.push({ name: "goods-goods" });
          } else {
            this.$router.push({ name: "goods-store-goods" });
          }
        }
      };

      this.$refs["goods-form"].validate(async valid => {
        if (valid && this.checkMemberPrice()) {
          // 判断商品状态
          const flag = await this.changeProductStatus();
          if (!flag) {
            return;
          }
          // 服务类商品卡扣技师提成判断
          if (
            this.goods.type == "SERVICE" &&
            Number(this.goods.serviceCommission) >
              Number(this.goods.retailPrice)
          ) {
            this.$easyConfirm.show({
              title: "提示",
              content: "卡扣技师提成大于零售价，确定要保存吗？",
              confirm: async () => {
                this.$easyConfirm.hide();
                handleSubmit(valid);
              },
              cancel: () => {
                // 定位到卡扣技师提成
                this.$nextTick(() => {
                  let offset = $(".service-commission-label").offset();
                  if (offset) {
                    let top = offset.top - 100;
                    $("html,body").animate({ scrollTop: top }, 500, "linear");
                  }
                });
              }
            });
          } else {
            handleSubmit(valid);
          }
        } else {
          this.$nextTick(() => {
            let offset = $(".el-form-item__error").offset();
            if (offset) {
              let top = offset.top - 140;
              $("html,body").animate({ scrollTop: top }, 500, "linear");
            }
          });
        }
      });
    },

    // 获取企业详细信息
    async getGoodsInfo() {
      this.dataListLoading = true;
      const data = await api.getGoodsDetail(this.id);

      // 获取二级分类
      if (data.firstCategoryId) {
        await this.getSubCategoryList(data.firstCategoryId);
      }
      // 获取三级分类
      if (data.categoryId) {
        const categoryId = data.categoryId
        const thridCategoryData = await api.getSubCategory(categoryId);
        if (thridCategoryData && thridCategoryData.records) {
          this.thirdOptions = thridCategoryData.records;
        }
      }
      // 转换门店
      const storeList = data.storeIds.map((key, index) => {
        return {
          id: key
        };
      });

      // 转换线上线下
      const saleChannel = data.saleChannel === 0 ? [-1, 1] : [data.saleChannel];
      // 商品已保存的门店
      this.initSelectList = storeList;

      // 商品主图
      let pics = [];
      if (data.pics && data.pics.length > 0) {
        pics = data.pics.split(",").map(item => {
          return {
            url: item,
            name: ""
          };
        });
      }

      // 转换规格
      const specValues = data.skus.map(item => {
        return {
          barcode: item.barcode,
          pic: item.pic,
          stock: item.stock,
          newCode: item.newCode,
          jdyCode: item.jdyCode,
          specInfo: item.specInfo
        };
      });

      // 自定义会员价
      let memberSwitch = false;
      let priceType = data.priceType;
      this.backendPriceType = data.priceType; // 保存后端返回的会员价类型
      if (data.priceType === "MEMBER") {
        memberSwitch = false;
      } else if (data.priceType === "CUSTOMER") {
        memberSwitch = true;
        priceType = "MEMBER";
        // let price = {}
        // this.memberLevelList.forEach(item => {
        //   const priceItem = data.pricePlans.find(ele => ele.mark === item.vipId)
        //   price[item.vipId] = priceItem ? this.priceNum(priceItem.price) : null
        // })
        // this.memberLevelData = [price]
      }

      // 商品提成
      const commission = data.commissionPlan
        ? data.commissionPlan.commission
        : 0;
      const commissionType = data.commissionPlan
        ? data.commissionPlan.commissionType
        : null;
      const serviceCommission = data.commissionPlan
        ? data.commissionPlan.technicianVal
        : 0;

      this.goods = {
        ...data,
        brandId: data.brand ? data.brand.id : null,
        priceType,
        memberSwitch,
        pics,
        saleChannel,
        specValues,
        // amount: data.commissionType === 'FIXED_AMOUNT' ? this.priceNum(data.commissionValue) : null,
        // discount: data.commissionType === 'FIXED_AMOUNT' ? null : this.priceNum(data.commissionValue),
        description: data.description ? data.description : [],
        costPrice: this.priceNum(data.costPrice),
        wholesalePrice: this.priceNum(data.wholesalePrice),
        retailPrice: this.priceNum(data.retailPrice),
        vipPrice: this.priceNum(data.vipPrice),
        commission: this.priceNum(commission),
        commissionType,
        serviceCommission: this.priceNum(serviceCommission),
        integralPlanId: data.integralPlan ? data.integralPlan.id : "",
        startQuantity: data.type =='BULK' ? data.startQuantity / 1000 : data.startQuantity
      };
      this.storeList = storeList;
      this.dataListLoading = false;
    },
    // 获取一级分类
    async getMainCategoryList() {
      const data = await api.getMainCategory();
      if (data && data.records) {
        this.mainOptions = data.records;
      }
    },
    // 获取二级分类
    async getSubCategoryList(id, categoryId) {
      this.goods.categoryId = "";
      this.goods.thirdCategoryId = ''
      this.goods.thirdCategory = null
      this.secondOptions = [];
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.secondOptions = data.records;
          if (categoryId) {
            this.$nextTick(() => {
              this.goods = {
                ...this.goods,
                categoryId
              };
            });
          }
        }
      }
    },
    // 获取品牌列表
    async getBrandList() {
      const { data } = await api.brandsList();
      if (data.code === 0) {
        this.brands = data.data;
      } else {
        this.brands = [];
        this.$message.error(data.msg);
      }
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

    async changeSecondCatetory(id) {
      this.goods.thirdCategoryId = ''
      this.goods.thirdCategory = null
      if (this.goods.firstCategoryId && this.goods.categoryId && this.goods.brandId) {
        this.getGoodsCommission();
      }
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.thirdOptions = data.records;
        }
      }
    },
    // 获取企业规格属性
    async getSpecKey() {
      if (this.specCb) {
        this.specCb();
      } else {
        const { data } = await api.getSpecKeyList({
          page: 0,
          size: 10000
        });
        if (
          data.code == 0 &&
          data.data.records &&
          data.data.records.length > 0
        ) {
          this.specSelect = data.data.records;
        } else {
          // this.$message.warning('请先设置商品规格')
          this.specSelect = [];
        }
      }
    }
    //     // 图片
    // updatePicUrl:function(imgoBJ){
    //   this.goods[imgoBJ.str] = imgoBJ.value
    // },
  },
  async created() {
    this.loadingData = true;
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取商品分类
    await this.getMainCategoryList();
    // 获取规格参数
    await this.getSpecKey();
    // 获取品牌列表
    this.getBrandList();

    // 获取商品积分列表
    this.getIntegralRule();
    // 获取积分规则
    await this.getIntegralPlan();
    // 获取会员等级
    await this.getLevelList();
    // 获取企业详情
    const { id, type } = this.$route.query;
    this.type = type;
    if (!id) {
      this.id = "";
      if (this.tempGoods) {
        // 获取二级分类
        if (this.tempGoods.firstCategoryId) {
          await this.getSubCategoryList(this.tempGoods.firstCategoryId);
        }
        this.goods = {
          ...this.goods,
          ...this.tempGoods
        };
      }
    } else {
      this.id = id;
      // 获取企业详情
      await this.getGoodsInfo(id);
    }

    this.loadingData = false;
  }
};
</script>
<style lang="scss">
@import "~@/assets/scss/_variables.scss";
@import "~@/assets/scss/goods/index.scss";
.goods-spec-create {
  width: 100%;
  display: block;
  padding: 5px;
  text-align: center;
  cursor: pointer;
  .create-img {
    width: 20px;
    margin-right: 5px;
  }
}
.page-product {
  .price-tip {
    display: inline-block;
    margin-left: 110px;
    color: #c0c4cc;
    margin-bottom: 15px;
  }
  .product-container {
    overflow: hidden;
    .phone-container {
      float: left;
      width: 375px;
    }
    .baseinfo-container {
      float: left;
      width: calc(100% - 375px);
    }
  }
  .member-table-column {
    height: 54px;
    line-height: 38px;
  }
  .member-radio {
    width: 100%;
    .member-label {
      margin-right: 10px;
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
      background: #fff !important;
      margin-left: 5px;
      margin-top: 10px;
      padding: 0 !important;
    }
    .tip-prefix {
      font-size: 12px;
      color: #c0c4cc;
    }
    .el-radio {
      display: block;
      margin-bottom: 10px;
      .el-radio__input {
        position: absolute;
        top: 10px;
      }
      .el-radio__label {
        display: flex;
        padding-left: 20px;
        line-height: 36px;
        flex-direction: row;
      }
    }
    .el-radio + .el-radio {
      margin-left: 0;
    }
    .radio-table {
      .el-radio__label {
        flex-direction: column;
      }
    }
  }
}
.category-tip {
  height: 30px;
  line-height: 30px;
  color: #c0c4cc;
  font-size: 12px;
  &.commission {
    margin-left: 10px;
    display: inline-block;
  }
}
.category-show {
  font-size: 14px;
  color: $info--main-font-color;
}
.com-goods-edit {
  .gt-input-tip.large {
    .el-input__inner {
      width: 300px;
    }
    .el-input__prefix {
      left: 310px;
    }
  }
}
.gt-icon-add {
  width: 18px;
  height: 18px;
  line-height: 32px;
}
.page-product {
  .el-radio__label {
    font-size: 14px;
  }

  .more-detail-control {
    display: flex;
    cursor: pointer;
    .base-line {
      flex: 1;
      height: 30px;
      border-bottom: 1px solid #dcdcdc;
    }
    .middle-info {
      font-size: 16px;
      height: 60px;
      padding: 0 30px;
      line-height: 60px;
      text-align: center;
    }
    .down-arrow {
      position: relative;
      font-size: 20px;
      margin-left: 5px;
      top: 5px;
      transform: rotate(-90deg);
      transition: transform 0.5s;
      -moz-transition: transform 0.5s; /* Firefox 4 */
      -webkit-transition: transform 0.5s; /* Safari 和 Chrome */
      -o-transition: transform 0.5s;
      &.up {
        transform: rotate(90deg);
      }
    }
  }
}
.pre-container {
  .pre-label {
    float: left;
    width: 120px;
  }
  .el-input {
    float: left;
    width: calc(100% - 120px);
    .el-input__inner {
      width: 100px;
    }
    .el-input__prefix {
      left: 110px;
    }
  }
}
</style>

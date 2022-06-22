<template>
  <div  class="mod-store page-salesFlow">
    <el-form :inline="true" class="mode-form-line1" ref="salesFlow" :model="salesFlow" label-width="120px" @keyup.enter.native="resetForm('search')">
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="salesFlow.start"
            @changeStartValue="value => salesFlow.start = value"
            :end-time-value="salesFlow.end"
            end-time-prop="end"
            @changeEndValue="value => salesFlow.end = value"
          ></gt-time-range>
        </el-form-item>
        <span class="checked">
          <el-form-item label="" prop="codeless">
            <el-checkbox v-model="salesFlow.codeless" style="margin-left: 135px;">查询结果包含无码商品</el-checkbox>
          </el-form-item>
        </span>
      <el-form-item class="search-toolbar">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>

      <div style="display:none;" class="button_check">

        <el-form-item label="顾客姓名/手机号" prop="customerNameOrPhone">
          <el-input v-model="salesFlow.customerNameOrPhone" placeholder="请输入顾客姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售类型" prop='salesType'>
          <el-select v-model="salesFlow.salesType" placeholder="请选择销售类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in salesType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select v-model="salesFlow.category1Id" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
              <el-option  label="全部" value="" ></el-option>
              <el-option
                v-for="item in mainCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="category2Id" >
            <el-select v-model="salesFlow.category2Id" placeholder="请选择二级分类"  @change="changeSecondCatetory" clearable>
            <el-option label="全部" value="" ></el-option>
              <el-option
              v-for="item in subCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="thirdCategoryId" >
            <el-select v-model="salesFlow.thirdCategoryId" placeholder="请选择三级分类" clearable>
            <el-option label="全部" value="" ></el-option>
              <el-option
              v-for="item in thirdCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="salesFlow.brandId" filterable placeholder="请选择商品品牌" clearable>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="key">
          <el-input v-model="salesFlow.key" placeholder="商品名称/条码/编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="productType">
          <el-select v-model="salesFlow.productType" placeholder="请选择商品类别" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in (newStore == 'false' ? productType : productHaveBulkType)"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="商品归属" prop='ownership'>
          <el-select v-model="salesFlow.ownership" placeholder="请选择商品归属" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in goodsBelonging"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderId">
          <el-input v-model="salesFlow.orderId" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售门店" prop="storeId">
          <el-select v-model="salesFlow.storeId" @change="changeStock" filterable placeholder="请选择销售门店" clearable>
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收银员" prop="cashierId">
          <el-select v-model="salesFlow.cashierId" placeholder="请选择收银员" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导购员" prop="guideId">
          <el-select v-model="salesFlow.guideId" placeholder="请选择导购员" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单来源" prop='orderSource'>
          <el-select v-model="salesFlow.orderSource" placeholder="请选择订单来源" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in orderType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="支付方式" prop='payType'>
          <el-select v-model="salesFlow.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in paymentOfMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item v-if="newStore == 'true'" label="门店版本" prop='version'>
          <el-select v-model="salesFlow.version" placeholder="请选门店版本" clearable>
            <el-option
              v-for="item in versionMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script>
import * as api from '@/service/goods'
import { getStoreList } from '@/service/systore'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
import { productType,productHaveBulkType,orderType,salesType, paymentOfMode,goodsBelonging,versionMode } from '@/utils/dict'
import { getStaffList } from '@/service/staffManagement'
import { getStore } from '@/utils/storage'
export default {
  name:'goods_sales_flow',
  data(){
    return{
      brands: [],
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      stores: [],
      staffList:[],
      cashierList:[],
      customerLoading:false,
      moment,
      start: moment().format('YYYY-MM-DD'),
      end: moment().format('YYYY-MM-DD'),
      productType,
      productHaveBulkType,
      orderType,
      salesType,
      versionMode,
      paymentOfMode,
      goodsBelonging,
      salesFlow:{
        key:'',//商品名称/条码
        brandId:'',//商品品牌
        category1Id: '',
        category2Id: '',
        thirdCategoryId:'',
        storeId:'',//销售门店
        cashierId:'',//收银员
        guideId:'',//导购员
        productType:'',//商品类别
        customerNameOrPhone:'',//顾客
        orderId:'',//订单编号
        orderSource:'',//订单来源
        salesType:'',//销售类型
        payType:'',//支付方式
        start:moment().startOf('month').valueOf(),
        end:moment().endOf('day').valueOf(),
        codeless: false
      },
    }
  },
  components:{
    gtTimeRange
  },
  async created(){
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore

    //品牌列表
    this.getBrandList()
    // 获取商品分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
    // 获取门店列表
    this.getStores()
  },
  methods:{
    // 获取品牌列表
    async getBrandList() {
      const { data } = await api.brandsList()
      if (data.code === 0) {
        this.brands = data.data
      } else {
        this.brands = []
        this.$message.error(data.msg)
      }
    },
    //监听一级分类，获取二级分类列表
    async getSubCategoryList(id) {
      this.salesFlow.category2Id = ''
      this.subCategory = []
      this.salesFlow.thirdCategoryId=''
      this.thirdCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },

     //获取三级分类
     async changeSecondCatetory(id) {
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.stores = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    //监控销售门店
    async changeStock(){
      if (this.salesFlow.storeId === '') {
        this.salesFlow.cashierId = ''
      }else{
        const { data } = await getStaffList({
          page: 0,
          size: 10000,
          storeId:this.salesFlow.storeId,
        })
        if (data.code === 0) {
          this.staffList = data.data.records
          this.cashierList = data.data.records.filter(item =>{
            return item.sysRoleName === '收银员'
          })
        } else {
          this.staffList = []
          this.cashierList = []
        }
      }
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['salesFlow'].resetFields(),
        this.salesFlow.start = moment().startOf('month').valueOf(),
        this.salesFlow.end = moment().endOf('day').valueOf()
      }
      var obj = {
        'type': type,
        'salesFlow': this.salesFlow
      }
      this.$emit('refreshSearch',obj)
    },
  },
}
</script>
<style lang="scss">
</style>

<template>
  <div  class="mod-store page-salesFlow">
    <el-form :inline="true" class="mode-form-line1" ref="salesFlow" label-width="120px" :model="salesFlow" @keyup.enter.native="resetForm('search')">
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
      <el-form-item style="float:right">
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
            <el-select v-model="salesFlow.category2Id" placeholder="请选择二级分类" clearable>
            <el-option label="全部" value="" ></el-option>
              <el-option
              v-for="item in subCategory"
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
        <el-form-item label="商品名称/条码" prop="key">
          <el-input v-model="salesFlow.key" placeholder="商品名称/条码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品类别" prop="productType">
          <el-select v-model="salesFlow.productType" placeholder="请选择商品类别" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in ((storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') ? productHaveBulkType : productType)"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="订单编号" prop="orderId">
          <el-input v-model="salesFlow.orderId" placeholder="请输入订单编号" clearable></el-input>
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
      </div>
    </el-form>
  </div>
</template>
<script>
import * as api from '@/service/goods'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
import { productType,productHaveBulkType,orderType,paymentOfMode,salesType } from '@/utils/dict'
import { getStaffList } from '@/service/staffManagement'
import { getCustomerList } from '@/service/mycustomer'
export default {
  name:'goods_sales_flow',
  data(){
    return{
      brands: [],
      mainCategory: [],
      subCategory: [],
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
      paymentOfMode,
      salesFlow:{
        key:'',//商品名称/条码
        brandId:'',//商品品牌
        category1Id: '',
        category2Id: '',
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
    const { storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeType = storeType
    //品牌列表
    this.getBrandList()
    // 获取商品分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
    //收银员、导购员
    this.getStaffList()
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
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },
    // 获取员工列表--收银员、导购员
    async getStaffList() {
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
      })
      if (data.code === 0) {
        this.cashierList = data.data.records.filter(item =>{
          return item.sysRoleName === '收银员'
        })
        this.staffList = data.data.records
      } else {
        this.cashierList = []
        this.staffList = []
      }
    },
    // 改变时间段
    monthRange(value, type) {
      if (type === 'startMonth') {
        this.startMonth = value
      } else if (type === 'endMonth') {
        this.endMonth = value
      }
      this.date = null
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

<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="salesDetails" :inline="true" ref='salesDetails' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="salesDetails.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="salesDetails.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop='key'>
          <el-input v-model="salesDetails.key" placeholder="商品名称/条码/商品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select v-model="salesDetails.category1Id" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
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
            <el-select v-model="salesDetails.category2Id" placeholder="请选择二级分类"  @change="changeSecondCatetory" clearable>
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
            <el-select v-model="salesDetails.thirdCategoryId" placeholder="请选择三级分类" clearable>
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
        <el-form-item label="销售类型" prop='salesType'>
          <el-select v-model="salesDetails.salesType" placeholder="请选择销售类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in salesTypeMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品归属" prop='ownership'>
          <el-select v-model="salesDetails.ownership" placeholder="请选择商品归属" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in goodsBelonging"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="销售单号" prop='orderId'>
          <el-input v-model="salesDetails.orderId" placeholder="商品销售单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="salesDetails.start"
            :end-time-value="salesDetails.end"
            end-time-prop="end"
            @changeStartValue="value => salesDetails.start = value"
            @changeEndValue="value => salesDetails.end = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="支付方式" prop='payType'>
          <el-select v-model="salesDetails.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in paymentOfMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:reqStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>零售类商品销量：{{details.entityCountSum || 0}}</span>
        <span>服务类商品销量：{{details.serviceCountSum  || 0}}</span>
        <span>散称类商品销量：{{details.weight || 0}}kg</span>
        <span>销售金额合计：{{details.retailPriceSum || 0}}元</span>
        <span>折扣金额合计：{{details.discountedSum || 0}}元</span>
        <span>实收金额合计：{{details.saleSum || 0}}元</span>
      </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="salesType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.salesType, salesTypeMode)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="160"
          :show-overflow-tooltip="true"
          label="销售单号">
        </el-table-column>
        <el-table-column
          prop="orderTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="销售时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeNameAcc"
          min-width="150"
          :show-overflow-tooltip="true"
          label="营业执照名称">
        </el-table-column>
        <el-table-column
          prop="province"
          min-width="100"
          :show-overflow-tooltip="true"
          label="省份">
        </el-table-column>
        <el-table-column
          prop="category1Name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column>
        <el-table-column
          prop="thirdCategory"
          min-width="100"
          :show-overflow-tooltip="true"
          label="三级分类">
          <template slot-scope="scope">
            <span>{{scope.row.thirdCategory || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ownership"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品归属">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.ownership, goodsBelonging)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="140"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="newCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品编号">
        </el-table-column>
        <el-table-column
          prop="jdyCode"
          min-width="150"
          :show-overflow-tooltip="true"
          label="精斗云编码">
        </el-table-column>
        <el-table-column
          prop="productName"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.productType,productHaveBulkType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="packingType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="单位">
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, paymentOfMode)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          min-width="100"
          :show-overflow-tooltip="true"
          label="数量">
          <template slot-scope="scope">
            <span>
              {{scope.row.productType == 'BULK' ? scope.row.count / 1000 : scope.row.count}}
              <span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价">
        </el-table-column>
        <el-table-column
          prop="retailPriceSum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售金额">
        </el-table-column>
        <el-table-column
          prop="discounted"
          min-width="100"
          :show-overflow-tooltip="true"
          label="折扣金额">
        </el-table-column>
        <el-table-column
          prop="saleSum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实收金额">
        </el-table-column>
        <el-table-column
          prop="storeCostPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本单价">
        </el-table-column>
        <el-table-column
          prop="storeCostPriceSum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本金额">
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="净毛利">
          <template slot-scope="scope">
            <span>{{NP.minus(scope.row.saleSum,scope.row.storeCostPriceSum)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="毛利率">
          <template slot-scope="scope">
            <span>{{(scope.row.saleSum == 0 ? 0 : NP.times(NP.divide(NP.minus(scope.row.saleSum,scope.row.storeCostPriceSum),scope.row.saleSum).toFixed(4),100))+'%'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination ="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import NP from 'number-precision'
import { paymentOfMode,salesTypeMode,productHaveBulkType } from '@/utils/dict'
import { goodsBelonging } from '@/utils/dict'
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { getMainCategory,getSubCategory,getSaleRecordList } from '@/service/goods'
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name: 'statement-posCommoditySalesDetails-posCommoditySalesDetails',
  data(){
    return{
      NP,
      storeList: [],//门店列表
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      filterStatus,
      fileDownload,
      goodsBelonging,
      productHaveBulkType,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      paymentOfMode,
      salesTypeMode,
      details:{},
      salesDetails:{
        storeName: null,
        key: null,//商品信息
        category1Id:'',
        category2Id: '',
        thirdCategoryId: '',
        salesType: '',
        orderId:'',//销售单号
        start:null,
        end:null,
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtSelectProvince,
  },
  inject: ['exportList'],
  async created(){
    //获取门店下拉列表
    this.getStoreList();
    this.getDataList()
     // 获取商品分类
    const data = await getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
  },
  methods:{
    //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await getSaleRecordList({
        size: this.pageSize,
        page: this.currentPage,
        codeless: true,
        ...this.salesDetails,
        provinceId: local.provinceId || null,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.page.records.map(item => {
          return{
            ...item,
            retailPrice: this.priceNum(item.retailPrice),//零售价
            retailPriceSum: this.priceNum(item.retailPriceSum),//销售金额
            discounted: this.priceNum(item.discounted),//折扣金额
            saleSum: this.priceNum(item.saleSum),//实收金额
            storeCostPrice: this.priceNum(item.storeCostPrice),//成本单价
            storeCostPriceSum: item.salesType == 'REFUND' ? (-1) * this.priceNum(item.storeCostPriceSum) : this.priceNum(item.storeCostPriceSum),//成本总额
          }
        })
        this.details = data.data
        this.details.weight = data.data.weight / 1000//散称类商品销量
        this.details.retailPriceSum = this.priceNum(data.data.retailPriceSum)//销售金额合计
        this.details.discountedSum = this.priceNum(data.data.discountedSum)//折扣金额合计
        this.details.saleSum = this.priceNum(data.data.saleSum)//实收金额合计
        this.total = data.data.page.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    // 监听省份
    async getStoreValue(val){
      const { data } = await getStoreList({
        status:1,
        provinceId:val.id
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },
    //监听一级分类，获取二级分类列表
    async getSubCategoryList(id) {
      this.salesDetails.category2Id = ''
      this.subCategory = []
      this.salesDetails.thirdCategoryId=''
      this.thirdCategory = []
      if (id) {
        const data = await getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },

      //获取三级分类
      async changeSecondCatetory(id) {
      if (id) {
        const data = await getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },
    // 导出销售清单
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        size: this.pageSize,
        page: this.currentPage,
        codeless: true,
        ...this.salesDetails,
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, 'pos商品销售明细', 'REPORT_SALE_RECORD', criteria)
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['salesDetails'].resetFields()
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  },
}
</script>
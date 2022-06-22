<template>
  <div class="mod-store page-salesFlow-list">
    <el-card>
      <gt-salesFlowAdvance ref="advance" @refreshSearch="getList"/>
    </el-card>
    <!-- 更多查询 -->
    <img class="more-icon"  @click="showFlag" :src="`static/img/mycustomer/${isFlag?'page-close.png': 'page-open.png'}`" />
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <div class="toptitle">
        <span class="tip">零售类销量：{{details.entityCountSum}}</span>
        <span class="tip">服务类销量：{{details.serviceCountSum}}</span>
        <span class="tip" v-if="newStore == 'true'">散称类销量：{{details.weight}}kg</span>
        <span class="tip">销售额：{{this.priceNum(details.saleSum)}}元</span>
        <gt-border-button style="float:right;margin-right:10px" type="export" txt="下载查询结果" @click.native="() => exportExcel()"/>
      </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;margin-top: 5px;">
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
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.salesType, salesType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderId"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="orderTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="销售时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="orderSource"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单来源">
          <template slot-scope="scope">
            <!-- <span>{{scope.row.orderSource === 'POS' ? 'POS' : '小程序'}}</span> -->
            <span>{{filterStatus(scope.row.orderSource, orderType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="支付方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, paymentOfMode)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="ownership"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品归属">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.ownership, goodsBelonging)}}</span>
          </template>
        </el-table-column>
         <el-table-column
          prop="newCode"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="自编码">
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="spec"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="storeCostPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本价">
          <template slot-scope="scope">
            <span v-if="scope.row.storeCostPrice !== null">{{Number(priceNum(scope.row.storeCostPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sale"
          min-width="100"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            销售单价
            <el-tooltip placement="top">
              <div slot="content">
                商品的实收金额
              </div>
            <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.sale !== null">{{Number(priceNum(scope.row.sale)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="count"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="数量">
        </el-table-column>
        <el-table-column
          prop="saleSum"
          min-width="100"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            销售小计
            <el-tooltip placement="top">
              <div slot="content">
                商品的销售单价*数量
              </div>
            <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.saleSum !== null">{{Number(priceNum(scope.row.saleSum)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPriceSum"
          min-width="100"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            零售总额
            <el-tooltip placement="top">
              <div slot="content">
                商品的零售价*数量
              </div>
            <img class="tip-icon" style="width: 15px;"  src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.retailPriceSum !== null">{{Number(priceNum(scope.row.retailPriceSum)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="discounted"
          min-width="100"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            优惠总额
            <el-tooltip placement="top">
              <div slot="content">
                商品的零售总额-销售小计
              </div>
            <img class="tip-icon" style="width: 15px;"  src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.discounted !== null">{{Number(priceNum(scope.row.discounted)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productType"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.productType, productHaveBulkType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="category1Name"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column>
         <el-table-column
          prop="thirdCategory"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="三级分类">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="customerPhone"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="顾客">
          <template slot-scope="scope">
            <span>{{`${scope.row.customerName || '--'}/${scope.row.customerPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cashierId"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="收银员">
          <template slot-scope="scope">
            <span>{{`${scope.row.cashierName || '--'}/${scope.row.cashierPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="guideId"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="导购员">
          <template slot-scope="scope">
            <span>{{`${scope.row.guideName || '--'}/${scope.row.guidePhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="归属员工">
          <template slot-scope="scope">
            <span>{{scope.row.employee || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnOrderId"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="退单号">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtSalesFlowAdvance from './salesFlowAdvance'
import gtPagination from '@/components/gt-pagination'
import { paymentOfMode,salesType,orderType,productHaveBulkType,goodsBelonging } from '@/utils/dict'
import { getSaleRecordList,salesRecordExport } from '@/service/goods'
import { filterStatus,fileDownload } from '@/utils'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name:'survey-salesFlow',
  data(){
    return{
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
        start: moment().startOf('month').valueOf(),
        end: moment().valueOf(),
        codeless: false
      },
      isFlag: false,
      dataListLoading:false,
      orderType,
      dataList:[],
      details:{},
      filterStatus,
      goodsBelonging,
      productHaveBulkType,
      salesType,
      paymentOfMode,
      countSum:'',
      saleSum:'',
      total: 0,
      pageSize: 20,
      currentPage: 0,
    }
  },
  components:{
    gtSalesFlowAdvance,
    gtPagination,
  },
  created(){
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore

    this.getDataList()
  },
  inject: ['exportList'],
  methods:{
    //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      const { data } = await getSaleRecordList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.salesFlow
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.page.records.map(item => {
          return{
            ...item,
            count: item.productType == 'BULK' ? item.count / 1000 : item.count,
          }
        })
        this.details = data.data
        this.details.weight = data.data.weight/1000
        this.total = data.data.page.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    //更多查询折叠
    showFlag(){
      if(!this.isFlag){
        $('.button_check').toggle('1000')
        this.isFlag =!this.isFlag
      }else{
        $('.button_check').toggle('1000')
        this.isFlag = !this.isFlag
      }
    },
    // 导出商品列表
    async exportExcel() {
      let criteria = {
        ...this.salesFlow,
        salesType: this.salesFlow.salesType || null,
        payType: this.salesFlow.payType || null,
        orderSource: this.salesFlow.orderSource || null,
        storeId: this.salesFlow.storeId || null,
        brandId:this.salesFlow.brandId || null,
        category1Id: this.salesFlow.category1Id || null,
        category2Id: this.salesFlow.category2Id || null,
        cashierId:this.salesFlow.cashierId || null,
        guideId:this.salesFlow.guideId || null,
        productType:this.salesFlow.productType || null,
        employee:this.salesFlow.employee || null,
      }

      // this.exportList(this.total, '商品销售流水列表', 'PRODUCT_SALE_DETAIL', criteria, async () => {
      if (this.total > 10000) {
        this.$message.warning('下载最多支持1万条查询数据，请缩小查询范围再进行下载！')
      } else {
        const { data, headers } = await salesRecordExport({
          ...criteria,
          page: 0,
          size: 10000
        })
        fileDownload(data, '商品销售流水列表.xls')
      }
      // })
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    getList(obj) {
      this.salesFlow = obj.salesFlow
      if (obj.type==='reset') {
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.page-salesFlow-list{
  .more-icon{
    position: relative;
    top: -2px;
    width: 60px;
    left: calc(50% - 30px);
    cursor: pointer;
  }
  .toptitle {
    display: inline-block;
    /* margin-top: 10px; */
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    width: 100%;
    margin-right: 50px;
    margin-bottom: -10px;
  }
  .tip{
    margin-right: 20px;
    display: inline-block;
    margin-top: 8px;
  }
}
</style>

<template>
  <div class="mod-store buy-sale-base">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="bsb" :model="bsb" @keyup.enter.native="resetForm('search')">
        <el-form-item label="查询时间">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="startTime"
            :start-time-value="bsb.startTime"
            :end-time-value="bsb.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => bsb.startTime = value"
            @changeEndValue="value => bsb.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="商品信息" prop="productInfo">
          <el-input v-model="bsb.productInfo" placeholder="商品名称/条码" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <!-- <gt-border-button disabled type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/> -->
      <span style="font-size: 16px;">报表说明</span>
      <el-tooltip placement="top">
        <div slot="content" style="width: 360px;">
          数据隔天统计；按实际出入库日期来统计各个出入库单的出入库数量和成本金额；<br>
          期初库存 : 截至查询开始日期0点的库存数量，包含数量和金额；<br>
          期末库存 : 截至查询结束日期24点的库存数量，包含数量和金额；<br>
          平均库存 : （期初库存+期末库存）/2，包含数量和金额；
        </div>
        <img class="tip-icon" style="margin-left: 10px;margin-top: -5px;" src="static/img/campaign/wenhao.png" alt="" />
      </el-tooltip>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;margin-top: 5px !important;">
        <el-table-column
          prop="index"
          width="50"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barCode"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="期初库存">
          <template slot-scope="scope">
            <span  v-if="storeRoleName === '店长' && hasAuthorization">
              <span class="amountTop">{{scope.row.startStockQuantity}}</span>
              <span class="moneyBottom">￥{{priceNum(scope.row.startStockPrice).toFixed(2)}}</span>
            </span>
            <span v-else>
              <span class="noAmountTop">{{scope.row.startStockQuantity}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column label="采购/总部配送">
          <el-table-column
            prop="orderId"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="采购入库">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.purchaseInWarehouseQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.purchaseInWarehousePrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.purchaseInWarehouseQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="配送入库">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.deliveryInQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.deliveryInPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.deliveryInQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="配送退货">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.deliveryReturnsQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.deliveryReturnsPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.deliveryReturnsQuantity}}</span>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="销售">
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="销售兑换">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.saleOutQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.saleOutPrice).toFixed(2)}}</span> 
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.saleOutQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="销售退货">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.saleInQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.saleInPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.saleInQuantity}}</span>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="门店调拨">
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="调拨入库">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.allocationInQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.allocationInPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.allocationInQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="调拨出库">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.allocationOutQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.allocationOutPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.allocationOutQuantity}}</span>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="寄存">
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="商品寄存">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.depositQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.depositPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.depositQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="寄存提取">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.extractQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.extractPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.extractQuantity}}</span>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="其他">
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="其他出库">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.otherOutletsQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.otherOutletsPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.otherOutletsQuantity}}</span>
              </span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="库存盘点">
            <template slot-scope="scope">
              <span v-if="storeRoleName === '店长' && hasAuthorization">
                <span class="amountTop">{{scope.row.adjustQuantity}}</span>
                <span class="moneyBottom">￥{{priceNum(scope.row.adjustPrice).toFixed(2)}}</span>
              </span>
              <span v-else>
                <span class="noAmountTop">{{scope.row.adjustQuantity}}</span>
              </span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="变更汇总">
          <template slot-scope="scope">
            <span v-if="storeRoleName === '店长' && hasAuthorization">
              <span class="amountTop">{{scope.row.changeQuantity}}</span>
              <span class="moneyBottom">￥{{priceNum(scope.row.changePrice).toFixed(2)}}</span>
            </span>
            <span v-else>
              <span class="noAmountTop">{{scope.row.changeQuantity}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="期末库存">
          <template slot-scope="scope">
            <span v-if="storeRoleName === '店长' && hasAuthorization">
              <span class="amountTop">{{scope.row.endStockQuantity}}</span>
              <span class="moneyBottom">￥{{priceNum(scope.row.endStockPrice).toFixed(2)}}</span>
            </span>
            <span v-else>
              <span class="noAmountTop">{{scope.row.endStockQuantity}}</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="平均库存">
          <template slot-scope="scope">
            <span v-if="storeRoleName === '店长' && hasAuthorization">
              <span class="amountTop">{{scope.row.averageQuantity}}</span>
              <span class="moneyBottom">￥{{priceNum(scope.row.averagePrice).toFixed(2)}}</span>
            </span>
            <span v-else>
              <span class="noAmountTop">{{scope.row.averageQuantity}}</span>
            </span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { getStoreList } from '@/service/systore'
import { getPurchasePageList } from '@/service/survey'
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
export default {
  name:'survey_buy-sale-base',
  data(){
    return{
      dataListLoading:false,
      hasAuthorization: false,
      dataList:[],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      bsb:{
        startTime: null,
        endTime: null,
        productInfo:null,
      }
    }
  },
  components:{
    gtTimeRange,gtPagination
  },
  async created(){
    //数据详情
    this.getDataList(false)
    //限制成本价显示
    const { storeRoleName = '', hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
  },
  methods:{
    //获取数据详情
    async getDataList(flag){
      if (!this.bsb.startTime && !this.bsb.endTime) {
        if (!flag) {
          this.$message.warning("请先输入查询时间")
        }
        return
      }
      this.dataListLoading = true
      const { data } = await getPurchasePageList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.bsb
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item=>{
          return{
            ...item,
            startStockQuantity:item.productType == 'BULK' ? item.startStockQuantity / 1000 : item.startStockQuantity,//初期库存
            purchaseInWarehouseQuantity:item.productType == 'BULK' ? item.purchaseInWarehouseQuantity / 1000 : item.purchaseInWarehouseQuantity,//采购入库
            deliveryInQuantity:item.productType == 'BULK' ? item.deliveryInQuantity / 1000 : item.deliveryInQuantity,//配送入库
            deliveryReturnsQuantity:item.productType == 'BULK' ? item.deliveryReturnsQuantity / 1000 : item.deliveryReturnsQuantity,//配送退货
            saleOutQuantity:item.productType == 'BULK' ? item.saleOutQuantity / 1000 : item.saleOutQuantity,//销售兑换
            saleInQuantity:item.productType == 'BULK' ? item.saleInQuantity / 1000 : item.saleInQuantity,//销售退货
            allocationInQuantity:item.productType == 'BULK' ? item.allocationInQuantity / 1000 : item.allocationInQuantity,//调拨入库
            allocationOutQuantity:item.productType == 'BULK' ? item.allocationOutQuantity / 1000 : item.allocationOutQuantity,//调拨出库
            depositQuantity:item.productType == 'BULK' ? item.depositQuantity / 1000 : item.depositQuantity,//商品寄存
            extractQuantity:item.productType == 'BULK' ? item.extractQuantity / 1000 : item.extractQuantity,//寄存提取
            otherOutletsQuantity:item.productType == 'BULK' ? item.otherOutletsQuantity / 1000 : item.otherOutletsQuantity,//其他出库
            adjustQuantity:item.productType == 'BULK' ? item.adjustQuantity / 1000 : item.adjustQuantity,//库存盘点
            changeQuantity:item.productType == 'BULK' ? item.changeQuantity / 1000 : item.changeQuantity,//变更汇总
            endStockQuantity:item.productType == 'BULK' ? item.endStockQuantity / 1000 : item.endStockQuantity,//期末库存
            averageQuantity:item.productType == 'BULK' ? item.averageQuantity / 1000 : item.averageQuantity,//平均库存
          }
        })
        this.details = data.data
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    // 导出查询结果列表
    async exportExcel() {
      // let criteria = {
      //   ...this.particulars,
      //   page: 0,
      //   size: 10000,
      // }
      // const { data, headers } = await api.salesAnalysisExport(criteria)
      // fileDownload(data, '商品销售分析列表.xls')
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      this.pageSize = 20
      this.currentPage = 0
      if (type==='reset') {
        this.$refs['bsb'].resetFields()
        this.dataList = []
        this.getDataList(true)
      }else{
        this.getDataList(false)
      }
    },
  }
}
</script>
<style lang="scss">
.mod-store.buy-sale-base{
  .el-table th, .el-table td {
    border: 1px solid rgb(228, 229, 230) !important;
  }
  .el-table th {
      background: #EEFFF0 !important;
  }
  .el-table th > .cell {
      font-weight: 600 !important;
      color: #72716F !important;
      text-align: center;
  }
  .el-table__header th div {
      padding: 0px 0px !important;
      color: #72716F !important;
      font-size: 12px;
  }
  .amountTop{
    display: block;
    margin-top: -8px;
    text-align:right
  }
  .noAmountTop{
    display: block;
    text-align:right
  }
  .moneyBottom{
    display: block;
    margin: -7px 0 -9px 0;
    text-align:right
  }
  .mode-store-table .gt-table-create {
    background-color: #c0c4cc !important;
    border-color: #c0c4cc!important
  }
}
</style>
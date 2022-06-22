<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="salesGathering" :model="salesGathering" @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="salesGathering.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="staDay"
            :start-time-value="salesGathering.staDay"
            @changeStartValue="value => salesGathering.staDay = value"
            :end-time-value="salesGathering.endDay"
            end-time-prop="endDay"
            @changeEndValue="value => salesGathering.endDay = value"
            valueFormat="yyyy-MM-dd"
            type="date"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>总销售额合计：{{details.saleTotalSum || 0}}元</span>
        <span>现金收款合计：{{details.cashTotalSum || 0}}元</span>
        <span>富有收款合计：{{details.fuiouInAccountTotalSum || 0}}元</span>
        <span>富友结算合计：{{details.fuiouTotalSum || 0}}元</span>
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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="day"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="销售时间">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.storeName"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.storeNameAcc"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="营业执照名称">
        </el-table-column>
        <el-table-column
          prop="saleTotal"
          :show-overflow-tooltip="true"
          min-width="140"
          label="总销售额">
        </el-table-column>
        <el-table-column
          prop="storeSaleTotal"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="门店自营商品销售额">
        </el-table-column>
        <el-table-column
          prop="companySaleTotal"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="总部统筹商品销售额">
        </el-table-column>
        <el-table-column
          prop="otherSaleTotal"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="其他商品销售额">
        </el-table-column>
        <el-table-column
          prop="cashTotal"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="现金收款">
        </el-table-column>
        <el-table-column
          prop="fuiouInAccountTotal"
          min-width="140"
          :show-overflow-tooltip="true"
          label="富友收款">
        </el-table-column>
        <el-table-column
          prop="fuiouTotal"
          min-width="140"
          :show-overflow-tooltip="true"
          label="富友结算">
        </el-table-column>
        <el-table-column
          prop="treeFee"
          min-width="140"
          :show-overflow-tooltip="true"
          label="手续费">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
import { getSaleBalancList } from '@/service/survey'
import { getStoreList } from '@/service/systore'
import moment from 'moment'
export default {
  name:'survey_salesGathering',
  data(){
    return{
      moment,
      dataListLoading: false,
      storeList:[],
      dataList:[],
      details:{},
      total: 0,
      pageSize: 20,
      currentPage: 0,
      salesGathering:{
        staDay: moment().startOf('month').format('YYYY-MM-DD'),
        endDay: moment().format('YYYY-MM-DD'),
      }
    }
  },
  components:{
    gtTimeRange,gtPagination
  },
  inject: ['exportList'],
  created() {
    this.getStoreList()
    //数据详情
    this.getDataList()
  },
  methods:{
     //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      const { data } = await getSaleBalancList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.salesGathering,
        staDay:this.salesGathering.staDay ? new Date(moment(this.salesGathering.staDay)).getTime() : null,
        endDay:this.salesGathering.endDay ? new Date(moment(this.salesGathering.endDay)).getTime() : null
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.saleBalanceDayReports ? data.data.saleBalanceDayReports.records.map(item => {
          return{
            ...item,
            saleTotal: this.priceNum(item.saleTotal),//总销售额
            storeSaleTotal: this.priceNum(item.storeSaleTotal),//门店自营商品销售额
            companySaleTotal: this.priceNum(item.companySaleTotal),//企业自营商品销售额
            otherSaleTotal: this.priceNum(item.otherSaleTotal),//其他商品销售额
            cashTotal: this.priceNum(item.cashTotal),//现金收款
            fuiouInAccountTotal: this.priceNum(item.fuiouInAccountTotal),//富有收款
            fuiouTotal: this.priceNum(item.fuiouTotal),//富有结算
            treeFee: this.priceNum(item.treeFee),//手续费
          }
        }) : []
        this.details.saleTotalSum = this.priceNum(data.data.saleTotalSum)
        this.details.cashTotalSum = this.priceNum(data.data.cashTotalSum)
        this.details.fuiouInAccountTotalSum = this.priceNum(data.data.fuiouInAccountTotalSum)
        this.details.fuiouTotalSum = this.priceNum(data.data.fuiouTotalSum)
        this.total = data.data.saleBalanceDayReports ? data.data.saleBalanceDayReports.total : 0
      } else {
        this.dataList = []
        this.details = {}
        this.total = 0
        this.$message.warning(data.msg)
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
    //导出销售收款报表
    async exportExcel() {
      const criteria = {
        ...this.salesGathering,
        staDay:this.salesGathering.staDay ? new Date(moment(this.salesGathering.staDay)).getTime() : null,
        endDay:this.salesGathering.endDay ? new Date(moment(this.salesGathering.endDay)).getTime() : null
      }
      this.exportList(this.total, '销售收款报表', 'SALE_BALANCE_DAY', criteria)
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['salesGathering'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
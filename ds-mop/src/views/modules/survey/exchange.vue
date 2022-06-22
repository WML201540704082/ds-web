<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="exchange" :inline="true" ref='exchange' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="所属企业" prop="companyId">
          <el-select v-model="exchange.companyId" filterable placeholder="请选择企业" @change="getStoreList" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'>
          <el-select v-model="exchange.storeId" placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="收银员" prop='cashier'>
          <el-input v-model="exchange.cashier" placeholder="请输入手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="开始时间">
          <gt-time-range
            value-format="timestamp"
            start-time-prop="start"
            :start-time-value="exchange.start"
            :end-time-value="exchange.end"
            end-time-prop="end"
            @changeStartValue="value => exchange.start = value"
            @changeEndValue="value => exchange.end = value"
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
          prop="startTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="开始时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="endTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="结束时间">
          <template slot-scope="scope">
            <span>{{scope.row.endTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属企业">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="cashier"
          :show-overflow-tooltip="true"
          min-width="150"
          label="收银员">
          <template slot-scope="scope">
            <span>{{scope.row.cashierName || '--'}} / {{scope.row.cashier || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          min-width="150"
          :show-overflow-tooltip="true"
          label="总销售额">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(NP.plus(scope.row.statSales,scope.row.sales), scope.row.refundSales), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="total"
          min-width="150"
          :show-overflow-tooltip="true"
          label="总充值金额">
          <template slot-scope="scope">
            <span>{{priceNum(NP.minus(scope.row.rechargeSales, (scope.row.cardRefund + scope.row.shoppingCardRefund)))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="workSales.cash"
          min-width="120"
          :show-overflow-tooltip="true"
          label="现金">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.cash, scope.row.workSales.cashRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="alipay"
          min-width="120"
          :show-overflow-tooltip="true"
          label="支付宝">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(scope.row.workSales.alipay, 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechat"
          min-width="120"
          :show-overflow-tooltip="true"
          label="微信">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.wechat,scope.row.workSales.wechatRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="card"
          min-width="120"
          :show-overflow-tooltip="true"
          label="储值卡">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.card, scope.row.workSales.cardRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="card"
          min-width="120"
          :show-overflow-tooltip="true"
          label="购物卡">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.shoppingCard, scope.row.workSales.shoppingCardRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="palipay"
          min-width="120"
          :show-overflow-tooltip="true"
          label="个人支付宝">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.palipay,scope.row.workSales.palipayRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="pwechat"
          min-width="120"
          :show-overflow-tooltip="true"
          label="个人微信">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(NP.minus(scope.row.workSales.pwechat,scope.row.workSales.pwechatRefund), 100), 2)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="swipe"
          min-width="120"
          :show-overflow-tooltip="true"
          label="刷卡">
          <template slot-scope="scope">
            <span>{{NP.round(NP.divide(scope.row.workSales.swipe, 100), 2)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { activeStatus, activeType,audio } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor, number } from '@/utils'
import moment from 'moment'
import NP from 'number-precision'
export default {
  name:'survey-exchange',
  data () {
    return {
      filterStatus,
      filterColor,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      companyList: [],
      storeList: [],
      NP,
      exchange:{
        cashier: null,
        companyId:'',
        storeId: '',
        start: null,
        end: null,
      }
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  created () {
    if(this.$route.params.state){
      this.activity.status = this.$route.params.state
    }
    // 获取审核列表
    this.getDataList()
    // 获取企业列表
    this.getCompanyList()
  },
  methods: {
    // 营业总额
    totals(row){
      var card = NP.minus(row.workSales.card, row.workSales.cardRefund)
      var cash = NP.minus(row.workSales.cash, row.workSales.cashRefund)
      var alipay = row.workSales.alipay
      var wechat = NP.minus(row.workSales.wechat,row.workSales.wechatRefund)
      var palipay = NP.minus(row.workSales.palipay,row.workSales.palipayRefund)
      var pwechat = NP.minus(row.workSales.pwechat,row.workSales.pwechatRefund)
      var swipe = row.workSales.swipe
      var total = NP.divide(NP.plus(cash,alipay,wechat,palipay,pwechat,swipe, card),100)
      return NP.round(total,2)
    },
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
    },
    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      this.exchange.storeId = ''
      if (companyId) {
        const { data } = await this.$http({
          url: this.$http.adornUrl(`/baseinfo/mop/store/company/${companyId}`),
          method: 'get',
        })
        if (data && data.code === 0) {
          this.storeList = data.data
        } else {
          this.storeList = []
          this.$message.error(data.msg)
        }
      } else {
        this.storeList = []
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/company/work/pos/list'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.exchange
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
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
        this.$refs['exchange'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

<style lang="scss" scoped>

</style>


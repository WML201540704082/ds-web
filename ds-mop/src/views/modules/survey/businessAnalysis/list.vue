<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form label-width="100px" :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <!-- <el-form-item label="门店名称" prop='storeName'>
          <el-input clearable v-model="form.storeName" placeholder="请输入门店名称"></el-input>
        </el-form-item> -->
         <el-form-item label="所属企业" prop="companyId">
          <el-select v-model="form.companyId" filterable placeholder="请选择企业" @change="getStoreList" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'>
          <el-select v-model="form.storeId" placeholder="请选择门店" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加盟授权编码" prop='leagueAuthorizationCode'>
          <el-input clearable v-model="form.leagueAuthorizationCode" placeholder="请输入加盟授权编码"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="storeLocation">
          <gt-select-location ref="storeLocation" :provinceId="form.provinceId" :cityId="form.cityId" :districtId="form.districtId" />
        </el-form-item>
        <el-form-item label="大区" prop='region'>
          <el-input clearable v-model="form.region" placeholder="请选择大区"></el-input>
        </el-form-item>
        <el-form-item label="时间段">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="beginDate"
            :start-time-value="form.beginDate"
            :end-time-value="form.endDate"
            end-time-prop="endDate"
            @changeStartValue="value => form.beginDate = value"
            @changeEndValue="value => form.endDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
        <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
        <div class="info">
            <span>总销售件数:{{this.reportDataObject.saleQuantity || '--'}}</span>
            <span>总销售额:{{this.reportDataObject.totalSalesAmount/100 || '--'}}</span>
            <span>总小店销售额(占比):{{this.reportDataObject.totalSalesAmount >= 0 ? ((this.reportDataObject.onlineSales/100 || 0) + '(' + (this.reportDataObject.onlineSalesPercent == null ? '--' : (this.reportDataObject.onlineSalesPercent + '%'))  + ')') : '--'}}
            </span>
            <span>总线下pos销售额(占比):
            {{this.reportDataObject.totalSalesAmount >= 0 ? ((this.reportDataObject.offlineSales/100 || 0) + '(' + (this.reportDataObject.offlineSalesPercent == null ? '--' : (this.reportDataObject.offlineSalesPercent + '%'))  + ')') : '--'}}
            </span>
            <span>总订单数:{{this.reportDataObject.orderQuantity || '--'}}</span>
            <span>总累计顾客数:{{this.reportDataObject.customerQuantity || '--'}}</span>
            <span>总新增顾客数:{{this.reportDataObject.addCustomerQuantity || '--'}}</span>
            <span>总有消费会员数:{{this.reportDataObject.consumeCustomerQuantity || '--'}}</span>
            <span>总到店次数:{{this.reportDataObject.onStoreCount || '--'}}</span>
            <span>总客单价:{{this.reportDataObject.guestOrderAmount/100 || '--'}}</span>
            <span>总客单产值:{{this.reportDataObject.singleGuestAmount/100 || '--'}}</span>
          </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height>
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
        </el-table-column>
        <el-table-column
          prop="leagueAuthorizationCode"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="加盟授权编码">
        </el-table-column>
        <el-table-column
          min-width="150"
          :show-overflow-tooltip="true"
          label="省市区">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="region"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="大区">
        </el-table-column>
        <el-table-column
          prop="recordDate"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="记录日期">
        </el-table-column>
        <el-table-column
          prop="leagueBrand"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="加盟品牌">
        </el-table-column>
        <el-table-column
          prop="saleQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="销售件数">
        </el-table-column>
        <el-table-column
          prop="totalSalesAmount"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="总销售额">
        </el-table-column>
        <el-table-column
          min-width="150"
          :show-overflow-tooltip="true"
          label="小店销售额(占比)">
          <template slot-scope="scope">
            <span>{{scope.row.totalSalesAmount >= 0 ? ((scope.row.onlineSales || 0) + '(' + (scope.row.onlineSalesPercent == null ? '--' : (scope.row.onlineSalesPercent + '%')) + ')') : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="线下POS销售额(占比)">
          <template slot-scope="scope">
            <span>{{scope.row.totalSalesAmount >= 0 ? ((scope.row.offlineSales || 0) + '(' + (scope.row.offlineSalesPercent == null ? '--' : (scope.row.offlineSalesPercent + '%'))  + ')') : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订单数">
        </el-table-column>
        <el-table-column
          prop="customerQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="累计顾客数">
        </el-table-column>
        <el-table-column
          prop="addCustomerQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="新增顾客数">
        </el-table-column>
        <el-table-column
          prop="consumeCustomerQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="有消费会员数">
        </el-table-column>
        <el-table-column
          prop="onStoreCount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="到店次数">
        </el-table-column>
        <el-table-column
          prop="guestOrderAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="客单价">
          <template slot-scope="scope">
            <span>{{scope.row.guestOrderAmount}}元</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="singleGuestAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="单客产值">
          <template slot-scope="scope">
            <span>{{scope.row.singleGuestAmount}}元</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtSelectLocation from '@/components/gt-select-location'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, fileDownload, locations } from '@/utils'
export default {
  name:'customerAnalysis-list',
  data () {
    return {
      companyList:[],
      storeList:[],
      filterStatus,
      reportDataObject:{},//report
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      form:{
        storeName: '',//门店名称
        companyId:'',
        storeId: '',
        leagueAuthorizationCode:'',//加盟授权编码
        region:'',//大区
        provinceId:'',//省
        cityId:'',//市
        districtId:'',//区
        beginDate:'',//开始时间
        endDate:'',//结束时间
      },
    }
  },
  components: {
    gtPagination,gtSelectLocation,gtTimeRange
  },
  created () {
    //获取详情列表
    this.getDataList()
    //获取企业下拉列表
    this.getCompanyList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      var local = locations(this.$refs['storeLocation'])
      this.$http({
        url: this.$http.adornUrl('/mop/storeAnalysisReport/pageList'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.form,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.reportDataObject = data.data.report || {}
          this.dataList = data.data.reportPage.records.map(item => {
            return{
              ...item,
              totalSalesAmount:this.priceNum(item.totalSalesAmount),
              onlineSales:this.priceNum(item.onlineSales),
              offlineSales:this.priceNum(item.offlineSales),
              guestOrderAmount:this.priceNum(item.guestOrderAmount),
              singleGuestAmount:this.priceNum(item.singleGuestAmount)
            }
          })
          this.total = data.data.reportPage.total
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.total = 0
        }
      })
    },
   
    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      this.form.storeId = ''
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

    // 导出门店经营分析表
    async exportExcel() {
      var local = locations(this.$refs['storeLocation'])
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/mop/storeAnalysisReport/export'),
        method:'get',
        responseType: 'arraybuffer',
        selfHandleError: true,
        params: this.$http.adornParams({
          size: 10000,
          page: 0,
          ...this.form,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
        })
      })
      fileDownload(data, '门店经营分析表.xls')
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
        this.$refs['form'].resetFields()
        this.form.provinceId = ''
        if (this.$refs['storeLocation']) {
          this.$refs['storeLocation'].refresh()
        }
        this.storeList = []
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  @import '~@/assets/scss/store/store.scss';
  .info {
    margin-top: 30px;
    margin-bottom: 10px;
  // float: left;
  span {
    margin-right: 12px;
  }
}
</style>
<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form label-width="80px" :model="form" :inline="true" ref='form' class="mode-form-line1" @keyup.enter.native="resetForm('search')">
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
        <el-form-item label="加盟授权编码" label-width="95px" prop='leagueAuthorizationCode'>
          <el-input clearable v-model="form.leagueAuthorizationCode" placeholder="请输入加盟授权编码"></el-input>
        </el-form-item>
        <el-form-item label="大区" prop='region'>
          <el-input clearable v-model="form.region" placeholder="请选择大区"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="storeLocation">
          <gt-select-location ref="storeLocation" :provinceId="form.provinceId" :cityId="form.cityId" :districtId="form.districtId" />
        </el-form-item>
        <el-form-item label-width="95px" label="顾客总数区间">
          <gt-number-range
            ref="customerRange"
            type="customer"
            @startValueEvent="value => form.staCustomerTotal = value"
            @endValueEvent="value => form.endCustomerTotal = value"
          />
        </el-form-item>
        <el-form-item label="无月龄占比区间" label-width="115px">
          <gt-number-range
            ref="noageRange"
            type="per"
            @startValueEvent="value => form.noMonthCustomerProportion = value"
            @endValueEvent="value => form.endNoMonthCustomerProportion = value"
          />
        </el-form-item>
        <el-form-item label-width="95px" label="孕期占比区间">
          <gt-number-range
            ref="ageRange"
            type="per"
            @startValueEvent="value => form.monthCustomerProportion = value"
            @endValueEvent="value => form.endMonthCustomerProportion = value"
          />
        </el-form-item>
        <el-form-item label="月份" prop='month' class="alter_time_style">
          <el-date-picker
            v-model="form.month"
            type="month"
            placeholder="选择月">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
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
          prop="storeBaseInfo.storeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.storeCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.leagueAuthorizationCode"
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
            <span>{{`${scope.row.storeBaseInfo.province || ''}${scope.row.storeBaseInfo.city || ''}${scope.row.storeBaseInfo.district || ''}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.region"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="大区">
        </el-table-column>
        <el-table-column
          prop="month"
          min-width="150"
          :show-overflow-tooltip="true"
          label="月份">
        </el-table-column>
        <el-table-column
          prop="customerTotal"
          min-width="150"
          :show-overflow-tooltip="true"
          label="顾客总数">
        </el-table-column>
        <el-table-column
          prop="monthNewCustomerNum"
          min-width="150"
          :show-overflow-tooltip="true"
          label="本月顾客新增">
        </el-table-column>
        <el-table-column
          prop="noMonthCustomerProportion"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="无月龄占比">
          <template slot-scope="scope">
            <span>{{scope.row.noMonthCustomerProportion}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="monthCustomerProportion "
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="孕期占比">
          <template slot-scope="scope">
            <span>{{scope.row.monthCustomerProportion }}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sixBabyProportion"
          min-width="150"
          :show-overflow-tooltip="true"
          label="0-6个月占比">
          <template slot-scope="scope">
            <span>{{scope.row.sixBabyProportion}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="twelveBabyProportion"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="6-12个月占比">
          <template slot-scope="scope">
            <span>{{scope.row.twelveBabyProportion}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="thirtySixBabyProportion"
          min-width="150"
          :show-overflow-tooltip="true"
          label="12-36个月占比">
          <template slot-scope="scope">
            <span>{{scope.row.thirtySixBabyProportion}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sevenYearBabyProportion"
          min-width="150"
          :show-overflow-tooltip="true"
          label="3-7岁占比">
          <template slot-scope="scope">
            <span>{{scope.row.sevenYearBabyProportion}}%</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sevenYearUpBabyProportion"
          min-width="150"
          :show-overflow-tooltip="true"
          label="7岁以上占比">
          <template slot-scope="scope">
            <span>{{scope.row.sevenYearUpBabyProportion}}%</span>
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
import { filterStatus, fileDownload, locations } from '@/utils'
import gtNumberRange from '@/components/gt-number-range'
import moment from 'moment'
export default {
  name:'customerAnalysis-list',
  data () {
    return {
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      companyList:[],
      storeList:[],
      form:{
        storeName: '',//门店名称
        companyId:'',
        storeId: '',
        leagueAuthorizationCode:'',//加盟授权编码
        region:'',//大区
        provinceId:'',//省
        cityId:'',//市
        districtId:'',//区
        staCustomerTotal:'',//门店顾客总数-开始
        endCustomerTotal:'',//门店顾客总数-结束
        noMonthCustomerProportion:'',//无月龄顾客占比-开始
        endNoMonthCustomerProportion:'',//无月龄顾客占比-结束
        monthCustomerProportion:'',//顾客在孕期的占比-开始
        endMonthCustomerProportion:'',//顾客在孕期的占比-结束
        month:'',//月份
      },
    }
  },
  components: {
    gtPagination,gtSelectLocation,gtNumberRange
  },
  created () {
    //获取数据详情
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
        url: this.$http.adornUrl('/mop/customerReport/customerMonthReportList'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.form,
          month: this.form.month ? moment(this.form.month).format('YYYY-MM') : null,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records.map(item =>{
            return{
              ...item,
              month: item.month ? moment(item.month).format('YYYY-MM') : null,
            }
          })
          this.total = data.data.total
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.total = 0
        }
      })
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
    // 导出门店会员分析列表
    async exportExcel() {
      var local = locations(this.$refs['storeLocation'])
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/mop/customerReport/export'),
        method:'get',
        responseType: 'arraybuffer',
        selfHandleError: true,
        params: this.$http.adornParams({
          ...this.form,
          month: this.form.month ? moment(this.form.month).format('YYYY-MM') : null,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
          size: 10000,
          page: 0,
        })
      })
      fileDownload(data, '门店会员分析列表.xls')
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
        if (this.$refs['storeLocation']) {
          this.$refs['storeLocation'].refresh()
        }
        if (this.$refs['customerRange']) {
          this.$refs['customerRange'].refresh()
        }
        if (this.$refs['noageRange']) {
          this.$refs['noageRange'].refresh()
        }
        if (this.$refs['ageRange']) {
          this.$refs['ageRange'].refresh()
        }
        this.storeList = []
        this.pageSize = 20
        this.currentPage = 0
        this.getDataList()
      }else{
        this.$refs['customerRange'].validate(
          () => this.$refs['noageRange'].validate(
            () =>this.$refs['ageRange'].validate(
              () => this.getDataList()
            )
          )
        )
      }
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  @import '~@/assets/scss/store/store.scss';
</style>
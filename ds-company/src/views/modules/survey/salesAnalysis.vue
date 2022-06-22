<template>
  <div class="mod-store page-salesAnalysis">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select v-model="filterForm.category1Id" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
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
            <el-select v-model="filterForm.category2Id" placeholder="请选择二级分类" @change="changeSecondCatetory" clearable>
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
            <el-select v-model="filterForm.thirdCategoryId" placeholder="请选择三级分类" clearable>
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
        <el-form-item label="商品品牌" prop="brand">
          <el-select v-model="filterForm.brand" filterable placeholder="请选择商品品牌" clearable>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="effectiveBeginMonth"
            :start-time-value="startMonth"
            :end-time-value="endMonth"
            valueFormat="yyyy-MM"
            end-time-prop="effectiveEndMonth"
            @changeStartValue="value => monthRange(value, 'startMonth')"
            @changeEndValue="value => monthRange(value, 'endMonth')"
            type="month"
            class="alter_time_style"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="商品信息" prop="key">
          <el-input v-model="filterForm.key" placeholder="商品名称/条码/编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="销售门店" prop="storeId" v-if="isAuth('compaign:company:company:select')">
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择销售门店" clearable>
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类别" prop="type">
          <el-select v-model="filterForm.type" placeholder="请选择商品类别" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in (newStore == 'false' ? productType : productHaveBulkType)"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item label="" prop="codeless">
          <el-checkbox v-model="filterForm.codeless">查询结果包含无码商品</el-checkbox>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <div class="toptitle">
        <span class="tip">零售类商品净销售量：{{details.entityCountSum}}</span>
        <span class="tip">服务类商品净销售量：{{details.serviceCountSum}}</span>
        <span class="tip" v-if="newStore == 'true'">散称类商品净销售量：{{details.weight}}kg</span>
        <span class="tip">净销售额：{{priceNum(netSaleSum)}}元</span>
        <span class="tip">总成本：{{priceNum(costSum)}}元</span>
        <span class="tip">净毛利：{{priceNum(netProfitSum)}}元</span>
        <div class="filter-container">
          <el-radio-group v-model="date" @change="changeDate" size="small">
            <el-radio-button label="last" border>上月</el-radio-button>
            <el-radio-button label="month" border>本月</el-radio-button>
            <el-radio-button label="three" border>近三月</el-radio-button>
          </el-radio-group>
          <gt-border-button type="export" txt="下载查询结果" @click.native="() => exportExcel()"/>
        </div>
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
          prop="netCount"
          min-width="140"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSale('netCount')">
              净销售量
              <el-tooltip placement="top">
                <div slot="content">
                  销售数量 - 退货数量
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.sort === 'netCount'">
                <span v-if="countAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="netSale"
          min-width="140"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSale('netSale')">
              净销售额
              <el-tooltip placement="top">
                <div slot="content">
                  销售金额  - 退货金额
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.sort === 'netSale'">
                <span v-if="saleAsc"><img src="static/img/goods/topSale.png" alt="上"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="下"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.netSale)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="average"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            平均单价
            <el-tooltip placement="top">
              <div slot="content">
                净销售额 / 净销售量
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.average)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
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
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="brand"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="品牌">
        </el-table-column>
        <el-table-column
          prop="saleCount"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="销售数量">
        </el-table-column>
        <el-table-column
          prop="sale"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="销售金额">
          <template slot="header" slot-scope="scope">
            销售金额
            <el-tooltip placement="top">
              <div slot="content">
                商品销售的实收金额总和
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.sale)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="saleCost"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="销售成本">
           <template slot-scope="scope">
            <span>{{priceNum(scope.row.saleCost)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnCount"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="退货数量">
        </el-table-column>
        <el-table-column
          prop="returnAmount"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="退货金额">
           <template slot-scope="scope">
            <span>{{priceNum(scope.row.returnAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnCost"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="退货成本">
           <template slot-scope="scope">
            <span>{{priceNum(scope.row.returnCost)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cost"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="总成本">
          <template slot="header" slot-scope="scope">
            总成本
            <el-tooltip placement="top">
              <div slot="content">
                销售成本 - 退货成本
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.cost)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="netProfit"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="净毛利">
          <template slot="header" slot-scope="scope">
            净毛利
            <el-tooltip placement="top">
              <div slot="content">
                (销售金额-销售成本)-（退货金额-退货成本）
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.netProfit)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="profitRate"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="毛利率">
          <template slot="header" slot-scope="scope">
            毛利率
            <el-tooltip placement="top">
              <div slot="content">
                净毛利  / (销售金额  - 退货金额)
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="returnRate"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="退货率">
          <template slot="header" slot-scope="scope">
            退货率
            <el-tooltip placement="top">
              <div slot="content">
                退货数量 / 销售数量
              </div>
              <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
        </el-table-column>
        <el-table-column
          prop="spec"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, productHaveBulkType)}}</span>
          </template>
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
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus, productType, productHaveBulkType } from '@/utils/dict'
import { getStoreList } from '@/service/systore'
import { filterStatus,fileDownload } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/goods'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name: 'goods-salesAnalysis',
  data () {
    return {
      dataList: [],
      moment,
      startMonth: moment().format('YYYY-MM'),
      endMonth: moment().format('YYYY-MM'),
      brands: [],
      date: 'month',
      countAsc:false,
      saleAsc:false,
      netCountSum: 0,
      netSaleSum: 0,
      costSum: 0,
      netProfitSum: 0,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        date: [],
        key:'',
        brand: '',
        sort: 'netCount',
        type: '',
        category1Id: '',
        category2Id: '',
        asc: false,
        storeId: [],
        codeless: false,
        thirdCategoryId: '',
      },
      details: {},
      stores: [],
      productType,
      productHaveBulkType,
      filterStatus,
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],//三级分类

    }
  },
  components: {
    gtPagination,
    gtTimeRange,
  },

  async created() {
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore

    this.changeDate('month')
    // 获取商品列表
    this.getDataList()
    // 获取门店列表
    this.getStores()
    // 获取品牌列表
    this.getBrandList()

    // 获取商品分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
  },
  inject: ['exportList'],
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true

      const { data } = await api.getSalesAnalysisList({
        ...this.filterForm,
        // start: this.filterForm.date && this.filterForm.date.length > 0 ? this.filterForm.date[0] : null,
        // end: this.filterForm.date && this.filterForm.date.length > 1 ? this.filterForm.date[1] : null,
        start: this.startMonth,
        end: this.endMonth,
        date: null,
        // storeId: this.filterForm.storeId.join(','),
        storeId:this.filterForm.storeId,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.page.records.map(item => {
          return{
            ...item,
            netCount: item.type == 'BULK' ? item.netCount/1000 : item.netCount,//净销售量
            saleCount: item.type == 'BULK' ? item.saleCount/1000 : item.saleCount,//销售数量
            returnCount: item.type == 'BULK' ? item.returnCount/1000 : item.returnCount//退货数量
          }
        })
        this.details = data.data
        this.details.weight = data.data.weight/1000//散称类商品净销售量
        this.netSaleSum = data.data.netSaleSum
        this.costSum = data.data.costSum
        this.netProfitSum = data.data.netProfitSum
        this.total = data.data.page.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 导出商品列表
    async exportExcel() {
      let criteria = {
        ...this.filterForm,
        start:this.startMonth,
        end:this.endMonth,

      }
      // this.exportList(this.total, '商品销售分析列表', 'PRODUCT_SALE_ANALYSIS', criteria, async () => {
      if (this.total > 10000) {
        this.$message.warning('下载最多支持1万条查询数据，请缩小查询范围再进行下载！')
      } else {
        const { data, headers } = await api.salesAnalysisExport({
          ...criteria,
          page: 0,
          size: 10000,
        })
        fileDownload(data, '商品销售分析列表.xls')
      }
      // })
    },
    //销量、销售额升降
    changeSale(type, asc) {
      this.filterForm.sort = type
      if (type === 'netCount') {
        this.countAsc = !this.countAsc
        this.filterForm.asc = this.countAsc
      } else {
        this.saleAsc = !this.saleAsc
        this.filterForm.asc = this.saleAsc
      }
      this.getDataList()
    },
    // 选择日期
    changeDate(value) {
      let start = ''
      let end = ''
      switch(value) {
      case 'month':
        start = moment().startOf('month')
        end = moment()
        break
      case 'three':
        start = moment().startOf('month').subtract(2, 'month')
        end = moment()
        break
      case 'last':
        start = moment().startOf('month').subtract(1, 'month')
        end = moment().startOf('month').subtract(1, 'month')
      default:
        break
      }
      // this.filterForm.date = [start.format('YYYY-MM'), end.format('YYYY-MM')]
      this.startMonth = start.format('YYYY-MM')
      this.endMonth = end.format('YYYY-MM')
      this.resetForm('search')
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
    // changeMonth(){
    //   this.date = null
    // },
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
    async getSubCategoryList(id) {
      this.filterForm.category2Id = ''
      this.subCategory = []
      this.filterForm.thirdCategoryId = ''
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

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.subCategory = []
        this.date = 'month'
        this.changeDate('month')
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.page-salesAnalysis{
  .checked .el-checkbox {
    margin-left: 100px!important;
  }
  .toptitle {
    color: #72716F;
    font-size: 14px;
    font-weight: 700;
    overflow: hidden;
  }
  .tip{
    padding: 8px 20px 8px 0;
    display: inline-block;
  }
  .filter-container{
    float:right;
    padding: 0 10px;
    overflow: hidden;
    .el-radio{
      border: none;
    }
    .el-radio-group{
      margin-top: -8px;
    }
    .el-radio__input{
      display: none;
    }
    .el-radio__label{
      padding-left: 5px;
    }
    .el-radio-button--small .el-radio-button__inner{
      padding: 8.5px 24px;
    }
    .customer-date-picker{
      margin-right: 10px;
      width: 460px;
      float: right;
    }
  }
}
</style>


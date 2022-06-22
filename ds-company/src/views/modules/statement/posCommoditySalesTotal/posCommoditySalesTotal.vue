<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="salesTotal" :inline="true" ref='salesTotal' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="salesTotal.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="salesTotal.storeId" @change="chengeStore" filterable placeholder="请选择门店" clearable>
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
          <el-input v-model="salesTotal.key" placeholder="商品名称/条码/商品编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select v-model="salesTotal.category1Id" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
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
            <el-select v-model="salesTotal.category2Id" placeholder="请选择二级分类"  @change="changeSecondCatetory" clearable>
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
            <el-select v-model="salesTotal.thirdCategoryId" placeholder="请选择三级分类" clearable>
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
        <el-form-item label="商品归属" prop='ownership'>
          <el-select v-model="salesTotal.ownership" placeholder="请选择销售类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in goodsBelonging"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售时间">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="salesTotal.start"
            :end-time-value="salesTotal.end"
            end-time-prop="end"
            type="date"
            @changeStartValue="value => salesTotal.start = value"
            @changeEndValue="value => salesTotal.end = value"
          ></gt-time-range>
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
        <span>销售金额合计：{{details.saleSum || 0}}元</span>
        <!-- <span>折扣金额合计：{{NP.minus(details.saleSum,details.paidSum)}}元</span> -->
        <span>实收金额合计：{{details.paidSum || 0}}元</span>
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
          prop="storeNameAcc"
          min-width="150"
          :show-overflow-tooltip="true"
          label="营业执照名称"
          v-if="storeIdVal">
        </el-table-column>
        <el-table-column
          prop="province"
          min-width="100"
          :show-overflow-tooltip="true"
          label="省份"
          v-if="storeIdVal">
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="newCode"
          min-width="150"
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
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="120"
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
          prop="netCount"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              销售数量
              <el-tooltip placement="top">
                <div slot="content">
                  销售数量-退货数量
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.type == 'BULK' ? scope.row.netCount / 1000 : scope.row.netCount}}
              <span v-if="scope.row.type == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="120"
          :show-overflow-tooltip="true"
          label="平均售价">
          <template slot="header" slot-scope="scope">
            <span>
              平均售价
              <el-tooltip placement="top">
                <div slot="content">
                  净销售额/净销售量
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.retailPrice}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPriceSum"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              销售金额
              <el-tooltip placement="top">
                <div slot="content">
                  销售金额-退货金额
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.retailPriceSum}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="折扣金额">
          <template slot-scope="scope">
            <span>{{NP.minus(scope.row.retailPriceSum,scope.row.netSale)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="netSale"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              实收金额
              <el-tooltip placement="top">
                <div slot="content">
                  销售实收金额-退货金额
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.netSale}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cost"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              销售成本
              <el-tooltip placement="top">
                <div slot="content">
                  销售成本-退货成本
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.cost}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="净毛利">
          <template slot-scope="scope">
            <span>{{NP.minus(scope.row.netSale,scope.row.cost)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="总部分润">
          <template slot-scope="scope">
            <span>{{scope.row.ownership == 'COMPANY' ? NP.times(NP.minus(scope.row.netSale,scope.row.cost),0.3).toFixed(2) : 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店分润">
          <template slot-scope="scope">
            <span>{{scope.row.ownership == 'COMPANY' ? NP.times(NP.minus(scope.row.netSale,scope.row.cost),0.7).toFixed(2) : NP.minus(scope.row.netSale,scope.row.cost)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="毛利率">
          <template slot-scope="scope">
            <span>{{(scope.row.netSale == 0 ? 0 : NP.times(NP.divide(NP.minus(scope.row.netSale,scope.row.cost),scope.row.netSale).toFixed(4),100))+'%'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination ="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import NP from 'number-precision'
import { goodsBelonging } from '@/utils/dict'
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { commoditySalesTotal } from '@/service/statement'
import { getMainCategory,getSubCategory } from '@/service/goods'
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
import moment from 'moment'
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
      goodsBelonging,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      details:{},
      salesTotal:{
        storeName: null,
        key: null,//商品信息
        ownership: '',
        start: new Date(),
        end: new Date(),
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
    // 获取数据列表
    async getDataList() {
      if (!this.salesTotal.start || !this.salesTotal.end) {
        this.$message.warning('请先选择销售时间')
        return
      }
      this.dataListLoading = true
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await commoditySalesTotal({
        size: this.pageSize,
        page: this.currentPage,
        codeless: true,
        ...this.salesTotal,
        start: moment(this.salesTotal.start).format('YYYY-MM-DD'),
        end: moment(this.salesTotal.end).format('YYYY-MM-DD'),
        provinceId: local.provinceId || null,
      })
      if (data && data.code === 0) {
        this.details = data.data
        this.details.saleSum = this.priceNum(data.data.saleSum),
        this.details.paidSum = this.priceNum(data.data.paidSum),
        this.dataList = data.data.page.records !=[] ? data.data.page.records.map(item => {
          return{
            ...item,
            retailPrice:this.priceNum(item.retailPrice),//平均售价
            retailPriceSum:this.priceNum(item.retailPriceSum),//销售金额
            netSale:this.priceNum(item.netSale),//实收金额
            cost:this.priceNum(item.cost),//销售成本
            netProfit:this.priceNum(item.netProfit),//净毛利
          }
        }) : []
        this.total = data.data.page.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 监听门店
    chengeStore(val){
      this.storeIdVal = val
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
      this.salesTotal.category2Id = ''
      this.subCategory = []
      this.salesTotal.thirdCategoryId=''
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
    // 导出销售明细汇总报表
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        size: this.pageSize,
        page: this.currentPage,
        codeless: true,
        ...this.salesTotal,
        start: moment(this.salesTotal.start).format('YYYY-MM-DD'),
        end: moment(this.salesTotal.end).format('YYYY-MM-DD'),
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, 'pos商品销售汇总', 'REPORT_DAY_SALE_SKU', criteria)
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
        this.$refs['salesTotal'].resetFields()
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
          this.storeIdVal = false
        }
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  },
}
</script>
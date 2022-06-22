<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="filterForm" :inline="true" ref="filterForm" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="filterForm.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择门店" clearable>
            <el-option label="全部" value="" ></el-option>
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
            start-time-prop="beginTime"
            :start-time-value="filterForm.beginTime"
            :end-time-value="filterForm.endTime"
            end-time-prop="endTime"
            type="date"
            @changeStartValue="value => filterForm.beginTime = value"
            @changeEndValue="value => filterForm.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column prop="index" width="60" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
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
          prop="retailPriceSum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售金额">
        </el-table-column>
        <el-table-column 
         prop="discountAmount"
         min-width="100" 
         :show-overflow-tooltip="true" 
         label="折扣金额">
        </el-table-column>
        <el-table-column
          prop="netSale"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实收金额">
        </el-table-column>
        <el-table-column
          prop="cost"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售成本">
        </el-table-column>
        <el-table-column 
         prop="netProfit"
         min-width="100" 
         :show-overflow-tooltip="true" 
         label="净毛利">
        </el-table-column>
        <el-table-column 
         prop="profitRate" 
         min-width="100" 
         :show-overflow-tooltip="true" 
         label="毛利率">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from "@/components/gt-pagination";
import gtTimeRange from "@/components/gt-time-range";
import { getStoreSalesSumList } from "@/service/statement";
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name:'statement-storeSalesTotal-storeSalesTotal',
  data(){
    return {
      storeList: [],
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm: {
        storeId: null,
        beginTime: null,
        endTime: null,
      },
    }
  },
  inject: ['exportList'],
  async created() {
    this.getDataList();
    this.getStoreList();
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtSelectProvince,
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await getStoreSalesSumList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.filterForm,
        provinceId: local.provinceId || null,
      });
      this.dataListLoading = false;
      if(data && data.code ==0){
        this.dataList = data.data.records ? data.data.records.map(item=>{
          return{
            ...item,
            retailPriceSum:this.priceNum(item.retailPriceSum),//销售金额
            discountAmount:this.priceNum(item.discountAmount),//折扣金额
            netSale:this.priceNum(item.netSale),//实收金额
            cost:this.priceNum(item.cost),//销售成本
            netProfit:this.priceNum(item.netProfit)//净毛利
          }
        }) : []
        this.total = data.data.total;
      }else{
        this.dataList = [];
        this.total = 0;
        this.$message.error(data.msg);
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
    // 导出清单
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        ...this.filterForm,
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, '门店销售汇总', 'STORE_SALE_SUMMARY', criteria)
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.getDataList();
    },
    // 重置
    resetForm(type) {
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20;
      }
      this.currentPage = 0;
      this.getDataList();
    },
  },
}
</script>
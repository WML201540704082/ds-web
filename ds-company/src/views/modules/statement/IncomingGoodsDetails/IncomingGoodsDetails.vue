<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="salesDetails" :inline="true" ref="salesDetails" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
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
        <el-form-item label="供应商" prop="supplierName">
          <el-input v-model="salesDetails.supplierName" placeholder="请输入供应商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop="productInfo">
          <el-input v-model="salesDetails.productInfo" placeholder="商品名称/条码/自编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="categoryId">
            <el-select
              v-model="salesDetails.categoryId"
              @change="getSubCategoryList"
              placeholder="请选择一级分类"
              clearable>
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in mainCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="secondCategoryId">
            <el-select
              v-model="salesDetails.secondCategoryId"
              placeholder="请选择二级分类"
              @change="changeSecondCatetory"
              clearable>
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in subCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="thirdCategoryId">
            <el-select v-model="salesDetails.thirdCategoryId" placeholder="请选择三级分类" clearable>
              <el-option label="全部" value></el-option>
              <el-option
                v-for="item in thirdCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="商品归属" prop="ownership">
          <el-select v-model="salesDetails.ownership" placeholder="请选择销售类型" clearable>
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in productOwner"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="入库时间">
          <gt-time-range
            start-time-prop="beginTime"
            :start-time-value="salesDetails.beginTime"
            :end-time-value="salesDetails.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => salesDetails.beginTime = value"
            @changeEndValue="value => salesDetails.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item
          style="display: inline-block;float: right;"
          v-if="isAuth('company:reqStock:list')">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>零售类库存数合计：{{details.sumRetailNum  || 0}}</span>
        <span>散称类库存数量合计：{{details.sumBulkNum || 0}}kg</span>
        <span>库存成本合计：{{details.sumCostPriceAmount || 0}}元</span>
        <span>入库金额合计：{{details.sumProductCostPriceAmount || 0}}元</span>
      </div>
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
          prop="storeCode"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店编码">
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
          prop="orderNo" 
          min-width="160" 
          :show-overflow-tooltip="true" 
          label="入库单号">
        </el-table-column>
        <el-table-column
          prop="inStockTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="入库时间"
        ></el-table-column>
        <el-table-column
          prop="supplier"
          min-width="180"
          :show-overflow-tooltip="true"
          label="供应商"
        ></el-table-column>
        <el-table-column
          prop="category"
          min-width="150"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column 
         prop="secondCategory" 
         min-width="150" 
         :show-overflow-tooltip="true" 
         label="二级分类">
        </el-table-column>
        <el-table-column 
         prop="thirdCategory"
         min-width="150"
         :show-overflow-tooltip="true"
         label="三级分类">
          <template slot-scope="scope">
            <span>{{scope.row.thirdCategory || '--'}}</span>
          </template>
       </el-table-column>
        <el-table-column
          prop="ownership"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品归属">
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
         min-width="150" 
         :show-overflow-tooltip="true" 
         label="商品规格">
        </el-table-column>
        <el-table-column 
         prop="packingType" 
         min-width="150" 
         :show-overflow-tooltip="true" 
         label="单位">
        </el-table-column>
        <el-table-column 
         prop="quantity" 
         min-width="150" 
         :show-overflow-tooltip="true" 
         label="入库数量">
        </el-table-column>
        <el-table-column 
         prop="inStockPrice" 
         min-width="150" 
         :show-overflow-tooltip="true" 
         label="入库单价">
        </el-table-column>
        <el-table-column
          prop="inStockAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="入库金额">
        </el-table-column>
        <el-table-column 
         prop="costPrice"
         min-width="180" 
         :show-overflow-tooltip="true" 
         label="成本单价">
        </el-table-column>
        <el-table-column
          prop="sumCostPrice"
          min-width="180"
          :show-overflow-tooltip="true"
          label="成本金额">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { productOwner } from "@/utils/dict";
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from "@/components/gt-pagination";
import gtTimeRange from "@/components/gt-time-range";
import * as api from "@/service/statement";
import { getMainCategory, getSubCategory } from "@/service/goods";
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name: "statement-IncomingGoodsDetails-IncomingGoodsDetails",
  data() {
    return {
      storeList: [],
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      productOwner,
      details: {},
      salesDetails: {
        storeName: null,
        storeId: null,
        supplierName: null,
        beginTime: null,
        endTime: null,
        ownership:"",
      },
    };
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtSelectProvince,
  },
  inject: ['exportList'],
  async created() {
    this.getDataList();
    this.getStoreList();

    // 获取商品分类
    const data = await getMainCategory();
    if (data && data.records) {
      this.mainCategory = data.records;
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await api.getIncominGoodsList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.salesDetails,
        provinceId: local.provinceId || null,
      });
      this.dataListLoading = false;
      if(data && data.code ==0){
        if(data.data.page.records){
          this.dataList = data.data.page.records.map(item => {
            return{
              ...item,
            // inStockAmount: this.priceNum(item.inStockAmount),//入库金额
            // costPrice: this.priceNum(item.costPrice),//成本单价
            // sumCostPrice: this.priceNum(item.sumCostPrice),//成本金额
            // quantity: item.productType == "BULK" ? item.quantity/1000:item.quantity,//入库数量
            }
         })
       }else{
         this.dataList = []
       }
        this.details = data.data
        this.total = this.total = data.data.page.total;
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
    //监听一级分类，获取二级分类列表
    async getSubCategoryList(id) {
      this.salesDetails.secondCategoryId = "";
      this.subCategory = [];
      this.salesDetails.thirdCategoryId = "";
      this.thirdCategory = [];
      if (id) {
        const data = await getSubCategory(id);
        if (data && data.records) {
          this.subCategory = data.records;
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

    //导出入库商品明细清单
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        ...this.salesDetails,
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, '入库商品明细列表', 'REPORT_IN_STOCK_ITEMS', criteria)
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
        this.$refs["salesDetails"].resetFields();
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20;
      }
      this.currentPage = 0;
      this.getDataList();
    },
  },
};
</script>
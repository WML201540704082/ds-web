<template>
  <div class="mod-store buysale">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="省份" prop="provinceLocation">
          <gt-select-province ref="provinceLocation" @proviceValue="getStoreValue($event)" :provinceId="filterForm.provinceId"/>
        </el-form-item>
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品名称" prop="productName">
          <el-input v-model="filterForm.productName" placeholder="商品名称/条码/自编码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select
              v-model="filterForm.category1Id"
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
          <el-form-item prop="category2Id">
            <el-select
              v-model="filterForm.category2Id"
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
            <el-select v-model="filterForm.thirdCategoryId"  @change="changethirdCategory" placeholder="请选择三级分类" clearable>
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
          <el-select v-model="filterForm.ownership" placeholder="请选择销售类型" clearable>
            <el-option label="全部" value></el-option>
            <el-option
              v-for="item in productOwner"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="查询时间">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="beginDay"
            :start-time-value="filterForm.beginDay"
            :end-time-value="filterForm.endDay"
            end-time-prop="endDay"
            @changeStartValue="value => filterForm.beginDay = value"
            @changeEndValue="value => filterForm.endDay = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
        <gt-border-button
        type="export"
        class="gt-table-create"
        txt="下载查询结果"
        @click.native="() => exportExcel()"/>
        <el-tooltip placement="top">
         <div slot="content" style="width: 360px;">
          数据隔天统计；按实际出入库日期来统计各个出入库单的出入库数量和成本金额 <br>
          期初数 : 所选时间范围的起始日期 00:00，商品的结余库存数量和成本金额；<br>
          期末结余 : 所选时间范围的截止日期24:00，商品的结余库存数量和成本金额；<br>
         </div>
         <img class="tip-icon" style="margin-left: 10px;margin-top: -5px;" src="static/img/campaign/wenhao.png" alt="" />
       </el-tooltip>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-if="needRefresh"
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
          prop="storeName"
          align="center"
          min-width="100"
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
          prop="category1Name"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="二级分类">
        </el-table-column>
        <el-table-column
          prop="thirdCategory"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="三级分类">
          <template slot-scope="scope">
            <span>{{scope.row.thirdCategory ? scope.row.thirdCategory : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ownership"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品归属">
           <template slot-scope="scope">
            <span v-if="scope.row.ownership">{{scope.row.ownership == 'COMPANY' ? '企业统管商品' : '门店自营商品'}}</span>
            <span v-else>{{'--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="newCode"
          align="center"
          min-width="100"
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
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="spec"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="packingType"
          min-width="100"
          :show-overflow-tooltip="true"
          label="单位">
        </el-table-column>
        <el-table-column label="期初数">
          <el-table-column
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="数量">
            <template slot-scope="scope">
              <span class="amountTop">{{scope.row.beginNumber}}</span>
            </template>
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="100"
            label="金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.beginAmount ).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期入库">
          <el-table-column
            prop="inStockNumberCG"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="采购数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountCG"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="采购金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountCG).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberPS"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="配送数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountPS"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="配送金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountPS).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberDB"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="调拨数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountDB"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="调拨金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountDB).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberXSTH"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="销售退货">
          </el-table-column>
          <el-table-column
            prop="inStockAmountXSTH"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="退货入库金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountXSTH).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberQT"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="其他数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountQT"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="其他金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountQT).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberPD"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="盘盈数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountPD"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="盘盈金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountPD).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="inStockNumberJC"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="寄存入库数量">
          </el-table-column>
          <el-table-column
            prop="inStockAmountJC"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="寄存入库金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.inStockAmountJC).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="本期出库">
          <el-table-column
            prop="outStockNumberXS"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="销售数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountXS"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="销售金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountXS).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outStockNumberDB"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="调拨数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountDB"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="调拨金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountDB).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outStockNumberTH"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="退库数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountTH"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="退库金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountTH ).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outStockNumberQT"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="其他数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountQT"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="其他金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountQT).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outStockNumberPD"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="盘亏数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountPD"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="盘亏金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountPD).toFixed(2)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="outStockNumberJC"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="寄存提取数量">
          </el-table-column>
          <el-table-column
            prop="outStockAmountJC"
            align="center"
            min-width="100"
            :show-overflow-tooltip="true"
            label="寄存提取金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.outStockAmountJC).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table-column>
        <el-table-column label="期末结余">
          <el-table-column
            prop="endNumber"
            min-width="100"
            :show-overflow-tooltip="true"
            label="结存数量">
          </el-table-column>
          <el-table-column
            :show-overflow-tooltip="true"
            min-width="120"
            label="结余库存成本金额">
            <template slot-scope="scope">
              <span class="moneyBottom">￥{{priceNum(scope.row.endAmount).toFixed(2)}}</span>
            </template>
          </el-table-column>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import moment from 'moment'
import { getPurchasePageList } from '@/service/survey'
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
import { productOwner } from "@/utils/dict";
import { filterStatus, fileDownload, locations } from '@/utils';
import * as api from "@/service/statement";
import { getMainCategory, getSubCategory } from "@/service/goods";
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name:'statement-storeGoodsBuySaleBase-storeGoodsBuySaleBase',
  data(){
    return{
      moment,
      storeList:[],
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      dataListLoading:false,
      needRefresh: true,
      stores:[],
      dataList:[],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      productOwner,
      filterForm:{
        storeId:null,
        warehouse:'',// 仓库
        beginDay: moment().format('YYYY-MM-DD'),
        endDay: moment().format('YYYY-MM-DD'),
        productInfo:null,
        ownership:'',
      }
    }
  },
  components:{
    gtTimeRange,gtPagination,gtSelectProvince,
  },
  inject: ['exportList'],

  async created(){
    //数据详情
    this.getDataList(false)
    this.getStoreList();

     // 获取商品分类
    const data = await getMainCategory();
    if (data && data.records) {
      this.mainCategory = data.records;
    }
  },
  methods:{
    changeTable(flag) {
      this.needRefresh = false
      this.$nextTick(() => {
        this.needRefresh = true
        this.currentPage = 0
        this.getDataList(flag)
      })
    },
    //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      var local = locations(this.$refs['provinceLocation'])
      const { data } = await api.getStoreInventoryList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.filterForm,
        provinceId: local.provinceId || null,
      });
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item=>{
          return{
            ...item,
            beginNumber:item.productType == "BULK" ? item.beginNumber/1000:item.beginNumber,//期初数数量
            inStockNumberCG:item.productType == "BULK" ? item.inStockNumberCG/1000:item.inStockNumberCG,//采购数量
            inStockNumberPS:item.productType == "BULK" ? item.inStockNumberPS/1000:item.inStockNumberPS,//配送数量
            inStockNumberDB:item.productType == "BULK" ? item.inStockNumberDB/1000:item.inStockNumberDB,//调拨数量
            inStockNumberQT:item.productType == "BULK" ? item.inStockNumberQT/1000:item.inStockNumberQT,//其他数量
            inStockNumberPD:item.productType == "BULK" ? item.inStockNumberPD/1000:item.inStockNumberPD,//盘盈数量
            inStockNumberJC:item.productType == "BULK" ? item.inStockNumberJC/1000:item.inStockNumberJC,//寄存入库数量
            outStockNumberXS:item.productType == "BULK" ? item.outStockNumberXS/1000:item.outStockNumberXS,//销售数量
            outStockNumberTH:item.productType == "BULK" ? item.outStockNumberTH/1000:item.outStockNumberTH,//退库数量
            outStockNumberQT:item.productType == "BULK" ? item.outStockNumberQT/1000:item.outStockNumberQT,//其他数量
            outStockNumberPD:item.productType == "BULK" ? item.outStockNumberPD/1000:item.outStockNumberPD,//盘亏数量
            outStockNumberJC:item.productType == "BULK" ? item.outStockNumberJC/1000:item.outStockNumberJC,//寄存提取数量
            outStockNumberDB:item.productType == "BULK" ? item.outStockNumberDB/1000:item.outStockNumberDB,
            endNumber:item.productType == "BULK" ? item.endNumber/1000:item.endNumber,//结存数量
            // inStockAmountCG:item.productType == "BULK" ? item.inStockAmountCG/1000:item.inStockAmountCG,//采购金额
            inStockNumberXSTH:item.productType == "BULK" ? item.inStockNumberXSTH/1000:item.inStockNumberXSTH,//销售退货
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
      // this.mainCategoryName = this.mainCategory.filter(item=>item.id == id)
      // this.category1Name = this.mainCategoryName[0].name
      this.filterForm.category2Id = "";
      this.subCategory = [];
      this.filterForm.thirdCategoryId = "";
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
      // this.subCategoryName = this.subCategory.filter(item=>item.id == id)
      // this.category2Name = this.subCategoryName[0].name
      if (id) {
        const data = await getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },

    async changethirdCategory(id){
      this.thirdCategoryName = this.thirdCategory.filter(item=>item.id == id)
      this.category3Name = this.thirdCategoryName[0].name
    },

    // 导出查询结果列表
    async exportExcel() {
      var local = locations(this.$refs['provinceLocation'])
      const criteria = {
        ...this.filterForm,
        provinceId: local.provinceId || null,
      }
      this.exportList(this.total, '门店商品进销存', 'INVENTORY', criteria)
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
        this.$refs['filterForm'].resetFields()
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.dataList = []
        this.changeTable(true)
      }else{
        this.changeTable(false)
      }
    },
  }
}
</script>
<style lang="scss">
.mod-store.buysale{
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
  .moneyBottom{
    display: block;
    margin: -7px 0 -9px 0;
    text-align:right
  }
//   .mode-store-table .gt-table-create {
//     background-color: #c0c4cc !important;
//     border-color: #c0c4cc!important
//   }
}
</style>
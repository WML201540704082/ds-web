<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="仓库" prop="storeId">
          <el-select
            v-model="filterForm.storeId"
            placeholder="请选择"
            @change="changeTable"
            filterable
            reserve-keyword>
            <el-option  label="所有仓库" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品分类" v-if="isAuth('product:category:select')">
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
            <el-select v-model="filterForm.category2Id" placeholder="请选择二级分类" @change="changeSecondCatetory" v-if="isAuth('product:category:select:parentId')" clearable>
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
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="filterForm.brandId" placeholder="请选择商品品牌" filterable clearable>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="key">
          <el-input v-model="filterForm.key" placeholder="商品名称/条码/规格" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:stock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button v-if="isAuthMenu('stock_shopping') && newStore == 'false'"  class="gt-table-create" txt="新建采购单" @click.native="() => createShopping()"/>
      <gt-border-button v-if="isAuthMenu('stock_in')" class="gt-table-create" txt="新建入库单" @click.native="() => createInterStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_out')" class="gt-table-create" txt="新建出库单" @click.native="() => createOutStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_return')" class="gt-table-create" txt="新建退货单" @click.native="() => newReturnForm()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div v-if="filterForm.storeId" style="float:left;margin-right:10px;margin-top:3px">
        <span v-if="filterForm.storeId !== -1">门店零售类商品库存总数：{{details.quantitySum || 0}}</span>
        <span v-else>企业零售类商品库存总数：{{details.quantitySum || 0}}</span>
        <span v-if="filterForm.storeId !== -1 && newStore == 'true'">门店散称类商品库存总数：{{details.weight || 0}}kg</span>
        <span v-if="filterForm.storeId === -1 && newStore == 'true'">企业散称类商品库存总数：{{details.weight || 0}}kg</span>
        <span v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">库存总成本：{{priceNum(details.costPriceSum) || '--'}}元</span>
        <span v-if="filterForm.storeId !== -1">门店寄存总数：{{details.consignQuantity || '--'}}</span>
        <span v-if="filterForm.storeId !== -1 && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))">寄存总成本：{{priceNum(details.consignCostPriceSum) || 0}}元</span>
        <span v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">总零售额：{{priceNum(details.retailPriceSum) || '--'}}元</span>
      </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-if="needRefresh"
        v-table-height
        class="table-dataList">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="130"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="!filterForm.storeId" class="nopadding" type="text" size="small" @click="InStoreStock(scope.row)">库存详情</el-button>
            <el-button v-if="filterForm.storeId === -1" class="nopadding" type="text" size="small" @click="updateViewHandle(scope.row.id,scope.row.floor,scope.row.ceiling,scope.row.productType)">编辑</el-button>
            <span v-if="filterForm.storeId === -1">|</span>
            <el-button v-if="filterForm.storeId" class="nopadding" type="text" size="small" @click="InStockHandle(scope.row)">出入库明细</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          v-if="newStore == 'true'"
          prop="jdyCode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="精斗云编码">
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="newCode"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="自编码">
        </el-table-column>
        <el-table-column
          prop="brandName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
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
          prop="spec"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="costPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span v-if="scope.row.costPrice !== null">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="quantity"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSort('quantity')">
              实际库存
              <el-tooltip placement="top">
                <div slot="content" v-if="newStore == 'true'">
                  1.当前库存中实际的库存数量（包含寄存）<br/>
                  2.散称零食类商品库存单位为千克/kg
                </div>
                <div slot="content" v-else>
                  当前库存中实际的库存数量（包含寄存）
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.storeId">
                <span v-if="filterForm.sort === 'quantity'">
                  <span v-if="realityAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                  <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
                </span>
                <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
              </span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.quantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lockQuantity"
          min-width="120"
          v-if="filterForm.storeId == -1"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              锁定库存
              <el-tooltip placement="top">
                <div slot="content">
                  门店向企业订货，销管审核通过后锁定的库存数量
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.lockQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="useQuantity"
          min-width="120"
          v-if="filterForm.storeId == -1"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              可用库存
              <el-tooltip placement="top">
                <div slot="content">
                  实际库存-锁定库存
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.useQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consignQuantity"
          min-width="120"
          v-if="filterForm.storeId !== -1 && filterForm.storeId !== ''"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span>
              寄存库存
              <el-tooltip placement="top">
                <div slot="content">
                  寄存的库存数量
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.consignQuantity || 0}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inTransitQuantity"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSort('inTransitQuantity')">
              在途库存
              <el-tooltip placement="top">
                <div slot="content" v-if="newStore == 'true'">
                  1.收货单位为当前仓库但未到货的商品数量，均计入在途库存<br/>
                  2.散称零食类商品库存单位为千克/kg
                </div>
                <div slot="content" v-else>
                  收货单位为当前仓库但未到货的商品数量，均计入在途库存
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.storeId">
                <span v-if="filterForm.sort === 'inTransitQuantity'">
                  <span v-if="inTransitAsc"><img src="static/img/goods/topSale.png" alt="上"></span>
                  <span v-else><img src="static/img/goods/downSale.png" alt="下"></span>
                </span>
                <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
              </span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.inTransitQuantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPriceSum"
          v-if="filterForm.storeId && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))"
          min-width="100"
          :show-overflow-tooltip="true"
          label="库存成本">
          <template slot-scope="scope">
            <span v-if="scope.row.costPriceSum !== null">{{Number(priceNum(scope.row.costPriceSum)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consignCostPriceSum"
          v-if="filterForm.storeId !== -1 && filterForm.storeId !== '' && (newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库'))"
          min-width="100"
          :show-overflow-tooltip="true"
          label="寄存成本">
          <template slot-scope="scope">
            <span v-if="scope.row.consignCostPriceSum !== null">{{Number(priceNum(scope.row.consignCostPriceSum)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="floor"
          min-width="120"
          :show-overflow-tooltip="true"
          label="库存下限"
          v-if="filterForm.storeId">
          <template slot-scope="scope">
            <span>
              {{scope.row.floor}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
            <span style="color: red" v-if="scope.row.floor > scope.row.quantity">*库存不足</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="ceiling"
          min-width="120"
          :show-overflow-tooltip="true"
          label="库存上限"
          v-if="filterForm.storeId">
          <template slot-scope="scope">
            <span>
              {{scope.row.ceiling}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
            <span style="color: red" v-if="scope.row.ceiling < scope.row.quantity">*库存积压</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="最近盘点时间"
          v-if="filterForm.storeId">
          <template slot-scope="scope">
            <span>{{scope.row.adjustTime || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-stockwarn v-if="stockwarnVisible" ref="stockwarn" @refreshDataList="getDataList"/>
    <gt-instock v-if="inStockRecords" ref="inrecords" @refreshDataList="getDataList"/>
    <gt-storestock v-if="StoreStock" ref="storeStock" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus } from '@/utils/dict'
import { fileDownload } from '@/utils'
import { getStoreList } from '@/service/systore'
import gtStockwarn from './component/stockWarning'
import gtInstock from './component/inStockRecords'
import gtStorestock from './component/StoreStock'
import * as api from '@/service/stock'
import { brandsList } from '@/service/goods'
import { getStore } from '@/utils/storage'
export default {
  name: 'stockManagement-stockManagement',
  data () {
    return {
      stockwarnVisible: false,
      inStockRecords:false,
      StoreStock:false,
      realityAsc:false,
      inTransitAsc:false,
      dataList: [],
      details: {},
      needRefresh: true,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        key: null,
        category1Id: '',
        category2Id: '',
        thirdCategoryId: '',
        storeId:-1,
        brandId:'',
        showStockWarn: null,
        sort:''
      },
      storeList:[],
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      brands: [],
    }
  },
  components: {
    gtPagination, gtStockwarn, gtInstock, gtStorestock
  },

  async created () {
    this.storeList.unshift({
      id:-1,
      name:'企业总部'
    })
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    const { showStockWarn } = this.$route.params
    this.filterForm.showStockWarn = showStockWarn
    this.getDataList()

    // 获取商品一二级分类
    if(this.isAuth('product:category:select')){
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainCategory = data.records
      }
    }

    // 获取品牌列表
    this.getBrandList()
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
  },
  inject: ['exportList'],
  methods: {
    changeTable() {
      this.needRefresh = false
      this.$nextTick(() => {
        this.needRefresh = true
        this.currentPage = 0
        this.getDataList()
      })
    },
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
         data.data.unshift({
          id:-1,
          name:'企业总部'
        })
        this.storeList = data.data
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    // 获取数据列表
    async getDataList() {
      // const flag = this.dataList.find(item => item.storeId === this.filterForm.storeId) ? true : false
      this.dataListLoading = true
      let res = null
      if (this.filterForm.storeId && this.filterForm.storeId !== -1) {
        res = await api.getStockStoreListAndSum({
          ...this.filterForm,
          size: this.pageSize,
          page: this.currentPage
        })
      } else if (this.filterForm.storeId ===  -1) {
        res = await api.getStockListAndSum({
          ...this.filterForm,
          storeId:'',
          size: this.pageSize,
          page: this.currentPage
        })
      } else {
        res = await api.getStockListAndSum({
          ...this.filterForm,
          showAllStock:'true',
          size: this.pageSize,
          page: this.currentPage
        })
      }
      const { data } = res
      if (data.code === 0) {
        this.details = data.data
        this.details.weight = data.data.weight/1000 //散称类商品库存总数
        this.dataList = data.data.page.records.map(item => {
          return{
            ...item,
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//实际库存
            consignQuantity:item.productType == 'BULK' ? item.consignQuantity/1000 : item.consignQuantity,//寄存库存
            lockQuantity:item.productType == 'BULK' ? item.lockQuantity/1000 : item.lockQuantity,//锁定库存
            useQuantity:item.productType == 'BULK' ? item.useQuantity/1000 : item.useQuantity,//可用库存
            inTransitQuantity:item.productType == 'BULK' ? item.inTransitQuantity/1000 : item.inTransitQuantity,//在途库存
            consignCostPriceSum:item.productType == 'BULK' ? item.consignCostPriceSum/1000 : item.consignCostPriceSum,//寄存成本
            floor:item.productType == 'BULK' ? item.floor/1000 : item.floor,//库存上限
            ceiling:item.productType == 'BULK' ? item.ceiling/1000 : item.ceiling,//库存下限
          }
        })
        this.total = data.data.page.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //实际库存、在途库存升降
    changeSort(type, asc) {
      this.filterForm.sort = type
      if (type === 'quantity') {
        this.realityAsc = !this.realityAsc
        this.filterForm.asc = this.realityAsc
      } else {
        this.inTransitAsc = !this.inTransitAsc
        this.filterForm.asc = this.inTransitAsc
      }
      this.getDataList()
    },
    //商品分类
    async getSubCategoryList(id) {
      this.filterForm.category2Id = ''
      this.subCategory = []
      this.filterForm.thirdCategoryId = ''
      this.thirdCategory = []
      if (id) {
        if(this.isAuth('product:category:select:parentId')){
          const data = await api.getSubCategory(id)
          if (data && data.records) {
            this.subCategory = data.records
          }
        }
      }
    },
    async changeSecondCatetory(id) {
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },
    // 获取品牌列表
    async getBrandList() {
      const { data } = await brandsList()
      if (data.code === 0) {
        this.brands = data.data
      } else {
        this.brands = []
        this.$message.error(data.msg)
      }
    },
    // 导出库存管理清单
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        storeId: (this.filterForm.storeId && this.filterForm.storeId !== -1) ? this.filterForm.storeId : null,
        showAllStock: !this.filterForm.storeId ? 'true' : null,
      }
      // this.exportList(this.total, '库存管理', 'STOCK', criteria, async () => {
        const { data, headers } = await api.exportStockExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '库存管理.xls')
      // })
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
        this.filterForm.showStockWarn = null
      }
      this.currentPage = 0
      this.changeTable()
    },
    //新建采购单
    createShopping(){
      this.$router.push({name:'stockManagement-shopping-shoppingAdd'})
    },
    // 新建入库单
    createInterStock(){
      this.$router.push({name:'stockManagement-instock-inStockAdd'})
    },
    //新建出库单
    createOutStock(){
      this.$router.push({name:'stockManagement-outstock-outStockAdd'})
    },
    //新建退货单
    newReturnForm(){
      this.$router.push({name:'stockManagement-returnStock-newReturnForm'})
    },
    // 修改库存预警
    updateViewHandle(id,floor,ceiling,productType){
      this.stockwarnVisible = true
      this.$nextTick(() => {
        this.$refs.stockwarn.init(id,floor,ceiling,productType)
      })
    },
    //入库记录
    InStockHandle(row){
      this.inStockRecords = true
      this.$nextTick(() => {
        this.$refs.inrecords.init(row,this.filterForm.storeId)
      })
    },
    //门店库存
    InStoreStock(row){
      this.StoreStock = true
      this.$nextTick(() => {
        this.$refs.storeStock.init(row)
      })
    }
  }
}
</script>

<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="80px" :model="filterForm" @keyup.enter.native="resetForm('search')">
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
      <gt-border-button v-if="isAuthMenu('stock_in')" class="gt-table-create" txt="新建入库单" @click.native="() => createInterStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_out')" class="gt-table-create" txt="新建出库单" @click.native="() => createOutStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_require') && storeType == ''" class="gt-table-create" txt="新建订货单" @click.native="() => createReqStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_require') && storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL' " class="gt-table-create" txt="新建订货单" @click.native="() => newcreateReqStock()"/>
      <gt-border-button v-if="isAuthMenu('stock_return')" class="gt-table-create" txt="新建退货单" @click.native="() => createReturnStock()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>零售类库存总数：{{details.quantitySum || 0}}</span>
        <span v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">散称类库存总数：{{details.weight || 0}}kg</span>
        <span v-if="storeRoleName === '店长' && hasAuthorization">总成本：{{priceNum(details.costPriceSum) || '--'}}元</span>
        <span>寄存总数：{{details.consignQuantity || '--'}}</span>
        <span v-if="storeRoleName === '店长' && hasAuthorization">寄存总成本：{{priceNum(details.consignCostPriceSum) || '--'}}元</span>
        <span>总零售额：{{priceNum(details.retailPriceSum) || '--'}}元</span>
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
          width="135"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="updateViewHandle(scope.row.id,scope.row.floor,scope.row.ceiling,scope.row.productType)">编辑</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="InStockHandle(scope.row)">出入库记录</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
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
          <template slot-scope="scope">
            <span>{{scope.row.newCode || '--'}}</span>
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
          prop="brandName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
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
          v-if="storeRoleName === '店长' && hasAuthorization">
          <template slot-scope="scope">
            <span v-if="scope.row.costPrice !== null">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="零售价">
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
                <div slot="content" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
                  1.当前库存中实际的库存数量（包含寄存）<br/>
                  2.散称零食类商品库存单位为千克/kg
                </div>
                <div slot="content" v-else>
                  当前库存中实际的库存数量（包含寄存）
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.sort === 'quantity'">
                <span v-if="realityAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>
              {{scope.row.quantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="consignQuantity"
          min-width="120"
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
                <div slot="content" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'">
                  1.收货单位为当前仓库但未到货的商品数量，均计入在途库存<br/>
                  2.散称零食类商品库存单位为千克/kg
                </div>
                <div slot="content" v-else>
                  收货单位为当前仓库但未到货的商品数量，均计入在途库存
                </div>
                <img class="tip-icon" style="width: 15px;" src="static/img/campaign/wenhao.png" alt="" />
              </el-tooltip>
              <span v-if="filterForm.sort === 'inTransitQuantity'">
                <span v-if="inTransitAsc"><img src="static/img/goods/topSale.png" alt="上"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="下"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
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
          v-if="storeRoleName === '店长' && hasAuthorization"
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
          v-if="storeRoleName === '店长' && hasAuthorization"
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
          label="库存下限">
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
          label="库存上限">
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
          label="最近盘点时间">
          <template slot-scope="scope">
            <span>{{scope.row.adjustTime || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-stockwarn v-if="stockwarnVisible" ref="stockwarn" @refreshDataList="getDataList"/>
    <gt-instock v-if="inStockRecords" ref="inrecords" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus } from '@/utils/dict'
import { fileDownload } from '@/utils'
import gtStockwarn from './component/stockWarning'
import gtInstock from './component/inStockRecords'
import { brandsList } from '@/service/goods'
import * as api from '@/service/stock'
export default {
  name: 'stockManagement-stockManagement',
  data () {
    return {
      hasAuthorization: false,
      stockwarnVisible: false,
      inStockRecords:false,
      realityAsc:false,
      inTransitAsc:false,
      dataList: [],
      details:{},
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        category1Id:null,
        category2Id:null,
        thirdCategoryId:null,
        key: null,
        storeId: '',
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
    gtPagination, gtStockwarn, gtInstock
  },
  created () {
    this.allList()
    //门店店长
    const { storeRoleName = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
  },
  inject: ['exportList'],
  methods: {
    async allList(){
      const { showStockWarn } = this.$route.params
      this.filterForm.showStockWarn = showStockWarn
      this.getDataList()

      // 获取商品分类
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainCategory = data.records
      }
      // 获取品牌列表
      this.getBrandList()
    },
    // 新建订货单
    createReqStock(){
      this.$router.push({name:'stockManagement-requiredAdd'})
    },
     // 二代店新建订货单
    newcreateReqStock(){
      this.$easyConfirm.show({
        title: '提示',
        content: '订货单，请前往<span style="color:red">"萌百格店务助手-进货入库-订货单中进行订货"</span>',
        confirm: async () => {
          this.$easyConfirm.hide()
        }
      })
    },

    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStockListAndSum({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.details = data.data
        this.details.weight = data.data.weight/1000 //散称类商品库存总数
        this.dataList = data.data.page.records.map(item => {
          return{
            ...item,
            quantity:item.productType == 'BULK' ? item.quantity/1000 : item.quantity,//实际库存
            consignQuantity:item.productType == 'BULK' ? item.consignQuantity/1000 : item.consignQuantity,//寄存库存
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
      this.filterForm.categoryId = ''
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
      // this.exportList(this.total, '库存管理', 'STOCK', this.filterForm, async () => {
        const { data, headers } = await api.exportStockExcel({
          ...this.filterForm,
          // showCostPrice: (this.storeRoleName === '店长' && this.hasAuthorization) ? true : false,
          showCostPrice: false,
          size: 10000,
          page: 0
        })
        fileDownload(data, '库存管理.xls')
      // })
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
        this.pageSize = 20
        this.filterForm.showStockWarn = null
      }
      this.currentPage = 0
      this.getDataList()
    },
    // 新建入库单
    createInterStock(){
      this.$router.push({name:'stockManagement-instock-interStockAdd'})
    },
    //新建出库单
    createOutStock(){
      this.$router.push({name:'stockManagement-outstock-outStockAdd'})
    },
    //新建退货单
    createReturnStock(){
      this.$router.push({name:'stockManagement-returnStock-returnStockAdd'})
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
        this.$refs.inrecords.init(row)
      })
    }
  }
}
</script>


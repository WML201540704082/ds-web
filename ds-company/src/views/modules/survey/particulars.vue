<template>
  <div class="mod-store particulars">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="particulars" :model="particulars" label-width="80px" @keyup.enter.native="resetForm('search')">
        <el-form-item label="仓库" prop="warehouse">
          <el-select v-model="particulars.warehouse" filterable @change="changeWarehouseTable" placeholder="请选择销售门店">
            <el-option  label="企业总部" value="" ></el-option>
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品信息" prop="productInfo">
          <el-input v-model="particulars.productInfo" placeholder="商品名称/条码" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
        <div style="display:none;" class="button_check">
          <el-form-item label="商品分类">
            <el-form-item prop="firstCategoryId">
              <el-select v-model="particulars.firstCategoryId" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
                <el-option  label="全部" value="" ></el-option>
                <el-option
                  v-for="item in mainCategory"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="secondCategoryId">
              <el-select v-model="particulars.secondCategoryId" @change="changeSecondName" placeholder="请选择二级分类" clearable>
              <el-option label="全部" value="" ></el-option>
                <el-option
                v-for="item in subCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-form-item>
          <el-form-item label="商品品牌" prop="productBrandId">
            <el-select v-model="particulars.productBrandId" @change="changeBrand" filterable placeholder="请选择商品品牌" clearable>
              <el-option
                v-for="item in brands"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="出入库单号" prop="orderNumber">
            <el-input v-model="particulars.orderNumber" placeholder="请输入订单编号" clearable></el-input>
          </el-form-item>
          <el-form-item label="出入库类型" prop="warehouseInOutType">
            <el-select v-model="particulars.warehouseInOutType" @change="changeInOutType" placeholder="请选择商品类别" clearable>
              <el-option label="全部" value="" ></el-option>
              <el-option
                v-for="item in (!this.particulars.warehouse ? outInType : storeOutInType)"
                :key="item.value"
                :label="item.label"
                :value="item.value"/>
            </el-select>
          </el-form-item>
          <el-form-item label="往来单位" prop="currentUnit">
            <el-input v-model="particulars.currentUnit" placeholder="往来单位" clearable></el-input>
          </el-form-item>
          <el-form-item label="出入库时间">
            <gt-time-range
              start-time-prop="startTime"
              :start-time-value="particulars.startTime"
              @changeStartValue="value => particulars.startTime = value"
              :end-time-value="particulars.endTime"
              end-time-prop="endTime"
              @changeEndValue="value => particulars.endTime = value"
            ></gt-time-range>
          </el-form-item>
        </div>
      </el-form>
    </el-card>
    <!-- 更多查询 -->
    <img class="more-icon"  @click="showFlag" :src="`static/img/mycustomer/${isFlag?'page-close.png': 'page-open.png'}`" />
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-tooltip placement="top">
        <div slot="content" style="width: 360px;">• 实时统计，支持所有出入库明细流水查询；<br>• 成本单价为出入库发生当时，单品的成本价；<br>• 当入库数量中包含赠送数量时，成本总价不计算赠送数量的部分；</div>
        <img class="tip-icon" style="margin-left: 10px;" src="static/img/campaign/wenhao.png" alt="" />
      </el-tooltip>
      <div style="float:right;margin-right:10px;margin-top:5px">
        <span>零售类商品出入库数量合计：{{details.totalInOutQuantity || '--'}}</span>
        <span v-if="newStore == 'true'">散称类商品出入库数量合计：{{details.weight || 0}}kg</span>
        <span>成本总价合计：{{priceNum(details.totalPrice) || '--'}}元</span>
      </div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-if="needRefresh"
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
          prop="orderNumber"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="出入库单号">
        </el-table-column>
        <el-table-column
          prop="outgoingAndWarehousingTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="出入库时间">
        </el-table-column>
        <el-table-column
          prop="outgoingAndWarehousingType"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="出入库类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.outgoingAndWarehousingType, (!particulars.warehouse ? outInType : storeOutInType))}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="currentUnit"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="往来单位">
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barCode"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="productSpec"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="规格">
        </el-table-column>
        <el-table-column
          prop="firstCategoryName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
        </el-table-column>
        <el-table-column
          prop="secondCategoryName"
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
          prop="productBrandName"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="出入库数量">
          <template slot-scope="scope">
            <el-tooltip placement="top"  v-if="scope.row.outgoingAndWarehousingType === 'COMPANY_PURCHASE'">
              <div slot="content">采购数量+赠送数量</div>
              <span>{{scope.row.outgoingAndWarehousingQuantity}}</span>
            </el-tooltip>
            <span v-else>{{scope.row.outgoingAndWarehousingQuantity}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="inventoryBalance"
          min-width="100"
          :show-overflow-tooltip="true"
          label="库存结余">
        </el-table-column>
        <el-table-column
          prop="costUnitPrice"
          min-width="100"
          :show-overflow-tooltip="true"
          label="成本单价">
        </el-table-column>
        <el-table-column
          prop="totalCostPrice"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="成本总价">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { getStoreList } from '@/service/systore'
import { getMainCategory,getSubCategory,brandsList } from '@/service/goods'
import { getInOutPageList,inOutExport } from '@/service/survey'
import { outInType,storeOutInType } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, fileDownload } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name:'survey_particulars',
  data(){
    return{
      needRefresh: true,
      isFlag: false,
      dataListLoading: false,
      outInType,
      storeOutInType,
      filterStatus,
      stores:[],
      mainCategory: [],
      subCategory: [],
      brands: [],
      dataList:[],
      details:{},
      total: 0,
      pageSize: 20,
      currentPage: 0,
      particulars:{
        warehouse:'',// 仓库
        productInfo:null,//商品信息
        firstCategoryId: '',
        secondCategoryId: '',
        productBrandId:'',//商品品牌
        orderNumber:null,//出入库单号
        warehouseInOutType:'',//出入库类型
        currentUnit:null,//往来单位
        startTime: null,
        endTime: null,
      }
    }
  },
  components:{
    gtTimeRange,gtPagination
  },
  async created(){
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore

    //数据详情
    this.getDataList()
    //仓库
    this.getStores()
    // 获取商品分类
    const data = await getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
    //商品品牌
    this.getBrandList()
  },
  methods:{
    //获取数据详情
    async getDataList(){
      this.dataListLoading = true
      const { data } = await getInOutPageList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.particulars,
        startTimeString:this.particulars.startTime ? moment(this.particulars.startTime).format("YYYY-MM-DD HH:mm:ss") : null,
        endTimeString:this.particulars.endTime ? moment(this.particulars.endTime).format("YYYY-MM-DD HH:mm:ss") : null
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.page ? data.data.page.records.map(item => {
          return{
            ...item,
            costUnitPrice: this.priceNum(item.costUnitPrice),
            totalCostPrice: this.priceNum(item.totalCostPrice),
            outgoingAndWarehousingQuantity: item.productType == 'BULK' ? item.outgoingAndWarehousingQuantity/1000 : item.outgoingAndWarehousingQuantity,//出入库数量
            inventoryBalance: item.productType == 'BULK' ? item.inventoryBalance/1000 : item.inventoryBalance//库存结余
          }
        }) : []
        this.details = data.data
        this.details.weight = data.data.weight/1000 //散称类商品出入库数量合计
        this.total = data.data.page ? data.data.page.total : 0
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    //监听仓库
    changeWarehouseTable(val){
      this.needRefresh = false
      this.$nextTick(() => {
        this.needRefresh = true
        this.getDataList()
      })
      const storeName = this.stores.find(ele => ele.id === val)
      if (storeName) {
        this.particulars.warehouseName = storeName.name
      }
    },
    //监听品牌
    changeBrand(val){
      const brandName = this.brands.find(ele => ele.id === val)
      if (brandName) {
        this.particulars.productBrandName = brandName.name
      }
    },
    //监听出入库类型名称
    changeInOutType(val){
      const inOutTypeName = !this.particulars.warehouse ? this.outInType.find(ele => ele.value === val) : this.storeOutInType.find(ele => ele.value === val)
      if (inOutTypeName) {
        this.particulars.warehouseInOutTypeName = inOutTypeName.label
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
    //更多查询折叠
    showFlag(){
      if(!this.isFlag){
        $('.button_check').toggle('1000')
        this.isFlag =!this.isFlag
      }else{
        $('.button_check').toggle('1000')
        this.isFlag = !this.isFlag
      }
    },
    //监听一级分类，获取二级分类列表
    async getSubCategoryList(id) {
      this.particulars.secondCategoryId = ''
      this.subCategory = []
      if (id) {
        const data = await getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
        const firstName = this.mainCategory.find(ele => ele.id === id)
        if (firstName) {
          this.particulars.firstCategoryName = firstName.name
        }
      }else{
        this.particulars.firstCategoryName = null
        this.particulars.secondCategoryName = null
      }
    },
    //监听二级分类
    changeSecondName(id){
      const secondName = this.subCategory.find(ele => ele.id === id)
      if (secondName) {
        this.particulars.secondCategoryName = secondName.name
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
    // 导出查询结果列表
    async exportExcel() {
      let criteria = {
        ...this.particulars,
        firstCategoryId:this.particulars.firstCategoryId ? this.particulars.firstCategoryId : null,
        secondCategoryId:this.particulars.secondCategoryId ? this.particulars.secondCategoryId : null,
        productBrandId:this.particulars.productBrandId ? this.particulars.productBrandId : null,
        productBrandName:this.particulars.productBrandName ? this.particulars.productBrandName : null,
        warehouse:this.particulars.warehouse ? this.particulars.warehouse : 0,
        warehouseName:this.particulars.warehouse ? this.particulars.warehouseName : '企业总部',
        warehouseInOutType:this.particulars.warehouseInOutType ? this.particulars.warehouseInOutType : null,
        warehouseInOutTypeName:this.particulars.warehouseInOutType ? this.particulars.warehouseInOutTypeName : null,
        startTimeString:this.particulars.startTime ? moment(this.particulars.startTime).format("YYYY-MM-DD HH:mm:ss") : null,
        endTimeString:this.particulars.endTime ? moment(this.particulars.endTime).format("YYYY-MM-DD HH:mm:ss") : null,

      }
      // this.exportList(this.total, '出入库明细表', 'STOCK_DETAIL', criteria, async () => {
      if (this.total > 10000) {
        this.$message.warning('下载最多支持1万条查询数据，请缩小查询范围再进行下载！')
      } else {
        const { data, headers } = await inOutExport({
          ...criteria,
          page: 0,
          size: 10000,
        })
        fileDownload(data, '出入库明细表.xls')
      }
      // })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changeWarehouseTable()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['particulars'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.changeWarehouseTable()
    },
  }
}
</script>

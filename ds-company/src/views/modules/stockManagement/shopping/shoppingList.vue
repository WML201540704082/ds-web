<template>
  <div class="mod-store shopping">
    <el-card>
      <el-form :model="shopping" :inline="true" ref="shopping" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="采购单号" prop="orderNo">
          <el-input v-model="shopping.orderNo" placeholder="请输入采购单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="单据状态" prop='status'>
          <el-select v-model="shopping.status" placeholder="请选择入库状态" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in documentStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="供应商" prop="consignorCompanyName">
          <el-input v-model="shopping.consignorCompanyName" placeholder="请输入供应商名称" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="供应商" prop="supplier">
          <el-select
            v-model="shopping.supplier"
            placeholder="请选择" clearable
            filterable
            value-key="id"
            :remote-method="getSupplierlist"
            @change="getContact">
            <el-option
              v-for="item in supplierList"
              :key="item.id"
              :label="item.companyName"
              :value="item">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="采购时间">
          <gt-time-range
            start-time-prop="createDateStart"
            :start-time-value="shopping.createDateStart"
            :end-time-value="shopping.createDateEnd"
            end-time-prop="createDateEnd"
            @changeStartValue="value => shopping.createDateStart = value"
            @changeEndValue="value => shopping.createDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:inStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
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
          width="130"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="StockViewHandle(scope.row, 'view')">查看</el-button>
            <span v-if="scope.row.status == 'TODO' || scope.row.status == 'WAIT_PAY' || scope.row.status == 'BE_RECEIVED'">|</span>
            <el-button v-if="scope.row.status === 'BE_RECEIVED'" class="nopadding" type="text" size="small" @click="StockViewHandle(scope.row,'confirm')">确认收货</el-button>
            <el-button v-if="scope.row.status == 'TODO'" class="nopadding" type="text" size="small" @click="deleteShoppingStock(scope.row)">删除</el-button>
            <el-button v-if="scope.row.status === 'WAIT_PAY'" class="nopadding" type="text" size="small" @click="goPay(scope.row.id)">去支付</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="采购时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="采购单号">
        </el-table-column>
        <el-table-column
          prop="consignorCompanyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="供应商">
        </el-table-column>
        <el-table-column
          min-width="150"
          :show-overflow-tooltip="true"
          label="联系人">
          <template slot-scope="scope">
            <span>{{`${scope.row.ordererName || '--'}/${scope.row.ordererPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createUserName"
          min-width="180"
          :show-overflow-tooltip="true"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="单据状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,documentStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="skuKind"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品种类">
        </el-table-column>
        <el-table-column
          prop="skuTotalNum"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品数量">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-shopping v-if="shoppingVisible" ref="shoppingview" @refreshDataList="getDataList"/>
    <go-to-pay v-if="payVisible" ref="goToPay" @refreshDataList="getDataList"></go-to-pay>
  </div>
</template>
<script>
import { documentStatus } from '@/utils/dict'
import { getShoppingSupplierList } from '@/service/stock'
import { filterStatus } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
import gtShopping from './shoppingDetail'
import goToPay from './goToPay'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import moment from 'moment'
export default {
  name: 'stockManagement-shopping-shoppingList',
  components: {
    gtPagination,
    gtTimeRange,
    gtShopping,
    goToPay
  },
  data(){
    return{
      payVisible: false,
      documentStatus,
      filterStatus,
      dataList:[],
      supplierList:[],
      dataListLoading: false,
      supplierLoading: false,
      shoppingVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      shopping:{
        orderNo:null,
        status:null,
        supplier:null,
        consignorCompanyName:null,
        createDateStart: null,
        createDateEnd: null,
      },
    }
  },
  created(){
    //获取companyId
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    // 获取数据列表
    this.getDataList()
    // 获取供应商下拉列表
    // this.getSupplierlist()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.purchaseOrderList({
        selectType:'MY',
        loginType:'COMPANY',
        size: this.pageSize,
        page: this.currentPage+1,
        ...this.shopping,
        createDateStart:this.shopping.createDateStart ? moment(this.shopping.createDateStart).format("YYYY-MM-DD HH:mm:ss") : null,
        createDateEnd:this.shopping.createDateEnd ? moment(this.shopping.createDateEnd).format("YYYY-MM-DD HH:mm:ss") : null
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data ? data.data.records : []
        this.total = data.data ? data.data.total : 0
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    // 获取供应商下拉列表
    // async getSupplierlist(key){
    //   this.supplierLoading = true
    //   const { data } = await getShoppingSupplierList({
    //     currentPage:1,
    //     key,
    //     pageSize:10000,
    //     callSource:'B_M_PINK',
    //     mbgCompanyId:this.companyId,
    //   })
    //   if(data && data.code ==0){
    //     this.supplierList = data.data.records
    //   }else{
    //     this.supplierList =[]
    //   }
    //   this.supplierLoading = false
    // },
    //获取供应商联系人
    getContact(val) {
      const supplier = this.supplierList.find(ele => ele.id === val)
      if (supplier) {
        this.shopping.bossName = supplier.bossName
        this.shopping.bossPhone = supplier.bossPhone
      }
    },
    // 查看 or 确认收货
    StockViewHandle(row ,type){
      this.shoppingVisible = true
      this.$nextTick(() => {
        this.$refs.shoppingview.init(row, type)
      })
    },
    // 删除
    deleteShoppingStock(row){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await api.deleteShoppingStock({
            companyId:row.ordererId,
            loginType:'COMPANY',
            orderId:row.id,
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    //去支付
    goPay(id){
      this.payVisible = true
      this.$nextTick(() => {
        this.$refs.goToPay.init(id)
      })
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
        this.$refs['shopping'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

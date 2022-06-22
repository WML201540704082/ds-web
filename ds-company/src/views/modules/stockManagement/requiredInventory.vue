<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="requiredInvent" :inline="true" ref='requiredInvent' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
         <el-form-item label="订货单号" prop='orderNo'>
          <el-input v-model="requiredInvent.orderNo" placeholder="请输入订货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订货门店" prop='storeId' v-if="isAuth('store:sysUser:list')">
          <el-select v-model="requiredInvent.storeId" placeholder="请选择门店" filterable clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="requiredInvent.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in stockStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订货时间">
          <gt-time-range
            start-time-prop="beginCreateTime"
            :start-time-value="requiredInvent.beginCreateTime"
            :end-time-value="requiredInvent.endCreateTime"
            end-time-prop="endCreateTime"
            @changeStartValue="value => requiredInvent.beginCreateTime = value"
            @changeEndValue="value => requiredInvent.endCreateTime = value"
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
      <gt-border-button type="export" v-if="newStore == 'true'" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <gt-border-button v-if="companyRoleName == '销管' && newStore == 'true'" class="gt-table-create" txt="新建订货单" @click.native="() => createInterStock()"/>
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
          width="200"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="approvalView(scope.row.id,'view')">查看</el-button>
            <span v-if="scope.row.status == 'CHECK_PENDING' || scope.row.status == 'FINANCE_CHECK_PENDING'">|</span>
            <img v-if="scope.row.status == 'CHECK_PENDING' || scope.row.status == 'FINANCE_CHECK_PENDING'" class="tip-icon" style="width: 20px;margin-top: -2.5px;" src="static/img/campaign/tanhao.png" alt="" />
            <el-button v-if="scope.row.status == 'CHECK_PENDING'" class="nopadding" type="text" size="small" @click="approvalView(scope.row.id,'approval',scope.row.status)">(销管)审核</el-button>
            <el-button v-if="scope.row.status == 'FINANCE_CHECK_PENDING'" class="nopadding" type="text" size="small" @click="approvalView(scope.row.id,'approval',scope.row.status)">(财务)审核</el-button>
            <span v-if="scope.row.status == 'STORE_PENDING'">|</span>
            <el-button v-if="scope.row.status == 'STORE_PENDING'" class="nopadding" type="text" size="small" @click="createInterStock(scope.row.id)">编辑</el-button>
            <span v-if="scope.row.status == 'STORE_PENDING'">|</span>
            <el-button v-if="scope.row.status == 'STORE_PENDING'" class="nopadding" type="text" size="small" @click="deleteView(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订货时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="订货编号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订货门店">
        </el-table-column>
        <el-table-column
          min-width="150"
          :show-overflow-tooltip="true"
          label="订货人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="species"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货种类">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货数量"
          v-if="newStore == 'false'">
        </el-table-column>
        <el-table-column
          prop="wholesalePriceAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订货金额汇总">
          <template slot-scope="scope">
            <span v-if="scope.row.status!='REJECT'">{{scope.row.wholesalePriceAmount}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, stockStatus))">{{filterStatus(scope.row.status, stockStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkTime"
          min-width="180"
          label="审核时间">
        </el-table-column>
        <el-table-column
          prop="checkUser"
          min-width="120"
          :show-overflow-tooltip="true"
          label="审核人">
          <template slot-scope="scope">
            <span>{{`${scope.row.checkEmployeeName || '--'}/${scope.row.checkUser || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="240"
          label="备注">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-approval-stock v-if="approvalviewVisible" ref="approvalview" @refreshDataList="getDataList"/>
    <!-- <gt-check v-if="checkRequiredInventory" ref="checkview" @refreshDataList="getDataList"/> -->
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/stock'
import gtApprovalStock from './component/approvalView'
// import gtCheck from './component/checkRequiredInventory'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { stockStatus } from '@/utils/dict'
import { getStoreList } from '@/service/systore'
import { getStore } from '@/utils/storage'
export default {
  name: 'stockManagement-requiredInventory',
  components: {
    gtPagination,
    gtTimeRange,
    gtApprovalStock,
  },
  data(){
    return{
      approvalviewVisible: false,
      stockStatus,
      filterStatus,
      filterColor,
      dataList: [],
      storeList:[],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      requiredInvent:{
        orderNo: null,
        storeId: null,
        beginCreateTime: null,
        endCreateTime: null,
        status: null
      },
      companyRoleName:null,
    }
  },
  created(){
    const { status } = this.$route.params
    this.requiredInvent.status = status
    // 获取门店下拉
    if(this.isAuth('store:sysUser:list')){
      this.getStorelist()
    }
    if(this.isAuth('company:reqStock:list')){
      this.getDataList()
    }
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        this.storeList = data.data
      }else{
        this.storeList =[]
      }
      this.dataListLoading = false
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getReqStockList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.requiredInvent
      })

      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            amount:item.productType == 'BULK' ? item.amount/1000 : item.amount,//商品数量
            wholesalePriceAmount:item.wholesalePriceAmount/100
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }

    },
    // 新建订单
    createInterStock(id){
      if( this.companyRoleName!=='销管'){
        this.$message.warning('您的角色不是销管，没有权限');
        return
      }else {
      this.$router.push({name:'stockManagement-instock-orderAdd',query:{id:id}})
      }
    },
    // 导出订货管理清单
    async exportExcel() {
      const { data, headers } = await api.exportRequiredExcel({
        ...this.requiredInvent,
        size: 10000,
        page: 0
      })
      fileDownload(data, '订货清单.xls')
    },
    // 查看or审核
    approvalView(id,type,status){
      if (status == 'FINANCE_CHECK_PENDING' && this.companyRoleName!=='财务') {
        this.$message.warning('您的角色不是财务，没有权限');
        return
      } else if(status == 'CHECK_PENDING' && this.companyRoleName!=='销管'){
        this.$message.warning('您的角色不是销管，没有权限');
        return
      }else {
        this.approvalviewVisible = true
        this.$nextTick(() => {
          this.$refs.approvalview.init(id,type,status)
        })
      }
    },
    // 删除
    async deleteView(id,type,status){
    if( this.companyRoleName!=='销管'){
        this.$message.warning('您的角色不是销管，没有权限');
        return
      }else {
        this.approvalviewVisible = true
        this.$easyConfirm.show({
        title: '提示',
        content: '您确定删除订货单吗？',
        confirm: async () => {
                  const { data } = await api.deleteinOrder(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
          this.$easyConfirm.hide()
        }
      })
      }
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
        this.$refs['requiredInvent'].resetFields()
        this.requiredInvent.status = ''
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>


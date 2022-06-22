<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="出库单号" prop="orderNo" >
          <el-input v-model="filterForm.orderNo" placeholder="请输入出库单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="关联单号" prop="linkOrderNo" >
          <el-input v-model="filterForm.linkOrderNo" placeholder="请输入关联单号" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="目的门店" prop="storeId" v-if="isAuth('stock:company:company:select')">
          <el-select v-model="filterForm.storeId" @change="getStoreName" placeholder="请选择目的门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="收货单位" prop="storeName" >
          <el-input v-model="filterForm.storeName" placeholder="请输入收货单位" clearable></el-input>
        </el-form-item>
         <el-form-item label="出库类型" prop="outType">
          <el-select v-model="filterForm.outType" placeholder="请选择出库类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in outType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in outGoingType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="出库时间">
          <gt-time-range
            start-time-prop="beginOutStockTime"
            :start-time-value="filterForm.beginOutStockTime"
            :end-time-value="filterForm.endOutStockTime"
            end-time-prop="endOutStockTime"
            @changeStartValue="value => filterForm.beginOutStockTime = value"
            @changeEndValue="value => filterForm.endOutStockTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:outStock:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" :loading="printLoading" class="gt-table-create" txt="打印出库汇总" @click.native="() => totalPrint()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="140"
          label="操作"
          v-if="isAuth('company:outStock:list')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewHandle(scope.row.id, scope.row.batchNumber,'view')">查看</el-button>
            <!-- <span v-if="scope.row.status === 'OUT_PENDING'">|</span>
            <el-button v-if="scope.row.status === 'OUT_PENDING'" class="nopadding" type="text" size="small" @click="viewHandle(scope.row.id, scope.row.batchNumber,'out')">出库</el-button> -->
            <span v-if="scope.row.status === 'OUT_PENDING'">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100" v-if="scope.row.status === 'OUT_PENDING'">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div v-if="scope.row.status === 'OUT_PENDING' && !scope.row.linkId" class="buttonOne buttonOne1" @click="edit(scope.row.id)" >编辑</div>
              <div class="buttonOne" type="text" size="small" @click="viewHandle(scope.row.id, scope.row.batchNumber,'out')">出库</div>
              <div v-if="scope.row.status === 'OUT_PENDING' && !scope.row.linkId" class="buttonOne" @click="deleteStock(scope.row.id)" style="margin-bottom: 0">删除</div>
              <!-- <div class="buttonOne" v-if="scope.row.status == 'CHECK_PENDING'" @click="audit(scope.row.id)" >审核通过</div> -->
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="outStockTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="出库时间">
        </el-table-column>
        <el-table-column
          prop="orderNo"
          align="center"
          min-width="160"
          :show-overflow-tooltip="true"
          label="出库单号">
        </el-table-column>
        <el-table-column
          prop="outType"
          min-width="120"
          :show-overflow-tooltip="true"
          label="出库类型">
          <template slot-scope="scope">
            <span>{{scope.row.outType === 'WHOLESALE' ? '配送出库' :
                    scope.row.outType === 'WHOLESALES' ? '配送出库(订货)' :
                    scope.row.outType === 'OTHER' ? '其他出库' : '采购退货'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作人/审核人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="outStockEmployeeName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="出库人">
          <template slot-scope="scope">
            <span>{{`${scope.row.outStockEmployeeName || '--'}/${scope.row.outStockUser || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="出库状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, outGoingType))">{{filterStatus(scope.row.status, outGoingType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="species"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品种类">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品数量"
          v-if="newStore == 'false'">
        </el-table-column>
        <el-table-column
          prop="wholesalePriceAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="配送总额"
          v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.wholesalePriceAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkOrderNo"
          min-width="160"
          :show-overflow-tooltip="true"
          label="关联单号">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="收货单位">
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="240"
          label="备注">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <outgoing-view v-if="viewVisible" ref="outgoingView" @refreshDataList="getDataList"/>
    <outstock-total-output v-if="printLoading" :details="printDetail"/>
    <!-- <logistics-view v-if="logisticsVisible" ref="logisticsView" @refreshDataList="getDataList"/> -->
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { outGoingType,outType } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
// import { getStoreList } from '@/service/systore'
import { getOutgoingList, auditOutgoing,deleteOutStock,exportOutgoingExcel } from '@/service/stock'
import gtTimeRange from '@/components/gt-time-range'
import outgoingView from './outgoingView'
import printJS from 'print-js'
import outstockTotalOutput from './outstockTotalOutput'
import moment from 'moment'
import _ from 'lodash'
import { getStore } from '@/utils/storage'
export default {
  name: 'stockManagement-outstock-outgoingList',
  data () {
    return {
      dataList: [],
      printList: [],
      printLoading: false,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      viewVisible: true,
      logisticsVisible: true,
      outType,
      outGoingType,
      filterStatus,
      filterColor,
      printDetail: {},
      filterForm:{
        orderNo: null,
        linkOrderNo:null,
        storeName: null,
        status: '',
        beginOutStockTime: null,
        endOutStockTime: null,
        outType:''//出库类型
      },
      storeList: []
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    outgoingView,
    outstockTotalOutput
    // logisticsView
  },

  async created() {
    // 获取出库列表
    if(this.isAuth('company:outStock:list')){
      this.getDataList()
    }
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
  },

  inject: ['exportList'],

  methods: {
    // 汇总打印
    async totalPrint() {
      this.printLoading = true
      const { data } = await getOutgoingList({
        ...this.copyFilter,
        sort: 'outStockTime',
        asc: 'true',
        size: 10000,
        page: 0
      })
      let printList = []
      if (data.code === 0) {
        printList = data.data.records
        this.total = data.data.total
      } else {
        printList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      // 设置详情
      // const storeItem = this.storeList.find(store => store.id === this.copyFilter.storeId)
      this.printDetail = {
        orderNo: this.copyFilter.orderNo,
        linkOrderNo: this.copyFilter.linkOrderNo,
        storeName: this.copyFilter.storeName,
        status: this.filterStatus(this.copyFilter.status, this.outGoingType),
        time: (this.copyFilter.beginOutStockTime || this.copyFilter.endOutStockTime) ?
          `${this.copyFilter.beginOutStockTime ? this.moment(this.copyFilter.beginOutStockTime).format('YYYY-MM-DD HH:mm:ss') : ''} - ${this.copyFilter.endOutStockTime ? this.moment(this.copyFilter.endOutStockTime).format('YYYY-MM-DD HH:mm:ss') : ''}` : null,
        list: printList
      }
      this.$nextTick(() => {
        printJS({printable: 'company-total-outstock',  type: 'html', css: './static/print.css'})
        this.printLoading = false
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      this.copyFilter = _.cloneDeep(this.filterForm)
      const { data } = await getOutgoingList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            amount:item.productType == 'BULK' ? item.amount/1000 : item.amount,//商品数量
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 获取企业下属门店
    // async getStores() {
    //   const { data } = await getStoreList({
    //     status:1
    //   })
    //   if (data.code === 0) {
    //     this.storeList = data.data
    //   } else {
    //     this.$message.error(data.msg)
    //   }
    // },
    //获取门店名称
    getStoreName(val) {
      const sname = this.storeList.find(ele => ele.id === val)
      if (sname) {
        this.filterForm.storeName = sname.name
      }
    },
    // 查看/出库
    viewHandle (id, batchNumber,flag){
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.outgoingView.init(id, batchNumber,flag)
      })
    },
    // 编辑
    edit(id) {
      this.$router.push({name:'stockManagement-outstock-outStockAdd', query: {id}})
    },

    // 导出出库清单
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        status: this.filterForm.status ? this.filterForm.status : null,
      }
      // this.exportList(this.total, '出库清单', 'OUT_STOCK_ORDER', criteria, async () => {
        const { data, headers } = await exportOutgoingExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '出库清单.xls')
      // })
    },

    // 删除
    deleteStock(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await deleteOutStock(id)
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
    // 审核
    // audit(id) {
    //   this.$easyConfirm.show({
    //     title: '提示',
    //     content: '您是否通过审核',
    //     confirm: async () => {
    //       const {data} = await auditOutgoing({id})
    //       if (data.code === 0) {
    //         this.$easyConfirm.hide()
    //         this.$message.success('通过审核')
    //         this.getDataList()
    //       } else {
    //         this.$message.error(data.msg)
    //       }
    //     }
    //   })
    // },

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
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>


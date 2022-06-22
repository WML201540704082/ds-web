<template>
  <div class="mode-store-table" style="margin: 10px 0;margin-bottom: 3px;">
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
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="orderId"
          min-width="180"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="操作类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.operateType,operateType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="changeAmount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="变动金额">
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="120"
          :show-overflow-tooltip="true"
          label="变动后余额">
        </el-table-column>
        <el-table-column
          prop="operator"
          min-width="150"
          :show-overflow-tooltip="true"
          label="操作用户">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

      <gt-adjust-detail ref="detail"/>
      <gt-balance-list v-if="balanceVisible" ref="customerBalance" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtAdjustDetail from './adjustDetail'
import gtBalanceList from './updateBalance'
import { customerCardRecordList } from '@/service/mycustomer'
import { filterStatus } from '@/utils'
import { operateType } from '@/utils/dict'
export default {
  components: {gtPagination,gtAdjustDetail,gtBalanceList},
  data(){
    return{
      filterStatus,
      operateType,
      dataListLoading: false,
      balanceVisible:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
      companyRoleName:null,
    }
  },

  watch:{
    types:{
      handler(val,oldval){
        this.currentPage = 0
        this.pageSize = 20
        this.getDataList(val)
      },
    },
    customerCardId:{
      handler(val,oldval){
        this.currentPage = 0
        this.pageSize = 20
        this.getDataList()
      },
    }
  },
  props:['types','customerCardId'],
  created(){
    this.getDataList('')
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
  },
  methods:{
    async getDataList(type){
      const {data} = await customerCardRecordList({
        'page': this.currentPage,
        'customerCardId': this.customerCardId,
        'size': this.pageSize,
        'operateType': type,
      })
      if(data.code == 0){
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            changeAmount:this.priceNum(item.changeAmount),
            amount:this.priceNum(item.amount)
          }
        })
        this.total = data.data.total
      }else{
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList(this.types)
    },
  }
}
</script>



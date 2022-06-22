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
          width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="handdle(scope.row)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardName"
          width="200"
          :show-overflow-tooltip="true"
          label="购物卡名称">
        </el-table-column>
        <el-table-column
          prop="startTime"
          width="380"
          :show-overflow-tooltip="true"
          label="有效期">
          <template slot-scope="scope">
            <span v-if="scope.row.validityType == 'ALWAYS'">永久有效</span>
            <span v-else>{{scope.row.beginTime}}-{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="180"
          :show-overflow-tooltip="true"
          label="剩余金额">
          <template slot-scope="scope">
            <span>{{scope.row.amount}}
              <span class="theme-color" style="cursor:pointer" v-if="companyRoleName=='超级管理员' && types != 'INVALID' && scope.row.status != 'INVALID'" @click="updateBalance(scope.row.customerId,scope.row.cardId,scope.row.amount)">修改</span>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          :show-overflow-tooltip="true"
          label="适用门店">
          <template slot-scope="scope">
            <span v-if="scope.row.storeName">scope.row.storeName</span>
            <span v-else>全部门店</span>
          </template>
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
import { customerCardList } from '@/service/mycustomer'
export default {
  components: {gtPagination,gtAdjustDetail,gtBalanceList},
  data(){
    return{
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
    }
  },
  props:['types','customerid'],
  created(){
    this.getDataList('')
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
  },
  methods:{
    async getDataList(type){
      const {data} = await customerCardList({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
        'status': type,
      })
      if(data.code == 0){
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
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
    //修改剩余金额
    updateBalance(customerId,cardId,amount){
      this.balanceVisible = true
      this.$nextTick(() => {
        this.$refs.customerBalance.init(customerId,cardId,amount)
      })
    },
    //查看
    handdle(row) {
      this.$nextTick(() => {
        this.$refs.detail.init(row.id,row)
      })
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



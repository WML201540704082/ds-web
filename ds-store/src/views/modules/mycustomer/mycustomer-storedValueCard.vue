<template>
  <!-- table列表 -->
    <el-card class="mode-store-table">
      <!-- <gt-subtitle title="储值卡充值记录" style="width: 100%;"/> -->
      <div style="margin: 10px 0;margin-bottom: 20px;">
        <span style="color:#FC5A3D;">充值总额：{{priceNum(count)}}</span>
        <span class="customerinfos" style="float: right">
          <span>顾客名称: {{name}}</span>
          <span style="margin-left: 10px;">手机号码: {{phone}}</span>
        </span>
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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="id"
          :show-overflow-tooltip="true"
          width="250"
          label="充值单号">
        </el-table-column>
        <el-table-column
          prop="createTime"
          width="250"
          :show-overflow-tooltip="true"
          label="充值时间">
        </el-table-column>
        <el-table-column
          prop="payAmount"
          :show-overflow-tooltip="true"
          width="200"
          label="充值总额">
          <template slot-scope="scope">
            {{priceNum(scope.row.rechargeAmount)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          :show-overflow-tooltip="true"
          width="200"
          label="充值门店">
        </el-table-column>
        <el-table-column
          prop="afterPayBalance"
          width="250"
          :show-overflow-tooltip="true"
          label="充值后可用余额">
          <template slot-scope="scope">
            <span>
              {{priceNum(scope.row.afterPayBalance)}}
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="payType"
          min-width="200"
          :show-overflow-tooltip="true"
          label="充值方式">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.payType, paymentOfMode)}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
</template>
<script>
// import gtSubtitle from '@/components/gt-sub-title'
import gtPagination from '@/components/gt-pagination'
import { getMoney } from '@/service/mycustomer'
import { filterStatus } from '@/utils'
import { paymentOfMode } from '@/utils/dict'
export default {
  name:'mycustomer-storedValueCard',
  components: {gtPagination},
  data(){
    return{
      id: null,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
      count: null,
      name: null,
      phone: null,
      paymentOfMode,
      filterStatus
    }
  },
  created(){
    const { id,count,name,phone } = this.$route.query
    this.id = id
    this.count = count
    this.name = name
    this.phone = phone
    this.getDataList()
  },
  methods:{
    async getDataList(){
      const {data} = await getMoney({
        customerId: this.id,
        size: this.pageSize,
        page: this.currentPage,
      })
      if(data.code == 0){
        this.dataList = data.data.records
        this.total = data.data.total
        this.$emit('refreshDataList')
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
      this.getDataList()
    },
  }
}
</script>


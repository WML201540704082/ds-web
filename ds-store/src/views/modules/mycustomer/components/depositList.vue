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
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="handdle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          min-width="180"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="spec"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品规格">
        </el-table-column>
        <el-table-column
          prop="createTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="寄存时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="寄存门店">
        </el-table-column>
        <el-table-column
          prop="consignQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="寄存数量">
        </el-table-column>
        <el-table-column
          prop="balanceQuantity"
          min-width="100"
          :show-overflow-tooltip="true"
          label="剩余数量">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

      <gt-deposit-detail ref="detail" />
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtDepositDetail from './depositDetail'
import { depositList } from '@/service/mycustomer'
export default {
  components: {gtPagination,gtDepositDetail},
  data(){
    return{
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      dataList: [],
    }
  },
  props:['customerid'],
  created(){
    this.getDataList()
  },
  methods:{
    async getDataList(){
      const {data} = await depositList({
        'page': this.currentPage,
        'customerId': this.customerid,
        'size': this.pageSize,
      })
      if(data.code == 0){
        this.dataList = data.data.records
        this.total = data.data.total
      }else{
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }

    },
    handdle(id) {
      this.$nextTick(() => {
        this.$refs.detail.init(id)
      })
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



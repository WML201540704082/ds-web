<template>
	<div class="mod-store customers">
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <div class="info">
        门店合伙人：{{name || '--'}} / {{phone || '--'}}
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
          min-width="80"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.productPackageId" class="nopadding" type="text" size="small" @click="() => productDetail(scope.row)">商品明细</el-button>
            <span v-if="!scope.row.productPackageId">--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="购买时间">
        </el-table-column>
        <el-table-column
          prop="orderName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="购买内容">
        </el-table-column>
        <el-table-column
          prop="validTimeTo"
          min-width="220"
          :show-overflow-tooltip="true"
          label="有效期至">
        </el-table-column>
        <el-table-column
          prop="payStatus"
          min-width="80"
          :show-overflow-tooltip="true"
          label="提货状态">
          <template slot-scope="scope">
            <span v-if="scope.row.productPackageId">{{scope.row.takeGoodsStatus == 'NOTAKE' ? '待提货' : (scope.row.takeGoodsStatus == 'TAKED' ? '已提货' : '--')}}</span>
            <span v-if="!scope.row.productPackageId">--</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
		<gt-product v-if="productviewVisible" ref="productview" @refreshDataList="getDataList"/>
	</div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'//分页
import gtProduct from './components/productDetail'
import { buyRecords } from '@/service/mycustomer'
import * as api from '@/service/mycustomer'
export default {
  name:'buy-record',
  data(){
    return{
      productviewVisible: false,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      buy:{},
    }
  },
  components: {
    gtPagination, gtProduct
  },
  created(){
    const { customerId, name, phone } = this.$route.query
    this.customerId = customerId
    this.phone = phone
    this.name = name
    this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.buyRecords({
        customerId: this.customerId,
        size: this.pageSize,
        page: this.currentPage,
      })
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        if(this.dataList&&this.dataList.length>0){
          this.dataList.map(o=>{
            var validTimeTo = o.validTimeTo
            var endtime = validTimeTo.substring(0, 10)
            o.validTimeTo = endtime.replace(/-/g, '/')
          })
        }
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
      this.dataListLoading = false
    },
    // 商品明细
    productDetail (packageItem){
      this.productviewVisible = true
      this.$nextTick(() => {
        this.$refs.productview.init(packageItem)
      })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    }
  }
}
</script>
<style>

</style>

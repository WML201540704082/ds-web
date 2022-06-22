<template>
  <div class="mop_company_shortmessage">
    <!-- table列表 -->
    <el-card class="mop-store-table">
      <span class="itemHead">企业名称：{{shortmessage.name || '--'}}  法人：{{shortmessage.legalPerson || '--'}}</span>
      <!-- <span class="itemHead"></span> -->
      <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          v-table-height
          :stripe="true"
      >
          <el-table-column
            prop="index"
            width="55"
            label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="createTime"
              width="180"
              :show-overflow-tooltip="true"
              label="时间">
          </el-table-column>
          <el-table-column
              prop="orderNo"
              width="180"
              :show-overflow-tooltip="true"
              label="充值单号">
          </el-table-column>
          <el-table-column
              prop="send"
              width="120"
              :show-overflow-tooltip="true"
              label="发送数量">
          </el-table-column>
          <el-table-column
              prop="recharge"
              width="120"
              :show-overflow-tooltip="true"
              label="充值数量">
          </el-table-column>
          <el-table-column
              prop="amount"
              width="140"
              :show-overflow-tooltip="true"
              label="短信余量">
          </el-table-column>
          <el-table-column
              prop="operator"
              min-width="180"
              :show-overflow-tooltip="true"
              label="操作账号">
              <template slot-scope="scope">
                <span>({{(scope.row.operator === "COMPANY" || scope.row.operator === 'STORE') ? '商户' : scope.row.operator }}) {{scope.row.employeeName || '--'}}/{{scope.row.phone || '--'}}</span>
              </template>
          </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { getAccountRecordList } from '@/service/company'
import * as api from '@/service/company'
export default {
  name:'message-view',
  data(){
    return{
      dataList: [],
      dataListLoading: false,
      total: 0,
      companyId: '',
      pageSize: 20,
      currentPage: 0,
      shortmessage:{
        createTime:'',
        send:'',
        recharge:'',
        amount:'',
        operator:''
      },
    }
  },
  components: {
    gtPagination
  },
  created () {
    const { id } = this.$route.query
    this.companyId = id
    this.getDataList()
    this.init()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getAccountRecordList({
        companyId: this.companyId,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    async init(id) {
      const { data } = await api.getCompanyDetail({
        companyId:this.companyId
      })
      if (data.code === 0) {
        this.shortmessage = data.data
      } else {
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

<style lang="scss">
.mop_company_shortmessage{
  .itemHead{
    float: left;
    margin: 10px;
    font-size: 16px;
  }
}

</style>

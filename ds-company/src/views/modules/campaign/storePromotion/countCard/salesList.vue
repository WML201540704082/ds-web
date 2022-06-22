<template>
  <div class="mod-store customers page-customer-list">
    <el-card>
      <el-form :model="stateCard" label-width="130px" :inline="true" ref='stateCard' class="mode-form-line1"  @keyup.enter.native="resetForm('seach')">
        <el-form-item label="顾客姓名/手机号" prop='keyword'>
          <el-input v-model="stateCard.keyword" placeholder="请输入顾客姓名/手机号" clearable></el-input>
        </el-form-item> 
        <el-form-item label="卡号" prop='cardNo'>
          <el-input v-model="stateCard.cardNo" placeholder="请输入卡号" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" >
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <el-table
        v-table-height
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
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
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售时间">
          <template slot-scope="scope">
            <span>{{scope.row.createTime || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="statCardNo"
          :show-overflow-tooltip="true"
          min-width="160"
          label="卡号">
        </el-table-column>
        <el-table-column
          prop="statCardName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="卡名称">
          <template slot-scope="scope">
            <span>{{scope.row.statCardName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          :show-overflow-tooltip="true"
          min-width="60"
          label="类型">
          <template >
            <span>礼品卡</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="customerName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="顾客姓名">
          <template slot-scope="scope">
            <span>{{scope.row.customerName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          min-width="100"
          :show-overflow-tooltip="true"
          label="有效期">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { sendStatCardRecordPage } from '@/service/campaign'
export default {
  name:'countCard-salesList',
  data () {
    return {
      isFlag: false,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      stateCard:{
        statCardId: null,
        cardNo:null,
        keyword: null,
        recordType:null
      },
      statCardId:null,
      recordType:null
    }
  },
  components: {
    gtPagination,
  },
  created () {
    this.statCardId = this.$route.query&&this.$route.query.id
    this.recordType = this.$route.query&&this.$route.query.recordType
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList(statCardId) {
      this.dataListLoading = true
      const { data } = await sendStatCardRecordPage({
        size: this.pageSize,
        page: this.currentPage,
        ...this.stateCard,
        statCardId: this.statCardId,
        recordType: this.recordType
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
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
      if (type === 'reset') {
        this.$refs['stateCard'].resetFields()
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.page-customer-list{
  .more-icon{
    position: relative;
    top: -2px;
    width: 60px;
    left: calc(50% - 30px);
    cursor: pointer;
  }
}
</style>



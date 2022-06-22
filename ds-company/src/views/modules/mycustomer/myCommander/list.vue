<template>
  <div class="mod-store customers page-customer-list">
    <el-card>
      <el-form :model="customer" label-width="110px" :inline="true" ref='customer' class="mode-form-line1"  @keyup.enter.native="resetForm('seach')">
        <el-form-item label="顾客姓名/手机号" prop='keyword'>
          <el-input v-model="customer.keyword" placeholder="顾客姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:customer:list')">
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
          prop="name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="顾客姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="昵称">
          <template slot-scope="scope">
            <span>{{scope.row.wechatName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          :show-overflow-tooltip="true"
          min-width="60"
          label="性别">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.gender, sex))">{{filterStatus(scope.row.gender, sex)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="groupbuy"
          min-width="100"
          :show-overflow-tooltip="true"
          label="团长级别">
          <template slot-scope="scope">
            <span v-if="scope.row.groupbuy&&scope.row.groupbuy.level">{{filterStatus(scope.row.groupbuy.level, commanderLevel)}}</span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="groupbuy"
          min-width="100"
          :show-overflow-tooltip="true"
          label="粉丝数量">
          <template slot-scope="scope">
            <span v-if="scope.row.groupbuy&&scope.row.groupbuy.fans">{{scope.row.groupbuy.fans}}</span>
            <span v-else>0</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { sex, customerLevel, sourceStatus, typeStatus, commanderLevel } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { mapMutations } from 'vuex'
import { getCustomerList } from '@/service/mycustomer'
import moment from 'moment'
export default {
  name:'mycustomer-myCommander-list',
  data () {
    return {
      filterStatus,
      filterColor,
      customerLevel,
      commanderLevel,
      moment,
      isFlag: false,
      dataList: [],
      dataListSelections:[],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      sex,
      customer:{
        groupbuy:true,
        keyword: null
      }
    }
  },
  components: {
    gtPagination,
  },
  created () {
    this.getDataList()
  },
  methods: {
    ...mapMutations({
      updateCustomerList: 'customer/updateCustomerList',
    }),
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCustomerList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.customer
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
        this.$refs['customer'].resetFields()
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



<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="礼品卡名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入礼品卡名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('store:coupon:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
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
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="code"
          min-width="150"
          :show-overflow-tooltip="true"
          label="礼品卡编号">
        </el-table-column> -->
        <el-table-column
          prop="name"
          min-width="120"
          :show-overflow-tooltip="true"
          label="礼品卡名称">
        </el-table-column>
        <el-table-column
          min-width="180"
          :show-overflow-tooltip="true"
          label="卡项内容">
          <template slot-scope="scope">
            <span>{{getContent(scope.row.items)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="validDateEnum"
          min-width="200"
          :show-overflow-tooltip="true"
          label="有效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.validDateEnum==='MONTH'">自购买日起{{scope.row.validTime}}个月</span>
            <span v-else>{{scope.row.startTime.substring(0,10)}}至{{scope.row.endTime.substring(0,10)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="stores"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
          <template slot-scope="scope">
            <span>{{getStores(scope.row.stores)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="sales"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售数量">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { statcardStatus } from '@/utils/dict'
import * as api from '@/service/campaign'
import { getStoreList } from '@/service/systore.js'
import { filterStatus, fileDownload } from '@/utils'
export default {
  name:'campaign-storePromotion-countCard-countCard',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        name: null,
      },
      statcardStatus,
      filterStatus,
      stores: []
    }
  },
  components: {
    gtPagination
  },

  async created() {
    // 获取优惠券列表
    if(this.isAuth('store:coupon:list')){
      this.getDataList()
    }

  },
  inject: ['exportList'],
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStatCardList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        const { records = [], total = 0 } = data.data || {}
        this.dataList = records
        this.total = total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false

    },

    // 导出优惠券列表
    async exportExcel() {
      this.exportList(this.total, '礼品卡列表', 'STORE_STAT_CARD', this.filterForm, async () => {
        const { data, headers } = await api.exportCountcardExcel({
          ...this.filterForm,
          size: 10000,
          page: 0
        })
        fileDownload(data, '礼品卡列表.xls')
      })
    },

    getContent(list) {
      const newList = list.map(item => {
        return item.name + '*' + item.count
      })
      return newList.join(',')
    },
    getStores(list) {
      let str = list.map(item => {
        return item.name
      })
      return str.join(',')
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'countCard-view', query: {id}})
    },
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

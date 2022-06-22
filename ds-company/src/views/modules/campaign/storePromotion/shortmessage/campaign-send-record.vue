<template>
  <div class="mod-store">
    <!-- 查询条件 -->
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="120px" :model="filterForm" @keyup.enter.native="resetForm('search')">
      <el-form-item label="发送时间">
        <gt-time-range
          start-time-prop="start"
          :start-time-value="filterForm.start"
          @changeStartValue="value => filterForm.start = value"
          :end-time-value="filterForm.end"
          end-time-prop="end"
          @changeEndValue="value => filterForm.end = value"
          type="datetime"
        ></gt-time-range>
      </el-form-item>
      <el-form-item class="search-toolbar">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>

    <!-- table列表 -->
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
        prop="sendDate"
        min-width="180"
        :show-overflow-tooltip="true"
        label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.sendDate ? moment(scope.row.sendDate).format('YYYY-MM-DD HH:mm:ss') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        align="center"
        min-width="120"
        :show-overflow-tooltip="true"
        label="手机号码">
      </el-table-column>
      <el-table-column
        prop="content"
        align="center"
        min-width="200"
        :show-overflow-tooltip="true"
        label="短信内容">
      </el-table-column>
      <el-table-column
        prop="sendResult"
        :show-overflow-tooltip="true"
        min-width="100"
        label="发送状态">
        <template slot-scope="scope">
          <span :class="filterColor(filterStatus(scope.row.sendResult, originalMessageStatus))">{{filterStatus(scope.row.sendResult, originalMessageStatus)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { originalMessageStatus } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
import { filterStatus, filterColor } from '@/utils'
import { getCampaignSendList } from '@/service/campaign'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      originalMessageStatus,
      moment,
      filterStatus,
      filterColor,
      filterForm:{
        status: '',
        start: null,
        end: null
      },
    }
  },
  components: {
    gtPagination,
    gtTimeRange
  },

  async created() {
    // 获取商品列表
    this.getDataList()
  },
  methods: {
    // 获取发送列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCampaignSendList({
        ...this.filterForm,
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

<template>
  <section class="page-account-download mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line" label-width="60px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="下载时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="filterForm.startTime"
            @changeStartValue="value => filterForm.startTime = value"
            :end-time-value="filterForm.endTime"
            end-time-prop="endTime"
            @changeEndValue="value => filterForm.endTime = value"
            type="datetime"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="处理状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择处理状态" clearable>
            <el-option label="全部" :value="null"></el-option>
            <el-option :key="item.value" v-for="item in downloadStatus" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mode-store-table">
      <!-- table列表 -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        v-table-height
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
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="downloadFile(scope.row)">下载</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="160"
          :show-overflow-tooltip="true"
          label="导出任务">
        </el-table-column>
        <el-table-column
          prop="operator"
          min-width="160"
          :show-overflow-tooltip="true"
          label="操作员">
        </el-table-column>
        <el-table-column
          prop="total"
          min-width="160"
          :show-overflow-tooltip="true"
          label="条数">
          <template slot-scope="scope">
            <span>{{scope.row.total}} 条</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="160"
          :show-overflow-tooltip="true"
          label="处理状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, downloadStatus))">{{filterStatus(scope.row.status, downloadStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastDownload"
          min-width="160"
          :show-overflow-tooltip="true"
          label="上次下载时间">
          <template slot-scope="scope">
            <span>{{scope.row.lastDownload}}</span>
          </template>
        </el-table-column>
      </el-table>
      <el-col :span="24" class="toolbar" style="padding: 0">
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-col>
    </el-card>
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterColor, filterStatus, fileDownload } from '@/utils'
import { downloadStatus } from '@/utils/dict'
import { exportDownloadList, downloadExport } from '@/service/setting'
import gtTimeRange from '@/components/gt-time-range'
export default {
  name: 'page-account-download',
  data () {
    return {
      filterForm: {
        startTime: null,
        endTime: null,
        status: null
      },
      downloadStatus,
      filterStatus,
      filterColor,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0
    }
  },
  components: {
    gtTimeRange,
    gtPagination
  },

  async created() {
    // 获取商品列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await exportDownloadList({
        ...this.filterForm,
        page: this.currentPage,
        size: this.pageSize
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.msg)
        this.dataList = []
        this.total = 0
      }
      this.dataListLoading = false
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

    // 下载文件
    async downloadFile(item) {
      const { data } = await downloadExport(item)
      fileDownload(data, `${item.name}.xls`)

      // const aEtg = document.createElement('a')
      // aEtg.href = item.url
      // aEtg.download = item.name
      // aEtg.click()
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  .page-goods-brand{

  }
</style>


<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="100px" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="盈亏调整单号" prop="orderNo" >
          <el-input v-model="filterForm.orderNo" placeholder="请输入盈亏调整单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="调整日期">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="filterForm.startTime"
            :end-time-value="filterForm.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => filterForm.startTime = value"
            @changeEndValue="value => filterForm.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="调整人" prop="adjustEmployeeName" >
          <el-input v-model="filterForm.adjustEmployeeName" placeholder="请输入调整人" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:adjustStock:list')">
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
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作"
          v-if="isAuth('company:adjustStock:detail')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="orderNo"
          min-width="180"
          :show-overflow-tooltip="true"
          label="盈亏调整单号">
        </el-table-column>
        <el-table-column
          prop="adjustTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="调整日期">
        </el-table-column>
        <!-- <el-table-column
          prop="batchNo"
          min-width="180"
          :show-overflow-tooltip="true"
          label="批次号">
        </el-table-column> -->
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-view v-if="viewVisible" ref="justifyView"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { getJustifyList } from '@/service/stock'
import * as api from '@/service/stock'
import gtView from './component/justifyView'
import gtTimeRange from '@/components/gt-time-range'
export default {
  name: 'stockManagement-justifyList',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      viewVisible: false,
      filterStatus,
      filterColor,
      filterForm:{
        orderNo: null,
        startTime: null,
        endTime: null,
        adjustEmployeeName: null,//调整人
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtView
  },

  async created() {
    // 获取盘点列表
    if(this.isAuth('company:adjustStock:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getJustifyList({
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

    // 导出调整清单
    async exportExcel() {
      const { data, headers } = await api.exportJustifyExcel({
        ...this.filterForm,
        size: 10000,
        page: 0
      })
      fileDownload(data, '调整清单.xls')
    },

    // 查看
    storeViewHandle (id){
      this.viewVisible = true
      this.$nextTick(() => {
        this.$refs.justifyView.init(id)
      })
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

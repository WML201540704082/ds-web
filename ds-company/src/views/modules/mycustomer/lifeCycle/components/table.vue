<template>
  <section class="lifeCyc-page-table">
    <!-- 查询条件 -->
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="120px" :model="filterForm" @keyup.enter.native="resetForm('search')">
      <el-form-item label="任务名称" prop="name">
        <el-input v-model="filterForm.name" placeholder="请输入任务名称" clearable></el-input>
      </el-form-item>
      <el-form-item label="时间">
        <gt-time-range
          start-time-prop="beginTime"
          :start-time-value="filterForm.beginTime"
          :end-time-value="filterForm.endTime"
          end-time-prop="endTime"
          @changeStartValue="value => filterForm.beginTime = value"
          @changeEndValue="value => filterForm.endTime = value"
        ></gt-time-range>
      </el-form-item>
      <el-form-item class="search-toolbar">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>
    <el-table
      :data="taskList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      ref="taskList"
      @row-dblclick="expandRow"
      @expand-change="expandChange"
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
        prop="createdTime"
        min-width="180"
        :show-overflow-tooltip="true"
        label="推送时间">
      </el-table-column>
      <el-table-column
        prop="name"
        min-width="150"
        :show-overflow-tooltip="true"
        label="任务名称">
      </el-table-column>
      <el-table-column
        prop="customerNum"
        min-width="150"
        :show-overflow-tooltip="true"
        label="顾客数量">
      </el-table-column>
      <el-table-column
        prop="compeletePercent"
        min-width="60"
        :show-overflow-tooltip="true"
        label="任务完成率">
        <template slot-scope="scope">
          <span>{{scope.row.compeletePercent}}%</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="60" type="expand">
        <template slot-scope="props">
          <div class="unflod-container">
            <div class="arrow-container"><div class="arrow"></div></div>
            <div class="table-container">
              <el-table
                :data="props.row.staffList || []"
                border
                :stripe="true"
                style="width: 100%;">
                <el-table-column
                  prop="employeeName"
                  min-width="150"
                  :show-overflow-tooltip="true"
                  label="员工">
                </el-table-column>
                <el-table-column
                  prop="storeName"
                  min-width="150"
                  :show-overflow-tooltip="true"
                  label="所属门店">
                </el-table-column>
                <el-table-column
                  min-width="150"
                  :show-overflow-tooltip="true"
                  label="顾客总数">
                  <template slot-scope="scope">
                    <span>{{scope.row.finshedNum + scope.row.returnNum}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="finshedNum"
                  min-width="150"
                  :show-overflow-tooltip="true"
                  label="已回访">
                </el-table-column>
                <el-table-column
                  prop="finishPercent"
                  min-width="150"
                  :show-overflow-tooltip="true"
                  label="任务完成率">
                  <template slot-scope="scope">
                    <span class="theme-color" style="text-decoration: underline; cursor: pointer;" @click="goCustomer(props.row.id, scope.row)">{{scope.row.finishPercent}}%</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    <customer-list ref="customerList" />
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterStatus, fileDownload } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import { getTaskList, getStaffTaskList } from '@/service/mycustomer'
import customerList from './customerList'
export default {
  data () {
    return {
      taskList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        name: '',
        beginTime: null,
        endTime: null
      }
    }
  },
  components: {
    gtPagination,
    gtTimeRange,
    customerList
  },

  async created() {
    // 获取商品列表
    this.getTasks()
  },
  methods: {
    // 获取数据列表
    async getTasks() {
      this.dataListLoading = true
      const { data } = await getTaskList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.taskList = data.data.records.map(item => {
          return {
            ...item,
            staffList: []
          }
        })
        this.total = data.data.total
      } else {
        this.taskList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    // 获取数据列表
    async getTaskStaffs(taskId) {
      let index = -1
      this.taskList.forEach((item, pos) => {
        if (item.id === taskId) {
          index = pos
        }
      })
      const { data } = await getStaffTaskList(taskId)
      if (data.code === 0 && index >= 0) {
        this.taskList[index].staffList = data.data || []
      } else {
        this.$message.error(data.msg)
      }
    },

    // 展开行
    expandChange(row, expandedRows) {
      // 展开
      if (expandedRows) {
        this.getTaskStaffs(row.id)
      }
    },

    expandRow(row,column, event) {
      this.$refs['taskList'].toggleRowExpansion(row)
    },

    // 跳转到顾客列表
    goCustomer(taskId, employee) {
      this.$nextTick(() => {
        this.$refs['customerList'].init(taskId, employee)
      })
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getTasks()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getTasks()
    }
  }
}
</script>
<style lang="scss">
.lifeCyc-page-table{
  .unflod-container{
    display: flex;
    padding: 15px 0;
    .arrow-container{
      width: 70px;
      .arrow{
        width: 30px;
        height: 30px;
        margin-left: 20px;
        margin-top: 15px;
        border-left: 2px solid #dcdcdc;
        border-bottom: 2px solid #dcdcdc;
        border-radius: 2px;
      }
    }
    .table-container{
      flex: 1;
    }
  }
}
</style>


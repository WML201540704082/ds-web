<template>
   <el-dialog
    title="任务完成率"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
    append-to-body>
    <el-row style="margin-bottom: 15px;">
      <el-col :span="12">
        员工： {{`${employee.employeeName || '--'}\\${employee.employeePhone}`}}
      </el-col>
      <el-col :span="12">
        完成率：{{employee.finishPercent}} %
      </el-col>
    </el-row>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height="300"
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
        min-width="240"
        :show-overflow-tooltip="true"
        label="顾客">
        <template slot-scope="scope">
          <span>{{scope.row.customerName}}/{{scope.row.customerPhone}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="taskStatus"
        min-width="150"
        :show-overflow-tooltip="true"
        label="回访状态">
        <template slot-scope="scope">
          <span :class="filterColor(filterStatus(scope.row.taskStatus, statusDic))">{{filterStatus(scope.row.taskStatus, statusDic)}}</span>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>
<script>
import { getCustomerTaskList } from '@/service/mycustomer'
import { filterStatus, filterColor } from '@/utils'
export default {
  data(){
    return{
      dataListLoading: false,
      dataList: [],
      filterStatus,
      filterColor,
      statusDic: [{
        label: '已完成',
        value: 'FINISHED'
      }, {
        label: '未完成',
        value: 'UNFINISHED'
      }],
      employee: {
        employeeName: '',
        employeePhone: '',
        finishPercent: '',
        customers: []
      },
      visible: false,
    }
  },
  methods:{
    init(taskId, employee){
      this.visible = true
      this.employee = employee,
      this.getDataList(taskId)
    },

    async getDataList(taskId){
      const {data} = await getCustomerTaskList({
        taskId: taskId,
        employeeId: this.employee.employeeId
      })
      if(data.code == 0){
        this.dataList = data.data
      }else{
        this.dataList = []
        this.$message.error(data.msg)
      }
    }
  }
}
</script>

<template>
   <el-dialog
    title="寄存详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
     <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        max-height="300"
        style="width: 100%;min-height: 300px;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="200"
          :show-overflow-tooltip="true"
          label="提货时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="提货门店">
        </el-table-column>
        <el-table-column
          prop="extractQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="提货数量">
        </el-table-column>
        <el-table-column
          prop="balanceQuantity"
          min-width="150"
          :show-overflow-tooltip="true"
          label="剩余数量">
        </el-table-column>
      </el-table>
  </el-dialog>
</template>
<script>
import { depositDetail } from '@/service/mycustomer'
export default {
  data(){
    return{
      dataListLoading: false,
      dataList: [],
      visible: false,
    }
  },
  created(){
  },
  methods:{
    init(id){
      this.visible = true
      this.getDataList(id)
    },

    async getDataList(id){
      const {data} = await depositDetail(id)
      if(data.code == 0){
        this.dataList = data.data
      }else{
        this.dataList = []
        this.$message.error(data.msg)
      }

    },
  }
}
</script>



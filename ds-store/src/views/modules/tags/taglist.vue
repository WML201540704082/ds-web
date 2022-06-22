<template>
  <div class="mod-store customers">
    <!-- table列表 -->
    <el-card class="mode-store-table">
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
          prop="createTime"
          min-width="220"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="tag"
          min-width="220"
          :show-overflow-tooltip="true"
          label="标签">
        </el-table-column>
        <el-table-column
          prop="source"
          min-width="250"
          :show-overflow-tooltip="true"
          label="标签来源">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.source, sourceStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="240"
          :show-overflow-tooltip="true"
          label="类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, typeStatus)}}</span>
          </template>
        </el-table-column>

      </el-table>

    </el-card>
  </div>
</template>
<script>
import {getTagsList} from '@/service/tags'
import { sourceStatus, typeStatus } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  data(){
    return{
      dataList: [],
      dataListLoading: false,
      sourceStatus,
      typeStatus,
      filterStatus
    }
  },
  created(){
    if(this.isAuth('store:inStock:list')){
      this.getDataList()
    }
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getTagsList()
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data
      } else {
        this.dataList = []
        this.$message.warning(data.msg)
      }

    },
  }
}
</script>

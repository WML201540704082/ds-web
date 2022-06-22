<template>
  <el-dialog
    title="错误列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
    <!-- 错误列表列表 -->
    <div class="mode-store-table">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        max-height="360"
        style="width: 100%; min-height: 300px;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rowIndex"
          width="80"
          label="错误行号">
        </el-table-column>
        <el-table-column
          prop="msg"
          align="center"
          :show-overflow-tooltip="true"
          label="错误消息">
        </el-table-column>
        <el-table-column
          prop="oriValue"
          width="120"
          :show-overflow-tooltip="true"
          label="原值">
        </el-table-column>
      </el-table>
      <!-- <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/> -->
    </div>
  </el-dialog>
</template>

<script>
import { taskErrorList } from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
export default {
  data () {
    return {
      id: '',
      dataList: [],
      visible: false,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
    }
  },
  components: {
    gtPagination
  },
  methods: {
    init(id){
      this.visible = true
      this.id = id
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await taskErrorList({id: this.id})
      if (data.code === 0) {
        this.dataList = data.data
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>

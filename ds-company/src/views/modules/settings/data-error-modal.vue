<template>
  <el-dialog
    title="错误列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="80%"
    append-to-body>
    <div v-if="!this.id">以下盘点商品信息未导入，请修改后重新导入。</div>
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
          prop="oriValue"
          width="150"
          :show-overflow-tooltip="true"
          :label="this.id ? '原值' : '商品条码'">
        </el-table-column>
        <el-table-column
          prop="msg"
          align="center"
          :show-overflow-tooltip="true"
          label="错误消息">
        </el-table-column>
      </el-table>
    </div>
  </el-dialog>
</template>

<script>
import { taskErrorList } from '@/service/setting'
export default {
  data () {
    return {
      id: '',
      dataList: [],
      visible: false,
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
    }
  },
  methods: {
    init(id, dataList){
      this.visible = true
      if (id) {
        this.id = id
        this.getDataList()
      } else {
        this.dataList = dataList.map(item => {
          return {
            rowIndex: item.row,
            msg: item.errorMsg,
            oriValue: item.barcode
          }
        })
      }

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
  }
}
</script>

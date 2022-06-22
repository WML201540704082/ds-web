<template>
  <el-dialog
    title="一键清空列表"
    :close-on-click-modal="false"
    :visible.sync="visible"
    v-if="visible"
    class="company-distribute-modal"
    width="80%"
    append-to-body>
    <el-table
      :data="dataList"
      border
      :stripe="true"
      v-loading="dataListLoading"
      v-table-height>
      <el-table-column
        prop="index"
        width="55"
        label="序号">
        <template slot-scope="scope">
          <span>{{scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="companyNo"
        min-width="120"
        :show-overflow-tooltip="true"
        label="企业编号">
        <!-- <template slot-scope="scope">
          <span>{{scope.row.companyNo}}</span>
        </template> -->
      </el-table-column>
      <el-table-column
        prop="companyName"
        align="center"
        min-width="150"
        :show-overflow-tooltip="true"
        label="企业名称">
      </el-table-column>
        <el-table-column
        prop="type"
        min-width="100"
        label="操作类型">
        <template slot-scope="scope">
          <span>{{scope.row.type === 'PRODUCT' ? '清空商品数据' : '清空商品数据'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        :show-overflow-tooltip="true"
        min-width="180"
        label="操作时间">
      </el-table-column>
      <el-table-column
        prop="operator"
        min-width="180"
        label="操作者">
        <template slot-scope="scope">
          <span>{{scope.row.operator || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        min-width="150"
        :show-overflow-tooltip="true"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="attachment"
        min-width="150"
        :show-overflow-tooltip="true"
        label="附件">
        <template slot-scope="scope">
          <span style="cursor: pointer; color: #F48442 !important;" @click="viewPic(scope.row.attachment)">查看</span>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">确定</el-button>
    </span>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </el-dialog>
</template>

<script>
import { clearCompanyList } from '@/service/company'
import gtPagination from '@/components/gt-pagination'
export default {
  name: 'clearListModal',
  data () {
    return {
      visible: false,
      dataList: false,
      showImgPic: null,
      total: 0,
      pageSize: 20,
      currentPage: 0,
    }
  },
  components: {
    gtPagination
  },
  methods: {
    async init () {
      this.visible = true
      this.getClearList()
    },

    viewPic(url) {
      this.showImgPic = 'https://' + url
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },

    async getClearList() {
      this.dataListLoading = true
      const { data } = await clearCompanyList({
        size: this.pageSize,
        page: this.currentPage,
      })
      if (data.data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    // 修改分页
    pagination_event (val){
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getClearList()
    },
  }
}
</script>
<style lang="scss">
.clear-list-modal{

}
</style>

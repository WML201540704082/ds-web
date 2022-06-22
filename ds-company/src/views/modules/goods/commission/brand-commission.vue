<template>
  <section class="page-goods-spec">
    <gt-border-button type="create" @click.native="() => addOrUpdateHandle('add')" style="float: left;"/>
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
        width="100"
        label="操作">
        <template slot-scope="scope">
          <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
          <span >|</span>
          <el-button class="nopadding" type="text" size="small" @click="deleteRow(scope.row)">删除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstCategory"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品大类">
        <template slot-scope="scope">
          <span>{{scope.row.firstCategory ? scope.row.firstCategory.name : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="brandNames"
        :show-overflow-tooltip="true"
        min-width="200"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="categoryNames"
        min-width="200"
        :show-overflow-tooltip="true"
        label="商品小类">
      </el-table-column>
      <el-table-column
        prop="commission"
        min-width="120"
        label="商品提成">
        <template slot-scope="scope">
          <span>{{scope.row.commission ? `${priceNum(scope.row.commission)}${scope.row.commissionType === 'FIXED_AMOUNT' ? '元' : '%'}` : `0${scope.row.commissionType === 'FIXED_AMOUNT' ? '元' : '%'}`}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="createTime"
        min-width="180"
        label="创建时间">
      </el-table-column>
    </el-table>
    <el-col :span="24" class="toolbar" style="padding: 0">
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-col>
    <brand-commission-modal ref="brandCommissionModal" @refresh="getDataList" ></brand-commission-modal>
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import brandCommissionModal from './brand-commission-modal'
import { brandPercentList,deletebrandCommission } from '@/service/goods'
export default {
  name: 'brand-commission',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0
    }
  },
  components: {
    gtPagination,
    brandCommissionModal
  },

  async created() {
    // 获取商品列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await brandPercentList({
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
    // 修改
    addOrUpdateHandle (data) {
      this.$nextTick(() => {
        this.$refs.brandCommissionModal.init(data)
      })
    },
    deleteRow (row) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除提成规则',
        confirm: async () => {
          const {data} = await deletebrandCommission(row.id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">

</style>

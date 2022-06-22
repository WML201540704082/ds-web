<template>
  <div class="mod-store">
    <el-card>
      <gt-sub-title title="待审核结算">
        <el-tooltip placement="top" effect="dark" content="待运营平台审核的结算提现申请单">
          <img class="answer" src="static/img/desk/answer.png" />
        </el-tooltip>
      </gt-sub-title>
      <div class="info">{{total}} 笔</div>
    </el-card>
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
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="approve(scope.row.id)">已打款</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="refuse(scope.row.id)">拒绝</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="time"
          width="150"
          :show-overflow-tooltip="true"
          label="申请时间">
        </el-table-column>
        <el-table-column
          prop="money"
          :show-overflow-tooltip="true"
          label="申请金额">
          <template slot-scope="scope">
            {{number(scope.row.money)}}
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          :show-overflow-tooltip="true"
          label="提现企业">
        </el-table-column>
        <el-table-column
          prop="canuseMoneny"
          :show-overflow-tooltip="true"
          label="提现账户">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { settlementStatus, settlementOrigin } from '@/utils/dict'
import gtSubTitle from '@/components/gt-sub-title'
import { filterStatus, filterColor } from '@/utils'
import { number } from '@/utils/validate'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      filterForm:{
        companyName: null,
        payOrigin: null,
        settlementStartDate: null,
        settlementEndDate: null,
      },
      settlementOrigin,
      settlementStatus,
      filterStatus,
      number,
      filterColor
    }
  },
  components: {
    gtPagination,
    gtSubTitle
  },

  async created() {
    // 获取结算列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          ...this.form
        })
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
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    refuse(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定拒绝该笔结算？',
        confirm: async () => {
          const { data } = await this.$http({
            url: this.$http.adornUrl('/settlement/mop/settlement/refuse'),
            method: 'post',
            data: this.$http.adornData(id)
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('已拒绝该笔结算')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    approve(id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定打款？',
        confirm: async () => {
          const { data } = await await this.$http({
            url: this.$http.adornUrl('/settlement/mop/settlement/approve'),
            method: 'post',
            data: this.$http.adornData(id)
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('已同意打款申请')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  @import '~@/assets/scss/_variables.scss';
  .answer{
    width: 18px;
    float: right;
    margin-left: 5px;
  }
  .info{
    font-size: 20px;
    color: $status--common-color;
    margin-left: 20px;
  }
</style>


<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="procurement" :model="procurement" @keyup.enter.native="resetForm('search')">
        <el-form-item label="结算时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="beginCreateTime"
            :start-time-value="procurement.beginCreateTime"
            @changeStartValue="value => procurement.beginCreateTime = value"
            :end-time-value="procurement.endCreateTime"
            end-time-prop="endCreateTime"
            @changeEndValue="value => procurement.endCreateTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => procurementExport()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
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
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="procurementView(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算时间">
        </el-table-column>
        <el-table-column
          prop="settleSum"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算金额(元)">
          <template slot-scope="scope">
            <span>{{priceNum(scope.row.settleSum)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="120"
          :show-overflow-tooltip="true"
          label="结算结果">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,setStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          :show-overflow-tooltip="true"
          min-width="140"
          label="操作人">
          <template slot-scope="scope">
            <span>{{`${scope.row.operator || '--'}/${scope.row.operatorPhone || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="remark"
          :show-overflow-tooltip="true"
          min-width="140"
          label="备注">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-instockSetRecord v-if="instockSetRecordVisible" ref="instockSettlementRecord" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { getSettleBillList, procurementExport } from '@/service/setting'
import { fileDownload,filterStatus } from '@/utils'
import { setStatus } from '@/utils/dict'
import gtInstockSetRecord from './component/settlementRecord'
export default {
  name: 'settlement-procurement',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      instockSetRecordVisible:false,
      filterStatus,
      setStatus,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      procurement:{
        beginCreateTime: null,
        endCreateTime: null,
      }
    }
  },
  components: {
    gtPagination, gtTimeRange,gtInstockSetRecord
  },

  async created() {
    // 获取结算列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getSettleBillList({
        ...this.procurement,
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
    // 导出结算中心列表
    async procurementExport() {
      const { data, headers } = await procurementExport({
        ...this.procurement,
        size: 10000,
        page: 0
      })
      fileDownload(data, '采购结算.xls')
    },
    // 查看--入库结算单记录
    procurementView (id){
      this.instockSetRecordVisible = true
      this.$nextTick(() => {
        this.$refs.instockSettlementRecord.init(id)
      })
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['procurement'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>


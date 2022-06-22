<template>
  <div class="mod-store">
    <!-- 查询条件 -->
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="90px" :model="filterForm" @keyup.enter.native="resetForm('search')">
      <el-form-item label="发送状态" prop="status">
        <el-select v-model="filterForm.status" placeholder="请选择发送状态" clearable>
          <el-option label="全部" value="" ></el-option>
          <el-option
            v-for="item in shortMessageStatus"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="发送时间">
        <gt-time-range
          start-time-prop="sendDateBegin"
          :start-time-value="filterForm.sendDateBegin"
          @changeStartValue="value => filterForm.sendDateBegin = value"
          :end-time-value="filterForm.sendDateEnd"
          end-time-prop="sendDateEnd"
          @changeEndValue="value => filterForm.sendDateEnd = value"
          type="date"
        ></gt-time-range>
      </el-form-item>
      <el-form-item class="search-toolbar" v-if="isAuth('company:product:list')">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>

    <!-- table列表 -->
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
          <el-button v-if="scope.row.status === 'REJECT'" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">重新审核</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="createDate"
        min-width="180"
        :show-overflow-tooltip="true"
        label="创建时间">
        <template slot-scope="scope">
          <span>{{moment(scope.row.createDate ||  '').format('YYYY-MM-DD HH:mm:ss')}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="sendDate"
        min-width="180"
        :show-overflow-tooltip="true"
        label="发送时间">
        <template slot-scope="scope">
          <span>{{scope.row.sendDate ? moment(scope.row.sendDate).format('YYYY-MM-DD HH:mm:ss') : '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="title"
        align="center"
        width="120"
        :show-overflow-tooltip="true"
        label="短信标题">
      </el-table-column>
      <el-table-column
        prop="couponName"
        align="center"
        width="120"
        :show-overflow-tooltip="true"
        label="优惠券">
      </el-table-column>
      <el-table-column
        prop="customerNum"
        width="120"
        :show-overflow-tooltip="true"
        label="顾客数量">
      </el-table-column>
      <el-table-column
        prop="sendNum"
        align="center"
        width="120"
        :show-overflow-tooltip="true"
        label="短信数量">
      </el-table-column>
      <el-table-column
        prop="createUser"
        min-width="150"
        :show-overflow-tooltip="true"
        label="操作员工">
      </el-table-column>
      <el-table-column
        prop="status"
        :show-overflow-tooltip="true"
        min-width="100"
        label="发送状态">
        <template slot-scope="scope">
          <span :class="filterColor(filterStatus(scope.row.status, shortMessageStatus))">{{filterStatus(scope.row.status, shortMessageStatus)}}</span>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { shortMessageStatus, shortmessageScenes } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
import { filterStatus, filterColor } from '@/utils'
import { getSendList } from '@/service/campaign'
export default {
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      shortmessageScenes,
      shortMessageStatus,
      moment,
      filterStatus,
      filterColor,
      filterForm:{
        status: '',
        sendDateBegin: null,
        sendDateEnd: null
      },
    }
  },
  components: {
    gtPagination,
    gtTimeRange
  },

  async created() {
    // 获取商品列表
    if(this.isAuth('company:product:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取发送列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getSendList({
        ...this.filterForm,
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

    // 新增 / 修改
    storeViewHandle (id) {
      // this.$router.push({name:'goods-add-or-update', query: {id}})
      this.$emit('editMessage', id)
    },

    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

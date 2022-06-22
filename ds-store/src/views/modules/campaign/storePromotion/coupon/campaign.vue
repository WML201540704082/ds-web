<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-select v-model="filterForm.type" placeholder="请选择优惠券类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in couponType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用渠道" prop="channel">
          <el-select v-model="filterForm.channel" placeholder="请选择适用渠道" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效日期">
          <gt-time-range
            start-time-prop="effectiveBeginDate"
            :start-time-value="filterForm.effectiveBeginDate"
            start-time-placeholder="请选择有效时间(起)"
            @changeStartValue="value => filterForm.effectiveBeginDate = value"
            :end-time-value="filterForm.effectiveEndDate"
            end-time-placeholder="请选择有效时间(止)"
            end-time-prop="effectiveEndDate"
            @changeEndValue="value => filterForm.effectiveEndDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('store:coupon:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
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
          width="80"
          label="操作"
           v-if="isAuth('store:coupon:detail')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="120"
          :show-overflow-tooltip="true"
          label="优惠券名称">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="优惠券类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, couponType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="优惠价值">
          <template slot-scope="scope">
            <span>{{getRule(scope.row.type, scope.row.typeRule)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="有效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.expiryDateType === 'DATETIME'">{{scope.row.effectiveDate}}</span>
            <span v-else>自发放之日起 {{scope.row.effectiveDay}} 天</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="channel"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用渠道">
          <template slot-scope="scope">
            <span>{{scope.row.channel == 0 ? '线上+线下':scope.row.channel == 2 ? '线下' : '线上'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="grantNum"
          :show-overflow-tooltip="true"
          min-width="100"
          label="发放数量">
        </el-table-column>
        <!-- <el-table-column
          prop="getNum"
          :show-overflow-tooltip="true"
          min-width="100"
          label="领取数量">
        </el-table-column> -->
        <el-table-column
          prop="useNum"
          width="100"
          :show-overflow-tooltip="true"
          label="使用数量">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { couponType,channelList } from '@/utils/dict'
import * as api from '@/service/campaign'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, fileDownload } from '@/utils'
export default {
  name:'campaign-storePromotion-coupon-campaign',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        name: null,
        type: '',
        effectiveBeginDate: null,
        effectiveEndDate: null,
        channel:'',//适用渠道（查询）
      },
      filterStatus,
      channelList,
      couponType
    }
  },
  components: {
    gtPagination, gtTimeRange
  },

  async created() {
    // 获取优惠券列表
    if(this.isAuth('store:coupon:list')){
      this.getDataList()
    }
  },
  inject: ['exportList'],
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getCouponList({
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
    // 导出优惠券列表
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        type: this.filterForm.type || null,
      }
      this.exportList(this.total, '优惠券列表', 'STORE_COUPON', criteria, async () => {
        const { data, headers } = await api.exportCouponExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '优惠券列表.xls')
      })
    },
    getRule(type, typeRule) {
      if (type !== null && type !== '' && type !== undefined && typeRule) {
        let ruleName = ''
        switch (type) {
        case 0:
          ruleName = typeRule + '折'
          break
        case 2:
          ruleName = '--'
          break
        case 1:
          const arr = typeRule.split(',')
          if (arr && arr.length === 2) {
            ruleName = `满${arr[0]}减${arr[1]}`
          } else if (arr.length === 1) {
            ruleName = `减${arr[0]}`
          } else {
            ruleName = '--'
          }
          break
        default:
          ruleName = '--'
        }
        return ruleName
      } else {
        return '--'
      }
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'campaign-view', query: {id}})
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

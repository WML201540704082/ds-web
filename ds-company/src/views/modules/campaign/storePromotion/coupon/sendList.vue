<template>
  <div class="mod-store customers page-customer-list">
    <gt-subtitle title="优惠券信息" style="display: block;"/>
    <el-card>
      <el-form class="form-show" label-width="110px">
        <el-form-item label="优惠券名称">
          <span class="itemInput">{{name}}</span>
        </el-form-item>
        <el-form-item label="优惠券类型">
          <span class="itemInput">{{filterStatus(type, couponType)}}</span>
        </el-form-item>
        <el-form-item label="优惠价值">
          <span class="itemInput">{{getRule(type, typeRule)}}</span>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <gt-subtitle title="发放信息" style="display: block;"/>
    <el-card class="mode-store-table">
      <el-form :model="sendRecords" label-width="110px" :inline="true" ref='sendRecords' class="mode-form-line1"  @keyup.enter.native="resetForm('seach')">
        <el-form-item label="顾客姓名/手机号" prop='customerInfo'>
          <el-input v-model="sendRecords.customerInfo" placeholder="请输入顾客姓名/手机号" clearable></el-input>
        </el-form-item> 
        <el-form-item label="发放时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="sendRecords.startTime"
            @changeStartValue="value => sendRecords.startTime = value"
            :end-time-value="sendRecords.endTime"
            end-time-prop="endTime"
            @changeEndValue="value => sendRecords.endTime = value"
            type="date"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" >
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
      <el-table
        v-table-height
        :data="dataList"
        border
        v-loading="dataListLoading"
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
          prop="name"
          :show-overflow-tooltip="true"
          min-width="120"
          label="顾客姓名">
        </el-table-column>
        <el-table-column
          prop="gender"
          :show-overflow-tooltip="true"
          min-width="60"
          label="性别">
          <template slot-scope="scope">
            <span>{{scope.row.gender === 'FEMALE' ? '女' : '男'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="levelName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="会员等级">
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="发放时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtSubtitle from '@/components/gt-sub-title'
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus } from '@/utils'
import { couponType } from '@/utils/dict'
import { couponSendRecords } from '@/service/campaign'
export default {
  name:'coupon-sendList',
  data () {
    return {
      isFlag: false,
      dataList: [],
      dataListLoading: false,
      filterStatus,
      couponType,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      sendRecords:{
        customerInfo: null,
        startTime: null,
        endTime: null
      },
    }
  },
  components: {
    gtPagination,gtSubtitle,gtTimeRange
  },
  created () {
    this.couponId = this.$route.query.id
    this.name = this.$route.query.name
    this.type = this.$route.query.type
    this.typeRule = this.$route.query.typeRule
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await couponSendRecords({
        size: this.pageSize,
        page: this.currentPage,
        couponId:this.couponId,
        ...this.sendRecords,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }

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
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },


    // 重置
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['sendRecords'].resetFields()
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.page-customer-list{
  .more-icon{
    position: relative;
    top: -2px;
    width: 60px;
    left: calc(50% - 30px);
    cursor: pointer;
  }
}
</style>



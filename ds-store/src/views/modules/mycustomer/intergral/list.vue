<template>
  <div class="mod-store customers page-customer-list">
    <span class="Intergralinfo">当前积分：{{intergralVal}}</span>
    <!-- 查询条件 -->
    <el-form :model="intergral" :inline="true" ref='intergral' label-width="80" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
      <el-form-item label="时间">
        <gt-time-range
          start-time-prop="startDate"
          :start-time-value="intergral.startDate"
          :end-time-value="intergral.endDate"
          end-time-prop="endDate"
          @changeStartValue="value => intergral.startDate = value"
          @changeEndValue="value => intergral.endDate = value"
        ></gt-time-range>
      </el-form-item>
      <el-form-item label="操作状态" prop='type'>
        <el-select v-model="intergral.type" placeholder="请选择" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in intergralczType"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item style="display: inline-block;">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>
    <!-- table列表 -->
    <el-table
      v-table-height
      :data="IntergralList"
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
        prop="createTime"
        min-width="100"
        :show-overflow-tooltip="true"
        label="时间">
      </el-table-column>
      <el-table-column
        prop="sourceId"
        min-width="100"
        :show-overflow-tooltip="true"
        label="订单编号">
        <template slot-scope="scope">
          <span>{{scope.row.sourceId || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        :show-overflow-tooltip="true"
        min-width="60"
        label="操作类型">
        <template slot-scope="scope">
          <span>{{filterStatus(scope.row.type, intergralczType)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="val"
        min-width="120"
        :show-overflow-tooltip="true"
        label="变动积分">
        <template slot-scope="scope">
          <span>{{scope.row.val>0?('+'+scope.row.val):(scope.row.val==0?0:scope.row.val)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="now"
        min-width="100"
        :show-overflow-tooltip="true"
        label="变动后积分">
      </el-table-column>
      <el-table-column
        prop="operator"
        min-width="100"
        :show-overflow-tooltip="true"
        label="操作用户">
        <template slot-scope="scope">
          <span>{{scope.row.operator || '-'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        min-width="100"
        :show-overflow-tooltip="true"
        label="备注">
        <template slot-scope="scope">
          <span>{{scope.row.remark || '-'}}</span>
        </template>
      </el-table-column>
    </el-table>
    <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  </div>
</template>

<script>
import gtTimeRange from '@/components/gt-time-range'
import gtPagination from '@/components/gt-pagination'
import { intergralczType } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import { integralRecords,integralSearch } from '@/service/mycustomer'
import moment from 'moment'
export default {
  name:'mycustomer-intergral',
  data () {
    return {
      intergralVisible: false,
      filterStatus,
      filterColor,
      moment,
      IntergralList: [],
      dataListSelections:[],
      dataListLoading: false,
      intergralczType,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      intergral:{
        type: null,
        startDate: null,
        endDate: null
      },
      id: null,
      name: null,
      phone: null,
      intergralVal: null,
    }
  },
  components: {
    gtPagination,
    gtTimeRange
  },
  created () {
    const {id,name,phone,intergralVal} = this.$route.query
    this.id = id
    this.name = name
    this.phone = phone
    this.intergralVal = intergralVal
    this.allList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await integralRecords({
        size: this.pageSize,
        page: this.currentPage,
        ...this.intergral,
        customerId: this.id
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.IntergralList = data.data.records
        this.total = data.data.total
      } else {
        this.IntergralList = []
        this.total = 0
        this.$message.warning(data.msg)
      }

    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.allList()
    },
    
    allList(){
      this.update()
      this.getDataList()
    },
    // 更新积分
    async update(){
      const {data} = await integralSearch(this.id)
      if(data.code == 0){
        this.intergralVal = data.data.integral
        this.name = data.data.name
        this.phone = data.data.phone
        console.log('update')
      }else{
        this.$message.error(data.msg)
      }
    },
    resetForm(type) {
      if (type==='reset') {
        this.$refs['intergral'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.allList()
    },
  }
}
</script>
<style lang="scss">
.Intergralinfo {
  float: right;
  font-size: 16px;
}
</style>



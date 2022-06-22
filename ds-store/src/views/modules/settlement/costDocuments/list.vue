<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="单据编号" prop="billCode" class="gt-inline-item">
          <el-input v-model="filterForm.billCode" placeholder="请输入单据编号"></el-input>
        </el-form-item>
        <el-form-item label="费用类型" prop="type">
          <el-select v-model="filterForm.type" placeholder="请选择" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in costType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop="status">
          <el-select v-model="filterForm.status" placeholder="请选择" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in costStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="新增" @click.native="addCost()"/>
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
          min-width="150"
          label="操作"
          >
          <template slot-scope="scope" >
            <span v-if="scope.row.status==='PENDING'">
              <el-button class="nopadding" type="text" size="small" @click="audioStatus(scope.row.id)" v-if="scope.row.customerStoreId===storeid">审核</el-button>
              <span v-else>
                <el-button class="nopadding" type="text" size="small" @click="addCost(scope.row.id)">编辑</el-button>
                <span>|</span>
                <el-button class="nopadding" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
              </span>
            </span>
            <span v-else>--</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="billCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="单据编号">
          <template slot-scope="scope">
            <span style="text-decoration: underline;color: blue;cursor: pointer;" @click="detailView(scope.row.id)">{{scope.row.billCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="amount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="金额">
          <template slot-scope="scope"><span>{{scope.row.amount ? priceNum(scope.row.amount) : 0}}</span></template>
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="费用类型">
          <template slot-scope="scope"><span>{{filterStatus(scope.row.type, costType) || '--'}}</span></template>
        </el-table-column>
        <el-table-column
          prop="proposerName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="申请人">
        </el-table-column>
        <el-table-column
          prop="occurTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="发生时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.occurTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="创建时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createTime).format('YYYY-MM-DD')}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="90"
          :show-overflow-tooltip="true"
          label="审核状态">
          <template slot-scope="scope"><span>{{filterStatus(scope.row.status, costStatus) || '--'}}</span></template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-status-model v-if="statusVisible" ref="statusRef" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { costType, costStatus } from '@/utils/dict'
import { getCostlist,getCostDelete } from '@/service/setting'
import { getStore } from '@/utils/storage'
import gtStatusModel from '../status-model'
import { filterStatus, filterColor } from '@/utils'
import moment from 'moment'
export default {
  name: 'settlement-costDocuments-list',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      statusVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterStatus,
      filterColor,
      costType,
      costStatus,
      moment,
      filterForm:{
        billCode: null,
        status: '',
        type: ''
      },
      storeid: null
    }
  },
  components: {
    gtPagination,
    gtStatusModel
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'settlement-cost-detail'){
        vm.reload()
      }
    })
  },
  async created() {
    const { storeId = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeid = storeId
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCostlist({
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
    // 审核
    audioStatus(id){
      this.statusVisible = true
      this.$nextTick(() => {
        this.$refs.statusRef.init(id)
      })
    },
    // 详情
    detailView(id){
      this.$router.push({name:'settlement-cost-detail',query:{id:id}})
    },
    // 新增-编辑
    addCost(id){
      this.$router.push({name:'settlement-cost-add',query:{id:id}})
    },
    // 删除
    deleteHandle (id) {
      debugger
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该直调成本',
        confirm: async () => {
          const { data } = await getCostDelete({id:id})
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$easyConfirm.hide()
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 分页回调时间
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
    }
  }
}
</script>
<style lang="scss">
.commission-total{
  height: 40px;
  line-height: 40px;
  float: right;
}
</style>


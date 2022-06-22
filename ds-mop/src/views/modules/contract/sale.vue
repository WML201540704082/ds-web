<template>
  <div class="mod-store mop_contract_sale">
      <el-card>
          <!-- 查询条件 -->
          <el-form :model="sale" :inline="true" :link="true" ref="sale" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
            <el-form-item label="销售姓名" prop='name'>
              <el-input v-model="sale.name" placeholder="请输入销售姓名" clearable></el-input>
            </el-form-item>
            <el-form-item label="手机号码" prop='phone'>
              <el-input v-model="sale.phone" placeholder="请输入手机号" clearable></el-input>
            </el-form-item>
            <el-form-item style="display: inline-block;float: right;">
              <gt-button type="search" @click.native="resetForm('search')"/>
              <gt-button type="reset" @click.native="resetForm('reset')"/>
            </el-form-item>
          </el-form>
      </el-card>
      <!-- table -->
      <el-card class="mode-store-table">
        <gt-border-button class="gt-table-create" type="create" @click.native="() => addSalesman()"/>
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
            min-width="127"
            label="操作">
            <template slot-scope="scope">
              <el-button class="nopadding" type="text" size="small" @click="shortmessageViewHandle(scope.row.id)">查看</el-button>
              <span>|</span>
              <el-button class="nopadding" type="text" size="small" @click="update(scope.row.id)">编辑</el-button>
              <span v-if="scope.row.workStatusType === 'LEAVE'">|</span>
              <el-button v-if="scope.row.workStatusType === 'LEAVE'" class="nopadding" type="text" size="small" @click="deleteHandle(scope.row.id)">删除</el-button>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="120"
            :show-overflow-tooltip="true"
            label="销售姓名">
          </el-table-column>
          <el-table-column
            prop="phone"
            min-width="120"
            :show-overflow-tooltip="true"
            label="手机号码">
          </el-table-column>
          <el-table-column
            prop="roleType"
            min-width="120"
            :show-overflow-tooltip="true"
            label="职位角色">
            <template slot-scope="scope">
            {{scope.row.roleType = 'SALESMAN' ? '销售' : '--'}}
            </template>
          </el-table-column>
          <el-table-column
            prop="joinTime"
            min-width="120"
            :show-overflow-tooltip="true"
            label="入职日期">
            <template slot-scope="scope">{{scope.row.joinTime ? moment(scope.row.joinTime).format('YYYY-MM-DD') : '--'}}</template>
          </el-table-column>
          <el-table-column
            prop="workStatusType"
            min-width="100"
            :show-overflow-tooltip="true"
            label="状态">
            <template slot-scope="scope">
              <span :class="filterColor(filterStatus(scope.row.workStatusType, workStatusType))">{{filterStatus(scope.row.workStatusType, workStatusType)}}</span>
            </template>
          </el-table-column>
          <el-table-column
              prop="remark"
              width="140"
              :show-overflow-tooltip="true"
              label="备注">
          </el-table-column>
        </el-table>
        <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-card>
  </div>
</template>
<script>
import { workStatusType } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import { getSaleList,deleteSale } from '@/service/sale'
import moment from 'moment'
import * as api from '@/service/sale'
export default {
  data(){
    return{
      workStatusType,
      filterStatus,
      filterColor,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      sale:{},
    }
  },
  components:{
    gtPagination
  },
  created() {
    this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getSaleList({
        ...this.sale,
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
    // 新增
    addSalesman (id) {
      this.$router.push({name:'sale-add-or-update', query: {id}})
    },
    // 查看
    shortmessageViewHandle (id){
      this.$router.push({name:'sale-view',query:{id}})
    },
    //修改
    update (id){
      this.$router.push({name:'sale-add-or-update',query:{id}})
    },
    deleteHandle (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该销售记录？',
        confirm: async () => {
          const { data } = await api.deleteSale(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
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
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['sale'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    }
  }
}
</script>

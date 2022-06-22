<template>
<el-dialog
  title="选择顾客"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" label-width="120px" @submit.native.prevent="resetForm('search')">
    <el-form-item label="顾客姓名/手机号" prop="keyword">
      <el-input v-model="filterForm.keyword" placeholder="顾客姓名/手机号"></el-input>
    </el-form-item>
    <el-form-item style="display: inline-block;float: right;" v-if="isAuth('campaign:company:product:list')">
      <gt-button type="search" @click.native="resetForm('search')"/>
      <gt-button type="reset" @click.native="resetForm('reset')"/>
    </el-form-item>
  </el-form>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    max-height="360"
    ref="customerList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;min-height: 300px;">
    <el-table-column
      type="selection"
      header-align="center"
      align="center"
      width="50">
    </el-table-column>
    <el-table-column
      prop="index"
      width="60"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      width="150"
      label="操作"
      v-if="isAuth('company:customer:detail')||isAuth('company:customerCoupon:list')">
      <template slot-scope="scope">
        <el-button v-if="isAuth('company:customer:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
        <span v-if="isAuth('company:customer:detail')&&isAuth('company:customerCoupon:list')">|</span>
        <el-button v-if="isAuth('company:customerCoupon:list')" class="nopadding" type="text" size="small" @click="previewYHJ(scope.row.id,scope.row.name,scope.row.phone)">卡券</el-button>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      width="120"
      :show-overflow-tooltip="true"
      label="顾客姓名">
    </el-table-column>
    <el-table-column
      prop="wxname"
      width="120"
      :show-overflow-tooltip="true"
      label="微信昵称">
    </el-table-column>
    <el-table-column
      prop="gender"
      :show-overflow-tooltip="true"
      label="性别">
      <template slot-scope="scope">
        <span :class="filterColor(filterStatus(scope.row.gender, sex))">{{filterStatus(scope.row.gender, sex)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="phone"
      width="150"
      :show-overflow-tooltip="true"
      label="手机号">
    </el-table-column>
    <el-table-column
      prop="level"
      width="150"
      :show-overflow-tooltip="true"
      label="会员等级">
      <template slot-scope="scope">
        <span>{{filterStatus(scope.row.level, customerLevel)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="integral"
      width="150"
      :show-overflow-tooltip="true"
      label="积分">
    </el-table-column>
    <el-table-column
      prop="cardAmount"
      width="180"
      :show-overflow-tooltip="true"
      label="储值卡余额">
      <template slot-scope="scope" v-if="isAuth('company:rechargeRecord:selectList')">
        <span v-if="scope.row.rechargeTotalAmount&&scope.row.rechargeTotalAmount > 0" style="color:#FC5A3D;text-decoration: underline;cursor: pointer;" @click="storedValueCard(scope.row.id,scope.row.rechargeTotalAmount,scope.row.name,scope.row.phone)">{{priceNum(scope.row.cardAmount)}}</span>
        <span v-else >{{priceNum(scope.row.cardAmount)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="lastBuyDate"
      width="180"
      :show-overflow-tooltip="true"
      label="上次消费">
      <template slot-scope="scope">
        <span v-if="scope.row.lastBuyDate">
          <span v-if="scope.row.lastBuyDate == 0">今日</span>
          <span v-if="scope.row.lastBuyDate < 30">{{scope.row.lastBuyDate}}天前</span>
          <span v-if="scope.row.lastBuyDate >= 30">{{parseInt(scope.row.lastBuyDate/30)}}月前</span>
          <span v-if="scope.row.lastBuyDate > 31&&scope.row.lastBuyDate <= 365">{{parseInt(scope.row.lastBuyDate/365)}}年前</span>
        </span>
        <span v-else>未消费过</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="totalConsumption"
      width="180"
      :show-overflow-tooltip="true"
      label="累计消费">
        <template slot-scope="scope">
          <span>{{scope.row.totalOrders}}笔/{{priceNum(scope.row.totalConsumption)}}</span>
        </template>
    </el-table-column>
    <el-table-column
      prop="createTime"
      width="120"
      :show-overflow-tooltip="true"
      label="加入时间">
    </el-table-column>
  </el-table>
  <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { getCustomerList } from '@/service/mycustomer'
import gtPagination from '@/components/gt-pagination'
import _ from 'lodash'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        keyword: null,
      },
      currentPageSelect: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      selectedList: [],
      changePage: false
    }
  },
  components: {
    gtPagination
  },
  methods: {
    async init (customerList = []) {
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        keyword: null,
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = customerList
      this.getCustomerList()
    },
    // 获取顾客列表
    async getCustomerList() {
      const { data } = await getCustomerList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => item.id == row.id)
              if (currentRow) {
                this.$refs.customerList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 获取商品选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => ele.id == item.id)
        })
        const select = newList.concat(pushList)
        this.selectedList = select
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getCustomerList()
    },
    // 表单提交
    dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        this.$emit('refreshCustomer', this.selectedList)
        this.visible = false
      }else{
        this.visible = true
        this.$message.warning('请先选择商品')
      }
    },
    // 重置 搜索
    resetForm(type) {
      this.currentPage = 0
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.changePage = true
      this.getCustomerList()
    },
  }
}
</script>
<style lang="scss">
  .select-goods-dailog{
    .gt-pagination{
      text-align: right;
    }
  }
</style>

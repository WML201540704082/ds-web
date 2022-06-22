<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="礼品卡名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入礼品卡名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:coupon:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('company:coupon:add')" type="create" @click.native="() => addOrUpdateHandle()"/>
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
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="isAuth('company:coupon:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <!-- <span v-show="isAuth('company:coupon:delete')">
              <span v-if="isAuth('company:coupon:detail')&&isAuth('company:coupon:delete')">|</span>
              <el-button class="nopadding" type="text" size="small" @click="changeStatus(scope.row.id, scope.row.saleStatus)">{{scope.row.saleStatus === 'SALE' ? '停止销售' : '恢复销售' }}</el-button>
            </span> -->
            <span >|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" v-if="(scope.row.sales + scope.row.sendNum) === 0" @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne" v-if="(scope.row.sales + scope.row.sendNum) === 0" @click="deleteHandle(scope.row.id)">删除</div>
              <div class="buttonOne" type="text" size="small" @click="changeStatus(scope.row.id, scope.row.saleStatus)" style="margin-bottom: 0">{{scope.row.saleStatus === 'SALE' ? '停止销售' : '恢复销售' }}</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="150"
          :show-overflow-tooltip="true"
          label="礼品卡名称">
        </el-table-column>
        <el-table-column
          min-width="180"
          :show-overflow-tooltip="true"
          label="卡项内容">
          <template slot-scope="scope">
            <span>{{getContent(scope.row.items)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="validDateEnum"
          min-width="200"
          :show-overflow-tooltip="true"
          label="有效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.validDateEnum==='MONTH'">自购买日起{{scope.row.validTime}}个月</span>
            <span v-else>{{scope.row.startTime ? scope.row.startTime.substring(0,10) : '--'}}至{{scope.row.endTime ? scope.row.endTime.substring(0,10) : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stores"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
          <template slot-scope="scope">
            <span>{{getStores(scope.row.stores)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sales"
          min-width="100"
          :show-overflow-tooltip="true"
          label="销售数量">
          <template slot-scope="scope">
            <span class="theme-color" style="cursor:pointer" @click="salesQuantity(scope.row.id,'SALE')">{{scope.row.sales}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="sendNum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="赠送数量">
          <template slot-scope="scope">
            <span class="theme-color" style="cursor:pointer" @click="giftCustomer(scope.row.id,'GIFT')">{{scope.row.sendNum}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { statcardStatus } from '@/utils/dict'
import * as api from '@/service/campaign'
import { filterStatus, fileDownload } from '@/utils'
export default {
  name:'campaign-storePromotion-countCard-countCard',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        name: null,
      },
      statcardStatus,
      filterStatus,
      stores: []
    }
  },
  components: {
    gtPagination
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'countCard-view'){
        vm.reload()
      }
    })
  },
  async created() {
    // 获取优惠券列表
    if(this.isAuth('company:coupon:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStatCardList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        const { records = [], total = 0 } = data.data || {}
        this.dataList = records
        this.total = total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false

    },

    // 导出优惠券列表
    async exportExcel() {
      this.exportList(this.total, '礼品卡列表', 'COMPANY_STAT_CARD', this.filterForm, async () => {
        const { data, headers } = await api.exportCountcardExcel({
          ...this.filterForm,
          size: 10000,
          page: 0
        })
        fileDownload(data, '礼品卡列表.xls')
      })
    },
    // 删除
    async deleteHandle(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该礼品卡？',
        confirm: async () => {
          const { data } = await api.deleteStatCard({id})
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('礼品卡删除成功！')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })

    },
    // 新增
    addOrUpdateHandle (id) {
      this.$router.push({name:'countCard-add', query: {id}})
    },
    //销售数量
    salesQuantity(id,recordType){
      this.$router.push({name:'countCard-salesList',query:{id,recordType}})
    },
    // 赠送数量
    giftCustomer(id,recordType){
      this.$router.push({name:'countCard-giftList', query: {id,recordType}})
    },
    // 删除
    changeStatus (id, status) {
      this.$easyConfirm.show({
        title: '提示',
        content: status === 'SALE' ? '确定停止销售' : '确定恢复销售',
        confirm: async () => {
          let saleStatus = status === 'SALE' ? 'STOP' : 'SALE'
          const { data } = await api.changeStatCardStatus({id, saleStatus})
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success(status === 'SALE' ? '停止销售成功' : '恢复销售成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    getContent(list) {
      const newList = list.map(item => {
        return item.name + '*' + item.count
      })
      return newList.join(',')
    },
    getStores(list) {
      let str = list.map(item => {
        return item.name
      })
      return str.join(',')
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'countCard-view', query: {id}})
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

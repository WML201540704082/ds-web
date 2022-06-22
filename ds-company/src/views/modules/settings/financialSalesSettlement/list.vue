<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="filterForm" :inline="true" ref="filterForm" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店名称" prop='storeId'>
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.storeNameAcc"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="结算时间">
          <gt-time-range
            start-time-prop="start"
            :start-time-value="filterForm.start"
            :end-time-value="filterForm.end"
            end-time-prop="end"
            valueFormat="yyyy-MM-dd"
            @changeStartValue="value => filterForm.start = value"
            @changeEndValue="value => filterForm.end = value"
            type='date'
          ></gt-time-range>
        </el-form-item>
        <el-form-item
          style="display: inline-block;float: right;"
          v-if="isAuth('company:reqStock:list')">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button
        type="export"
        class="gt-table-create"
        txt="下载查询结果"
        @click.native="() => exportExcel()"/>
        <gt-border-button class="gt-table-create" txt="新建" @click.native="() => interFinancial()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
         <el-table-column prop="index" width="60" label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="financialView(scope.row.id)">查看</el-button>
            <span v-if="!scope.row.checked">|</span>
            <el-button   v-if="!scope.row.checked" class="nopadding" type="text" size="small" @click="updataFinancialView(scope.row.id)">编辑</el-button>
            <span v-if="!scope.row.checked">|</span>
            <el-button   v-if="!scope.row.checked" class="nopadding" type="text" size="small" @click="deleteView(scope.row.id)">删除</el-button>
            <span v-if="!scope.row.checked">|</span>
            <el-button   v-if="!scope.row.checked" class="nopadding" type="text" size="small" @click="auditView(scope.row.id)">审核</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="liquidationDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="结算时间"
        ></el-table-column>
        <el-table-column
          prop="storeName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeNameAcc"
          min-width="150"
          :show-overflow-tooltip="true"
          label="营业执照名称">
        </el-table-column>
        <el-table-column
          prop="financialSettlementAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="财务结算金额">
        </el-table-column>
        <el-table-column 
          min-width="160" 
          :show-overflow-tooltip="true" 
          label="付款状态">
          <template slot-scope="scope">
            <span>{{scope.row.checked ? '已审核' : '待审核'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="operator"
          min-width="180"
          :show-overflow-tooltip="true"
          label="操作人"
        >
        <template slot-scope="scope">
            <span >{{scope.row.operator || '--'}}/{{scope.row.operatorPhone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="150"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { productOwner } from "@/utils/dict";
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from "@/components/gt-pagination";
import gtTimeRange from "@/components/gt-time-range";
import * as api from "@/service/statement";
import { getStoreList } from '@/service/systore'
import gtSelectProvince from '@/components/gt-select-province'
export default {
  name: "statement-returnList-returnList",
  data() {
    return {
      storeList:[],
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      productOwner,
      details: {},
      filterForm: {
        storeId: null,
        start: null,
        end: null,
      },
    };
  },
  components: {
    gtPagination,
    gtTimeRange,
    gtSelectProvince,
  },
  inject: ['exportList'],

  async created() {
    this.getDataList();
    this.getStoreList();
  },
  methods: {
     // 编辑
    updataFinancialView (id){
      this.$router.push({name:'settings-financialSalesSettlement-financialadd',query:{id:id}})
    },
     // 查看
    financialView (id){
      this.$router.push({name:'settings-financialSalesSettlement-financialview',query:{id:id}})
    },
    //审核
    auditView(id){
       this.$easyConfirm.show({
        title: '提示',
        content: '确定审核吗？',
        confirm: async () => {
          const { data } = await api.auditView(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('审核成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    //删除
    deleteView(id){
       this.$easyConfirm.show({
        title: '提示',
        content: '确定删除吗？',
        confirm: async () => {
          const { data } = await api.deleteFinanceList(id)
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
   
       // 新建入库单
    interFinancial(){
      this.$router.push({name:'settings-financialSalesSettlement-financialadd'})
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getFinanceList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.filterForm,
      });
      this.dataListLoading = false;
      if(data && data.records){
        this.dataList = data.records.map(item=>{
          return{
            ...item,
            settlementAmount:this.priceNum(item.settlementAmount),
            financialSettlementAmount:this.priceNum(item.financialSettlementAmount),
          }
        })
        this.total = data.total;
      }else{
        this.dataList = [];
        this.total = 0;
        this.$message.error(data.msg);
      }
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.storeList = []
        this.$message.error('获取门店列表失败')
      }
    },

     // 导出
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
      }
       this.exportList(this.total, '门店收款结算列表', 'STORE_STATEMENT', criteria)
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize;
      this.currentPage = val.currentPage;
      this.getDataList();
    },
    // 重置
    resetForm(type) {
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
        this.pageSize = 20;
      }
      this.currentPage = 0;
      this.getDataList();
    },
  },
};
</script>多
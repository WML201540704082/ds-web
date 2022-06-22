<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="filterForm" :inline="true" ref="filterForm" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="结算类型" prop="expend">
          <el-select v-model="filterForm.expend" filterable placeholder="请选择类型" clearable>
            <el-option
              v-for="item in incomeStatus"
              :key="item.label"
              :label="item.label"
              :value="item.value">
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
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="liquidationDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="结算时间"
        ></el-table-column>
         <el-table-column
          prop="intoAccountDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="到账时间"
        ></el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="创建时间"
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
          prop="transactionAmount"
          min-width="100"
          :show-overflow-tooltip="true"
          label="实收金额">
            <template slot-scope="scope">
            <span>{{`${scope.row.transactionAmount || '--'}`}}</span>
          </template>
        </el-table-column>
        <el-table-column 
          prop="settlementAmount" 
          min-width="160" 
          :show-overflow-tooltip="true" 
          label="结算金额">
        </el-table-column>
        <el-table-column
          prop="expend"
          min-width="180"
          :show-overflow-tooltip="true"
          label="结算类型">
          <template slot-scope="scope">
            <span>{{scope.row.expend ? '支出' : '收入'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balance"
          min-width="150"
          :show-overflow-tooltip="true"
          label="管家卡余额">
        </el-table-column>
        <el-table-column
          prop="remark"
          min-width="150"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column> 
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import { addExportDownload } from '@/service/setting'
import { productOwner,incomeStatus } from "@/utils/dict";
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from "@/components/gt-pagination";
import gtTimeRange from "@/components/gt-time-range";
import * as api from "@/service/survey";
import { getStoreList } from '@/service/systore'
export default {
  name: "statement-returnList-returnList",
  data() {
    return {
      storeId:null,
      storeList:[],
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      productOwner,
      incomeStatus,
      details: {},
      filterForm: {
        start:'',
        end:'',
        expend:''
      },
    };
  },
  components: {
    gtPagination,
    gtTimeRange,
  },
  inject: ['exportList'],

  async created() {
    const { storeId = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeId = storeId
    this.getDataList();
    this.getStoreList();
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getdayStockList({
        size: this.pageSize,
        page: this.currentPage,
        storeId: this.storeId,
        ...this.filterForm,
      });
      this.dataListLoading = false;
      if(data && data.code ==0){
        if(data.data.records){
          this.dataList = data.data.records.map(item=>{
            return{
              ...item,
              transactionAmount:this.priceNum(item.transactionAmount),
              settlementAmount:this.priceNum(item.settlementAmount),
              balance:this.priceNum(item.balance),
            }
          })
        }else{
          this.dataList = []
        }
        this.details = data.data
        this.total = data.data.total;
      }else{
        this.dataList = [];
        this.total = 0;
        this.$message.error(data.msg);
      }
    },
    async exportList(length, filename, type, query, cb) {
      const { data } = await addExportDownload({
        name: filename,
        param: JSON.stringify(query),
        type
      })
      if (data.code === 0) {
        // 调用导出任务接口
        this.$easyAlert.show({
          title: '提示',
          content: `<div>申请导出成功，约${length}条记录，请稍后到【我的下载】下载。请耐心等待导出，切勿重复提交任务。</div>`,
          confirm: () => {
            this.$easyAlert.hide()
          }
        })
      } else {
        this.$message.error(data.msg)
      }
    },
    
    //导出
      async exportExcel() {
      const criteria = {
        ...this.filterForm,
      }
       this.exportList(this.total, '门店管家卡报表', 'STORE_STEWARD', criteria)
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
</script>
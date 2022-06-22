<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="filterForm" :inline="true" ref='filterForm' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="活动名称" prop='title'>
          <el-input v-model="filterForm.title" placeholder="活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label ="门店名称" prop='storeId'>
          <el-select v-model="filterForm.storeId" filterable placeholder="请选择门店" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" prop="type">
          <el-select v-model="filterForm.type" placeholder="活动类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeType"
              :key="item.value"
              :label="item.label"
              v-show="item.value!='PAIDGIFT'"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="filterForm.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeauditStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="filterForm.startTime"
            :end-time-value="filterForm.endTime"
            end-time-prop="endTime"
            type="date"
            @changeStartValue="value => filterForm.startTime = value"
            @changeEndValue="value => filterForm.endTime = value"
          ></gt-time-range>
        </el-form-item>
         <el-form-item label="审核时间">
          <gt-time-range
            start-time-prop="auditStartTime"
            :start-time-value="filterForm.auditStartTime"
            :end-time-value="filterForm.auditEndTime"
            end-time-prop="auditEndTime"
            type="date"
            @changeStartValue="value => filterForm.auditStartTime = value"
            @changeEndValue="value => filterForm.auditEndTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')" />
          <gt-button type="reset" @click.native="resetForm('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
         <div  style="float:left;margin-right:10px;margin-top:3px">
        <span>待审核：{{countNoCheck}}</span>
        <span>已审核：{{countAudited}}</span>
        <span>已下架：{{countClosed}}</span>
        <span>已驳回：{{countRejected}}</span>
         </div>
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
          width="130"
          label="操作">
          <template slot-scope="scope">
            <el-button  class="nopadding" type="text" size="small" @click="updateViewHandle(scope.row.type,scope.row.id,scope.row.checkContent,true)">查看</el-button>
            <span v-if="scope.row.status == 'NOCHECK'">|</span>
            <el-button v-if="scope.row.status == 'NOCHECK'" class="nopadding" type="text" size="small" @click="auditActivity(scope.row.type,scope.row.id,scope.row.checkContent,false)">审核</el-button>
            <span v-if="scope.row.status == 'PROCESSING'">|</span>
            <el-button v-if="scope.row.status == 'PROCESSING'" class="nopadding" type="text" size="small" @click="isdown(scope.row.id)">强制下架</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活动类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, activeType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, activeauditStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="checkUser"
          min-width="100"
          :show-overflow-tooltip="true"
          label="审核人">
        </el-table-column>
        <el-table-column 
         prop="checkContent"
         min-width="100" 
         :show-overflow-tooltip="true" 
         label="审核说明">
        </el-table-column>
        <el-table-column
          prop="checkTime"
          min-width="100"
          :show-overflow-tooltip="true"
          label="审核时间">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column 
         prop="startTime"
         min-width="260" 
         :show-overflow-tooltip="true" 
         label="活动时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
             <span>{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column 
         prop="click" 
         min-width="100" 
         :show-overflow-tooltip="true" 
         label="点击">
        </el-table-column>
        <el-table-column
          prop="forward"
          :show-overflow-tooltip="true"
          min-width="80"
          label="转发">
        </el-table-column>
        <el-table-column
          prop="conversion"
          :show-overflow-tooltip="true"
          min-width="80"
          label="转化">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-sold-out  ref="soldOuts" @refreshDataList="getDataList" />
  </div>
</template>
<script>
import gtSoldOut from './soldOut'
import * as api from '@/service/activity'
import { activeauditStatus,activeType } from '@/utils/dict'
import { filterStatus, fileDownload, locations } from '@/utils';
import gtPagination from "@/components/gt-pagination";
import gtTimeRange from "@/components/gt-time-range";
import { getStoreList } from '@/service/systore'
export default {
  name:'statement-storeSalesTotal-storeSalesTotal',
  data(){
    return {
      pageSize: 20,
      currentPage: 0,
      audit:false,
      soldOut:false,
      countAudited: 0 ,
      countClosed: 0,
      countNoCheck: 0,
      countRejected: 0,
      status,
      activeauditStatus,
      activeType,
      storeList: [],
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      filterForm: {
        status: null,
        type: null,
        title: null,
        showStore: false,
        storeId: null,
        startTime: null,
        endTime: null,
        auditStartTime: null,
        auditEndTime: null,
      },
    }
  },
  inject: ['exportList'],
  async created() {
    this.getDataList();
    this.getCountList()
    this.getStoreList();
  },
  components: {
    gtSoldOut,
    gtPagination,
    gtTimeRange,
  },
  methods:{

    // 下架
    isdown(id){
         this.soldOut=true
         this.$nextTick(() =>{
           this.$refs.soldOuts.init(id)
         })
    },
    // 审核
    auditActivity(type,id,checkContent,audit){
        if(type=='SPECIAL'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-specailaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else if(type=='TURN'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-bigWheelaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else if(type=='GROUP'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-communityGroupaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else{
          this.$router.push({name:'campaign-wechatMarketing-activeList-payGiftadd',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }
    },
    // 查看
    updateViewHandle(type,id,checkContent,audit){
        if(type=='SPECIAL'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-specailaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else if(type=='TURN'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-bigWheelaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else if(type=='GROUP'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-communityGroupaudit',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }else{
          this.$router.push({name:'campaign-wechatMarketing-activeList-payGiftadd',query:{id:id,type:type,audit:audit,checkContent:checkContent}})
        }
    },

    async getCountList() {
      this.dataListLoading = true;
      const { data } = await api.getStoreActivityCount()
      this.dataListLoading = false;
      if (data && data.code === 0) {
        this.countAudited = data.data.countAudited,
        this.countClosed = data.data.countClosed,
        this.countNoCheck = data.data.countNoCheck,
        this.countRejected = data.data.countRejected   
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true;
      const { data } = await api.getStoreActivityList({
        ...this.filterForm,
         size: this.pageSize,
        page: this.currentPage,
        close : true
      });
      this.dataListLoading = false;
      if (data && data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
          }
        })
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
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
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        storeId: (this.filterForm.storeId && this.filterForm.storeId !== -1) ? this.filterForm.storeId : null,
      }
        const { data, headers } = await api.exportAuditExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '活动审核.xls')
      // })
    },
    // 重置
    resetForm(type) {
      if (type === "reset") {
        this.$refs["filterForm"].resetFields();
        this.pageSize = 20
        if (this.$refs['provinceLocation']) {
          this.$refs['provinceLocation'].refresh()
        }
      }
      this.currentPage = 0
      this.getDataList();
      this.getCountList();
    },
  },
}
</script>
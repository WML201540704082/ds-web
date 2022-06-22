<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="activity" :inline="true" ref='activity' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="活动名称" prop="title">
          <el-input v-model="activity.title" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyId" v-if="isAuth('mop:company:select2')">
          <el-select v-model="activity.companyId" filterable placeholder="请选择企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动类型" prop='type'>
          <el-select v-model="activity.type" placeholder="请选择活动类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态" prop='status'>
          <el-select v-model="activity.status" placeholder="请选择活动状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间">
          <gt-time-range
            start-time-prop="startTime"
            :start-time-value="activity.startTime"
            :end-time-value="activity.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => activity.startTime = value"
            @changeEndValue="value => activity.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="审核时间">
          <gt-time-range
            start-time-prop="auditStartTime"
            :start-time-value="activity.auditStartTime"
            :end-time-value="activity.auditEndTime"
            end-time-prop="auditEndTime"
            @changeStartValue="value => activity.auditStartTime = value"
            @changeEndValue="value => activity.auditEndTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="入驻品牌" prop='brandId'>
          <el-select v-model="activity.brandId" placeholder="请选择活动状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in mbgInList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('mop:order:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <span class="info">
        <span>待审核:{{info.countNoCheck}}</span>
        <span>已审核:{{info.countAudited}}</span>
        <span>已驳回:{{info.countRejected}}</span>
        <span>已下架:{{info.countClosed}}</span>
      </span>
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
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="scope.row.status != 'NOCHECK'" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row)">查看</el-button>
            <!-- <span v-if="scope.row.status == 'AUDITED' || scope.row.status == 'NOCHECK'">|</span> -->
            <el-button v-if="scope.row.status == 'PROCESSING'" class="nopadding" type="text" size="small" @click="downViewHandle(scope.row)">强制下架</el-button>
            <el-button v-if="scope.row.status == 'NOCHECK'" class="nopadding" type="text" size="small" @click="audioViewHandle(scope.row)">审核</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="title"
          :show-overflow-tooltip="true"
          min-width="150"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="80"
          :show-overflow-tooltip="true"
          label="活动类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, activeType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="80"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status, activeStatus)}}</span>
          </template>
        </el-table-column>
         <el-table-column
          prop="checkUser"
          min-width="120"
          :show-overflow-tooltip="true"
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="checkContent"
          min-width="120"
          :show-overflow-tooltip="true"
          label="审核说明">
        </el-table-column>
        <el-table-column
          prop="checkTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="审核时间">
        </el-table-column>
        <el-table-column
          prop="companyNo"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业编号">
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="startTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="活动时间">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}-{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="click"
          :show-overflow-tooltip="true"
          min-width="80"
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
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-stop ref='stop' @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { activeStatus, activeType,audio } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import gtStop from './activity/components/stopresult'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import { mbgEnter } from '@/service/company'
import moment from 'moment'
export default {
  name:'audit-activity',
  data () {
    return {
      isCheck: true,
      filterStatus,
      filterColor,
      activeStatus,
      activeType,
      audio,
      number,
      dataList: [],
      mbgInList: [],//入驻品牌数组
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      activity:{
        companyId:'',
        startTime:null,
        endTime:null,
        auditStartTime:null,
        auditEndTime:null,
        status: '',
        type: '',
        title: null,
        brandId: '',
        showStore: true
      },
      companyList: [],
      info: {},
    }
  },
  components: {
    gtPagination, gtTimeRange, gtStop
  },
  inject: ['reload'],
  beforeRouteEnter(to,from,next){
    next(vm=>{
      if(vm.isCheck){
        vm.reload()
      }
    })
  },
  mounted() {
    if(this.$route.params.state){
      this.activity.status = this.$route.params.state
    }
    // 获取审核列表
    this.getDataList()

    // 获取企业列表
    this.getCompanyList()

    this.countAll()

    //入驻品牌列表
    this.getMbgInList()
  },
  methods: {
    // 获取统计数据
    async countAll(){
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/countAll',true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          this.info = data.data
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/list',true),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.activity,
          auditStartTime:this.activity.auditStartTime ? new Date(this.activity.auditStartTime).getTime() : null,
          auditEndTime:this.activity.auditEndTime ? new Date(this.activity.auditEndTime).getTime() : null
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },
    // 获取品牌列表
    async getMbgInList() {
      const { data } = await mbgEnter({
        currentPage: 1,
        pageSize: 100
      })
      if (data.code === 0) {
        this.mbgInList = data.data.records
      } else {
        this.mbgInList = []
        this.$message.error(data.msg)
      }
    },
    // 导出活动审核列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/activity/export',true),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.activity,
          companyId:this.activity.companyId || null,
          status: this.activity.status || null,
          type: this.activity.type || null,
          size: 10000,
          page: 0,
        })
      })
      fileDownload(data, '活动审核列表.xls')
    },
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
    },
    // 查看
    storeViewHandle (item){
      this.isCheck = false
      if(item.type == 'SPECIAL'){
        this.$router.push({name:'specail-view',query:{id:item.id,edit:0,status:item.status}})
      }else if(item.type == 'GROUP'){
        this.$router.push({name:'specail-view',query:{id:item.id,edit:0,status:item.status,type:'GROUP'}})
      }else if(item.type == 'TURN'){
        this.$router.push({name:'bigwheel-view',query:{id:item.id,edit:0,status:item.status}})
      }else if(item.type == 'PAIDGIFT'){
        this.$router.push({name:'paygift-view',query:{id:item.id,edit:0,status:item.status}})
      }
    },
    // 强制下架
    downViewHandle(item){
      this.$refs.stop.init(item.id)
    },
    // 审核
    audioViewHandle(item){
      this.isCheck = true
      if(item.type == 'SPECIAL'){
        this.$router.push({name:'specail-view',query:{id:item.id,edit:1,status:item.status}})
      }else if(item.type == 'GROUP'){
        this.$router.push({name:'specail-view',query:{id:item.id,edit:1,status:item.status,type:'GROUP'}})
      }else if(item.type == 'TURN'){
        this.$router.push({name:'bigwheel-view',query:{id:item.id,edit:1,status:item.status}})
      }else if(item.type == 'PAIDGIFT'){
        this.$router.push({name:'paygift-view',query:{id:item.id,edit:1,status:item.status}})
      }
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['activity'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

<style lang="scss" scoped>
.info {
  margin-bottom: 10px;
  float: left;
  span {
    margin-right: 5px;
  }
}
</style>


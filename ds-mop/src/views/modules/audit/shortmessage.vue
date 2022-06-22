<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="shortmessage" :inline="true" ref='shortmessage' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="企业名称" prop="companyId">
          <el-select v-model="shortmessage.companyId" filterable placeholder="请选择企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="短信状态" prop='status'>
          <el-select v-model="shortmessage.status" placeholder="请选择短信状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in shortMessageStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
          <gt-time-range
            start-time-prop="createDateBegin"
            :start-time-value="shortmessage.createDateBegin"
            :end-time-value="shortmessage.createDateEnd"
            end-time-prop="createDateEnd"
            @changeStartValue="value => shortmessage.createDateBegin = value"
            @changeEndValue="value => shortmessage.createDateEnd = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <div class="data-center">
        待审核： <span class="blue">{{checkNum}}</span>
        已发送：<span class="green">{{sendNum}}</span>
        已驳回：<span class="red">{{rejectNum}}</span>
      </div>
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
          width="80"
          label="操作" v-if="isAuth('mop:order:detail')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id, scope.row.status === 'CHECK')">{{scope.row.status === 'CHECK' ? '审核' : '查看'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="审核状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, shortMessageStatus))">{{filterStatus(scope.row.status, shortMessageStatus)}}</span>
          </template>
        </el-table-column>
         <el-table-column
          prop="checkUser"
          min-width="100"
          :show-overflow-tooltip="true"
          label="审核人">
        </el-table-column>
        <el-table-column
          prop="checkExplain"
          min-width="120"
          :show-overflow-tooltip="true"
          label="审核说明">
        </el-table-column>
        <el-table-column
          prop="checkDate"
          :show-overflow-tooltip="true"
          min-width="150"
          label="审核时间">
          <template slot-scope="scope">
            <span>{{scope.row.checkDate ? moment(scope.row.checkDate).format('YYYY-MM-DD HH:mm:ss') : ''}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="createDate"
          :show-overflow-tooltip="true"
          min-width="150"
          label="创建时间">
          <template slot-scope="scope">
            <span>{{moment(scope.row.createDate).format('YYYY-MM-DD HH:mm:ss')}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { shortMessageStatus } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor, number, fileDownload } from '@/utils'
import moment from 'moment'
export default {
  name:'audit-shortmessage',
  data () {
    return {
      isCheck: true,
      filterStatus,
      filterColor,
      number,
      // 待审核
      checkNum: 0,
      // 已驳回
      rejectNum: 0,
      // 已发送
      sendNum: 0,
      dataList: [],
      dataListLoading: false,
      total: 0,
      moment,
      pageSize: 20,
      currentPage: 0,
      shortMessageStatus,
      shortmessage:{
        companyId: '',
        status: '',
        id:null,
        createDateBegin:null,
        createDateEnd:null
      },
      companyList: []
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  inject: ['reload'],
  beforeRouteEnter(to,from,next){
    next(vm => {
      if(vm.isCheck){
        vm.reload()
      }
    })
  },
  mounted() {

    if(this.$route.params.state){
      this.shortmessage.status = this.$route.params.state
    }
    // 获取审核列表
    this.getDataList()

    // 获取审核数据
    this.getDataSum()

    // 获取企业列表
    this.getCompanyList()

  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/smsMarketing/list',true),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.shortmessage,
          createDateBegin:this.shortmessage.createDateBegin ? new Date(this.shortmessage.createDateBegin).getTime() : null,
          createDateEnd:this.shortmessage.createDateEnd ? new Date(this.shortmessage.createDateEnd).getTime() : null
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
    // 导出活动审核列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/smsMarketing/export',true),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.shortmessage,
          companyId: this.shortmessage.companyId || null,
          status: this.shortmessage.status || null,
          size: 10000,
          page: 0
        })
      })
      fileDownload(data, '短信审核列表.xls')
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
    // 获取审核数据
    async getDataSum() {
      this.dataListLoading = true
      const data = await this.$http({
        url: this.$http.adornUrl('/smsMarketing/statisticeNum',true),

        method: 'get'
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.checkNum = data.data.checkNum
          this.rejectNum = data.data.rejectNum
          this.sendNum = data.data.sendNum
        }
      })
    },
    // 查看
    storeViewHandle (id, flag){
      this.isCheck = flag
      this.$router.push({name:'shortmessage-view',query:{id}})
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
        this.$refs['shortmessage'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss" scoped>
.data-center{
  margin-bottom: 15px;
  span{
    display: inline-block;
    margin-right: 10px;
  }
  .red{
    color: red;
  }
  .blue{
    color: blue;
  }
  .green{
    color: green;
  }
}
</style>



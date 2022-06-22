<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="companyFilter" :model="filterData" @keyup.enter.native="reset('search')">
        <el-form-item label="名称/编号" prop='key'>
          <el-input placeholder="请输入企业名称/编号" v-model="filterData.key" clearable></el-input>
        </el-form-item>
        <el-form-item label="实体类别" prop='entityCategory'>
          <el-select placeholder="请选择实体类别" v-model="filterData.entityCategory" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="type.value" :label="type.label" :value="type.value" v-for="type in companyType"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业级别" prop="level">
          <el-select placeholder="请选择企业级别" v-model="filterData.level" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="level.value" :label="level.label" :value="level.value" v-for="level in companyLevel"></el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="系统版本" prop="version">
          <el-select placeholder="请选择系统版本" v-model="filterData.version" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="version.value" :label="version.label" :value="version.value" v-for="version in companyVersion"></el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="企业状态" prop="status">
          <el-select placeholder="请选择企业状态" v-model="filterData.status" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="status.value" :label="status.label" :value="status.value" v-for="status in companyStatus"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="法人/联系电话" prop='contact'>
          <el-input placeholder="请输入法人/联系电话" v-model="filterData.contact" clearable></el-input>
        </el-form-item>
        <el-form-item label="服务时间" class="gt-inline-item">
          <gt-time-range
            start-time-prop="serviceBeginDate"
            :start-time-value="filterData.serviceBeginDate"
            :end-time-value="filterData.serviceEndDate"
            end-time-prop="serviceEndDate"
            @changeStartValue="value => filterData.serviceBeginDate = value"
            @changeEndValue="value => filterData.serviceEndDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('mop:company:list')">
          <gt-button type="search" @click.native="reset('search')"/>
          <gt-button type="reset"  @click.native="reset"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" v-if="isAuth('mop:company:add')" @click.native="() => addOrUpdateHandle('edit')"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <gt-border-button type="export" class="gt-table-create" txt="一键清空记录" @click.native="() => clearRecord()"/>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading"
        v-table-height>
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="160"
          label="操作"
          >
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle('view', scope.row.id)">查看</el-button>
            <span>|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
            >
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" @click="addOrUpdateHandle('edit', scope.row.id)">编辑</div>
              <div class="buttonOne" @click="goDistribute(scope.row.id)" >分账开户</div>
              <div class="buttonOne" @click="syncStock(scope.row.id)" >同步库存</div>
              <div class="buttonOne" @click="clearData(scope.row)" >一键清空</div>
            </el-popover>
            <!-- <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle('edit', scope.row.id)">编辑</el-button>
            <span >|</span>
            <el-button class="nopadding" type="text" size="small" @click="goDistribute(scope.row.id)">分账开户</el-button> -->
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          min-width="120"
          :show-overflow-tooltip="true"
          label="企业编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          label="企业状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, companyStatus))">{{filterStatus(scope.row.status, companyStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
         <el-table-column
          prop="industryCategory"
          min-width="100"
          label="行业类别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.industryCategory, industryType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceTime"
          :show-overflow-tooltip="true"
          min-width="180"
          label="服务时间">
          <template slot-scope="scope">
            <span v-if="scope.row.serviceBeginDate || scope.row.serviceEndDate">{{`${scope.row.serviceBeginDate || '-'} 至 ${scope.row.serviceEndDate || '-'}`}}</span>
            <span v-else> - </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="entityCategory"
          min-width="80"
          label="实体类别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.entityCategory, companyType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          min-width="80"
          label="企业级别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.level, companyLevel)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeNumber"
          align="center"
          min-width="80"
          :show-overflow-tooltip="true"
          label="门店数量">
        </el-table-column>
        <el-table-column
          prop="legalPerson"
          min-width="100"
          :show-overflow-tooltip="true"
          label="法人">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="联系电话">
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          min-width="180"
          label="企业地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}`}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          :show-overflow-tooltip="true"
          min-width="180"
          label="系统版本">
          <template slot-scope="scope">
            <span>{{scope.row.version ? filterStatus(scope.row.version, companyVersion) : '专业版'}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="statusRemark"
          min-width="150"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <clear-list-modal ref="clearListModal" />
    <clear-company-info-modal ref="clearCompanyInfoModal" @refreshData="getDataList" />
  </div>
</template>

<script>
import { companyLevel, companyType, companyStatus, industryType, companyVersion } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import clearListModal from './component/clear-list-modal'
import clearCompanyInfoModal from './component/clear-company-info-modal'
export default {
  name:'company-company',
  data () {
    return {
      dataList: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      dataListLoading: false,
      filterData: {
        key: null,
        version: '',
        entityCategory: '',
        level: '',
        status: '',
        serviceBeginDate: null,
        serviceEndDate: null,
        contact:null,//法人，联系电话
      },
      companyLevel,
      companyType,
      industryType,
      companyVersion,
      companyStatus,
      filterStatus,
      filterColor
    }
  },
  components: { gtPagination, gtTimeRange, clearListModal, clearCompanyInfoModal },
  inject: ['reload'],
  beforeRouteEnter(to,from,next){
    next(vm=>{
      if(from.name !== 'company-view'){
        vm.reload()
      }
    })
  },
  created() {
    if(this.$route.params.state){
      this.filterData.status = this.$route.params.state
    }
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/list'),
        method: 'post',
        data: this.$http.adornData({
          currentPage: this.currentPage,
          pageSize: this.pageSize,
          entityCategory: '',
          level: '',
          status: '',
          ...this.filterData
        })
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },

    // 分账
    goDistribute(id) {
      this.$router.push({name: 'company-distribute', query: {id: id}})
    },

    // 同步库存
    async syncStock(id) {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl(`/mop/product/resync/${id}`),
        method:'get',
        selfHandleError: true,
      })
      if (data.code === 0) {
        this.$message.success('同步库存成功！')
      } else {
        this.$message.error(data.msg)
      }
    },

    // 导出企业列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/export'),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.filterData,
          entityCategory: this.filterData.entityCategory,
          level: this.filterData.level,
          status: this.filterData.status,
          currentPage: 1,
          pageSize: 10000,
        })
      })
      fileDownload(data, '企业列表.xls')
    },

    // 清空记录
    clearRecord() {
      this.$nextTick(() => {
        this.$refs['clearListModal'].init()
      })
    },

    // 一键清空
    clearData(data) {
      this.$nextTick(() => {
        this.$refs['clearCompanyInfoModal'].init(data)
      })
    },

    // 新增 / 修改 / 查看
    addOrUpdateHandle (type, id) {
      if ( type === 'view' ) {
        this.$router.push({name: 'company-view', query: {id: id}})
      } else {
        this.$router.push({name: 'company-add-or-update', query: {id: id}})
      }
    },

    // 修改分页
    pagination_event (val){
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    reset (isSearch) {
      if(isSearch != 'search'){
        this.$refs['companyFilter'].resetFields()
        this.filterData.status =''
      }
      this.pageSize = 20
      this.currentPage = 1
      this.getDataList()
    }
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  @import '~@/assets/scss/store/store.scss';
</style>


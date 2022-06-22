<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form label-width="120px" :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店名称/编码" prop='key'>
          <el-input clearable v-model="form.key" placeholder="请输入门店名称/编码"></el-input>
        </el-form-item>
        <el-form-item label="SN号" prop='sn'>
          <el-input clearable v-model="form.sn" placeholder="请输入SN号"></el-input>
        </el-form-item>
        <el-form-item label="所属企业" prop='companyId' v-if="isAuth('mop:company:select1')">
          <el-select v-model="form.companyId" filterable placeholder="请选择所属企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="门店状态" prop='status'>
          <el-select v-model="form.status" placeholder="请选择门店状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="系统版本" prop="version">
          <el-select placeholder="请选择系统版本" v-model="form.version" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="version.value" :label="version.label" :value="version.value" v-for="version in companyVersion"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="星级" prop="level">
          <el-select placeholder="请选择星级" v-model="form.level" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option :key="level.value" :label="level.label" :value="level.value" v-for="level in companyStarlevel"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="服务时间">
          <gt-time-range
            start-time-prop="serviceBeginDate"
            :start-time-value="form.serviceBeginDate"
            :end-time-value="form.serviceEndDate"
            end-time-prop="serviceEndDate"
            @changeStartValue="value => form.serviceBeginDate = value"
            @changeEndValue="value => form.serviceEndDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('mop:store:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('mop:store:add')" type="create" @click.native="addOrUpdateHandle()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height>
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="180"
          label="操作"
          v-if="isAuth('mop:store:detail')||isAuth('mop:store:update')">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small"  v-if="isAuth('mop:store:detail')" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <span v-if="isAuth('mop:store:detail')&&isAuth('mop:store:update')">|</span>
            <el-button class="nopadding" type="text" size="small" v-if="isAuth('mop:store:update')" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <span v-if="!scope.row.liveCode">|</span>
            <el-button v-if="!scope.row.liveCode" class="nopadding" type="text" size="small" @click="shareCode(scope.row.id, scope.$index)">{{currentLiveLoading === scope.$index  ? '生成中' : '直播分享码'}}</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="fuiouMerchantNo"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商户号">
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属企业">
        </el-table-column>
        <!-- <el-table-column
          prop="storeCategory"
          :show-overflow-tooltip="true"
          min-width="80"
          label="类型">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.storeCategory, storeB))">{{filterStatus(scope.row.storeCategory, storeB)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="linkman"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="leagueBrand"
          :show-overflow-tooltip="true"
          min-width="120"
          label="加盟品牌">
          <!-- <template slot-scope="scope">
            <span>{{filterStatus(scope.row.leagueBrand, brandType)}}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="leagueAuthorizationCode"
          :show-overflow-tooltip="true"
          min-width="120"
          label="加盟授权编码">
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="180"
          :show-overflow-tooltip="true"
          label="门店地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, storeStatus))">{{filterStatus(scope.row.status, storeStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          :show-overflow-tooltip="true"
          min-width="100"
          label="系统版本">
          <template slot-scope="scope">
            <span>{{scope.row.version ? filterStatus(scope.row.version, companyVersion) : '专业版'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceBeginDate "
          min-width="180"
          :show-overflow-tooltip="true"
          label="服务时间">
          <template slot-scope="scope">
            <span>{{scope.row.serviceBeginDate}}<span v-if="scope.row.serviceEndDate !=null&&scope.row.serviceBeginDate !=null">至</span>{{scope.row.serviceEndDate}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="statusRemark"
          min-width="150"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column> -->
        <el-table-column
          prop="brandArea"
          min-width="150"
          :show-overflow-tooltip="true"
          label="自定义区域">
        </el-table-column>
        <el-table-column
          prop="region"
          min-width="150"
          :show-overflow-tooltip="true"
          label="大区">
        </el-table-column>
        <el-table-column
          prop="acreage"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店面积">
        </el-table-column>
            <el-table-column
          prop="onStatusDate"
          min-width="150"
          :show-overflow-tooltip="true"
          label="启用时间">
        </el-table-column>
        <el-table-column
          prop="activityStatus"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活跃状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.activityStatus, activityStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="level"
          min-width="150"
          :show-overflow-tooltip="true"
          label="星级">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.level, companyStarlevel)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastOrderDate"
          min-width="150"
          :show-overflow-tooltip="true"
          label="最近开单时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus, storeB, brandType,activityStatus,companyVersion,companyStarlevel } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'

export default {
  name:'store-store',
  data () {
    return {
      activityStatus,
      brandType,
      filterStatus,
      filterColor,
      pageC: 1,
      pageZ: 1000,
      dataList: [],
      dataListLoading: false,
      currentLiveLoading: null,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      form:{
        companyId: '',
        key:null,
        status:'',
        version:'',
        level:'',
        serviceBeginDate:null,
        serviceEndDate:null,
        sn:null,
      },
      companyList: [],
      storeStatus,
      storeB,
      companyVersion,
      companyStarlevel

    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  inject: ['reload'],
  beforeRouteEnter(to,from,next){
    next(vm=>{
      if(from.name !== 'store-view'){
        vm.reload()
      }
    })
  },
  created () {
    if(this.$route.params.state == 0){
      this.form.status = this.$route.params.state
    }
    this.getDataList()
    this.selectCompany()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          ...this.form
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.total = 0
        }
      })

    },

    // 直播分享吗
    shareCode:function(id, index) {
      if (this.currentLiveLoading !== null) {
        return
      }
      this.currentLiveLoading = index
      this.$http({
        url: this.$http.adornUrl(`/baseinfo/mop/store/createLiveCode/${id}`),
        method: 'get',
        data: this.$http.adornData({
          storeId: id,
        })
      }).then(({data}) => {
        this.currentLiveLoading = null
        if (data.code === 0) {
          this.$message.success('操作成功')
          this.getDataList()
        } else {
          this.$message.error(data.msg)
        }
      })
    },

    // 导出企业列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/export'),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.form,
          pageSize: 10000,
          currentPage: 1,
        })
      })
      fileDownload(data, '企业门店.xls')
    },

    // 所选企业
    selectCompany(){
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageZ,
          currentPage: this.pageC,
        })
      }).then(({data}) => {
        if(data && data.code === 0) {
          this.companyList = data.data.records
        }else{
          this.companyList = []
        }
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({name:'store-add-or-update',query:{id:id}})
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'store-view',query:{id:id}})
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
        this.$refs['form'].resetFields()
        this.form.status = ''
      }
      this.pageSize = 20
      this.currentPage = 1
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  @import '~@/assets/scss/store/store.scss';

</style>


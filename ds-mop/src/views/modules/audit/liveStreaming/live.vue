<template>
  <div class="mod-store-live">
    <el-card>
      <el-form :model="live" :inline="true" ref='live' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="直播标题" prop="title">
          <el-input v-model="live.title" placeholder="请输入直播标题" clearable></el-input>
        </el-form-item>
        <el-form-item label="企业名称" prop="companyId">
          <el-select v-model="live.companyId" @change="getCompanyId" filterable placeholder="请选择企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop="storeId">
          <el-select v-model="live.storeId" filterable placeholder="请选择门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="审核状态" prop='status'>
          <el-select v-model="live.status" placeholder="请选择活动状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in auditStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="直播状态" prop='zhiboStatus'>
          <el-select v-model="live.zhiboStatus" placeholder="请选择活动状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in liveStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="search-toolbar" style="float:right">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
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
          min-width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="125"
          label="操作">
          <template slot-scope="scope">
            <el-button style="padding:0 !important;" class="nopadding" type="text" size="small" @click="viewHandle(scope.row.id,scope.row.auditStatus)">查看</el-button>
            <span v-if="scope.row.auditStatus == 'UNAUDIT' || scope.row.auditStatus == 'AUDITING' || scope.row.auditStatus == 'FINISHED'">|</span>
            <el-button style="padding:0 !important;" v-if="scope.row.auditStatus == 'UNAUDIT'" class="nopadding" type="text" size="small" @click="auditingHandle(scope.row.id,scope.row.auditStatus)">审核</el-button>
            <el-button style="padding:0 !important;" v-if="scope.row.auditStatus == 'AUDITING'" class="nopadding" type="text" size="small" @click="passAudit(scope.row.id)">通过</el-button>
            <el-button style="padding:0 !important;" v-if="scope.row.auditStatus == 'FINISHED'" class="nopadding" type="text" size="small" @click="operationalData(scope.row.id)">运营数据</el-button>
            <span v-if="scope.row.auditStatus == 'FINISHED'">|</span>
            <el-button v-if="scope.row.auditStatus == 'FINISHED'" style="padding:0 !important;" class="nopadding" type="text" size="small" @click="cancelHandle(scope.row.id)">作废</el-button>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="anchorLiveCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="开播码">
          <template slot-scope="scope">
            <span class="spec-pic" v-if="refresh">
              <gt-image-upload tip="" realistStr="anchorLiveCode" :comp="12" :names="scope.row.id+'anchor'" :max="1" :reallist="scope.row.anchorLiveCode" :cb="value => uploadPhoto(scope.row.id,value,scope.$index,'anchor')" />
            </span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="audiencePlayCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="直播间分享码">
          <template slot-scope="scope">
            <span class="spec-pic" v-if="refresh">
              <gt-image-upload tip="" realistStr="audiencePlayCode" :comp="12" :names="scope.row.id+'audience'" :max="1" :reallist="scope.row.audiencePlayCode" :cb="value => uploadPhoto(scope.row.id,value,scope.$index,'audience')" />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="auditStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="审核状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.auditStatus,auditStatus)}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="zhiboStatus"
          min-width="100"
          :show-overflow-tooltip="true"
          label="直播状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.zhiboStatus, liveStatus)}}</span>
          </template>
        </el-table-column> -->
        <el-table-column
          prop="title"
          :show-overflow-tooltip="true"
          min-width="120"
          label="直播标题">
        </el-table-column>
        <el-table-column
          prop="startTime"
          :show-overflow-tooltip="true"
          min-width="120"
          label="直播时间">
        </el-table-column>
        <el-table-column
          prop="companyName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="企业名称">
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="门店名称">
          <template slot-scope="scope">
            <span>{{scope.row.storeName || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-operationalData v-if="operationalLoading" ref="operatData" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import { liveStatus,auditStatus } from '@/utils/dict'
import { filterStatus,fileDownload } from '@/utils'
import gtOperationalData from './components/operationalData'
import gtImageUpload from '@/components/gt-image-upload'
export default {
  name:'audit-liveStreaming-live',
  data(){
    return{
      isCheck: true,
      refresh: true,
      filterStatus,
      auditStatus,//审核状态
      liveStatus,//直播状态
      dataList: [],
      dataListLoading: false,
      storeListLoading: false,
      operationalLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      live:{
        title:null,
        companyId:'',
        status:'',//审核状态
        zhiboStatus:''
      },
      companyList: [],
      storeList: [],
    }
  },
  components: {
    gtPagination,gtOperationalData,gtImageUpload
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(vm.isCheck){
        vm.reload()
      }
    })
  },
  mounted(){
    // 获取审核列表
    this.getDataList()
    // 获取企业列表
    this.getCompanyList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      this.refresh = false
      const data = await this.$http({
        url: this.$http.adornUrl('/live/list',true),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.live
        })
      }).then(({data}) => {
        this.dataListLoading = false
        this.refresh = true
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
      })
    },
    // 导出直播审核列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/live/export',true),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.live,
          size: 10000,
          page: 0
        })
      })
      fileDownload(data, '直播审核列表.xls')
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
    // 监听企业id
    getCompanyId(val){
      this.auditCompanyId = val
      this.getStoreList()
    },
    // 获取门店下拉列表
    async getStoreList() {
      if (!this.auditCompanyId) {
        return
      }
      this.storeListLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1,
          companyId: this.auditCompanyId
        })
      }).then(({data}) => {
        this.storeListLoading = false
        if (data && data.code === 0) {
          this.storeList = data.data.records
        } else {
          this.$message.error(data.msg)
          this.storeList = []
        }
      })
    },
    //查看
    viewHandle(id,auditStatus){
      this.isCheck = false
      this.$router.push({name:'live-view',query:{id:id,auditStatus:auditStatus,edit:0}})
    },
    //审核
    auditingHandle(id,auditStatus){
      this.isCheck = true
      this.$router.push({name:'live-view',query:{id:id,auditStatus:auditStatus,edit:1}})
    },
    //通过
    passAudit(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定修改审核状态为通过吗？',
        confirm: async () => {
          const { data } = await this.$http({
            url: this.$http.adornUrl('/live/update',true),
            method: 'post',
            data: this.$http.adornData({
              id:id,
              status:'FINISHED'
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$easyConfirm.hide()
              this.$message.success('修改成功')
              this.getDataList()
            }else{
              this.$easyConfirm.hide()
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    //作废
    cancelHandle(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定要作废该直播吗？',
        confirm: async () => {
          const { data } = await this.$http({
            url: this.$http.adornUrl('/live/update',true),
            method: 'post',
            data: this.$http.adornData({
              id:id,
              status:'CANCEL'
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$easyConfirm.hide()
              this.$message.success('修改成功')
              this.getDataList()
            }else{
              this.$easyConfirm.hide()
              this.$message.error(data.msg)
            }
          })
        }
      })
    },
    //运营数据
    operationalData(id){
      this.operationalLoading = true
      this.$nextTick(() => {
        this.$refs.operatData.init(id)
      })
    },

    // 上传图片
    async uploadPhoto(idx,url,index,type){
      if (type == 'anchor') {
        const {data} = await this.$http({
          url: this.$http.adornUrl('/live/update',true),
          method: 'post',
          selfHandleError: true,
          data: this.$http.adornData({
            id:idx,
            anchorLiveCode:url
          })
        })
        if(data.code == 0){
          this.dataList[index].anchorLiveCode = url
          this.getDataList()
        }else{
          this.$message.error(data.msg)
        }
      } else {
        const {data} = await this.$http({
          url: this.$http.adornUrl('/live/update',true),
          method: 'post',
          selfHandleError: true,
          data: this.$http.adornData({
            id:idx,
            audiencePlayCode:url
          })
        })
        if(data.code == 0){
          this.dataList[index].audiencePlayCode = url
          this.getDataList()
        }else{
          this.$message.error(data.msg)
        }
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
        this.$refs['live'].resetFields()
        this.storeList = []
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.mod-store-live{
  .spec-pic{
    .fileCon{
      padding-left: 0 !important;
      min-height: 50px;
      .list{
        margin: 0;
        min-height: 50px;
        padding: 0 !important;
        & > div{
          padding: 0 !important;
          width: 50px;
          height: 50px;
        }
        .close{
          width: 20px;
          height: 20px;
          padding: 0 !important;
        }
        .el-loading-spinner{
          padding: 0 !important;
          .circular{
            margin: 10px 0 0 2px;
            width: 20px;
            height: 20px;
          }
        }
        .add{
          padding: 0 !important;
          margin: 0;
          .close{
            width: 30px;
            height: 30px;
            padding: 0 !important;
          }
          .el-upload-card{
            width: 48px !important;
            height: 48px !important;
            line-height: 48px !important;
          }
        }
      }
    }
    & > div{
      padding: 0 !important;
    }

  }
}

</style>

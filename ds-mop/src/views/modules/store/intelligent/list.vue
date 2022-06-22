<template>
  <div class="mod-store">
    <el-card>
      <el-form :model="intelligent" :inline="true" ref='intelligent' class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="企业名称" prop="companyId">
          <el-select v-model="intelligent.companyId" filterable placeholder="请选择企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="门店名称" prop='key'>
          <el-input clearable v-model="intelligent.key" placeholder="请输入门店名称"></el-input>
        </el-form-item>
        <el-form-item label="是否关联" prop='hasBind'>
          <el-select v-model="intelligent.hasBind" placeholder="请选择门店状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in hasBindStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height>
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button v-if="!scope.row.yundingCode" class="nopadding" type="text" size="small" @click="bind_or_update(scope.row,'bind')">绑定</el-button>
            <el-button v-if="scope.row.yundingCode" class="nopadding" type="text" size="small" @click="bind_or_update(scope.row,'update')">修改</el-button>
            <span v-if="scope.row.yundingCode">|</span>
            <el-button v-if="scope.row.yundingCode" class="nopadding" type="text" size="small" @click="deleteBind(scope.row.id)">删除</el-button>
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
          prop="companyName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属企业">
        </el-table-column>
        <el-table-column
          min-width="100"
          :show-overflow-tooltip="true"
          label="是否关联">
          <template slot-scope="scope">
            <span>{{scope.row.yundingCode ? '是' : '否'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="关联编号">
          <template slot-scope="scope">
            <span>{{scope.row.yundingCode ? scope.row.yundingCode : '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-bind ref='bind' v-if="bindLoading" @refreshDataList="getDataList"/>
  </div>
</template>
<script>
import { hasBindStatus } from '@/utils/dict'
import gtPagination from '@/components/gt-pagination'
import gtBind from './bindOrUpdate'
export default {
  name:'intelligent_list',
  data(){
    return{
      hasBindStatus,
      companyList: [],
      storeList: [],
      dataList: [],
      dataListLoading: false,
      storeListLoading: false,
      deleteBindLoading: false,
      bindLoading:false,
      intelligent:{
        companyId:'',
        key:null,
        hasBind:''
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
    }
  },
  components: {
    gtPagination,
    gtBind
  },
  created(){
    //获取企业列表
    this.getCompanyList()
    //获取数据列表
    this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: this.pageSize,
          currentPage: this.currentPage,
          ...this.intelligent
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
    bind_or_update(row,type){
      this.bindLoading = true
      this.$nextTick(() => {
        this.$refs.bind.init(row,type)
      })
    },
    deleteBind(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定要进行删除操作吗？',
        confirm: async () => {
          const { data } = await this.$http({
            url: this.$http.adornUrl(`/mop/yunding/store/unBind/${id}`),
            method: 'post',
          })
          if (data && data.code === 0) {
            this.$message.success('删除成功！')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
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
        this.$refs['intelligent'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  },
}
</script>
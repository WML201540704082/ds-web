<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form label-width="120px" :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店名称/编码" prop='keys'>
          <el-input clearable v-model="form.keys" placeholder="请输入门店名称/编码"></el-input>
        </el-form-item>
        <el-form-item label="所属企业" prop='companyId'>
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
        <el-form-item class="search-toolbar">
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
          prop="orderNo"
          min-width="100"
          :show-overflow-tooltip="true"
          label="订单编号">
        </el-table-column>
        <el-table-column
          prop="orderTime"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="订单时间">
        </el-table-column>
        <el-table-column
          prop="storeCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
          <template slot-scope="scope">
            <span>{{scope.row.storeCode}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
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
          prop="leagueBrand"
          :show-overflow-tooltip="true"
          min-width="120"
          label="加盟品牌">
        </el-table-column>
        <el-table-column
          prop="serviceEndDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="服务时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterStatus, filterColor, fileDownload } from '@/utils'

export default {
  name:'store-renewalRecord-list',
  data () {
    return {
      pageC: 1,
      pageZ: 1000,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      form:{
        companyId: '',
        keys:null,
      },
      companyList: [],
    }
  },
  components: {
    gtPagination
  },
  created () {
    this.getDataList()
    this.selectCompany()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/companyOrder/list'),
        method: 'post',
        data: this.$http.adornData({
          size: this.pageSize,
          page: this.currentPage,
          ...this.form,
          status: 'PAID',
          type: 'PROFESSIONAL_RENEWED'
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data) {
          this.dataList = data.records
          this.total = data.total
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.total = 0
        }
      })

    },
    // 导出企业续费记录列表
    async exportExcel() {
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/companyOrder/export',true),
        method:'post',
        responseType: 'arraybuffer',
        selfHandleError: true,
        data:this.$http.adornData({
          ...this.form,
          size:10000,
          page: 0,
        })
      })
      fileDownload(data, '企业门店续费.xls')
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

    // 分页
    pagination_event(val) {
      this.size = val.size
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['form'].resetFields()
      }
      this.pageSize = 20
      this.currentPage = 1
      this.getDataList()
    },
  }
}
</script>



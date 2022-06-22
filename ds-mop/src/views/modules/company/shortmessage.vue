<template>
    <div class="mod-store mop_company_shortmessage">
        <el-card>
            <!-- 查询条件 -->
            <el-form :model="shortmessage" :inline="true" :link="true" ref="shortmessage" class="mode-form-line1" @keyup.enter.native="resetForm('search')">
                <el-form-item label="企业名称" prop='companyId'>
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
                <el-form-item label="法人" prop='legalPerson'>
                  <el-input v-model="shortmessage.legalPerson" placeholder="请选择法人" clearable></el-input>
                </el-form-item>
                <el-form-item label="联系电话" prop='phone'>
                  <el-input v-model="shortmessage.phone" placeholder="请选择电话" clearable></el-input>
                </el-form-item>
                <el-form-item style="display: inline-block;float: right;">
                    <gt-button type="search" @click.native="resetForm('search')"/>
                    <gt-button type="reset" @click.native="resetForm('reset')"/>
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
              width="55"
              label="序号">
              <template slot-scope="scope">
                  <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              min-width="100"
              label="操作">
              <template slot-scope="scope">
                <el-button class="nopadding" type="text" size="small" @click="shortmessageViewHandle(scope.row.companyId)">查看</el-button>
                <span>|</span>
                <el-button class="nopadding" type="text" size="small" @click="recharge(scope.row.companyId)">充值</el-button>
              </template>
            </el-table-column>
            <el-table-column
              prop="companyName"
              min-width="150"
              :show-overflow-tooltip="true"
              label="企业名称">
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
              label="电话">
            </el-table-column>
            <el-table-column
              prop="address"
              min-width="180"
              :show-overflow-tooltip="true"
              label="企业地址">
            </el-table-column>
            <el-table-column
              prop="amount"
              min-width="100"
              :show-overflow-tooltip="true"
              label="短信余量">
            </el-table-column>
          </el-table>
          <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
        </el-card>
    </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { getAccountList,getCompanyList, exportAccountList } from '@/service/company'
import { fileDownload } from '@/utils'
export default {
  name:'company-shortmessage',
  data(){
    return{
      companyList:[],
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      shortmessage:{
        legalPerson: null,
        phone: null,
        companyId: ''
      },
      companyId:[],//企业名称
    }
  },
  components: {
    gtPagination
  },
  created () {
    this.getDataList(),
    this.getCompanyList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getAccountList({
        ...this.shortmessage,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 导出短信余量
    async exportExcel() {
      const { data, headers } = await exportAccountList({
        ...this.shortmessage,
        companyId: this.shortmessage.companyId || null,
        size: 10000,
        page: 0
      })
      fileDownload(data, '短信余量.xls')
    },
    // 获取企业下拉列表
    async getCompanyList() {
      const { data } = await getCompanyList({
        pageSize:10000,
        currentPage: 1
      })
      if (data.code === 0) {
        this.companyList = data.data.records
      } else {
        this.companyList = []
        this.$message.error('获取企业列表失败')
      }
    },
    // 查看
    shortmessageViewHandle (id){
      this.$router.push({name:'message-view',query:{id}})
    },
    //充值
    recharge (id){
      this.$router.push({name:'recharge',query:{id}})
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['shortmessage'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    }
  }
}
</script>

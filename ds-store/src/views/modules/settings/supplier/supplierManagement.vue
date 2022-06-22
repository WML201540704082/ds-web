<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="supplierMgt" :model="supplierMgt" @keyup.enter.native="resetForm('search')">
        <el-form-item label="供应商名称" prop="name">
          <el-input v-model="supplierMgt.name" placeholder="请输入供应商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人/电话" prop='keyWord' label-width="90px">
          <el-input v-model="supplierMgt.keyWord" placeholder="请输入联系人/电话" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" txt="新增供应商" @click.native="() => newSupplier()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-if="needRefresh"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="deleteSupplier(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="供应商名称">
        </el-table-column>
        <el-table-column
          prop="linkName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人电话">
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="联系地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}` || '--'}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-newSupplier v-if="newSupplierVisible" ref="newSupplier" @refreshNewSupplierDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtNewSupplier from './newSupplier'
import { getStore } from '@/utils/storage'
import * as api from '@/service/stock'
export default {
  name: 'stockManagement-supplier-supplierManagement',
  components: {
    gtNewSupplier,gtPagination
  },
  data(){
    return{
      dataList:[],
      needRefresh: true,
      dataListLoading:false,
      newSupplierVisible:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      supplierMgt:{
        name: null,
        keyWord: null,
      },
    }
  },
  created(){
    //获取companyId
    const { companyId } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.companyId = companyId
    // 供应商列表详情
    this.getDataList()
  },
  methods:{
    //新增供应商
    newSupplier(){
      this.newSupplierVisible = true
      this.$nextTick(() => {
        this.$refs.newSupplier.init()
      })
    },
    //供应商列表详情
    async getDataList() {
      this.dataListLoading = true
      const { data } =  await api.relateSupplierList({
        page:this.currentPage,
        size:this.pageSize,
        ...this.supplierMgt
      })
      this.dataListLoading = false
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
    },
    async deleteSupplier(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该单据',
        confirm: async () => {
          const { data } = await api.deleteSupplier(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
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
    resetForm(type) {
      if (type==='reset') {
        this.$refs['supplierMgt'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

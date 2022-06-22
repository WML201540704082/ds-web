<template>
  <section class="page-goods-tea mod-store">

    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line" label-width="60px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">

         <el-form-item label="门店名称" prop="key">
          <el-input v-model="filterForm.key" placeholder="请输入门店名称" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card>
        <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        ref="goodsTableList"
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="100"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          align="center"
          width="180"
          :show-overflow-tooltip="true"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="detailStores(scope.row.id)">查看</el-button>
          </template>
          </el-table-column>
        <el-table-column
          prop="name"
          min-width="60"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
      </el-table>
    <gt-pagination :total="total" :currentPage="currentPage-1" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </section>    
</template>
<script>
import * as api from '@/service/goods'
import gtPagination from '@/components/gt-pagination'

export default {
  name: 'goods-store-tea',
  data () {
    return {
      filterForm:{
        key:null,
        status:'',
        serviceBeginDate:null,
        serviceEndDate:null,
        soonExpire: null
      },
      total: 0,
      pageSize: 20,
      currentPage: 1,
      editId: null,
      dataList:[],
      dataListLoading: false,

    }
  },
  components: {
    gtPagination
  },
  async created(){
      this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStoresList({
        ...this.filterForm,
        currentPage: this.currentPage,
        pageSize: this.pageSize,
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.$message.error(data.msg)
        this.dataList = []
        this.total = 0
      }
      this.dataListLoading = false
    },
    
    detailStores(id){
      this.$router.push({name:'goods-storetea-view', query: {id}})
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage+1
      this.getDataList()
    },
  },
}
</script>
<style lang="scss">
  .page-goods-tea{
    .edit-input{
      .el-input__inner{
        width: 90px;
      }
      padding: 0 !important;
    }
  }
</style>
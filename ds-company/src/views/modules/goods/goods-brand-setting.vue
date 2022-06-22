<template>
  <section class="page-goods-brand mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line" label-width="60px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">

        <el-form-item label="商品品牌" prop="key">
          <el-input v-model="filterForm.key" placeholder="" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <el-card class="mode-store-table">
      <gt-border-button type="create" @click.native="() => addOrUpdateHandle()" style="float: left;margin-top: -5px;margin-bottom: 7px;"/>
      <!-- table列表 -->
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        v-table-height
        :stripe="true"
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="addOrUpdateHandle(scope.row)">编辑</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="160"
          :show-overflow-tooltip="true"
          label="品牌名称">
        </el-table-column>
        <!-- <el-table-column
          prop="sequence"
          min-width="120"
          style="text-align:center"
          label="排序">
        </el-table-column> -->
      </el-table>
      <el-col :span="24" class="toolbar" style="padding: 0">
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-col>
    </el-card>
    <add-or-update ref="addOrUpdate" @refreshBrand="getDataList"></add-or-update>
  </section>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import addOrUpdate from './components/goods-brand-setting-modal'
import * as api from '@/service/goods'
export default {
  name: 'goods-goods-brand-setting',
  data () {
    return {
      filterForm: {
        key: null,
      },
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      editId: null
    }
  },
  components: {
    gtPagination, addOrUpdate
  },

  async created() {
    // 获取商品列表
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.brandsPage({
        ...this.filterForm,
        page: this.currentPage,
        size: this.pageSize
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

    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },

    // 修改
    addOrUpdateHandle (data) {
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(data)
      })
    },

    // 删除
    deleteRow(id){
        this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该品牌',
        confirm: async () => {
          const {data} = await api.deleteBrandPercent(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.getDataList()
          } 
          else {
            this.$message.error("已关联该商品，无法执行操作")
            this.$easyConfirm.hide()
            // this.$message.error(data.msg)
          }
        }
      })
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  .page-goods-brand{
    .edit-input{
      .el-input__inner{
        width: 90px;
      }
      padding: 0 !important;
    }
  }

</style>


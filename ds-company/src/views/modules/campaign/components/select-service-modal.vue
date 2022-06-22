<template>
<el-dialog
  title="选择服务"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" label-width="120px" @submit.native.prevent="resetForm('search')">
    <el-form-item label="商品名称" prop="name">
      <el-input v-model="filterForm.name" placeholder="商品名称"></el-input>
    </el-form-item>
    <el-form-item style="display: inline-block;float: right;" v-if="isAuth('campaign:company:product:list')">
      <gt-button type="search" @click.native="resetForm('search')"/>
      <gt-button type="reset" @click.native="resetForm('reset')"/>
    </el-form-item>
  </el-form>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    max-height="360"
    ref="goodsTableList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;min-height: 300px;">
    <el-table-column
      type="selection"
      width="60">
    </el-table-column>
    <el-table-column
      prop="index"
      width="60"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      min-width="120"
      :show-overflow-tooltip="true"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="retailPrice"
      min-width="120"
      :show-overflow-tooltip="true"
      label="零售价">
      <template slot-scope="scope">
        <span v-if="scope.row.retailPrice">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
  </el-table>
  <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import * as api from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import _ from 'lodash'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        name: null,
        type: 'SERVICE',
        ownership: 'COMPANY',
      },
      currentPageSelect: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      selectedList: [],
      changePage: false
    }
  },
  components: {
    gtPagination
  },
  methods: {
    async init (goodsList = [], filter = {}) {
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        name: null,
        type: 'SERVICE',
        saleStatus: 'ON',
        ownership: 'COMPANY',
        ...filter
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      // 查询商品列表
      if(this.isAuth('company:product:list')){
        await this.getGoodsList()
      }
      this.dataListLoading = false
    },
    // 获取商品列表
    async getGoodsList() {
      const { data } = await api.selectPro({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => item.id == row.id)
              if (currentRow) {
                this.$refs.goodsTableList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
    },

    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 获取商品选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => ele.id == item.id)
        })
        const select = newList.concat(pushList)
        this.selectedList = select
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    // 表单提交
    dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        this.$emit('refreshData', this.selectedList)
        this.visible = false
      }else{
        this.visible = true
        this.$message.warning('请先选择商品')
      }

    },

    // 重置 搜索
    resetForm(type) {
      this.currentPage = 0
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.changePage = true
      this.getGoodsList()
    },
  }
}
</script>
<style lang="scss">
  .select-goods-dailog{
    .gt-pagination{
      text-align: right;
    }
  }
</style>

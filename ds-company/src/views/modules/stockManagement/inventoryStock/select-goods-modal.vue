<template>
<el-dialog
  title="选择商品"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="80px" :model="filterForm" @keyup.enter.native="resetForm('search')">
    <el-form-item label="商品信息" prop="key">
      <el-input v-model="filterForm.key" placeholder="商品名称/条码"></el-input>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-form-item prop="category1Id">
        <el-select :width="100" v-model="filterForm.category1Id" @change="getSubCategoryList" placeholder="商品一级分类">
          <el-option
          v-for="item in mainCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="category2Id">
        <el-select :width="100" v-model="filterForm.category2Id" placeholder="商品二级分类">
          <el-option
          v-for="item in subCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
    </el-form-item>
    <el-form-item label="商品品牌" prop="brandId">
      <el-select v-model="filterForm.brandId" placeholder="请选择商品品牌" clearable>
        <el-option
          v-for="item in brands"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:stock:list')">
      <gt-button type="search" @click.native="resetForm('search',isStock)"/>
      <gt-button type="reset" @click.native="resetForm('reset',isStock)"/>
    </el-form-item>
  </el-form>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    height="320"
    ref="goodsTableList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;margin-top:-10px">
    <el-table-column
      type="selection"
      width="60">
    </el-table-column>
    <el-table-column
      prop="index"
      min-width="60"
      label="序号">
      <template slot-scope="scope">
        <span>{{scope.$index + 1}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="barcode"
      min-width="130"
      :show-overflow-tooltip="true"
      label="商品条码">
    </el-table-column>
    <el-table-column
      prop="productName"
      align="center"
      min-width="130"
      :show-overflow-tooltip="true"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="category1Name"
      min-width="120"
      :show-overflow-tooltip="true"
      label="一级分类">
    </el-table-column>
    <el-table-column
      prop="category2Name"
      min-width="120"
      :show-overflow-tooltip="true"
      label="二级分类">
    </el-table-column>
    <el-table-column
      prop="brandName"
      min-width="100"
      :show-overflow-tooltip="true"
      label="商品品牌">
    </el-table-column>
    <el-table-column
      prop="spec"
      min-width="130"
      :show-overflow-tooltip="true"
      label="规格">
    </el-table-column>
    <el-table-column
      prop="quantity"
      min-width="100"
      v-if="isStock"
      :show-overflow-tooltip="true"
      label="库存">
      <template slot-scope="scope">
        <span>
          {{scope.row.quantity}}<span v-if="scope.row.productType == 'BULK'">kg</span>
        </span>
      </template>
    </el-table-column>
    <el-table-column
      prop="costPrice"
      min-width="90"
      :show-overflow-tooltip="true"
      label="成本价"
      v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
      <template slot-scope="scope">
        <span>{{priceNum(scope.row.costPrice)}}</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="retailPrice"
      min-width="90"
      :show-overflow-tooltip="true"
      label="零售价"
      v-if="newStore == 'false' || (newStore == 'true' && companyRoleName != '仓库')">
      <template slot-scope="scope">
        <span>{{priceNum(scope.row.retailPrice)}}</span>
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
import * as api from '@/service/stock'
import {getMainCategory, getSubCategory } from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import { brandsList } from '@/service/goods'
import _ from 'lodash'
import { getStore } from '@/utils/storage'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      isStock: true,
      filterForm:{
        key: null,
        category1Id: null,
        category2Id: null,
      },
      currentPageSelect: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      brands: [],
      selectedList: [],
      changePage: false
    }
  },
  components: {
    gtPagination
  },
  async created () {
    // 获取企业角色
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取品牌列表
    this.getBrandList()
  },
  methods: {
    async init (goodsList = [], type,key) {
      // goodsList = []
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        key,
        category1Id: null,
        category2Id: null,
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      // 获取商品分类
      const data = await getMainCategory()
      this.mainCategory = data.records
      // 查询商品列表
      await this.getGoodsList(type)
      this.dataListLoading = false
    },
    async getSubCategoryList(id) {
      this.category2Id = null
      this.subCategory = []
      if (id) {
        const data = await getSubCategory(id)
        this.subCategory = data.records
      }
    },
    // 获取品牌列表
    async getBrandList() {
      const { data } = await brandsList()
      if (data.code === 0) {
        this.brands = data.data
      } else {
        this.brands = []
        this.$message.error(data.msg)
      }
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
      // this.$emit('refreshData', this.selectedList)
    },
    // 获取商品列表
    async getGoodsList(type) {
      console.log('selectList', this.selectedList)
      // 查询适用门店下商品
      let res = null
      if (type) {
        this.isStock = false
      } else {
        this.isStock = true
      }
      const { data } = await api.getStockList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records.map(item => {
          return{
            ...item,
            quantity: item.productType == 'BULK' ? item.quantity / 1000 : item.quantity,
          }
        })
        this.dataList.map(items=>{
          this.selectedList.forEach(row => {
            if(items.productId == row.productId){
              items.amount = row.amount
            }
          })
        })
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => (item.productId == row.productId && item.skuId == row.skuId))
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
    // 获取商品选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => (ele.productId == item.productId && ele.skuId == item.skuId))
        })
        const select = newList.concat(pushList)
        this.selectedList = select
        // this.$emit('refreshData', this.selectedList)
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
    resetForm(type,isStock) {
      this.currentPage = 0
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.changePage = true
      this.getGoodsList(!isStock)
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

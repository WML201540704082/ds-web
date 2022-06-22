<template>
<el-dialog
  title="选择商品"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" label-width="100px" @keyup.enter.native="resetForm('search')">
    <el-form-item label="商品名称/条码" prop="key">
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
    <el-form-item style="display: inline-block;float: right;" v-if="isAuth('store:stock:list')">
      <gt-button type="search" @click.native="resetForm('search')"/>
      <gt-button type="reset" @click.native="resetForm('reset')"/>
    </el-form-item>
  </el-form>
  <el-table
    :data="dataList"
    border
    v-loading="dataListLoading"
    :stripe="true"
    height="300"
    ref="goodsTableList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;margin-top:-10px;">
    <el-table-column
      type="selection"
      width="55">
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
      prop="barcode"
      width="130"
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
      prop="spec"
      min-width="130"
      :show-overflow-tooltip="true"
      label="规格">
    </el-table-column>
    <el-table-column
      prop="quantity"
      min-width="100"
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
      min-width="100"
      :show-overflow-tooltip="true"
      label="库存成本价"
      v-if="storeRoleName === '店长' && hasAuthorization && type !== 'require'">
      <template slot-scope="scope">
        <span v-if="scope.row.costPrice !== null">{{ priceNum(scope.row.costPrice)}}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="wholesalePrice"
      min-width="100"
      :show-overflow-tooltip="true"
      label="档案成本价"
      v-if="storeRoleName === '店长' && hasAuthorization">
      <template slot-scope="scope">
        <span v-if="scope.row.wholesalePrice !== null">{{ priceNum(scope.row.wholesalePrice)}}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="retailPrice"
      min-width="90"
      :show-overflow-tooltip="true"
      label="零售价">
      <template slot-scope="scope">
        <span>
          {{priceNum(scope.row.retailPrice)}}
        </span>
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
import { getCompanyStockList, getStockList } from '@/service/stock'
import {getMainCategory,getSubCategory } from '@/service/goods'
import _ from 'lodash'
import gtPagination from '@/components/gt-pagination'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      storeRoleName: '',
      hasAuthorization: '',
      type: null,
      filterForm:{
        key: null,
        category2Id: null,
        category1Id: null,
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
  created () {
    const { storeRoleName = '', hasAuthorization } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
  },
  methods: {
    async init (goodsList = [], type) {
      // goodsList = []
      this.type = type
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        key: null,
        category2Id: null,
        category1Id: null,
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      if (goodsList.length === 0) {
        // 获取商品分类
        if(this.isAuth('product:category:select')){
          const data = await getMainCategory()
          this.mainCategory = data.records
        }
      }
      // 查询商品列表
      if(this.isAuth('store:stock:list')){
        await this.getGoodsList()
      }
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
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 获取商品列表
    async getGoodsList() {
      let info = null
      if (this.type === 'require') {
        info = await getCompanyStockList({
          ...this.filterForm,
          size: this.pageSize,
          page: this.currentPage
        })
      } else {
        info = await getStockList({
          ...this.filterForm,
          size: this.pageSize,
          page: this.currentPage
        })
      }

      const { data } = info

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

        // this.selectedList.forEach(o=>{
        //   o.id = null
        // })
        let selectedList = this.selectedList
        if (this.type === 'require') {
          selectedList = this.selectedList.map(item => {
            return {
              ...item,
              costPrice: item.wholesalePrice
            }
          })
        }
        this.$emit('refreshData', selectedList)
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

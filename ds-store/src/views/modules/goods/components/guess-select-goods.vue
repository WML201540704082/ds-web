<template>
<el-dialog
  title="选择商品"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="80px" :model="filterForm"  @keyup.enter.native="resetForm('search')">
      <el-form-item label="商品信息" prop="key">
        <el-input v-model="filterForm.key" placeholder="请输入商品名称/条码"></el-input>
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
      <el-form-item label="商品分类" v-if="isAuth('campaign:product:category:select')">
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
        <el-form-item prop="category2Id" v-if="isAuth('campaign:product:category:select:parentId')">
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
      <el-form-item style="display: inline-block;float: right;" v-if="isAuth('company:stock:list')">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height="320"
      ref="goodsTableList"
      @selection-change="handleSelectionChange"
      @row-dblclick="doubleClick"
      style="width: 100%;margin-top:-10px;">
      <el-table-column
        type="selection"
        header-align="center"
        :selectable="(row, index) => {
          return row.saleChannel !== 1
        }"
        align="center"
        width="50">
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
        prop="name"
        align="center"
        min-width="130"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="barcodes"
        min-width="130"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="saleChannel"
        align="center"
        min-width="130"
        :show-overflow-tooltip="true"
        label="销售渠道">
        <template slot-scope="scope">
          <span>{{scope.row.saleChannel === 0 ? '线上，线下' : (scope.row.saleChannel === -1 ? '线上' : '线下' )}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="firstCategory"
        min-width="120"
        :show-overflow-tooltip="true"
        label="一级分类">
      </el-table-column>
      <el-table-column
        prop="category"
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
        prop="retailPrice"
        min-width="90"
        :show-overflow-tooltip="true"
        label="零售价">
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
import gtSubtitle from '@/components/gt-sub-title'
import * as api from '@/service/stock'
import {getMainCategory, getSubCategory,getGoodsList } from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import { brandsList } from '@/service/goods'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  props: ['type'],
  data(){
    return{
      visible: false,
      dataList: [],
      storeRoleName: '',
      hasAuthorization: false,
      dataListLoading: false,
      filterForm:{
        storeId: null,
        key: null,
        category1Id: null,
        category2Id: null,
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      brands: [],
      selectedList: [],
      changePage: true,
    }
  },
  components: {
    gtPagination, gtSubtitle
  },
  // props:['goodsAddName'],
  async created(){
    // 获取商品一二级分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
    this.getBrandList()
    // this.getGoodsList()
    //限制成本价显示
    const { storeRoleName = '', hasAuthorization, storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeRoleName = storeRoleName
    this.hasAuthorization = hasAuthorization
    this.storeType = storeType
  },
  methods:{
    init(storeId, selectedList = [],key,outType) {
      this.changePage = true
      this.visible = true
      this.filterForm.storeId = storeId
      this.selectedList = selectedList
      this.outType = outType
      // 重置搜索条件
      this.filterForm = {
        storeId,
        key,
        brandId: null,
        category1Id: null,
        category2Id: null,
      }
      this.getGoodsList()
    },
    //移除一行
    deleteSign(row){
      const { skuId } = row
      let selectIndex = 0
      this.selectedList.forEach((item, index) => {
        if (item.skuId === skuId) {
          selectIndex = index
        }
      })
      const newRow = this.dataList.find(ele => ele.skuId === skuId)
      this.selectedList.splice(selectIndex, 1)
      if (newRow) {
        this.$refs.goodsTableList.toggleRowSelection(newRow)
      } else {
      }
    },
    //商品分类
    async getSubCategoryList(id) {
      this.filterForm.category2Id = ''
      this.subCategory = []
      if (id) {
        if(this.isAuth('product:category:select:parentId')){
          const data = await api.getSubCategory(id)
          if (data && data.records) {
            this.subCategory = data.records
          }
        }
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
    // 获取商品列表
    async getGoodsList() {
      const { data } = await getGoodsList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage,
        ownership: (this.storeType == 'NEW_RETAIL_AND_DRINK' || this.storeType == 'NEW_RETAIL') ? 'COMPANY' : ''
      })
      if (data.code === 0) {
        this.dataList = data.data.records
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
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    //双击填入
    doubleClick(row){
      if (row.saleChannel == 1) {
        return
      }
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
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
<style lang="scss" scoped>
.footer_ture{
	text-align:center;
}
.inputs1 input {
  width: 100%!important;
	margin-left: -12px
}
</style>

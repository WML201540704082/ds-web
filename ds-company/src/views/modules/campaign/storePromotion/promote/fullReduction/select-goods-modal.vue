<template>
<el-dialog
  title="选择商品"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
  <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" label-width="120px" @submit.native.prevent="resetForm('search')">
    <el-form-item label="商品名称/条码" prop="key">
      <el-input v-model="filterForm.key" placeholder="商品名称/条码"></el-input>
    </el-form-item>
    <el-form-item label="商品品牌" prop="brandId">
      <el-select v-model="filterForm.brandId" filterable placeholder="请选择商品品牌" clearable>
        <el-option label="全部" :value="null" ></el-option>
        <el-option
          v-for="item in brands"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="商品分类">
      <el-form-item prop="firstCategoryId">
        <el-select v-model="filterForm.firstCategoryId" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in mainCategory"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="categoryId" >
        <el-select v-model="filterForm.categoryId" placeholder="请选择二级分类" @change="changeSecondCatetory" clearable>
        <el-option label="全部" value="" ></el-option>
          <el-option
          v-for="item in subCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="thirdCategoryId" >
        <el-select v-model="filterForm.thirdCategoryId" placeholder="请选择三级分类" clearable>
        <el-option label="全部" value="" ></el-option>
          <el-option
          v-for="item in thirdCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
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
    @selection-change="handleSelectionChange"
    @row-dblclick="doubleClick"
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
      prop="barcodes"
      min-width="150"
      :show-overflow-tooltip="true"
      label="商品条码">
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      min-width="150"
      :show-overflow-tooltip="true"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="brandName"
      align="center"
      min-width="150"
      :show-overflow-tooltip="true"
      label="商品品牌">
    </el-table-column>
    <el-table-column
      prop="firstCategory"
      min-width="150"
      :show-overflow-tooltip="true"
      label="一级分类">
    </el-table-column>
    <el-table-column
      prop="category"
      min-width="150"
      :show-overflow-tooltip="true"
      label="二级分类">
    </el-table-column>
    <el-table-column
      prop="thirdCategory"
      min-width="150"
      :show-overflow-tooltip="true"
      label="三级分类">
    </el-table-column>
    <el-table-column
      prop="costPrice"
      min-width="150"
      :show-overflow-tooltip="true"
      label="成本价">
      <template slot-scope="scope">
        <span v-if="scope.row.costPrice !== null">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="retailPrice"
      min-width="150"
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
  <ensure-modal ref="ensureModal" @refresh="refresh"/>
</el-dialog>
</template>

<script>
import * as api from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import { checkFullProduct } from '@/service/campaign'
import ensureModal from '../ensure-modal'
import _ from 'lodash'
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        key: null,
        firstCategoryId: '',
        categoryId: '',
        thirdCategoryId: '',
      },
      currentPageSelect: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      thirdCategory: [],
      brands: [],
      selectedList: [],
      changePage: false,
      startTime: '',
      endTime: ''
    }
  },
  components: {
    gtPagination,
    ensureModal
  },
  methods: {
    async init (goodsList = [],startTime,endTime,storeIds,isFull) {
      this.startTime = startTime
      this.endTime = endTime
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        key: null,
        // type: 'ENTITY',
        ownership: 'COMPANY',
        saleStatus: 'ON',
        storeIds,
        firstCategoryId: null,
        categoryId: null,
        thirdCategoryId: null,
      }
      this.isFull = isFull
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      // 获取商品分类
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainCategory = data.records
      }
      // 查询商品列表
      if(this.isAuth('company:product:list')){
        await this.getGoodsList()
      }
      // 获取品牌列表
      this.getBrandList()

      this.dataListLoading = false
    },
    //获取二级分类
    async getSubCategoryList(id) {
      this.filterForm.categoryId = ''
      this.subCategory = []
      this.filterForm.thirdCategoryId = ''
      this.thirdCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },
    //获取三级分类
    async changeSecondCatetory(id) {
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },
    // 获取品牌列表
    async getBrandList() {
      const { data } = await api.brandsList()
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
    },
    // 获取商品列表
    async getGoodsList() {
      const { data } = await api.selectPro({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage,
        saleChannel:this.isFull == 'full' ? 1 : null,
        type:this.isFull == 'full' ? 'ENTITY' : null
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {

              const currentRow = this.dataList.find(item => item.id == row.productId)
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
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    // 表单提交
    async dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        /**
         * 判断是否有不符合条件的商品
         */
        const { data } = await checkFullProduct({
          productIds: this.selectedList.map(item => item.id),
          storeIds: this.filterForm.storeIds.split(","),
          startTime: this.startTime,
          endTime: this.endTime
        })
        if (data.code === 0) {
          if (data.data && data.data.length > 0) {
            // 已有活动的商品列表
            const products = data.data
            this.products = products
            if (this.products[0].promotionType) {
              this.$nextTick(() => {
                this.$refs.ensureModal.init(products,this.selectedList, 'modal','full')
              })
            }
          } else {
            this.$emit('refreshData', this.selectedList)
            this.visible = false
          }
          this.$emit('refreshData', this.selectedList)
          this.visible = false
        }else{
          this.visible = true
          this.$message.error(data.msg)
        }
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
    // 更新数据
    refresh(list) {
      this.$emit('refreshData', list)
      this.visible = false
    }
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

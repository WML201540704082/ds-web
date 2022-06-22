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
    <el-form-item label="商品分类">
      <el-form-item prop="firstCategoryId">
        <el-select :width="100" v-model="filterForm.firstCategoryId" @change="getSubCategoryList" placeholder="商品一级分类">
          <el-option
          v-for="item in mainCategory"
          :key="item.id"
          :label="item.name"
          :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item prop="categoryId">
        <el-select :width="100" v-model="filterForm.categoryId" placeholder="商品二级分类">
          <el-option
          v-for="item in subCategory"
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
    height="300"
    ref="goodsTableList"
    @row-dblclick="doubleClick"
    @selection-change="handleSelectionChange"
    style="width: 100%;">
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
      prop="barcodes"
      width="120"
      :show-overflow-tooltip="true"
      label="商品条码">
    </el-table-column>
    <el-table-column
      prop="name"
      align="center"
      width="120"
      :show-overflow-tooltip="true"
      label="商品名称">
    </el-table-column>
    <el-table-column
      prop="firstCategory"
      width="100"
      :show-overflow-tooltip="true"
      label="一级分类">
    </el-table-column>
    <el-table-column
      prop="category"
      width="100"
      :show-overflow-tooltip="true"
      label="二级分类">
    </el-table-column>
    <el-table-column
      prop="costPrice"
      :show-overflow-tooltip="true"
      label="成本价">
      <template slot-scope="scope">
        <span v-if="scope.row.costPrice !== null">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
        <span v-else>--</span>
      </template>
    </el-table-column>
    <el-table-column
      prop="retailPrice"
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
        key: null,
        categoryId: null,
        firstCategoryId: null,
      },
      currentPageSelect: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      selectedList: [],
      changePage: false,
      idx: null,
      type: null //从哪里点过来的
    }
  },
  components: {
    gtPagination
  },
  methods: {
    async init (goodsList = [],idx = null,type = null) {
      this.visible = true
      this.idx = idx  //特卖需要的
      this.type = type
      // 重置搜索条件
      this.filterForm = {
        key: null,
        categoryId: null,
        firstCategoryId: null,
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      if (goodsList.length === 0) {
        // 获取商品分类
        if(this.isAuth('campaign:product:category:select')){
          const data = await api.getMainCategory()
          this.mainCategory = data.records
        }
      }
      // 查询商品列表
      if(this.isAuth('company:product:list')){
        await this.getGoodsList()
      }
      this.dataListLoading = false
    },
    async getSubCategoryList(id) {
      this.categoryId = null
      this.subCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        this.subCategory = data.records
      }
    },
    // 获取商品列表
    async getGoodsList() {
      console.log('selectList', this.selectedList)
      const { data } = await api.getGoodsList({
        ...this.filterForm,
        saleStatus: 'ON',
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
    // 获取商品选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => ele.id == item.id)
        })
        const select = newList.concat(pushList)
        if(this.type=='specail'){//特卖
          if(select.length>0&&select.length<=2){
            console.log('少于或等于2')
            this.selectedList = select
          }else{
            console.log('超过两个')
            var array = []
            array.push(select[select.length-2],select[select.length-1])
            this.selectedList = array
            this.$message.warning('至多只能选择两个商品,默认保存最后选择的两个商品')
          }
        }else{ //非特卖
          this.selectedList = select
        }
      }
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    // 表单提交
    dataFormSubmit () {
      if(this.type=='products'){
        this.products()
      }else{
        if(this.selectedList&&this.selectedList.length>0){
          if(this.type=='specail'){
            var obj = {
              list: this.selectedList,
              index: this.idx,
              type: this.type
            }
            console.log(obj.list)
            this.$emit('refreshData', obj)
          }else{
            this.$emit('refreshData', this.selectedList)
          }
          this.visible = false
        }else{
          this.visible = true
          this.$message.warning('请先选择商品')
        }
      }

    },
    // 更多特卖商品
    products(){
      if(this.selectedList&&this.selectedList.length>0){
        if(this.selectedList.length==2){
          var obj = {
            list: this.selectedList,
            index: this.idx,
            type: this.type
          }
          this.$emit('refreshData', obj)
          this.visible = false
        }else{
          this.visible = true
          this.$message.warning('每组必须为两个商品')
        }
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

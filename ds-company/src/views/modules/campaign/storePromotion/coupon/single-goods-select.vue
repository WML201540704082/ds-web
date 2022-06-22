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
    max-height="360"
    ref="goodsTableList"
    @current-change="clickChange"
    style="width: 100%;min-height: 300px;">
    <el-table-column
      label="选择"
      width="60px">
      <template slot-scope="scope">
        <el-radio  v-model="selectedObj.id" :label="scope.row.id"><i></i></el-radio>
        <!-- <span class="radio-select" :class="{'active': scope.row.id === selectedObj.id}"></span> -->
      </template>
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
export default {
  data () {
    return {
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        key: null,
        // type: 'ENTITY',
        ownership: 'COMPANY',
        firstCategoryId: null,
        categoryId: null
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mainCategory: [],
      subCategory: [],
      selectedObj: {
        id: ''
      }
    }
  },
  components: {
    gtPagination
  },
  methods: {
    async init (goodsList, storeIds) {
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        key: null,
        // type: 'ENTITY',
        ownership: 'COMPANY',
        saleStatus: 'ON',
        firstCategoryId: null,
        storeIds,
        categoryId: null,
      }
      this.currentPage = 0
      this.dataListLoading = true
      // 获取商品分类
      if(this.isAuth('campaign:product:category:select')){
        const data = await api.getMainCategory()
        this.mainCategory = data.records
      }
      // 查询商品列表
      if(this.isAuth('company:product:list')){
        await this.getGoodsList()
      }
      this.dataListLoading = false
    },
    // 获取二级分类
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
      const { data } = await api.selectPro({
        ...this.filterForm,
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
    },
    // 获取商品选择
    clickChange(item) {
      if (item) {
        this.selectedObj = item
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getGoodsList()
    },
    // 表单提交
    dataFormSubmit () {
      if (this.selectedObj && this.selectedObj.id) {
        this.$emit('refreshData', [this.selectedObj])
        this.visible = false
      } else {
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
      this.getGoodsList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  .select-goods-dailog{
    .gt-pagination{
      text-align: right;
    }
    .radio-select {
      display: inline-block;
      width: 16px;
      height: 16px;
      border: 1px solid #dcdcdc;
      border-radius: 8px;
      &.active {
        border: 5px solid $--color-primary;
      }
    }
  }
</style>

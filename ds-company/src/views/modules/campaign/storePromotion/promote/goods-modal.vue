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
      @row-dblclick="doubleClick"
      @selection-change="handleSelectionChange"
      style="width: 100%;">
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
        width="250"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        width="250"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="brandName"
        width="250"
        :show-overflow-tooltip="true"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="firstCategory"
        min-width="130"
        :show-overflow-tooltip="true"
        label="一级分类">
      </el-table-column>
      <el-table-column
        prop="category"
        min-width="130"
        :show-overflow-tooltip="true"
        label="二级分类">
      </el-table-column>
      <el-table-column
        prop="category"
        min-width="130"
        :show-overflow-tooltip="true"
        label="三级分类">
      </el-table-column>
      <el-table-column
        prop="retailPrice"
        min-width="150"
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
    <ensure-modal ref="ensureModal" @refresh="refresh"/>
  </el-dialog>
</template>

<script>
import { getGoodsList, getMainCategory, getSubCategory } from '@/service/goods'
import { checkProduct } from '@/service/campaign'
import ensureModal from './ensure-modal'
import gtPagination from '@/components/gt-pagination'
import moment from 'moment'
import _ from 'lodash'
export default {
  data () {
    return {
      promoteDto: {},
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        key: null,
        saleChannel: null,
        type: 'ENTITY',
        firstCategoryId: null,
        saleStatus: 'ON',
        categoryId: null,
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
    gtPagination,
    ensureModal
  },
  methods: {
    async init (goodsList = [],saleChannel,promoteDto) {
      this.promoteDto = promoteDto
      // goodsList = []
      this.visible = true
      // 重置搜索条件
      this.filterForm = {
        key: null,
        firstCategoryId: null,
        categoryId: null,
        type: 'ENTITY',
        ownership: 'COMPANY',
        saleStatus: 'ON',
        saleChannel: saleChannel.length===2 ? 0 : saleChannel.join(',')
      }
      this.currentPage = 0
      this.changePage = true
      this.selectedList = goodsList
      this.dataListLoading = true
      // 获取商品分类
      const data = await getMainCategory()
      this.mainCategory = data.records
      // 查询商品列表
      await this.getGoodsList()
      this.dataListLoading = false
    },
    async getSubCategoryList(id) {
      this.filterForm.categoryId = null
      this.subCategory = []
      if (id) {
        const data = await getSubCategory(id)
        this.subCategory = data.records
      }
    },


    // 获取商品列表
    async getGoodsList() {
      // 查询适用门店下商品
      const { data } = await getGoodsList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })

      if (data.code === 0) {
        this.dataList = data.data.records.map(item => {
          this.selectedList.forEach(row => {
            if(item.id == row.id){
              item.editId = row.editId
              item.amount = row.amount
            }
          })
          return {
            ...item,
            productName: item.name
          }
        })

        this.total = data.data.total
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => (item.id == row.id))
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
          return !this.dataList.some(ele => (ele.id == item.id))
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
        const { data } = await checkProduct({
          productIds: this.selectedList.map(item => item.id),
          promoteType:  this.promoteDto.type,
          startTime: moment(this.promoteDto.startTime).format('YYYY-MM-DD') + ' 00:00:00',
          endTime: moment(this.promoteDto.endTime).format('YYYY-MM-DD') + ' 23:59:59'
        })
        if (data.code === 0) {
          if (data.data && data.data.length > 0) {
            // 已有活动的商品列表
            const products = data.data
            this.products = products
            // if (this.products[0].promotionType) {
            //   this.$message.warning('此商品组合与已有'+ this.products[0].promotionType +'重复，请重新选择组合商品!')
            // } else {
            if (this.products[0].promotionType) {
              this.$nextTick(() => {
                this.$refs.ensureModal.init(products,this.selectedList, 'modal')
              })
            }
          } else {
            this.$emit('refreshData', this.selectedList)
            this.visible = false
          }
        } else {
          this.$message.error(data.msg)
        }


      }else{
        this.visible = true
        this.$message.warning('请先选择商品')
      }
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 重置 搜索
    resetForm(type) {
      this.currentPage = 0
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.subCategory = []
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

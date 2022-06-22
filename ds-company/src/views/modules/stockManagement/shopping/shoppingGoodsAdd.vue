<template>
  <el-dialog
    title="选择商品"
    :close-on-click-modal="false"
    width="80%"
    class="select-goods-dailog"
    :visible.sync="visible"
    append-to-body>
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" label-width="120px" @keyup.enter.native="resetForm('search')">
      <el-form-item label="商品名称/条码" prop="key">
        <el-input v-model="filterForm.key" placeholder="商品名称/条码"></el-input>
      </el-form-item>
      <el-form-item label="商品品牌" prop="brandName">
        <el-input v-model="filterForm.brandName" placeholder="商品品牌"></el-input>
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
      ref="shoppingTableList"
      @selection-change="handleSelectionChange"
      @row-dblclick="doubleClick"
      style="width: 100%;margin-top:-10px">
      <el-table-column
        type="selection"
        header-align="center"
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
        prop="spuName"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="barcode"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="spec"
        min-width="100"
        :show-overflow-tooltip="true"
        label="规格">
      </el-table-column>
      <el-table-column
        prop="brandName"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品品牌">
      </el-table-column>
      <el-table-column
        prop="proposalRetailPrice"
        min-width="100"
        :show-overflow-tooltip="true"
        label="建议零售价">
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
import gtPagination from '@/components/gt-pagination'
import NP from 'number-precision'
import { getStore } from '@/utils/storage'
import _ from 'lodash'
export default {
  data(){
    return{
      visible: false,
      dataList: [],
      dataListLoading: false,
      filterForm:{
        key: null,
        brandName:null,
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      selectedList: [],
      changePage: true,
    }
  },
  components: {
    gtPagination, gtSubtitle
  },
  created(){
    //获取companyId
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    // 查询供应商下的商品
    // this.getGoodsList()
  },
  methods:{
    init(customerId,selectedList = [],key) {
      this.changePage = true
      this.visible = true
      this.customerId = customerId
      this.selectedList = selectedList
      // 重置搜索条件
      this.filterForm = {
        customerId:customerId,
        key,
        brandName: null,
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
        this.$refs.shoppingTableList.toggleRowSelection(newRow)
      } else {
        // this.$emit('changeSelect', this.selectedList)
      }
    },
    // 获取商品列表
    async getGoodsList() {
      if (!this.filterForm.customerId) {
        return
      }
      this.dataListLoading = true
      // 查询供应商下的商品
      const { data } = await api.getCustomerSkuList({
        ...this.filterForm,
        customerId:this.customerId,
        size: this.pageSize,
        page: this.currentPage+1
      })
      if (data.code === 0) {
        this.dataList = data.data ? data.data.records : []
        this.total = data.data ? data.data.total : 0
        this.$nextTick(() => {
          if (this.selectedList && this.selectedList.length > 0) {
            this.selectedList.forEach(row => {
              const currentRow = this.dataList.find(item => (item.skuId == row.skuId))
              if (currentRow) {
                this.$refs.shoppingTableList.toggleRowSelection(currentRow)
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
      this.dataListLoading = false
    },
    // 获取商品选择
    handleSelectionChange(pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.selectedList).filter(item => {
          return !this.dataList.some(ele => (ele.skuId == item.skuId))
        })
        const select = newList.concat(pushList)
        this.selectedList = select
        // this.$emit('changeSelect', this.selectedList)
      }
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.shoppingTableList.toggleRowSelection(row)
      // this.$emit('changeSelect', this.selectedList)
    },
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    // 表单提交
    dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        this.selectedList.map(item =>{
          if(!item.spuPackageId) item.spuPackageId=item.spuPackageList[0].spuPackageId;item.purchasePrice =item.spuPackageList[0].packagePurchasePrice
        })
        this.$emit('changeSelect', this.selectedList)
        this.visible = false
      }else{
        this.visible = true
        this.$message.warning('请先选择商品')
      }
    },
    // 重置 搜索
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
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

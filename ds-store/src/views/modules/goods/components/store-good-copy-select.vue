<template>
<el-dialog
  title="选择克隆商品"
  :close-on-click-modal="false"
  width="80%"
  class="select-goods-dailog"
  :visible.sync="visible"
  append-to-body>
    <el-form :inline="true" class="mode-form-line1" ref="filterForm" label-width="100px" :model="filterForm"  @keyup.enter.native="resetForm('search')">
      <el-form-item label="商品名称/条码" prop="key">
        <el-input v-model="filterForm.key" placeholder="请输入商品名称/条码"></el-input>
      </el-form-item>
      <el-form-item class="search-toolbar" style="float:right">
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
        width="140"
        :show-overflow-tooltip="true"
        label="商品条码">
      </el-table-column>
      <el-table-column
        prop="name"
        align="center"
        width="130"
        :show-overflow-tooltip="true"
        label="商品名称">
      </el-table-column>
      <el-table-column
        prop="firstCategory"
        min-width="100"
        :show-overflow-tooltip="true"
        label="一级分类">
      </el-table-column>
      <el-table-column
        prop="category"
        min-width="100"
        :show-overflow-tooltip="true"
        label="二级分类">
      </el-table-column>
      <el-table-column
        prop="thirdCategory"
        min-width="100"
        :show-overflow-tooltip="true"
        label="三级分类">
        <template slot-scope="scope">
          <span>{{scope.row.thirdCategory || '--'}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="brandName"
        min-width="100"
        :show-overflow-tooltip="true"
        label="商品品牌">
      </el-table-column>
    </el-table>
		<!-- <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { selectPro,copyStoreGoods } from '@/service/goods'
import gtPagination from '@/components/gt-pagination'
import _ from 'lodash'
export default {
  data(){
    return{
      visible: false,
      oldDataList: [],
      dataList: [],
      dataListLoading: false,
      filterForm:{
        key: null,
      },
      total: 0,
      pageSize: 20,
      currentPage: 0,
      selectedList: [],
      changePage: true,
    }
  },
  components: {
    gtPagination
  },
  async created(){
    //限制成本价显示
    const { storeType,storeId,companyId } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeType = storeType
    this.storeId = storeId
    this.companyId = companyId
  },
  methods:{
    init() {
      this.changePage = true
      this.visible = true
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
        // this.$emit('changeSelect', this.selectedList)
      }
    },
    // 获取商品列表
    async getGoodsList() {
      const { data } = await selectPro({
        ...this.filterForm,
        ownership: 'STORE',
        page: 0,
        size: 10000,
      })
      if (data.code === 0) {
        this.oldDataList = data.data.records ? data.data.records : []
        let dataList = []
        for (let i = 0; i < this.oldDataList.length; i++) {
          if (this.oldDataList[i].storeIds.indexOf(this.storeId) == -1) {
            dataList.push(this.oldDataList[i])
          }
        }
        this.dataList = dataList
        this.total = this.dataList.length
        this.changePage = false
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
    //分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getGoodsList()
    },
    //双击填入
    doubleClick(row){
      if (row.hide) {
        return
      }
      let originalList = _.cloneDeep(this.selectedList)
      originalList.push(row)
      this.selectedList = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    // 表单提交
    async dataFormSubmit () {
      if(this.selectedList&&this.selectedList.length>0){
        let newProductIds = []
        for (let i = 0; i < this.selectedList.length; i++) {
          newProductIds.push(this.selectedList[i].id)
        }
        this.newProductIds = newProductIds
        const { data } = await copyStoreGoods({
          companyId:this.companyId,
          productIds:this.newProductIds,
          storeId:this.storeId
        })
        if (data.code === 0) {
          this.$message.success('克隆成功')
          this.visible = false
          this.$emit('refreshData')
        } else {
          this.visible = true
          this.$message.error(data.msg)
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
<style lang="scss" scoped>
.footer_ture{
	text-align:center;
}
.inputs1 input {
  width: 100%!important;
	margin-left: -12px
}
</style>

<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="deposit" :model="deposit" @keyup.enter.native="resetForm('search')">
        <el-form-item label="商品名称" prop='productName'>
          <el-input v-model="deposit.productName" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品分类" v-if="isAuth('product:category:select')">
          <el-form-item prop="categoryFirstId">
            <el-select v-model="deposit.categoryFirstId" @change="getSubCategoryList" placeholder="请选择所属大类" clearable>
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
            <el-select v-model="deposit.categoryId" placeholder="请选择所属小类"  clearable>
            <el-option label="全部" value="" ></el-option>
              <el-option
              v-for="item in subCategory"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item label="商品类型" prop='productType'>
          <el-select v-model="deposit.productType" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in productType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="顾客" prop='customerId'>
          <el-select v-model="deposit.customerId" placeholder="姓名/手机号" clearable filterable>
            <el-option
              v-for="item in getCustomer"
              :key="item.id"
              :label="(item.name || '--')+'/'+(item.phone || '--')"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="index"
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewHandle(scope.row)">查看详情</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="productName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barcode"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="spec"
          align="center"
          min-width="80"
          :show-overflow-tooltip="true"
          label="规格">
          <template slot-scope="scope">
            <span>{{scope.row.spec || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="productType"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品类型">
          <template slot-scope="scope">
            <span>{{ scope.row.productType === 'ENTITY' ? '零售类商品' : '服务类商品'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryFirstName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="一级分类">
          <template slot-scope="scope">
            <span>{{scope.row.categoryFirstName || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="category"
          min-width="100"
          :show-overflow-tooltip="true"
          label="二级分类">
          <template slot-scope="scope">
            <span>{{scope.row.category || '-'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="balanceQuantity"
          min-width="100"
          label="寄存剩余数量">
          <template slot-scope="scope">
            <span>{{scope.row.balanceQuantity || 0}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="stockQuantity"
          min-width="100"
          label="库存余量">
          <template slot-scope="scope">
            <span>{{scope.row.stockQuantity || 0}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <deposit-view ref="deposit-view" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { filterStatus, filterColor } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import { productType } from '@/utils/dict'
import * as api from '@/service/stock'
import { getCustomerList } from '@/service/mycustomer'
import depositView from './depositView'
export default {
  name: 'stockManagement-deposit-list',
  data () {
    return {
      productType,
      mainCategory: [],
      subCategory: [],
      dataList: [],
      getCustomer: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      viewVisible: false,
      filterStatus,
      filterColor,
      deposit:{
        productType: null,
        productName: null,
        categoryFirstId: null,
        categoryId: null,
        customerId: null
      }
    }
  },
  components: {
    gtPagination,
    depositView
  },

  async created() {
    // 获取盘点列表
    this.getDataList()
    // 获取商品分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
    //获取顾客下拉列表
    this.getCustomerList()
  },
  methods: {
    // 获取品牌列表
    async getCustomerList() {
      const { data } = await getCustomerList({
        size: 100000,
        page: 0
      })
      if (data.code === 0) {
        this.getCustomer = data.data.records
      } else {
        this.getCustomer = []
        this.$message.error(data.msg)
      }
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getDepositList({
        ...this.deposit,
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
      this.dataListLoading = false
    },
    //商品分类
    async getSubCategoryList(id) {
      this.deposit.categoryId = ''
      this.subCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },
    viewHandle(row) {
      this.$nextTick(() => {
        this.$refs['deposit-view'].init(row)
      })
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['deposit'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>

<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line" label-width="60px" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="销售渠道" prop="saleChannel">
          <el-select v-model="filterForm.saleChannel" placeholder="请选择销售渠道" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
            v-for="item in saleChannel"
            :key="item.value"
            :label="item.label"
            :value="item.value">
            </el-option>
            <el-option label="线上+线下" :value="0" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品类别" prop="type">
          <el-select v-model="filterForm.type" placeholder="请选择销售渠道" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in (newStore == 'false' ? productType : productAllType)"
              :key="item.value"
              :label="item.label"
              :value="item.value"/>
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
            <el-select v-model="filterForm.categoryId" placeholder="请选择二级分类" v-if="isAuth('product:category:select:parentId')" clearable>
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
        <el-form-item label="商品信息" prop="key">
          <el-input v-model="filterForm.key" placeholder="商品名称/条码" clearable></el-input>
        </el-form-item>
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="filterForm.brandId" filterable placeholder="请选择商品品牌" clearable>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="销售门店" prop="storeIds">
          <el-select multiple v-model="filterForm.storeIds" placeholder="请选择销售门店" filterable clearable>
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="商品状态" prop="saleStatus">
          <el-select v-model="filterForm.saleStatus" placeholder="请选择商品状态" clearable>
            <el-option value="ON" label="启用"></el-option>
            <el-option value="OFF" label="禁用"></el-option>
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
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <gt-border-button type="adopt" class="gt-table-create" txt="采纳" @click.native="() => adopt()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        ref="goodsTableList"
        @selection-change="selectionChangeHandle"
        @row-dblclick="doubleClick"
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
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
          width="100"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <span>|</span>
            <el-button class="nopadding" type="text" size="small" @click="adopt(scope.row.id, scope.row.storeIds)">采纳</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="barcodes"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}} <span v-show="scope.row.saleStatus === 'OFF'" style="color: red;">(禁用)</span></span>
          </template>
        </el-table-column>
        <el-table-column
          prop="saleChannel"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="销售渠道">
          <template slot-scope="scope">
            <!-- <span>{{filterSale(scope.row.saleChannel)}}</span> -->
            <span>{{scope.row.saleChannel === 0 ? '线上，线下' : (scope.row.saleChannel === -1 ? '线上' : '线下' )}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="type"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, productAllType)}}</span>
          </template>
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
          prop="brand"
          min-width="100"
          :show-overflow-tooltip="true"
          label="商品品牌">
          <template slot-scope="scope">
            <span>{{scope.row.brand ? scope.row.brand.name : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="rule"
          min-width="100"
          :show-overflow-tooltip="true"
          label="积分规则">
          <template slot-scope="scope">
            <span>{{scope.row.integralPlan ? scope.row.integralPlan.name : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="成本价">
          <template slot-scope="scope">
            <span v-if="scope.row.costPrice !== null && scope.row.storeIds.length==1">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="零售价">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null && scope.row.storeIds.length==1">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeNames"
          min-width="150"
          :show-overflow-tooltip="true"
          label="在售门店">
          <template slot-scope="scope">
            <span>{{scope.row.storeNames}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-dialog-checkbox ref="checkboxs" :double="false" cancel :initSelectList="initSelectList" @list="listBox"/>

  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus, productType, productAllType, saleChannel } from '@/utils/dict'
import { getStoreList } from '@/service/systore'
import { filterStatus, fileDownload } from '@/utils'
import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import * as api from '@/service/goods'
import { getStore } from '@/utils/storage'
export default {
  name: 'goods-store-goods',
  data () {
    return {
      adoptId: null,
      initSelectList: [],
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        saleChannel: '',
        key: null,
        type: '',
        firstCategoryId: '',
        categoryId: '',
        storeIds: [],
        saleStatus: 'ON'
      },
      stores: [],
      changePage: false,
      brands: [],
      productType,
      productAllType,
      saleChannel,
      filterStatus,
      mainCategory: [],
      subCategory: []
    }
  },
  components: {
    gtPagination,
    gtDialogCheckbox
  },
  async created() {
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取商品列表
    this.getDataList()

    // 获取门店列表
    this.getStores()

    // 获取品牌列表
    this.getBrandList()

    // 获取商品分类
    const data = await api.getMainCategory()
    if (data && data.records) {
      this.mainCategory = data.records
    }
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'goods-store-view'){
        vm.reload()
      }
    })
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getGoodsList({
        ...this.filterForm,
        storeIds: this.filterForm.storeIds.join(','),
        ownership: 'STORE',
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        this.$nextTick(() => {
          if (this.dataListSelections && this.dataListSelections.length > 0) {
            this.dataListSelections.forEach(row => {
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
      this.dataListLoading = false

    },

    // 选择门店
    selectSalestore(storeList){
      this.initSelectList = storeList.map(id => {
        return {id}
      })
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.initSelectList,false)
      })
    },

    //弹框复选
    async listBox(obj){
      var obj1 = JSON.parse(obj)
      this.storeList = obj1
      var storeIds = []
      for(var i in obj1){
        storeIds.push(obj1[i].id)
      }
      // 执行单个采纳
      const { data } = await api.changeOwner({
        productIds: [this.adoptId],
        storeIds: storeIds
      })
      if (data.code === 0) {
        this.$message.success('采纳成功!')
        this.getDataList()
      } else {
        this.$message.error(data.msg)
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

    // 采纳商品
    async adopt(id, storeIds){
      this.adoptId = id
      if (id || (this.dataListSelections && this.dataListSelections.length > 0)) {
        // 单个采纳
        if (id) {
          // 选择销售门店
          this.selectSalestore(storeIds)
        } else {
          // 批量采纳
          this.$easyConfirm.show({
            title: '提示',
            content: '批量采纳的商品，销售门店为所有门店'+ '</br>' + '确定批量采纳商品吗？',
            confirm: async () => {
              // 批量采购
              const { data } = await api.changeOwner({
                productIds: this.dataListSelections.map(item => item.id),
                storeIds: this.stores.map(store => store.id)
              })
              if (data.code === 0) {
                this.$message.success('采纳成功!')
                this.getDataList()
                this.$easyConfirm.hide()
              } else {
                this.$message.error(data.msg)
              }
            }
          })
        }
      } else {
        this.$message.warning('请先选择商品！')
      }
    },

    // 多选
    selectionChangeHandle (pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.dataListSelections).filter(item => {
          return !this.dataList.some(ele => (ele.id == item.id))
        })
        const select = newList.concat(pushList)
        this.dataListSelections = select
      }
    },

    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },

    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.stores = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    async getSubCategoryList(id) {
      this.filterForm.categoryId = ''
      this.subCategory = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.subCategory = data.records
        }
      }
    },
    // 导出商品列表
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        saleChannel: this.filterForm.saleChannel || null,
        ownership: 'STORE',
        type: this.filterForm.type || null,
        firstCategoryId: this.filterForm.firstCategoryId || null,
        categoryId: this.filterForm.categoryId || null,
        storeIds: this.filterForm.storeIds.join(','),
      }
      this.exportList(this.total, '门店商品清单', 'STORE_PRODUCT', criteria, async () => {
        const { data, headers } = await api.exportExcel({
          ...criteria,
          size: 10000,
          page: 0,
        })
        fileDownload(data, '门店商品清单.xls')
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({name:'goods-add-or-update', query: {id, type: 'store'}})
    },
    // 删除
    deleteHandle (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该商品',
        confirm: async () => {
          const { data } = await api.deleteGoods(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$easyConfirm.hide()
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'goods-store-view', query: {id}})
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.subCategory = []
        this.pageSize = 20
      }
      this.dataListSelections = []
      this.changePage = false
      this.currentPage = 0
      this.getDataList()
    },
    filterSale(saleChannel) {
      let str = []
      if (saleChannel && saleChannel.length > 0) {
        if (saleChannel.indexOf('ONLINE') > -1) {
          str.push('线上销售')
        }
        if (saleChannel.indexOf('OFFLINE') > -1) {
          str.push('线下销售')
        }
      }
      return str.join(',')
    }
  }
}
</script>


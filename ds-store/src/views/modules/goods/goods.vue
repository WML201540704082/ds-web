<template>
  <div class="mod-store page-store-goods-list">
    <el-card style="padding-bottom: 20px;" v-if="isEmptyList">
      <div class="boxCard">
        <span style="text-align:center;display:block;">您还没有添加商品信息，快去添加吧！</span>
        <span style="text-align:center;display:block;position:relative;top: 10px;color:#c0c4cc;">可通过克隆快速实现商家铺货哦</span>
      </div>
      <div style="margin-top: 20px;text-align: center;">
        <gt-button size="large" :loading="this.$store.state.loading.global" @click.native="copyGoods()" txt="开始克隆" />
        <gt-button size="large" v-if="storeRoleName === '店长'" :loading="this.$store.state.loading.global" @click.native="copy_add" txt="新增商品" />
      </div>
    </el-card>
    <div v-else>
      <el-card>
        <!-- 查询条件 -->
        <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
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
                v-for="item in ((storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') ? productHaveBulkType : productType)"
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
            <el-form-item prop="categoryId">
              <el-select v-model="filterForm.categoryId" placeholder="请选择二级分类" @change="changeSecondCatetory" clearable>
              <el-option  label="全部" value="" ></el-option>
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
          <el-form-item label="商品归属" prop="ownership">
            <el-select v-model="filterForm.ownership" placeholder="请选择商品归属" clearable>
              <el-option label="全部" value="" ></el-option>
              <el-option
              v-for="item in productOwner"
              :key="item.value"
              :label="item.label"
              :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="积分规则" v-if="integral.productStatus && integral.productIntegralType === 'PRODUCT'" prop="integralPlanId">
            <el-select v-model="filterForm.integralPlanId" placeholder="请选择积分规则" clearable>
              <el-option label="全部" :value="null" ></el-option>
              <el-option label="无" :value="-1"></el-option>
              <el-option
                v-for="item in rules"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="商品状态" prop="saleStatus">
            <el-select v-model="filterForm.saleStatus" placeholder="请选择商品状态">
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
        <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()" v-if="(storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL') || ((storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL') && selfBusinessFlag)"/>
        <gt-border-button type="export" class="gt-table-create" txt="设置销售渠道" @click.native="() => changeSaleChannel()"/>
        <gt-border-button type="export" class="gt-table-create" txt="克隆商品" @click.native="copyGoods()"/>
        <gt-border-button type="export" class="gt-table-create" txt="设置积分规则" @click.native="() => changeIntegralRule()"/>
        <!-- <gt-border-button type="export" class="gt-table-create" txt="批量修改" @click.native="() => modify()"/> -->
        <gt-border-button type="export" v-if="storeType == 'NEW_RETAIL_AND_DRINK' || storeType == 'NEW_RETAIL'" class="gt-table-create" txt="克隆门店商品" @click.native="copyStoreGoods()"/>
        <gt-border-button type="export" v-if="storeType != 'NEW_RETAIL_AND_DRINK' && storeType != 'NEW_RETAIL'" class="gt-table-create" txt="批量启用/禁用" @click.native="() => changeStatus()"/>
        <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
        <el-table
          :data="dataList"
          border
          v-loading="dataListLoading"
          ref="goodsTableList"
          @selection-change="selectionChangeHandle"
          @row-dblclick="doubleClick"
          :stripe="true"
          v-table-height
          style="width: 100%;">
          <el-table-column
            type="selection"
            header-align="center"
            :selectable="(row, index) => {
              return row.ownership === 'STORE' && row.type != 'BULK'
            }"
            align="center"
            width="50">
          </el-table-column>
          <el-table-column
            prop="index"
            width="55"
            label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            width="160"
            label="操作">
            <template slot-scope="scope">
              <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
              <span v-if="scope.row.type === 'SERVICE' || scope.row.ownership === 'STORE'">
                <span>|</span>
                <el-popover
                  class="popover"
                  placement="bottom"
                  width="100"
                  v-if="!(scope.row.ownership === 'STORE' && scope.row.storeIds.length>1)">
                  <el-button class="nopadding" slot="reference" type="text" size="small">更多</el-button>
                  <div v-if="scope.row.type === 'SERVICE'" class="buttonOne" @click="reservation(scope.row.id)">预约设置</div>
                  <div v-if="scope.row.ownership === 'STORE'" class="buttonOne" @click="addOrUpdateHandle(scope.row.id)">编辑</div>
                  <div v-if="scope.row.type !== 'SERVICE' && scope.row.ownership == 'STORE'" class="buttonOne" @click="deleteHandle(scope.row.id)" style="margin-bottom: 0">删除</div>
                </el-popover>
                <el-button v-else class="nopadding" type="text" size="small" @click="editPrice(scope.row.id,scope.row.name,scope.row.costPrice,scope.row.retailPrice)">编辑</el-button>
              </span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="code"
            min-width="120"
            :show-overflow-tooltip="true"
            label="商品代码">
          </el-table-column> -->
           <!-- <el-table-column
          prop="newCode"
          align="center"
          min-width="140"
          :show-overflow-tooltip="true"
          label="自编码">
        </el-table-column> -->
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
            min-width="150"
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
              <span>{{filterStatus(scope.row.type, productHaveBulkType)}}</span>
            </template>
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
            min-width="140"
            :show-overflow-tooltip="true"
            v-if="integral.productStatus && integral.productIntegralType === 'PRODUCT'"
            label="积分规则">
            <template slot-scope="scope">
              <span>{{scope.row.integralPlan ? scope.row.integralPlan.name : '无'}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="retailPrice"
            :show-overflow-tooltip="true"
            label="零售价">
            <template slot-scope="scope">
              <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
              <span v-else>--</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="ownership"
            align="center"
            width="120"
            :show-overflow-tooltip="true"
            label="商品归属">
            <template slot-scope="scope">
              <span>{{scope.row.ownership ? filterStatus(scope.row.ownership, productOwner) : '企业统管'}}</span>
            </template>
          </el-table-column>
        </el-table>
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-card>
    </div>
    <sale-channel-modal ref="saleChannelModal" @refreshDataList="getDataList" />
    <copy-good ref="refCopyGood" @refreshData="getDataList"/>
    <copy-store-good ref="refCopyStoreGood" @refreshData="getDataList"/>
    <integral-rule-modal ref="integralRuleModal" @refreshDataList="getDataList" />
    <batch-status ref="batchStatus" @refreshDataList="getDataList" />
    <batch-modal ref="batchModal" @refreshDataList="getDataList" />
    <gt-edit-price v-if="editPriceVisible" ref="editprice" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import copyGood from './components/good-copy-select'
import copyStoreGood from './components/store-good-copy-select'//克隆门店商品
import gtEditPrice from './components/editprice'
import gtPagination from '@/components/gt-pagination'
import saleChannelModal from './components/sale-channel'
import { storeStatus, productType, productHaveBulkType, saleChannel, productOwner } from '@/utils/dict'
import { filterStatus, fileDownload } from '@/utils'
import integralRuleModal from './components/integral-rule-modal'
import batchStatus from './components/batch-status-modal'
import batchModal from './components/batch-modify-modal'
import * as api from '@/service/goods'
import { integralPlanSelect, integralPlanDetail } from '@/service/integral'
import _ from 'lodash'
export default {
  name:'goods-goods',
  data () {
    return {
      selfBusinessFlag:null,
      dataList: [],
      editPriceVisible:false,
      dataListLoading: false,
      dataListSelections: [],
      isEmptyList: false,
      storeRoleName: '',
      brands:[],
      rules: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      integral: {
        productStatus: null,
        productIntegralType: null
      },
      filterForm:{
        ownership: '',
        type: '',
        saleChannel: null,
        key: null,
        categoryId: '',
        firstCategoryId: '',
        thirdCategoryId: '',
        saleStatus: 'ON'
      },
      changePage: false,
      filterStatus,
      productType,
      productHaveBulkType,
      productOwner,
      saleChannel,
      mainCategory: [],
      subCategory: [],
      thirdCategory: []
    }
  },
  components: {
    copyGood,
    copyStoreGood,
    gtEditPrice,
    gtPagination,
    saleChannelModal,
    integralRuleModal,
    batchStatus,
    batchModal
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'goods-view'){
        if (from.name === 'goods-add-or-update') {
          vm.getDataList()
        } else {
          vm.reload()
        }
      }
    })
  },
  created() {
    const { storeType } = JSON.parse(this.$cookie.get('store-info')) || {}
    this.storeType = storeType

    this.allList()
    this.getSelfBusiness()
  },
  methods: {
    //是否允许自营商品
    async getSelfBusiness(){
      const { data } = await  api.getSelfBusiness()
      if (data.code === 0) {
        console.log(data.data);
        this.selfBusinessFlag = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    async allList (){
      const { storeRoleName = '',  } = JSON.parse(this.$cookie.get('store-info')) || {}
      this.storeRoleName = storeRoleName
      // 获取商品分类
      const data = await api.getMainCategory()
      this.mainCategory = data.records

      // 获取商品列表
      await this.getDataList()
      if (this.dataList && this.dataList.length == 0) {
        this.isEmptyList = true
      }

      // 获取品牌列表
      this.getBrandList()

      this.getIntegralRule()

      // 获取当前积分规则
      this.getRulePlan()
    },
    // 克隆企业商品
    copyGoods (){
      this.$nextTick(() => {
        this.$refs.refCopyGood.init()
      })
    },
    //克隆门店商品
    copyStoreGoods(){
      this.$nextTick(() => {
        this.$refs.refCopyStoreGood.init()
      })
    },
    // 获取积分规则
    async getIntegralRule() {
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        this.rules = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取积分规则
    async getRulePlan() {
      const { data } = await integralPlanDetail()
      if (data.code === 0) {
        this.integral = data.data
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

    // 批量修改
    modify() {
      if (this.dataListSelections && this.dataListSelections.length > 0) {
        this.$nextTick(() => {
          this.$refs.batchModal.init(this.dataListSelections)
        })
      } else {
        this.$message.warning('请先选择商品！')
      }

    },

    // 批量设置积分规则
    changeIntegralRule () {
      if (this.integral.productStatus === false) {
        this.$easyAlert.show({
          title: '设置积分规则',
          content: '当前未开启商品积分，无法进行设置，请至 “营销中心-积分规则”页面开启商品积分方式',
          confirm: () => {
            this.$easyAlert.hide()
          }
        })
      } else if (this.integral.productIntegralType === 'ORDER') {
        this.$easyAlert.show({
          title: '设置积分规则',
          content: '当前的商品积分是按 “订单金额进行积分”，无法进行设置，请至 “营销中心-积分规则”页面修改商品积分方式',
          confirm: () => {
            this.$easyAlert.hide()
          }
        })
      } else {
        // 设置积分规则
        if(this.dataListSelections.length == 0){
          this.$message.warning('请先选择商品')
        }else{
          let pids = []
          this.dataListSelections.forEach(item => {
            pids.push(item.id)
          })
          this.$nextTick(() => {
            this.$refs.integralRuleModal.init(pids)
          })
        }
      }
    },

    // 新建商品
    copy_add(){
      this.$router.push({name:'goods-add-or-update'})
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
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getGoodsList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage,
        hasIntegralPlan: this.filterForm.integralPlanId ? (this.filterForm.integralPlanId === -1 ? false : true) : null,
        integralPlanId: this.filterForm.integralPlanId === -1 ? null : this.filterForm.integralPlanId,
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
    // 导出商品列表
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        ownership: this.filterForm.ownership || null,
        type: this.filterForm.type || null,
        categoryId: this.filterForm.categoryId || null,
        firstCategoryId: this.filterForm.firstCategoryId || null,
      }
      this.exportList(this.total, '商品清单', 'STORE_PRODUCT', criteria, async () => {
        const { data, headers } = await api.exportExcel({
          ...criteria,
          size: 10000,
          page: 0
        })
        fileDownload(data, '商品清单.xls')
      })
    },
    // change() {
    //   this.$forceUpdate()
    // },
    async getSubCategoryList(id) {
      this.filterForm.categoryId = ''
      this.subCategory = []
      this.filterForm.thirdCategoryId = ''
      this.thirdCategory = []
      if (id) {
        if(this.isAuth('product:category:select:parentId')){
          const data = await api.getSubCategory(id)
          this.subCategory = data.records
        }
      }

    },

     async changeSecondCatetory(id) {
      if (id) {
        const data = await api.getSubCategory(id);
        if (data && data.records) {
          this.thirdCategory = data.records;
        }
      }
    },
    // 批量设置销售渠道
    changeSaleChannel () {
      if(this.dataListSelections.length == 0){
        this.$message.warning('请先选择商品')
      }else{
        let pids = []
        this.dataListSelections.forEach(item => {
          pids.push(item.id)
        })
        this.$nextTick(() => {
          this.$refs.saleChannelModal.init(pids)
        })
      }
    },

    // 批量禁用
    changeStatus() {
      if (this.dataListSelections && this.dataListSelections.length > 0) {
        if (this.dataListSelections.length <= 50) {
          this.$nextTick(() => {
            this.$refs.batchStatus.init(this.dataListSelections)
          })
        } else {
          this.$message.warning('商品批量启用/禁用，一次性最多可选择50条商品数据')
        }
      } else {
        this.$message.warning('请先选择商品！')
      }
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'goods-view', query: {id}})
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({name:'goods-add-or-update', query: {id}})
    },
    //二次克隆商品
    // copy(id){
    //   this.$router.push({name:'goods-copy', query: {id}})
    // },
    // 预约设置
    reservation (id) {
      this.$router.push({name:'reservation', query: {id}})
    },
    //双击填入
    doubleClick(row){
      if (row.ownership === 'COMPANY') {
        return
      }
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
    },
    //编辑克隆门店商品价格
    editPrice(id,name,costPrice,retailPrice){
      this.editPriceVisible = true
      this.$nextTick(() => {
        this.$refs.editprice.init(id,name,costPrice,retailPrice)
      })
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
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type === 'reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
        this.$forceUpdate()
      }
      this.dataListSelections = []
      this.changePage = false
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  .page-store-goods-list{
    .buttonOne:first-child{
      border-top: 0;
    }
  }
  .el-table__row td{
  .goods-stock{
    font-size: 12px;
    padding: 0 !important;
    &.red{
      color: red !important;
    }
    .dot{
      display: inline-block;
      padding: 0 !important;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      margin-right: 3px;
      &.red{
        background-color: red;
      }
    }
  }
}

</style>



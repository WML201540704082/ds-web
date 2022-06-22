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
        <el-form-item label="商品信息" prop="key">
          <el-input v-model="filterForm.key" placeholder="商品名称/条码" clearable></el-input>
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
      <gt-border-button v-if="newStore == 'fales'" class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" type="sale" class="gt-table-create" txt="设置销售渠道" @click.native="() => changeSaleChannel()"/>
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" type="integral" class="gt-table-create" txt="设置积分规则" @click.native="() => changeIntegralRule()"/>
      <gt-border-button v-if="newStore == 'false'" class="gt-table-create" type="create" @click.native="() => addOrUpdateHandle()"/>
      <gt-border-button v-if="newStore == 'false'" type="sale" class="gt-table-create" txt="设置销售渠道" @click.native="() => changeSaleChannel()"/>
      <gt-border-button v-if="newStore == 'false'" type="integral" class="gt-table-create" txt="设置积分规则" @click.native="() => changeIntegralRule()"/>
      
      <!-- <gt-border-button type="export" class="gt-table-create" txt="批量修改" @click.native="() => modify()"/> -->
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" type="export" class="gt-table-create" txt="批量启用/禁用" @click.native="() => changeStatus()"/>
      <gt-border-button v-if="newStore == 'false'" type="export" class="gt-table-create" txt="批量启用/禁用" @click.native="() => changeStatus()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
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
          :selectable="(row, index) => {
            return row.type != 'BULK'
          }"
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
            <span v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" >|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
            >
              <el-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne"v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）' && scope.row.type != 'SERVICE'"  @click="deleteHandle(scope.row.id)" style="margin-bottom: 0" >删除</div>
              <el-button v-if="newStore == 'false'" class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" v-if="newStore == 'false'" @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne"v-if="newStore == 'false' && scope.row.type != 'SERVICE'"  @click="deleteHandle(scope.row.id)" style="margin-bottom: 0" >删除</div>         
            </el-popover>
          </template>
        </el-table-column>
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
          min-width="140"
          :show-overflow-tooltip="true"
          v-if="integral.productStatus && integral.productIntegralType === 'PRODUCT'"
          label="积分规则">
          <template slot-scope="scope">
            <span>{{scope.row.integralPlan ? scope.row.integralPlan.name : '无'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="costPrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="成本价">
          <template slot-scope="scope">
            <span v-if="scope.row.costPrice !== null">{{Number(priceNum(scope.row.costPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wholesalePrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="配送价">
          <template slot-scope="scope">
            <span v-if="scope.row.wholesalePrice !== null">{{Number(priceNum(scope.row.wholesalePrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="retailPrice"
          :show-overflow-tooltip="true"
          min-width="100"
          label="零售价">
          <template slot-scope="scope">
            <span v-if="scope.row.retailPrice !== null">{{Number(priceNum(scope.row.retailPrice)).toFixed(2)}}</span>
            <span v-else> -- </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeNames"
          min-width="150"
          :show-overflow-tooltip="true"
          label="在售门店">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <sale-channel-modal ref="saleChannelModal" @refreshDataList="getDataList" />
    <integral-rule-modal ref="integralRuleModal" @refreshDataList="getDataList" />
    <batch-modal ref="batchModal" @refreshDataList="getDataList" />
    <batch-status ref="batchStatus" @refreshDataList="getDataList" />
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { storeStatus, productType, productAllType, saleChannel } from '@/utils/dict'
import saleChannelModal from './components/sale-channel'
import integralRuleModal from './components/integral-rule-modal'
import batchModal from './components/batch-modify-modal'
import batchStatus from './components/batch-status-modal'
import { filterStatus, fileDownload } from '@/utils'
import * as api from '@/service/goods'
import { getStoreList } from '@/service/systore'
import { integralPlanSelect, integralPlanDetail } from '@/service/integral'
import _ from 'lodash'
import { getStore } from '@/utils/storage'
export default {
  name: 'goods-goods',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      dataListSelections: [],
      total: 0,
      pageSize: 20,
      currentPage: 0,
      integral: {
        productStatus: null
      },
      rules: [],
      filterForm:{
        saleChannel: null,
        key: null,
        type: '',
        firstCategoryId: '',
        categoryId: '',
        thirdCategoryId:'',
        brandId: null,
        integralPlanId: null,
        hasIntegralPlan: null,
        storeIds: [],
        saleStatus: 'ON',
      },
      changePage: false,
      stores: [],
      brands: [], // 品牌列表
      productType,
      productAllType,
      saleChannel,
      filterStatus,
      mainCategory: [],
      subCategory: [],
      thirdCategory:[],
      companyRoleName:null
    }
  },
  components: {
    gtPagination,
    saleChannelModal,
    integralRuleModal,
    batchModal,
    batchStatus
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
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    this.allList()
  },
  methods: {
    async allList() {
      // 获取商品列表
      this.getDataList()

      // 获取门店列表
      this.getStores()

      // 获取品牌列表
      this.getBrandList()

      // 获取当前积分规则
      this.getRulePlan()

      // 获取商品积分列表
      this.getIntegralRule()

      // 获取商品分类
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainCategory = data.records
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

    // 获取积分规则
    async getIntegralRule() {
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        this.rules = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取数据列表
    async getDataList() {

      // 清空已选商品
      this.dataListSelections = []
      this.dataListLoading = true
      const { data } = await api.getGoodsList({
        ...this.filterForm,
        hasIntegralPlan: this.filterForm.integralPlanId ? (this.filterForm.integralPlanId === -1 ? false : true) : null,
        integralPlanId: this.filterForm.integralPlanId === -1 ? null : this.filterForm.integralPlanId,
        storeIds: this.filterForm.storeIds.join(','),
        ownership: 'COMPANY',
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

    //双击填入
    doubleClick(row){
      if (row.type == 'BULK') {
        return
      }
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.goodsTableList.toggleRowSelection(row)
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

    // 获取积分规则
    async getRulePlan() {
      const { data } = await integralPlanDetail()
      if (data.code === 0) {
        this.integral = data.data
      } else {
        this.$message.error(data.msg)
      }
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
    // 导出商品列表
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        ownership: 'COMPANY',
        type: this.filterForm.type || null,
        firstCategoryId: this.filterForm.firstCategoryId || null,
        categoryId: this.filterForm.categoryId || null,
        storeIds: this.filterForm.storeIds.join(','),
      }
      this.exportList(this.total, '商品清单', 'COMPANY_PRODUCT', criteria, async () => {
        const { data, headers } = await api.exportExcel({
          ...criteria,
          size: 10000,
          page: 0,
        })
        fileDownload(data, '商品清单.xls')
      })
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({name:'goods-add-or-update', query: {id, type: 'company'}})
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
      this.$router.push({name:'goods-view', query: {id}})
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


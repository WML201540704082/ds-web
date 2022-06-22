<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form label-width="100px" :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="所属企业" prop="companyId">
          <el-select v-model="form.companyId" filterable placeholder="请选择企业" @change="getStoreList" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'>
          <el-select v-model="form.storeId" placeholder="请选择门店" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="加盟授权编码" prop='leagueAuthorizationCode'>
          <el-input clearable v-model="form.leagueAuthorizationCode" placeholder="请输入加盟授权编码"></el-input>
        </el-form-item>
        <el-form-item label="省市区" prop="storeLocation">
          <gt-select-location ref="storeLocation" :provinceId="form.provinceId" :cityId="form.cityId" :districtId="form.districtId" />
        </el-form-item>
        <el-form-item label="大区" prop='region'>
          <el-input clearable v-model="form.region" placeholder="请选择大区"></el-input>
        </el-form-item>
        <el-form-item label="时间段">
          <gt-time-range
            type="date"
            value-format="yyyy-MM-dd"
            start-time-prop="staDay"
            :start-time-value="form.staDay"
            :end-time-value="form.endDay"
            end-time-prop="endDay"
            @changeStartValue="value => form.staDay = value"
            @changeEndValue="value => form.endDay = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="商品条码" prop='barcode'>
          <el-input clearable v-model="form.barcode" placeholder="请输入商品条码"></el-input>
        </el-form-item>
        <el-form-item label="商品名称" prop='name'>
          <el-input clearable v-model="form.name" placeholder="请输入商品名称"></el-input>
        </el-form-item>
        <el-form-item label="商品分类">
          <el-form-item prop="category1Id">
            <el-select v-model="form.category1Id" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
              <el-option  label="全部" value="" ></el-option>
              <el-option
                v-for="item in mainCategory"
                :key="item.id"
                :label="item.name"
                :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="category2Id">
            <el-select v-model="form.category2Id" placeholder="请选择二级分类" clearable>
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
        <el-form-item label="商品品牌" prop="brandId">
          <el-select v-model="form.brandId" filterable placeholder="请选择商品品牌" clearable>
            <el-option label="全部" :value="null" ></el-option>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height>
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.storeName"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.storeCode"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.leagueAuthorizationCode"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="加盟授权编码">
        </el-table-column>
        <el-table-column
          min-width="150"
          :show-overflow-tooltip="true"
          label="省市区">
          <template slot-scope="scope">
            <span>{{`${scope.row.storeBaseInfo.province || ''}${scope.row.storeBaseInfo.city || ''}${scope.row.storeBaseInfo.district || ''}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeBaseInfo.region"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="大区">
        </el-table-column>
        <el-table-column
          prop="day"
          min-width="150"
          :show-overflow-tooltip="true"
          label="时间">
        </el-table-column>
        <el-table-column
          prop="productName"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品名称">
        </el-table-column>
        <el-table-column
          prop="barcode"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品条码">
        </el-table-column>
        <el-table-column
          prop="productType "
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品类别">
          <template slot-scope="scope">
            <span>{{scope.row.productType == 'ENTITY' ? '零售类商品' : scope.row.productType == 'SERVICE' ? '服务类商品' : '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="category1Name"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品一级分类">
        </el-table-column>
        <el-table-column
          prop="category2Name"
          min-width="150"
          :show-overflow-tooltip="true"
          label="商品二级分类">
        </el-table-column>
        <el-table-column
          prop="brandName"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="商品品牌">
        </el-table-column>
        <el-table-column
          prop="productSaleNum"
          min-width="150"
          :show-overflow-tooltip="true"
          label="销售件数">
          <template slot-scope="scope">
          <span>
            {{ scope.row.productSaleNum }}<span v-if="scope.row.productType == 'BULK'">kg</span>
          </span>
        </template>
        </el-table-column>
        <el-table-column
          prop="productSaleAmount"
          min-width="150"
          :show-overflow-tooltip="true"
          label="销售金额">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
import gtSelectLocation from '@/components/gt-select-location'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, fileDownload, locations } from '@/utils'
import moment from 'moment'
export default {
  name:'salesAnalysis-list',
  data () {
    return {
      filterStatus,
      dataList: [],
      companyList: [],
      storeList: [],
      mainCategory: [],//一级分类
      subCategory: [],//二级分类
      brands: [],//品牌
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      form:{
        companyId: '',//企业id
        storeId: '',//门店id
        leagueAuthorizationCode:'',//加盟授权编码
        region:'',//大区
        provinceId:'',//省
        cityId:'',//市
        districtId:'',//区
        category1Id:'',//一级分类
        category2Id:'',//二级分类
      },
    }
  },
  components: {
    gtPagination,gtSelectLocation,gtTimeRange
  },
  created () {
    //获取数据列表
    this.getDataList()
    //获取企业下拉列表
    this.getCompanyList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      var local = locations(this.$refs['storeLocation'])
      this.$http({
        url: this.$http.adornUrl('/mop/productReport/productDayReportList'),
        method: 'get',
        params: this.$http.adornParams({
          size: this.pageSize,
          page: this.currentPage,
          ...this.form,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
        })
      }).then(({data}) => {
        this.dataListLoading = false
        if (data && data.code === 0) {
          this.dataList = data.data.records.map(item => {
            return{
              ...item,
              productSaleAmount: item.productType == 'BULK' ? this.priceNum(item.productSaleAmount / 1000).toFixed(2) : this.priceNum(item.productSaleAmount),
              productSaleNum: item.productType == 'BULK' ? Number(item.productSaleNum / 1000).toFixed(3) : item.productSaleNum,
              day: item.day ? moment(item.day).format('YYYY-MM-DD') : null,
            }
          })
          this.total = data.data.total
        } else {
          this.$message.error(data.msg)
          this.dataList = []
          this.total = 0
        }
      })
    },
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
    },
    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      this.form.storeId = ''
      if (companyId) {
        this.companyId = companyId
        //调门店列表接口
        const { data } = await this.$http({
          url: this.$http.adornUrl(`/baseinfo/mop/store/company/${companyId}`),
          method: 'get',
        })
        if (data && data.code === 0) {
          this.storeList = data.data
        } else {
          this.storeList = []
          this.$message.error(data.msg)
        }
        //调商品分类列表
        const goodsData = await this.$http({
          url: this.$http.adornUrl('/mop/category/list'),
          method: 'get',
          params: this.$http.adornParams({
            size: 10000,
            page: 0,
            companyId:companyId
          })
        })
        if (goodsData.data.code == 0 && goodsData.data.data.records) {
          this.mainCategory = goodsData.data.data.records
        }else{
          this.mainCategory = []
          this.$message.error(goodsData.data.msg)
        }
        //获取品牌列表
        const brandsdata = await this.$http({
          url: this.$http.adornUrl('/mop/brand/page'),
          method: 'get',
          params: this.$http.adornParams({
            size: 10000,
            page: 0,
            companyId:companyId
          })
        })
        if (brandsdata.data.code === 0) {
          this.brands = brandsdata.data.data.records
        } else {
          this.brands = []
          this.$message.error(brandsdata.data.msg)
        }
      } else {
        this.$message.warning('请先选择所属企业')
      }
    },
    //获取二级分类
    async getSubCategoryList(id) {
      if (id) {
        //调商品分类列表
        const data = await this.$http({
          url: this.$http.adornUrl('/mop/category/list'),
          method: 'get',
          params: this.$http.adornParams({
            size: 10000,
            page: 0,
            companyId:this.companyId,
            parentId:id,
          })
        })
        if (data.data && data.data.code == 0) {
          this.subCategory = data.data.data.records
        }else{
          this.subCategory = []
          this.$message.error(data.data.msg)
        }
      }
    },
    // 导出商品分析列表
    async exportExcel() {
      var local = locations(this.$refs['storeLocation'])
      const { data, headers } = await this.$http({
        url: this.$http.adornUrl('/mop/productReport/export'),
        method:'get',
        responseType: 'arraybuffer',
        selfHandleError: true,
        params: this.$http.adornParams({
          ...this.form,
          provinceId: local.provinceId || null,
          cityId: local.cityId || null,
          districtId: local.districtId || null,
          size: 10000,
          page: 0,
        })
      })
      debugger
      fileDownload(data, '商品分析列表.xls')
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(isSearch) {
      if(isSearch != 'search'){
        this.$refs['form'].resetFields()
        if (this.$refs['storeLocation']) {
          this.$refs['storeLocation'].refresh()
        }
        this.storeList = []
        this.mainCategory = []
        this.subCategory = []
        this.brands = []
      }
      this.pageSize = 20
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/_variables.scss';
  @import '~@/assets/scss/store/store.scss';
</style>
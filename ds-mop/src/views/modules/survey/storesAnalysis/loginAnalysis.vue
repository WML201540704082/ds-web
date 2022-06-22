
<template>
  <div class="mod-store">
    <el-card class="chart-container" style ="width: 100%;">
      <!-- 图表展示 -->
      <pos-login-bar />
    </el-card>

    <!-- table -->
    <el-card class="mode-store-table">
      <el-form label-width="80px" :model="form" :inline="true" ref='form' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="所属企业" prop='companyId' v-if="isAuth('mop:company:select1')">
          <el-select v-model="form.companyId" filterable @change="getStoreList" placeholder="请选择所属企业" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in companyList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'>
          <el-select v-model="form.storeId" placeholder="请选择所属门店" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录状态" prop='unusual'>
          <el-select v-model="form.unusual" placeholder="请选择登录状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in posLoginUnusual"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="登录位置" prop="storeLocation">
          <gt-select-location v-if="refresh" ref="storeLocation" :provinceId="form.provinceId" :cityId="form.cityId" :districtId="form.districtId" />
        </el-form-item>
        <el-form-item label="登录时间">
          <gt-time-range
            value-format="timestamp"
            start-time-prop="startTime"
            :start-time-value="form.startTime"
            :end-time-value="form.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => form.startTime = value"
            @changeEndValue="value => form.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm()"/>
        </el-form-item>
      </el-form>
      <div style = "font-size: 20px;margin: 10px 0">登录门店间数： {{totalQuantity}}</div>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height>
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="unusual"
          min-width="100"
          :show-overflow-tooltip="true"
          label="登录状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.unusual, posLoginUnusual))">{{filterStatus(scope.row.unusual, posLoginUnusual)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="loginTime"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="登录时间">
        </el-table-column>
        <el-table-column
          prop="loginUser"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="登录账号">
          <!-- <template slot-scope = "scope">
            <span>{{`${scope.row.loginUser || '--'} / ${scope.row.phone || '--'}`}}</span>
          </template> -->
        </el-table-column>
        <el-table-column
          prop="province"
          min-width="100"
          :show-overflow-tooltip="true"
          label="登录省份">
        </el-table-column>
        <el-table-column
          prop="city"
          :show-overflow-tooltip="true"
          min-width="100"
          label="登录市级">
        </el-table-column>
        <el-table-column
          prop="district"
          min-width="100"
          :show-overflow-tooltip="true"
          label="登录区县">
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="180"
          :show-overflow-tooltip="true"
          label="登录地址">
        </el-table-column>
        <el-table-column
          prop="equipmentType"
          min-width="150"
          :show-overflow-tooltip="true"
          label="设备型号">
        </el-table-column>
        <el-table-column
          prop="equipmentNo"
          min-width="180"
          :show-overflow-tooltip="true"
          label="设备号（SN）">
        </el-table-column>
        <el-table-column
          prop="belongCompany"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属企业">
        </el-table-column>
        <el-table-column
          prop="belongStore"
          min-width="150"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="belongProvince"
          min-width="100"
          :show-overflow-tooltip="true"
          label="所在省份">
        </el-table-column>
        <el-table-column
          prop="belongCity"
          :show-overflow-tooltip="true"
          min-width="100"
          label="所在市级">
        </el-table-column>
        <el-table-column
          prop="belongDistrict"
          min-width="100"
          :show-overflow-tooltip="true"
          label="所在区县">
        </el-table-column>
        <el-table-column
          prop="belongAddress"
          min-width="180"
          :show-overflow-tooltip="true"
          label="门店注册地址">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { posLoginUnusual } from '@/utils/dict'
import { filterStatus, filterColor, locations } from '@/utils'
import gtTimeRange from '@/components/gt-time-range'
import gtSelectLocation from '@/components/gt-select-location'
import posLoginBar from './components/posLoginBar'
import * as api from '@/service/analysis'
export default {
  name:'survey-storesAnalysis-loginAnalysis',
  data () {
    return {
      filterStatus,
      filterColor,
      totalQuantity: 0,
      refresh: true,
      dataList: [],
      dataListLoading: false,
      posLoginUnusual,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      form:{
        companyId: '',
        storeId: '',
        districtId: '',
        cityId: '',
        provinceId: '',
        unusual:'',
        startTime: null,
        endTime: null
      },
      companyList: [],
      storeList: []
    }
  },
  components: {
    gtPagination, gtTimeRange, gtSelectLocation, posLoginBar
  },
  created () {
    this.getDataList()
    this.selectCompany()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      var local = locations(this.$refs['storeLocation'])
      const { data } = await api.getPosLoginList({
        ...this.form,
        page: this.currentPage,
        size: this.pageSize,
        provinceId: local.provinceId || null,
        cityId: local.cityId || null,
        districtId: local.districtId || null,
        province: local.province || null,
        city: local.city || null,
        district: local.district || null,
      })
      if (data && data.code === 0) {
        this.dataList = data.data.page.records
        this.totalQuantity = data.data.totalQuantity
        this.total = data.data.page.total
      } else {
        this.$message.error(data.msg)
        this.dataList = []
        this.total = 0
      }
      this.dataListLoading = false
    },

    // 所选企业
    selectCompany(){
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1,
        })
      }).then(({data}) => {
        if(data && data.code === 0) {
          this.companyList = data.data.records
        }else{
          this.companyList = []
        }
      })
    },

    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      this.form.storeId = ''
      if (companyId) {
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
      } else {
        this.storeList = []
      }
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
        this.refresh = false
        this.form.districtId = '',
        this.form.cityId = '',
        this.form.provinceId = '',
        this.$nextTick(() => {
          this.refresh = true
          this.pageSize = 20
          this.currentPage = 0
          this.getDataList()
        })
      } else {
        this.pageSize = 20
        this.currentPage = 0
        this.getDataList()
      }

    },
  }
}
</script>
<style lang="scss">
.chart-container{
  width: 100%;
  .el-card__body{
    width: 100%;
  }
}
</style>

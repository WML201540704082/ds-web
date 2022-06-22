<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" ref="companyFilter" :model="filterData" @keyup.enter.native="reset('search')">
        <el-form-item label="商户名称" prop='name'>
          <el-input placeholder="请输入商户名称" v-model="filterData.name" clearable></el-input>
        </el-form-item>
        <el-form-item label="地址关键字" prop='address'>
          <el-input placeholder="请输入地址关键字" v-model="filterData.address" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item label="省市区" prop='entityCategory'>
          <gt-select-location ref="companyLocation" :provinceId="filterData.provinceId" :cityId="filterData.cityId" :districtId="filterData.districtId"/>
        </el-form-item> -->
        <el-form-item class="search-toolbar" v-if="isAuth('mop:potential:list')">
          <gt-button type="search" @click.native="reset('search')"/>
          <gt-button type="reset"  @click.native="reset"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading"
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
          prop="name"
          min-width="150"
          :show-overflow-tooltip="true"
          label="企业名称">
          <template slot-scope="scope">
            <span>{{scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="legal"
          min-width="120"
          label="法人代表">
        </el-table-column>
        <el-table-column
          prop="registrationNumber"
          align="center"
          width="150"
          :show-overflow-tooltip="true"
          label="注册号">
        </el-table-column>
        <el-table-column
          prop="establishDate"
          :show-overflow-tooltip="true"
          min-width="180"
          label="成立日期">
          <template slot-scope="scope">
            {{moment(scope.row.establishDate).format('YYYY-MM-DD HH:mm:ss')}}
          </template>
        </el-table-column>
        <el-table-column
          prop="businessScope"
          :show-overflow-tooltip="true"
          min-width="180"
          label="经营范围">
        </el-table-column>
        <el-table-column
          prop="tel"
          min-width="150"
          :show-overflow-tooltip="true"
          label="联系电话">
        </el-table-column>
        <el-table-column
          min-width="180"
          label="地址">
          <template slot-scope="scope">
             <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.county || ''}${scope.row.address || ''}`}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import { companyLevel, companyType, companyStatus } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
// import gtSelectLocation from '@/components/gt-select-location'
import gtPagination from '@/components/gt-pagination'
import { locations } from '@/utils'
import moment from 'moment'
export default {
  name:'potential-potential',
  data () {
    return {
      dataList: [],
      total: 0,
      pageSize: 20,
      currentPage: 1,
      moment,
      dataListLoading: false,
      filterData: {
        name: null,
        address: null
        // provinceId: null,
        // cityId: null,
        // districtId: null
      }
    }
  },
  components: { gtPagination },
  // created() {
  //   if(this.isAuth('mop:potential:list')){
  //     this.getDataList()
  //   }
  // },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      // let local = {}
      // if (this.$refs['companyLocation']) {
      //   local = locations(this.$refs['companyLocation'])
      // }
      // const {province, city, district} = local
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/potentialClient'),
        method: 'get',
        params: this.$http.adornParams({
          page: this.currentPage,
          size: this.pageSize,
          name: this.filterData.name,
          address: this.filterData.address
          // province: province,
          // city: city,
          // county: district
        })
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },


    // 修改分页
    pagination_event (val){
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      if(this.isAuth('mop:potential:list')){
        // const local = locations(this.$refs['companyLocation'])
        // const {province} = local
        if (this.filterData.name || this.filterData.address) {
          this.getDataList()
        }
      }
    },
    // 重置
    reset (isSearch) {
      if(isSearch != 'search'){
        this.$refs['companyFilter'].resetFields()
        // this.$refs['companyLocation'].refresh()
        this.pageSize = 20
        this.currentPage = 1
        this.total = 0
        this.dataList = []
      } else {
        if(this.isAuth('mop:potential:list')){
          // const local = locations(this.$refs['companyLocation'])
          // const {province} = local
          if (this.filterData.name || this.filterData.address) {
            this.getDataList()
          } else {
            this.pageSize = 20
            this.currentPage = 1
            this.total = 0
            this.dataList = []
          }
        }
      }

      // this.getDataList()
    }
  }
}
</script>

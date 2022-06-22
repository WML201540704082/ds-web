<template>
  <div class="mod-store">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" label-width="80px" ref="supplierMgt" :model="supplierMgt" @keyup.enter.native="resetForm('search')">
        <el-form-item label="供应商名称" prop="companyName">
          <el-input v-model="supplierMgt.companyName" placeholder="请输入供应商名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="联系人/电话" prop='key'>
          <el-input v-model="supplierMgt.key" placeholder="请输入联系人/电话" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <el-radio-group v-model="selectSupplier" @change="changeSupplierList" style="float:left;margin-top:-10px">
        <el-radio-button label="mySupplier">我的供应商</el-radio-button>
        <el-radio-button label="brandSupplier">品牌供应商</el-radio-button>
      </el-radio-group>
      <!-- <gt-border-button class="gt-table-create" txt="关联供应商" type="bind" @click.native="relateSupplier()"/> -->
      <gt-border-button v-if="selectSupplier === 'mySupplier'" class="gt-table-create" style="float:right" txt="新增供应商" @click.native="() => newSupplier()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-if="needRefresh"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="companyName"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="供应商名称">
        </el-table-column>
        <el-table-column
          prop="relatedBrand"
          min-width="100"
          :show-overflow-tooltip="true"
          label="关联品牌">
          <template slot-scope="scope">
            <span>{{selectSupplier === 'mySupplier' ? scope.row.relatedBrand : scope.row.brandCompanyName}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bossName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人">
          <template slot-scope="scope">
            <span>{{selectSupplier === 'mySupplier' ? scope.row.bossName : scope.row.name}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="bossPhone"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人电话">
          <template slot-scope="scope">
            <span>{{selectSupplier === 'mySupplier' ? scope.row.bossPhone : scope.row.phone}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="address"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="联系地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}` || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="是否可发起采购">
          <template slot-scope="scope">
            <span>{{ scope.row.isPurchase ? '是' : '否' }}</span>
          </template>
          <template slot="header" slot-scope="scope">
            <span>是否可发起采购</span>
            <el-tooltip placement="top">
              <div slot="content" style="width: 360px;">
                标记为“是”的供应商，为入驻销帮主平台的供应商，您可以向这些供应商发起采购流程；<br>
                <br>
                标记为“否”的供应商，未入驻销帮主平台，不可发起采购流程，仅可在新建入库单时进行操作
              </div>
              <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <!-- <gt-relateSupplier v-if="relateSupplierVisible" ref="relateSupplier" @refreshDataList="getDataList"/> -->
    <gt-newSupplier v-if="newSupplierVisible" ref="newSupplier" @refreshNewSupplierDataList="getDataList"/>
  </div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'
// import gtRelateSupplier from './relateSupplier'
import gtNewSupplier from './newSupplier'
import { getStore } from '@/utils/storage'
import * as api from '@/service/stock'
export default {
  name: 'stockManagement-supplier-supplierManagement',
  components: {
    // gtRelateSupplier,
    gtNewSupplier,gtPagination
  },
  data(){
    return{
      selectSupplier:'mySupplier',
      dataList:[],
      needRefresh: true,
      dataListLoading:false,
      // relateSupplierVisible:false,
      newSupplierVisible:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      supplierMgt:{
        companyName: null,
        key: null,
      },
    }
  },
  created(){
    //获取companyId
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
    // 供应商列表详情
    this.getDataList()
  },
  methods:{
    //关联供应商
    // relateSupplier(){
    //   this.relateSupplierVisible = true
    //   this.$nextTick(() => {
    //     this.$refs.relateSupplier.init()
    //   })
    // },
    //新增供应商
    newSupplier(){
      this.newSupplierVisible = true
      this.$nextTick(() => {
        this.$refs.newSupplier.init()
      })
    },
    //监听supplierList
    changeSupplierList(){
      this.needRefresh = false
      this.$nextTick(() => {
        this.needRefresh = true
        this.currentPage = 0
        this.getDataList()
      })
    },
    //供应商列表详情
    async getDataList() {
      this.dataListLoading = true
      const { data } = this.selectSupplier === 'mySupplier' ? await api.relateSupplierList({
        callSource:'SAAS',
        mbgCompanyId:this.companyId,
        currentPage:this.currentPage+1,
        pageSize:this.pageSize,
        ...this.supplierMgt
      }) : await api.getBrandSupplierList({
        callSource:'SAAS',
        mbgCompanyId:this.companyId,
        page:this.currentPage+1,
        size:this.pageSize,
        ...this.supplierMgt
      })
      this.dataListLoading = false
      if (data.code === 0) {
        this.dataList = data.data ? data.data.records : []
        this.total = data.data ? data.data.total : 0
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
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
        this.$refs['supplierMgt'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.changeSupplierList()
    },
  }
}
</script>

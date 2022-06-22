<template>
  <div class="mod-store mod-role sysItems">
    <el-card>
      <el-form :inline="true" class="mode-form-line1" :model="dataForm" @keyup.enter.native="reset('search')">
        <el-form-item style="margin-bottom: 0;">
          <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <!-- <el-form-item style="margin-bottom: 0;">
          <el-select v-model="storeId" placeholder="请选择企业下的门店">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item class="search-toolbar" v-if="isAuth('store:sysRole:list')">
          <gt-button type="search" @click.native="reset('search')"/>
          <gt-button type="reset" @click.native="reset('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('store:sysRole:add')" type="create" @click.native="addOrUpdateHandle()"/>
      <el-table
        v-table-height
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading">
        <el-table-column
          header-align="center"
          align="center"
          v-if="isAuth('store:sysRole:update')"
          width="150"
          label="操作">
          <template slot-scope="scope">
            <el-button style="padding: 0!important;" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="备注">
        </el-table-column>
        <el-table-column
          prop="createDate"
          header-align="center"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update'
import gtPagination from '@/components/gt-pagination'
import * as api from '@/service/systore'
export default {
  name: 'systore-role',
  data () {
    return {
      dataForm: {
        roleName: ''
      },
      dataList: [],
      // storeList:[],//门店列表
      // storeId: null,//门店id
      currentPage: 1,
      pageSize: 20,
      total: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: {
    AddOrUpdate,
    gtPagination
  },
  // watch:{
  //   storeId(val,oldval){
  //     this.storeId = val
  //     this.getDataList()
  //   }
  // },
  created () {
    // this.getStorelist()
    if(this.isAuth('store:sysRole:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取门店列表
    // async getStorelist(){
    //   this.dataListLoading = true
    //   const { data } = await api.getStoreList({
        // status:1
      // })
    //   if(data && data.code ==0){
    //     this.storeList = data.data
    //     for(var i in this.storeList){
    //       this.storeId = this.storeList[0].id
    //     }
    //     this.getDataList()
    //   }else{
    //     this.storeList =[]
    //   }
    // },
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/store/sysRole/list'),
        method: 'post',
        selfHandleError: true,
        data: this.$http.adornData({
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'name': this.dataForm.roleName,
          'storeId' : this.storeId
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          this.dataList = data.data.records
          this.total = data.data.total
        } else {
          this.dataList = []
          this.total = 0
        }
        this.dataListLoading = false
      })
    },
    reset (type){
      if (type === 'reset') {
        this.pageSize = 20,
        this.dataForm.roleName = ''
      }
      this.currentPage = 1
      this.getDataList()
    },
    pagination_event (val){
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        // this.$refs.addOrUpdate.init(id,this.storeId)
        this.$refs.addOrUpdate.init(id)
      })
    },
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>

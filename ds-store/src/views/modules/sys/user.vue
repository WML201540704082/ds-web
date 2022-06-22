<template>
  <div class="mod-store mod-user sysItems">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="reset('search')">
        <el-form-item style="margin-bottom: 0;">
          <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;">
          <el-select v-model="storeId" placeholder="请选择企业下的门店">
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('sys:user:list')">
          <gt-button type="search" @click.native="reset('search')" />
          <gt-button type="reset" @click.native="reset('type')" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" v-if="isAuth('sys:user:add')" @click.native="addOrUpdateHandle()"/>
      <el-table
        v-table-height
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          header-align="center"
          align="center"
          width="150"
          v-if="isAuth('sys:user:update')"
          label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="isAdmin"
          header-align="center"
          width="180"
          align="center"
          label="超级管理员">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAdmin === 0" size="small" type="danger">否</el-tag>
            <el-tag v-else size="small">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="createDate"
          header-align="center"
          align="center"
          width="180"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="loginCount"
          header-align="center"
          align="center"
          width="180"
          label="登陆次数">
        </el-table-column>
        <el-table-column
          prop="lastLoginIp"
          header-align="center"
          align="center"
          width="180"
          label="登陆IP">
        </el-table-column>
        <el-table-column
          prop="lastLoginDate"
          header-align="center"
          align="center"
          width="180"
          :show-overflow-tooltip="true"
          label="最后一次登录">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import gtPagination from '@/components/gt-pagination'
import * as api from '@/service/systore'
export default {
  data () {
    return {
      dataForm: {
        userName: ''
      },
      storeList:[],//门店列表
      storeId: null,//门店id
      dataList: [],
      currentPage : 1,
      pageSize: 20,
      total: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: { AddOrUpdate, gtPagination },
  watch:{
    storeId(val,oldval){
      this.storeId = val
      this.getDataList()
    }
  },
  created () {
    if(this.isAuth('sys:user:list')){
      this.getStorelist()
    }
  },
  methods: {
    // 获取门店列表
    async getStorelist(){
      this.dataListLoading = true
      const { data } = await api.getStoreList({
        status:1
      })
      if(data && data.code ==0){
        this.storeList = data.data
        for(var i in this.storeList){
          this.storeId = this.storeList[0].id
        }
        this.getDataList()
      }else{
        this.storeList =[]
      }
    },
    // 获取数据列表
    getDataList () {
      this.$http({
        url: this.$http.adornUrl('/sys/store/sysUser/list'),
        method: 'post',
        selfHandleError: true,
        data: this.$http.adornData({
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'userName': this.dataForm.userName,
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
        this.dataForm.userName = ''
        this.pageSize = 20
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
        this.$refs.addOrUpdate.init(id,this.storeId)
      })
    },
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>

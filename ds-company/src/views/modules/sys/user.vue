<template>
  <div class="mod-store mod-user sysItems">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList('search')">
        <el-form-item>
          <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('sys:user:list')">
          <gt-button type="search" @click.native="reset('search')" />
          <gt-button type="reset" @click.native="reset('reset')" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button v-if="isAuth('sys:user:add')" class="gt-table-create" type="create" @click.native="addOrUpdateHandle()" style="margin-bottom: 10px;"/>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-table-height
        v-loading="dataListLoading">
        <el-table-column
          header-align="center"
          align="center"
          v-if="isAuth('sys:user:update')"
          width="60"
          label="操作">
          <template slot-scope="scope">
            <el-button style="padding: 0!important;" type="text" size="small" :disabled="scope.row.isAdmin === 1" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
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
          min-width="120"
          :show-overflow-tooltip="true"
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
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="loginCount"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="登录次数">
        </el-table-column>
        <el-table-column
          prop="lastLoginIp"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          label="登录IP">
        </el-table-column>
        <el-table-column
          prop="lastLoginDate"
          header-align="center"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="最后一次登录">
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>

    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './user-add-or-update'
import gtPagination from '@/components/gt-pagination'
export default {
  data () {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      currentPage : 1,
      pageSize: 20,
      total: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: { AddOrUpdate, gtPagination },
  created () {
    if(this.isAuth('sys:user:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/company/sysUser/list'),
        method: 'post',
        selfHandleError: true,
        data: this.$http.adornData({
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'userName': this.dataForm.userName
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
        this.$refs.addOrUpdate.init(id)
      })
    },
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>


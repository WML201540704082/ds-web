<template>
  <div class="mod-user sysItems mod-store">
    <el-card style="width: 100%;">
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="reset('search')">
        <el-form-item style="margin-bottom: 0;">
          <el-input v-model="dataForm.userName" placeholder="用户名" clearable></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom: 0;display: inline-block;float: right;"  v-if="isAuth('sys:user:list')" >
          <gt-button type="search" @click.native="reset('search')"/>
          <gt-button type="reset" @click.native="reset()" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-boder-button class="gt-table-create" v-if="isAuth('sys:user:add')" type="create" @click.native="addOrUpdateHandle()"/>
      <el-table
        :data="dataList"
        border
        :stripe="true"
        v-loading="dataListLoading"
        v-table-height
        style="width: 100%;">
        <el-table-column
          header-align="center"
          align="center"
          width="100"
          v-if="isAuth('sys:user:update')"
          label="操作">
          <template slot-scope="scope">
            <span v-if="scope.row.isAdmin !== 1">
              <el-button style="padding: 0!important;" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
              <span>|</span>
              <el-button style="padding: 0!important;" type="text" size="small" @click="deleteRow(scope.row.id)">删除</el-button>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="userName"
          header-align="center"
          align="center"
          min-width="120"
          :show-overflow-tooltip="true"
          label="用户名">
        </el-table-column>
        <el-table-column
          prop="isAdmin"
          header-align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          align="center"
          label="超级管理员">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.isAdmin === 0" size="small" type="danger">否</el-tag>
            <el-tag v-else size="small">是</el-tag>
          </template>
        </el-table-column>
        <el-table-column
          prop="roleName"
          header-align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          align="center"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="createDate"
          header-align="center"
          align="center"
          min-width="180"
          :show-overflow-tooltip="true"
          label="创建时间">
        </el-table-column>
        <el-table-column
          prop="loginCount"
          header-align="center"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="登录次数">
        </el-table-column>
        <el-table-column
          prop="lastLoginIp"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          min-width="120"
          label="登录IP">
        </el-table-column>
        <el-table-column
          prop="lastLoginDate"
          header-align="center"
          align="center"
          :show-overflow-tooltip="true"
          min-width="180"
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
import gtBoderButton from '@/components/gt-border-button'
export default {
  name:'sys-user',
  data () {
    return {
      dataForm: {
        userName: null
      },
      dataList: [],
      currentPage : 1,
      pageSize: 20,
      total: 0,
      dataListLoading: false,
      addOrUpdateVisible: false
    }
  },
  components: { AddOrUpdate, gtPagination, gtBoderButton },
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
        url: this.$http.adornUrl('/sys/mop/sysUser/list'),
        method: 'post',
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

    // 删除mop用户
    deleteRow (userId) {
      this.$easyConfirm.show({
        title: '提示',
        content: '您确定要删除该用户吗？',
        confirm: async () => {
          const { data } = await this.$http({
            url: this.$http.adornUrl(`/sys/mop/sysUser/delete/${userId}`),
            method: 'get',
          })
          if (data && data.code === 0) {
            this.$message.success('删除成功！')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    reset (isSearch){
      if(isSearch != 'search'){
        this.dataForm.userName = ''
      }
      this.pageSize = 20
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
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>

<template>
  <div class="mod-role sysItems mod-store">
    <el-card>
      <el-form :inline="true" :model="dataForm" @keyup.enter.native="reset('search')">
        <el-form-item style="margin-bottom: 0;">
          <el-input v-model="dataForm.roleName" placeholder="角色名称" clearable></el-input>
        </el-form-item>
        <el-form-item  style="margin-bottom: 0;display: inline-block;float: right;" v-if="isAuth('sys:role:list')">
          <gt-button type="search" @click.native="reset('search')"/>
          <gt-button type="reset" @click.native="reset()" />
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('sys:role:add')" type="create" @click.native="addOrUpdateHandle()"/>
      <el-table
        :data="dataList"
        border
        v-table-height
        :stripe="true"
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column
          header-align="center"
          align="center"
          v-if="isAuth('sys:role:update')"
          width="80"
          label="操作">
          <template slot-scope="scope">
            <el-button style="padding: 0!important;" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          header-align="center"
          align="center"
          min-width="100"
          :show-overflow-tooltip="true"
          label="角色名称">
        </el-table-column>
        <el-table-column
          prop="remark"
          header-align="center"
          align="center"
          min-width="150"
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
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList"></add-or-update>
  </div>
</template>

<script>
import AddOrUpdate from './role-add-or-update'
import gtPagination from '@/components/gt-pagination'
export default {
  name:'sys-role',
  data () {
    return {
      dataForm: {
        roleName: null
      },
      dataList: [],
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
  created () {
    if(this.isAuth('sys:role:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    getDataList () {
      this.dataListLoading = true
      this.$http({
        url: this.$http.adornUrl('/sys/mop/sysRole/list'),
        method: 'post',
        data: this.$http.adornData({
          'currentPage': this.currentPage,
          'pageSize': this.pageSize,
          'name': this.dataForm.roleName
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
    reset (isSearch){
      if(isSearch != 'search'){
        this.dataForm.roleName = ''
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
    },
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/sys/index.scss';
</style>

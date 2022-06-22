<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="staff" :inline="true" ref='staff' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="员工信息" prop='keyword'>
          <el-input v-model="staff.keyword" placeholder="员工姓名/手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工类型" prop='type'>
          <el-select v-model="staff.type"  @change="changeType" placeholder="请选择员工类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工角色" prop='sysRoleId'>
          <el-select v-model="staff.sysRoleId" placeholder="请选择员工角色" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffRole"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="所属门店" prop='storeId'  v-if="isAuth('order:company:company:select')">
          <el-select v-model="staff.storeId" placeholder="请选择门店" filterable clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="员工状态" prop='status'>
          <el-select v-model="staff.status" placeholder="请选择员工状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffState"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item style="display: inline-block;float: right;">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" @click.native="() => addOrEditStaff()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          min-width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="staffViewHandle(scope.row.id)">查看</el-button>
            <span v-if="scope.row.sysRoleId !== -1">|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
              v-if="scope.row.sysRoleId !== -1">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div v-if="scope.row.status === 'ENABLE'" class="buttonOne buttonOne1" @click="addOrEditStaff(scope.row.id)">编辑</div>
              <div v-if="scope.row.status === 'ENABLE'" class="buttonOne" @click="openOrClose(scope.row)">停用</div>
              <div v-if="scope.row.status === 'ENABLE'" class="buttonOne" @click="changePhone(scope.row.id)" style="margin-bottom: 0">变更登录账号</div>
              <div v-if="scope.row.status === 'LEAVE'" class="buttonOne" @click="openOrClose(scope.row)">启用</div>
              <div v-if="scope.row.status === 'LEAVE'" class="buttonOne" @click="deleteHandle(scope.row.id)" style="margin-bottom: 0">不看他</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="80"
          :show-overflow-tooltip="true"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="100"
          :show-overflow-tooltip="true"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="员工类型">
          <template slot-scope="scope">
            <span>{{scope.row.type === 'STORE' ? '门店员工' : '企业员工'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="所属门店">
        </el-table-column>
        <el-table-column
          prop="sysRoleName"
          min-width="120"
          :show-overflow-tooltip="true"
          label="员工角色">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="80"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, staffState))">{{filterStatus(scope.row.status, staffState)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="120"
          :show-overflow-tooltip="true"
          label="注册时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-chphone v-if="chPhone" ref="refPhone" @refreshDataList="getDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'//分页
import { staffState,staffType } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import { getStoreList } from '@/service/systore'
import gtChphone from './component/changePhone'
import * as api from '@/service/staffManagement'
import { getRoleDetail,getStoreRoleDetail,updateStatus } from '@/service/staffManagement'
import { number } from '@/utils/validate'
import moment from 'moment'
export default {
  name: 'staffManagement-staffList',
  data () {
    return {
      filterStatus,
      filterColor,
      number,
      dataList: [],
      dataListLoading: false,
      chPhone:false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      staff: {
        keyword: null,
        type: null,
        storeId: '',
        sysRoleId:'',
        // position: '',
        status: '',
      },
      storeName:{},
      id:{},
      name:{},
      Phone:{},
      staffType,
      staffRole:[],
      State:{},
      order:{
        storeId: '',
        orderNo:null,
        payType:'',
        startTime:null,
        endTime:null
      },
      storeList: [],
      companyList: [],
      staffState
    }
  },
  components: {
    gtPagination, gtChphone
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'staff-view'){
        vm.reload()
      }
    })
  },
  created () {
    // 获取订单列表
    if(this.isAuth('company:employee:list')){
      this.getDataList()
    }
    // 获取所属门店
    if(this.isAuth('order:company:company:select')){
      this.getStoreList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getStaffList({
        ...this.staff,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 导出员工列表
    async exportExcel() {
      const { data, headers } = await api.exportStaffExcel({
        ...this.staff,
        storeId: this.staff.storeId || null,
        sysRoleName: this.staff.sysRoleName || null,
        status: this.staff.status || null,
        size: 10000,
        page: 0
      })
      fileDownload(data, '员工列表.xls')
    },
    // 获取员工角色
    async changeType() {
      this.staff.sysRoleId = ''
      if (this.staff.type === 'COMPANY') {
        const { data } = await getRoleDetail()
        if (data.code === 0) {
          this.staffRole = data.data
        } else {
          this.$message.error('获取企业员工角色失败')
        }
      } else if (this.staff.type === 'STORE'){
        const { data } = await getStoreRoleDetail()
        if (data.code === 0) {
          this.staffRole = data.data
        } else {
          this.$message.error('获取门店员工角色失败')
        }
      }
      const { data } = await getStoreList({
        status:1
      })
      if (this.staff.type === 'COMPANY') {
        this.staff.storeId = ''
        this.storeList = []
      } else {
        if (data.code === 0) {
          this.storeList = data.data
        } else {
          this.$message.error('获取门店列表失败')
        }
      }
    },
    // 获取对应企业的门店列表
    async getStoreList() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.storeList = data.data
      } else {
        this.$message.error('获取门店列表失败')
      }
    },
    // 新增/修改
    addOrEditStaff(id){
      this.$router.push({name:'staff-add-or-edit', query: {id}})
    },
    // 关闭or启用
    openOrClose(row) {
      this.$easyConfirm.show({
        title: '提示',
        content: `${row.status != 'LEAVE' ? (row.type === 'STORE' ? ('停用后，将清空归属于该员工名下的顾客<br/>确定要停用 ' + row.name + ' 的账号吗？') : ('确定要停用 ' + row.name + ' 的账号吗？')) : '确定要启用 ' + row.name + ' 的账号吗？'}`,
        confirm: async () => {
          const { data } = await updateStatus({
            id:row.id,
            status:row.status === 'ENABLE' ? 'LEAVE' : 'ENABLE'
          })
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('修改成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 删除
    deleteHandle (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该员工',
        confirm: async () => {
          const { data } = await api.deleteStaff(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    //变更手机号
    changePhone(id){
      this.chPhone = true
      this.$nextTick(() => {
        this.$refs.refPhone.init(id)
      })
    },
    // 查看
    staffViewHandle (id){
      this.$router.push({name:'staff-view',query:{id}})
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
        this.$refs['staff'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>


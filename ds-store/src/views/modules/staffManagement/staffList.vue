<template>
  <div class="mod-store customers">
    <el-card>
      <!-- 查询条件 -->
      <el-form :model="staff" :inline="true" ref='staff' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
        <el-form-item label="姓名/手机号" prop='staffNo'>
          <el-input v-model="staff.keyword" placeholder="请输入员工姓名/编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="员工岗位" prop='position'>
          <el-select v-model="staff.position" placeholder="请选择员工岗位" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in staffQuarters"
              :key="item.value"
              :label="item.label"
              :value="item.value">
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
        <el-form-item style="display: inline-block;float: right;" >
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" type="create" @click.native="() => addStaff()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        v-table-height
        style="width: 100%;">
        <el-table-column
          prop="index"
          width="55"
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
            <span>|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" @click="editStaff(scope.row.id)">编辑</div>
              <div class="buttonOne" @click="deleteHandle(scope.row.id)" style="margin-bottom: 0">删除</div>
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
          prop="position"
          min-width="120"
          :show-overflow-tooltip="true"
          label="员工岗位">
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
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { paymentOfMode } from '@/utils/dict'
import { staffQuarters } from '@/utils/dict'
import { staffState } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import { getStoreList } from '@/service/systore'
import * as api from '@/service/staffManagement'
import { number } from '@/utils/validate'
import moment from 'moment'
export default {
  data () {
    return {
      filterStatus,
      filterColor,
      number,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      staff: {},
      storeName:{},
      id:{},
      name:{},
      Phone:{},
      staffQuarters,
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
      paymentOfMode,
      staffState
    }
  },
  components: {
    gtPagination
  },
  created () {
    // 获取订单列表
    // if(this.isAuth('company:employee:list')){
      this.getDataList()
    // }
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
    // 新增 / 修改
    addStaff (id) {
      this.$router.push({name:'staff-add', query: {id}})
    },
    // 修改
    editStaff (id) {
      this.$router.push({name:'staff-edit', query: {id}})
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


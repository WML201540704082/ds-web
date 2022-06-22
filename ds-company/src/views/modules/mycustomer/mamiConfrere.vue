<template>
	<div class="mod-store customers">
		<el-card>
			<el-form :model="mami" :inline="true" ref='mami' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
				<el-form-item label="姓名/手机号" prop='keyWord'>
						<el-input v-model="mami.keyWord" placeholder="请输入顾客姓名/手机号" clearable></el-input>
				</el-form-item>
				<el-form-item style="display: inline-block;float: right;">
						<gt-button type="search" @click.native="resetForm('search')"/>
						<gt-button type="reset" @click.native="resetForm('reset')"/>
				</el-form-item>
		  </el-form>
		</el-card>
    <!-- table列表 -->
    <el-card class="mode-store-table">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
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
          min-width="100"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="buyRecord(scope.row)">权益购买记录</el-button>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="100"
          :show-overflow-tooltip="true"
          label="顾客姓名">
          <template slot-scope="scope">
            <span>{{scope.row.name || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="nickName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="昵称">
          <template slot-scope="scope">
            <span>{{scope.row.nickName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          min-width="80"
          :show-overflow-tooltip="true"
          label="性别">
           <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.gender, sex))">{{filterStatus(scope.row.gender, sex) || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="100"
          :show-overflow-tooltip="true"
          label="手机号码">
        </el-table-column>
        <el-table-column
          prop="date"
          min-width="180"
          :show-overflow-tooltip="true"
          label="合伙人有效期">
          <template slot-scope="scope">
            <span>{{scope.row.startTime}}<span v-if="scope.row.endTime !=null&&scope.row.startTime !=null">-</span>{{scope.row.endTime}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
	</div>
</template>
<script>
import gtPagination from '@/components/gt-pagination'//分页
import { sex } from '@/utils/dict'
import { filterStatus,filterColor } from '@/utils'
import { mamiConfree } from '@/service/mycustomer'
export default {
  name:'mycustomer-mamiConfrere',
  data(){
    return{
      sex,
      filterStatus,
      filterColor,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      mami:{},
    }
  },
  components: {
    gtPagination
  },
  created(){
    this.getDataList()
  },
  methods:{
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await mamiConfree({
        size: this.pageSize,
        page: this.currentPage,
        ...this.mami
      })
      if (data && data.code === 0) {
        this.dataList = data.data.records
        if(this.dataList&&this.dataList.length>0){
          this.dataList.map(o=>{
            var start = o.startTime
            var end = o.endTime
            var endtime = end.substring(0, 10)
            o.endTime = endtime.replace(/-/g, '/')
            var starttime = start.substring(0, 10)
            o.startTime = starttime.replace(/-/g, '/')
          })
        }
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.warning(data.msg)
      }
      this.dataListLoading = false
    },
    // 查看
    buyRecord (customer){
      const {customerId, name, phone} = customer
      this.$router.push({name:'buy-record',query:{customerId, name, phone}})
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
        this.$refs['mami'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style>

</style>

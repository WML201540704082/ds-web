<template>
  <div class="mod-store page-promote-list" v-loading="dataListLoading">
      <el-card>
        <!-- 查询条件 -->
        <el-form :inline="true" class="mode-form-line1" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
          <el-form-item label="促销状态" prop="status">
            <el-select v-model="filterForm.status" placeholder="请选择促销状态" clearable @change="isChange">
              <el-option label="全部" value="" ></el-option>
              <el-option
                v-for="item in fullStatus"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="促销时间">
            <gt-time-range
              start-time-prop="beginTime"
              :start-time-value="filterForm.beginTime"
              :end-time-value="filterForm.endTime"
              end-time-prop="endTime"
              @changeStartValue="value => filterForm.beginTime = value"
              @changeEndValue="value => filterForm.endTime = value"
            ></gt-time-range>
          </el-form-item>
          <el-form-item class="search-toolbar">
            <gt-button type="search" @click.native="resetForm('search')"/>
            <gt-button type="reset" @click.native="resetForm('reset')"/>
          </el-form-item>
        </el-form>
      </el-card>

      <!-- table列表 -->
      <el-card class="mode-store-table">
        <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="gt-table-create" type="create" txt="新建满减商品活动" @click.native="() => addOrUpdateHandle()"/>
        <gt-border-button v-if="newStore == 'false'" class="gt-table-create" type="create" txt="新建满减商品活动" @click.native="() => addOrUpdateHandle()"/>
        
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
            width="100"
            label="操作">
            <template slot-scope="scope">
              <el-button class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
              <span v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" >|</span>
              <el-popover
                v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'"
                class="popover"
                placement="bottom"
                width="100">
                <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
                <div class="buttonOne buttonOne1" v-if="scope.row.status != 'ACTIVITY'" @click="addOrUpdateHandle(scope.row.id,scope.row.status)">编辑</div>
                <div class="buttonOne" @click="deleteHandle(scope.row.id)">删除</div>
              </el-popover>
              <span v-if="newStore == 'false'" >|</span>
              <el-popover
                v-if="newStore == 'false'"
                class="popover"
                placement="bottom"
                width="100">
                <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
                <div class="buttonOne buttonOne1" v-if="scope.row.status != 'ACTIVITY'" @click="addOrUpdateHandle(scope.row.id,scope.row.status)">编辑</div>
                <div class="buttonOne" @click="deleteHandle(scope.row.id)">删除</div>
              </el-popover>
            </template>
          </el-table-column>
          <el-table-column
            prop="name"
            min-width="150"
            :show-overflow-tooltip="true"
            label="促销名称">
          </el-table-column>
          <el-table-column
            min-width="150"
            :show-overflow-tooltip="true"
            label="促销内容">
            <template slot-scope="scope">
              <span>{{getContent(scope.row)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="startTime"
            align="center"
            min-width="200"
            :show-overflow-tooltip="true"
            label="促销时间">
            <template slot-scope="scope">
              <span>{{moment(scope.row.startTime).format('YYYY/MM/DD') + ' - ' + moment(scope.row.endTime).format('YYYY/MM/DD')}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="status"
            align="center"
            min-width="140"
            :show-overflow-tooltip="true"
            label="促销状态">
            <template slot-scope="scope">
              <span :class="filterColor(filterStatus(scope.row.status, fullStatus))">{{filterStatus(scope.row.status, fullStatus)}}</span>
            </template>
          </el-table-column>
        </el-table>
        <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
      </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { fullStatus } from '@/utils/dict'
import { getFullPromoteList, deleteFullPromote } from '@/service/campaign'
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus, filterColor, chineseParse } from '@/utils'
import moment from 'moment'
import { getStore } from '@/utils/storage'
export default {
  name:'campaign-storePromotion-promote-list',
  data () {
    return {
      companyRoleName:null,
      newStore:null,
      dataList: [],
      isEmpty: true,
      dataListLoading: false,
      nowTime: moment().format('YYYY-MM-DD'),
      total: 0,
      pageSize: 20,
      currentPage: 0,
      moment,
      filterForm:{
        type: 'DISCOUNT',
        beginTime: '',
        endTime: '',
        status: ''
      },
      stores: [],
      fullStatus,
      filterStatus,
      filterColor,
      mainCategory: [],
      subCategory: []
    }
  },
  components: {
    gtPagination,
    gtTimeRange
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'promote-view'){
        vm.reload()
      }
    })
  },
  async created() {
     const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取商品列表
    await this.getDataList()
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getFullPromoteList({
        ...this.filterForm,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        if (data.data) {
          this.dataList = data.data.records.map(item => {
            return{
              ...item,
              status:moment(this.nowTime).valueOf() < moment(item.startTime).valueOf() ? 'STANDBY' : moment(this.nowTime).valueOf() > moment(item.endTime).valueOf() ? 'STOP' : 'ACTIVITY'
            }
          })
          this.total = data.data.total
        }
      } else {
        this.dataList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 新增 / 修改
    addOrUpdateHandle (id,status) {
      if (id) {
        this.$router.push({name:'full-add-or-update', query: {id:id,status:status}})
      } else {
        this.$router.push({name:'full-add-or-update', query: {id: ''}})
      }
    },
    // 删除
    deleteHandle (id) {
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除?',
        confirm: async () => {
          const { data } = await deleteFullPromote(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('删除成功')
            this.getDataList()
          } else {
            this.$easyConfirm.hide()
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 查看
    storeViewHandle (id){
      if (id) {
        this.$router.push({name:'full-view', query: {id}})
      } else {
        this.$message.error('数据有误')
      }
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },

       // 获取促销内容
    getContent(item) {
      let str = ''
      if (item.remitType === 'DISCOUNT') {//打折
        str = `满${this.priceNum(item.condition)}元打${this.priceNum(item.remit)}折`
      } else {//REMIT满减
        if (item.every) {
          str = `满${this.priceNum(item.condition)}元满减${this.priceNum(item.remit)}元(每满减)`
        }else{
          str = `满${this.priceNum(item.condition)}元满减${this.priceNum(item.remit)}元`
        }
      }
      return str
    },
    isChange(){
      this.isEmpty = false
    },
    // 重置
    resetForm(type) {
      if(this.filterForm.beginTime || this.filterForm.endTime){
        this.isEmpty = false
      }
      if (type==='reset') {
        this.$refs['filterForm'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
.page-promote-list{
  .tip{
    margin: 15px;
    font-size: 14px;
    color: #4d4d4d;
  }
  .go-to{
    font-size: 16px;
    text-align: center;
    margin: 30px 0;
    width: 100%;
  }
}
</style>



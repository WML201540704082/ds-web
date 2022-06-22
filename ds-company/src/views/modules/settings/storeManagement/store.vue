<template>
  <div class="mod-store modStore">
    <el-card>
      <div class="mode-form-line" >
        <div class="mode-store-top">
          <icon-svg name="store" class="theme-color" style="font-size: 35px;vertical-align: middle;"></icon-svg>
          <!-- <img class="mode-store-img" src="static/img/setting/sg.png" alt=""> -->
          <span class="mode-store-name">门店管理</span>
          <span class="mode-store-distribution">连锁商户的门店集中管理，在这里完成。</span>
        </div>
      </div>

      <!-- 查询条件 -->
      <el-form :model='form' :inline="true" ref='form' class="mode-form-line1" @keyup.enter.native="resetForm('search')">
        <el-form-item label="门店信息" prop='key'>
          <el-input v-model="form.key" placeholder="门店名称/编码" clearable></el-input>
        </el-form-item>

        <!-- <el-form-item label="门店状态" prop='status'>
          <el-select v-model="form.status" placeholder="请选择门店状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in storeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="服务时间">
          <gt-time-range
            start-time-prop="serviceBeginDate"
            :start-time-value="form.serviceBeginDate"
            @changeStartValue="value => form.serviceBeginDate = value"
            :end-time-value="form.serviceEndDate"
            end-time-prop="serviceEndDate"
            @changeEndValue="value => form.serviceEndDate = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:store:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('company:store:add')" type="create" @click.native="addOrUpdateHandle()"/>
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
          label="操作"
          v-if="isAuth('company:store:detail')|| isAuth('company:store:update')||isAuth('company:store:submit')">
          <template slot-scope="scope">
            <el-button v-if="isAuth('company:store:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <span v-if="scope.row.status == -1 || scope.row.status == 1 || scope.row.status == 2">|</span>
            <!-- 正常营业状态 -->
            <el-button v-show="scope.row.status == 1" v-if="isAuth('company:store:update')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id,'normal')">编辑</el-button>
            <!-- 已驳回状态 -->
            <el-button v-show="scope.row.status == 2" v-if="isAuth('company:store:update')" class="nopadding" type="text" size="small" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
              v-show="scope.row.status == -1">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div v-if="isAuth('company:store:update')" class="buttonOne buttonOne1" @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne" v-if="isAuth('company:store:submit')" style="margin-bottom: 0" @click="submitList(scope.row.id)">提交</div>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column
          prop="code"
          min-width="100"
          :show-overflow-tooltip="true"
          label="门店编号">
          <template slot-scope="scope">
            <span>{{scope.row.code}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="150"
          align="center"
          :show-overflow-tooltip="true"
          label="门店名称">
        </el-table-column>
        <el-table-column
          prop="storeCategory"
          :show-overflow-tooltip="true"
          min-width="120"
          label="门店类型"
          v-if="newStore == 'true'">
          <template slot-scope="scope">
            <!-- <span v-if="!scope.row.type" :class="filterColor(filterStatus(scope.row.storeCategory, storeB))">{{filterStatus(scope.row.storeCategory, storeB)}}</span> -->
            <span>{{scope.row.type == "NEW_RETAIL_AND_DRINK" ? "新零售+茶饮" : "新零售"}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="linkman"
          min-width="100"
          :show-overflow-tooltip="true"
          label="联系人">
        </el-table-column>
        <el-table-column
          prop="phone"
          :show-overflow-tooltip="true"
          min-width="120"
          label="联系电话">
        </el-table-column>
        <el-table-column
          prop="address"
          min-width="180"
          :show-overflow-tooltip="true"
          label="地址">
          <template slot-scope="scope">
            <span>{{`${scope.row.province || ''}${scope.row.city || ''}${scope.row.district || ''}${scope.row.address || ''}`}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.status, storeStatus))">{{filterStatus(scope.row.status, storeStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="serviceBeginDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="服务时间">
          <template slot-scope="scope">
            <span>{{scope.row.serviceBeginDate}}<span v-if="scope.row.serviceEndDate !=null&&scope.row.serviceBeginDate !=null">至</span>{{scope.row.serviceEndDate}}</span>
          </template>
        </el-table-column>
      </el-table>
      <gt-pagination :isorder="1" :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>

    </el-card>
  </div>
</template>

<script>
import { storeStatus, storeB } from '@/utils/dict'
import { filterStatus, filterColor } from '@/utils'
import gtPagination from '@/components/gt-pagination'
import gtTimeRange from '@/components/gt-time-range'
import { getStore } from '@/utils/storage'
import * as api from '@/service/setting'
export default {
  name: 'settings-store',
  data () {
    return {
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 1,
      form:{
        key:null,
        status:'',
        serviceBeginDate:null,
        serviceEndDate:null,
        soonExpire: null
      },
      storeStatus,
      storeB,
      filterStatus,
      filterColor,

    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  inject: ['reload'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'store-view'){
        vm.reload()
      }
    })
  },
  created () {
    const { soonExpire } = this.$route.params
    this.form.soonExpire = soonExpire
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    if(this.isAuth('company:store:list')){
      this.getDataList()
    }
  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const {data} = await api.getStoresList({
        pageSize: this.pageSize,
        currentPage: this.currentPage,
        ...this.form,
        status: 1
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
      } else {
        this.dataList = []
        this.total = 0
      }
    },
    // 提交
    async submitList (id){
      const data = await api.getStoresSubmit(id)
      this.$message.success('提交成功')
      this.getDataList()
    },
    // 新增 / 修改
    addOrUpdateHandle (id) {
      this.$router.push({name:'store-add-or-update',query:{id:id}})
    },
    // 查看
    storeViewHandle (id,type){
      this.$router.push({name:'store-view',query:{id:id,type:type}})
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['form'].resetFields()
        this.pageSize = 20
        this.form.soonExpire = null
      }
      this.currentPage = 1
      this.getDataList()
    },
  }
}
</script>



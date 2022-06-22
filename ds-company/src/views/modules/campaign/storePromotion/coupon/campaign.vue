<template>
  <div class="mod-store">
    <el-card>
      <!-- 查询条件 -->
      <el-form :inline="true" class="mode-form-line" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="filterForm.name" placeholder="请输入优惠券名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-select v-model="filterForm.type" placeholder="请选择优惠券类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in couponType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="适用门店" prop="storeId"  v-if="isAuth('compaign:company:company:select')">
          <el-select multiple v-model="filterForm.storeId" placeholder="请选择适用门店" filterable clearable>
            <!-- <el-option  label="全部门店" value="all" ></el-option> -->
            <el-option
              v-for="item in stores"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
         <el-form-item label="适用渠道" prop="channel">
          <el-select v-model="filterForm.channel" placeholder="请选择适用渠道" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in channelList"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="有效日期">
          <gt-time-range
            start-time-prop="effectiveBeginDate"
            :start-time-value="filterForm.effectiveBeginDate"
            @changeStartValue="value => filterForm.effectiveBeginDate = value"
            :end-time-value="filterForm.effectiveEndDate"
            end-time-prop="effectiveEndDate"
            @changeEndValue="value => filterForm.effectiveEndDate = value"
            type="date"
          ></gt-time-range>
        </el-form-item>
        <el-form-item class="search-toolbar" v-if="isAuth('company:coupon:list')">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button class="gt-table-create" v-if="isAuth('company:coupon:add') && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" type="create" @click.native="() => addOrUpdateHandle()"/>
      <gt-border-button class="gt-table-create" v-if="isAuth('company:coupon:add') && newStore == 'false'" type="create" @click.native="() => addOrUpdateHandle()"/>
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
          width="60"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="120"
          label="操作"
          v-if="isAuth('company:coupon:detail')||isAuth('company:coupon:delete')">
          <template slot-scope="scope">
            <el-button v-if="isAuth('company:coupon:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <span v-show="isAuth('company:coupon:delete')" v-if="scope.row.status === 0 && scope.row.type !== 3 && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'">
              <span v-if="isAuth('company:coupon:detail')&&isAuth('company:coupon:delete')">|</span>
              <el-popover
              class="popover"
              placement="bottom"
              width="100">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1"  @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne"  @click="deleteHandle(scope.row.id)">删除</div>
              <div class="buttonOne" type="text" size="small" @click="deleteCoupon(scope.row.id, scope.row.sendStatus)">{{scope.row.sendStatus === 0 ? '停止' : '恢复'}}发放</div>
            </el-popover>
            </span>
            <span v-show="isAuth('company:coupon:delete')" v-if="scope.row.status === 0 && scope.row.type !== 3 && newStore == 'false'">
              <span v-if="isAuth('company:coupon:detail')&&isAuth('company:coupon:delete')">|</span>
              <el-popover
              class="popover"
              placement="bottom"
              width="100">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1"  @click="addOrUpdateHandle(scope.row.id)">编辑</div>
              <div class="buttonOne"  @click="deleteHandle(scope.row.id)">删除</div>
              <div class="buttonOne" type="text" size="small" @click="deleteCoupon(scope.row.id, scope.row.sendStatus)">{{scope.row.sendStatus === 0 ? '停止' : '恢复'}}发放</div>
            </el-popover>
            </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          min-width="120"
          :show-overflow-tooltip="true"
          label="优惠券名称">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="100"
          :show-overflow-tooltip="true"
          label="优惠券类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type, couponType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          min-width="120"
          :show-overflow-tooltip="true"
          label="优惠价值">
          <template slot-scope="scope">
            <span>{{getRule(scope.row.type, scope.row.typeRule)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          min-width="180"
          :show-overflow-tooltip="true"
          label="有效日期">
          <template slot-scope="scope">
            <span v-if="scope.row.expiryDateType === 'DATETIME'">{{scope.row.effectiveDate}}</span>
            <span v-else>自发放之日起 {{scope.row.effectiveDay}} 天</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="applyToStores"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
        </el-table-column>
        <el-table-column
          prop="channel"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用渠道">
          <template slot-scope="scope">
            <span>{{scope.row.channel == 0 ? '线上+线下':scope.row.channel == 2 ? '线下' : '线上'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="grantNum "
          :show-overflow-tooltip="true"
          min-width="100"
          label="发放数量">
          <template slot-scope="scope">
            <span class="theme-color" style="cursor:pointer" @click="sendNumber(scope.row.id,scope.row.name,scope.row.type,scope.row.typeRule)">{{scope.row.grantNum}}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column
          prop="getNum"
          :show-overflow-tooltip="true"
          min-width="100"
          label="领取数量">
        </el-table-column> -->
        <el-table-column
          prop="useNum"
          min-width="100"
          :show-overflow-tooltip="true"
          label="使用数量">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { couponType,channelList} from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import * as api from '@/service/campaign'
import { getStoreList } from '@/service/systore.js'
import { filterStatus, fileDownload } from '@/utils'
import { getStore } from '@/utils/storage'
export default {
  name:'campaign-storePromotion-coupon-campaign',
  data () {
    return {
      companyRoleName:null,
      newStore:null,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      filterForm:{
        name: null,
        type: '',
        storeId: '',
        effectiveBeginDate: null,
        effectiveEndDate: null,
        channel:'',//适用渠道（查询）
      },
      couponType,
      channelList,
      filterStatus,
      stores: []
    }
  },
  components: {
    gtPagination, gtTimeRange
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name !== 'campaign-view'){
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
    // 获取门店列表
    if(this.isAuth('compaign:company:company:select')){
      this.getStores()
    }

    // 获取优惠券列表
    if(this.isAuth('company:coupon:list')){
      this.getDataList()
    }

  },
  methods: {
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getCouponList({
        ...this.filterForm,
        storeId: this.filterForm.storeId ? this.filterForm.storeId.join(',') : null,
        size: this.pageSize,
        page: this.currentPage
      })
      if (data.code === 0) {
        const { records = [], total = 0 } = data.data || {}
        this.dataList = records
        this.total = total
      } else {
        this.dataList = []
        this.total = 0
        this.$message.error(data.msg)
      }
      this.dataListLoading = false

    },

    // 导出优惠券列表
    async exportExcel() {
      const criteria = {
        ...this.filterForm,
        type: this.filterForm.type || null,
        storeId: this.filterForm.storeId ? this.filterForm.storeId.join(',') : null,
      }
      this.exportList(this.total, '优惠券列表', 'COMPANY_COUPON', criteria, async () => {
        const { data, headers } = await api.exportCouponExcel({
          ...criteria,
          size: 10000,
          page: 0,
        })
        fileDownload(data, '优惠券列表.xls')
      })
    },
    getRule(type, typeRule) {
      if (type !== null && type !== '' && type !== undefined && typeRule) {
        let ruleName = ''
        switch (type) {
        case 0:
          ruleName = typeRule + '折'
          break
        case 2:
          ruleName = '--'
          break
        case 1:
          const arr = typeRule.split(',')
          if (arr && arr.length === 2) {
            ruleName = `满${arr[0]}减${arr[1]}`
          } else if (arr.length === 1) {
            ruleName = `减${arr[0]}`
          } else {
            ruleName = '--'
          }
          break
        default:
          ruleName = '--'
        }
        return ruleName
      } else {
        return '--'
      }
    },
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.stores = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    // 新增 / 编辑
    addOrUpdateHandle (id) {
      this.$router.push({name:'campaign-add', query: {id}})
    },
    //删除优惠券
    async deleteHandle(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定删除该优惠券？',
        confirm: async () => {
          const { data } = await api.deleteCampain({id})
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('该优惠券删除成功！')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
            this.$easyConfirm.hide()
          }
        }
      })
    },
    // 发送数量
    sendNumber(id,name,type,typeRule){
      this.$router.push({name:'coupon-sendList', query: {id,name,type,typeRule}})
    },
    // 删除
    deleteCoupon (id, sendStatus) {
      this.$easyConfirm.show({
        title: '提示',
        content: `确定${sendStatus === 1 ? '恢复' : '失效'}该优惠券`,
        confirm: async () => {
          const { data } = await api.deleteCoupon(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success(`${sendStatus === 1 ? '恢复' : '失效'}成功`)
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'campaign-view', query: {id}})
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
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

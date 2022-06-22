<template>
  <div class="mod-store">
    <el-card>
      <gt-sub-title style="margin-top:-10px" title="发券礼包说明"/>
      <div style="margin-left:20px">• 创建新人礼/进店有礼活动；创建新人礼/进店有礼活动；</div>
      <div class="info_text">• 新注册顾客进店后，系统自动为顾客推送“新人礼”券，可以从领券中心领取；</div>
      <div class="info_text">• 每位登录小店的顾客，在活动时间内都可领取“进店有礼”优惠券。</div>
    </el-card>
    <el-card style="margin-top:10px">
      <!-- 搜索条件 -->
      <el-form :inline="true" class="mode-form-line1" ref="giftBag" :model="giftBag" @keyup.enter.native="resetForm('search')">
        <el-form-item label="活动名称" prop='name'>
        <el-input v-model="giftBag.name" placeholder="请输入活动名称" clearable></el-input>
        </el-form-item>
        <el-form-item label="活动类型" prop='type'>
          <el-select v-model="giftBag.type" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activityType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态" prop='status'>
          <el-select v-model="giftBag.status" placeholder="请选择状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in giftActivityStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item class="search-toolbar">
          <gt-button type="search" @click.native="resetForm('search')"/>
          <gt-button type="reset" @click.native="resetForm('reset')"/>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="mode-store-table">
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="gt-table-create" txt="新人礼" @click.native="() => new_or_update_people()"/>
      <gt-border-button v-if="newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="gt-table-create" txt="进店有礼" @click.native="() => new_or_update_onstore()"/>
      <gt-border-button v-if="newStore == 'false'" class="gt-table-create" txt="新人礼" @click.native="() => new_or_update_people()"/>
      <gt-border-button v-if="newStore == 'false'" class="gt-table-create" txt="进店有礼" @click.native="() => new_or_update_onstore()"/>
      
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
          min-width="120"
          label="操作">
          <template slot-scope="scope">
            <el-button class="nopadding" type="text" size="small" @click="viewDetails(scope.row.id,scope.row.effectiveDate,scope.row.storeRange,scope.row.type)">查看</el-button>
            <span v-if="scope.row.status !== 'STOP' && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'">|</span>
            <el-button v-if="scope.row.status=='STANDBY' && scope.row.type == 'NEW_GIFT' && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="nopadding" type="text" size="small" @click="new_or_update_people(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status=='STANDBY' && scope.row.type == 'ON_STORE' && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="nopadding" type="text" size="small" @click="new_or_update_onstore(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status=='ACTIVITY' && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'" class="nopadding" type="text" size="small" @click="becomeFailure(scope.row.id)">使失效</el-button>
            <span v-if="scope.row.status !== 'STOP' && newStore == 'true'&& companyRoleName =='数据运维（技术服务）'">|</span>
            <el-button v-if="scope.row.status=='STANDBY' && scope.row.type == 'NEW_GIFT' && newStore == 'false'" class="nopadding" type="text" size="small" @click="new_or_update_people(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status=='STANDBY' && scope.row.type == 'ON_STORE' && newStore == 'false'" class="nopadding" type="text" size="small" @click="new_or_update_onstore(scope.row.id)">编辑</el-button>
            <el-button v-if="scope.row.status=='ACTIVITY' && newStore == 'false'" class="nopadding" type="text" size="small" @click="becomeFailure(scope.row.id)">使失效</el-button>
          
          </template>
        </el-table-column>
        <el-table-column
          prop="name"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活动名称">
        </el-table-column>
        <el-table-column
          prop="type"
          min-width="120"
          :show-overflow-tooltip="true"
          label="礼包类型">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.type,activityType)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="effectiveDate"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="活动有效期">
        </el-table-column>
        <el-table-column
          prop="status"
          min-width="100"
          :show-overflow-tooltip="true"
          label="状态">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.status,giftActivityStatus)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="storeRange"
          align="center"
          min-width="150"
          :show-overflow-tooltip="true"
          label="适用门店">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
  </div>
</template>
<script>
import gtSubTitle from '@/components/gt-sub-title'
import { activityType,giftActivityStatus } from '@/utils/dict'
import { filterStatus } from '@/utils'
import { getInvalidate,getGiftBagList } from '@/service/campaign'
import gtPagination from '@/components/gt-pagination'
import { getStore } from '@/utils/storage'
export default {
  name: 'campaign-giftBag-giftBag',
  data(){
    return{
      companyRoleName:null,
      newStore:null,
      activityType,
      giftActivityStatus,
      filterStatus,
      dataList: [],
      dataListLoading: false,
      total: 0,
      pageSize: 20,
      currentPage: 0,
      giftBag:{
        name: null,
        type:'',
        status:''
      },
    }
  },
  components: {
    gtSubTitle,gtPagination
  },
  async created() {
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
    // 获取列表
    this.getDataList()
  },
  methods:{
    //获取详情
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getGiftBagList({
        ...this.giftBag,
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
    //新人礼
    new_or_update_people(id){
      if (id) {
        this.$router.push({name:'campaign-giftBag-newPeople', query: {id}})
      } else {
        this.$router.push({name:'campaign-giftBag-newPeople'})
      }
    },
    new_or_update_onstore(id){
      if (id) {
        this.$router.push({name:'campaign-giftBag-newInstore', query: {id}})
      } else {
        this.$router.push({name:'campaign-giftBag-newInstore'})
      }
    },
    //查看
    async viewDetails(id,effectiveDate,storeRange,type){
      this.$router.push({name:'giftBag-view', query: {id:id,effectiveDate:effectiveDate,storeRange:storeRange,type:type}})
    },
    //使失效
    async becomeFailure(id){
      this.$easyConfirm.show({
        title: '提示',
        content: '确定更改为失效状态？',
        confirm: async () => {
          const { data } = await getInvalidate(id)
          if (data.code === 0) {
            this.$easyConfirm.hide()
            this.$message.success('操作成功')
            this.getDataList()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.getDataList()
    },
    // 重置
    resetForm(type) {
      if (type==='reset') {
        this.$refs['giftBag'].resetFields()
        this.pageSize = 20
      }
      this.currentPage = 0
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  .info_text{
    margin: 10px 20px;
  }
</style>
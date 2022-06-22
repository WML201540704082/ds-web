<template>
  <div class="mod-store customers page-customer-list">
    <el-card>
      <gt-advance ref="advance" @refreshSearch="getList"/>
    </el-card>
    <img class="more-icon"  @click="showFlag" :tag-f="tagF" :src="`static/img/mycustomer/${isFlag?'page-close.png': 'page-open.png'}`" />

    <!-- table列表 -->
    <el-card class="mode-store-table">
      <gt-border-button v-if="isAuth('store:customer:add')" class="gt-table-create" type="create" @click.native="addOrUpdateHandle()"/>
      <gt-border-button v-if="storeRoleName == '店长'" class="gt-table-create" txt="优惠券营销" type="grant" @click.native="couponMarketing()"/>
      <gt-border-button class="gt-table-create" txt="短信营销" v-if="isAuthMenu('campaign_sms')" type="dx" @click.native="dxMarketing()"/>
      <gt-border-button class="gt-table-create" txt="微信营销" type="wx" @click.native="wxMarketing()"/>
      <gt-border-button class="gt-table-create" txt="设置顾客归属" v-if="storeRoleName == '店长'" type="bind" @click.native="customerbind()"/>
      <gt-border-button class="gt-table-create" txt="修改会员等级" v-if="storeRoleName == '店长'" type="level" @click.native="setLevel()"/>
      <gt-border-button type="export" class="gt-table-create" txt="下载查询结果" @click.native="() => exportExcel()"/>
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        :stripe="true"
        @selection-change="selectionChangeHandle"
        @row-dblclick="doubleClick"
        ref="customerTableList"
        v-table-height
        style="width: 100%;">
        <el-table-column
          type="selection"
          header-align="center"
          align="center"
          width="50">
        </el-table-column>
        <el-table-column
          prop="index"
          width="55"
          label="序号">
          <template slot-scope="scope">
            <span>{{scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column
          width="100"
          label="操作"
        >
          <template slot-scope="scope">
            <el-button v-if="isAuth('store:customer:detail')" class="nopadding" type="text" size="small" @click="storeViewHandle(scope.row.id)">查看</el-button>
            <span>|</span>
            <el-popover
              class="popover"
              placement="bottom"
              width="100"
              v-if="isAuth('store:customer:update')||isAuth('store:customerCoupon:list')">
              <el-button class="nopadding"  slot="reference" type="text" size="small">更多</el-button>
              <div class="buttonOne buttonOne1" @click="addOrUpdateHandle(scope.row.id,scope.row.phone)">编辑</div>
              <div class="buttonOne" @click="setLevel(scope.row)" v-if="storeRoleName == '店长'">修改会员等级</div>
              <div class="buttonOne"  style="margin-bottom: 0" @click="previewYHJ(scope.row)">资产</div>
            </el-popover>
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
          prop="employee"
          min-width="100"
          :show-overflow-tooltip="true"
          label="归属员工">
          <template slot-scope="scope">
            <span>{{scope.row.employee || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="wechatName"
          min-width="100"
          :show-overflow-tooltip="true"
          label="昵称">
          <template slot-scope="scope">
            <span>{{scope.row.wechatName || '--'}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="gender"
          :show-overflow-tooltip="true"
          min-width="80"
          label="性别">
          <template slot-scope="scope">
            <span :class="filterColor(filterStatus(scope.row.gender, sex))">{{filterStatus(scope.row.gender, sex)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="phone"
          min-width="120"
          :show-overflow-tooltip="true"
          label="手机号">
        </el-table-column>
        <el-table-column
          prop="level"
          min-width="100"
          :show-overflow-tooltip="true"
          label="会员等级">
          <template slot-scope="scope">
            <span>{{filterStatus(scope.row.level, memberList)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="integral"
          min-width="100"
          :show-overflow-tooltip="true">
           <template slot="header" slot-scope="scope">
            <span @click="changeSort('integral')">
              积分
              <span v-if="customer.sort === 'integral'">
                <span v-if="realityAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.integral}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="cardAmount"
          min-width="120"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSort('cardAmount')">
              储值卡余额
              <span v-if="customer.sort === 'cardAmount'">
                <span v-if="realityAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.cardAmount}}</span>
          </template>
          <template slot-scope="scope" v-if="isAuth('store:rechargeRecord:selectList')">
            <span v-if="scope.row.rechargeTotalAmount&&scope.row.rechargeTotalAmount > 0" style="color:#FC5A3D;text-decoration: underline;cursor: pointer;" @click="storedValueCard(scope.row.id,scope.row.rechargeTotalAmount,scope.row.name,scope.row.phone)">{{priceNum(scope.row.cardAmount)}}</span>
            <span v-else >{{priceNum(scope.row.cardAmount)}}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="lastBuyDate"
          min-width="100"
          :show-overflow-tooltip="true">
          <template slot="header" slot-scope="scope">
            <span @click="changeSort('lastBuyDate')">
              上次消费
              <span v-if="customer.sort === 'lastBuyDate'">
                <span v-if="realityAsc"><img src="static/img/goods/topSale.png" alt="下"></span>
                <span v-else><img src="static/img/goods/downSale.png" alt="上"></span>
              </span>
              <span v-else><img src="static/img/goods/initial.png" alt="无"></span>
            </span>
          </template>
          <template slot-scope="scope">
            <span>{{scope.row.lastBuyDate}}</span>
          </template>
          <template slot-scope="scope">
            <span v-if="scope.row.lastBuyDate!=-1">
              <span v-if="scope.row.lastBuyDate == 0">1天之内</span>
              <span v-if="scope.row.lastBuyDate < 30&&scope.row.lastBuyDate >0">{{scope.row.lastBuyDate}}天前</span>
              <span v-if="scope.row.lastBuyDate >= 30&&scope.row.lastBuyDate < 365">{{parseInt(scope.row.lastBuyDate/30)}}月前</span>
              <span v-if="scope.row.lastBuyDate >= 365">{{parseInt(scope.row.lastBuyDate/365)}}年前</span>
            </span>
            <span v-else>未消费过</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="totalConsumption"
          min-width="120"
          :show-overflow-tooltip="true"
          label="累计消费">
           <template slot-scope="scope">
             <span>{{scope.row.totalOrders}}笔/{{priceNum(scope.row.totalConsumption)}}</span>
           </template>
        </el-table-column>
        <el-table-column
          prop="createTime"
          min-width="180"
          :show-overflow-tooltip="true"
          label="加入时间">
        </el-table-column>
      </el-table>
      <gt-pagination :total="total" :currentPage="currentPage" :pageSize="pageSize" @updatePagination="pagination_event"/>
    </el-card>
    <gt-mycustomer-yhj v-if="sendYhjVisible" ref="sendYhj" @refreshDataList="getOneDataList"/>
    <gt-mycustomer-bind v-if="bindVisible" ref="customerbind" @refreshDataList="getOneDataList"/>
    <gt-mycustomer-activity v-if="activityVisible" ref="customeractivity" @refreshDataList="getOneDataList"/>
    <gt-mycustomer-level v-if="levelVisible" ref="customerlevel" @refreshDataList="getOneDataList"/>
  </div>
</template>

<script>
import gtPagination from '@/components/gt-pagination'
import { sex,customerLevel } from '@/utils/dict'
import { filterStatus, filterColor, fileDownload } from '@/utils'
import gtMycustomerYhj from './mycustomer-sendYHJ'
import gtMycustomerBind from './customerbind'
import gtMycustomerActivity from './customerActivity'
import gtAdvance from './customerAdvance'
import gtMycustomerLevel from './customerLevel'
import { mapMutations } from 'vuex'
import { getCustomerList, exportExcel,levelList } from '@/service/mycustomer'
import moment from 'moment'
import _ from 'lodash'
export default {
  name:'mycustomer-mycustomer',
  data () {
    return {
      realityAsc:false,
      inTransitAsc:false,
      levelVisible: false,
      storeRoleName: null,
      activityVisible: false,
      bindVisible: false,
      sendYhjVisible: false,
      filterStatus,
      filterColor,
      dataList: [],
      dataListSelections:[],
      dataListLoading: false,
      total: 0,
      isFlag: false,
      pageSize: 20,
      currentPage: 0,
      customer:{
        sort:'',
      },
      sex,
      changePage: false,
      customerLevel,
      memberList:[],
      tagF: false
    }
  },
  components: {
    gtPagination,
    gtMycustomerYhj,
    gtAdvance,
    gtMycustomerBind,
    gtMycustomerActivity,
    gtMycustomerLevel
  },
  inject: ['reload', 'exportList'],
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if(from.name=='mycustomer-add-or-update'&&!from.query.id){
        vm.reload()
      }else if(from.name=='mycustomer-add-or-update'&&from.query.id){
        vm.allList()
      }
    })
  },
  created () {
    this.allList()
  },
  methods: {
    ...mapMutations({
      updateCustomerList: 'customer/updateCustomerList',
    }),
    allList(){
      const { storeRoleName = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
      this.storeRoleName = storeRoleName
      console.log(storeRoleName)
      this.getMemberList()
      this.getOneDataList()
    },
    //排序
     changeSort(type, asc) {
      this.customer.sort = type
      if (type === 'integral' || 'cardAmount' || 'lastBuyDate') {
        this.realityAsc = !this.realityAsc
        this.customer.asc = this.realityAsc
      } else {
        this.inTransitAsc = !this.inTransitAsc
        this.customer.asc = this.inTransitAsc
      }
      this.getDataList()
    },
    // 获取等级列表
    async getMemberList() {
      const { data } = await levelList()
      if (data && data.code === 0) {
        let memberList = []
        data.data.map(o=>{
          memberList.push({
            label:o.vipName,
            value:o.vipId
          })
        })

        memberList.splice(0, 0, {
          label: '普通',
          value: 'GENERAL'
        })
        this.memberList = memberList
      } else {
        this.memberList = []
        this.$message.warning(data.msg)
      }

    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await getCustomerList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.customer,
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        // 上次消费计算
        this.dataList.forEach(o=>{
          if(o.lastBuyDate){
            var endtime = moment(o.lastBuyDate)//结束时间
            var nowtime = moment()//当前时间
            var lefttime=parseInt((endtime.valueOf()-nowtime.valueOf())/1000)
            var d = Math.abs(parseInt(lefttime/(24*60*60)))
            o.lastBuyDate = d
          }else{
            o.lastBuyDate = -1
          }
        })
        this.$nextTick(() => {
          if (this.dataListSelections && this.dataListSelections.length > 0) {
            this.dataListSelections.forEach(row => {
              const currentRow = this.dataList.find(item => (item.id == row.id))
              if (currentRow) {
                this.$refs.customerTableList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.dataList = []
        this.total = 0
      }
    },
    // 获取数据列表（第一次走的list）
    async getOneDataList() {
      this.dataListLoading = true
      const { data } = await getCustomerList({
        size: this.pageSize,
        page: this.currentPage,
        ...this.customer,
        asc:true,
        sort:'creatTime'
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.dataList = data.data.records
        this.total = data.data.total
        // 上次消费计算
        this.dataList.forEach(o=>{
          if(o.lastBuyDate){
            var endtime = moment(o.lastBuyDate)//结束时间
            var nowtime = moment()//当前时间
            var lefttime=parseInt((endtime.valueOf()-nowtime.valueOf())/1000)
            var d = Math.abs(parseInt(lefttime/(24*60*60)))
            o.lastBuyDate = d
          }else{
            o.lastBuyDate = -1
          }
        })
        this.$nextTick(() => {
          if (this.dataListSelections && this.dataListSelections.length > 0) {
            this.dataListSelections.forEach(row => {
              const currentRow = this.dataList.find(item => (item.id == row.id))
              if (currentRow) {
                this.$refs.customerTableList.toggleRowSelection(currentRow)
              }
            })
          }
          this.changePage = false
        })
      } else {
        this.dataList = []
        this.total = 0
      }
    },
    // 导出订单列表
    async exportExcel() {
      this.exportList(this.total, '顾客列表', 'CUSTOMER', this.customer, async () => {
        const { data, headers } = await exportExcel({
          ...this.customer,
          size: 10000,
          page: 0,
        })
        fileDownload(data, '顾客列表.xls')
      })
    },
    //双击填入
    doubleClick(row){
      let originalList = _.cloneDeep(this.dataListSelections)
      originalList.push(row)
      this.dataListSelections = originalList
      this.$refs.customerTableList.toggleRowSelection(row)
    },
    // 优惠券营销
    couponMarketing(){
      if(this.dataListSelections.length == 0){
        this.$message.warning('请先选择顾客')
      }else{
        this.sendYhjVisible = true
        var customerIds = ''
        var customerIdarray = []
        this.dataListSelections.forEach(item => {
          customerIdarray.push(item.id)
        })
        customerIds = customerIdarray.join(',')
        this.$nextTick(() => {
          this.$refs.sendYhj.init(customerIds)
        })
      }
    },
    // 微信营销
    wxMarketing(){
      if(this.dataListSelections.length == 0){
        this.$message.warning('请先选择顾客')
      }else{
        this.activityVisible = true
        var customerIds = ''
        var customerIdarray = []
        this.dataListSelections.forEach(item => {
          customerIdarray.push(item.id)
        })
        customerIds = customerIdarray.join(',')
        this.$nextTick(() => {
          this.$refs.customeractivity.init(customerIdarray)
        })
      }

    },

    // 短信营销
    dxMarketing(){
      if(this.dataListSelections.length == 0){
        this.$message.warning('请先选择顾客')
      }else{
        this.updateCustomerList(this.dataListSelections)
        this.$router.push({name:'campaign-storePromotion-shortmessage-index'})
      }
    },
    // 设置顾客归属
    customerbind(){
      if(this.dataListSelections.length == 0){
        this.$message.warning('请先选择顾客')
      }else{
        this.bindVisible = true
        var customerIds = ''
        var customerIdarray = []
        this.dataListSelections.forEach(item => {
          customerIdarray.push(item.id)
        })
        customerIds = customerIdarray.join(',')
        this.$nextTick(() => {
          this.$refs.customerbind.init(customerIdarray)
        })
      }
    },
    // 设置会员等级
    setLevel(obj){
      if(obj){
        this.levelVisible = true
        this.$nextTick(() => {
          this.$refs.customerlevel.init(obj,this.memberList,'single')
        })
      }else{
        if(this.dataListSelections.length == 0){
          this.$message.warning('请先选择顾客')
        }else{
          this.levelVisible = true
          var customerIds = ''
          var customerIdarray = []
          this.dataListSelections.forEach(item => {
            customerIdarray.push(item.id)
          })
          customerIds = customerIdarray.join(',')
          this.$nextTick(() => {
            this.$refs.customerlevel.init(customerIds,this.memberList,'double')
          })
        }
      }

    },
    // 查看优惠券
    previewYHJ(obj){
      this.$router.push({name:'mycustomer-customerCard',query:{id:obj.id,name:obj.name,phone:obj.phone,type:'CZK',recharge: obj.cardAmount}})
    },

    // 储值卡记录
    storedValueCard(id,count,name,phone){
      this.$router.push({name:'mycustomer-storedValueCard',query:{id:id,count:count,name:name,phone:phone}})
    },
    // 多选
    selectionChangeHandle (pushList) {
      if (!this.changePage) {
        // 全部选中项
        const newList = _.cloneDeep(this.dataListSelections).filter(item => {
          return !this.dataList.some(ele => (ele.id == item.id))
        })
        const select = newList.concat(pushList)
        this.dataListSelections = select
      }
    },
    // 新增 / 修改
    addOrUpdateHandle (id,phone) {
      this.$router.push({name:'mycustomer-add-or-update',query:{id:id,phone: phone}})
    },
    // 查看
    storeViewHandle (id){
      this.$router.push({name:'mycustomer-view',query:{id:id}})
    },
    showFlag(){
      if(!this.isFlag){
        $('.button_check').toggle('1000')
        this.isFlag =!this.isFlag
      }else{
        $('.button_check').toggle('1000')
        this.tagF = false
        this.isFlag = !this.isFlag
      }
    },
    // 分页
    pagination_event(val) {
      this.pageSize = val.pageSize
      this.currentPage = val.currentPage
      this.changePage = true
      this.getOneDataList()
    },
    // 重置
    getList(obj) {
      this.customer = obj.customer
      if (obj.type==='reset') {
        this.pageSize = 20
      }
      this.dataListSelections = []
      this.changePage = false
      this.currentPage = 0
      this.getOneDataList()
    },
  }
}
</script>
<style lang="scss">
.page-customer-list{
  .more-icon{
    position: relative;
    top: -2px;
    width: 60px;
    left: calc(50% - 30px);
    cursor: pointer;
  }
}
</style>


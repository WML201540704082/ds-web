<template>
  <div v-loading="$store.state.loading.global">
    <el-form :model="customerInfo" ref="customerInfo" label-width="100px" class="viewForm" >

      <gt-subtitle title="基本信息" />
      <el-card style="margin-bottom: 10px;">
        <el-form-item label="顾客姓名">
          <span class="itemInput">{{customerInfo.name}}</span>
        </el-form-item>
        <el-form-item label="手机号码">
          <span class="itemInput">{{customerInfo.phone}}</span>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="customerInfo.gender" :disabled="true">
            <el-radio v-for="item in sex" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="加入时间">
          <span class="itemInput">{{customerInfo.createTime || '--'}}</span>
        </el-form-item>
        <el-form-item label="顾客生日">
          <span class="itemInput">{{customerInfo.birthday || '--'}}</span>
        </el-form-item>
        <el-form-item label="会员卡号">
          <span class="itemInput">{{customerInfo.cardNo || '--'}}</span>
        </el-form-item>
        <el-form-item label="密码">
          <span class="itemInput">{{customerInfo.password || '--'}}</span>
        </el-form-item>
        <!-- <el-form-item label="注册门店">
          <span class="itemInput">{{customerInfo.storeName || '--'}}</span>
        </el-form-item> -->
        <el-form-item label="归属员工">
          <span class="itemInput">{{customerInfo.employee || '--'}}</span>
        </el-form-item>
        <el-form-item label="推荐顾客">
          <span class="itemInput">{{customerInfo.referrer || '--'}}</span>
        </el-form-item>
        <el-form-item label="累计消费">
          <span class="itemInput">{{customerInfo.totalOrders}}笔/{{priceNum(customerInfo.totalConsumption)}}元</span>
        </el-form-item>
        <el-form-item label="积分">
          <span class="itemInput">{{customerInfo.integral}}</span>
        </el-form-item>
        <el-form-item :label="'收货地址'+(index+1)" v-show="customerInfo.addressList" v-for="(item,index) in customerInfo.addressList" :key="item.id">
          <span class="itemInput">{{item.fullAddress || (item.address||'--')}}</span>
          <br/>
          <span class="itemInput">收件人：{{item.name || '--'}}</span>
          <span class="itemInput" style="margin-left: 10px;">联系电话：{{item.phone || '--'}}</span>
        </el-form-item>
        <el-form-item label="顾客卡券" v-if="isAuth('store:customerCoupon:list')">
         <span class="previewYHJ theme-background" @click="previewYHJ('CZK')">储值卡</span>
          <span class="previewYHJ theme-background" @click="previewYHJ('YHJ')">优惠券</span>
          <span class="previewYHJ theme-background" @click="previewYHJ('JCK')">礼品卡</span>
          <span class="previewYHJ theme-background" @click="previewYHJ('JC')">寄存</span>
          <span class="previewYHJ theme-background" @click="previewYHJ('JF')">积分</span>
        </el-form-item>

        <el-form-item label="备注">
          <span class="itemInput">{{customerInfo.remark}}</span>
        </el-form-item>
      </el-card>

      <gt-subtitle title="宝宝信息" style="display:block;" v-if="customerInfo.babyList&&customerInfo.babyList.length!=0"/>
      <el-card style="margin-bottom: 10px;" v-if="customerInfo.babyList&&customerInfo.babyList.length!=0">
        <div v-for="(babyItem, index) in customerInfo.babyList" :key="index" class="inlines" style="width: 100%;">
          <el-col :span="22">
            <el-form-item label="宝宝姓名">
              <span class="itemInput">{{babyItem.name}}</span>
            </el-form-item>
            <el-form-item label="性别" >
              <el-radio-group v-model="babyItem.gender" :disabled="true">
                <el-radio v-for="item in babysex" :key="item.value" :label="item.value">{{item.label}}</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="生日">
              <span class="itemInput">{{babyItem.birthday}}</span>
            </el-form-item>
            <el-form-item  label="喂养方式">
              <span class="itemInput">{{filterStatus(babyItem.feedType, babyFeedMode) || '--'}}</span>
            </el-form-item>
          </el-col>
        </div>
      </el-card>

      <gt-subtitle title="顾客标签" style="display:block" v-if="customerInfo.tagList&&customerInfo.tagList.length>0"/>
      <el-card style="margin-bottom: 10px;" v-if="customerInfo.tagList&&customerInfo.tagList.length>0">
        <el-form-item label="顾客标签" style="width: 100%;">
          <div class="tagsOne">
            <span class="orange theme-border theme-nextb theme-color" v-show="item.source == 'STAFF'" v-for="item in customerInfo.tagList" :key="item.id">{{item.tag}} {{item.count || ''}}</span>
            <span class="pink" v-show="item.source !='STAFF'&&item.source !='ORDER'" v-for="item in customerInfo.tagList" :key="item.id">{{item.tag}} {{item.count || ''}}</span>
            <span class="zise" v-show="item.source == 'ORDER'" v-for="item in customerInfo.tagList" :key="item.id">{{item.tag}} {{item.count || ''}}</span>
          </div>
        </el-form-item>
      </el-card>

      <gt-subtitle title="回访/小记" v-if="customerInfo.Records&&customerInfo.Records.length>0"/>
      <el-card style="margin-bottom: 10px;" v-if="customerInfo.Records&&customerInfo.Records.length>0">
        <span>共{{customerInfo.Records.length}}条</span>
        <div v-for="(item, index) in customerInfo.Records" :key="index" class="inlines" style="width: 100%;">
          <el-col :span="22">
            <el-form-item label="员工">
              <span class="itemInput">{{item.employeeName}}</span>
            </el-form-item>
            <el-form-item label="项目">
              <span class="itemInput">{{filterStatus(item.workItem,workProject)}}</span>
            </el-form-item>
            <el-form-item label="时间">
              <span class="itemInput">{{item.createTime}}</span>
            </el-form-item>
            <el-form-item label="备注">
              <span class="itemInput">{{item.content}}</span>
            </el-form-item>
          </el-col>
        </div>
      </el-card>
    </el-form>
  </div>
</template>
<script>
import { sex,babysex,babyFeedMode,customerLevel ,workProject} from '@/utils/dict'
import gtSubtitle from '@/components/gt-sub-title'
import { filterStatus } from '@/utils'
import { getCustomerDetail,employeeSelect } from '@/service/mycustomer'
import { workRecords } from '@/service/workcords'
export default {
  name:'mycustomer-view',
  components:{ gtSubtitle },
  data(){
    return {
      workProject,
      sex,
      babysex,
      babyFeedMode,
      customerLevel,
      filterStatus,
      clerkList:[],
      clerkName: null,
      customerid: null,
      customerInfo: {
        name: null,
        phone: null,
        gender: null,
        birthday: null,
        babyList:[{
          id: null,
          name: null,
          gender: null,
          birthday: null,
          feedType: null
        }],
        label: null,
        cardNo: null,
        cardAmount: null,
        recommenderCustomer: null,
        recommenderStoreUser: null,
        storeName: null,
        tagList: [],
        Records:[]
      },

      page: 0,
      size: 10000
    }
  },
  mounted(){
    this.$nextTick(function () {
      this.customerid = this.$route.query.id || null
      this.getcustomerDetails(this.customerid)
    })
  },
  methods:{

    // 回访小计
    async workRecords(customerid){
      const {data} = await workRecords({
        customerId: customerid,
        page: this.page,
        size: this.size
      })
      if(data.code == 0){
        this.$set(this.customerInfo,'Records',data.data.records)
      }else{
        this.customerInfo.Records = []
      }
    },
    // 顾客详情
    async getcustomerDetails(customerId){
      if (customerId) {
        const data = await getCustomerDetail(customerId)
        this.customerInfo.babyList = data.babyList
        this.customerInfo = data
        // 顾客标签
        this.customerInfo.tagList = data.tagList
        this.workRecords(customerId)
      }
    },
    // 获取店员列表
    // async getClerkList(id){
    //   const {data} = await employeeSelect({
    //     'keyword':''
    //   })
    //   if(data.code == 0){
    //     this.clerkList = data.data
    //     for(var i in this.clerkList){
    //       if(this.clerkList[i].id == id){
    //         this.clerkName = this.clerkList[i].name
    //       }
    //     }
    //   }else{
    //     this.clerkList = []
    //   }
    // },
    // 查看优惠券
    previewYHJ(type){
      var param = {id:this.customerid,name:this.customerInfo.name,phone:this.customerInfo.phone,type:type}
      this.$router.push({name:'mycustomer-customerCard',query:param})
    }
  }
}
</script>
<style lang="scss">
@import '~@/assets/scss/mycustomer/index.scss';
</style>



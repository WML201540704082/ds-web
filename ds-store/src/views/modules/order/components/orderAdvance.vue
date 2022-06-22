<template>
  <div>
    <!-- 查询条件 -->
    <el-form :model="order" :inline="true" ref='order' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
      <span v-if="orderName!='activity'">
        <el-form-item label="退货单号" prop='id' v-if="orderName=='return'">
          <el-input v-model="order.id" placeholder="请输入退货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="退款单号" prop='id' v-else-if="orderName=='storedvalue'">
          <el-input v-model="order.id" placeholder="请输入退货单号" clearable></el-input>
        </el-form-item>
        <el-form-item label="订单编号" prop='id' v-else>
          <el-input v-model="order.id" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="顾客" prop='customerPhone' v-if="orderName=='exchange'||orderName=='storedvalue'">
          <el-input v-model="order.customerPhone" placeholder="请输入顾客手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="顾客" prop='phone' v-else>
          <el-input v-model="order.phone" placeholder="请输入顾客手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="退单类型" prop='returnType' v-if="orderName=='return'">
          <el-select v-model="order.returnType" placeholder="请选择退单类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in returnType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <span v-if="orderName !== 'mami'">
          <el-form-item label="退单渠道" prop='type' v-if="orderName=='return'">
            <el-select v-model="order.type" placeholder="请选择退单渠道" @change="changeType" clearable>
              <el-option  label="全部" value="" ></el-option>
              <el-option
                v-for="item in orderType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源" prop='orderSource' v-else-if="orderName=='exchange'">
            <el-select v-model="order.orderSource" placeholder="请选择订单来源" @change="changeType" clearable>
              <el-option  label="全部" value="" ></el-option>
              <el-option
                v-for="item in orderType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="订单来源" prop='type' v-else-if="orderName!='storedvalue'&&orderName!='activity'">
            <el-select v-model="order.type" placeholder="请选择订单来源" @change="changeType" clearable>
              <el-option  label="全部" value="" ></el-option>
              <el-option
                v-for="item in orderType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </span>
        <el-form-item label="订单类型" prop="orderType" v-if="orderName === 'mami'">
          <el-select v-model="order.orderType" placeholder="请选择订单类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in mamiType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop='orderStatus' v-if="orderName === 'mami'">
          <el-select v-model="order.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in mamiOrderStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop='orderStatus' v-if="orderName=='exchange'">
          <el-select v-model="order.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in retailOrder"
              v-show="item.value=='FINISH'"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop='stage' v-if="orderName=='retail'">
          <el-select v-model="order.stage" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in retailOrder"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="订单状态" prop='orderStatus' v-if="orderName=='exchange'">
          <el-select v-model="order.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in exchangeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item :label="orderName=='recharge' ? '充值项目' : '退款项目'" prop='cardType' v-if="orderName=='recharge' || orderName=='storedvalue'">
          <el-select v-model="order.cardType" @change="changeRechargeCardList" placeholder="请选择充值项目" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in rechargeProject"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item :label="orderName=='recharge' ? '充值卡名称' : '退卡名称'" prop='shoppingCardId' label-width="90px" v-if="(orderName=='recharge' || orderName=='storedvalue') && order.cardType == 'SHOPPING_CARD'">
          <el-select v-model="order.shoppingCardId" placeholder="请选择充值项目" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in rechargeCardList"
              :key="item.id"
              :label="item.cardName"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        
        <!-- <el-form-item label="退款状态" prop='stage' v-if="orderName=='return'">
          <el-select v-model="order.stage" placeholder="请选择退款状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in returnOrder"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="支付方式" prop='payType' v-if="orderName=='retail'">
          <el-select v-model="order.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in paymentOfMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式" prop='payType' v-if="orderName=='countcard'">
          <el-select v-model="order.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in countcardMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="支付方式" prop='payType' v-if="orderName=='recharge'">
          <el-select v-model="order.payType" placeholder="请选择支付方式" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in countcardMode"
              v-show="item.value!='CARD'"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="导购员" prop="guideId" v-if="orderName=='retail'||orderName=='return'">
          <el-select v-model="order.guideId" placeholder="请选择导购员" clearable @change="changeStock">
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in guideList"
              :key="item.id"
              :label="item.name"
              :value="item.userId">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退款方式" prop='payType' v-if="orderName=='return'">
          <el-select v-model="order.payType" placeholder="请选择退款方式" :disabled="order.type === 'WESHOP'" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in returnMode"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="兑换方式" prop='exchangeType' v-if="orderName=='exchange'">
          <el-select v-model="order.exchangeType" placeholder="请选择兑换方式" clearable>
            <el-option label="全部" value="" ></el-option>
            <el-option
              v-for="item in exchangeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="退单时间" v-if="orderName=='return'">
          <gt-time-range
            :isorder = 1
            start-time-prop="start"
            :start-time-value="order.start"
            :end-time-value="order.end"
            end-time-prop="end"
            @changeStartValue="value => order.start = value"
            @changeEndValue="value => order.end = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="退款时间"  v-else-if="orderName=='storedvalue'">
          <gt-time-range
            :isorder = 1
            start-time-prop="startTime"
            :start-time-value="order.startTime"
            :end-time-value="order.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => order.startTime = value"
            @changeEndValue="value => order.endTime = value"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="下单时间" v-else>
          <gt-time-range
            :isorder = 1
            start-time-prop="startTime"
            :start-time-value="order.startTime"
            :end-time-value="order.endTime"
            end-time-prop="endTime"
            @changeStartValue="value => order.startTime = value"
            @changeEndValue="value => order.endTime = value"
          ></gt-time-range>
        </el-form-item>

        <el-form-item label="充值金额" v-if="orderName=='recharge'">
          <gt-price-range
            ref="priceRange"
            @startValueEvent="value => order.minAmount = getValue(value)"
            @endValueEvent="value => order.maxAmount = getValue(value)"
          />
        </el-form-item>
        <el-form-item label="商品名称" prop='productName' v-if="orderName=='mami'">
          <el-input v-model="order.productName" placeholder="请输入商品名称" clearable></el-input>
        </el-form-item>
      </span>

      <span v-else>
        <el-form-item label="订单编号" prop='orderNo'>
          <el-input v-model="order.orderNo" placeholder="请输入订单编号" clearable></el-input>
        </el-form-item>
        <el-form-item label="顾客" prop='memberPhone'>
          <el-input v-model="order.memberPhone" placeholder="请输入顾客手机号" clearable></el-input>
        </el-form-item>
        <el-form-item label="所属活动" prop='distributionActivityId'>
          <el-select v-model="order.distributionActivityId" placeholder="请选择所属活动" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activityList"
              :key="item.id"
              :label="item.title"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="订单状态" prop='orderStatus'>
          <el-select v-model="order.orderStatus" placeholder="请选择订单状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activityStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="下单时间">
          <gt-time-range
            value-format="yyyy-MM-dd HH:mm:ss"
            start-time-prop="createDateStart"
            :start-time-value="order.createDateStart"
            :end-time-value="order.createDateEnd"
            end-time-prop="createDateEnd"
            @changeStartValue="value => order.createDateStart = value"
            @changeEndValue="value => order.createDateEnd = value"
          ></gt-time-range>
        </el-form-item>
      </span>
      

      <el-form-item class="search-toolbar">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import { activityStatus, paymentOfMode, orderType, retailOrder, countcardMode,rechargeProject,countcardOrder,returnOrder,returnMode,returnType, mamiType, mamiOrderStatus,exchangeType,exchangeStatus } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import gtPriceRange from '@/components/gt-price-range'
import { getGtStoreIds,getGtActivityList } from '@/service/order'
import { deleteShoppingCard,getshoppingCardList } from '@/service/campaign'
import { getStaffList} from '@/service/staffManagement'
export default {
  name:'order-advance',
  data () {
    return {
      activityList:[],
      orderO: {},
      order:{
        // guideId:'',
        phone: null,
        type: '',
        stage: '',
        // refund: '',
        payType: '',
        id:null,
        startTime:null,
        endTime:null,
        minAmount: null,
        maxAmount: null,
        start:null,
        end:null,
        returnType: '',

        customerPhone:'',
        orderSource:'',
        orderStatus:'',
        exchangeType:'',
        
        createDateEnd: null,
        createDateStart: null,
        currentPage: 0,
        distributionActivityId: '',
        memberPhone: null,
        orderNo: null,
        // orderStatus: null,
        pageSize: 20,
        storeIdList: [],
        cardType:'',//充值单-充值项目
      },
      rechargeCardList: [],//充值单-充值卡名称
       //导购员
      guideList:[],
      // 零售
      paymentOfMode,
      orderType,
      retailOrder,
      // 礼品卡
      countcardMode,
      countcardOrder,
      // 退货单
      returnOrder,
      returnMode,
      returnType,
      // 妈咪全知道
      mamiOrderStatus,
      mamiType,
      // 兑换订单
      exchangeType,
      exchangeStatus,
      // 品牌活动
      activityStatus,
      //充值单-充值项目
      rechargeProject,
      shoppingCardId: '',//充值单-充值卡名称
    }
  },
  components: {
    gtTimeRange, gtPriceRange
  },
  props:['orderName','stage'],
  activated(){
    // this.order.stage = this.stage
    // alert(this.order.stage)
  },
  created(){
    this.order.stage = this.stage
    if(this.orderName == 'activity'){
      this.getGtStoreList()
    }
    this.changeStock()
  },
  methods:{
    // 生成gateondmp门店id列表
    async getGtStoreList(){
      const { data } = await getGtStoreIds({
        storeId:null
      })
      if (data.code === 0) {
        this.order.storeIdList = data.data
        var obj = {
          'type': 'search',
          'order': this.order
        }
        this.$emit('refreshSearch',obj)
        this.getGtActivityList(data.data)
      } else {
        this.order.storeIdList = []
        this.$message.error(res.msg)
      }
    },
    //监听充值单-充值卡名称
    async changeRechargeCardList(){
      this.order.shoppingCardId = null
      const { data } = await getshoppingCardList()
      if (data.code === 0) {
        this.rechargeCardList = data.data.records
      } else {
        this.rechargeCardList = []
        this.$message.error(data.msg)
      }
    },
    // 品牌活动列表
    async getGtActivityList(storeIds){
      const { data } = await getGtActivityList({
        from: 'saas',
        storeIds:storeIds||[],
        currentPage: 1,
        pageSize: 100000
      })
      if (data.code === 0) {
        if(data.data){
          this.activityList = data.data.records
        }else{
          this.activityList = []
        }
        
      } else {
        this.activityList = []
        this.$message.error(res.msg)
      }
    },
    async changeStock(){
      const { data } = await getStaffList({
        page: 0,
        size: 10000,
      })
      if (data.code === 0) {
        this.guideList = data.data.records
      } else {
        this.guideList = []
      }
    },
    getValue(value){
      return value ? this.priceNum(value, 'out') : null
    },
    // 改变订单状态
    changeType(value) {
      if (value === 'WESHOP') {
        this.order.payType = ''
        this.order.refund = ''
      }
    },
    // 重置
    resetForm(type) {
      if(type === 'reset'){
        this.$refs['order'].resetFields()
        this.stage = ''
        if (this.$refs['priceRange']) {
          this.$refs['priceRange'].refresh()
        }
      }
      var obj = {
        'type': type,
        'order': this.order
      }
      if (this.orderName === 'recharge') {
        this.$refs['priceRange'].validate(
          () => this.$emit('refreshSearch',obj)
        )
      } else {
        this.$emit('refreshSearch',obj)
      }
    },
  }
}

</script>

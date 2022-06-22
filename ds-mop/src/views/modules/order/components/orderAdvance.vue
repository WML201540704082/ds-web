<template>
  <div>
    <!-- 查询条件 -->
    <el-form :model="order" :inline="true" ref='order' class="mode-form-line1"  @keyup.enter.native="resetForm('search')">
      <el-form-item label="退货单号" prop='id' v-if="orderName=='return'">
        <el-input v-model="order.id" placeholder="请输入退货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="退款单号" prop='id' v-else-if="orderName=='storedvalue'">
        <el-input v-model="order.id" placeholder="请输入退货单号" clearable></el-input>
      </el-form-item>
      <el-form-item label="订单编号" prop='id' v-else>
        <el-input v-model="order.id" placeholder="请输入订单编号" clearable></el-input>
      </el-form-item>
      <el-form-item label="所属企业" prop="companyId">
        <el-select v-model="order.companyId" filterable placeholder="请选择企业" @change="getStoreList" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in companyList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="所属门店" prop='storeId'>
        <el-select v-model="order.storeId" placeholder="请选择门店" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in storeList"
            :key="item.id"
            :label="item.name"
            :value="item.id">
          </el-option>
        </el-select>
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
          <el-select v-model="order.cardType" placeholder="请选择充值项目" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in rechargeProject"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

      <el-form-item label="退款状态" prop='stage' v-if="orderName=='return'">
        <el-select v-model="order.stage" placeholder="请选择退款状态" clearable>
          <el-option  label="全部" value="" ></el-option>
          <el-option
            v-for="item in returnOrder"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="退单时间" v-if="orderName=='return'">
        <gt-time-range
          value-format="timestamp"
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
          value-format="timestamp"
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
          value-format="timestamp"
          start-time-prop="startTime"
          :start-time-value="order.startTime"
          :end-time-value="order.endTime"
          end-time-prop="endTime"
          @changeStartValue="value => order.startTime = value"
          @changeEndValue="value => order.endTime = value"
        ></gt-time-range>
      </el-form-item>
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

      <el-form-item label="充值金额" v-if="orderName=='recharge'">
        <gt-price-range
          ref="priceRange"
          @startValueEvent="value => order.minAmount = getValue(value)"
          @endValueEvent="value => order.maxAmount = getValue(value)"
        />
      </el-form-item>

      <el-form-item class="search-toolbar">
        <gt-button type="search" @click.native="resetForm('search')"/>
        <gt-button type="reset" @click.native="resetForm('reset')"/>
      </el-form-item>
    </el-form>
  </div>
</template>
<script>

import { paymentOfMode, orderType, retailOrder, countcardMode,rechargeProject,countcardOrder,returnOrder,returnMode,returnType,exchangeType,exchangeStatus } from '@/utils/dict'
import gtTimeRange from '@/components/gt-time-range'
import gtPriceRange from '@/components/gt-price-range'
export default {
  data () {
    return {
      order:{
        phone: null,
        storeId: '',
        type: '',
        stage: '',
        // refund: '',
        payType: '',
        companyId:'',
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
        cardType:'',//充值单-充值项目
      },
      activityList: [],//品牌分销活动列表
      storeList: [],
      companyList: [],
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
      // 兑换订单
      exchangeType,
      exchangeStatus,
      //充值单-充值项目
      rechargeProject,
    }
  },
  components: {
    gtTimeRange, gtPriceRange
  },
  props:['orderName'],
  created(){
    // 获取企业列表
    this.getCompanyList()
  },
  methods:{
    getValue(value){
      return value ? this.priceNum(value, 'out') : null
    },
    // 获取企业的下拉列表
    async getCompanyList() {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      this.companyList = data.data.records
    },
    // 获取对应企业的门店列表
    async getStoreList(companyId) {
      if (companyId) {
        const { data } = await this.$http({
          url: this.$http.adornUrl(`/baseinfo/mop/store/company/${companyId}`),
          method: 'get',
        })
        if (data && data.code === 0) {
          this.storeList = data.data
        } else {
          this.storeList = []
          this.$message.error(data.msg)
        }
      } else {
        this.storeList = []
      }
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
        this.storeList = []
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

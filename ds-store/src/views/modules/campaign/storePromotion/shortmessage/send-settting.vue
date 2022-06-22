<template>
  <div class="mod-store page-shortmessage-setting">
    <div v-show="false">{{customerList}}</div>
    <gt-sub-title title="短信内容" style="display: block;">
      <span class="tip">提示: 短信内容不得涉及政治、宗教信仰、个人隐私或攻击等非法信息</span>
    </gt-sub-title>
    <el-form :inline="true" class="mode-form-line1" ref="shortmessage" label-width="120px" :model="shortmessage" @keyup.enter.native="resetForm('search')">
      <el-row>
        <el-col :span="18">
          <el-form-item prop="content">
            <textarea
              ref="addSmsInput"
              class="my-textarea"
              :rows="8"
              placeholder="请输入短信内容"
              @change="setFlag"
              v-model="shortmessage.content"></textarea>
            <div class="num-tip">已输入{{shortmessage.content.length}}个字≈{{shortmessageCount}}条短信</div>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-button class="btn-big" type="primary" @click="chooseTemplate">选择短信模板</el-button>
          <el-button v-if="storeRoleName == '店长'" class="btn-big" type="primary" @click="chooseCoupon">选择优惠券</el-button>
          <el-button class="btn-big" type="primary" @click="chooseParams">插入参数</el-button>
        </el-col>
      </el-row>
      <div class="select-coupon">
        已选优惠券： {{shortmessage.coupon.name || '--'}}
      </div>
    </el-form>
    <gt-sub-title title="选择短信发送对象" style="display: block;"/>
    <el-button type="primary" class="choose-customer" @click="chooseCustomer">选择顾客</el-button>
    <el-table
      :data="shortmessage.customerList"
      border
      v-loading="dataListLoading"
      :stripe="true"
      height="400"
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
        width="120"
        label="操作">
        <template slot-scope="scope">
          <el-button v-if="isAuth('company:product:detail')" class="nopadding" type="text" size="small" @click="deleteCustomer(scope.$index)">移除</el-button>
        </template>
      </el-table-column>
      <el-table-column
        prop="name"
        min-width="120"
        label="顾客姓名">
      </el-table-column>
      <el-table-column
        prop="wechatName"
        min-width="120"
        label="微信昵称">
      </el-table-column>
      <el-table-column
        prop="gender"
        min-width="120"
        label="性别">
        <template slot-scope="scope">
          <span>{{filterStatus(scope.row.gender, sex)}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="phone"
        min-width="120"
        label="手机号">
      </el-table-column>
      <el-table-column
        prop="levelName"
        min-width="120"
        label="会员等级">
      </el-table-column>
    </el-table>
    <div class="control">
      <el-button class="btn-big" type="primary" @click="doSend">提交审核</el-button>
      <div class="tip">本次共发送<span class="blue">{{shortmessage.customerList.length}}</span>位顾客，
      将消耗<span class="blue">{{expendSmsNum}}</span>条短信，
      短信余量<span class="blue">{{amount || 0}}</span> 条
      </div>
    </div>
    <select-coupon-modal ref="selectCouponModal" @refreshCoupon="changeCoupon" />
    <select-params-modal ref="selectParamsModal" @refreshParams="changeParams" />
    <select-template-modal ref="selectTemplateModal" @refreshTemp="changeTemplate" />
    <select-customer-modal ref="selectCustomerModal" @refreshCustomer="changeCustomers" />
  </div>
</template>
<script>
import selectCouponModal from './components/coupon-modal'
import selectParamsModal from './components/select-params'
import selectTemplateModal from './components/select-template'
import selectCustomerModal from './components/select-customer'
import gtSubTitle from '@/components/gt-sub-title'
import _ from 'lodash'
import { sex,customerLevel } from '@/utils/dict'
import { mapState, mapMutations } from 'vuex'
import { filterStatus } from '@/utils'
import moment from 'moment'
import { getCustomerList } from '@/service/mycustomer'
import { doSendMessage, reMessageDetail, smsMarketing, getAccountDetail } from '@/service/campaign'
export default {
  props: {
    id: {
      type: [String, Number],
      default: null
    }
  },
  data() {
    return {
      dataListLoading: false,
      currentFocus: '',
      filterStatus,
      customerLevel,
      sex,
      amount: 0,
      shortmessage: {
        // 短信申请id
        id: null,
        // 顾客列表
        customerList: [],
        content: '',
        // 已选优惠券
        coupon: {}
      }
    }
  },
  computed: {
    ...mapState({
      customerList(state) {
        this.shortmessage.customerList = state.customer.list
        console.log('test')
        return state.customer.list
      }
    }),
    expendSmsNum() {
      return (this.shortmessageCount + (this.shortmessage.coupon.name ? 1 : 0)) * (this.shortmessage.customerList ? this.shortmessage.customerList.length : 0)
    },
    shortmessageCount() {
      return Math.ceil(this.shortmessage.content.length/70)
    }
  },
  created () {
    if (this.id) {
      this.getDetail(this.id)
    }
    this.getReCharge()
    this.allList()
  },
  components: {
    gtSubTitle,
    selectCouponModal,
    selectParamsModal,
    selectTemplateModal,
    selectCustomerModal
  },

  destroyed () {
    this.updateCustomerList([])
  },

  methods: {
    ...mapMutations({
      updateCustomerList: 'customer/updateCustomerList',
    }),
    allList(){
      const { storeRoleName = '' } = JSON.parse(this.$cookie.get('store-info')) || {}
      console.log(storeRoleName)
      this.storeRoleName = storeRoleName
    },
    // 表单编辑
    setFlag() {
      this.$emit('changeForm', true)
    },
    // 获取短信余量
    async getReCharge() {
      const data = await getAccountDetail()
      if(data){
        this.amount = data.amount || 0
      }
    },
    // 选择优惠券
    chooseCoupon() {
      this.$nextTick(() => {
        this.$refs.selectCouponModal.init(this.shortmessage.coupon)
      })
    },
    // 更改优惠券
    changeCoupon(coupon) {
      this.shortmessage.coupon = coupon
    },
    // 选择模板
    chooseTemplate() {
      this.$nextTick(() => {
        this.$refs.selectTemplateModal.init(this.shortmessage.template)
      })
    },

    // 更改模板
    changeTemplate(template) {
      this.shortmessage.content = template.content
      this.shortmessage.title = template.title
    },

    // 选择参数
    chooseParams() {
      this.currentFocus = this.$refs.addSmsInput.selectionStart || this.shortmessage.content.length
      this.$nextTick(() => {
        this.$refs.selectParamsModal.init(this.shortmessage.coupon)
      })
    },

    // 更改参数
    changeParams(template) {
      this.shortmessage.content = this.setStr(this.shortmessage.content, this.currentFocus, `{${template.name}}`)
    },

    setStr(str,index,value){
      let start = str.substring(0,index)
      let end = str.substring(index, str.length)
      return start+value+end
    },

    // 选择顾客
    chooseCustomer() {
      this.$nextTick(() => {
        this.$refs.selectCustomerModal.init()
      })
    },
    // 更改顾客
    changeCustomers(filter) {
      // this.shortmessage.customerList = list
      this.getCustomerList(filter)
    },

    // 获取顾客列表
    async getCustomerList(filter) {
      this.dataListLoading = true
      let formData = {
        size: 10000,
        page: 0,
        visitdays: filter.review.value ? filter.review.value : null,
        // 顾客生日-宝宝生日
      }
      if (filter.basic && filter.basic.value === '0') {
        formData.birthdays = 30
      } else if (filter.basic && filter.basic.value === '1') {
        formData.babyBirthday = 30
      }
      const { data } = await getCustomerList(formData)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.shortmessage.customerList = data.data.records

        // 上次消费计算
        this.shortmessage.customerList.forEach(o=>{
          if(o.lastBuyDate){
            var endtime = moment(o.lastBuyDate)//结束时间
            var nowtime = moment()//当前时间
            var lefttime=parseInt((endtime.valueOf()-nowtime.valueOf())/1000)
            var d = Math.abs(parseInt(lefttime/(24*60*60)))
            o.lastBuyDate = d
          }
        })

      } else {
        this.shortmessage.customerList = []
        this.$message.warning(data.msg)
      }
    },

    // 移除顾客
    deleteCustomer(index) {
      let list = _.cloneDeep(this.shortmessage.customerList)
      list.splice(index, 1)
      this.shortmessage.customerList = list
      this.$message.success('移除成功')
    },

    checkData() {
      if (!this.shortmessage.content) {
        this.$message.warning('输入短信模板内容！')
        return false
      } else if (this.shortmessage.customerList.length === 0) {
        this.$message.warning('请先选择顾客！')
        return false
      } else {
        return true
      }
    },

    // 确认发送
    doSend() {
      this.$refs['shortmessage'].validate(async (valid) => {
        if (valid && this.checkData()) {
          const customers = this.shortmessage.customerList.map(item => {
            return {
              customerId: item.customerId ? item.customerId  : item.id,
              gender: item.gender,
              level: item.level,
              name: item.name,
              phone: item.phone,
              levelName: item.levelName,
              source: item.source,
              storeId: item.storeId,
              storeName: item.storeName,
              wechatName: item.wechatName
            }
          })
          let filterData = {
            ...this.shortmessage,
            customerList: customers,
            expendSmsNum: this.expendSmsNum,
            couponId: this.shortmessage.coupon.id,
            couponName: this.shortmessage.coupon.name
          }
          this.$emit('changeForm', false)

          delete filterData.id
          delete filterData.coupon
          // 商品列表
          const { data } = this.id ? await smsMarketing({...filterData, id: this.id}) : await doSendMessage(filterData)
          if (data.code === 0) {
            this.$message.success('已提交审核')
            this.$router.push({name: 'campaign-index'})
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    },

    // 获取短信详情
    async getDetail(id) {
      const { data } = await reMessageDetail({id})
      if (data.code === 0) {
        this.shortmessage = {
          ...data.data,
          coupon: {
            id: data.data.couponId,
            name: data.data.couponName
          }
        }
        this.updateCustomerList(data.data.customerList)
      } else {
        this.$message.error(data.msg)
      }
    }
  }
}
</script>
<style lang="scss">
.page-shortmessage-setting{
  .tip{
    color: red;
    font-size: 12px;
    margin-left: 20px;
  }
  .el-form-item--medium{
    width: calc(100% - 20px);
    .el-form-item__content{
      width: 100%;
      .el-textarea__inner{
        width: 100%
      }
    }
  }
  .btn-big{
    border-radius: 0;
    padding: 0;
    display: block;
    width: 100px;
    text-align: center;
    height: 40px;
    margin: 0 0 20px 0;
  }
  .select-coupon{
    font-size: 16px;
    margin-bottom: 20px;
  }
  .num-tip{
    position: absolute;
    bottom: 10px;
    font-size: 12px;
    right: 10px;
  }
  .my-textarea{
    width: 100%;
    border-color: #d8d8d8;
    border-radius: 5px;
    padding: 10px;
    -webkit-appearance: none;
    font-size: 16px;
    &:focus{
      outline: none;
    }
  }
  .el-form-item__content:focus{
    outline: none;
  }
  .choose-customer{
    float: right;
    margin: -20px 10px 20px 0;
    // margin-bottom: 20px;
  }
  .control{
    padding: 20px;
    .btn-big{
      float: right;
    }
    .tip{
      float: right;
      height: 40px;
      font-size: 16px;
      line-height: 40px;
      margin-right: 20px;
    }
    .blue{
      color: blue;
    }
  }
}

</style>

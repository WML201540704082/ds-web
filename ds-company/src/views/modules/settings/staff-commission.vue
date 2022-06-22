<template>
  <section class="page-settings-staff">
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectNew_Old" style="float:left;">
        <el-radio-button label="employee">员工分级提成</el-radio-button>
        <el-radio-button label="newEmployee">新客开发奖励</el-radio-button>
      </el-radio-group>
    </el-card>
    <el-card style="padding-bottom: 20px;text-align: center;" class="commissionBt" v-if="selectNew_Old=='employee'">
      <el-radio-group v-model="activeName" @change="changeVal">
        <el-radio-button label="RETAIL">零售类商品</el-radio-button>
        <el-radio-button label="SERVICE">服务类商品</el-radio-button>
      </el-radio-group>
      <div class="table-container">
        <div class="table-row">
          <div class="table-item header name">订单角色</div>
          <div class="table-item header">提成比例</div>
        </div>
        <div class="table-row" :key="item.id" v-for="item in list">
          <div class="table-item name">{{item.rolerInOrder}}</div>
          <div class="table-item" v-show="!isEdit">{{item.percent}} %</div>
          <div class="table-item" v-show="isEdit">
            <el-input class="edit-input" v-model="item.percent" ></el-input>%</div>
        </div>
      </div>
      <el-button type="primary" v-show="!isEdit" @click="toEdit">更改设置</el-button>
      <el-button v-show="isEdit" @click="cancel">取消</el-button>
      <el-button type="primary" v-show="isEdit" :loading="$store.state.loading.global" @click="save">保存</el-button>
    </el-card>
    <el-card style="padding-bottom: 20px;" class="commissionBt" v-if="selectNew_Old=='newEmployee'">
      <el-form ref="newStaff" :rules="dataFormRules" :model="newStaff">
        <gt-subtitle title="新人礼"/>
			  <span v-if="this.newStaff.enabledTypeOne == 'ON'"><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_open.png" alt="" class="service"></span>
			  <span v-else><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_close.png" alt="" class="service"></span>
        <el-form-item v-show="isSave" style="margin-left:10px">
          <el-switch v-model="newStaff.enabledTypeOne"
          active-text="启用"
          @change="changeCommissionBt"
          :disabled="false"
          active-value="ON"
          inactive-value="OFF">
          </el-switch>
        </el-form-item>
        <div style="padding-bottom:20px;font-size:13px;margin-left:10px;margin-top:10px;">新顾客注册成功后，系统自动为新客发放新客优惠券。</div>
        <el-form-item label=" " label-width="0px" prop='couponId'>
          <span>选择新客优惠券</span>
          <el-select v-show="isSave" v-model="newStaff.couponId" @change="changeCoupon" placeholder="请选择优惠券" clearable>
            <el-option
              v-for="item in couponList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <span v-show="!isSave" style="color:red">{{ newStaff.couponName }}</span>
        </el-form-item>
        <gt-subtitle title="员工新客开发提成"/>
			  <span v-if="this.newStaff.enabledTypeSecond == 'ON'"><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_open.png" alt="" class="service"></span>
			  <span v-else><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_close.png" alt="" class="service"></span>
        <el-form-item v-show="isSave" style="margin-left:10px">
          <el-switch v-model="newStaff.enabledTypeSecond"
          active-text="启用"
          :disabled="false"
          active-value="ON"
          inactive-value="OFF">
          </el-switch>
        </el-form-item>
        <el-form-item label=" " label-width="0px" prop="employeeConditionType">
          <span>提成条件：</span>
          <el-radio-group v-show="isSave" v-model="newStaff.employeeConditionType">
            <el-radio :label="item.value" :key="item.value"  v-for="item in commissionCondition">{{item.label}}</el-radio>
          </el-radio-group>
          <span v-show="!isSave">{{ newStaff.employeeConditionType === 0 ? '推荐新客成功注册' : '推荐新客成功注册并下单' }}</span>
        </el-form-item>
        <el-form-item label=" " label-width="0px" class="gt-input-tip" prop="employeeCommission" v-if="newStaff.employeeConditionType=='0'">
          <span>员工每成功推荐1个新客成功注册，即可获得新客奖励</span>
          <el-input v-show="isSave" v-model="newStaff.employeeCommission" :maxlength="10" placeholder="" class="inputs1 inline">
          </el-input>
          <span v-show="!isSave" style="color:red">{{ newStaff.employeeCommission }}</span>
          <span>元</span>
        </el-form-item>
        <el-form-item label=" " label-width="0px" class="gt-input-tip" prop="employeeCommission" v-if="newStaff.employeeConditionType=='1'">
          <span>员工每成功推荐1个新客成功注册并下单，即可获得新客奖励</span>
          <el-input v-show="isSave" v-model="newStaff.employeeCommission" :maxlength="10" placeholder="" class="inputs1 inline">
          </el-input>
          <span v-show="!isSave" style="color:red">{{ newStaff.employeeCommission }}</span>
          <span>元</span>
        </el-form-item>
        <el-form-item class="gt-input-tip" label-width="10px">
          <el-checkbox v-show="isSave" v-model="newStaff.employeeBonusEnabled"></el-checkbox>
          <span>员工成功推荐每满</span>
          <el-form-item v-show="isSave" label=""  style="text-align:center" class="form-item-inline" prop="employeeRecommend">
            <el-input v-model="newStaff.employeeRecommend" :maxlength="10" placeholder="" class="inputs1 inline">
            </el-input>
          </el-form-item>
          <span v-show="!isSave" style="color:red">{{ newStaff.employeeRecommend }}</span>
          <span>个新客，可额外获得</span>
          <el-form-item v-show="isSave" label="" style="text-align:center" class="form-item-inline" prop="employeeRecommendBonus">
            <el-input v-model="newStaff.employeeRecommendBonus" :maxlength="10" placeholder="" class="inputs1 inline">
            </el-input>
          </el-form-item>
          <span v-show="!isSave" style="color:red">{{ newStaff.employeeRecommendBonus }}</span>
          <span>元</span>
        </el-form-item>
        <gt-subtitle title="老带新奖励"/>
			  <span v-if="this.newStaff.enabledTypeThree == 'ON'"><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_open.png" alt="" class="service"></span>
			  <span v-else><img v-show="!isSave" src="../../../../static/img/campaign/SaaS_close.png" alt="" class="service"></span>
        <el-form-item v-show="isSave" style="margin-left:10px">
          <el-switch v-model="newStaff.enabledTypeThree"
          active-text="启用"
          :disabled="false"
          active-value="ON"
          inactive-value="OFF">
          </el-switch>
        </el-form-item>
        <el-form-item label=" " label-width="0px" class="gt-input-tip" prop="customerCommission">
          <span>老客每成功推荐1个新客成功注册，即可获得老带新</span>
          <el-input v-show="isSave" v-model="newStaff.customerCommission" :maxlength="10" placeholder="" class="inputs1 inline">
          </el-input>
          <span v-show="!isSave" style="color:red">{{ newStaff.customerCommission }}</span>
          <span>积分</span>
        </el-form-item>
        <el-form-item class="gt-input-tip" label-width="10px">
          <el-checkbox v-show="isSave" v-model="newStaff.customerBonusEnabled"></el-checkbox>
          <span>老客成功推荐每满</span>
          <el-form-item v-show="isSave" label="" style="text-align:center" class="form-item-inline" prop="customerRecommend">
            <el-input v-model="newStaff.customerRecommend" :maxlength="10" placeholder="" class="inputs1 inline">
            </el-input>
          </el-form-item>
          <span v-show="!isSave" style="color:red">{{ newStaff.customerRecommend }}</span>
          <span>个新客，可额外获得</span>
          <el-form-item v-show="isSave" label="" style="text-align:center" class="form-item-inline" prop="customerRecommendBonus">
            <el-input v-model="newStaff.customerRecommendBonus" :maxlength="10" placeholder="" class="inputs1 inline">
            </el-input>
          </el-form-item>
          <span v-show="!isSave" style="color:red">{{ newStaff.customerRecommendBonus }}</span>
          <span>积分</span>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit" v-if="selectNew_Old=='newEmployee'">
      <gt-button size="large" is-default v-show="isSave" @click.native="new_cancel" txt="取消" />
      <gt-button size="large" v-show="isSave" :loading="loading" @click.native="save_update" txt="保存"/>
      <gt-button size="large" v-show="!isSave" @click.native="toSave" txt="更改设置"/>
    </div>
  </section>
</template>
<script>
import gtSubtitle from '@/components/gt-sub-title'
import { number, twoDecimal,priceRange } from '@/utils/validate'
import { getStaffCommission, updateStaffCommission,getCouponList,createNewStaff,getNewStaffDetail } from '@/service/setting'
import { commissionCondition } from '@/utils/dict'
import { mapState } from 'vuex'
import moment from 'moment'
import NP from 'number-precision'
import _ from 'lodash'
export default {
  name: 'settings-staff-commission',
  components: {
    gtSubtitle,
  },
  data() {
    //校验优惠券
    const validateCupon = (rule,value,callback) =>{
      if(this.newStaff.enabledTypeOne == 'ON'){
        if (!value) {
          callback(new Error('请选择优惠券！'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    //校验员工新客奖励金
    const validateEmployeeCommission = (rule,value,callback) =>{
      if(this.newStaff.enabledTypeSecond == 'ON'){
        if (!value) {
          callback(new Error('请填写奖励金！'))
        }else if(!priceRange(value, 599999.99)){
          callback(new Error('请输入0.00-599999.99的数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    //校验员工新客数
    const validateEmployee = (rule, value, callback) => {
      if(this.newStaff.employeeBonusEnabled && this.newStaff.enabledTypeSecond == 'ON'){
        let boolean = new RegExp("^[0-9][0-9]*$").test(value)
        if (!value) {
          callback(new Error('请输入新客数！'))
        }else if( !boolean ){
          callback(new Error('请输入正整数！'))
        } else {
          callback()
        }
      }else{
        callback()
      }
    }
    //校验员工新客满奖励数额
    const validateMoney = (rule, value, callback) => {
      if(this.newStaff.employeeBonusEnabled && this.newStaff.enabledTypeSecond == 'ON'){
        if (!value) {
          callback(new Error('请输入数额'))
        }else if(!priceRange(value, 19999.99)){
          callback(new Error('请输入0.01-19999.99的数字，最多保留小数点后两位'))
        }else{
          callback()
        }
      }else{
        callback()
      }
    }
    //校验老带新积分奖励
    const validateCustomerCommission = (rule,value,callback) => {
      let boolean = new RegExp("^[0-9][0-9]*$").test(value)
      if (this.newStaff.enabledTypeThree == 'ON') {
        if (!value) {
          callback(new Error('请输入奖励积分！'))
        }else if( !boolean ){
          callback(new Error('请输入正整数！'))
        } else{
          callback()
        }
      }else{
        callback()
      }
    }
    //校验老带新新客数
    const validateCustomer = (rule, value, callback) => {
      if (this.newStaff.customerBonusEnabled && this.newStaff.enabledTypeThree == 'ON') {
        let boolean = new RegExp("^[0-9][0-9]*$").test(value)
        if (!value) {
          callback(new Error('请输入新客数'))
        }else if( !boolean ){
          callback(new Error('请输入正整数！'))
        } else{
          callback()
        }
      }else{
        callback()
      }
    }
    //校验老带新积分奖励数
    const validateIntegral = (rule, value, callback) => {
      if (this.newStaff.customerBonusEnabled && this.newStaff.enabledTypeThree == 'ON') {
        let boolean = new RegExp("^[0-9][0-9]*$").test(value)
        if (!value) {
          callback(new Error('请输入积分奖励数'))
        }else if( !boolean ){
          callback(new Error('请输入正整数！'))
        } else{
          callback()
        }
      }else{
        callback()
      }
    }
    return {
      newStaff:{
        enabledTypeOne:'ON',//新人礼启用
        enabledTypeSecond:'ON',//员工新客提成启用
        enabledTypeThree:'ON',//老带新启用
        employeeConditionType:0,//提成条件默认
        employeeBonusEnabled: false,//员工--顾客是否启用满人额外奖励
        customerBonusEnabled: false,//老带新--顾客是否启用满人额外奖励
      },
      commissionCondition,
      couponList:[],
      dataFormRules: {
        couponId:[{ required: true, validator: validateCupon}],
        employeeConditionType:[{ required: true, message:'请选择条件'}],
        employeeCommission:[{ required: true, validator: validateEmployeeCommission}],
        customerCommission:[{ required: true, validator: validateCustomerCommission}],
        employeeRecommend:[{ required: true, validator: validateEmployee}],
        employeeRecommendBonus:[{ required: true, validator: validateMoney}],
        customerRecommend:[{ required: true, validator: validateCustomer }],
        customerRecommendBonus:[{ required: true, validator: validateIntegral }]
      },
      activeName: 'RETAIL',
      selectNew_Old: 'employee',
      list: [],
      isEdit: false,
      isSave: false,
      retailList: [{
        id: '',
        rolerInOrder: '店长',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '导购',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '归属员工',
        percent: 0
      }],
      serviceList: [{
        id: '',
        rolerInOrder: '店长',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '导购',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '归属员工',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '技师',
        percent: 0
      }],
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  created () {
    this.selectNew_Old=this.$route.params.isStaff || 'employee'
    this.init()
    this.getCouponList()
    this.getDataDetail()
  },
  methods: {
    async init() {
      this.retailList = [{
        id: '',
        rolerInOrder: '店长',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '导购',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '归属员工',
        percent: 0
      }],
      this.serviceList = [{
        id: '',
        rolerInOrder: '店长',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '导购',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '归属员工',
        percent: 0
      }, {
        id: '',
        rolerInOrder: '技师',
        percent: 0
      }]
      const { data } = await getStaffCommission()
      let retailList = _.cloneDeep(this.retailList)
      let serviceList = _.cloneDeep(this.serviceList)
      if (data.code === 0) {
        const list = data.data
        list.forEach(item => {
          if (item.type === 'ENTITY') {
            if (item.rolerInOrder === '店长') {
              retailList[0].id = item.id
              retailList[0].percent = this.priceNum(item.percent)
            } else if (item.rolerInOrder === '导购') {
              retailList[1].id = item.id
              retailList[1].percent = this.priceNum(item.percent)
            } else if (item.rolerInOrder === '归属员工') {
              retailList[2].id = item.id
              retailList[2].percent = this.priceNum(item.percent)
            }
          } else {
            if (item.rolerInOrder === '店长') {
              serviceList[0].id = item.id
              serviceList[0].percent = this.priceNum(item.percent)
            } else if (item.rolerInOrder === '导购') {
              serviceList[1].id = item.id
              serviceList[1].percent = this.priceNum(item.percent)
            } else if (item.rolerInOrder === '归属员工') {
              serviceList[2].id = item.id
              serviceList[2].percent = this.priceNum(item.percent)
            } else if (item.rolerInOrder === '技师') {
              serviceList[3].id = item.id
              serviceList[3].percent = this.priceNum(item.percent)
            }
          }
        })
        this.retailList = retailList
        this.serviceList = serviceList
        // this.activeName = 'RETAIL'
        this.isEdit = false
        this.changeVal(this.activeName)
      }
    },
    changeVal(value) {
      if (this.isEdit) {
        this.$message.warning('请先保存当前设置！')
        if (this.activeName === 'RETAIL') {
          this.activeName = 'SERVICE'
        } else {
          this.activeName = 'RETAIL'
        }

      } else {
        if (value === 'RETAIL') {
          this.list = this.retailList
        } else {
          this.list = this.serviceList
        }
      }
    },
    //监听新人礼启动按钮
    changeCommissionBt(val) {
      if (val === 'ON') {
        // this.$refs['newStaff'].validateField('couponId')
        this.newStaff.couponId = null
        this.newStaff.couponName = null
      }
    },
    //监听新人礼优惠券选择
    changeCoupon(val){
      const items = this.couponList.filter(item => {
        return item.id == val
      })
      if (items && items.length === 1) {
        this.newStaff.couponName = items[0].name
      }
    },
    toEdit() {
      this.isEdit = true
    },

    check() {
      const tempData = this.activeName === 'RETAIL' ? this.retailList : this.serviceList
      let flag = true
      let total = 0
      tempData.forEach(item => {
        if (!twoDecimal(item.percent)) {
        // const reg = /^\d+$/
        // if (!reg.test(item.percent)) {
          flag = false
          this.$message.error('提成比例请输入0-100的数字')
        } else {
          total = NP.plus(Number(item.percent), total)
        }
      })
      if (total > 100) {
        this.$message.error('提成比例合计有误！')
      }

      return flag && total <= 100
    },

    // 保存设置
    async save() {
      if (this.check()) {
        const tempData = this.activeName === 'RETAIL' ? this.retailList : this.serviceList
        const formData = tempData.map(item => {
          return {
            ...item,
            type: this.activeName === 'RETAIL' ? 'ENTITY' : 'SERVICE',
            percent: this.priceNum(item.percent, 'out')
          }
        })
        const { data } = await updateStaffCommission({
          orderRolerDiscountDtos: formData
        })
        if (data.code === 0) {
          await this.init()
        } else {
          this.$message.error(data.msg)
        }
      }
    },
    // 取消设置
    async cancel() {
      await this.init()
    },

    async getCouponList() {
      const { data } = await getCouponList()
      if (data.code === 0) {
        this.couponList = data.data
      } else {
        this.$message.error('获取优惠券列表失败')
      }
    },
    // 获取新客开发奖励--详情
    async getDataDetail() {
      this.dataListLoading = true
      const { data } = await getNewStaffDetail()
      if (data.code === 0) {
        this.newStaff = data.data
        this.newStaff.employeeCommission = this.priceNum(this.newStaff.employeeCommission),
        this.newStaff.employeeRecommendBonus = this.priceNum(this.newStaff.employeeRecommendBonus),
        this.newStaff.employeeBonusEnabled = this.newStaff.employeeBonusEnabled == 'ON' ? true : false
        this.newStaff.customerBonusEnabled = this.newStaff.customerBonusEnabled == 'ON' ? true : false
        if(moment(this.newStaff.effectiveEndDate).isBefore(moment().format('YYYY-MM-DD HH:mm:ss'))){
          this.newStaff.enabledTypeOne = "OFF"
        }
      }else{
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    //新客开发奖励--保存
    async save_update() {
      this.$refs['newStaff'].validate(async (valid) => {
        if (valid) {
          const res = await createNewStaff({
            ...this.newStaff,
            employeeBonusEnabled: this.newStaff.employeeBonusEnabled ? 'ON' : 'OFF',
            customerBonusEnabled: this.newStaff.customerBonusEnabled ? 'ON' : 'OFF',
            employeeCommission:this.priceNum(this.newStaff.employeeCommission,'out'),
            employeeRecommendBonus:this.priceNum(this.newStaff.employeeRecommendBonus,'out'),
            id:this.newStaff.id
          })
          await this.getDataDetail()
          this.isSave = false
          // this.$router.push({name: 'settings-staff-commission'})
        }
      })
    },
    //新客开发奖励--取消
    async new_cancel(){
      this.isSave = false
    },
    // goBack(){
    //   history.go(-1)
    // },
    //更改设置
    toSave() {
      this.isSave = true
      // this.newStaff.enabledTypeOne === 'ON' ? true : false
      // this.newStaff.enabledTypeSecond === 'ON' ? true : false
      // this.newStaff.enabledTypeThree === 'ON' ? true : false
    },
  }
}
</script>
<style lang="scss">
.page-settings-staff{
  .commissionBt{
    .service{
      margin-left: 5px;
      margin-top: -4px;
    }
    .inputs1{
      display: inline;
      padding: 0 !important;
      .el-input__inner{
        width: 100px;
      }
      &.inline{
        width: 100px !important;
        display: inline-block;
      }
    }
    .form-item-inline{
      width: 100px;
      display: inline-block;
    }
  }
  .table-container{
    margin: 20px auto;
    width: fit-content;
    .table-row{
      overflow: hidden;
      width: fit-content;
      .table-item{
        float: left;
        width: 200px;
        height: 40px;
        line-height: 40px;
        text-align: center;
        border-bottom: 1px solid #d8d8d8;
        border-right: 1px solid #d8d8d8;
        padding: 0 5px;
      }
      .header{
        background: #f8f8f8;
        font-weight: 600;
        border-top: 1px solid #d8d8d8;
      }
      .name{
        border-left: 1px solid #d8d8d8;
      }
      .edit-input{
        display: inline-block;
        width: fit-content;
        margin-right: 5px;
        .el-input__inner{
          width: 100px;
          height: 30px;
          line-height: 30px;
          position: relative;
          top: -3px;
        }
      }
    }
  }
}
</style>

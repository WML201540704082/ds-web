<template>
  <section class="page-campaign-add">
    <el-card>
      <el-form ref="coupon-form" :rules="dataFormRules" label-width="150px" :model="coupon" :validate-on-rule-change="false">
        <el-form-item label="优惠券名称" prop="name">
          <el-input v-model="coupon.name" :maxlength="15" placeholder="最多支持15个汉字"/>
        </el-form-item>
        <el-form-item label="优惠券类型" prop="type">
          <el-radio-group v-model="coupon.type" @change="changeTypeValue">
            <el-radio :label="item.value" :key="item.value" v-for="item in couponType">{{item.label}}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item v-show="coupon.type === 0" class="gt-input-tip" prop="discount" :rules="dynamicRules.discount">
          <el-input v-model="coupon.discount" class="min-input" placeholder="折扣" >
            <span slot="prefix" ><span class="unit">折</span> <span class="tip">*请输入0.1-9.9的数字(一位小数)</span></span>
          </el-input>
        </el-form-item>
        <el-form-item v-show="coupon.type === 1">
          <el-form-item prop="max" :rules="dynamicRules.max" class="fit-input">
            <div class="inner-label">减免金额：</div>
            <el-input class="min-input" v-model="coupon.max">
              <span slot="prefix" ><span class="unit">元</span> <span class="tip">减免金额{{special}}100000</span></span>
            </el-input>
          </el-form-item>
          <el-form-item prop="min" :rules="dynamicRules.min" class="fit-input">
            <div class="inner-label">使用条件： 满</div>
            <el-input class="min-input" v-model="coupon.min">
              <span slot="prefix" ><span class="unit">元可用</span> <span class="tip">减免金额{{special}}最低消费{{special}}100000</span></span>
            </el-input>
          </el-form-item>
        </el-form-item>
        <el-form-item label="适用门店" prop="storeRangeType">
          <el-radio-group v-model="coupon.storeRangeType"  @change="changeCouponType">
            <el-radio label='ALL'>全部门店</el-radio>
            <el-radio label='USABLE'>指定门店</el-radio>
          </el-radio-group>
          <div v-show="coupon.storeRangeType === 'USABLE'">
            <span>{{coupon.storeRange}}</span>
            <el-button type="primary" @click="selectStore">选择门店</el-button>
          </div>
        </el-form-item>
        <el-form-item label="适用范围" prop="productRangeType">
          <el-radio-group v-show="coupon.type != 2" v-model="coupon.productRangeType">
            <el-radio label='ALL'>全店商品</el-radio>
            <el-radio label='USABLE'>指定商品可用</el-radio>
          </el-radio-group>
          <div v-show="coupon.productRangeType  === 'USABLE'">
            <div><el-button type="primary" @click="chooseGoods">选择商品</el-button></div>
            <div class="table-edit-container" v-if="goodsList && goodsList.length > 0">
              <el-table
                :data="goodsList"
                border
                :stripe="true"
                max-height="360"
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
                 prop="operate"
                 min-width="60"
                 label="操作">
                 <template slot-scope="scope">
                   <el-button class="nopadding" type="text" size="small" @click="deleteStock(scope.$index,scope.row)">删除</el-button>
                 </template>
               </el-table-column>
                <el-table-column
                  prop="barcodes"
                  width="120"
                  :show-overflow-tooltip="true"
                  label="商品条码">
                </el-table-column>
                <el-table-column
                  prop="name"
                  align="center"
                  width="120"
                  :show-overflow-tooltip="true"
                  label="商品名称">
                </el-table-column>
                <el-table-column
                  prop="firstCategory"
                  width="100"
                  :show-overflow-tooltip="true"
                  label="一级分类">
                </el-table-column>
                <el-table-column
                  prop="category"
                  width="100"
                  :show-overflow-tooltip="true"
                  label="二级分类">
                </el-table-column>
                <el-table-column
                  prop="costPrice"
                  :show-overflow-tooltip="true"
                  label="成本价">
                  <template slot-scope="scope">
                    <span>{{number(priceNum(scope.row.costPrice))}}</span>
                  </template>
                </el-table-column>
                <el-table-column
                  prop="retailPrice"
                  :show-overflow-tooltip="true"
                  label="零售价">
                  <template slot-scope="scope">
                    <span>{{number(priceNum(scope.row.retailPrice))}}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="适用渠道" prop="channel">
          <el-checkbox-group v-model="coupon.channel">
             <el-checkbox label="1">线上</el-checkbox>
             <el-checkbox label="2">线下</el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效日期" class="gt-inline-item" required>
          <el-radio-group v-model="coupon.expiryDateType" @change="changeType">
            <el-radio label="DATETIME" style="display: block;">
              <gt-time-range
                :limitBeforeToday="currentTime"
                start-time-prop="effectiveBeginDate"
                :start-time-value="coupon.effectiveBeginDate"
                :end-time-value="coupon.effectiveEndDate"
                end-time-prop="effectiveEndDate"
                @changeStartValue="value => coupon.effectiveBeginDate = value"
                @changeEndValue="value => coupon.effectiveEndDate = value"
                type="date"
              ></gt-time-range>
            </el-radio>
            <el-radio class="no-margin-left" label="DAY">
              <el-form-item prop="effectiveDay" class="fit-input">
                自发放之日起
                <el-input class="min-input" v-model="coupon.effectiveDay">
                </el-input>
                天
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="是否与其他优惠共享">
          <el-radio-group disabled v-model="coupon.isSuperposition">
            <el-radio :label="1">是</el-radio>
            <el-radio :label="0">否</el-radio>
          </el-radio-group>
          <span style="color: red;">(暂不支持与其他优惠共享)</span>
        </el-form-item>
        <el-form-item label="使用说明" prop="instructions">
          <el-input
            type="textarea"
            :rows="3"
            placeholder="请输使用说明"
            v-model="coupon.instructions">
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
    <select-goods-modal ref="selectGoodsModal" @refreshData="changeGoods" />
    <single-goods-select ref="singleGoodsSelect" @refreshData="changeGoods" />
    <gt-dialog-checkbox ref="checkboxs" @list="listBox"/>
  </section>
</template>
<script>
import { couponType } from '@/utils/dict'
import selectGoodsModal from '../../components/select-goods-modal'
import singleGoodsSelect from './single-goods-select'
import { mapState } from 'vuex'
import gtTimeRange from '@/components/gt-time-range'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import { createCoupon,editCoupon,getCouponDetail } from '@/service/campaign'
import { number } from '@/utils/validate'
import { getStoreList } from '@/service/systore'
import moment from 'moment'
export default {
  name:'campaign-add',
  data() {
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('名字不能超过15个汉字'))
      } else{
        callback()
      }
    }
    const validateDiscount = (rule, value, callback) => {
      if (!judgeDiscount(value)) {
        callback(new Error('请输入正确的折扣'))
      } else {
        callback()
      }
    }
    const validateDay = (rule, value, callback) => {
      if (this.coupon.expiryDateType === 'DAY') {
        const reg = /^\d+$/
        if (value || value == 0) {
          if (!reg.test(value)) {
            callback(new Error('请输入0-99999的正整数！'))
          } else if (value < 0 || value > 99999){
            callback(new Error('请输入0-99999的正整数！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    const validateEffectiveBegin = (rule, value, callback) => {
      if (this.coupon.expiryDateType === 'DATETIME') {
        if (!value) {
          callback(new Error('请选择有效日期（起）'))
        }
      } else {
        callback()
      }
    }

    const validateEffectiveEnd = (rule, value, callback) => {
      if (this.coupon.expiryDateType === 'DATETIME') {
        if (!value) {
          callback(new Error('请选择有效日期（止）'))
        }
      } else {
        callback()
      }
    }

    const validateMin = (rule, value, callback) => {
      this.$refs['coupon-form'].clearValidate(['max'])
      if (!priceRange(value, 100000)) {
        callback(new Error('请输入正确的数字'))
      } else if (this.coupon.max && (Number(value) < Number(this.coupon.max))) {
        callback(new Error('满减规则有误'))
      } else {
        callback()
      }
    }
    const validateMax = (rule, value, callback) => {
      this.$refs['coupon-form'].clearValidate(['min'])
      if (!priceRange(value, 100000)) {
        callback(new Error('请输入正确的数字'))
      } else if (this.coupon.min && (Number(value) > Number(this.coupon.min))) {
        callback(new Error('满减规则有误'))
      } else {
        callback()
      }
    }
    const validateGoods = (rule, value, callback) => {
      if (this.coupon.productRangeType  == 'USABLE' && this.goodsList.length === 0) {
        this.$message.warning('请选择适用商品')
      } else {
        callback()
      }
    }
    const validateStore =  (rule, value, callback) => {
      if( this.storeRangeType == 'USABLE' && this.coupon.storeRange.length == 0){
        this.$message.warning('请选择适用门店')
      }else{
        callback()
      }
    }
    const validateIntroduce = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('使用说明不能超过200个汉字'))
      } else{
        callback()
      }
    }
    return {
      id:null,
      coupon: {
        productRangeType: 'ALL',//选择商品
        storeRangeType: 'ALL',//选择门店
        channel:['1','2'],//适用渠道
        type: 1, // 优惠券类型
        typeRule: null, // 优惠券规则
        isSuperposition : 0, //暂不能修改
        storeRange: [],
        productRange: [],
        instructions: null, // 使用说明
        effectiveBeginDate: null,
        effectiveEndDate: null,
        max: null,
        min: null,
        expiryDateType: 'DATETIME',
        effectiveDay: null,
        discount: null,
      },
      special: '<=',
      storeList: [], // 门店列表
      allStoreList: '', // 全部门店列表
      goodsList: [], // 商品列表
      number,
      couponType: couponType.filter(item => item.value !== 3),
      currentTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
      dynamicRules: {
        discount: [{required: true, message: '请填写折扣'}, {validator: validateDiscount, trigger: 'blur'}],
        // minsMoney: [{required: true, message: '请填写金额' }, {validator: validateMoney, trigger: 'blur'}],
        min: [{required: true, message: '请填写金额'}, {validator: validateMin, trigger: 'blur'}],
        max: [{required: true, message: '请填写金额'}, {validator: validateMax, trigger: 'blur'}],
      },
      dataFormRules: {
        name:[{required: true, message: '请填写优惠券名称'}, {validator: validateName, trigger: 'blur'}],
        type:[{required: true, message: '请选择优惠券类型'}],
        productRangeType: [{required: true, validator: validateGoods, trigger: 'blur'}],
        channel: [{required: true,message:"请选择适用渠道",trigger: 'blur'}],
        storeRangeType: [{required: true, validator: validateStore, trigger: 'blur'}],
        effectiveBeginDate:[{ validator: validateEffectiveBegin, message: '请选择有效期(起)'}],
        effectiveEndDate:[{ validator: validateEffectiveEnd, message: '请选择有效期(止)'}],
        instructions:[{validator: validateIntroduce, trigger: 'blur'}],
        effectiveDay:[{validator: validateDay, trigger: 'blur'}]
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  components: {
    selectGoodsModal, gtDialogCheckbox, gtTimeRange, singleGoodsSelect
  },
  async created(){
    this.getStorelist()
    this.$set(this.coupon, 'effectiveBeginDate', moment())
    // 编辑
    const { id } = this.$route.query
    this.id=id
    if(id){
      const data = await getCouponDetail(id)
       this.coupon = {
        name:data.name,
        typeRule:data.typeRule,
        type:data.type,
        effectiveDate:data.effectiveDate,
        effectiveDay:data.effectiveDay,
        expiryDateType:data.expiryDateType,
        productRangeType:data.productRangeType,
        storeRangeType:data.storeRangeType,
        storeRange:data.applyToStores,
        storeRangeId:data.applyToStores.map(item => item.id),//编辑时接收的门店id信息
        channel:data.channel,
        isSuperposition: data.isSuperposition,
        instructions: data.instructions,
      }
      //金额、折扣
      // this.coupon.discount = data.typeRule
      if(data.typeRule!=null){
        this.$set(this.coupon,'discount',data.typeRule)
        var arr = data.typeRule.split(',')
        this.$set(this.coupon,'min',arr[0])
        this.$set(this.coupon,'max',arr[1])
      }
      //日期
      if(data.effectiveDate){
        var str = data.effectiveDate
        var start = str.indexOf("至")
        this.coupon.effectiveBeginDate = moment(str.substring(start,0)) 
        this.coupon.effectiveEndDate = moment(str.substring(start+2))
      }
      //门店显示
      if(data.applyToStores.length == 0){
        this.coupon.storeRangeType ='ALL'
        this.coupon.storeRange = []
      }else{
        this.coupon.storeRangeType='USABLE'
        var arr =[]
        var array=data.applyToStores
        for(var i=0;i<array.length;i++){
          var getName=array[i].name
          arr.push(getName)
        }
        this.coupon.storeRange = arr.join(',')
        this.storeList = data.applyToStores
      }
      //商品显示
      if(this.coupon.type === 2 || data.applyToProducts.length > 0){
        this.coupon.productRangeType ='USABLE'
        this.goodsList = data.applyToProducts
      }else{
        this.coupon.productRangeType = 'ALL'
      }
      //适用渠道
      if(data.channel==0){
        this.coupon.channel=['1','2']
      }else if(data.channel == 1){
        this.coupon.channel = ['1']
      }else{
        this.coupon.channel = ['2']
      }
    }
    
  },
  methods: {
    // 删除
    deleteStock(index,row){
      this.goodsList.splice(index,1)
    },
    changeType(val){
      if(val == 'DATETIME'){
        this.coupon.effectiveDay = null
        this.$set(this.coupon, 'effectiveBeginDate', moment())
      }else{
        this.$set(this.coupon, 'effectiveBeginDate', moment())
        this.coupon.effectiveEndDate = null
      }
    },
    // 选择商品
    chooseGoods() {
      if (this.coupon.storeRangeType === 'USABLE' && this.storeList.length === 0 && this.coupon.storeRange.length===0) {
        this.$message.warning('请先选择适用门店！')
        return
      }

      const storeListIds = this.coupon.storeRangeType === 'USABLE' ? this.storeList.map(store => store.id).join(',') : this.allStoreList
      if (this.coupon.type === 2) {
        this.$nextTick(() => {
          this.$refs.singleGoodsSelect.init(this.goodsList, storeListIds)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.selectGoodsModal.init(this.goodsList, storeListIds)
        })
      }
    },
    // 选择门店
    selectStore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList)
      })
    },

    // 获取门店列表
    async getStorelist(){
      const { data } = await getStoreList({
        status:1
      })
      if(data && data.code ==0){
        this.allStoreList = data.data && data.data.map(store => store.id).join(',')
      }else{
        this.allStoreList =''
      }
    },
    // 修改优惠券类型
    changeCouponType() {
      this.storeList = []
      this.coupon.storeRange = ''
      this.goodsList = []
    },
    // 选中门店回调函数
    listBox(obj){
      var obj1 = JSON.parse(obj)
      this.storeList = obj1
      var storeVal = []
      var storeIdList = []
      for(var i in obj1){
        storeVal.push(obj1[i].name)
      }
      if (this.coupon.storeRange !== storeVal.join(',')) {
        this.goodsList = []
      }
      this.coupon.storeRange = storeVal.join(',')
      for(var i in obj1){
        storeIdList.push(obj1[i].id)
      }
      this.coupon.storeRangeId = storeIdList
      debugger
      this.$refs['coupon-form'].validateField('storeRange')
    },
    // 获取选中商品的列表
    changeGoods(list) {
      if (list && list.length <= 300) {
        this.goodsList = list
        this.$refs['coupon-form'].validateField('productRangeType')
      } else {
        this.$message.warning('优惠券适用商品的选择个数不能超过300个!')
      }
    },
    changeTypeValue() {
      this.$refs['coupon-form'].clearValidate(['discount', 'max', 'min'])
      this.coupon.discount = null
      this.coupon.max = null
      this.coupon.min = null
      if (this.coupon.type === 2) {
        this.coupon.productRangeType  = 'USABLE'
      } else {
        this.coupon.productRangeType  = 'ALL'
      }
      this.goodsList = []
    },
    // 添加优惠券
    async add() {
      if (this.coupon.expiryDateType === 'DATETIME' && !this.coupon.effectiveEndDate) {
        this.$message.warning('有效日期结束时间必填')
        return
      } else if(this.coupon.expiryDateType === 'DAY' && !this.coupon.effectiveDay){
        this.$message.warning('天数必填')
        return
      }else {
        const { id } = this.$route.query
        let validateArr = ['name', 'effectiveBeginDate','productRangeType', 'storeRangeType', 'effectiveEndDate','channel']
        // 规则类型
        let typeRule = null
        switch (this.coupon.type) {
        case 0:
          typeRule = Number(this.coupon.discount)
          validateArr.push('discount')
          break
        case 1:
          typeRule = `${Number(this.coupon.min)},${Number(this.coupon.max)}`
          validateArr.push('max')
          validateArr.push('min')
          break
        default:
          break
        }
        let valid = true
        this.$refs['coupon-form'].validateField(validateArr,  (flag, obj) => {
          if (flag && valid) {
            valid = false
          }
        })
        if (valid) {
          // 商品列表
          let productRange = []
          if (this.coupon.productRangeType  === 'ALL') {
            productRange = []
          } else {
            productRange = this.goodsList
          }
          let storeRange = []
          if (this.coupon.storeRangeType === 'ALL') {
            storeRange = []
          } else {
            storeRange = this.storeList.map(item => item.id)
          }
          // const { data } = await createCoupon({
          //   name: this.coupon.name,
          //   type: this.coupon.type,
          //   effectiveBeginDate: this.coupon.expiryDateType === 'DATETIME' ? moment(moment(this.coupon.effectiveBeginDate).format('YYYY-MM-DD')+' 00:00:00').valueOf() : null,
          //   effectiveEndDate: this.coupon.expiryDateType === 'DATETIME' ? this.coupon.effectiveEndDate : null,
          //   effectiveDay: this.coupon.expiryDateType === 'DAY' ? this.coupon.effectiveDay : null,
          //   isSuperposition: this.coupon.isSuperposition,
          //   instructions: this.coupon.instructions,
          //   expiryDateType: this.coupon.expiryDateType,
          //   storeRange: storeRange,
          //   productRange,
          //   typeRule,
          //   channel: this.coupon.channel.length < 2 ? +this.coupon.channel[0]:0,
          // })
          const query = {
            id:id,
            name: this.coupon.name,
            type: this.coupon.type,
            effectiveBeginDate: this.coupon.expiryDateType === 'DATETIME' ? moment(moment(this.coupon.effectiveBeginDate).format('YYYY-MM-DD')+' 00:00:00').valueOf() : null,
            effectiveEndDate: this.coupon.expiryDateType === 'DATETIME' ? moment(moment(this.coupon.effectiveEndDate).format('YYYY-MM-DD')+' 00:00:00').valueOf() : null,
            effectiveDay: this.coupon.expiryDateType === 'DAY' ? this.coupon.effectiveDay : null,
            isSuperposition: this.coupon.isSuperposition,
            instructions: this.coupon.instructions,
            expiryDateType: this.coupon.expiryDateType,
            storeRange: id ? (this.coupon.storeRangeType == 'ALL' ? [] : this.coupon.storeRangeId) :storeRange,
            productRange:JSON.parse(JSON.stringify(productRange).replace(/id/g, 'productId')),
            typeRule,
            channel: this.coupon.channel.length < 2 ? +this.coupon.channel[0]:0,
            storeRangeType:this.coupon.storeRangeType,
            productRangeType:this.coupon.productRangeType
          }
          const { data } = id ? await editCoupon(query) : await createCoupon(query)
          if (data.code === 0) {
            this.$router.push({name: 'campaign-storePromotion-coupon-campaign'})
          } else {
            this.$message.warning(data.msg)
          }
        } 
      }
    }
  },
}
</script>
<style lang="scss">
.page-campaign-add{
  .gt-time-range{
    display: inline-block;
  }
  .gt-inline-item{
    margin-bottom: 5px;;
  }
  .el-radio.no-margin-left {
    margin-left: 0;
    margin-top: 20px;
  }
  .min-input{
    .el-input__inner{
      width: 100px;
    }
  }
  .gt-input-tip{
    .min-input{
      .el-input__prefix{
        left: 110px;
      }
    }
  }
  .tip{
    color: #c0c4cc;
    font-size: 14px;
    margin-left: 5px;
  }
  .fit-input{
    margin-bottom: 15px;
    .inner-label{
      display: inline-block;
      width: 100px;
    }
    .el-input{
      width: calc(100% - 110px);
    }
    .el-input__inner{
      padding-left: 15px;
    }
    .el-input__prefix{
      left: 110px;
    }
    .unit {
      color: #333;
    }
  }
}
</style>


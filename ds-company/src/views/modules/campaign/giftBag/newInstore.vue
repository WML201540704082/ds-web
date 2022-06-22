<template>
  <section class="page-newInstore">
    <el-card>
      <el-form ref="newInstore" :rules="dataFormRules" label-width="150px" :model="newInstore" :validate-on-rule-change="false">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="newInstore.name" :maxlength="40" placeholder="最多支持40个字符"/>
        </el-form-item>
        <el-form-item label="活动时间" class="gt-inline-item" required>
          <gt-time-range
            :limitBeforeToday="currentTime"
            start-time-prop="beginDate"
            :start-time-value="newInstore.beginDate"
            :end-time-value="newInstore.endDate"
            end-time-prop="endDate"
            @changeStartValue="changeStartTime"
            @changeEndValue="changeEndTime"
            type="date">
          </gt-time-range>
        </el-form-item>
        <el-form-item label="用户发放限制" prop="ruleType" class="gt-inline-item">
          <el-radio-group v-model="newInstore.ruleType" style="margin-top: 10px;">
            <el-radio :label="1">
              每1天，所选优惠券每个券发放1张，多个优惠券自动推送，手动领取（天数限制范围：1-30）
            </el-radio>
            <br>
            <el-radio :label="2" style="margin-left: 0px;margin-top:10px">
              每隔 <el-input class="cus-mini-input" v-model="newInstore.rule" :maxlength="2"/> 天，所选优惠券每个券发放1张，多个优惠券自动推送，手动领取（天数限制范围：1-30）
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="适用门店" prop="storeRangeType">
          <el-radio-group v-model="storeRangeType" @change="chanegYHQ">
            <el-radio :label="1">全部门店</el-radio>
            <el-radio :label="2">指定门店</el-radio>
          </el-radio-group>
          <div v-show="storeRangeType === 2">
            <span>{{newInstore.storeRangeName || newInstore.storeRange}}</span>
            <el-button type="primary" @click="selectStore">选择门店</el-button>
          </div>
        </el-form-item>
        <el-form-item label="发放优惠券" prop="seleceYHQ">
          <el-button class="btn-big" type="primary" @click="selectCoupon">选择优惠券</el-button>
          <div class="table-edit-container" v-if="selectedList && selectedList.length > 0">
            <el-table
              :data="selectedList"
              border
              ref="editTable"
              v-loading="dataListLoading"
              :stripe="true"
              style="width: 100%;">
              <el-table-column
                prop="name"
                min-width="200"
                :show-overflow-tooltip="true"
                label="优惠券名称">
              </el-table-column>
              <el-table-column
                prop="type"
                align="center"
                min-width="150"
                :show-overflow-tooltip="true"
                label="优惠券类型">
                <template slot-scope="scope">
                  <span>{{filterStatus(scope.row.type, couponType)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="rule"
                min-width="150"
                :show-overflow-tooltip="true"
                label="优惠价值">
                <template slot-scope="scope">
                  <span>{{getRule(scope.row.type,scope.row.rule)}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="effectiveBeginDate"
                min-width="250"
                :show-overflow-tooltip="true"
                label="有效日期">
                <template slot-scope="scope">
                <span v-if="scope.row.effectiveType=='DAY'">自发放之日起 {{scope.row.effectiveDay}}天</span>
                <span v-else>{{scope.row.effectiveBeginDate || '--'}}至{{scope.row.effectiveEndDate || '--'}}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="storeRange"
                min-width="180"
                :show-overflow-tooltip="true"
                label="适用门店">
              </el-table-column>
            </el-table>
          </div>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
    <gt-dialog-checkbox ref="checkboxs" @list="listBox"/>
    <gt-select-coupon ref="selectcoupon" @refreshData="changeCoupon"/>
  </section>
</template>
<script>
import gtTimeRange from '@/components/gt-time-range'
import moment from 'moment'
import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import gtSelectCoupon from './select-coupon-modal'
import { filterStatus } from '@/utils'
import { couponType } from '@/utils/dict'
import { mapState } from 'vuex'
import giftBagVue from './giftBag.vue'
import { giftBagAdd,newPeopleDetails } from '@/service/campaign'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
export default {
  name:'campaign-giftBag-newInstore',
   components: {
    gtTimeRange,gtDialogCheckbox,gtSelectCoupon
  },
  data(){
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,40) == 1) {
        callback(new Error('名字不能超过20个汉字'))
      } else{
        callback()
      }
    }
    const validateEffectiveBegin = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择有效日期（起）'))
      } else {
        callback()
      }
    }

    const validateEffectiveEnd = (rule, value, callback) => {
      if (!value) {
        callback(new Error('请选择有效日期（止）'))
      } else {
        callback()
      }
    }
    const validateStore =  (rule, value, callback) => {
      if (this.storeRangeType == 2 && !this.newInstore.storeIds) {
        this.$message.warning('请选择适用门店')
      } else {
        callback()
      }
    }
    const validateYHQ = (rule, value, callback) => {
      if (this.selectedList.length === 0) {
        this.$message.warning('请选择适用商品')
      } else {
        callback()
      }
    }
    const validateRule = (rule, value ,callback) => {
      const reg = /^\d+$/
      if (!this.newInstore.ruleType) {
        callback(new Error('请选择用户方法限制'))
      }else if (this.newInstore.ruleType == 2) {
        if (!reg.test(this.newInstore.rule)) {
          callback(new Error('请填写1-30的天数'))
        }else if (this.newInstore.rule < 1 || this.newInstore.rule > 30){
          callback(new Error('请填写1-30的天数'))
        }else {
          callback()
        }
      } else if (this.newInstore.ruleType == 1){
        if (this.newInstore.rule) {
          callback(new Error('不能填写该选项'))
        }else{
          callback()
        }
      }else {
        callback()
      }
    }
    return{
      filterStatus,
      couponType,
      dataListLoading: false,
      editPeopleLoading: false,
      storeRangeType: 1,
      currentTime: moment().format('YYYY-MM-DD') + ' 24:00:00',
      newInstore:{
        beginDate: null,
        endDate: null,
        storeRange: null,
        effectiveType:'FIXED',
        ruleType: 1
      },
      storeList: [], // 门店列表
      selectedList: [],
      dataFormRules:{
        name:[{required: true, message: '请填写活动名称'}, {validator: validateName, trigger: 'blur'}],
        storeRangeType: [{required: true, validator: validateStore, trigger: 'blur'}],
        effectiveBeginDate:[{ validator: validateEffectiveBegin, message: '请选择有效期(起)'}],
        effectiveEndDate:[{ validator: validateEffectiveEnd, message: '请选择有效期(止)'}],
        seleceYHQ: [{required: true, validator: validateYHQ, trigger: 'blur'}],
        ruleType:[{required: true, validator: validateRule, trigger: 'blur'}],
      },
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  async created(){
    const { id } = this.$route.query
    this.id = id
    if (id) {
      const data = await newPeopleDetails(id)
      this.newInstore = data
      this.selectedList = data.coupons
      this.newInstore.beginDate = moment(data.beginDate)
      this.newInstore.endDate = moment(data.endDate)
      this.newInstore.ruleType = data.ruleType
      this.newInstore.rule = data.ruleType == 'ON_STORE_FIRST_RULE' ? '' : data.rule
      this.newInstore.storeIds = data.storeRange
      this.storeRange = data.storeRange
      if (data.ruleType === 'ON_STORE_FIRST_RULE') {
        this.newInstore.ruleType = 1
      } else {
        this.newInstore.ruleType = 2
      }
      this.$nextTick(() => {
        if (data.storeRange == 'all') {
          this.storeRangeType = 1
        } else {
          this.storeRangeType = 2
        }
      })
      this.storeRange = data.storeRange
    }
  },
  methods:{
    chanegYHQ(val){
      this.selectedList = []
      this.storeRange = ''
      this.newInstore.storeRange = ''
      this.newInstore.storeRangeName = ''
      this.storeList = []
    },
    changeStartTime(val){
      this.newInstore.beginDate = val
      this.selectedList = []
    },
    changeEndTime(val){
      this.newInstore.endDate = val
      this.selectedList = []
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
    // 选择门店
    selectStore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList,'',this.storeRange)
      })
    },
    // 选中门店回调函数
    listBox(obj){
      var obj1 = JSON.parse(obj)
      this.storeList = obj1
      var storeVal = []
      var storeIds = []
      for(var i in obj1){
        storeVal.push(obj1[i].name)
      }
      for(var i in obj1){
        storeIds.push(obj1[i].id)
      }
      if (storeVal.join(',') != this.newInstore.storeRange) {
        this.selectedList = []
      }
      this.newInstore.storeRange = storeVal.join(',')
      this.newInstore.storeIds = storeIds.join(',')
      // if (this.newInstore.storeIds !== this.storeRange) {
      //   this.selectedList = []
      //   this.storeRange = ''
      // }
      this.$refs['newInstore'].validateField('storeRange')
    },
    // 选择优惠券
    selectCoupon(){
      if (this.selectedList.length > 9) {
        this.$message.warning("最多添加10张优惠券！")
        return
      }
      if (this.storeRangeType == 2 && !this.newInstore.storeIds) {
        this.$message.warning("请先选择门店！")
        return
      }
      if (this.newInstore.effectiveType === 'FIXED') {
        if (!this.newInstore.beginDate && !this.newInstore.endDate) {
          this.$message.warning("请先选择活动时间")
        }else{
          this.$nextTick(()=>{
            this.$refs.selectcoupon.init(this.selectedList,this.newInstore,this.newInstore.storeIds,this.storeRangeType)
          })
        }
      }
    },
    // 优惠券回显
    changeCoupon(obj){
      this.selectedList = obj
    },
    // 添加优惠券
    async add() {
      if(this.selectedList&&this.selectedList.length>0){
        this.$refs['newInstore'].validate(async (valid) => {
          if (valid) {
            if (this.storeRangeType === 1) {
              this.storeRange = 'all'
            } else {
              this.storeRange = this.newInstore.storeIds
            }
            let form ={
              ...this.newInstore,
              'id': this.id,
              'coupons':this.selectedList.map(item => {
                return{
                  ...item,
                }
              }),
              beginDate: moment(moment(this.newInstore.beginDate).format('YYYY-MM-DD')+' 00:00:00').valueOf(),
              endDate: moment(moment(this.newInstore.endDate).format('YYYY-MM-DD')+' 23:59:59').valueOf(),
              storeRange:this.storeRange,
              type:'ON_STORE',
              ruleType:this.newInstore.ruleType === 1 ? 'ON_STORE_FIRST_RULE' : 'ON_STORE_SECOND_RULE',
              effectiveType:'FIXED',
              rule: this.newInstore.ruleType == 1 ? 1 : this.newInstore.rule
            }
            const { data } = await giftBagAdd(form)
            if(data && data.code == 0){
              this.$router.push({name:'campaign-giftBag-giftBag'})
            }else{
              this.$message.error(data.msg)
            }
          }
        })
      }else{
        this.$message.warning('请先选优惠券')
      }
    }
  },
}
</script>
<style lang="scss">
  .page_newInstore{
    .gt-inline-item{
      margin-bottom: 5px;;
    }
    .min-input{
      .el-input__inner{
        width: 100px !important;
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
  }
</style>

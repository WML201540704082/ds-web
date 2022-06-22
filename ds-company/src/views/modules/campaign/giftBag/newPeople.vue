<template>
  <section class="page-newPeople">
    <el-card>
      <el-form ref="newPeople" :rules="dataFormRules" label-width="150px" :model="newPeople" :validate-on-rule-change="false">
        <el-form-item label="活动名称" prop="name">
          <el-input v-model="newPeople.name" :maxlength="40" placeholder="最多支持40个字符"/>
        </el-form-item>
        <el-form-item label="有效日期" class="gt-inline-item" required>
          <el-radio-group v-model="newPeople.effectiveType" @change="chanegYHQ">
            <el-radio label="ALWAYS" style="display: inline-block;">长期有效</el-radio>
            <el-radio label="FIXED" style="display: inline-block;">固定日期
              <gt-time-range
                :limitBeforeToday="currentTime"
                start-time-prop="beginDate"
                :start-time-value="newPeople.beginDate"
                :end-time-value="newPeople.endDate"
                end-time-prop="endDate"
                @changeStartValue="changeStartTime"
                @changeEndValue="changeEndTime"
                type="date"
                style="display: inline;"
              ></gt-time-range>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户发放限制" prop="rule">
          注册 <el-input class="cus-mini-input" v-model="newPeople.rule" :maxlength="2"/> 天内的新客限领一次，多个券可分多次领取！（天数限制范围：1-30）
        </el-form-item>
        <el-form-item label="适用门店" prop="storeRangeType">
          <el-radio-group v-model="storeRangeType" @change="chanegYHQ">
            <el-radio :label="1">全部门店</el-radio>
            <el-radio :label="2">指定门店</el-radio>
          </el-radio-group>
          <div v-show="storeRangeType === 2">
            <span>{{newPeople.storeRange}}</span>
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
import { getStoreList } from '@/service/systore'
import gtSelectCoupon from './select-coupon-modal'
import { filterStatus } from '@/utils'
import { couponType } from '@/utils/dict'
import { mapState } from 'vuex'
import giftBagVue from './giftBag.vue'
import { giftBagAdd,newPeopleDetails } from '@/service/campaign'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
export default {
  name:'campaign-giftBag-newPeople',
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
      if (this.newPeople.effectiveType == 'FIXED') {
        if (!value) {
          callback(new Error('请选择有效日期（起）'))
        }
      } else {
        callback()
      }
    }

    const validateEffectiveEnd = (rule, value, callback) => {
      if (this.newPeople.effectiveType == 'FIXED') {
        if (!value) {
          callback(new Error('请选择有效日期（止）'))
        }
      } else {
        callback()
      }
    }
    const validateStore =  (rule, value, callback) => {
      if (this.storeRangeType == 2 && this.storeList.length === 0) {
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
      if (!reg.test(value)) {
        callback(new Error('请填写1-30的天数'))
      }else if (value < 1 || value > 30){
        callback(new Error('请填写1-30的天数'))
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
      newPeople:{
        beginDate: null,
        endDate: null,
        storeRange: null,
        effectiveType:'ALWAYS'
      },
      storeList: [], // 门店列表
      allStoreList: '', // 全部门店列表
      selectedList: [],
      dataFormRules:{
        name:[{required: true, message: '请填写活动名称'}, {validator: validateName, trigger: 'blur'}],
        storeRangeType: [{required: true, validator: validateStore, trigger: 'blur'}],
        effectiveBeginDate:[{ validator: validateEffectiveBegin, message: '请选择有效期(起)'}],
        effectiveEndDate:[{ validator: validateEffectiveEnd, message: '请选择有效期(止)'}],
        rule:[{required: true, validator: validateRule, trigger: 'blur'}],
        storeRangeType: [{required: true, validator: validateStore, trigger: 'blur'}],
        seleceYHQ: [{required: true, validator: validateYHQ, trigger: 'blur'}],
      },
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  async created(){
    this.getStorelist()
    const { id } = this.$route.query
    this.id = id
    if (id) {
      const data = await newPeopleDetails(id)
      this.newPeople = data
      this.selectedList = data.coupons
      this.newPeople.beginDate = moment(data.beginDate)
      this.newPeople.endDate = moment(data.endDate)
        this.$nextTick(() => {
        if (data.storeRange == 'all') {
          this.storeRangeType = 1
        } else {
          this.storeRangeType = 2
        }
      })
    }
  },
  methods:{
    chanegYHQ(val){
      this.selectedList = []
    },
    changeStartTime(val){
      this.newPeople.beginDate = val
      this.selectedList = []
    },
    changeEndTime(val){
      this.newPeople.endDate = val
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
      if (storeVal.join(',') != this.newPeople.storeRange) {
        this.selectedList = []
      }
      this.newPeople.storeRange = storeVal.join(',')
      this.newPeople.storeIds = storeIds.join(',')
      this.$refs['newPeople'].validateField('storeRange')
    },
    // 选择优惠券
    selectCoupon(){
      if (this.selectedList.length > 9) {
        this.$message.warning("最多添加10张优惠券！")
        return
      }
      if (this.newPeople.effectiveType == 'FIXED' && (!this.newPeople.beginDate || !this.newPeople.endDate)) {
        this.$message.warning("请先选择时间！")
        return
      }
      if (this.storeRangeType == 2 && !this.newPeople.storeIds) {
        this.$message.warning("请先选择门店！")
        return
      }
      this.$nextTick(()=>{
        this.$refs.selectcoupon.init(this.selectedList,this.newPeople, this.newPeople.storeIds,this.storeRangeType)
      })
    },
    // 优惠券回显
    changeCoupon(obj){
      this.selectedList = obj
    },
    // 添加优惠券
    async add() {
      if(this.selectedList && this.selectedList.length>0 && this.selectedList.length<=10){
        this.$refs['newPeople'].validate(async (valid) => {
          if (valid) {
            if (this.storeRangeType === 1) {
              this.storeRange = 'all'
            } else {
              this.storeRange = this.newPeople.storeIds
            }
            let form ={
              ...this.newPeople,
              'id': this.id,
              'coupons':this.selectedList.map(item => {
                return{
                  ...item,
                }
              }),
              beginDate: moment(moment(this.newPeople.beginDate).format('YYYY-MM-DD')+' 00:00:00').valueOf(),
              endDate: moment(moment(this.newPeople.endDate).format('YYYY-MM-DD')+' 23:59:59').valueOf(),
              ruleType:this.newPeople.ruleType === 1 ? 'ON_STORE_FIRST_RULE' : 'ON_STORE_SECOND_RULE',
              storeRange:this.storeRange,
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
  .page_newPeople{
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

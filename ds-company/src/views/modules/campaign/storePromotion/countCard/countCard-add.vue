<template>
  <section class="page-countCard-add">
    <el-card>
      <el-form ref="card-form" :rules="dataFormRules" label-width="150px" :model="card" :validate-on-rule-change="false">
        <el-form-item label="礼品卡名称" prop="name">
          <el-input v-model="card.name" :maxlength="15" placeholder="最多支持15个汉字"/>
        </el-form-item>
        <el-form-item label="适用门店" prop="storeRange">
          <span>{{card.storeRange}}</span>
          <el-button type="primary" @click="selectStore">选择门店</el-button>
        </el-form-item>
        <el-form-item label="卡项内容" prop="goodsType">
          <el-button type="primary" @click="chooseGoods">选择服务</el-button>
          <el-table
            :data="goodsList"
            border>
            <el-table-column
              prop="index"
              width="60"
              label="序号">
              <template slot-scope="scope">
                <span>{{scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              min-width="200"
              label="服务类商品">
            </el-table-column>
            <el-table-column
              prop="retailPrice"
              min-width="140"
              label="零售价">
              <template slot-scope="scope">
                <span>{{priceNum(scope.row.retailPrice)}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="count"
              min-width="120"
              label="次数">
              <template slot-scope="scope">
                <el-input class="gt-input-table-inner" v-model="scope.row.count" />
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item label="有效日期" required class="gt-inline-item">
          <el-radio-group v-model="card.validDateEnum" @change="changeType">
            <el-radio label="MONTH"  style="display: block;">
              <el-form-item prop="effectiveDay" class="fit-input">
                自购买日起
                <el-form-item prop="validTime">
                  <el-input v-model="card.validTime"/>
                </el-form-item>
                个月
              </el-form-item>
            </el-radio>
            <el-radio label="DATETIME" class="no-margin-left">
              <gt-time-range
                :limitBeforeToday="currentTime"
                start-time-prop="startTime"
                :start-time-value="card.startTime"
                :end-time-value="card.endTime"
                end-time-prop="endTime"
                @changeStartValue="value => card.startTime = value"
                @changeEndValue="value => card.endTime = value"
                type="date"
              ></gt-time-range>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="价格" prop="price" class="gt-input-tip" style="margin-top: 20px;">
          <el-input v-model="card.price" placeholder="请输入礼品卡的零售价格">
            <span slot="prefix" ><span class="unit">元</span></span>
          </el-input>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" rows="3" v-model="card.remark" placeholder="请输入备注内容"/>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
    <select-service-modal ref="selectServiceModal" @refreshData="changeGoods" />
    <gt-dialog-checkbox ref="checkboxs" @list="listBox"/>
  </section>
</template>
<script>
// import gtSubTitle from '@/components/gt-sub-title'
import { cardType } from '@/utils/dict'
import { mapState } from 'vuex'
import { limitInputName, validateDiscount as judgeDiscount, priceRange } from '@/utils/validate'
import gtDialogCheckbox from '@/components/gt-dialog-checkbox'
import selectServiceModal from '../../components/select-service-modal'
import { createStatCard, editStatCard, getStatCardDetail } from '@/service/campaign'
import gtTimeRange from '@/components/gt-time-range'
import { number } from '@/utils/validate'
import moment from 'moment'
import _ from 'lodash'
export default {
  name:'countCard-add',
  data() {
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('名字不能超过15个汉字'))
      } else{
        callback()
      }
    }

    const validateGoods = (rule, value, callback) => {
      if (this.goodsList.length === 0) {
        this.$message.warning('请选择服务商品')
      } else {
        callback()
      }
    }

    const validateStore =  (rule, value, callback) => {
      if (!value) {
        this.$message.warning('请选择适用门店')
        callback()
      } else {
        callback()
      }
    }

    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 499999.99)) {
          callback(new Error('请输入0.01-499999.99的价格数字，最多保留小数点后两位'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }

    var checkIsPositiveIntegerEx0 = (rule, value, callback) => {
      if (this.card.validDateEnum === 'MONTH') {
        var reg = /^([1-9][0-9]*)$/
        if(reg.test(value)) {
          if (value > 120) {
            callback(new Error('最大支持120个月'))
          } else {
            callback()
          }
        }else{
          callback(new Error('请输入大于零的正整数'))
        }
      }else {
        callback()
      }
    }

    const validateEffectiveBegin = (rule, value, callback) => {
      if (this.card.validDateEnum === 'DATETIME') {
        if (!value) {
          callback(new Error('请选择有效日期（起）'))
        }else{
          callback()
        }
      } else {
        callback()
      }
    }

    const validateEffectiveEnd = (rule, value, callback) => {
      if (this.card.validDateEnum === 'DATETIME') {
        if (!value) {
          callback(new Error('请选择有效日期（止）'))
        }else{
          callback()
        }
      } else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,400) == 1) {
        callback(new Error('备注不能超过200个汉字'))
      } else{
        callback()
      }
    }

    return {
      currentTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
      card: {
        name: '',
        storeRange: '',
        validDateEnum: 'MONTH',
        startTime: null,
        endTime: null,
        validTime: null,
        price: null,
        remark: null
      },
      storeList: [], // 门店列表
      goodsList: [], // 商品列表
      dataFormRules: {
        name:[{required: true, message: '请填写礼品卡名称'}, {validator: validateName, trigger: 'blur'}],
        storeRange: [{required: true, validator: validateStore}],
        goodsType: [{required: true, validator: validateGoods}],
        validTime: [{validator: checkIsPositiveIntegerEx0, trigger: 'blur' }],
        startTime:[{ validator: validateEffectiveBegin, message: '请选择有效期(起)'}],
        endTime:[{ validator: validateEffectiveEnd, message: '请选择有效期(止)'}],
        price:[{required: true, message: '请填写价格'}, {validator: validatePrice, trigger: 'blur' }],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  components: {
    selectServiceModal, gtDialogCheckbox,gtTimeRange
  },
  methods: {
    changeType(val){
      if(val == 'DATETIME'){
        this.card.validTime = null
        // this.$set(this.card, 'startTime', moment())
        this.card.startTime = moment()
        this.card.endTime = null
      }else{
        this.card.startTime = null
        this.card.endTime = null
      }
    },
    // 选择商品
    chooseGoods() {
      if (this.storeList && this.storeList.length > 0) {
        const storeIds = this.storeList.map(item => item.id)
        this.$nextTick(() => {
          this.$refs.selectServiceModal.init(this.goodsList, {saleChannel: 1, storeIds: storeIds.join(',')})
        })
      } else {
        this.$message.warning('请先选择适用门店')
      }
    },
    // 选择门店
    selectStore(){
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList)
      })
    },
    // 获取选中商品的列表
    changeGoods(list) {
      const originList = _.cloneDeep(this.goodsList)
      this.goodsList = list.map(item => {
        const origin = originList.find(ele => ele.id == item.id)
        return {
          ...item,
          count: origin ? origin.count : 0
        }
      })
      // this.$refs['card-form'].validateField('goodsRange')
    },
    // 选中门店回调函数
    listBox(obj){
      var obj1 = JSON.parse(obj)
      this.storeList = obj1
      var storeVal = []
      for(var i in obj1){
        storeVal.push(obj1[i].name)
      }
      if (this.card.storeRange !== storeVal.join(',')) {
        this.goodsList = []
      }
      this.card.storeRange = storeVal.join(',')
      this.$refs['card-form'].validateField('storeRange')
    },

    // 检测礼品卡的次数
    checkCount(list) {
      let flag = true
      let reg = /^([1-9][0-9]*)$/
      list.forEach(item => {
        const reg = /^\d+$/
        if (!reg.test(item.count)) {
          flag = false
        } else if (item.count < 1 || item.count > 10000){
          flag = false
        }
      })
      if (!flag) {
        this.$message.warning('服务次数请填写1-10000的正整数！')
      }
      return flag
    },

    // 添加礼品卡
    async add() {
      console.log(this.card.startTime)
      this.$refs['card-form'].validate(async (valid) => {
        if (valid && this.checkCount(this.goodsList) ) {
          const items = this.goodsList.map(item => {
            return {
              productId: item.id,
              name: item.name,
              retailPrice: item.retailPrice,
              count: item.count || 0
            }
          })

          const query = {
            ...this.card,
            validTime: this.card.validDateEnum === 'MONTH' ? this.card.validTime : null,
            startTime: moment(moment(this.card.startTime).format('YYYY-MM-DD')+' 00:00:00').valueOf(),
            endTime: moment(moment(this.card.endTime).format('YYYY-MM-DD')+' 23:59:59').valueOf(),
            price: this.priceNum(this.card.price, 'out'),
            items,
            stores: this.storeList
          }
          // 商品列表
          const { data } = this.card.id ? await editStatCard(query) : await createStatCard(query)
          if (data.code === 0){
            this.$router.push({name: 'campaign-storePromotion-countCard-countCard'})
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  },
  async created(){
    const { id } = this.$route.query
    if (id) {
      const data = await getStatCardDetail({id})
      this.storeList = data.stores
      this.goodsList = data.items.map(goods => {
        return {
          ...goods,
          id: goods.productId
        }
      })
      this.card = {
        id: data.id,
        name: data.name,
        storeRange: data.stores.map(store => store.name).join(','),
        validDateEnum: data.validDateEnum,
        startTime: moment(data.startTime),
        endTime: moment(data.endTime),
        validTime: data.validTime,
        price: this.priceNum(data.price),
        remark: data.remark
      }
    }
  }
}
</script>
<style lang="scss">
.page-countCard-add{
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
  .tip{
    color: #c0c4cc;
    font-size: 14px;
    margin-left: 5px;
  }
  .el-textarea.el-input--medium{
    width: 400px;

  }
  .gt-input-table-inner{
    width: 100%;
    padding-left: 0 !important;
    padding-right: 0 !important;
    .el-input__inner{
      width: 100%;
    }
  }

}
</style>

<template>
  <section class="page-full-add">
    <el-card>
      <el-form ref="fullReduction" :rules="dataFormRules" label-width="90px" :model="fullReduction">
        <el-form-item label="促销类型" prop="promotionType">
          <el-radio-group v-model="fullReduction.promotionType">
            <el-radio
              v-for="item in promotionType"
              :key="item.value"
              :label="item.value">
              {{item.label}}
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="促销名称" prop="name">
          <el-input v-model="fullReduction.name" :maxlength="15" placeholder="最多支持15个汉字"/>
        </el-form-item>
        <el-form-item label="有效日期" class="gt-inline-item" required>
          <gt-time-range
            :limitBeforeToday="currentTime"
            start-time-prop="fullReduction.startTime"
            :start-time-value="fullReduction.startTime"
            :end-time-value="fullReduction.endTime"
            end-time-prop="fullReduction.endTime"
            @changeStartValue="value => fullReduction.startTime = value"
            @changeEndValue="value => fullReduction.endTime = value"
            type="date"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="活动门店" prop="storeIds">
          <span>{{storeNames}}</span>
          <el-button type="primary" @click="selectSalestore">选择门店</el-button>
        </el-form-item>
        <el-form-item label="活动规则" prop="remit">
          <el-tooltip placement="top">
            <div slot="content" style="width: 680px;">
              默认规则是“满减”，即：满xx元减xx元，固定值减，比如满100减10元，满200还是减10元；<br>
              若开启了“每满减”，即：每满xx元减xx元，满减金额自动叠加。比如满100减10元，则满200自动减10*2=20元）
            </div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
          满 <el-input class="cus-mini-input" v-model="fullReduction.condition"></el-input> 元 
          <el-select  v-model="fullReduction.remitType" placeholder="请选择" filterable clearable>
            <el-option  
              v-for="item in (fullReduction.every ? remitTypes : remitType)"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
          <el-input class="cus-mini-input" v-model="fullReduction.remit"></el-input> 
          <el-checkbox v-model="fullReduction.every" @change="changeEvery">启用 “每满减”</el-checkbox>
        </el-form-item>
        <el-form-item label="商品" prop="goodsType">
          <el-row>
            <el-button type="primary" @click="chooseGoods()">选择商品</el-button><span class="tip">*支持对多个不同的商品批量设置相同的促销规格</span>
            <span style="float:right;margin-right:6px;">共 {{goodsList.length}} 条</span>
          </el-row>
          <el-table
            :data="goodsList"
            ref="editTable"
            :highlight-current-row='true'
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
              prop="index"
              width="60"
              label="操作">
              <template slot-scope="scope">
                <span class="theme-color" style="cursor: pointer" @click="deleteHandle(scope.$index)">移除</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              min-width="180"
              label="商品名称">
            </el-table-column>
            <el-table-column
              prop="barcodes"
              min-width="150"
              label="商品条码">
            </el-table-column>
            <!-- <el-table-column
              prop="newCode"
              min-width="180"
              label="商品自编码">
            </el-table-column> -->
             <el-table-column
              prop="brandName"
              min-width="180"
              label="品牌">
            </el-table-column>
            <el-table-column
              prop="retailPrice"
              :show-overflow-tooltip="true"
              min-width="120"
              label="零售价">
              <template slot-scope="scope">
                <span>￥ {{priceNum(scope.row.retailPrice)}}</span>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <el-form-item>
          <span class="tip">说明：</span><br>
          <span class="tip">1、当商品同时存在会员价和满减活动,POS下单商品统一零售价</span><br>
          <span class="tip">2、在相同的活动时间内，相同的商品在同一个门店下只能存在一个第n件打折或一个满减活动，满减活动"满减"和"没满减"不可同时存在 </span><br>
          <span class="tip">3、含有促销的商品不可使用优惠卷</span><br>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="$store.state.loading.global" @click.native="add" txt="确定"/>
    </div>
    <gt-dialog-checkbox ref="checkboxs" :initSelectList="initSelectList" @list="listBox"/>
    <select-goods ref="selectGoodsModal" @refreshData="changeGoods" />
  </section>
</template>
<script>
import gtDialogCheckbox from "@/components/gt-dialog-checkbox";//选择门店
import selectGoods from './select-goods-modal'//选择商品
import gtTimeRange from '@/components/gt-time-range'
import { filterStatus } from '@/utils'
import { getfullDetail,saveFull,updateFull } from '@/service/campaign'
import { promotionType,remitType,remitTypes,saleChannel } from '@/utils/dict'
import { limitInputName, priceRange, twoDecimal } from '@/utils/validate'
import { getStoreList } from '@/service/systore'
import moment from 'moment'
import NP from 'number-precision'
export default {
  name:'promote-full-add-or-update',
  data(){
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('名字不能超过15个汉字'))
      } else{
        callback()
      }
    }
    const validateGoods = (rule, value, callback) => {
      if (this.goodsList.length === 0) {
        this.$message.warning('请选择商品')
      }  else {
        callback()
      }
    }
    const validateDec = (rule, value, callback) => {
      if (!priceRange(value, 100, 0)) {
        callback(new Error('请输入0-100的数字，最多保留小数点后两位'))
      } else{
        callback()
      }
    }
    const validatePrice = (rule, value, callback) => {
      console.log(value)
      if (value) {
        if (!priceRange(value, 20000)) {
          callback(new Error('请输入0.01-20000的价格数字，最多保留小数点后两位'))
        } else if (NP.times(value, 100) > this.total){
          callback(new Error('组合价格不能大于商品总价'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    const isValidate = (rule ,value,callback)=>{
      if(value <= moment().valueOf()){
        callback(new Error('有效结束日期不得小于等于当前时间'))
      }else{
        callback()
      }
    }
    const validateStore =  (rule, value, callback) => {
      if (!this.storeNames) {
        this.$message.warning('请选择适用门店')
        callback()
      } else {
        callback()
      }
    }
    return{
      currentTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
      promotionType,
      remitType,
      remitTypes,
      goodsList:[],
      initSelectList: [],
      stores:[],
      saleChannel,
      storeNames: '',
      storeIds: '',
      NP,
      fullReduction:{
        saleChannel:[1],
        every:false,
        startTime: '',
        endTime: '',
        remitType: 'REMIT'
      },
      dataFormRules: {
        name:[{required: true, message: '请填写促销名称'}, {validator: validateName, trigger: 'blur'}],
        goodsType: [{required: true, validator: validateGoods}],
        startTime:[{ required: true, message: '请选择有效期(起)'}],
        endTime: [{ required: true, message: '请选择有效期(止)'},{validator:isValidate,trigger:'change'}],
        storeIds: [{required: true, validator: validateStore}],
        remit: [{ required: true, message: '请填满减金额'}],
      }
    }
  },
  created() {
    // 获取门店列表
    this.getStores()
    const { id } = this.$route.query
    // 获取详情
    if (id) {
      this.id = id
      this.getDetail(id)
    }
  },
  components: {
    gtDialogCheckbox,
    gtTimeRange,
    selectGoods,
  },
  computed: {
    total() {
      let res = 0
      if (this.goodsList && this.goodsList.length > 0) {
        this.goodsList.forEach(item => {
          res = NP.plus(NP.times(item.retailPrice, isNaN(item.quantity) ? 0 : item.quantity), res)
        })
      }
      this.$nextTick(() => {
        this.$refs['fullReduction'].validateField('composePrice')
      })
      return res

    },
    // count() {
    //   let res = 0
    //   if (this.goodsList && this.goodsList.length > 0) {
    //     this.goodsList.forEach(item => {
    //       res = NP.plus((isNaN(item.quantity) ? 0 : item.quantity), res)
    //     })
    //   }
    //   this.$nextTick(() => {
    //     this.$refs['fullReduction'].validateField('composePrice')
    //   })
    //   return this.goodsList.length
    // }
  },
  methods:{
    checkNumber() {
      let flag = true
       var reg = /^(\d{0,8})(\.(\d{0,2}))?$/g;
        if (!reg.test(this.fullReduction.condition) || parseInt(this.fullReduction.condition) >99999.99) {
          this.$message.warning('请输入0.1~99999.99的数字(两位小数)')
          flag = false
        }else {
      if (this.fullReduction.remitType === 'DISCOUNT') {//打折
        var reg = /^([1-9])(\.(\d{0,1}))?$/g;
        if (!reg.test(this.fullReduction.remit) || parseInt(this.fullReduction.remit) > 9.9) {
          this.$message.warning('请输入1~9.9的数字(一位小数)')
          flag = false
        }
      }else {
        //满减
        var reg =/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/
        if (!reg.test(this.fullReduction.remit)) {
          this.$message.warning('满减金额请保留2位小数')
            flag = false
        }else if(this.fullReduction.remitType === 'REMIT' && parseInt(this.fullReduction.remit) > parseInt(this.fullReduction.condition)) {
          this.$message.warning('活动减的金额应不能大于活动条件的金额')
          flag = false
        }
      }
      return flag
        }
    },
    changeEvery(){
      if (this.fullReduction.every) {
        this.fullReduction.remitType = 'REMIT'
      }
    },
    // 获取促销详情
    async getDetail(id) {
      // 商品列表
      const { data } = await getfullDetail(id)
      if (data.code === 0) {
        this.fullReduction = data.data
        this.fullReduction.startTime = moment(data.data.startTime).valueOf()
        this.fullReduction.endTime = moment(data.data.endTime).valueOf()
        this.fullReduction.condition = this.priceNum(data.data.condition)
        this.fullReduction.remit = this.priceNum(data.data.remit)
        this.goodsList = data.data.products
        // 转换门店
        this.storeIds = data.data.storeIds
        var storeVal = []
        var storeIdItem = []
        for (let i = 0; i < this.storeIds.length; i++) {
          const item = this.storeIds[i]
          storeIdItem.push(item)
          const storeNames = this.stores.find(ele => ele.id == item).name
          storeVal.push(storeNames)
        }
        this.storeIdItem=storeIdItem.join(',')
        this.storeNames=storeVal.join(',')
      } else {
        this.$message.error('获取促销详情失败！')
      }
    },
    // 获取企业下属门店
    async getStores() {
      const { data } = await getStoreList({
        status:1
      })
      if (data.code === 0) {
        this.stores = data.data
      } else {
        this.$message.error(data.msg)
      }
    },
    //弹框复选
    listBox(obj) {
      var obj1 = JSON.parse(obj);
      this.storeList = obj1;
      var storeVal = [];
      var storeIds = [];
      for (var i in obj1) {
        if (obj1[i].name) {
          storeVal.push(obj1[i].name);
        }
        storeIds.push(obj1[i].id);
      }
      this.storeNames = storeVal.join(",");
      this.storeIds = storeIds;
    },
    // 选择门店
    selectSalestore() {
      this.$nextTick(() => {
        this.$refs.checkboxs.init(this.storeList,'',this.storeIdItem);
      });
    },
    // 选择商品
    chooseGoods() {
      if(!this.storeIds && !this.storeIdItem){
        this.$message.warning('请先选择门店')
      }
      const storeListIds = this.storeIdItem ? this.storeIdItem : this.storeList.map(store => store.id).join(',')
      if(!this.fullReduction.startTime || !this.fullReduction.endTime){
        this.$message.warning('请先选择有效时间')
      }else{
        this.$nextTick(() => {
          debugger
          this.$refs.selectGoodsModal.init(this.goodsList,this.fullReduction.startTime,this.fullReduction.endTime, storeListIds,'full')
        })
      }
    },
    // 获取选中商品的列表
    changeGoods(list) {
      this.goodsList = list.map(item => {
        const currentItem = this.goodsList.find(ele => {
          return ele.id === item.id
        })
        return {
          ...item,
          quantity: currentItem ? currentItem.quantity : 1
        }
      })
    },
    // 删除商品
    deleteHandle(index) {
      this.goodsList.splice(index, 1)
    },
    // 添加
    async add() {
      if (this.fullReduction.endTime < Date.parse(moment(new Date()).format('YYYY-MM-DD') + ' 23:59:59')) {
        this.$message.warning('有效截止时间需大于等于当前时间')
        return
      }
      this.$refs['fullReduction'].validate(async (valid) => {
        if (valid && this.checkNumber()) {
          const products = this.id ? this.goodsList.map(item => item.productId) : this.goodsList.map(item => item.id)
          // 商品列表
          let query = {
            id: this.id ? this.id : null,
            condition: this.priceNum(this.fullReduction.condition,'out'),
            endTime: moment(this.fullReduction.endTime).format('YYYY-MM-DD') + ' 23:59:59',
            every: this.fullReduction.every || false,
            name: this.fullReduction.name,
            productIds: products,
            promotionType: this.fullReduction.promotionType,
            remit: this.priceNum(this.fullReduction.remit,'out'),
            remitType: this.fullReduction.remitType,
            startTime: moment(this.fullReduction.startTime).format('YYYY-MM-DD') + ' 00:00:00',
            storeIds:this.storeIds,
          }
          const { data } = !this.id ? await saveFull(query) : await updateFull(query)
          if (data.code === 0) {
            this.$router.push({name: 'campaign-storePromotion-promote-list'})
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  },
}
</script>
<style lang="scss">
  .page-promote-add{
    .tip{
      color: #c0c4cc;
      font-size: 14px;
      margin-left: 5px;
    }
  }
</style>
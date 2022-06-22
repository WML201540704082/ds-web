<template>
  <section class="page-promote-add">
    <el-card>
      <el-form ref="promote-form" :rules="dataFormRules" label-width="90px" :model="promote">
       <!--el-form-item label="促销类型" prop="promoteDto.type">
          <el-radio-group v-if="!promote.id" v-model="promote.promoteDto.type" @change="changePromote">
            <el-radio
              v-for="item in promoteType"
              :key="item.value"
              :label="item.value">
                {{item.label}}
            </el-radio>
          </el-radio-group>
          <span class="itemInput" v-else>{{filterStatus(promote.promoteDto.type, promoteType)}}</span>
        </el-form-item-->
        <el-form-item label="促销名称" prop="promoteDto.name">
          <el-input v-model="promote.promoteDto.name" :maxlength="15" placeholder="最多支持15个汉字"/>
        </el-form-item>
        <el-form-item label="促销渠道" prop="promoteDto.saleChannel">
          <el-checkbox-group v-model="promote.promoteDto.saleChannel">
            <el-checkbox
              v-for="item in saleChannel"
              :key="item.value"
              :label="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="有效日期" class="gt-inline-item" required>
          <gt-time-range
            :limitBeforeToday="currentTime"
            start-time-prop="promoteDto.startTime"
            :start-time-value="promote.promoteDto.startTime"
            :end-time-value="promote.promoteDto.endTime"
            end-time-prop="promoteDto.endTime"
            @changeStartValue="value => promote.promoteDto.startTime = value"
            @changeEndValue="value => promote.promoteDto.endTime = value"
            type="date"
          ></gt-time-range>
        </el-form-item>
        <el-form-item label="商品" prop="goodsType">
          <el-row>
            <el-button type="primary" @click="chooseGoods()">选择{{promote.promoteDto.type === 'COMPOSE' ? '组合' : '促销'}}商品</el-button>
            <span class="tip" v-show="promote.promoteDto.type === 'COMPOSE'">*所选择的多个商品将作为一个组合一起销售</span>
            <span class="tip" v-show="promote.promoteDto.type === 'DISCOUNT'">*支持对多个不同商品批量设置相同的促销规则</span>
            <span class="count">共 {{count}} 件</span>
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
              <!-- <template slot-scope="scope">
                <span >{{scope.row.barcodes instanceof Array && scope.row.barcodes.join(',')}}</span>
              </template> -->
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
            <el-table-column
              prop="quantity"
              min-width="120"
              v-if="promote.promoteDto.type === 'COMPOSE'"
              label="数量">
              <template slot-scope="scope">
                <el-input class="edit-input" v-model="scope.row.quantity" placeholder="请输入数量"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-form-item>
        <section v-if="promote.promoteDto.type === 'COMPOSE'">
          <el-form-item label="商品总价">
            <span>{{priceNum(total)}} 元</span>
          </el-form-item>
          <el-form-item label="组合价格" prop="composePrice" class="gt-input-tip">
            <el-input v-model="promote.composePrice" placeholder="请输入组合价格">
              <span slot="prefix" ><span class="unit">元</span></span>
            </el-input>
          </el-form-item>
          <el-form-item label="组合优惠">
            <span>{{isNaN(promote.composePrice ) ? 0 : priceNum(total - (promote.composePrice * 100))}} 元</span>
          </el-form-item>
        </section>
        <section v-if="promote.promoteDto.type === 'DISCOUNT'">
          <el-form-item
            :prop="'items.'+ index + '.percent'"
            :rules="[{required: true, message: '请输入折扣'}, {validator: validateDec, trigger: 'blur' }]"
            :label="`第${chineseParse(index + 1)}件${index === promote.items.length - 1 ? '及以上折扣' : '折扣'}`"
            :key="index" class="gt-input-tip" :class="{'last-item': index === promote.items.length - 1}"
            v-for="(item, index) in promote.items">
            <el-input v-model="item.percent" placeholder="请输入折扣">
              <span slot="prefix" >
                <span class="unit">%</span>
                <span class="operate" style="margin-right: 10px;" v-if="index > 2" @click="() => deleteDiscount(index)"><icon-svg name="20" class="theme-color middle" ></icon-svg></span>
                <span class="operate" v-if="index === promote.items.length - 1&&promote.items.length<=9" @click="addDiscount"><icon-svg name="create" class="theme-color middele"></icon-svg> 添加折扣阶梯</span>
              </span>
            </el-input>
          </el-form-item>
        </section>
        <el-form-item>
          <span class="tip">* 包含促销商品的订单不可使用优惠券</span>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="$store.state.loading.global" @click.native="add" txt="确定"/>
    </div>
    <select-goods ref="selectGoodsModal" @refreshData="changeGoods" />
    <ensure-modal ref="ensureModal"/>
  </section>
</template>
<script>
import { promoteType, saleChannel } from '@/utils/dict'
import { chineseParse } from '@/utils'
import { mapState } from 'vuex'
import { getPromoteDetail, saveCompose, saveDiscount, checkProduct } from '@/service/campaign'
import gtTimeRange from '@/components/gt-time-range'
import { limitInputName, priceRange, twoDecimal } from '@/utils/validate'
import selectGoods from '../goods-modal'
import ensureModal from '../ensure-modal'
import moment from 'moment'
import NP from 'number-precision'
import { filterStatus } from '@/utils'
import _ from 'lodash'
export default {
  name:'promote-add-discount',
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
        this.$message.warning('请选择商品')
      } else if (this.promote.promoteDto.type === 'COMPOSE' && this.goodsList.length === 1){
        this.$message.warning('组合商品数量需大于等于2种')
      } else {
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
    return {
      currentTime: moment().format('YYYY-MM-DD') + ' 00:00:00',
      promote: {
        id: null,
        promoteId: null,
        composePrice: null, //组合价格
        freePrice: 0, //优惠价格

        items: [{percent: 0}, {percent: 0}, {percent: 0}],
        promoteDto: {
          type: 'DISCOUNT',
          saleChannel: [-1, 1],
          name: '',
          composePrice: '',
          startTime: '',
          endTime: ''
        }
      },
      filterStatus,
      status:'',
      validateDec,
      goodsList: [], // 商品列表
      promoteType,
      saleChannel,
      chineseParse,
      dataFormRules: {
        'promoteDto.type':[{required: true, message: '请填写促销类型'}],
        'promoteDto.name':[{required: true, message: '请填写促销名称'}, {validator: validateName, trigger: 'blur'}],
        goodsType: [{required: true, validator: validateGoods}],
        composePrice:[{required: true, message: '请填写组合价格'}, {validator: validatePrice, trigger: 'blur' }],
        'promoteDto.startTime':[{ required: true, message: '请选择有效期(起)'}],
        'promoteDto.endTime': [{ required: true, message: '请选择有效期(止)'},{validator:isValidate,trigger:'change'}],
        'promoteDto.saleChannel': [{ required: true, message: '请选择销售渠道'}],
        // discount: [{required: true, message: '请输入折扣'}, {validator: validateDec, trigger: 'blur' }],
      }
    }
  },

  created() {
    const { id,status } = this.$route.query
    // 获取详情
    if (id) {
      this.status = status
      this.getDetail(id)
    }
  },
  components: {
    gtTimeRange,
    selectGoods,
    ensureModal
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
        this.$refs['promote-form'].validateField('composePrice')
      })
      return res

    },
    count() {
      let res = 0
      if (this.goodsList && this.goodsList.length > 0) {
        this.goodsList.forEach(item => {
          res = NP.plus((isNaN(item.quantity) ? 0 : item.quantity), res)
        })
      }
      this.$nextTick(() => {
        this.$refs['promote-form'].validateField('composePrice')
      })
      return res
    }
  },
  methods: {
    changePromote(){
      this.goodsList = []
      // this.calcTotal()
    },
    // 检查商品数量的个数
    checkNumber() {
      let flag = true
      if (this.promote.promoteDto.type === 'COMPOSE') {
        for(let i = 0; i < this.goodsList.length; i++) {
          const item = this.goodsList[i]
          var reg = /^[1-9]\d*$/
          if (!reg.test(item.quantity) || parseInt(item.quantity) > 10) {
            this.$message.warning('商品数量请输入1-10的整数！')
            flag = false
            break
          }
        }
      }
      return flag
    },
    // 获取促销详情
    async getDetail(id) {
      // 商品列表
      const { data } = await getPromoteDetail(id)
      if (data.code === 0) {

        var goodsList = data.data.promoteDto.products
        var proList = goodsList.map(item => {
          return {
            cover: item.cover,
            code: item.productCode,
            barcodes: item.barCodeList,
            editId: item.id,
            id: item.productId,
            name: item.productName,
            quantity: item.quantity,
            retailPrice: item.salesPrice
          }
        })
        this.promote = {
          items: [{percent: 0}, {percent: 0}, {percent: 0}],
          ...data.data,
          composePrice: this.priceNum(data.data.composePrice) || null
        }
        this.goodsList = proList
        // this.promote.composePrice = this.priceNum(data.data.composePrice) || null
        this.promote.promoteDto.startTime = moment(data.data.promoteDto.startTime).valueOf()
        this.promote.promoteDto.endTime = moment(data.data.promoteDto.endTime).valueOf()
        this.promote.promoteDto.saleChannel = data.data.promoteDto.saleChannel === 0 ? [-1, 1]: [data.data.promoteDto.saleChannel]
        if(data.data.promoteDto.type=='COMPOSE'){
          this.promote.items= [{percent: 0}, {percent: 0}, {percent: 0}]
        }else{
          // this.calcTotal()
        }
      } else {
        this.$message.error('获取促销详情失败！')
      }
    },
    // 选择商品
    chooseGoods() {
      var promoteDto = this.promote.promoteDto
      if(promoteDto.saleChannel.length == 0){
        this.$message.warning('请先选择促销渠道')
      }else if(!promoteDto.startTime || !promoteDto.endTime){
        this.$message.warning('请先选择有效时间')
      }else{
        this.$nextTick(() => {
          this.$refs.selectGoodsModal.init(this.goodsList,promoteDto.saleChannel,promoteDto)
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
      // this.calcTotal()
    },
    // calcTotal() {
    //   let res = 0
    //   if (this.goodsList && this.goodsList.length > 0) {
    //     this.goodsList.forEach(item => {
    //       res = NP.plus(NP.times(item.retailPrice, isNaN(item.quantity) ? 0 :item.quantity), res)
    //     })
    //   }
    //   this.promote.total = res

    //   this.$nextTick(() => {
    //     this.$refs['promote-form'].validateField('composePrice')
    //   })
    // },
    // 删除商品
    deleteHandle(index) {
      this.goodsList.splice(index, 1)
      // this.calcTotal()
    },
    // 删除折扣阶梯
    deleteDiscount(index) {
      this.promote.items.splice(index, 1)
    },
    // 添加折扣阶梯
    addDiscount() {
      this.promote.items.push({
        percent: 0
      })
    },
    // 检查商品
    async checkGoods() {
      const { data } = await checkProduct({
        productIds: this.goodsList.map(item => item.id),
        promoteType: this.promote.promoteDto.type,
        startTime: moment(this.promote.promoteDto.startTime).format('YYYY-MM-DD') + ' 00:00:00',
        endTime: moment(this.promote.promoteDto.endTime).format('YYYY-MM-DD') + ' 23:59:59'
      })
      if (data.code === 0) {
        if (data.data && data.data.length > 0) {
          // 已有活动的商品列表

          /**
           * 过滤掉本身活动的商品
           */
          const tempProudct = data.data.filter(item => {
            if (this.promote.promoteId && this.status == 'UNSATRTING') {
              return item.promoteDto.id !== this.promote.promoteId
            } else {
              return true
            }
          })
          let products = []
          if(tempProudct.length > 0) {
            products = tempProudct.map(item => {
              return {
                ...item.promoteProductDto,
                promoteName: item.promoteDto.name,
                status: item.promoteDto.status,
              }
            })
          }
          if (products.length > 0) {
            if (this.promote.promoteDto.type === 'COMPOSE') {
              this.$message.warning('此商品组合与已有组合购重复，请重新选择组合商品!')
            } else {
              this.$nextTick(() => {
                this.$refs.ensureModal.init(products,this.goodsList, 'page')
              })
            }
            return false
          } else {
            return true
          }
        } else {
          return true
        }
      } else {
        this.$message.error(data.msg)
        return false
      }
    },

    // 添加
    async add() {
      this.$refs['promote-form'].validate(async (valid) => {
        // const flag = await this.checkGoods()
        if (valid && this.checkNumber()) {
          const products = this.goodsList.map(item => {
            return {
              id: this.status!='ENDED'?item.editId:null,
              cover: item.cover,
              productCode: item.code,
              barCodeList: item.barcodes,
              packingType: item.packingType,
              category1Id: item.firstCategoryId,
              productId: item.id,
              productName: item.name,
              quantity: Number(item.quantity),
              salesPrice: item.retailPrice
            }
          })
          // 商品列表
          let query = {
            id: this.status!='ENDED'?this.promote.id:null,
            promoteId: this.status!='ENDED'?this.promote.promoteId:null,
            promoteDto: {
              name: this.promote.promoteDto.name,
              products: products,
              saleChannel: this.promote.promoteDto.saleChannel.length === 2 ? 0 : this.promote.promoteDto.saleChannel[0],
              startTime: moment(this.promote.promoteDto.startTime).format('YYYY-MM-DD') + ' 00:00:00',
              endTime: moment(this.promote.promoteDto.endTime).format('YYYY-MM-DD') + ' 23:59:59'
            }
          }
          let res = null
          if (this.promote.promoteDto.type === 'COMPOSE') {
            query.total = this.total
            query.composePrice = this.priceNum(this.promote.composePrice, 'out')
            query.freePrice = NP.minus(this.total, NP.times(this.promote.composePrice, 100))
            query.promoteDto.type = 'COMPOSE'
            if(products.length>=2&&products.length<=30){
              res = await saveCompose(query)
            }else{
              this.$message.warning('组合商品必须2<=n<=30种')
            }
          } else {
            query.promoteDto.type = 'DISCOUNT'
            query.items = this.promote.items.map((item, index) => {
              return {
                num: index + 1,
                percent: Number(item.percent)
              }
            })
            res = await saveDiscount(query)
          }
          const { data } = res
          if (data.code === 0) {
            this.$router.push({name: 'campaign-storePromotion-promote-list'})
          } else {
            if (data.data && data.data instanceof Array) {
              const deleteProduct = data.data[0]
              // 提示已删除的商品
              const index = _.findIndex(this.goodsList, (item) => {
                return item.id == deleteProduct.productId
              })

              if ( index >= 0) {
                this.$refs.editTable.setCurrentRow(this.goodsList[index],true)
                this.$refs.editTable.bodyWrapper.scrollTop = 49 * index
              }
            }

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
  .edit-input{
    .el-input__inner{
      width: 100%;
    }
    padding: 0 !important;
  }
  .el-input__prefix, .el-input__suffix{
    text-align: left;
  }
  .operate{
    font-size: 16px;
    cursor: pointer;
    .icon-svg{
      position: relative;
      top: 3px;
    }
  }
  .last-item{
    .el-form-item__label{
      line-height: 18px;
    }
  }
  .count{
    float: right;
  }
}
</style>

<template>
  <el-dialog
    title="批量修改商品信息"
    :close-on-click-modal="false"
    class="goods-batch-modify-dailog"
    :visible.sync="visible"
    width="900px"
    append-to-body>
    <el-form :model="goods" :rules="dataRule" ref="goods" label-width="30px">
      <el-checkbox-group v-model="checkList">
        <el-form-item class="goods-add-container" prop="category">
          <el-checkbox class="check-item left" label="商品分类"></el-checkbox>
          <el-form-item prop="firstCategoryId" class="inline-input">
            <el-select v-model="goods.firstCategoryId" @change="getSubCategoryList" placeholder="请选择一级分类" clearable>
              <el-option
              v-for="item in mainOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="categoryId" class="inline-input">
            <el-select v-model="goods.categoryId" placeholder="请选择二级分类" clearable>
              <el-option
              v-for="item in secondOptions"
              :key="item.id"
              :label="item.name"
              :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
        </el-form-item>
        <el-form-item prop="brandId">
          <el-checkbox class="check-item" label="商品品牌"></el-checkbox>
          <el-select filterable v-model="goods.brandId" placeholder="请选择商品品牌">
            <el-option value="" disabled label="请选择商品品牌"></el-option>
            <el-option
              v-for="item in brands"
              :key="item.id"
              :value="item.id"
              :label="item.name"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="integralPlanId">
          <el-checkbox class="check-item" label="商品积分" :disabled="!canIntegral"></el-checkbox>
          <el-select v-model="goods.integralPlanId" placeholder="请选择积分规则" :disabled="!canIntegral" clearable>
            <el-option label="无" :value="-1"></el-option>
            <el-option
              v-for="item in rules"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
          <el-tooltip v-if="!canIntegral" placement="top" effect="dark">
            <div slot="content">当前商品积分无法进行设置，请至 “营销中心-积分规则”页面开启商品积分或修改商品积分方式</div>
            <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" />
          </el-tooltip>
        </el-form-item>
        <el-form-item prop="saleChannel">
          <el-checkbox class="check-item left" label="销售渠道"></el-checkbox>
          <el-checkbox-group style="float: left;" v-model="goods.saleChannel">
            <el-checkbox
              v-for="item in saleChannel"
              :key="item.value"
              :label="item.value">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item prop="priceType">
          <el-checkbox class="check-item" label="会员价方案"></el-checkbox>
          <el-radio-group v-model="goods.priceType">
            <el-radio label="NONE">会员无优惠</el-radio>
            <el-radio label="MEMBER">等级会员价</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item prop="price" class="goods-add-container">
          <el-checkbox class="check-item left" label="商品改价"></el-checkbox>
          <el-form-item prop="targetPrice" class="inline-input mini">
            <el-select v-model="goods.targetPrice" clearable>
              <el-option
                v-for="item in productPriceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <div style="float: left; width: 30px; ">=</div>
          <el-form-item prop="basePrice" class="inline-input mini">
            <el-select v-model="goods.basePrice" clearable>
              <el-option
                v-for="item in productPriceType"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item prop="operatorType" class="inline-input mini">
            <el-select v-model="goods.operatorType" clearable>
              <el-option label="+" value="ADD"></el-option>
              <el-option label="-" value="SUB"></el-option>
              <el-option label="*" value="MULTIPLY"></el-option>
              <!-- <el-option label="/" value="EXCEPT"></el-option> -->
            </el-select>
          </el-form-item>
          <el-form-item prop="change" class="inline-input mini">
            <el-input v-model="goods.change" />
          </el-form-item>
          <span style="font-size: 12px; color: #c0c4cc;">(最多保留二位小数)</span>
        </el-form-item>
      </el-checkbox-group>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import * as api from '@/service/goods'
import { integralPlanSelect, integralPlanDetail } from '@/service/integral'
import { saleChannel, productPriceType } from '@/utils/dict'
import { priceRange } from '@/utils/validate'
export default {
  name: 'goods-batch-modify-dailog',
  data () {
    const validatePrice = (rule, value, callback) => {
      if (value) {
        if (!priceRange(value, 100)) {
          callback(new Error('请输入0.01-100的数字'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return {
      visible: false,
      checkList: [], // 选择的属性
      integral: {},
      rules: {},
      brands: [],
      productIds: [],
      mainOptions: [],
      secondOptions: [],
      saleChannel,
      productPriceType,
      goods: {
        firstCategoryId: '',
        categoryId: '',
        brandId: null,
        integralPlanId: null,
        saleChannel: [],
        priceType: null,
        targetPrice: null,
        basePrice: null,
        operatorType: null,
        change: '',
      },
      dataRule: {
        change: [{validator: validatePrice, trigger: 'blur'}],
      }
    }
  },

  computed: {
    canIntegral() {
      return this.integral.productStatus === true && this.integral.productIntegralType !== 'ORDER'
    }
  },

  methods: {
    // 检查数据
    checkData() {
      let flag = true
      let query = {}
      for (let index = 0; index < this.checkList.length; index++) {
        const key = this.checkList[index]
        switch (key) {
        case '商品分类':
          if (this.goods.firstCategoryId && this.goods.categoryId) {
            query.firstCategoryId = this.goods.firstCategoryId
            query.categoryId = this.goods.categoryId
          } else {
            flag = false
            this.$message.warning('请选择一级和二级分类！')
          }
          break
        case '商品品牌':
          if (this.goods.brandId) {
            query.brandId = this.goods.brandId
          } else {
            flag = false
            this.$message.warning('请选择商品品牌')
          }
          break
        case '商品积分':
          if (this.goods.integralPlanId || this.goods.integralPlanId === '') {
            query.integralPlanId = this.goods.integralPlanId
          } else {
            flag = false
            this.$message.warning('请选择商品积分')
          }
          break
        case '销售渠道':
          if (this.goods.saleChannel.length > 0) {
            let saleChannel = null
            if (this.goods.saleChannel && this.goods.saleChannel.length === 2) {
              saleChannel = 0
            } else if (this.goods.saleChannel && this.goods.saleChannel.length === 1){
              saleChannel = this.goods.saleChannel[0]
            }
            query.saleChannel = saleChannel
          } else {
            flag = false
            this.$message.warning('请选择销售渠道')
          }
          break
        case '会员价方案':
          if (this.goods.priceType) {
            query.priceType = this.goods.priceType
          } else {
            flag = false
            this.$message.warning('请选择会员价方案')
          }
          break
        case '商品改价':
          if (this.goods.basePrice && this.goods.targetPrice && this.goods.operatorType && this.goods.change) {
            query.basePrice = this.goods.basePrice
            query.targetPrice = this.goods.targetPrice
            query.operatorType = this.goods.operatorType
            query.change = this.priceNum(this.goods.change, 'out')
          } else {
            flag = false
            this.$message.warning('请选择选择商品改价')
          }
          break
        default:
          break
        }
      }
      return {flag, query}
    },
    // 初始化信息
    async init (products) {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['goods'].clearValidate()
      })
      // 重置
      this.checkList = []
      this.goods = {
        firstCategoryId: '',
        categoryId: '',
        brandId: null,
        integralPlanId: null,
        saleChannel: [],
        priceType: null,
        targetPrice: null,
        basePrice: null,
        operatorType: null,
        change: '',
      },

      this.productIds = products.map(item => item.id)
      // 获取品牌列表
      this.getBrandList()

      // 获取当前积分规则
      this.getRulePlan()

      // 获取商品积分列表
      this.getIntegralRule()

      // 获取商品分类
      const data = await api.getMainCategory()
      if (data && data.records) {
        this.mainOptions = data.records
      }
    },

    // 获取品牌列表
    async getBrandList() {
      const { data } = await api.brandsList()
      if (data.code === 0) {
        this.brands = data.data
      } else {
        this.brands = []
        this.$message.error(data.msg)
      }
    },

    // 获取积分规则
    async getRulePlan() {
      const { data } = await integralPlanDetail()
      if (data.code === 0) {
        this.integral = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取积分规则
    async getIntegralRule() {
      const { data } = await integralPlanSelect()
      if (data.code === 0) {
        this.rules = data.data
      } else {
        this.$message.error(data.msg)
      }
    },

    // 获取二级分类
    async getSubCategoryList(id, categoryId) {
      this.goods.categoryId = ''
      this.secondOptions = []
      if (id) {
        const data = await api.getSubCategory(id)
        if (data && data.records) {
          this.secondOptions = data.records
          if (categoryId) {
            this.$nextTick(() => {
              this.goods = {
                ...this.goods,
                categoryId
              }
            })
          }
        }
      }
    },

    // 表单提交
    dataFormSubmit () {
      this.$refs['goods'].validate(async (valid) => {
        if (valid) {
          // Todo
          const { flag, query } = this.checkData()
          if (flag) {
            if (Object.keys(query).length !== 0) {
              const { data } = await api.batchUpdate({
                ...query,
                productIds: this.productIds,
              })
              if (data.code === 0) {
                this.visible = false
                this.$emit('refreshDataList')
              } else {
                this.$message.error(data.msg)
              }
            } else {
              this.$message.warning('请勾选您需要修改的内容！')
            }
          }
        }
      })
    },
  }
}
</script>
<style lang="scss">
.goods-batch-modify-dailog{
  .goods-add-container{
    overflow: hidden;
    margin-bottom: 10px;
    .inline-input{
      margin-right: 20px;
      margin-bottom: 20px;
      float:left;
      &.mini{
        width: 120px;
        .el-select, .el-select--medium{
          width: 120px;
        }
        .el-input--medium .el-input__inner{
          width: 120px;
        }
      }
    }
  }
  .el-input__inner, .el-radio__label{
    font-size: 14px;
  }
  .el-form-item__error{
    width: 200px;
  }
  .check-item{
    margin-right: 20px;
    &.left{
      float: left;
    }
  }
}
</style>


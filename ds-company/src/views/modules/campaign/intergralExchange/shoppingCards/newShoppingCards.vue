<template>
  <section class="page-shoppingCards-add">
    <el-card>
      <el-form ref="shoppingCards-form" :rules="dataFormRules" label-width="150px" :model="shoppingCards" :validate-on-rule-change="false">
        <el-form-item label="购物卡名称" prop="cardName">
          <el-input v-model="shoppingCards.cardName" :maxlength="15" placeholder="最多支持15个汉字"/>
        </el-form-item>
        <el-form-item label="有效日期" required>
          <el-radio-group v-model="shoppingCards.validityType" @change="changeAlways" class="gt-inline-item">
            <el-radio label="ALWAYS" style="display: inline-block;">永久有效</el-radio>
            <el-radio label="FIXED" class="no-margin-left">
              <el-form-item prop="validityDays" class="fit-input">
                自发放之日起
                <el-input class="min-input" :disabled="shoppingCards.validityType == 'ALWAYS'" v-model="shoppingCards.validityDays">
                </el-input>
                天
              </el-form-item>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="购物卡属性" prop="calculate">
          消费计算员工业绩，员工提成
          <el-switch style="margin-top: -3px; margin-left: 15px;" v-model="shoppingCards.calculate"></el-switch>
          <span>{{shoppingCards.calculate ? '开' : '关'}}</span>
        </el-form-item>
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" rows="3" :maxlength="100" v-model="shoppingCards.remark" placeholder="请输入备注内容"/>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" :loading="loading" @click.native="add" txt="确定"/>
    </div>
  </section>
</template>
<script>
import { mapState } from 'vuex'
import { limitInputName} from '@/utils/validate'
import { createShoppingCard,editShoppingCard,shoppingCardDetails } from '@/service/campaign'
export default {
  name:'shoppingCards-add',
  data(){
    const validateName = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('名字不能超过15个汉字'))
      } else{
        callback()
      }
    }
    const validateDay = (rule, value, callback) => {
      if (this.shoppingCards.validityType === 'FIXED') {
        const reg = /^\d+$/
        if (value || value == 0) {
          if (!reg.test(value)) {
            callback(new Error('请输入1-99999的正整数！'))
          } else if (value < 1 || value > 99999){
            callback(new Error('请输入1-99999的正整数！'))
          } else {
            callback()
          }
        } else {
          callback()
        }
      }else {
        callback()
      }
    }
    const validateRemark = (rule, value, callback) => {
      if (limitInputName(value,100) == 1) {
        callback(new Error('备注不能超过50个汉字'))
      } else{
        callback()
      }
    }
    return{
      shoppingCards:{
        validityType:'ALWAYS',
        calculate:true,
        validityDays: null,
      },
      dataFormRules: {
        cardName:[{required: true, message: '请填写购物卡名称'}, {validator: validateName, trigger: 'blur'}],
        validityDays:[{validator: validateDay, trigger: 'blur'}],
        remark: [{validator: validateRemark, trigger: 'blur' }]
      }
    }
  },
  computed: {
    ...mapState({
      loading: state => state.loading.global
    })
  },
  async created () {
    this.id = this.$route.query.id
    if (this.id) {
      const data = await shoppingCardDetails(this.id)
      this.shoppingCards = data
    }
  },
  methods:{
    changeAlways(val){
      if (val == 'ALWAYS') {
        this.shoppingCards.validityDays = null
      }
    },
    // 添加or编辑购物卡
    async add() {
      this.$refs['shoppingCards-form'].validate(async (valid) => {
        if (valid) {
          const form = {
            ...this.shoppingCards,
            validityDays: this.shoppingCards.validityType === 'FIXED' ? this.shoppingCards.validityDays : null,
          }
          const { data } = this.shoppingCards.id ? await editShoppingCard(form) : await createShoppingCard(form)
          if (data.code === 0){
            this.$router.push({name: 'campaign-intergralExchange-shoppingCards-shoppingCardsList'})
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .page-shoppingCards-add{
    .gt-time-range{
      display: inline-block;
    }
    .gt-inline-item{
      margin-top: -20px !important;
    }
    .el-radio.no-margin-left {
      margin-left: 10px;
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
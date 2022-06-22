<template>
  <section class="page-goods-commission">
    <el-card>
      <el-row>
        <el-radio-group class="change-button" v-model="activeName" @change="changeVal">
          <el-radio-button label="CATEGORY">分类提成</el-radio-button>
          <el-radio-button label="BRAND">分类+品牌提成</el-radio-button>
        </el-radio-group>
      </el-row>
      <!-- <div style="margin-bottom: 15px; color: red;">
        商品提成计算优先级：商品详情页提成  > 品牌+分类提成 > 大类+小类提成 > 大类提成
      </div> -->
      <section v-if="activeName === 'CATEGORY'">
        <basic-commission />
      </section>
      <section v-else>
        <brand-commission />
      </section>
    </el-card>
    <!-- <commission-rule ref="commissionRuleRef" /> -->
  </section>
</template>

<script>
import * as api from '@/service/goods'
import basicCommission from './basic-commission'
import brandCommission from './brand-commission'
import { twoDecimal, commissionRange } from '@/utils/validate'

export default {
  name: 'goods-goods-commission',
  data () {
    return {
      activeName: 'CATEGORY'
    }
  },
  components: {
    basicCommission,
    brandCommission
  },

  async created() {

  },
  methods: {
    changeVal(val) {
      this.activeName = val
    },
  }
}
</script>
<style lang="scss">
.page-goods-commission{
  .change-button{
    margin-bottom: 10px;
    margin-top: -5px;
  }
}
</style>


<template>
  <section class="page-shoppingCards-view" v-loading="$store.state.loading.global">
    <el-card>
      <el-form label-width="150px">
        <el-form-item label="购物卡名称">
          <span class="itemInput">{{shoppingCards.cardName}}</span>
        </el-form-item>
        <el-form-item label="使用期限">
          <span class="itemInput" v-if="shoppingCards.validityType === 'ALWAYS'">永久有效</span>
          <span class="itemInput" v-else>自发放之日起 {{shoppingCards.validityDays}} 天</span>
        </el-form-item>
        <el-form-item label="购物卡属性">
          <span style="font-size: 12px;">消费计算员工业绩，员工提成
          <el-switch style="margin-top: -3px; margin-left: 15px;" disabled v-model="shoppingCards.calculate"></el-switch>
          <span style="font-size: 12px;">{{shoppingCards.calculate ? '开' : '关'}}</span>
          </span>
        </el-form-item>
        <el-form-item label="备注">
          <span class="itemInput">{{shoppingCards.remark}}</span>
        </el-form-item>
      </el-form>
    </el-card>
  </section>
</template>
<script>
import { shoppingCardDetails } from '@/service/campaign'
export default {
  name:'shoppingCards-view',
  data(){
    return{
      shoppingCards:{},

    }
  },
  async created () {
    this.id = this.$route.query.id
    if (this.id) {
      const data = await shoppingCardDetails(this.id)
      this.shoppingCards = data
    }
  },
}
</script>
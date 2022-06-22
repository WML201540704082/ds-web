<template>
  <section>
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="commoditySales" style="float:left;">
        <el-radio-button label="sales">组合销售</el-radio-button>
        <el-radio-button label="discount">第N件打折</el-radio-button>
        <el-radio-button v-if="newStore == 'true'" label="fullReduction">满减</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-sales v-if="commoditySales=='sales'"/>
    <gt-discount v-if="commoditySales=='discount'"/>
    <gt-full-reduction v-if="commoditySales=='fullReduction'"/>
  </section>
</template>
<script>
import gtSales from './sales/list'
import gtDiscount from './discount/list'
import gtFullReduction from './fullReduction/list'
import { getStore } from '@/utils/storage'
export default {
  name:'promote-list',
  components: {
    gtSales,
    gtDiscount,
    gtFullReduction
  },
  data(){
    return{
      commoditySales:'sales'
    }
  },
  beforeRouteEnter (to, from, next) {
    next(vm =>{
      if (from.name == 'promote-view' || from.name == 'sales-add-or-update') {
        vm.commoditySales='sales'
      } else if(from.name == 'discount-view' || from.name == 'discount-add-or-update'){
        vm.commoditySales='discount'
      }else if (from.name == 'full-view' || from.name == 'full-add-or-update') {
        vm.commoditySales='fullReduction'
      }
    })
  },
  async created () {
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  }
}

</script>
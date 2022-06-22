<template>
  <section>
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="commoditySales" style="float:left;">
        <el-radio-button label="sales">销售单</el-radio-button>
        <el-radio-button label="return">退货单</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-sales v-if="commoditySales=='sales'"/>
    <gt-return v-if="commoditySales=='return'"/>
  </section>
</template>
<script>
import gtSales from './sales'
import gtReturn from './return'
export default {
  name:'statement-posCommoditySalesDocuments-posCommoditySalesDocuments',
  components: {
    gtSales,
    gtReturn,
  },
  data(){
    return{
      commoditySales:'sales'
    }
  }
}
</script>
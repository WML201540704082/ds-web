<template>
  <section class="page-stock-required">
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectRequired_Request" style="float:left;">
        <el-radio-button label="require">我发起的</el-radio-button>
        <el-radio-button label="request">我收到的</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-needGoods v-if="selectRequired_Request=='require'"/>
    <gt-requestGoods v-if="selectRequired_Request=='request'"/>
  </section>
</template>
<script>
import gtNeedGoods from './needGoods'
import gtRequestGoods from './requestList'
export default {
  name:'stockManagement-requiredInventory',
  components: {
    gtNeedGoods,
    gtRequestGoods,
  },
  data(){
    return{
      selectRequired_Request:'require'
    }
  }
}
</script>
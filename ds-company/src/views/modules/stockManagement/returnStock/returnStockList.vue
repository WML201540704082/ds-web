<template>
  <section>
    <el-card style="padding-bottom: 14px;margin-bottom: 10px;">
      <el-radio-group v-model="selectReturnStock_Request" style="float:left;">
        <el-radio-button label="iRequest">我发起的</el-radio-button>
        <el-radio-button label="requestMe">我收到的</el-radio-button>
      </el-radio-group>
    </el-card>
    <gt-iRequest v-if="selectReturnStock_Request=='iRequest'"/>
    <gt-requestMe v-if="selectReturnStock_Request=='requestMe'"/>
  </section>
</template>
<script>
import gtIRequest from './iRequest'
import gtRequestMe from './requestMe'
export default {
  name:'stockManagement-requiredInventory',
  components: {
    gtIRequest,
    gtRequestMe,
  },
  data(){
    return{
      selectReturnStock_Request:'iRequest'
    }
  }
}
</script>
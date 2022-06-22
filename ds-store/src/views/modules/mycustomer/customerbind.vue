<template>
  <el-dialog
    title="设置顾客归属"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" :rules="sendObjRule" ref="sendObj" label-width="120px">
      <el-form-item label="选择员工" prop="employees">
        <el-select v-model="sendObj.employees" placeholder="请输入员工关键词" filterable clearable>
          <el-option v-for="item in campaignList" :key="item.id" :label="item.name" :value="item.id"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { employeeSelect, getCustomerbind } from '@/service/mycustomer'
export default {
  data(){
    return{
      visible: false,
      campaignList:[],
      remark: null,
      customerIds:null,
      sendObj:{
        employees: null,
      },
      key: '',
      sendObjRule:{
        employees: [{required: true,message:'请先选择员工'}],
      }
    }
  },
  methods:{
    init(ids){
      this.customerIds = ids
      this.visible = true
      this.sendObj.employees = null
      this.key=''
      // 获取店员下拉
      this.selectOption()
    },
    // 获取店员下拉
    async selectOption(){
      const { data } = await employeeSelect({
        keyword: this.key
      })
      if(data.code == 0){
        this.campaignList = data.data
      }else{
        this.campaignList = []
      }
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          let userName = null
          this.campaignList.map(o=>{
            if(o.id == this.sendObj.employees){
              userName = o.name
            }
          })
          var param = {
            employeeId:this.sendObj.employees,
            customerIds: this.customerIds,
            employee: userName,
          }
          const data = await getCustomerbind(param)
          this.$message.success('顾客归属设置成功')
          this.visible = false
          this.$emit('refreshDataList')
        }
      })

    }
  }
}
</script>



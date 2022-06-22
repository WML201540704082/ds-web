<template>
  <el-dialog
    title="修改会员等级"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="sendObj" ref="sendObj" label-width="120px">
      <el-form-item label="会员信息" prop="level" v-if="type=='single'">
        <span class="itemInput">{{name || '--'}}/{{phone}}</span>
      </el-form-item>
      <el-form-item label="会员等级" prop="level">
        <el-select v-model="sendObj.level" placeholder="请选择会员等级" @change="changeMember">
          <el-option v-for="item in memberList"
          :key="item.value"
          :label="item.label"
          :value="item.value"></el-option>
        </el-select>
      </el-form-item>
      <div style="font-size: 12px;color: #ccc;margin-left:120px">温馨提示：修改顾客的会员登记后，会员等级有效期将重新计算</div>

    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { setLevels } from '@/service/mycustomer'
export default {
  data(){
    return{
      type: null,
      visible: false,
      customerIds:null,
      memberList:[],
      sendObj:{
        level: 'GENERAL',
        levelName: '普通'
      },
      name: null,
      phone: null,
    }
  },
  methods:{
    init(obj,memberList=[],type){
      if(type=='single'){
        this.customerIds = obj.id
        this.name = obj.name
        this.phone = obj.phone
        this.sendObj.level = obj.level
        this.sendObj.levelName = obj.levelName
      }else{
        this.customerIds = obj
      }
      
      this.visible = true
      this.type=type
      this.memberList = memberList
    },
    changeMember(val){
      this.memberList.map(o=>{
        if(val == o.value){
          this.sendObj.levelName = o.label
        }
      })
    },
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          const data = await setLevels({
            level:this.sendObj.level,
            levelName:this.sendObj.levelName,
            customerIds: this.customerIds
          })
          this.$message.success('会员等级设置成功')
          this.visible = false
          this.$emit('refreshDataList')
        }
      })

    }
  }
}
</script>
<style>
.el-textarea.is-disabled .el-textarea__inner {
  resize: none;
}
</style>



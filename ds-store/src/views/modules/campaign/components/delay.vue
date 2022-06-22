<template>
  <el-dialog
    title="延期"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <el-form :model="noticeObj" :rules="noticeObjRule" ref="noticeObj">
      <el-form-item label="延期日期" prop="date">
        <el-date-picker
          v-model="noticeObj.date"
          type="date"
          value-format="timestamp"
          placeholder="选择日期">
        </el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveNotice">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { renew } from '@/service/activity'
export default {
  data(){
    return{
      idx: null,
      visible: false,
      list: [],
      noticeObj:{
        date: null
      },
      noticeObjRule:{
        date: [{required: true,message:'请先选择日期'}],
      }
    }
  },
  methods:{
    init(ids){
      this.idx = ids
      this.visible = true
      this.noticeObj.date = null
    },
    saveNotice(){
      this.$refs['noticeObj'].validate(async(valid) => {
        if (valid) {
          const {data}=await renew({
            id: this.idx,
            targetDate: this.noticeObj.date
          })
          if(data.code == 0){
            this.visible = false
            this.$emit('refreshDataList')
          }else{
            this.$message.error(data.msg)
          }
        }
      })
      
    }
  }
}
</script>


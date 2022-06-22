<template>
  <el-dialog
    title="商品包名称修改"
    :close-on-click-modal="false"
    :visible.sync="visible"
    class="dialog_Name"
    width="400px">
    <el-form :model="noticeObj" ref="noticeObj">
      <el-form-item prop="notices">
        <el-input v-model="noticeObj.notices" maxlength="30"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="saveNotice">保存</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { Trim, validatenull } from '@/utils/validate'
export default {
  data(){
    return{
      idx: null,
      visible: false,
      list: [],
      noticeObj:{
        notices: null,
      },
    }
  },
  methods:{
    init(list,index){
      this.list = list
      this.idx = index
      this.visible = true
      this.noticeObj.notices = list[index].packName
    },
    saveNotice(){
      if (!validatenull(Trim(this.noticeObj.notices,'g'))) {
        var flag = 0
        var list = this.list || []
        console.log(list)
        // list.forEach(item => {
        //   if(item.packName == Trim(this.noticeObj.notices,'g')){
        //     flag = 1
        //     this.$message.warning('此商品包名称已添加过')
        //     return
        //   }
        // })
        if(flag != 1){
          this.visible = false
          var obj = {
            'packName': Trim(this.noticeObj.notices,'g'),
            'index': this.idx
          }
          this.$emit('refreshDataList',obj)
        }
      }else{
        this.$message.warning('请输入商品包名称')
        return
      }


    }
  }
}
</script>
<style>
.dialog_Name .el-form-item__content {
    text-align: center!important;
}
</style>


<template>
  <el-dialog
    :title="title"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="noticeObj" :rules="noticeObjRule" ref="noticeObj">
      <el-form-item prop="notices">
        <el-input v-model="noticeObj.notices" maxlength="10"></el-input>
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
  props:{
    title:{
      type:String
    },
  },
  data(){
    const isNull = (rule, value, callback) => {
      if (validatenull(Trim(value,'g'))) {
        callback(new Error('输入项不能为空'))
      } else{
        callback()
      }
    }
    return{
      idx: null,
      visible: false,
      list: [],
      noticeObj:{
        notices: null,
      },
      noticeObjRule:{
        notices: [{required: true,message:'输入项不能为空'},
          {validator: isNull, trigger: 'change'}],
      }
    }
  },
  methods:{
    init(list,tagName){
      this.list = list
      this.visible = true
      this.noticeObj.notices = tagName || null
    },
    // 获取tags
    async getTagAdd() {
      if(JSON.stringify(this.list).indexOf('"'+Trim(this.noticeObj.notices,'g')+'"') == -1){
        this.$emit('refreshDataList',{
          id: -1,
          tag: Trim(this.noticeObj.notices,'g')
        })
      }
      this.visible = false
    },
    saveNotice(){
      this.$refs['noticeObj'].validate((valid) => {
        if (valid) {
          this.getTagAdd()
        }
      })
      
    }
  }
}
</script>


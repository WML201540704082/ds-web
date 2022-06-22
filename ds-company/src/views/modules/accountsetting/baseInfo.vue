<template>
  <section class="addLabel">
    <el-form :model="baseinfo" ref="baseinfo" :rules="baseinfoRules" label-width="100px">
      <el-card style="margin-bottom: 10px;">
        <div>
          <el-form-item label="手机号" prop="userName" class="gt-input-tip">
            <el-input v-model="baseinfo.userName" :disabled="true" ><span slot="prefix" style="left: 210px;">*注册手机号不可修改</span></el-input>
          </el-form-item>
          <el-form-item label="昵称" prop="nickname">
            <el-input v-model="baseinfo.nickname" placeholder="请输入昵称"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="baseinfo.email" placeholder="请输入邮箱"></el-input>
          </el-form-item>
          <el-form-item label="货币种类" prop="type">
            <el-input v-model="type" :disabled="true" ></el-input>
          </el-form-item>
          <el-form-item label="语言" prop="language">
            <el-input v-model="language" :disabled="true" ></el-input>
          </el-form-item>
        </div>
      </el-card>
    </el-form>
    <div class="gt-form-bottom-submit">
      <gt-button size="large" @click.native="submitInfo" :loading="$store.state.loading.global" txt="保存"/>
    </div>
  </section>
</template>
<script>
import { isphone, email, validatenull, limitInputName } from '@/utils/validate'
import { getUserInfoData, userInfoData } from '@/service/setinfo'
export default {
  data(){
    const limit = (rule, value, callback) => {
      if (limitInputName(value,30) == 1) {
        callback(new Error('昵称至多为15个汉字'))
      } else if (limitInputName(value,30) == 2) {
        callback(new Error('昵称不能含特殊字符'))
      }else{
        callback()
      }
    }
    return{
      baseinfo:{
        userName: null,
        nickname: null,
        email: null,
      },
      language:'中文',
      type:'人民币 CNY',
      baseinfoRules:{
        nickname:[{required: true,message:'请输入昵称', trigger: 'change'}],
        email:[{required: true,message:'请输入邮箱', trigger: 'change'},
          {validator: email,trigger: 'change'}
        ]
      }
    }
  },
  created(){
    this.detail()
  },
  methods:{
    async detail(){
      const { data } = await getUserInfoData()
      if(data&&data.code == 0){
        this.baseinfo = data.data
      }else{
        this.$message.error(data.msg)
      }
    },
    submitInfo(){
      this.$refs['baseinfo'].validate(async (valid)=>{
        if(valid){
          const { data } = await userInfoData({
            nickname: this.baseinfo.nickname,
            email: this.baseinfo.email,
          })
          if(data.code == 0){
            this.$message.success('当前用户修改成功')
          }else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>

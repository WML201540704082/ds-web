<template>
  <section>
    <el-card> 
      <el-form ref="sale-form" :rules="dataFormRules" label-width="135px" :model="sale">
        <el-form-item label="销售姓名：" prop='name'>
          <el-input v-model="sale.name" placeholder="请输入销售姓名" clearable></el-input>
        </el-form-item>
        <el-form-item label="手机号码：" prop='phone'>
          <el-input v-model="sale.phone" :maxlength="11" placeholder="请输入手机号"/>
        </el-form-item> 
        <el-form-item label="入职角色：" prop="roleType">
          <el-checkbox-group v-model="sale.roleType">
            <el-checkbox 
              :label="item.value"
              disabled 
              :key="item.value"  
              v-for="item in saleRoleType">
              {{item.label}}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="入职时间：" prop='joinTime'>
          <el-date-picker
            v-model="sale.joinTime"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="状态：" v-if="!sale.id">
          <el-switch v-model="sale.workStatusType"
            active-text="在职"
            :disabled="true"
            active-value="ONWORK"
            inactive-value="LEAVE">
          </el-switch>
        </el-form-item>
        <el-form-item label="状态：" @click.native="openActive(sale.workStatusType)" v-if="sale.id">
          <el-switch v-model="sale.workStatusType"
            active-text="在职"
            :disabled="true"
            active-value="ONWORK"
            inactive-value="LEAVE">
          </el-switch>
        </el-form-item>
        <el-form-item label="备注：" prop="remark">
          <el-input type="textarea" v-model="sale.remark" style="width: 300px;"></el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <div class="gt-form-bottom-submit" >
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消"/>
      <gt-button size="large" :loading="$store.state.loading.global"  @click.native="addUpdate" txt="提交"/>
    </div>
  </section>
</template>
<script>
import { getSalesmanDetail,updateSalesman } from '@/service/sale'
import gtImageUpload from '@/components/gt-image-upload'
import { AddSalesman } from '@/service/sale'
import { workStatusType,saleRoleType } from '@/utils/dict'
export default {
  data() {
    //验证手机号
    const validatePhone = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('手机号不可为空'))
      } else {
        if (value !== '') {
          var reg=/^1[1-9]\d{9}$/
          if(!reg.test(value)){
            callback(new Error('请输入有效的手机号码'))
          }
        }
        callback()
      }
    }
    return {
      saleRoleType,
      value1: '',
      sale:{
        name:'',//销售姓名
        phone:'',//手机号
        roleType:['SALESMAN'],//角色
        joinTime:'',//入职时间
        workStatusType:'ONWORK',//状态
        remark:''//备注
      },
      dataFormRules: {
        name:[{ required: true, message: '请输入员工姓名', trigger: 'blur' },
          { min: 2, max: 8, message: '长度在 2 到 8 个字符', trigger: 'blur' }],
        phone:[{required:true,message:'请输入手机号',trigger:'blur'},
          {validator: validatePhone, trigger: 'blur'}],
        roleType:[{ required: true, message:'请选择员工入职角色'}],
      }
    }
  },
  created() {
    const { id } = this.$route.query
    if (id) {
      this.id = id
      // 获取详情  
      this.init(id)
    }
  },
  methods:{
    async init(id) {
      const { data } = await getSalesmanDetail(id)
      if (data.code === 0) {
        this.sale = {
          ...data.data,
          roleType: data.data.roleType.split(',')
        }
      }    
    },
    // 在职or离职
    openActive (delFlag) {
      this.$easyConfirm.show({
        title: '提示',
        content:`${delFlag != 'LEAVE' ? '离职后，不可改变状态。确定离职？' : '不可更改'}`,
        confirm: async () => {
          if(delFlag == 'ONWORK'){
            this.sale.workStatusType = 'LEAVE'
            this.$easyConfirm.hide()
          }else{
            this.sale.workStatusType = 'LEAVE'
            this.$easyConfirm.hide()
          }
        }
      })
    },
    //取消
    goBack(){
      history.go(-1)
    },
    //确定
    async addUpdate(){
      console.log(this. sale)
      this.$refs['sale-form'].validate(async (valid) => {
        if (valid) {
          if (!this.id) {
            const res = await AddSalesman({
              ...this.sale,
              roleType: this.sale.roleType.join(',')
            })
            this.$router.push({name: 'contract-sale'})
          }else{
            const res = await updateSalesman({
              ...this.sale,
              roleType: this.sale.roleType.join(',')
            })
            this.$router.push({name: 'contract-sale'})
          }
        }
      }) 
    },
  }
}
</script>


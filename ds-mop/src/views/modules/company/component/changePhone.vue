<template>
  <el-dialog
    :close-on-click-modal="false"
    title="手机验证码"
    :visible.sync="visible"
    width='500px'
    append-to-body>
    <div>
      <el-form ref="form" :rules="dataFormRules" label-width="120px" :model="form">
        <el-form-item label="手机号" prop="mobileNo">
          <span>{{form.mobileNo}}</span>
					<gt-getcode @verify="getVerify" :phone="this.form.mobileNo" :id="this.form.id" :autoClac="this.form.autoClac" style="display:inline"/>
        </el-form-item>
				<el-form-item  label="验证码" prop="verificationCode">
					<el-input v-model="form.verificationCode" type="text" placeholder="验证码"></el-input>
				</el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="dataLoading" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getuserValidval } from '@/service/company'
import gtGetcode from '@/components/gt-getcode'
export default {
  name: 'gt-Chphone',
  components: { gtGetcode },
  data() {
    return {
      dataLoading: false,
      disabled:false,
      id: '',
      visible: false,
      verify: '',
      form:{
        mobileNo : '',
        id: '',
        autoClac:'',
        verificationCode : null
      },
      dataFormRules:{
        verificationCode:[{required: true, message: '请输入短信验证码', trigger: 'change'}],
      }
    }
  },
  methods: {
    init(row) {
      this.visible = true
      this.form = row
    },
    getVerify(verify) {
      this.verify = verify
    },
    async save() {
      this.$refs['form'].validate(async(valid) => {
        if(valid && this.form.verificationCode && this.verify){
          this.dataLoading = true
          const { data } = await getuserValidval({
            id: this.form.id,
            mchntTxnSsn: this.verify,
            autoClac: this.form.autoClac ? '0' : '1',
            smsCode: this.form.verificationCode
          })
          this.dataLoading = false
          if (data.code === 0) {
            this.visible = false
            this.$emit('refreshDataList')
            this.$refs['form'].resetFields()
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style scoped>
	.btns{
		color: #fff;
		border-radius: 4px;
		font-size: 15px;
		padding: 3px 10px;
		cursor: pointer;
	}
</style>

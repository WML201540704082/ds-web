<template>
  <el-dialog
    :close-on-click-modal="false"
    title="变更手机号"
    :visible.sync="visible"
    width="500px"
    append-to-body>
    <div>
      <el-form ref="form" :rules="dataFormRules" label-width="120px" :model="form">
        <el-form-item label="新手机号" prop="phone">
          <el-input v-model="form.phone" placeholder="新手机号" :maxlength="11" style="display:inline"></el-input>
					<gt-getvarcode :phone="form.phone" style="display:inline"/>
        </el-form-item>
				<el-form-item  label="验证码" prop="verificationCode">
					<el-input v-model="form.verificationCode" type="text" placeholder="验证码"></el-input>
				</el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
			<el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="save">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { updatePhone } from '@/service/staffManagement'
import gtGetvarcode from '@/components/gt-getvarcode'
import { isphone } from '@/utils/validate'
export default {
  name: 'com-staffManage-changePhone',
  components: { gtGetvarcode },
  data() {
    return {
      disabled:false,
      id: '',
      visible: false,
      form:{
        phone : '',
        verificationCode : null
      },
      dataFormRules:{
        phone:[{required: true, message: '请输入新手机号', trigger: 'change'},
          {validator: isphone, trigger: 'change'}],
        verificationCode:[{required: true, message: '请输入短信验证码', trigger: 'change'}],
      }
    }
  },
  methods: {
    init(id) {
      this.id = id
      this.visible = true
		},
    async save() {
			this.$refs['form'].validate(async(valid) => {
				if(valid && this.form.verificationCode !== ''){
					const { data } = await updatePhone({
						id: this.id,
						// phone : this.form.phone,
						// verificationCode : this.form.verificationCode,
						...this.form
					})
					if (data.code === 0) {
						this.visible = false
            this.$emit('refreshDataList')
            this.$refs['form'].resetFields()
					} else {
						this.$message.error(data.msg)
					}
				}
			}
		)}
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

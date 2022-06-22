<template>
<el-dialog
  :title="!dataForm.id ? '新增' : '修改'"
  :close-on-click-modal="false"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="100px">
    <el-form-item label="用户名" prop="userName" class="gt-input-tip">
      <el-input v-model="dataForm.userName" :disabled="isWrite"><span v-show="!isWrite" slot="prefix" style="left: 210px;">*请输入正确的手机号</span></el-input>
    </el-form-item>
    <el-form-item v-if="!dataForm.id" label="密码" prop="password" :class="{ 'is-required': !dataForm.id }" class="gt-input-tip">
      <el-input v-model="dataForm.password" type="password"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
    </el-form-item>
    <el-form-item v-if="!dataForm.id" label="确认密码" prop="comfirmPassword" :class="{ 'is-required': !dataForm.id }"  class="gt-input-tip">
      <el-input id="pass" v-model="dataForm.comfirmPassword" type="password"><span slot="prefix" style="left: 210px;">*字母数字混合的组合，大于6位</span></el-input>
    </el-form-item>
    <el-form-item label="选择门店" prop="storeId" v-if="isAuth('systore:company:company:select')">
      <el-select v-model="dataForm.storeId" placeholder="请选择企业下的门店" :disabled="!dataForm.id ? false:  isWrite">
        <el-option
          v-for="item in storeList"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </el-form-item>
    <el-form-item label="角色" size="mini" prop="roleIdList" v-if="isAuth('store:sysRole:select')">
      <!-- <el-checkbox-group v-model="dataForm.roleIdList">
        <el-checkbox v-for="role in roleList" :key="role.id" :label="role.id">{{ role.name }}</el-checkbox>
      </el-checkbox-group> -->
      <el-radio-group v-model="dataForm.roleIdList">
        <el-radio v-for="role in roleList" :key="role.id" :label="role.id" style="margin-right: 30px;margin-left: 0!important;">{{ role.name }}</el-radio>
      </el-radio-group>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit()" :disabled="isSave">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import * as api from '@/service/systore'
import { password, isMobile } from '@/utils/validate'
export default {
  data () {
    var validatePassword = (rule, value, callback)=> {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validatePhone = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('请输入正确的手机号'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback)=> {
      if (!this.dataForm.id && !/\S/.test(value)) {
        return callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        this.dataForm.comfirmPassword = ''
        let inputelement=document.getElementById('pass')
        inputelement.focus()
        return callback(new Error('确认密码与密码输入不一致'))
      } else {
        return callback()
      }
    }
    return {
      isWrite: false,
      isSave: false,
      visible: false,
      roleList: [],
      storeList:[],//门店列表
      dataForm: {
        id: 0,
        storeId: null,//门店id
        userName: null,
        password: null,
        comfirmPassword: null,
        roleIdList: []
      },
      dataRule: {
        userName: [
          { required: true, message: '用户名不能为空' },
          { validator: validatePhone, trigger: 'blur' }
        ],
        password: [
          {validator: validatePassword, trigger: 'blur' },
          {validator: password, trigger: 'blur' }
        ],
        comfirmPassword: [
          {validator: validateComfirmPassword, trigger: 'blur' }
        ],
        roleIdList: [
          {required: true, message: '请至少选择一个用户角色',  trigger: 'blur' }
        ],
        storeId: [
          {required: true, message: '请选择门店',  trigger: 'blur' }
        ]
      }
    }
  },
  watch:{
    'dataForm.storeId'(val,oldval){
      console.log(val)
      this.dataForm.storeId = val
      // this.getsysRole()
    }
  },
  methods: {
    init (id,storeId) {
      this.isWrite = false
      this.dataForm.id = id || 0
      this.dataForm.storeId = storeId || null
      // alert('storeId================='+storeId)
      if(this.isAuth('systore:company:company:select')){
        this.getStorelist(storeId)
      }
    },
    async getStorelist(storeId){
      var that = this
      const { data } = await api.getStoreList({
        status:1
      })
      if(data && data.code ==0){
        that.storeList = data.data
        if(that.storeList && that.storeList.length > 0){
          that.dataForm.storeId = that.storeList[0].id
        }
        if(that.dataForm.id){
          that.dataForm.storeId = storeId
          // alert('编辑==============='+that.dataForm.storeId)
        }else{
          // alert('新增==============='+that.dataForm.storeId)
        }
        if(this.isAuth('store:sysUser:detail')){
          that.getsysDetail()
        }
      }else{
        that.storeList =[]
      }
    },
    getsysRole(){
      this.$http({
        url: this.$http.adornUrl('/sys/store/sysRole/select'),
        method: 'get',
        selfHandleError: true,
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data && data.code === 0) {
          this.roleList = data.data
        }else{
          this.roleList = []
        }
      })
    },
    getsysDetail(){
      if(this.isAuth('store:sysRole:select')){
        this.getsysRole()
      }
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
      if (this.dataForm.id) {
        this.isWrite = true
        this.$http({
          url: this.$http.adornUrl(`/sys/store/sysUser/detail/${this.dataForm.id}/${this.dataForm.storeId}`),
          method: 'get',
          params: this.$http.adornParams()
        }).then(data => {
          this.dataForm.userName = data.userName
          this.dataForm.password = data.password
          // this.dataForm.roleIdList = data.storeSysRoleIdList || []
          if(data.storeSysRoleIdList){
            this.dataForm.roleIdList = parseInt(data.storeSysRoleIdList[0])
          }

        })
      }
    },
    // 表单提交
    dataFormSubmit () {
      var roleLists = []
      roleLists.push(this.dataForm.roleIdList)
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.isSave = true
          this.$http({
            url: this.$http.adornUrl(`/sys/store/sysUser/${!this.dataForm.id ? 'add' : 'update'}`),
            method: 'post',
            selfHandleError: true,
            data: this.$http.adornData({
              'id': this.dataForm.id || undefined,
              'userName': this.dataForm.userName,
              'password': this.dataForm.password,
              'storeId' : this.dataForm.storeId || undefined,
              // 'storeSysRoleIdList': this.dataForm.roleIdList
              'storeSysRoleIdList':roleLists
            })
          }).then(({data}) => {
            this.isSave = false
            if(data.code == 0){
              this.visible = false
              this.$emit('refreshDataList')
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  }
}
</script>

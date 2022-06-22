<template>
  <el-dialog
    :close-on-click-modal="false"
    title="新增供应商"
    :visible.sync="visible"
    width="60%"
    append-to-body
    class="newSupplier">
    <el-form ref="addSupplier" label-width="120px" :model="addSupplier" :rules="newSupplierRules">
      <el-form-item label="供应商名称" prop="companyName">
        <el-input v-model="addSupplier.companyName" :maxlength="30"></el-input>
      </el-form-item>
      <el-form-item label="联系人" prop="name">
        <el-input v-model="addSupplier.name" :maxlength="10"></el-input>
      </el-form-item>
      <el-form-item label="联系电话" prop="phone">
        <el-input v-model="addSupplier.phone" :maxlength="11"></el-input>
      </el-form-item>
      <el-form-item label="联系地址" prop="addressLocation" class="lefts">
        <gt-select-location v-model="addSupplier.addressLocation" v-if="visible" ref="addressLocation" :provinceId="addSupplier.provinceId" :cityId="addSupplier.cityId" :districtId="addSupplier.districtId" />
      </el-form-item>
      <el-form-item prop="address">
        <el-input style=" width: 220px;float: left" class="locations" v-model="addSupplier.address" placeholder="请输入详细地址"></el-input>
      </el-form-item>
    </el-form>
    <div style="margin: 10px; padding-left: 40px;">*请输入准确的供应商联系人、联系电话、联系地址所在省市区/县，一经新增不可修改</div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="save">新增并关联供应商</el-button>
    </span>
  </el-dialog>
</template>
<script>
import gtSelectLocation from '@/components/gt-select-location'
import * as api from '@/service/stock'
import { getStore } from '@/utils/storage'
import { locations } from '@/utils'
import { validatenull } from '@/utils/validate'
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
    const selectLocation = (rule,value,callback) =>{
      if(validatenull(this.$refs['addressLocation'].province)){
        $('.lefts .el-form-item__error1').remove()
        return callback(new Error('请先选择省份'))
      }else if(validatenull(this.$refs['addressLocation'].city)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__error').css('left',210)
        return callback(new Error('请先选择市'))
      }else if(validatenull(this.$refs['addressLocation'].district)){
        $('.lefts .el-form-item__error1').remove()
        $('.lefts .el-form-item__error').css('left', 420)
        return callback(new Error('请先选择区/县'))
      }else{
        return callback()
      }
    }
    return {
      visible: false,
      addSupplier:{
        companyName:null,
        name:null,
        phone:null,
        provinceId:null,
        cityId:null,
        districtId:null,
        address:null,
        addressLocation:null
      },
      newSupplierRules:{
        companyName:[{required:true,message:'请输入有效的供应商名称',trigger:'blur'}],
        name:[{required:true,message:'请输入有效的联系人',trigger:'blur'}],
        phone:[{required:true,message:'请输入有效的手机号码',trigger:'blur'}, {validator: validatePhone, trigger: 'blur'}],
        // addressLocation: [{required: true, validator: selectLocation, trigger: 'change' }],
        // address:[{required:true,message:'请输入有效的详细地址',trigger:'blur'}],
      },
    }
  },
  components:{
    gtSelectLocation,
  },
  created(){
    //获取companyId
    const { companyId = '' } = getStore({name: 'commenInfo'})
    this.companyId = companyId
  },
  props:{
    isPublished:{
      type: Boolean,
      default: false
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['addSupplier'].resetFields()
        this.addSupplier.provinceId = null
        this.addSupplier.cityId = null
        this.addSupplier.districtId = null
      })
      
    },
    //新增供应商newSupplier
    async save() {
      this.$refs['addSupplier'].validate(async (valid) => {
        if (valid) {
          var local = locations(this.$refs['addressLocation'])
          let form = {
            mbgCompanyId:this.companyId,
            ...this.addSupplier,
            ...local
          }
          const { data } = await api.newSupplier(form)
          if(data.code == 0){
            this.visible = false
            if(this.isPublished){
              this.$emit('refreshDataList')
            }else{
              this.$emit('refreshNewSupplierDataList')
            }
          }else{
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.newSupplier{
  .locations {
  .el-input__inner {
    width: 300px!important;
  }
}
}
</style>

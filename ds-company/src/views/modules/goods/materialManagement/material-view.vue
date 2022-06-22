<template>
  <el-dialog
    :close-on-click-modal="false"
    :title="!this.id ? '新增加料' : (this.id && type == 'view') ? '查看加料信息' : '编辑加料'"
    :visible.sync="visible"
    width="450px"
    append-to-body
    class="material-view">
    <div>
      <el-form ref="form" label-width="120px" :model="form" :rules="materialRules">
        <el-form-item label="加料名称" prop="name">
          <!-- 新增或者编辑 -->
          <el-input v-if="!this.id || (this.id && this.type !== 'view')" v-model="form.name" :maxlength="5" placeholder="名称限制5个汉字以内"></el-input>
          <!-- 查看 -->
          <span v-else>{{form.name}}</span>
        </el-form-item>
        <el-form-item class="salePrice" label="加料价格" prop="salePrice">
          <!-- 新增或者编辑 -->
          <el-input v-if="!this.id || (this.id && this.type !== 'view')" v-model="form.salePrice"></el-input>
          <!-- 查看 -->
          <span v-else>{{form.salePrice}}</span>
          <span class="unit">元</span>
        </el-form-item>
      </el-form>
    </div>
    <span slot="footer" class="dialog-footer">
      <!-- 新增 -->
      <el-button v-if="!this.id" type="primary" @click="save">确定</el-button>
      <!-- 编辑 -->
      <el-button v-if="this.id && !this.type" type="primary" @click="save">确定修改</el-button>
      <el-button v-if="this.id && !this.type" type="primary" @click="visible = false">取消</el-button>
      <!-- 查看 -->
      <el-button v-if="this.id && this.type == 'view'" type="primary" @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { validatenull,oneDecimal,priceRange } from '@/utils/validate'
import { materialDetail,newMaterial,editMaterial } from "@/service/goods";
export default {
  data() {
    const validateSalePrice = (rule, value, callback) => {
      if (value) {
        if (oneDecimal(value)) {
          if (!priceRange(value, 499999.9, 0)) {
            callback(
              new Error("请输入0.0-499999.9的价格数字，最多保留小数点后一位")
            );
          } else {
            callback();
          } 
        } else {
          callback(
            new Error("请输入一位有效小数的正数")
          );
        }
      } else {
        callback();
      }
    };
    return {
      id: '',
      visible: false,
      validateSalePrice,
      form:{
        name: null,
        salePrice:null,
      },
      materialRules:{
        name:[{required: true,message:'加料名称必填',trigger: 'blur'}],
        salePrice:[{required: true, message:'加料价格必填'},
                   {validator: validateSalePrice, trigger: "blur" }]
      }
    }
  },
  methods: {
    init(id,type) {
      this.id = id
      this.type = type
      this.visible = true
      if(this.id){
        // 获取详情
        this.getDataList(this.id)
      }else{
        this.form = {}
      }
      this.$nextTick(() => {
        this.$refs['form'].clearValidate()
      })
    },
    
    // 获取数据列表
    async getDataList(id) {
      this.dataListLoading = true
      const { data } = await materialDetail(id)
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.form = data.data
        this.form.salePrice = this.priceNum(data.data.salePrice).toFixed(1)
      } else {
        this.dataList = {}
        this.$message.error(data.msg)
      }
    },
    async save() {
      this.$refs['form'].validate(async (valid) => {
        if (valid) {
          const res = !this.id ? await newMaterial({
            name : this.form.name,
            salePrice : this.priceNum(this.form.salePrice,'out'),
          }) : await editMaterial({
            id: this.id,
            name : this.form.name,
            salePrice : this.priceNum(this.form.salePrice,'out'),
          })
          this.visible = false
          this.$emit('refreshDataList')
        }
      })
    }
  }
}
</script>
<style lang="scss">
  .material-view {
    .salePrice{
      .el-input--medium .el-input__inner {
        height: 33px;
        line-height: 33px;
        width: 170px;
      }
    }
    .unit{
      display: inline;
    }
    .el-input {
      position: relative;
      font-size: 14px;
      display: inline-block;
      width: 60%;
    }
  }
</style>

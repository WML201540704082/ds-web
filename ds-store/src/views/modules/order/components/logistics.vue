<template>
  <el-dialog
    :close-on-click-modal="false"
    title="填写发货信息"
    :visible.sync="visible"
    width="30%"
    append-to-body>
    <el-form ref="logistics-form" label-width="110px" :rules="dataFormRules" :model="form">
      <el-form-item label="物流公司" prop="shipCompany">
        <el-select v-model="form.shipCompany" placeholder="请输入物流公司">
          <el-option
            v-for="item in logisticsCompany"
            :key="item.value"
            :label="item.label"
            :value="item.label">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="物流单号" prop="shipNo">
        <el-input v-model="form.shipNo" placeholder="请输入物流单号"></el-input>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { orderShipment } from '@/service/order'
import { logisticsCompany } from '@/utils/dict'
export default {
  data() {
    return {
      id: '',
      visible: false,
      logisticsCompany,
      form: {
        shipCompany: null,
        shipNo: null
      },
      dataFormRules: {
        shipCompany: [{required: true, message: '请填写物流信息', trigger: 'blur'}],
        shipNo: [{required: true, message: '请填写物流单号',  trigger: 'blur'}]
      }
    }
  },
  methods: {
    init(id) {
      this.id = id
      this.visible = true
      this.$nextTick(() => {
        this.$refs['logistics-form'].resetFields()
      })
    },
    dataFormSubmit() {
      this.$refs['logistics-form'].validate(async (valid) => {
        if (valid) {
          const { data } = await orderShipment({
            id: this.id,
            shipCompany: this.form.shipCompany,
            shipNo: this.form.shipNo
          })
          if(data.code === 0){
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

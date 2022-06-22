<template>
<el-dialog
  :title="pageStatus === 'create' ? '新增银行卡' : '修改银行卡'"
  :close-on-click-modal="false"
  width="40%"
  :visible.sync="visible"
  append-to-body>
  <el-form class="dialog-form" :model="card" :rules="dataRule" ref="account" label-width="80px">
    <el-form-item label="账户类别" prop="type">
      <el-radio-group v-model="card.type">
        <el-radio :label="item.value" :key="item.value" v-for="item in cardType">{{item.label}}</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="开户名" prop="name">
      <el-input v-model="card.name" placeholder="请输入开户名"></el-input>
    </el-form-item>
    <el-form-item label="银行卡号" prop="bankCode">
      <el-input v-model="card.bankCode" placeholder="请输入银行卡号"></el-input>
    </el-form-item>
    <el-form-item label="开户银行" prop="bankName">
      <el-input v-model="card.bankName" placeholder="请填写到开户支行名称"></el-input>
    </el-form-item>
  </el-form>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button type="primary" @click="dataFormSubmit()">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { cardType } from '@/utils/dict'
import { updateCard } from '@/service/setting'
export default {
  name: 'account-modal',
  data () {
    return {
      visible: false,
      pageStatus: 'create',
      card: {
        type: null,
        name: null,
        bankCode: null,
        bankName: null
      },
      cardType,
      dataRule: {
        type: [{required: true, message: '用户名不能为空'}],
        name: [{required: true, message: '开户名不能为空'}],
        bankCode: [{required: true, message: '银行卡号不能为空'}],
        bankName: [{required: true, message: '开户银行不能为空'}]
      }
    }
  },
  methods: {
    init (card) {
      this.pageStatus = card ? 'edit' : 'create'
      this.visible = true
    },
    // 表单提交
    dataFormSubmit () {
      this.$refs['account'].validate(async (valid) => {
        if (valid) {
          // const res = await updateCard(this.card)
          this.$emit('refreshAccount', this.card)
          this.visible = false
        }
      })
    }
  }
}
</script>

<template>
  <el-dialog
    title="退款审核"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <el-form label-width="135px" :rules="dataFormRules" :model="review" ref="review">
      <el-form-item label="退货单号">
        <span class="itemInput">{{review.id}}</span>
      </el-form-item>
      <el-form-item label="顾客">
        <span class="itemInput" v-if="review.customer">{{review.customer.phone || '--'}}</span>
        <span v-else>--</span>
      </el-form-item>
      <el-form-item label="退款原因">
        <span class="itemInput">{{review.reason ? filterStatus(review.reason, refundReason) : '--'}}</span>
      </el-form-item>
      <el-form-item label="退款金额">
        <span class="itemInput">{{priceNum(review.amount) || 0}} 元</span>
      </el-form-item>
      <el-form-item label="申请时间">
        <span class="itemInput">{{moment(review.createTime).format('YYYY-MM-DD HH:mm:ss')}}</span>
      </el-form-item>
      <el-form-item label="审核结果" prop="pass">
        <el-radio-group v-model="review.pass">
          <el-radio :label="true">通过</el-radio>
          <el-radio :label="false">拒绝</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="审核说明" prop="comment">
        <el-input type="textarea" rows="5" v-model="review.comment"/>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="isload" @click="handleUpdate">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import moment from 'moment'
import { getreturnOrderDetail, refundAudit } from '@/service/order'
import { limitInputName } from '@/utils/validate'
import { refundReason } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  name: 'com-order-refundReview',
  data() {
    const validateRemark = (rule, value, callback) => {
      if (this.review.pass === false && !value) {
        callback(new Error('审核拒绝需要填写说明！'))
      } else  {
        if (limitInputName(value,400) == 1) {
          callback(new Error('备注不能超过200个汉字'))
        } else{
          callback()
        }
      }
    }
    return {
      isload: false,
      review: {
        pass: true,
        customer: {},
        returnOrder: {}
      },
      refundReason,
      filterStatus,
      visible: false,
      moment,
      dataFormRules:{
        pass:[{required: true, message: '请选择审核结果'}],
        comment: [{validator: validateRemark, trigger: 'blur' }]
      }
    }
  },
  methods:{
    async init(id) {
      this.visible = true
      // 获取订单详情
      if (id) {
        const data = await getreturnOrderDetail({id:id})
        this.review = {
          pass: true,
          ...data,
          returnOrder: data.returnOrder ? data.returnOrder : {},
        }
        console.log(this.review)
      }
    },
    handleUpdate() {
      this.$refs['review'].validate(async (valid) => {
        if (valid) {
          console.log(this.review)
          this.isload = true
          const { data } = await refundAudit({
            comment: this.review.comment,
            id: this.review.id,
            pass: this.review.pass
          })
          this.isload = false
          if (data.code === 0) {
            this.$emit('refreshData')
            this.visible = false
          } else {
            this.$message.error(data.msg)
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.serverTime {
  .el-col.serverOne {
    width: 200px;
  }
}
.status-container{
  float: right;
  margin-top: 20px;
  margin-right: 20px;
  font-size: 16px;
}
</style>


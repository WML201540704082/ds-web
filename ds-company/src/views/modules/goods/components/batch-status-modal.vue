<template>
<el-dialog
  title="批量修改商品状态"
  :close-on-click-modal="false"
  class="goods-batch-status-dailog"
  width="400px"
  :visible.sync="visible"
  append-to-body>
  <el-form :model="dataForm" ref="dataForm" label-width="100px">
    <el-form-item label="商品状态" prop="saleStatus">
      <el-switch
        v-model="dataForm.saleStatus"
        active-text="启用"
        inactive-text="禁用">
      </el-switch>
    </el-form-item>
  </el-form>
  <batch-status-error-list ref="batchStatusErrorList" />
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">取消</el-button>
    <el-button :loading="$store.state.loading.global" type="primary" @click="dataFormSubmit">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
import { batchStatus } from '@/service/goods'
import batchStatusErrorList from './batch-status-error-list'
export default {
  name: 'goods-batch-status-dailog',
  data () {
    return {
      visible: false,
      products: [], // 需要修改的产品
      // errorProducts: [],  // 错误的产品列表
      dataForm: {
        saleStatus: true
      }
    }
  },

  components: {
    batchStatusErrorList
  },

  methods: {
    async init (products) {
      this.visible = true
      this.products = products
      this.dataForm = {
        saleStatus: true
      }
    },

    // 表单提交
    async dataFormSubmit () {
      if (this.products.length > 0) {
        let errorProduct = [] // 编程出错的产品
        for (let i = 0; i < this.products.length; i++) {
          const productItem = this.products[i]
          const { data } = await batchStatus({
            id: productItem.id,
            status: this.dataForm.saleStatus
          })
          if (data.code === 0) {

          } else {
            errorProduct.push({
              ...productItem,
              reason: data.msg
            })
          }
        }

        if (errorProduct.length === 0) {
          this.visible = false
          this.$emit('refreshDataList')
        } else {
          this.visible = false
          this.$emit('refreshDataList')
          this.$nextTick(() => {
            this.$refs['batchStatusErrorList'].init(this.products.length, errorProduct)
          })
        }

      }
    },
  }
}
</script>
<style lang="scss">
.goods-batch-status-dailog{


}
</style>


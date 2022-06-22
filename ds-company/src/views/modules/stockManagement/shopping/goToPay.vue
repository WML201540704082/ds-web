<template>
<el-dialog
  title="提示"
  :close-on-click-modal="false"
  class="gotopay"
  :visible.sync="visible"
  append-to-body>
  <div style="text-align:center">“待支付”的订单，请前往<span style="color:red">“萌百格店务助手-进货入库-采购单”</span>中进行支付。</div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="visible = false">确定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  name: 'go-to-pay',
  data () {
    return {
      visible: false,
    }
  },

  methods: {
    init (id) {
      this.id = id
      this.visible = true
    },
  }
}
</script>


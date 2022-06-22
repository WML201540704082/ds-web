<template>
  <el-dialog
    :title="title"
    class="common-dialog"
    :visible.sync="dialogVisible"
    width="30%"
    center
    append-to-body>
    <div class="content" v-show="content" v-html="content"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide" v-if="type === 'confirm'">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">{{confirmText}}</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'confirm-modal',
  data() {
    return {
      loading: false,
      type: 'confirm',
      title: '提示',
      confirmText: '确 定',
      content: null,
      dialogVisible: false,
      confirmCb: null
    }
  },
  methods: {
    show({title = '提示', content, confirm, cancel, type, confirmText = '确 定'}) {
      this.loading = false,
      this.title = title
      this.content = content
      this.dialogVisible = true
      this.type = type
      this.confirmText = confirmText
      this.confirmCb = confirm
      this.cancel = cancel
    },
    hide() {
      this.dialogVisible = false
      if (this.cancel) {
        this.cancel()
      }
    },
    confirm: async function() {
      if (this.loading === true) {
        return
      }
      this.loading = true
      if (this.confirmCb) {
        const res = await this.confirmCb()
      }
      this.loading = false
    }
  }
}
</script>
<style lang="scss">
.common-dialog{
  .content{
    font-size: 16px;
    text-align: center;
  }
}
</style>

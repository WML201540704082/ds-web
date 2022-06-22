<template>
  <el-dialog
    :title="title"
    class="common-dialog"
    :visible.sync="dialogVisible"
    width="30%"
    center
    append-to-body>
    <div class="content" v-if="!isCopy" v-html="content"></div>
    <div class="content" v-else>
      <div v-show="!loading">{{content}}</div>
      <div v-show="loading">正在克隆...</div>
    </div>
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
      isCopy: false,
      loading: false,
      type: 'confirm',
      title: '确定',
      confirmText: '确 定',
      content: null,
      dialogVisible: false,
      confirmCb: null
    }
  },
  methods: {
    show({title = '确定', content, confirm, cancel, type, confirmText = '确 定', isCopy = false}) {
      this.title = title
      this.content = content
      this.isCopy = isCopy
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
    async confirm() {
      this.loading = true
      if (this.confirmCb) {
        const res = await this.confirmCb()
      }
      this.loading = false
    },
    update: async function(name, value) {
      this[name] = value
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

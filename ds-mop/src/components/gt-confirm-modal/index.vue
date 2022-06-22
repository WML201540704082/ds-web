<template>
  <el-dialog
    :title="title"
    :visible.sync="dialogVisible"
    class="common-dialog"
    :showClose="showClose"
    width="30%"
    center>
    <div class="content" v-show="content" v-html="content"></div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide" v-if="type === 'confirm'">取 消</el-button>
      <el-button type="primary" :loading="loading" @click="confirm">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
export default {
  name: 'confirm-modal',
  data() {
    return {
      loading:false,
      type: 'confirm',
      title: '确定',
      content: null,
      showClose: true,
      dialogVisible: false,
      confirmCb: null
    }
  },
  methods: {
    show({title = '确定', content, confirm, type, showClose = true}) {
      this.loading = false,
      this.title = title
      this.content = content
      this.dialogVisible = true
      this.type = type
      this.showClose = showClose
      this.confirmCb = confirm
    },
    hide() {
      this.dialogVisible = false
    },
    confirm: async function() {
      this.loading = true
      if (this.confirmCb) {
        const res = await this.confirmCb()
      }
      this.dialogVisible = false
      this.loading = true
    }
  }
}
</script>
<style lang="scss">
.common-dialog{
  .content{
    font-size: 18px;
    text-align: center;
    font-weight: 600;
  }
}
</style>

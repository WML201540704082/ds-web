<template>
  <el-dialog
  :title="'查看帮助文档'"
  width="80%"
  :close-on-click-modal="false"
  :visible.sync="visible"
  append-to-body>
    <object class="pdf-container" id="show-resources" type="application/pdf" internalinstanceid="291" :data="url" title="pdf">
    </object>
  </el-dialog>
</template>
<script>
// import pdf from 'vue-pdf'
export default {
  data() {
    return{
      visible: false,
      url: window.SITE_CONFIG['helpUrl']
    }
  },
  // components: {
  //   pdf
  // },
  methods: {
    init() {
      this.visible = true
    }
  }
}
</script>
<style>
.pdf-container{
  width: 100%;
  min-height: 500px;
}
</style>

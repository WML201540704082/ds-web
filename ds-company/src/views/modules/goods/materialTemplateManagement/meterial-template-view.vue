<template>
  <el-dialog
    title="加料模板详情"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="35%">
    <div class="toptitle">
      <span class="tip" style="margin-top:-10px">加料模板名称：{{dataDetails.name || '--'}}</span>
      <span class="tip">选择加料：{{feeds || '--'}}</span>
      <span class="tip">当前应用商品：{{dataDetails.drinkNames || '--'}}</span>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="visible = false">返回</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { materialTemplateView } from '@/service/goods'
export default {
  data(){
    return{
      dataDetails: {},
      feeds: null,
      dataDetailsLoading: false,
      visible: false,
      id: null
    }
  },
  methods:{
    init(id){
      this.visible = true
      this.id = id
      this.getDataList()
    },
    // 获取数据列表
    async getDataList() {
      this.dataDetailsLoading = true
      const { data } = await materialTemplateView(this.id)
      this.dataDetailsLoading = false
      if (data && data.code === 0) {
        this.dataDetails = data.data
        this.feeds = data.data.feeds.map(item => item.name).join(',')
      } else {
        this.dataDetails = {}
        this.$message.warning(data.msg)
      }
    },
  }
}
</script>
<style scoped>
.toptitle {
  margin-bottom: 15px;
  color: #72716F;
  font-size: 18px;
  font-weight: 700;
  display: inline-block;
  width: 100%;
}
.tip{
  display: block;
  margin-top: 20px;
}
</style>
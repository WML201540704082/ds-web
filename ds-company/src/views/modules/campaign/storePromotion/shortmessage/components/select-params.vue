<template>
  <el-dialog
    title="选择插入参数"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <div class="list-container">
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in gridData">{{item.name}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { shortmessageParams } from '@/utils/dict'
import { filterStatus } from '@/utils'
export default {
  data(){
    return{
      // 最后选中的数组
      check: {},
      visible: false,
      gridData: shortmessageParams
    }
  },
  methods:{
    async init(){
      this.visible = true
    },
    // 更改当前
    changeItem(item) {
      this.check = item
    },
    // 确定
    sure(){
      if(this.check.id){
        this.visible = false
        this.$emit('refreshParams',this.check)
      }else{
        this.visible = true
        this.$message.warning('请先选择需要插入的参数')
      }
    }
  }
}
</script>
<style lang="scss" scoped>
@import '~@/assets/scss/_variables.scss';
.list-container{
  .list-title{
    font-size: 16px;
    font-weight: bold;
    margin-top: 15px;
    color: #333;
  }
  .item-container{
    overflow: hidden;
    .item{
      float: left;
      cursor: pointer;
      margin: 10px 15px 0 0;
      padding: 10px 15px;
      font-size: 16px;
      border: 1px solid $info--sub-font-color;
      color: $info--sub-font-color;
    }
  }

}
</style>


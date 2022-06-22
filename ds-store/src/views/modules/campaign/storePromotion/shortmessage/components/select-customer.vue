
<template>
  <el-dialog
    title="选择顾客"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <div class="list-container">
      <div class="list-title">基本信息</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.value === check.basic.value}" @click="() => changeItem(item, 'basic')" :key="item.value" v-for="item in basic">{{item.label}}</div>
      </div>
      <div class="list-title">消费信息</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.value === check.review.value}" @click="() => changeItem(item, 'review')" :key="item.value" v-for="item in review">{{item.label}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { filterStatus } from '@/utils'
import { customerBirType, customerReturn } from '@/utils/dict'
import { getStoreList } from '@/service/systore'
export default {
  data(){
    return{
      // 最后选中的数组
      check: {
        basic: {value: ''}, // 选中的生日信息
        review: {value: ''}
      },
      visible: false,
      stores: [],
      basic: customerBirType,
      review: customerReturn
    }
  },
  methods:{
    async init(){
      this.check = {
        basic: {value: ''}, // 选中的生日信息
        review: {value: ''}
      },
      this.visible = true
    },
    // 更改当前
    changeItem(item, type) {
      if (type === 'store') {
        this.check.stores = item
      } else if (type === 'basic') {
        this.check.basic = item
      } else {
        this.check.review = item
      }
    },
    // 确定
    sure(){
      if(this.check){
        this.visible = false
        this.$emit('refreshCustomer',this.check)
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


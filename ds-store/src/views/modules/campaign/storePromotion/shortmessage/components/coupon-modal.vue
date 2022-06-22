<template>
  <el-dialog
    title="选择优惠券"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <div class="list-container" v-if="minsList && minsList.length > 0">
      <div class="list-title">代金券</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in minsList">{{item.name}}</div>
      </div>
    </div>
    <div class="list-container" v-if="discountList && discountList.length > 0">
      <div class="list-title">折扣券</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in discountList">{{item.name}}</div>
      </div>
    </div>
    <div class="list-container" v-if="changeList && changeList.length > 0">
      <div class="list-title">兑换券</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in changeList">{{item.name}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSmsCouponList } from '@/service/campaign.js'
export default {
  data(){
    return{
      dataListLoading:false,
      // 最后选中的数组
      check: {
        id: 0
      },
      visible: false,
      // 代金券
      minsList:[],
      // 折扣券
      discountList: [],
      // 兑换券
      changeList: [],
      pageSize: 10000,
      currentPage: 1,
    }
  },
  methods:{
    async init(select = {}){
      this.visible = true
      this.dataListLoading = true
      this.check = select
      await this.getCoupons()
    },
    // 获取优惠券
    async getCoupons() {
      const { data } = await getSmsCouponList()
      if (data.code === 0) {
        this.discountList = data.data.TYPE_0
        this.minsList = data.data.TYPE_1
        this.changeList = data.data.TYPE_2
      } else {
        this.discountList = []
        this.minsList = []
        this.changeList = []
        this.$message.error(data.msg)
      }
      this.dataListLoading = false
    },
    // 更改当前
    changeItem(item) {
      this.check = item
    },
    // 确定
    sure(){
      if(this.check.id){
        this.visible = false
        this.$emit('refreshCoupon',this.check)
      }else{
        this.visible = true
        this.$message.warning('请先选择优惠券')
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


<template>
  <el-dialog
    title="选择短信模板"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body>
    <div class="list-container" v-if="birthdayList && birthdayList.length > 0">
      <div class="list-title">生日关怀</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in birthdayList">{{item.title}}</div>
      </div>
    </div>
    <div class="list-container" v-if="purchaseList && purchaseList.length > 0">
      <div class="list-title">复购邀请</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in purchaseList">{{item.title}}</div>
      </div>
    </div>
    <div class="list-container" v-if="greetingList && greetingList.length > 0">
      <div class="list-title">节日问候</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in greetingList">{{item.title}}</div>
      </div>
    </div>
    <div class="list-container" v-if="activityList && activityList.length > 0">
      <div class="list-title">活动宣传</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in activityList">{{item.title}}</div>
      </div>
    </div>
    <div class="list-container" v-if="remindList && remindList.length > 0">
      <div class="list-title">到期提醒</div>
      <div class="item-container">
        <div class="item" :class="{'active theme-color theme-border': item.id === check.id}" @click="() => changeItem(item)" :key="item.id" v-for="item in remindList">{{item.title}}</div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="sure">确定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getSmsTemplateList } from '@/service/campaign.js'
export default {
  data(){
    return{
      dataListLoading:false,
      // 最后选中的数组
      check: {
        id: 0
      },
      visible: false,
      // 生日关怀
      birthdayList:[],
      // 复购邀请
      purchaseList: [],
      // 节日问候
      greetingList: [],
      // 活动宣传
      activityList: [],
      // 到期提醒
      remindList: [],
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
      const { data } = await getSmsTemplateList()
      if (data.code === 0) {
        this.birthdayList = data.data.BIRTHDAY
        this.purchaseList = data.data.INVITATION
        this.greetingList = data.data.FESTIVAL
        this.activityList = data.data.ACTIVITY
        this.remindList = data.data.EXPIRATION
      } else {
        this.birthdayList = []
        this.purchaseList = []
        this.greetingList = []
        this.activityList = []
        this.remindList = []
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
        this.$emit('refreshTemp',this.check)
      }else{
        this.visible = true
        this.$message.warning('请先选择短信模板')
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


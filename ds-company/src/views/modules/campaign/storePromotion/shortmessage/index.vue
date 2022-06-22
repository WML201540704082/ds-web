<template>
  <div class="mod-store page-campaign-shortmessage-index">
    <el-card>
      <div class="tab-container">
        <div class="item" :class="{'active theme-color': currentItem == item.id}" @click="() => changeItem(item.id)" :key="item.id" v-for="item in tabs">
          <el-tooltip v-if="item.tip" placement="top" effect="dark">
             <div slot="content">{{item.tip}}</div>
            <span>{{item.label}} <img class="tip-icon" src="static/img/campaign/wenhao.png" alt="" /></span>
          </el-tooltip>
          <span v-else>{{item.label}}</span>
        </div>
      </div>
      <div class="tab-body">
        <send-setting v-if="currentItem == 0" :id="id" @changeForm="flag => hasEdit = flag"/>
        <send-record v-if="currentItem == 1" @editMessage="id => goTo(id)"/>
        <message-template v-if="currentItem == 2"/>
        <campaign-send-record v-if="currentItem == 3" />
        <message-recharge v-if="currentItem == 4" />
        <recharge-history v-if="currentItem == 5" />
      </div>
    </el-card>
  </div>
</template>
<script>
import messageTemplate from './message-template'
import messageRecharge from './message-recharge'
import sendRecord from './send-record'
import sendSetting from './send-settting'
import rechargeHistory from './recharge-history'
import campaignSendRecord from './campaign-send-record'
export default {
  name:'campaign-storePromotion-campaign-shortmessage-index',
  data() {
    return {
      id: '',
      hasEdit: false,
      currentItem: 0,
      tabs: [{
        id: 0,
        label: '发送短信'
      }, {
        id: 1,
        label: '营销短信发送记录',
        tip: '在“短信营销”中手动创建短信发送的记录'
      }, {
        id: 2,
        label: '短信模板'
      }, {
        id: 3,
        label: '发送记录',
        tip: '所有扣减企业短信余量的记录，包括营销短信发送记录'
      }, {
        id: 4,
        label: '余量充值'
      }, {
        id: 5,
        label: '充值记录'
      }]
    }
  },
  // 路由离开
  beforeRouteLeave(to, from, next) {
    if (this.currentItem === 0 && this.hasEdit) {
      this.$easyConfirm.show({
        title: '提示',
        content: '您还未保存页面内容，确定需要退出吗?',
        confirm: async () => {
          this.$easyConfirm.hide()
          next()
        }
      })
    } else {
      next()
    }

  },
  components: {
    messageTemplate,
    messageRecharge,
    sendRecord,
    sendSetting,
    rechargeHistory,
    campaignSendRecord
  },
  methods: {
    goTo(id) {
      this.id = id
      this.currentItem = 0
    },
    changeItem(id) {
      if (this.currentItem === 0 && this.hasEdit) {
        this.$easyConfirm.show({
          title: '提示',
          content: '您还未保存页面内容，确定需要退出吗?',
          confirm: async () => {
            this.id = ''
            this.currentItem = id
            this.$easyConfirm.hide()
          }
        })
      } else {
        this.id = ''
        this.currentItem = id
      }
    }
  }
}
</script>
<style lang="scss">
.page-campaign-shortmessage-index{
  .tab-container{
    display: flex;
    justify-content: center;
    flex-direction: row;
    .item{
      min-width: 100px;
      cursor: pointer;
      text-align: center;
      height: 30px;
      line-height: 30px;
      font-size: 16px;
    }
  }
  .tab-body{
    margin-top: 20px;
  }
  .tip-icon{
    position: relative;
    top: -2px;
    width: 14px;
  }

}
</style>

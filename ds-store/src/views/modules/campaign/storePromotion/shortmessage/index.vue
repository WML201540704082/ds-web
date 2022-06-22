<template>
  <div class="mod-store page-shortmessage-index">
    <el-card>
      <div class="tab-container">
        <div class="item" :class="{'active theme-color': currentItem == item.id}" @click="() => changeItem(item.id)" :key="item.id" v-for="item in tabs">{{item.label}}</div>
      </div>
      <div class="tab-body">
        <send-setting v-if="currentItem == 0" :id="id" @changeForm="changeForm"/>
        <send-record v-if="currentItem == 1" @editMessage="id => goTo(id)"/>
        <message-template v-if="currentItem == 2"/>
      </div>
    </el-card>
  </div>
</template>
<script>
import messageTemplate from './message-template'
import sendRecord from './send-record'
import sendSetting from './send-settting'
export default {
  name:'campaign-storePromotion-shortmessage-index',
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
        label: '发送记录'
      }, {
        id: 2,
        label: '短信模板'
      }]
    }
  },
  components: {
    messageTemplate,
    sendRecord,
    sendSetting
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
  methods: {
    goTo(id) {
      this.id = id
      this.currentItem = 0
    },
    changeForm(flag) {
      this.hasEdit = flag
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
.page-shortmessage-index{
  .tab-container{
    display: flex;
    justify-content: center;
    flex-direction: row;
    .item{
      width: 100px;
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
}
</style>

<template>
  <div id="activeListOne" v-loading="dataListLoading">
    <el-card class="creatPage" v-if="activeList.length==0&&isEmpty==true">
      <div>微信营销活动，是帮助企业做好营销场景的服务工具，合理设置营销活动，将有助于完善客户信息和拓展新客</div>
      <div class="common theme-background isCreated" @click="creatPage">+ 还没有活动，快去创建吧</div>
    </el-card>
    <section class="searchs" v-else>
       <el-form :inline="true" lable-width="60px" class="mode-form-line12" ref="filterForm" :model="filterForm" @keyup.enter.native="resetForm('search')">
          <!-- <div class="common isCreated1" @click="creatPage">创建活动</div> -->
          <el-form-item prop="type">
          <el-select v-model="filterForm.type" placeholder="活动类型" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="filterForm.status" placeholder="活动状态" clearable>
            <el-option  label="全部" value="" ></el-option>
            <el-option
              v-for="item in activeStatus"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="活动时间" prop="time">
          <el-date-picker
            v-model="time"
            type="daterange"
            value-format="timestamp"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <span style="display: inline-block;background: #fff;height: 36px;border-1px solid #dcdfe6;">
          <el-form-item prop="title" class="name">
            <el-input v-model="filterForm.title" placeholder="请输入活动名称" clearable></el-input>
          </el-form-item>
          <span class="search_" @click="resetForm()"><icon-svg name="select" class="theme-color middle" ></icon-svg>
          <!-- <img src="static/img/icon/select.png" alt=""> -->
          </span>
        </span>
      </el-form>
        <div  class="minWidth">
          <el-card class="activeLists" v-for="item in activeList" :key="item.id">
            <div class="listItem">
              <span class="img" @click="detail(item)">
                <img :src="item.cover?'http://'+item.cover:'static/img/goods/phone/no_pic1.png'" alt="">
                <span class="types">{{filterStatus(item.status,activeStatus)}}</span>
              </span>
              <span class="Title">
                <div class="goodsName" @click="detail(item)">{{item.title}}-{{filterStatus(item.type,activeType)}}</div>
                <div class="times">活动时间：{{item.startTime}}-{{item.endTime}}</div>
                <div class="goodsName" style="color:red;margin-top: 10px;margin-bottom: 40px;" v-if="item.status=='REJECT'">审核说明：{{item.checkContent}}</div>
                <div class="allButtons">
                  <!-- PROCESSING("进行中"),PAUSE("暂停"),NOCHECK("待审核"),CLOSED("已下架"),DARFT("草稿"),REJECT("驳回"); -->
                  <span v-if="newStore == 'true' && companyRoleName =='数据运维（技术服务）'" :class="(item.status=='DARFT'||item.status=='REJECT' || item.status=='CLOSED')?'theme-border theme-color rights1':'rights1 disabled'" @click="edit(item)">
                    <el-tooltip placement="top" v-if="item.status=='PROCESSING'">
                      <div slot="content" style="width: 260px;">进行中的活动，请先操作下架后再进行编辑</div>
                      <span style="background:transparent;">编辑</span>
                    </el-tooltip>
                    <span v-else style="background:transparent;">编辑</span>
                  </span>
                  <span v-if="newStore == 'false'" :class="(item.status=='DARFT'||item.status=='REJECT' || item.status=='CLOSED')?'theme-border theme-color rights1':'rights1 disabled'" @click="edit(item)">
                    <el-tooltip placement="top" v-if="item.status=='PROCESSING'">
                      <div slot="content" style="width: 260px;">进行中的活动，请先操作下架后再进行编辑</div>
                      <span style="background:transparent;">编辑</span>
                    </el-tooltip>
                    <span v-else style="background:transparent;">编辑</span>
                  </span>
                  <span v-if="item.status!='PAUSE'&& newStore == 'true' && companyRoleName =='数据运维（技术服务）数据运维（技术服务）'" :class="(item.status=='PROCESSING')?'theme-border theme-color rights1':'rights1 disabled'" @click="stop(item,'暂停')">暂停</span>
                  <span v-if="item.status=='PAUSE'&& newStore == 'true' && companyRoleName =='数据运维（技术服务）'" :class="(item.status=='PAUSE')?'theme-border theme-color rights1':'rights1 disabled'" @click="stop(item,'恢复')">恢复</span>
                  <span v-if="newStore == 'true' && companyRoleName =='数据运维（技术服务）'" :class="(item.status=='PROCESSING')?'theme-border theme-color rights1':'rights1 disabled'" @click="isdown(item)">下架</span>
                  <span v-if="newStore == 'true' && companyRoleName =='数据运维（技术服务）'" :class="(item.status=='DARFT'||item.status=='REJECT')?'theme-border theme-color rights1':'rights1 disabled'" @click="deleteHandel(item)">删除</span>

                  <span v-if="item.status!='PAUSE'&& newStore == 'false'" :class="(item.status=='PROCESSING')?'theme-border theme-color rights1':'rights1 disabled'" @click="stop(item,'暂停')">暂停</span>
                  <span v-if="item.status=='PAUSE'&& newStore == 'false'" :class="(item.status=='PAUSE')?'theme-border theme-color rights1':'rights1 disabled'" @click="stop(item,'恢复')">恢复</span>
                  <span v-if="newStore == 'false'" :class="(item.status=='PROCESSING')?'theme-border theme-color rights1':'rights1 disabled'" @click="isdown(item)">下架</span>
                  <span v-if="newStore == 'false'" :class="(item.status=='DARFT'||item.status=='REJECT')?'theme-border theme-color rights1':'rights1 disabled'" @click="deleteHandel(item)">删除</span>
                </div>
              </span>
            </div>
            <div class="activeRight">
              <div style="margin-top: 60px;font-size: 15px;">点击：{{item.click}}&nbsp;&nbsp;转发：{{item.forward}}&nbsp;&nbsp;转化：{{item.conversion}}</div>
            </div>
          </el-card>
        </div>
    </section>
  </div>
</template>
<script>
import { activeStatus,activeType } from '@/utils/dict'
import * as api from '@/service/activity'
import { filterStatus } from '@/utils'
import { getStore } from '@/utils/storage'
export default {
  name:'campaign-wechatMarketing-activeList-activeList',
  data(){
    return{
      newStore:null,
      companyRoleName:null,
      dataListLoading: false,
      adornParams: false,
      activeStatus,
      activeType,
      isEmpty: true,
      filterStatus,
      activeList:[],
      time: null,
      filterForm:{
        endTime: null,
        startTime: null,
        title:null,
        type: null,
        status: null,
        showStore: true,
      }
    }
  },
  watch:{
    'filterForm.type'(val,old){
      this.filterForm.type = val
      this.isEmpty = false
      this.getDataList()
    },
    'filterForm.status'(val,old){
      this.filterForm.status = val
      this.isEmpty = false
      this.getDataList()
    },
    'time'(val,old){
      if(val){
        let objsplit = val.join(',')
        this.filterForm.startTime = objsplit.split(',')[0]
        this.filterForm.endTime = objsplit.split(',')[1]
        this.isEmpty = false
      }else{
        this.filterForm.startTime = null
        this.filterForm.endTime = null
        this.isEmpty = false
      }
      this.getDataList()
    },
  },
  components: {
  },

  created(){
    this.getDataList()
    const { companyRoleName = '' } = JSON.parse(this.$cookie.get('company-role')) || {}
    this.companyRoleName = companyRoleName
    // 获取门店茶饮类型
    const { newStore = '' } = getStore({name: 'commenInfo'})
    this.newStore = newStore
  },
  methods:{
    // 创建活动
    creatPage(){
      this.$router.push({name:'campaign-wechatMarketing-activeList-specailadd'})
    },
    // 获取数据列表
    async getDataList() {
      this.dataListLoading = true
      const { data } = await api.getactivityList({
        ...this.filterForm
      })
      this.dataListLoading = false
      if (data && data.code === 0) {
        this.activeList = data.data
      } else {
        this.activeList = []
        this.$message.warning(data.msg)
      }

    },
    // 编辑
    edit(item){
      if(item.status=='DARFT'||item.status=='REJECT'||item.status=='CLOSED'){
        if(item.type=='SPECIAL'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-specailadd',query:{id:item.id}})
        }else if(item.type=='TURN'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-bigWheeladd',query:{id:item.id}})
        }else if(item.type=='GROUP'){
          this.$router.push({name:'campaign-wechatMarketing-activeList-communityGroup',query:{id:item.id}})
        }else{
          this.$router.push({name:'campaign-wechatMarketing-activeList-payGiftadd',query:{id:item.id}})
        }
      }

    },

    // 详情
    detail(item){
      if(item.type=='SPECIAL'){
        this.$router.push({name:'campaign-wechatMarketing-activeList-specailadd',query:{id:item.id,type:item.status,checkContent:item.checkContent}})
      }else if(item.type=='TURN'){
        this.$router.push({name:'campaign-wechatMarketing-activeList-bigWheeladd',query:{id:item.id,type:item.status,checkContent:item.checkContent}})
      }else if(item.type=='GROUP'){
        this.$router.push({name:'campaign-wechatMarketing-activeList-communityGroup',query:{id:item.id,type:item.status,checkContent:item.checkContent}})
      }else{
        this.$router.push({name:'campaign-wechatMarketing-activeList-payGiftadd',query:{id:item.id,type:item.status,checkContent:item.checkContent}})
      }

    },
    // 暂停--恢复
    stop(item,text){
      if(item.status=='PROCESSING'||item.status=='PAUSE'){
        this.$easyConfirm.show({
          title: '提示',
          content: '您确认'+text+'该活动吗?',
          confirm: async () => {
            const { data } = await api.pauseActivity(item.id)
            if (data.code === 0) {
              this.$easyConfirm.hide()
              this.$message.success(text+'成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
              this.$easyConfirm.hide()
              this.getDataList()
            }
          }
        })
      }
    },
    // 下架
    isdown(item){
      if(item.status=='PROCESSING'){
        this.$easyConfirm.show({
          title: '提示',
          content: '您确认对该活动进行下架吗?',
          confirm: async () => {
            const { data } = await api.terminateActivity(item.id)
            if (data.code === 0) {
              this.$easyConfirm.hide()
              this.$message.success('下架成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
              this.$easyConfirm.hide()
            }
          }
        })
      }
    },
    // 删除
    deleteHandel(item){
      if(item.status=='DARFT'||item.status=='REJECT'){
        this.$easyConfirm.show({
          title: '提示',
          content: '您确认对该活动进行删除吗?',
          confirm: async () => {
            const { data } = await api.deleteActivity(item.id)
            if (data.code === 0) {
              this.$easyConfirm.hide()
              this.$message.success('删除成功')
              this.getDataList()
            } else {
              this.$message.error(data.msg)
              this.$easyConfirm.hide()
            }
          }
        })
      }
    },
    // 对活动名称进行搜索
    resetForm(){
      this.isEmpty = false
      this.getDataList()
    },
  }
}
</script>
<style lang="scss">
  @import '~@/assets/scss/campaign/index.scss';
.middle {
  font-size: 18px;vertical-align: middle;
}
</style>



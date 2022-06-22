<template>
  <section class="bigwheel"
   v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中">
    <el-form :model="bigwheel" ref="bigwheel" :rules="bigwheeladdRules" label-width="100px">
      <!-- 手机模板 -->
      <gt-wheel-modal :activeadd= "bigwheel" />
      <!-- 右侧信息 -->
      <div class="rights">
        <gt-subtitle title="01. 基本信息"/>
        <el-card style="margin-bottom: 10px;">
          <div style="float: right;font-size: 15px;">状态：<span style="color: green">{{filterStatus(status,activeStatus)}}</span></div>
          <gt-base-info :activeadd= "bigwheel"/>
        </el-card>

        <!-- 奖项设置 -->
        <gt-subtitle title="02. 奖项设置"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <div>设置奖项（最少4项，最多9项）
            <span style="color: red;font-size: 15px;">总中奖率{{allNum}}%</span></div>
            <el-table
            :data="bigwheel.items"
            border
            :stripe="true"
            max-height="360"
            ref="goodsTableList"
            style="width: 100%;min-height: 300px;margin-top: 20px;">
            <el-table-column
              prop="level"
              min-width="200"
              :show-overflow-tooltip="true"
              label="奖项">
              <template slot-scope="scope">
                <span>{{number_of(scope.row.level)}}等奖</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="name"
              align="center"
              min-width="200"
              :show-overflow-tooltip="true"
              label="奖品">
            </el-table-column>
            <el-table-column
              prop="totalQuantity"
              min-width="200"
              :show-overflow-tooltip="true"
              label="投放总数">
              <template slot-scope="scope">
                <span v-if="scope.row.level==bigwheel.items.length">--</span>
                <span v-else>{{scope.row.totalQuantity}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="quantity"
              min-width="200"
              :show-overflow-tooltip="true"
              label="剩余数量">
              <template slot-scope="scope">
                <span v-if="scope.row.level==bigwheel.items.length">--</span>
                <span v-else>{{scope.row.quantity}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="probability"
              min-width="100"
              :show-overflow-tooltip="true"
              label="中奖率">
              <template slot-scope="scope">
                <span >{{scope.row.probability}}%</span>
              </template>
            </el-table-column>
          </el-table>
        </el-card>


        <!-- 审核信息 -->
        <gt-subtitle title="02. 审核信息"/>
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;">
          <el-form-item label="审核信息" prop="result">
            <el-radio-group v-model="bigwheel.result"  :disabled="edit==0">
              <el-radio v-for="item in audio" :key="item.value" :label="item.value">{{item.label}}</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="审核信息" prop="content">
            <el-input type="textarea" v-model="bigwheel.content" :maxlength='200' v-if="edit!=0"></el-input>
            <span class="itemInput" v-else>{{bigwheel.content}}</span>
          </el-form-item>
        </el-card>

         <!-- 下架原因 -->
        <gt-subtitle title="03. 下架原因" v-if="bigwheel.stopReason" />
        <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;" v-if="bigwheel.stopReason">
          <el-form-item label="下架原因" prop="stopReason">
            <span class="itemInput">{{bigwheel.stopReason}}</span>
          </el-form-item>
        </el-card>

      </div>

    </el-form>
    <div class="gt-form-bottom-submit" v-if="edit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="submitCustomer(true)" :loading="$store.state.loading.global" txt="提交"/>
    </div>

    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import { validatenull, priceRange } from '@/utils/validate'
import { audio,activeStatus } from '@/utils/dict'
import gtWheelModal from './components/wheelModal'
import gtBaseInfo from './components/baseinfo-modal'
import gtSubtitle from '@/components/gt-sub-title'
import { filterStatus} from '@/utils'
import NP from 'number-precision'
export default {
  name:'bigwheel-view',
  components:{ gtSubtitle, gtWheelModal,gtBaseInfo },
  data(){
    return{
      activeStatus,
      filterStatus,
      audio,
      showImgPic:null,
      loading: false,
      bigwheel: {
        result: null,
        content: null,
        companyName: null
      },
      storeList:[],
      allNum: 100,
      bigwheeladdRules:{
        result:[{required: true,message:'请选择审核结果',trigger: 'change'}],
        content:[{required: true,message:'请输入审核说明',trigger: 'change'}]
      },
      id: null,
      edit: 0,
      status: null,
    }
  },
  watch:{
    documentWidth(val,oldVal){
      this.setMainWidth()
    },
  },
  computed:{
    documentWidth: {
      get () { return this.$store.state.common.documentWidth },
    },
  },
  mounted(){
    this.$nextTick(function () {
      this.setMainWidth()
      this.id = this.$route.query.id
      this.edit = this.$route.query.edit
      this.status = this.$route.query.status
      this.getbigwheelDetails(this.id)
    })
  },
  methods:{
    // 等级
    number_of (level) {
      level = parseInt(level)
      switch (level) {
      case 1:
        level='一'
        break
      case 2:
        level = '二'
        break
      case 3:
        level = '三'
        break
      case 4:
        level = '四'
        break
      case 5:
        level = '五'
        break
      case 6:
        level = '六'
        break
      case 7:
        level = '七'
        break
      case 8:
        level = '八'
        break
      case 9:
        level = '九'
        break
      }

      return level
    },
    async getCompanyList(id) {
      const { data } = await this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/select'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1
        })
      })
      data.data.records.map(item=>{
        if(item.id == id){
          this.storeList.push(item)
          this.$set(this.bigwheel,'companyName',item.name)
        }
      })
    },

    // 获取数据列表
    async getStoreList(storeIds) {
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/store/list'),
        method: 'post',
        data: this.$http.adornData({
          pageSize: 10000,
          currentPage: 1,
          status: 1
        })
      }).then(({data}) => {
        if (data && data.code === 0) {
          let storeList = []
          data.data.records.map(o=>{
            storeIds.map(i=>{
              if(o.id  == i){
                storeList.push(o.name)
              }
            })
          })
          this.$set(this.bigwheel,'storeList',storeList.join(','))
        }
      })

    },
    // 转盘详情
    async getbigwheelDetails(id){
      const data = await this.$http({
        url: this.$http.adornUrl('/activity/detail/'+id,true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          let bigwheel = data.data.activityDto
          this.bigwheel = {
            ...bigwheel,
            ...data.data,
            items : data.data.items.map(item => {
              return {
                ...item,
                probability: this.priceNum(item.probability)
              }
            }),
          }
          let num =0
          if(this.bigwheel.items&&this.bigwheel.items.length>0){
            let items = this.bigwheel.items
            items.map(item=>{
              // let reg= /^[0-9]+$/
              if(priceRange(item.probability, 100, 0)){
                num = NP.plus(Math.abs(num),Math.abs(item.probability))
              }
            })
            items.push({
              level: items.length+1,
              name:'谢谢参与',
              quantity: 1,
              totalQuantity: 1,
              probability: NP.minus(100,Math.abs(num)),
              cover: null,
              prizeType: 'CUSTOMEIZE',
              prizeId: -1,
            })
          }
          if(this.edit == 0){
            this.bigwheel.result = bigwheel.checkResult
            this.bigwheel.content = bigwheel.checkContent
          }
          this.getCompanyList(this.bigwheel.companyId)
          if(bigwheel.storeIds&&bigwheel.storeIds.length>0){
            this.getStoreList(bigwheel.storeIds)
          }
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    // 设置基本信息宽度
    setMainWidth(){
      var formWidth=$('.bigwheel .el-form').width()
      $('.rights').css('width',formWidth-379)
      window.onresize = () => {
        var formWidth=$('.bigwheel .el-form').width()
        $('.rights').css('width',formWidth-379)
      }
    },
    //图片展示
    openImgPic:function(str,url){
      this.showImgPic = 'http://'+this.bigwheel[str]
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },

    submitCustomer(){
      this.$refs['bigwheel'].validate(async (valid) => {
        if (valid) {
          const data = await this.$http({
            url: this.$http.adornUrl('/activity/check/'+this.id,true),
            method: 'post',
            data: this.$http.adornData({
              ...this.bigwheel
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$router.push({name:'audit-activity'})
            }else{
              this.$message.error(data.msg)
            }
          })
        }else{
          this.$nextTick(() => {
            let offset = $('.el-form-item__error').offset()
            let top = offset.top-140
            $('html,body').animate({scrollTop: top}, 500, 'linear')
          })
        }
      })
    }
  }
}
</script>
<style lang='scss' scope>
@import '~@/assets/scss/campaign/bigwheel.scss';
</style>

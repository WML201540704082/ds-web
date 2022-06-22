<template>
  <section>
    <el-form :model="live_view" ref="live_view" :rules="liveViewRules" label-width="100px">
      <gt-subtitle title="01. 直播信息"/>
      <el-card style="margin-bottom: 10px;">
        <gt-live-info :liveinfoAdd= "live_view"/>
      </el-card>
      <gt-subtitle title="02. 商品信息"/>
      <el-card style="margin-bottom: 10px;">
        <el-table
          :data="live_view.liveProducts"
          border
          :stripe="true"
          height="300"
          style="width: 100%;">
          <el-table-column
            prop="index"
            width="55"
            label="序号">
            <template slot-scope="scope">
              <span>{{scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="productName"
            min-width="120"
            :show-overflow-tooltip="true"
            label="商品名称">
          </el-table-column>
          <el-table-column
            prop="productCover"
            min-width="120"
            :show-overflow-tooltip="true"
            label="商品图片">
            <template slot-scope="scope">
              <img v-if="scope.row.productCover" style="width: 25px;height: 25px;" :src="scope.row.productCover" @click="openImgPic('innerPic',scope.row.productCover)"/>
            </template>
          </el-table-column>
          <el-table-column
            prop="priceType"
            min-width="120"
            :show-overflow-tooltip="true"
            label="价格形式">
            <template slot-scope="scope">
              <span>{{scope.row.productNumTol ? '折扣价' : '折扣价'}}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column
            prop="orginPrice"
            min-width="120"
            :show-overflow-tooltip="true"
            label="原价">
            <template slot-scope="scope">
              <span>{{priceNum(scope.row.orginPrice)}}</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="currentPrice"
            min-width="120"
            :show-overflow-tooltip="true"
            label="价格">
            <template slot-scope="scope">
              <span>{{priceNum(scope.row.currentPrice)}}</span>
            </template>
          </el-table-column>
          <el-table-column
            min-width="120"
            :show-overflow-tooltip="true"
            label="微信审核状态">
            <template slot-scope="scope">
              <span>{{scope.row.liveProductStatusEnum == 'SUBMIT' ? '未审核' : scope.row.liveProductStatusEnum == 'CHECK' ? '已通过审核' : '审核失败'}}</span>
            </template>
          </el-table-column>
        </el-table>
      </el-card>
      <div class="gt-form-bottom-submit" v-if="live_view.liveProducts && edit == 1">
        <gt-button size="large" @click.native="submitGoodsAudit(id)" :loading="$store.state.loading.global" txt="提交商品审核"/>
      </div>
      <!-- 审核信息 -->
      <gt-subtitle title="03. 审核结果" v-show="(edit == 0 && auditStatus != 'UNAUDIT') || edit == 1"/>
      <el-card style="margin-bottom: 10px;padding-bottom: 10px!important;" v-show="(edit == 0 && auditStatus != 'UNAUDIT') || edit == 1">
        <el-form-item label="结果" prop="status">
          <el-radio-group v-model="live_view.status" v-if="edit == 1">
            <el-radio v-for="item in auditResults" :key="item.value" :label="item.value">{{item.label}}</el-radio>
          </el-radio-group>
          <span v-else class="itemInput">{{live_view.status === 'AUDITING' ? '审核中' : live_view.status === 'REFUSED' ? '拒绝' : live_view.status === 'CANCEL' ? '已作废' : '通过'}}</span>
        </el-form-item>
        <!-- <el-form-item label="房间号" prop="wechatRoomId" v-if="live_view.status != 'REFUSED'">
          <el-input :maxlength='20' v-if="edit!=0" v-model="live_view.wechatRoomId" placeholder="请输入房间号" clearable></el-input>
          <span class="itemInput" v-else>{{live_view.wechatRoomId}}</span>
        </el-form-item> -->
        <el-form-item label="备注" prop="remark">
          <el-input type="textarea" v-model="live_view.remark" :maxlength='200' v-if="edit!=0"></el-input>
          <span class="itemInput" v-else>{{live_view.remark}}</span>
        </el-form-item>
      </el-card>
    </el-form>
    <div class="gt-form-bottom-submit" v-if="edit">
      <gt-button size="large" is-default @click.native="$router.go(-1)" txt="取消" />
      <gt-button size="large" @click.native="submitLive(true)" :loading="$store.state.loading.global" txt="提交"/>
    </div>
    <gt-show-pic :imgUrl="showImgPic" ref="dialogShowPic" ></gt-show-pic>
  </section>
</template>
<script>
import gtLiveInfo from './components/liveinfo-model'
import gtSubtitle from '@/components/gt-sub-title'
import { auditResults } from '@/utils/dict'
export default {
  name:'live-view',
  data(){
    const validateNum = (rule, value ,callback) => {
      const reg = /^\d+$/
      if (!reg.test(value)) {
        callback(new Error('请填写数字'))
      }else {
        callback()
      }
    }
    return{
      auditResults,
      live_view: {
        liveProducts: [],
        status: 'UNAUDIT',
        remark: ''
      },
      liveViewRules:{
        status:[{required: true,message:'请选择审核结果',trigger: 'change'}],
        // wechatRoomId:[{required: true, validator: validateNum,trigger: 'blur'}],
        // remark:[{required: true,message:'请输入备注',trigger: 'change'}],
      },
      edit: 0,
      auditStatus: 'UNAUDIT',
      showImgPic: null,
    }
  },
  components:{
    gtLiveInfo,gtSubtitle
  },
  async created(){
    this.id = this.$route.query.id
    await this.getliveDetail(this.id)
    this.auditStatus = this.$route.query.auditStatus
    this.edit = this.$route.query.edit
  },
  methods:{
    // 获取详情
    async getliveDetail(id){
      const data = await this.$http({
        url: this.$http.adornUrl('/live/detail/'+id,true),
        method: 'get',
        params: this.$http.adornParams()
      }).then(({data}) => {
        if(data.data&&data.code == 0){
          this.live_view = {
            ...data.data,
            status: data.data.auditStatus
          }
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    //图片展示
    openImgPic:function(str,url){
      if(str === 'innerPic'){
        this.showImgPic = url
      }else{
        this.showImgPic = this.live_view[str]
      }
      this.$nextTick(() => {
        this.$refs.dialogShowPic.init()
      })
    },
    //商品审核
    async submitGoodsAudit(id){
      debugger
      const data = await this.$http({
        url: this.$http.adornUrl('/live/checkProduct/'+id,true),
        method: 'post',
      }).then(({data}) => {
        if(data.code == 0){
          this.$message.success('操作成功')
          this.getliveDetail(id)
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    //提交
    submitLive(submit){
      this.$refs['live_view'].validate(async (valid) => {
        if (valid) {
          const data = await this.$http({
            url: this.$http.adornUrl('/live/update',true),
            method: 'post',
            data: this.$http.adornData({
              // ...this.live_view,
              id:this.id,
              remark:this.live_view.remark,
              // wechatRoomId:parseInt(this.live_view.wechatRoomId,10),
              status:this.live_view.status == 'UNAUDIT' ? 'AUDITING' : 'REFUSED'
            })
          }).then(({data}) => {
            if(data.code == 0){
              this.$router.push({name:'audit-liveStreaming-live'})
            }else{
              this.$message.error(data.msg)
            }
          })
        }
      })
    }
  },
}
</script>
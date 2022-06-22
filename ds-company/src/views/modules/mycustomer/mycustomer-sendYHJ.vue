<template>
  <el-dialog
    title="发放优惠券"
    :close-on-click-modal="false"
    :visible.sync="visible"
    append-to-body
    width="40%"
    class="sendYHQs">
    <el-form :model="sendObj" ref="sendObj" label-width="120px" style="display:block">
      <div v-for="(itemList,index) in sendObj.couponList" :key="index">
        <el-col :span="22">
          <el-form-item label="优惠券名称" :prop="'couponList.' + index + '.couponId'" :rules="sendObjRule.couponId">
            <el-select v-model="itemList.couponId" placeholder="请输入优惠券名称关键词" filterable>
              <el-option 
                :disabled="(selectYHQs.indexOf(item.id) === -1)?false:true"
                v-for="item in campaignList" 
                :key="item.id" 
                :label="'('+filterStatus(item.type, couponType)+')'+item.name"
                :value="item.id">
              </el-option>
            </el-select>
            <el-form-item :prop="'couponList.' + index + '.quantity'" :rules="sendObjRule.quantity" style="display:inline-block">
              <el-input class="cus-mini-input" v-model="itemList.quantity"></el-input> 张
            </el-form-item>
          </el-form-item>
        </el-col>
        <el-col :span="2" v-if="sendObj.couponList.length>1">
          <span class="closeSpecail" @click="addOrDelYHQ('del',index)">
            <icon-svg name="20" class="theme-color" style="font-size: 25px;vertical-align: middle;"></icon-svg>
          </span>
        </el-col>
      </div>
      <div @click="addOrDelYHQ('add')" class="gt-form-bottom-submit" style="display:inline-block;margin-left:35px;cursor:pointer">
        <icon-svg name="create" style="font-size: 18px;margin-right: 5px;" class="theme-color middle"></icon-svg>
        优惠券发放添加
      </div>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" :loading="$store.state.loading.global" @click.native="sendButton">发放</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getCouponSelectOptions, customerSendCoupon } from '@/service/campaign'
import { filterStatus } from '@/utils'
import { couponType } from '@/utils/dict'
export default {
  data(){
    const validateQuantity = (rule, value, callback) => {
      const reg = /^\d+$/
      if (value || value == 0) {
        if (!reg.test(value)) {
          callback(new Error('请输入1~999之间的正整数！'))
        } else if (value < 1 || value > 999){
          callback(new Error('请输入1~999之间的正整数！'))
        } else {
          callback()
        }
      } else {
        callback()
      }
    }
    return{
      filterStatus,
      couponType,
      visible: false,
      campaignList:[],
      remark: null,
      customerIds:null,
      sendObj:{
        couponList:[{
          couponId:null,
          quantity:0,
        }],
      },
      key: '',
      sendObjRule:{
        couponId: [{required: true,message:'请先选择优惠券'}],
        quantity:[{validator: validateQuantity, trigger: 'blur'}]
      }
    }
  },
  computed:{
    selectYHQs() {
      return this.sendObj.couponList.map(item => item.couponId)
    }
  },
  methods:{
    init(ids){
      this.customerIds = ids
      this.visible = true
      // this.sendObj.couponId = null
      this.sendObj.couponList = [{
        couponId:null,
        quantity:0,
      }]
      this.$nextTick(() => {
        this.$refs['sendObj'].clearValidate()
      })
      this.key = ''
      // 获取优惠券下拉
      this.selectOption()
    },
   
    // 获取优惠券下拉
    async selectOption(){
      const data = await getCouponSelectOptions({
        keyword: this.key
      })
      this.campaignList = data
    },
    // changeSelestYHQ(val){
    //   debugger
    //   if (this.sendObj.couponList.length>1) {
    //     this.newlist = this.campaignList.filter((item,index) => {
    //       return !(item.id == val)
    //     })
    //     this.campaignList = this.newlist
    //   }else{
    //     this.campaignList = this.campaignList
    //   }
    // },
    // 新增优惠券发放--删除一组优惠券
    addOrDelYHQ(type,index){
      if(type=='del'){
        this.sendObj.couponList.splice(index,1)
      }else{
        if (this.sendObj.couponList.length >= 3) {
          this.$message.warning("最多有3条优惠券数据");
        } else {
          this.sendObj.couponList.push({
            couponId:null,
            quantity:0,
          })
        }
      }
    },
    //发放
    sendButton(){
      this.$refs['sendObj'].validate(async (valid) => {
        if (valid) {
          let form  ={
            ...this.sendObj,
            activityId: null,
            activityType: null,
            customerIds: this.customerIds
          }
          const data = await customerSendCoupon(form)
          this.$message.success('发送优惠券成功')
          this.visible = false
          this.$emit('refreshDataList')
        }
      })

    }
  }
}
</script>
<style lang="scss">
.sendYHQs{
  .el-textarea.is-disabled .el-textarea__inner {
    resize: none;
  }
  .el-form-item__error {
    width: 150px;
    color: #f56c6c;
    font-size: 12px;
    line-height: 1;
    padding-top: 2px !important;
    position: absolute;
    top: 100%;
    left: 0;
  }
}
</style>


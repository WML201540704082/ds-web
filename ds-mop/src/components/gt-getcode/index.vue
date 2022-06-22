<template>
	<div class="gt-getvarcode">
		<el-button class="commenButton" :loading="dataLoading" :disabled="verifiDisabled" @click='getCode()'>{{VerifyCode}}</el-button>
	</div>
</template>

<script>
import {isMobile, Trim} from '@/utils/validate'
export default {
  name: 'gt-getcode',
  props:{
    phone:{
      type:String
    },
    id:{
      type:Number
    },
    autoClac:{
      type:Boolean
    },
  },
  created(){
  },
  data(){
    return{
      VerifyCode:'获取验证码',
      verifiDisabled: false,
      dataLoading: false,
      title: '萌百格',
      applicationIdentification: 'doctor-sales',
      phoneNewsContent: '您的验证码为：',
      setTimeoutMyTime: null,
    }
  },
  methods:{
    //获取验证码
    getCode:function(){
      var tel = Trim(this.phone,'g')
      this.getPhoneNews(tel)
    },
    //发送短信信息
    getPhoneNews:function(tel){
      this.dataLoading = true
      this.$http({
        url: this.$http.adornUrl('/baseinfo/mop/company/userAccount/securityCode'),
        method: 'get',
        selfHandleError: true,
        params: this.$http.adornParams({
          id:this.id,
          autoClac:this.autoClac ? '0' : '1',
        })
      }).then(({data}) => {
        this.dataLoading = false
        //倒计时
        if(data.code == 0){
          var total_micro_second = 60 * 1000
          this.count_down(this, total_micro_second)
          this.verifiDisabled=true   //不可点击
          this.$message.success('验证码发送成功')
          this.$emit('verify', data.data.mchntTxnSsn)
        }else{
          this.$message.error(data.msg)
        }
      })
    },
    /* 毫秒级倒计时 */
    /**
     * total_micro_second 倒计时的秒数
     */
    count_down: function (self_, total_micro_second) {
      if (total_micro_second < 0) {
        this.VerifyCode= '重新发送',
        this.verifiDisabled= false
        // timeout则跳出递归
        return
      }
      // 渲染倒计时时钟
      this.VerifyCode=this.date_format(total_micro_second) + ' 秒'

      this.setTimeoutMyTime = setTimeout(function () {
      // 放在最后--
        total_micro_second -= 10
        self_.count_down(self_, total_micro_second)
      }, 10)
    },
    // 时间格式化输出，如03:25:19 86。每10ms都会调用一次
    date_format: function (micro_second) {
    // 秒数
      var second = Math.floor(micro_second / 1000)
      // 小时位
      var hr = Math.floor(second / 3600)
      // 分钟位
      var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60))
      // 秒位
      var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60))// equal to => var sec = second % 60;
      // 毫秒位，保留2位
      var micro_sec = this.fill_zero_prefix(Math.floor((micro_second % 1000) / 10))
      return sec
    },
    // 位数不足补零
    fill_zero_prefix: function (num) {
      return num < 10 ? '0' + num : num
    },
  }
}
</script>

<template>
    <div>
        <el-button class="commenButton theme-background" :disabled="verifiDisabled" @click='getvarCode()'>{{VerifyCode}}</el-button>
    </div>
</template>

<script>
import {isMobile, validatenull, Trim} from '@/utils/validate'
export default {
  name: 'gt-getvarcode',
  props:{
    phone:{
      type:String
    }
  },
  created(){
  },
  data(){
    return{
      VerifyCode:'获取验证码',
      verifiDisabled: false,
      title: '萌百格',
      applicationIdentification: 'doctor-sales',
      phoneNewsContent: '您的验证码为：',
      setTimeoutMyTime: null
    }
  },
  methods:{
    checkPhone:function(tel){

      if (validatenull(tel)){
        this.$message.warning('请输入手机号')
        return
      } else if (!isMobile(tel)) {
        this.$message.warning('手机号码格式错误')
        return
      }
      return true
    },
    //获取验证码
    getvarCode:function(){
      var tel = Trim(this.phone,'g')
      //验证手机号格式
      if(this.checkPhone(tel)){
        this.getPhoneNews(tel)
      }
    },
    //发送短信信息
    getPhoneNews:function(tel){
      var param = {
        'title':this.title,
        'phone':tel,
        'content':this.phoneNewsContent,
        'applicationIdentification':this.applicationIdentification,
        'type':1,
      }
      this.$http({
        url: this.$http.adornUrl('/sms/sendVerify'),
        method: 'post',
        selfHandleError: true,
        data: this.$http.adornData(param)
      }).then(({data}) => {
        //倒计时
        if(data.code == 0){
          var total_micro_second = 60 * 1000
          this.count_down(this, total_micro_second)
          this.verifiDisabled=true   //不可点击
          this.$message.success('验证码发送成功')
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
      var that = this
      if (total_micro_second < 0) {
        that.VerifyCode= '重新发送',
        that.verifiDisabled= false
        // timeout则跳出递归
        return
      }
      // 渲染倒计时时钟
      that.VerifyCode=that.date_format(total_micro_second) + ' 秒'

      that.setTimeoutMyTime = setTimeout(function () {
      // 放在最后--
        total_micro_second -= 10
        that.count_down(self_, total_micro_second)
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
<style lang='scss'>
.commenButton {
  display: inline-block;
  height: 33px;
  line-height: 33px;
  padding: 0 5px!important;
  border-radius: 0 4px 4px 0;
  border: none;
  color: #fff!important;
  cursor: pointer;
}
.verCode input {
  border-radius: 4px 0 0 4px!important;
}
</style>


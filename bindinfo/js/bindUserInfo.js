var vue = new Vue({
    el:'.bindUserInfo',
    data:{
      form:{
         phone:null,          //手机号
         verifiCode:null,
      },
      verifiTime:'获取验证码',
      inputDis:false,
    },
    created:function(){
    },
    methods:{
      // 进行输入登录绑定
      checkForm:function(){
        var that = this;
        if(this.checkInfo()){
          _pub.showProgress();
          var data ={
            "mbjOpenId":_pub.getStorage('openId'),
            "openId": _pub.getStorage("xcxOpenId"),
            "phone": this.form.phone,
            "validCode": this.form.verifiCode
          }
          Http.ajax({
            url: "/user/bind",
      			method: 'post',
            data:data,
            success:function(res){
              _pub.hideProgress();
              if(res.code=='0'){
                 goScanCode(_pub.getStorage('openId'));
                 //goScanCode(that.form.phone);
              }else{
                _pub.showToastBox(res.msg);
              }
            }
          })

        }
      },
      //检查信息是否输入正确
      checkInfo:function(){
        if(_pub.isEmpty(this.form.phone)){
          _pub.showToastBox('请输入手机号!')
          return;
        }
        if(_pub.isEmpty(this.form.verifiCode)){
          _pub.showToastBox('请输入手机验证码!')
          return;
        }
        return true;
      },
      //发送验证码
      getvarCode:function(){
        var that = this;
        const tel = this.form.phone;
        if (_pub.checkPhone(tel,'手机号')) {
            _pub.showProgress();
           Http.ajaxSmsSend({
             tel:tel,
             success:function(res){
               _pub.hideProgress();
               if(res.code==0){
                 that.inputDis = true;
                 const total_micro_second = 60 * 1000;
        	       _pub.count_down(that, total_micro_second);
               }else{
                 that.inputDis = false;
                 _pub.showToastBox(res.msg)
               }

             },
  	         error:function(){
  	         	 that.inputDis = false;
  	         }
           })
         }
      },

    }
})


// 禁止分享
function onBridgeReady(){
  WeixinJSBridge.call('hideOptionMenu');
}
if (typeof WeixinJSBridge == "undefined"){
  if( document.addEventListener ){
    document.addEventListener('WeixinJSBridgeReady', onBridgeReady, false);
  }else if (document.attachEvent){
    document.attachEvent('WeixinJSBridgeReady', onBridgeReady);
    document.attachEvent('onWeixinJSBridgeReady', onBridgeReady);
  }
}else{
    onBridgeReady();
}

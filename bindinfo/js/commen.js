//捕捉页面错误信息 发到nginx--onerror 事件处理器
	onerror=handleErr;
	function handleErr (msg,url,l) {
    var onerrorTxt="";
		onerrorTxt+="Error: " + msg + ";\n";
		onerrorTxt+="URL: " + url + ";\n";
		onerrorTxt+="Line: " + l + ";\n";
    // alert(onerrorTxt);
	}



	window._pub = {
		isAndroid: (/android/gi).test(navigator.appVersion),
		isIOS: (/mac/gi).test(navigator.appVersion),
		isApiCloud:!/^https?:\/\//ig.test(window.location.href),//判斷地址是本地的 即不含有https-->true
		currenHref:decodeURI(document.URL),//当前页面地址
		pageFontSize:0,

		uzStorage: function() {//得到缓存对象  分window和os
				var ls = window.localStorage;
				return ls;
		},
		setStorage: function(key, value) {//设置缓存值
				if (arguments.length === 2) {
						var v = value;
						if (typeof v == 'object') {
								v = JSON.stringify(v);
								v = 'obj-' + v;
						} else {
								v = 'str-' + v;
						}
						var ls = this.uzStorage();
						if (ls) {
								ls.setItem(key, v);
						}
				}
		},
		getStorage: function(key) {//得到缓存值
				var ls = this.uzStorage();
				if (ls) {
						var v = ls.getItem(key);
						if (!v) {
								return; }
						if (v.indexOf('obj-') === 0) {
								v = v.slice(4);
								return JSON.parse(v);
						} else if (v.indexOf('str-') === 0) {
								return v.slice(4);
						}
				}
		},
		rmStorage: function(key) {//移除缓存值
				var ls = this.uzStorage();
				if (ls && key) ls.removeItem(key);
		},
		clearStorage: function(callback) {//清空缓存
				var ls = this.uzStorage();
				if (ls) ls.clear();
		},

     //监听网络连接
		 addEventListOnline:function(){
			  let connectionType = navigator.onLine;
				if(!connectionType){
					 this.showToastBox('网络已断开，请连接网络，重新刷新页面！')
					 return;
				}else {}
		 },
    //禁止横屏显示
		forbidHenScreen:function() {
			const that  = this;
			let orientation=window.orientation;
			if(orientation==90||orientation==-90){
				 document.body.style.display='none';
				 that.showToastBox("请使用竖屏访问！");
			}
			window.onorientationchange=function(){
				 document.body.style.display="block";
				 that.forbidHenScreen();
			};
		},
    //添加弹框--加载条
		addViewShadBox:function(){
			let imgSS = ''
	    if($("#COM_showToastBox")){
	      let c = '<div id="COM_showToastBox" class="hide"><p></p></div>'
	      $("body").after(c)
	    }
	    if($("#COM_showProgress")){
	      let c = '<div id="COM_showProgress" class="hide"><div class="_content">'+
	              '<img src="'+imgSS+'img/loading.gif" ><span >正在加载中...</span><span class="_hurry">不要捉急哦</span>'+
	              '</div></div>'
	      $("body").after(c)
	    }
		},
		//弹框--提示语
		showToastBox: function(msg) {
				$("#COM_showToastBox p").html(msg)
				$("#COM_showToastBox").removeClass('hide')
				var t=setTimeout(function(){
						$("#COM_showToastBox").addClass('hide')
				},2500)
		},


		isShowProgress:false,
		//加载条--显示
		showProgress: function(type) {
			console.log('进度条--显示'+this.isShowProgress)
			if(this.isShowProgress) return;
			$("#COM_showProgress").removeClass('hide')
			this.isShowProgress = true;
		},
		//隐藏加载条
		hideProgress: function() {
			console.log('进度条--隐藏'+this.isShowProgress)
			if(!this.isShowProgress) return;
			$("#COM_showProgress").addClass('hide')
			this.isShowProgress = false;
		},
		//判断对象是否为空
		isEmpty: function (val) {
			if (typeof val === 'boolean') {
				return false
			}
			if (val instanceof Array) {
				if (val.length === 0) return true
			} else if (val instanceof Object) {
				if (JSON.stringify(val) === '{}') return true
			} else {
				if (val === 'null' || val == null || val === 'undefined' || val === undefined || val === '') return true
				return false
			}

			return false
		},


		//加载模板页面
		getTemplate:function(url){
			var sizeNu = this.getLocationNumHtm()-1;
			 let imgSS = ''
			 for (var i=0; i<sizeNu; i++) {
				 imgSS +='../';
			 }
		    var template = '';
		    $.ajax({
		        url: imgSS+url,
		        async: false,//同步请求  在没有返回值之前，同步请求将锁住浏览器，用户其它操作必须等待请求完成才可以执行
		        success: function(result) {
		            template = result;
		        },
		        error: function(msg) {
		            console.log('找不到:' + url + '模板,请检查');
		        }
		    });

		    return template
		},
		//弹框  关闭打开
		shadowBoxOC:function(tap,state){
			 if (!tap) return;
			 let flag = state == 'open';
		   if(flag){//打开
		     $(tap).removeClass('hide');
		     $('html,body').addClass('bodyNoScroll')
		   }else{//关闭
		     $(tap).addClass('hide');
		     $('html,body').removeClass('bodyNoScroll')
		   }
		},
		//校验手机号码
		checkPhone:function(tel,defaultStr){
			defaultStr = defaultStr||'手机号';
			var reg=/^[1][0-9]{10}$/;
			if (this.isEmpty(tel)){
					this.showToastBox('请输入'+defaultStr)
					return;
			} else if (!(reg.test(tel))) {
				 this.showToastBox(defaultStr+'格式错误')
				 return;
			}
			return true
		},
		//书写用户名称--限制
		limitInputName:function(val,limit){
			if (this.isEmpty(val)) return val;
			limit = limit||10;

			var len = 0;
			var valString = '';
			for (var i=0; i<val.length; i++) {  //限制字数
				if(len < limit){
						if (val.charCodeAt(i)>127 || val.charCodeAt(i)==94) {
							 len += 2;
							 valString += val[i]
						 } else {
							 len ++;
							 valString += val[i]
						 }
				}else{
						this.showToastBox('名字只能为5个字符')
				 }

			 }
			 var CS =/[^\u4e00-\u9fa5a-zA-Z]/ ;  //非中文非英文
			 if(CS.test(valString) ){
					this.showToastBox('名字不能含特殊字符和数字')
			 }
				return valString.replace(CS,'')
		},
		limitTextEnglAndData:function(val,showInfo){
			var CS =/[^a-zA-Z0-9]/ ;  //非英文数字
			if(CS.test(val)){
				this.showToastBox(showInfo)
			}
			return val.replace(/[^a-zA-Z0-9]/g,'');
		},

		clickLastTime:0,
		//控制点击事件
		clickViewTapTime:function (e) {
				var time = e.timeStamp;
				//设置无效点击，根据自己的需求设置，这里navigateTo切换页面到动画结束需要的时间为500毫秒左右
				if (time - this.clickLastTime < 300 && this.clickLastTime != 0) {
					this.clickLastTime = time;//这里一定更新无效点击的时间
					return ;
				}
				//更新有效点击的时间
				this.clickLastTime = time;
				return true
		},

		setTimeoutMyTime:null,
		/* 毫秒级倒计时 */
		count_down:function(that, total_micro_second,initMsg) {
			 initMsg = initMsg || "重新发送";
			if (total_micro_second < 0) {
					vue.verifiTime=initMsg
					vue.inputDis=false;
				// timeout则跳出递归
				return;
			}
			// 渲染倒计时时钟
				vue.verifiTime= this.date_format(total_micro_second) + " 秒"
			 setTimeoutMyTime = setTimeout(function () {
				// 放在最后--
				total_micro_second -= 10;
				_pub.count_down(that, total_micro_second,initMsg);
			}, 10)
		},
		// 时间格式化输出，如03:25:19 86。每10ms都会调用一次
		date_format:function(micro_second) {
			// 秒数
			var second = Math.floor(micro_second / 1000);
			// 小时位
			var hr = Math.floor(second / 3600);
			// 分钟位
			var min = this.fill_zero_prefix(Math.floor((second - hr * 3600) / 60));
			// 秒位
			var sec = this.fill_zero_prefix((second - hr * 3600 - min * 60));// equal to => var sec = second % 60;
			// 毫秒位，保留2位
			var micro_sec = this.fill_zero_prefix(Math.floor((micro_second % 1000) / 10));
			return sec;
		},
		// 位数不足补零
		fill_zero_prefix:function(num) {
			return num < 10 ? "0" + num : num
		},


		 //微信方法
		 urlSetWXuRL:function(){
			 const slef = this;
 			var useragent = navigator.userAgent;
 			if (useragent.match(/MicroMessenger/i) != 'MicroMessenger') {
 				// 这里警告框会阻塞当前页面继续加载
 				let turl = slef.currenHref.split('&');
 				let tlinkUrl ='https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx2cce2df939499ea2&redirect_uri='+ turl[0]+'&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect';
 			  window.location.replace(tlinkUrl);
 			}
 		},
		//跳转公众号
		goGZauthorize:function(){
      //  window.location.replace("https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA4MDcyMjc5Mw==&scene=126#wechat_redirect");
			let urlS = "https://mp.weixin.qq.com/mp/profile_ext?action=home&__biz=MzA4MDcyMjc5Mw==&scene=126#wechat_redirect";
		  window.open(urlS, '_blank');
			//  window.close();
		},

	}




/*
-------------全局配置---------------------------------------
 */
window.APPMODE = 'test';//测试  pub--正式  dev--开发  test--测试 pre--预发布
window.CONFIG = {// 全局配置
  HOST:'',
  pubUrl: 'https://ds.mengbaige.com/weshop',
  testUrl: 'https://ds.gateon.cn/weshop',
  devUrl: 'https://dstest.gateon.cn/weshop',
  preUrl: 'https://preds.mengbaige.com/weshop',
  prefixUrl:'',//'/dmp/product'
  storeName : "萌百小店",
  appIdentification : "dmp-integral",
  phoneNewsContent : "您的验证码为：",
};
(function (doc, win) {
   //适配
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc = function () {
            var clientWidth = docEl.clientWidth;
            if (!clientWidth) return;
						_pub.pageFontSize=100 * (clientWidth / 375);
            docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
        };
				recalc();
		    if (!doc.addEventListener) return;
		    win.addEventListener(resizeEvt, recalc, false);
		    doc.addEventListener('DOMContentLoaded', recalc, false);

    //监听网络断开
		_pub.addEventListOnline();

    //禁止横屏使用
		_pub.forbidHenScreen();

		//添加弹框以及加载条
		_pub.addViewShadBox();

})(document, window);


  APPMODE == 'pub' && (function(){//正式
    CONFIG.HOST = CONFIG.pubUrl;//正式
  })();
  APPMODE == 'test' && (function(){//测试
    CONFIG.HOST = CONFIG.testUrl;//测试
  })();
  APPMODE == 'dev' && (function(){//开发
    CONFIG.HOST = CONFIG.devUrl;//开发
  })();
  APPMODE == 'pre' && (function(){//预发布
    CONFIG.HOST = CONFIG.preUrl;//预发布
  })();
    function Http() {
    }

    Http.prototype = {
        getAiaxObj:function(opts){//得到完整url連接
           var url = opts.baseUrl?opts.baseUrl:CONFIG.HOST;
					 opts.url = opts.url?opts.url:'';
           opts.url = url+opts.url;
           opts.method=opts.method?opts.method:'post';
					 let param=opts.header||{};
					 if (!opts.header&&!opts.isNotHeaderXT) {
						 //param['X-UnionId'] =_pub.getStorage('unionId') || '';
						 param['X-UnionId'] =_pub.getStorage('xcxOpenId') || '';
						 param['X-OpenId'] =_pub.getStorage('xcxOpenId') || '';
					 }
						param['Content-Type'] = 'application/json;charset=utf-8';
						opts.header = param;
            return opts;
        },
        //发送验证码
        ajaxSmsSend:function(opts){
          this.ajaxGetAddress({
             url:'/sms/sendVerify',
						 method: 'post',
             data:{
               "title":opts.title?opts.title:CONFIG.storeName,
               "phone":opts.tel
             },
             header:null,
						 isNotHeaderXT:true,
             success:function(ret){
               if (ret.code==0&&(!opts.type||opts.type==1)) {
								 _pub.showToastBox('验证码发送成功');
               }
               opts.success && opts.success(ret);
             },
             error: function (err) {
							  opts.error && opts.error(err);
             }
          })
        },
        ajaxGetAddress: function(opts) {
			    let url = ''
			    switch (window.APPMODE) {
			      case 'dev':
			        url = 'https://dstest.gateon.cn' + opts.url;
			        break;
			      case 'test':
			        url = 'https://ds.gateon.cn' + opts.url;
			        break;
			      case 'pub':
			        url = 'https://ds.mengbaige.com' + opts.url;
			        break;
			      case 'pre':
			        url = 'https://preds.mengbaige.com' + opts.url;
			        break;
			    }

            try {
              //  _pub.showProgress();
              $ && $.ajax({
                  url: url,
                  type: opts.method,
                  dataType: 'json',
                  headers : {
										'Content-Type': 'application/json;charset=utf-8'
									},
                  data:JSON.stringify(opts.data),
									success: function(res){
                        // _pub.hideProgress();
						        if (res) {
						            opts.success && opts.success(res);
						        }else{
						          _pub.showToastBox('网络异常');
						        }
								 	},
									error:function(err){
										_pub.hideProgress();
										_pub.showToastBox("网络出小差了");//后台没有数据返回的时候，显示网络出小差
										// 错误信息处理
			              opts.error && opts.error(err);
									}
							 });
            } catch(e) {
              _pub.hideProgress();
              _pub.showToastBox('异常' + e.message);
            }
        },
        ajax: function(opts) {
					if(!opts.isNotHeaderXT&&!_pub.getStorage('openId')){//校验x-UnionId
						 _pub.rmStorage('openId')
						 _pub.showToastBox('openId丢失，退出重新登录！')
						 return false;
					 }
            const self = this;
            var opts = self.getAiaxObj(opts);
            // alert(opts.url);
            if(!opts.url) return;
            try {
              //  _pub.showProgress();
              $ && $.ajax({
                  url: opts.url,
                  type: opts.method,
                  dataType: 'json',
                  headers : opts.header,
                  data:JSON.stringify(opts.data),
									success: function(res){
                        // _pub.hideProgress();
						        if (res) {
						            opts.success && opts.success(res);
						        }else{
						          _pub.showToastBox('网络异常');
						        }
								 	},
									error:function(err){
										_pub.hideProgress();
										_pub.showToastBox("网络出小差了");//后台没有数据返回的时候，显示网络出小差
										// 错误信息处理
			              opts.error && opts.error(err);
									}
							 });
            } catch(e) {
              _pub.hideProgress();
              _pub.showToastBox('异常' + e.message);
            }
        },
				getWXOpenId:function(code,callback){
				//	alert('code------------'+code)
				  var url = 'https://wxservice.gateon.cn/wechat/getUserInfo/'+code+'/3';
				 // var url = 'https://productcodetest.gateon.cn/wechat/getUserInfo/'+code+'/3';

				  $ && $.ajax({
				      url: url,
				      type: 'GET',
				      dataType: 'json',
				      success: function(data,err){
				      //	alert(url)
				       // alert('-------WXOpenId-------'+JSON.stringify(data))
				      // openId取值 : H5 和小程序 采用 通用的 unionId
				        if(!_pub.isEmpty(data.openId)){
									 _pub.setStorage("openId",data.openId)
									 callback&&callback();
				        }else {
				        	_pub.showToastBox('openId未获取，请退出重新登录！')
				        }
				      },
				      error: function(err){
								// alert(JSON.stringify(err)+'------接口openIderr---')
							}
				  })
				},



    };
    Http.prototype.constructor = Http;
    window.Http = new Http();

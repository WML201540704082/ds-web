$(document).ready(function() {

  var product_top = $("#introduct")[0].offsetTop - 86;
  var service_top = $("#service")[0].offsetTop - 86;
  // 防止重复提交
  var commitFlag = true
  var year = new Date().getFullYear()
  $('#year').text(year)
  /**
   * 产品橱窗展示
   */
  var productWidth = $("#product_content")[0].children[0].offsetWidth;
  $("#product_pre").click(function() {
    var left = $("#product_content")[0].scrollLeft;
    if (left !== 0) {
      $("#product_content").animate(
        {
          scrollLeft: left - productWidth
        },
        500
      );
    }
  });
  $("#product_next").click(function() {
    var left = $("#product_content")[0].scrollLeft;
    if (left < productWidth * 3) {
      $("#product_content").animate(
        {
          scrollLeft: left + productWidth
        },
        500
      );
    }
  });

  function scrollTo(top) {
    $("html,body").animate(
      {
        scrollTop: top
      },
      500,
      "linear"
    );
  }

  // 点击首页
  $("#home_link").click(function() {
    scrollTo(0);
  });
  // 点击产品
  $("#product_link").click(function() {
    scrollTo(product_top);
  });
  // 点击产品
  $("#service_link").click(function() {
    scrollTo(service_top);
  });
  // 点击申请
  $(".apply").click(function() {
    var regist_top = $("#regist")[0].offsetTop - 86;
    scrollTo(regist_top);
  });

  // 添加滚动监听
  $(window).scroll(function() {
    var windowTop = $(window).scrollTop();
    if (windowTop < product_top) {
      $("#home_link").attr("class", "nav-item active");
      $("#product_link").attr("class", "nav-item");
      $("#service_link").attr("class", "nav-item");
    } else if (windowTop >= service_top - 100) {
      $("#home_link").attr("class", "nav-item");
      $("#product_link").attr("class", "nav-item");
      $("#service_link").attr("class", "nav-item active");
    } else {
      $("#home_link").attr("class", "nav-item");
      $("#product_link").attr("class", "nav-item active");
      $("#service_link").attr("class", "nav-item");
    }
  });

  // 设置ajax默认参数
  $.ajaxSetup({
    headers: {
      "Content-Type": "application/json;charset=utf-8"
    },
    dataType: "json"
  });

  // 获取省
  try {
    $.ajax({
      url: baseUrl + "/common/district/province",
      method: "GET",
      success(res) {
        if (res.code === 0) {
          var options = res.data.map(function(item) {
            return '<option value="' + item.id + '">' + item.name + "</option>";
          });
          $("#province").append(options.join(""));
        } else {
          showToast("danger", res.msg)
        }
      },
      error(error) {
        showToast("danger", "服务遇到异常，请稍后再试！")
      }
    });
  } catch (error) {
    showToast("danger", "服务遇到异常，请稍后再试！")
  }

  // 获取市
  $("#province").bind("change", function(e) {
    if (e.target.value) {
      $("#city").empty();
      $("#city").append('<option value="" class="select-placeholder">请选择您所在市</option>');
      try {
        $.ajax({
          url: baseUrl + "/common/district/city/" + e.target.value,
          method: "GET",
          success(res) {
            if (res.code === 0) {
              var options = res.data.map(function(item) {
                return (
                  '<option value="' + item.id + '">' + item.name + "</option>"
                );
              });
              $("#city").append(options.join(""));
            } else {
              showToast("danger", res.msg)
            }
          },
          error(error) {
            showToast("danger", "服务遇到异常，请稍后再试！")
          }
        });
      } catch (error) {
        showToast("danger", "服务遇到异常，请稍后再试！")
      }
    }
  });

  // 提交注册
  $("#submit").click(function() {
    try {
      if (checkName() && checkPhone() && checkStore() && commitFlag) {
        var province = $("#province").val() === '' ? '' : $("#province").find("option:selected").text()
        var city = $("#city").val() === '' ? '' : $("#city").find("option:selected").text()
        commitFlag = false
        $.ajax({
          url: baseUrl + "/baseinfo/mobile/company/register",
          method: "POST",
          dataType:'json',
          data: JSON.stringify({
            'province': province,
            'provinceId': $("#province").val() ? Number($("#province").val()) : null,
            'city': city,
            'cityId': $("#city").val() ? Number($("#city").val()) : null,
            'legalPerson': $("#name").val(),
            'phone': $("#phone").val(),
            'name': $("#store").val(),
            'manageType': $("#entity").val() ? Number($("#entity").val() ) : null,
            'recommendUserName': null,
          }),
          success(res) {
            commitFlag = true
            if (res.code === 0) {
              showToast("success", res.msg)
              // 重置表单
              $("#province").val('')
              $("#city").val('')
              $("#name").val('')
              $("#phone").val('')
              $("#store").val('')
              $("#entity").val('')
              window.location.href = companyUrl
            } else {
              showToast("danger", res.msg)
            }

          },
          error(error) {
            commitFlag = true
            showToast("danger", "请求出错！")
          }
        });
      }
    } catch (error) {
      commitFlag = true
      showToast("danger", "服务遇到异常，请稍后再试！")
    }
  });

  // 跳转到sass端
  $("#login").click(function () {
    window.location.href = companyUrl
    showToast("success", "跳转到企业平台...")
  })


  //姓名验证
  $("#name").blur(function() {
    checkName()
  });

  //手机号验证
  $("#phone").blur(function() {
    checkPhone()
  });

  //门店名称验证
  $("#store").blur(function() {
    checkStore()
  });

  // 校验手机号
  function checkPhone() {
    var flag = true
    var PhoneVal = $("#phone").val();
    var regPhone = /^[1][0-9][0-9]{9}$/;;
    if (PhoneVal == "" || PhoneVal.length != 11 || !regPhone.test(PhoneVal)) {
      var errorMsg = "请输入正确的手机号！";
      $("#s2").html(errorMsg);
      $("#s2").css("color","red");
      flag = false
    } else {
      $("#s2").html('');
    }
    return flag
  }

  // 校验门店
  function checkStore() {
    var flag = true
    var nameLength = $("#store").val().length
    if (nameLength === 0) {
      var errorMsg = "门店名称必填!";
      $("#s3").html(errorMsg);
      $("#s3").css("color","red");
      flag = false
    } else {
      $("#s3").html('');
    }
    return flag
  }

  // 校验姓名
  function checkName() {
    var flag = true
    var nameVal = $.trim($("#name").val());
    var regName = /[~#^$@%&!*()<>:;'"{}【】]/;
    var nameLength = $("#name").val().length;
    if (nameVal == "" || nameLength > 50 || regName.test(nameVal)) {
      $("#s1").html("姓名非空，不包含特殊字符！");
      $("#s1").css("color","red");
      flag = false
    } else {
      $("#s1").html("");
    }
    return flag
  }

  function showToast(type, msg) {
    var time = 3000
    if (type == "success") {
      $("#success-toast").html(msg)
      $("#success-toast").attr("class", "alert alert-success")
      setTimeout(function(){
        $("#success-toast").attr("class", "alert alert-success hidden")
      }, time);
    } else if (type == "danger"){
      $("#danger-toast").html(msg)
      $("#danger-toast").attr("class", "alert alert-danger")
      setTimeout(function(){
        $("#danger-toast").attr("class", "alert alert-danger hidden")
      }, time);
    }
  }

});

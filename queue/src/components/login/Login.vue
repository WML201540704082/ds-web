<template>
    <div class="login_form">
      <div class="login_logo">
		  	<span class="login_span">欢迎登陆</span> 
        <div>
          <div class="zhanghao">账号</div>
          <div><input type="text" class="qxs-ic_user qxs-icon"  placeholder="请输入账号" v-model="form.phone"></div>
        </div>
        <div>
          <div class="password">密码</div>
          <div><input type="password"  class="qxs-ic_password qxs-icon"  placeholder="请输入密码" v-model="form.password"></div>
        </div>
        <div style="margin-top: 180px; margin-left: -250px;">
          <!-- <el-checkbox v-model="checked">记住密码</el-checkbox> -->
          <br>
        </div>
        <el-button class="login_btn" @click.native="login" type="primary" round >登录</el-button>
      </div>
    </div>
</template>
<script>
import { login } from '@/service/login'

  export default {
    data() {
      return {
        form:{
          phone: '',
          password: '',
        },
        isBtnLoading: false,
      }
    },
    created () {
    },
    computed: {
    },
    methods: {
       // 登陆
      async submits() {
        this.dataListLoading = true
        const { data } = await login(this.form)
        this.dataListLoading = false
        if (data&&data.code === 0) {
          localStorage.setItem('queue-token',data.data)
          this.$router.replace('/queue')
        } else {
          this.$message.error(data.msg)
        }
      },	
      login() {
        if (!this.form.phone) {
          this.$message.warning('请输入用户名');
          return;
        }
        if (!this.form.password) {
          this.$message.warning('请输入密码');
          return;
        }   
       this.submits()
      },
    }
  }
</script>
<style>
  .login_form {
    width: 100%;
    height: 100%;
    background: url(../../assets/1.jpg) no-repeat;
    background-size:cover;
  }
  .login_logo {
    width: 500px;
    position: absolute;
    left: 50%;
    top:50%;
    margin-left: -250px;
    height: 520px;
    margin-top: -260px;
    background: url(../../assets/yu_ping_input.png);
    background-size: 100% 100%;
    border-radius: 10px;
  }
  .login_logo .login_span{
    color:#4cbbb4;
    font-size:35px;
    /* margin-left: 35px;
    padding-top: -50px; */
    position:relative;
    top:80px
  }
    .qxs-ic_user {
    /* background-size: 13px 15px; */
    background-position: 3%;
		background-color: #f2f2f2;
		border-radius: 10px;
    position:relative;
    top:120px;
    outline: none;
  }
  .qxs-ic_password {
    background-size: 13px 15px;
    background-position: 3%;
    position:relative;
    top:150px;    
		background-color: #f2f2f2;
		border-radius: 10px;
    outline: none;	
  }
  .login_btn {
		height: 50px;
    width: 70%;
		font-size: 16px;
		background-color: #11948b;
		border-radius: 10px;
    filter: brightness(1.4);
	}
	.zhanghao{
		/* color: #808080;
    font-size: 14px;
		margin-left: 10px;    
		position: relative;
    top: 120px; */
    color: #808080;
    float: left;
    width:20%;
    overflow:auto;
    position: relative;
    top: 121px;
    left: 40px;
    line-height: 40px;
	}
	.password{
		color: #808080;
    float: left;
    width:20%;
    overflow:auto;
    position: relative;
    top: 151px;
    left: 40px;
    line-height: 40px;
	}
</style>
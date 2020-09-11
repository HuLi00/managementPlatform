<template>
  <div class="login">
    <div class="login_text">无敌管理系统</div>
    <div class="login_box">
<!--   头像区域-->
      <div class="avatar_box">
        <img src="../../assets/img/login.jpg" alt="">
      </div>
<!--   登陆表单区域-->
      <el-form  :model="loginForm" label-width="0px" class="login_form" :rules="loginFormRules" ref="loginFormRef">
<!--        用户名-->
        <el-form-item prop="username">
          <el-input  prefix-icon="el-icon-user-solid" v-model="loginForm.username"></el-input>
        </el-form-item>
<!--        密码-->
        <el-form-item prop="password">
          <el-input prefix-icon="el-icon-lock" v-model="loginForm.password" type="password"></el-input>
        </el-form-item>
<!--      按钮-->
        <el-form-item class="login_btns">
        <el-button type="primary" @click="login">登录</el-button>
        <el-button type="info" @click="resetForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
  import {request} from "../../network/Request";

  export default {
    name: "Login",
    //绑定数据对象
    data() {
      return{
        loginForm: {
          username: 'admin',
          password: '123456',
        },
        //验证表单中的数据格式
        loginFormRules:{
          username:[
            { require: true, message:"请输入用户名", trigger:"blur" },
            { min: 1, max: 7, message: "用户名长度在1~7个字符之间", trigger:"blur"}
          ],
          password:[
            { require: true, message:"请输入登录密码", trigger:"blur" },
            { min: 6, max: 15, message: "密码长度在6~15个字符之间", trigger:"blur"}
          ],
        }
      }
    },
    methods:{
      //重置登录表单
      resetForm() {
        this.$refs.loginFormRef.resetFields();
      },
      //登录
      login() {
        this.$refs.loginFormRef.validate(valid => {
          if(!valid) return;
          /*request({
            url:'login',
            params:{
              this.loginForm
            }
          })*/
          const loginResult = this.$http.post('login',this.loginForm);
          loginResult.then(res => {
            if(res.data.meta.status != 200) return this.$message.error('登录失败');
            // console.log(res,'登录成功');
            this.$message.success('登陆成功');
            // console.log(res);
            //1将登陆成功之后的token保存到客户端的sessionStorage中
            //1.1项目中除了登陆之外的其他api接口，必须在登录之后才能访问
            //1.2token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
            window.sessionStorage.setItem('token',res.data.data.token)
            //2.通过编程式导航跳转到后台主页，路由地址是/home
            setTimeout(() => {
              this.$router.push('/home')
            },500)
          }).catch(err => {
            console.log(err,'登录网络请求失败！');
          })
        })
      }
    }
  }
</script>

<style scoped>
  .login_text{
    font-size: 50px;
    color: #fff;
    position: absolute;
    left: 50%;
    transform: translate(-50%,100%);
  }
  .login {
    background-color: #2b4b6b;
    height: 100%;
  }
  .login_box {
    height: 300px;
    width: 450px;
    background-color: #fff;
    border-radius: 3px;

    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);/*移动div位置，传入参数（横轴位置，纵轴位置）*/
  }
  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    
    position: absolute;
    left: 50%;
    transform: translate(-50%,-50%);
    background-color: #fff;
  }
  .avatar_box img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    background-color: #eee;
  }
  .login_btns {
    display: flex;
    justify-content: center;
  }
  .login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 0 20px;
    box-sizing: border-box;

  }
</style>
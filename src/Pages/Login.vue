<template>
<div class="login-box">
  <div class="login-form">
    <div class="form-header">
      <div class="logo"></div>
      <p>车猫随手购-管理系统</p>
    </div>
    <el-form :model="logForm" status-icon>
      <el-form-item>
        <el-input v-model="logForm.userName" prefix-icon="el-icon-usericon" placeholder="管理员手机号码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-input type="password" prefix-icon="el-icon-passwordicon" v-model="logForm.pass" placeholder="输入密码" auto-complete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <div class="align-left"><el-checkbox v-model="checked">记住密码</el-checkbox></div>
      </el-form-item>
      <el-form-item>
        <el-button class="submit-btn" type="primary" @click="submitForm">登 录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>
<script>
import VueQrcode from '@xkeshi/vue-qrcode';
import { Request } from '../util.js';
let rememberInfo = window.localStorage.getItem('rememberInfo') || '';
let lastInfo = rememberInfo  ? JSON.parse(rememberInfo) : {};
export default {
  components: { VueQrcode },
  data() {
    return {
      logForm: {
        userName: lastInfo.userName || '',
        pass: lastInfo.pass || ''
      },
      checked: rememberInfo ? true : false
    }
  },
  methods: {
    submitForm() {
      const mobileReg = /^0{0,1}(13[0-9]|15[0-9]|18[0-9]|14[0-9]|17[0-9])[0-9]{8}$/;
      let { userName, pass } = this.logForm;
      if (!mobileReg.test(userName)) {
        this.$message.error('请输入正确的手机号码！');
      } else if (pass == '') {
        this.$message.error('请输入验证码！');
      } else {
        if(this.checked){
          window.localStorage.setItem('rememberInfo',JSON.stringify(this.logForm));
        }else{
          window.localStorage.removeItem('rememberInfo');
        }
        Request({
          url: '/systems/systemAdmin/login',
          method: 'POST',
          data: {
            phone: userName,
            smsCode: pass
          },
          done: (res) => {
            this.$message({
              message: '恭喜您，登录成功！跳转中...',
              center: true,
              duration: 900,
              type: 'success'
            });
            if(res.data.moduleList && res.data.moduleList.length>0){
              window.sessionStorage.setItem('loginInfo', JSON.stringify(res));
              setTimeout(() => {
                window.location.reload();
                // this.$emit('handleLogin');
              }, 1000);
            }else{
              this.$message.error('您权限不足，无法访问！');
            }
          },
          fail: (err) => {
            if (err.responseJSON) {
              if (err.responseJSON.error_mesg) {
                this.$message.error(err.responseJSON.error_mesg);
              } else if (err.responseJSON.error) {
                this.$message.error(err.responseJSON.error);
              }
            } else {
              this.$message.error('登录失败，请重试！');
            }
          }
        })
      }
    }
  }
}
</script>
<style>
.login-box {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 100;
  background-color: #f5f5f5;
  display: flex;
  justify-content: center;
  align-items: center;
  & .login-form {
    width: 360px;
    margin: 0 auto;
    text-align: center;
    transform: translateY(-20%);
    @media screen and (min-width: 1679px) {
      width: 720px;
    }
  }
  & .login-qrcode {
    width: 14em;
    height: 14em;
    margin: 1.6em auto 2em auto;
    @media screen and (min-width: 1679px) {
      width:16em;
      height: 16em;
    }
    & canvas {
      display: block;
      width: 100%;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    }
  }
  & .login-hint {
    color: #999;
  }

  & .form-header {
    padding: 0 0 1em 0;
    font-size: 1.5em;
    color: #999;
    & .logo {
      width: 4em;
      height: 4em;
      background-color: red;
      margin: 0 auto;
      background: url('../assets/images/logo.png') no-repeat 50% 50% / 100%;
    }
  }
  & .submit-btn {
    width: 100%;
  }
  & .el-icon-usericon {
    background: url('../assets/images/user-icon.png') no-repeat 50% 50% / 75%;
  }
  & .el-icon-passwordicon {
    background: url('../assets/images/password-icon.png') no-repeat 50% 50% / 70%;
  }
  & .align-left{
    text-align: left;
    & .el-checkbox{
      color: #999;
    }
  }
}
</style>

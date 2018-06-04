<template>
  <div class="app-inner">
    <div v-if="isLogin" class="container">
      <div class="header">
        <div class="logo-box">
          <div class="logo"></div>
          <div class="logo-text">CartMall</div>
        </div>
        <div class="login-info">
          <div class="user-info">{{userInfo ? userInfo.nickname : '车猫'}}</div>
          <a class="logout-btn" @click="logout" href="#">退出登录</a>
        </div>
      </div>
      <div :class="{'main':true,'collapse':isCollapse}">
        <div class="sidebar">
          <a class="collapse-btn" @click.prevent="isCollapse = !isCollapse" href="#"></a>
          <el-menu router default-active="1-1" unique-opened @select="handleSelect" :collapse="isCollapse">
            <el-submenu v-for="(item,index) in menuList" :key="index" :index="index+''">
              <template slot="title">
                <i :class="item.iconName"></i>
                <span>{{item.title}}</span>
              </template>
              <el-menu-item v-for="(si,idx) in item.submenu" :key="si.id" :index="si.path || '/'">
                <i class="el-icon-subnav"></i>
                <span slot="title">{{si.title}}</span>
              </el-menu-item>
            </el-submenu>
          </el-menu>
        </div>
        <div class="content">
          <router-view></router-view>
        </div>
      </div>
    </div>
    <login v-else @handleLogin="Login"/>
  </div>
</template>

<script>
import Login from './Pages/Login.vue'
export default {
  components:{Login},
  data() {
    return {
      isLogin : false,
      userInfo:{},
      menuList:[],
      isCollapse:false
    }
  },
  created(){
    let loginInfo = window.sessionStorage.getItem('loginInfo');
    if(loginInfo){
      let innerData = JSON.parse(loginInfo).user;
      this.isLogin = true;
      this.userInfo = JSON.parse(innerData).user;
      this.updateNavList();
    }else{
      this.isLogin = false;
      this.userInfo = {};
    }
  },
  methods: {
    handleSelect(index,indexPath){

    },
    updateNavList(){
      let loginInfo = window.sessionStorage.getItem('loginInfo');
      let navStat = {};
      let navList = [];
      let innerData = JSON.parse(loginInfo).user;
      if(JSON.parse(loginInfo).data && JSON.parse(loginInfo).data.moduleList){
        JSON.parse(loginInfo).data.moduleList.forEach((item,index)=>{
          if(navStat[item.parentId]){
            navStat[item.parentId].submenu.push({
              id : item.id,
              title : item.module,
              path  : item.moduleUri
            });
          }else{
            navStat[item.parentId] = {
              iconName : item.moduleIcon,
              title : item.parentName,
              submenu :[{
                id : item.id,
                title : item.module,
                path  : item.moduleUri
              }]
            }
          }
        });
        this.menuList = navStat;
      }else{
        alert('无权访问！');
      }
    },
    Login(){
      this.isLogin = true;
      this.updateNavList();
    },
    logout(e){
      e.preventDefault();
      this.isLogin = false;
      window.sessionStorage.removeItem('loginInfo');
    }
  }
}
</script>

<style>
@import './assets/styles/base.css';
.app-inner{
  position: relative;
  width: 100%;
  height: 100vh;
}
.container{
  position: relative;
  width: 100%;
  height: 100vh;
  & .header{
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 32px 0 0;
    background-color: #fff;
    box-shadow: 0 0 4px rgba(0,0,0,0.2);
  }
  & .logo-box{
    display: flex;
    align-items: center;
    justify-content: center;
    width: 240px;
    & .logo{
      width: 3.4em;
      height: 3.4em;
      background-color: #eee;
      background: url('./assets/images/logo.png') no-repeat 50% 50% / 100%;
    }
    & .logo-text{
      font-size: 1.6em;
      margin: 0 0 0 0.2em;
      color: #f2c438;
    }
  }
  & .login-info{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    & .user-info{
      margin: 0 1em 0 0;
    }
    & .logout-btn{
      color: #666;
    }
  }
  & .main{
    position: absolute;
    top:80px;
    bottom: 0;
    width: 100%;
  }
  & .sidebar{
    position: relative;
    width: 240px;
    height: 100%;
    overflow-x: hidden;
    overflow-y: auto;
    border-right: solid 1px #f2f2f2;
    flex-shrink: 0;
    transition: all 0.2s;
    & .el-menu{
      border-right: 0;
    }
    & .el-menu-item.is-active .el-icon-subnav::after{
      background-color: #f2c438;
    }
    & .el-icon-subnav{
      position: relative;
      height: 24px;
      &::after{
        content : '';
        position: absolute;
        top: 50%;
        left: 50%;
        width: 8px;
        height: 8px;
        border-radius: 4px;
        background-color: #ccc;
        margin: -4px 0 0 -4px;
      }
    }
    & .el-icon-navUser{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-1.png') no-repeat 50% 50% / 75%;
      opacity: 0.8;
    }
    & .el-icon-navShop{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-2.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navGoods{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-3.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navOpts{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-4.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navStore{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-6.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navStat{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-5.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navBanner{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-7.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navTemplate{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-8.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navSys{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-9.png') no-repeat 50% 50% / 72%;
      opacity: 0.8;
    }
    & .el-icon-navOrders{
      position: relative;
      height: 24px;
      background: url('./assets/images/ni-10.png') no-repeat 50% 50% / 82%;
      opacity: 0.8;
    }
  }
  & .content{
    position: absolute;
    top: 0;
    left: 240px;
    right: 0;
    bottom: 0;
    padding: 1em 2em;
    overflow-x: hidden;
    overflow-y: auto;
    transition: all 0.2s;
  }
  & .collapse{
    & .sidebar{
      width: 64px;
    }
    & .content{
      left: 64px;
    }
  }
}
.el-select{
  width: 100%;
}
.align-right{
  text-align: right;
}
.tb-title{
  font-weight: normal;
  margin-right: 1em;
}
.collapse-btn{
  display: block;
  height: 1.6em;
  border-bottom: 1px solid #eee;
  background: #f4f4f4 url('./assets/images/nav.png') no-repeat 50% 50% / 1em;
}
.go-back{
  color: #f2c438;
  &:hover{
    text-decoration: underline;
  }
}
@keyframes fadeIn {
  0%{
    opacity: 0;
  }
  100%{
    opacity: 1;
  }
}
</style>

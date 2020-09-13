<template>
  <div class="homelayout">
  <el-container class="homeContainer">
    <el-header>
      <div class="homeheader">
        <img src="../../assets/img/homeimg1.jpg" alt="">
        <span>无敌管理系统</span>
      </div>
      <el-button type="info" @click="logout" style="font-size: 20px">注销</el-button>
    </el-header>
    <el-container>
      <el-aside :width="width+'px'">
        <Aside @asideWidthChange="widthchange"></Aside>
      </el-aside>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
  </div>
</template>

<script>
  import Aside from "./Aside";

  export default {
    name: "Home",
    components:{
      Aside,
    },
    data() {
      return{
        width:200,
      }
    },
    methods: {
      logout() {
        window.sessionStorage.clear();
        this.$router.replace('/login')
      },
      widthchange(collapseStatus) {
         if(collapseStatus) {
           this.width = 64;
         }else {
           this.width = 200;
         }
      }
    }
  }
</script>

<style scoped>
  .homelayout {
    height: 100%;
    width: 100%;
  }
  .homeContainer {
    height: 100%;
  }
  .homeheader {
    width: 300px;
    height: 60px;
    display: flex;
    color: #fff;
    font-size: 20px;
    text-align: center;
    line-height: 60px;
  }
  .homeheader img{
    width: 60px;
    height: 100%;
    border-radius: 50%;
  }
  .homeheader span{
    margin-left: 15px;
  }
  .el-header {
    padding-left: 0px;
    background-color: rgb(53,60,62);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .el-aside {
    background-color: rgb(48,54,65);
  }
  .el-main {
    background-color: rgb(232,236,239);
  }

</style>
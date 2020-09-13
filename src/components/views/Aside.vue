<template>
  <div>
<!--    菜单栏区域-->
    <div class="toggle-button" @click="toggleCollapse">|||</div>
    <el-menu
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            :router="true"
            :default-active="activePath"
            background-color="rgb(48,54,65)"
            text-color="#fff"
            active-text-color="rgb(44,150,248)">
<!--      一级菜单-->
      <el-submenu :index="item.id + ''" v-for="item in MenuList" :key="item.id">
<!--        一级菜单模板-->
        <template slot="title">
<!--          一级菜单图标-->
          <i class="el-icon-menu"></i>
<!--          一级菜单文本-->
          <span>{{item.authName}}</span>
        </template>
        <el-menu-item :index="subitem.path + ''" v-for="subitem in item.children" :key="subitem.id" @click="saveNavState(subitem.path)">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>{{subitem.authName}}</span>
          </template>
        </el-menu-item>
        <!--<el-menu-item-group>
          <template slot="title">分组一</template>
          <el-menu-item index="1-1">选项1</el-menu-item>
          <el-menu-item index="1-2">选项2</el-menu-item>
        </el-menu-item-group>
        <el-menu-item-group title="分组2">
          <el-menu-item index="1-3">选项3</el-menu-item>
        </el-menu-item-group>-->
        <!--<el-submenu index="1-4">
          <template slot="title">选项4</template>
          <el-menu-item index="1-4-1">选项1</el-menu-item>
        </el-submenu>-->
      </el-submenu>
     <!-- <el-menu-item index="2">
        <i class="el-icon-menu"></i>
        <span slot="title">导航二</span>
      </el-menu-item>
      <el-menu-item index="3" disabled>
        <i class="el-icon-document"></i>
        <span slot="title">导航三</span>
      </el-menu-item>
      <el-menu-item index="4">
        <i class="el-icon-setting"></i>
        <span slot="title">导航四</span>
      </el-menu-item>-->
    </el-menu>
  </div>
</template>

<script>
  export default {
    name: "Aside",
    data() {
      return {
        MenuList: [],
        isCollapse: false,
        activePath:'',
      }
    },
    methods: {
      //获取左侧菜单栏
      //async 和 await 可以简化axios请求操作
      //{data：res}为直接结构返回对象，将对象中的data绑定到res上
      async getMenuList() {
         const {data: res} = await this.$http.get('menus');
         if(res.meta.status != 200) {
           return this.$message.error(res.meta.msg)
         }else {
           this.MenuList = res.data;
         }
      },
      toggleCollapse() {
        this.isCollapse = !this.isCollapse;
        let collapseStatus = this.isCollapse;
        this.$emit('asideWidthChange',collapseStatus);
      },
      saveNavState(activePath) {
        window.sessionStorage.setItem('activePath',activePath);
        this.activePath = activePath;
      },
    },
    created() {
      this.getMenuList();
      this.activePath = window.sessionStorage.getItem('activePath')
    }
  }
</script>

<style scoped>
  .toggle-button {
    background-color: rgb(71,80,97);
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
  }
  .el-menu {
    border-right: 0px;
  }

</style>
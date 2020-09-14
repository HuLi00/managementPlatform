//导入vue-router
import Vue from 'vue'
import Router from 'vue-router'
//实现路由的懒加载
const Login = () => import('../login/Login');
const Home = () => import('../views/Home');
const Mainwel = () => import('../views/welMain');
const User = () => import('../users/User');
const Rights = () => import('../power/Rights');
const Roles = () => import('../power/Roles');
const Cate = () => import('../goods/Cate');
const CateParams = () => import('../goods/CateParams');
const Goods = () => import('../goods/Goods');

//使用vue—router
Vue.use(Router)

const router =  new Router ({
  routes:[
    {
      path:'/',
      redirect: '/login',
      component:Login
    },
    {
      path: '/login',
      component: Login
    },
    {
      path: '/home',
      component: Home,
      children: [
        {
          path: '',
          redirect: 'welcome',
          component: Mainwel
        },
        {
          path: 'welcome',
          component: Mainwel
        },
        {
          path:'users',
          component: User
        },
        {
          path:'rights',
          component: Rights
        },
        {
          path:'roles',
          component: Roles
        },
        {
          path:'categories',
          component:Cate
        },
        {
          path:'params',
          component:CateParams
        },
        {
          path:'goods',
          component:Goods
        }
      ],
    },
  ],
  mode: 'history',
})

//在此处挂载导航守卫，用token来验证用户的访问权限
//to 代表要去的路由
//from 代表来的路由
//next 代表下一步的操作
router.beforeEach((to,from,next) => {
  if(to.path === '/login') {
    return next();
  }else if(!(window.sessionStorage.getItem('token'))){
    return next('/login')
  }
  next();
})

//导出router
export default router;
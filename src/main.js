import Vue from 'vue'
import App from './App.vue'
import router from './components/router'
import './plugin/element'
import './assets/css/loginGlobal.css'  //导入全局样式

//全局导入element_ui
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
// import {request} from "./network/Request";
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
//添加请求拦截器，在header中添加Authorization等于token字段
axios.interceptors.request.use(config  => {
  config.headers.Authorization = window.sessionStorage.getItem('token');
  // console.log(config);
  //在操作完成之后必须将config return出去
  return config;
})
Vue.prototype.$http = axios;

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  components:{
  }
}).$mount('#app')

import Vue from 'vue'
import App from './App.vue'
import router from './components/router'
import './plugin/element'
import './assets/css/loginGlobal.css'  //导入全局样式
import ElementUI from 'element-ui'
import '../node_modules/element-ui/lib/theme-chalk/index.css'
// import {request} from "./network/Request";
import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/';
Vue.prototype.$http = axios;

Vue.use(ElementUI)

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  router,
  components:{
  }
}).$mount('#app')

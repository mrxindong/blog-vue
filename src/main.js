import Vue from 'vue'
import App from './App.vue'
import Axios from 'axios'
import router from './router/index.js'
import $ from 'jquery'
import VueWechatTitle from 'vue-wechat-title';
import FooterVue from './components/footer.vue';
import YearbloglistVue from './components/yearbloglist.vue'
import ErrorTipsVue from './components/errortips.vue';
import "babel-polyfill"; //兼容IE，否则在ie下会报错：promise未定义
import store from './store/index'
//引入ElementUI
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.use(ElementUI);
Axios.defaults.withCredentials = true; //跨域时，axios允许cookie添加到请求中
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';
//Axios.defaults.baseURL="http://127.0.0.1:8000";//如需部署到线上，此处要注释掉
Vue.prototype.$axios = Axios; //给Vue原型挂载一个属性
Vue.use(VueWechatTitle); //显示每个页面的title
//注册全局组件
Vue.component("footerVue", FooterVue); //前台页面共同的底部
Vue.component("errorVue", ErrorTipsVue); //后台页面错误提示   
Vue.component("yearbloglistVue", YearbloglistVue); //前台页面 年份博客列表
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

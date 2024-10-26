import Vue from 'vue';
import App from './App.vue';
import router from './router'; //引入router
import store from './store';
//引入不需要as?的方法不多，只导出一个的使用as
import apijs from '@/api/api';
import storage from '@/storage';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import axios from 'axios'; // 导入 axios 库
import VueAxios from 'vue-axios'; // 导入 VueAxios 插件
import validator from '../src/utils/validator';
import tools from '../src/utils/tools';
Vue.config.productionTip = false;
Vue.prototype.apijs = apijs;
Vue.prototype.$validator = validator;
Vue.prototype.$tools = tools;
Vue.prototype.storage = storage;
Vue.use(ElementUI);
Vue.use(VueAxios, axios); // 使用 VueAxios 插件并绑定 axios

//挂载router
new Vue({
  router,
  store,
  render: function (h) {
    return h(App);
  },
}).$mount('#app');



/*eslint-disable*/
import Vue from 'vue';
import axios from 'axios';
import App from './app';

import ElementUI from 'element-ui';

import install from 'components/utils/install';

import 'assets/css/base.css';
import './login.css';

import store from '../../store';
import Global from 'components/utils/global';

import qs from 'qs';

import Aes from 'components/utils/aes';
Vue.use(ElementUI);
Vue.use(install);
Vue.prototype.$qs = qs;
Vue.prototype.$aes = Aes;

// 获取外部的serverconfig.json文件的配置存储于session后
var getConfigJson = () => {
  return new Promise((resolve, reject) => {
    Global.getGlobal().then((response) => {
      if (response && response.data) {
        document.title = response.data.title ? response.data.title : 'XXXX平台';
        sessionStorage.setItem('Global', JSON.stringify(response.data));
        // 从配置文件中获取请求baseURL，如果注销了这段，那请求baseURL被代理或者是根路径/,
        // 一般dev环境是注销这段用express服务做跨域代理，nginx上也可以代理，注销这段，
        // 如构建后直接拖入tomact上部署，则需要打开此段，以获取外部配置的baseURL，否则为根路径；
        if (process.env.NODE_ENV === 'production') {
          if (response.data.baseURL) {
            axios.defaults.baseURL = response.data.baseURL;
          } else {
            axios.defaults.baseURL = '';
          }
        }
      }
      resolve(response);
    }).catch((error) => {
      reject(error);
    });
  });
};

getConfigJson().then(() => { // 获取外部配置
  // 初始化根组件
  new Vue({
    el: '#app',
    store,
    render: h => h(App)
  });
});

/*eslint-disable*/
import Vue from 'vue';
import "babel-polyfill";
import App from './app';
import axios from 'axios';
import utils from 'components/utils';
import Global from 'components/utils/global';

import Aes from 'components/utils/aes';
Vue.prototype.$aes = Aes;

import ElementUI from 'element-ui';
import { Loading } from 'element-ui';
import {MessageBox} from 'element-ui';

import VueRouter from 'vue-router';

import install from 'components/utils/install';

import routes from '../../router';

import store from '../../store';

import mixins from 'components/mixins';

// filters
import filters from 'components/filters/index';

import echarts from 'echarts/dist/echarts.min.js';

Vue.use(ElementUI);

Vue.use(VueRouter);

Vue.use(install);

Vue.mixin(mixins);

Object.keys(filters).forEach(i => Vue.filter(i, filters[i])); // 全部引入echarts
// 按需引入echarts，引入 ECharts 主模块
// var echarts = require('echarts/lib/echarts');
//
// require("echarts/lib/chart/line");
// require("echarts/lib/chart/bar");
// require("echarts/lib/chart/pie");
// require("echarts/lib/chart/gauge");
// require("echarts/lib/component/grid");
// require('echarts/lib/component/legend');
// require("echarts/lib/component/legendScroll");
// require("echarts/lib/component/tooltip");
// require("echarts/lib/component/axisPointer");
// require("echarts/lib/component/title");
// require("echarts/lib/component/dataZoom");
// require("echarts/lib/component/markPoint");
// require("echarts/lib/component/toolbox");
// require("zrender/lib/vml/vml");
// require("zrender/lib/svg/svg");

Vue.prototype.$echarts = echarts;

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

let loadingInstance = Loading.service({text: '拼命加载中...', background: 'rgba(0, 0, 0, 0.15)'});// 在获取权限前显示loading

getConfigJson().then(() => { // 获取外部配置
  loadingInstance.close();// 在获取权限后关闭loading
  if (JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')) && JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin && JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin.data && JSON.parse(sessionStorage.getItem('MENULIST'))) {
    let menuList = JSON.parse(sessionStorage.getItem('MENULIST'));
    store.commit({
      type: 'saveMenuList',
      paras: menuList
    });
    if (menuList.length > 0) {
      // 初始化路由
      var router = new VueRouter({
        routes
      });
      // 跳转路由前进行登录校验
      router.beforeEach((to, from, next) => {
        if (to.meta.requireAuth === false) {
          next();
        } else { // 判断该路由是否需要登录权限
          if (JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE'))) {
            store.commit('USER_SIGNIN', JSON.parse(window.sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')));// 模拟登陆成功
            next();
          } else {
            window.location.href = './login.html';
          }
        }
      });
      // 初始化根组件
      var dd = new Vue({
        el: '#app',
        store,
        router,
        render: h => h(App)
      });
    } else {
      MessageBox.confirm('无访问权限，请联系系统管理员1！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: false
      }).then(() => {
        utils.ssoLogout();
      }).catch((errors) => {
        utils.ssoLogout();
        reject(errors);
      });
    }
  } else {
    window.location.href = './login.html';
  }
}).catch(() => {
  window.location.href = './login.html';
});

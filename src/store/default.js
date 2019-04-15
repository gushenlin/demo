import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const USER_SIGNIN = 'USER_SIGNIN'; // 登录成功
const USER_SIGNOUT = 'USER_SIGNOUT'; // 退出登录

const user = {
  state: {
    userLogin: {}, // 登录信息
    account: '', // 登录账号
    routeArr: [], // 每个页面路由元
    menuList: [], // 菜单列表
    session_isDislpayArrow: false
  },
  mutations: {
    [USER_SIGNIN] (state, userLogin) {
      window.sessionStorage.setItem('CURR_USER_PRESCRIPTION_SUPERVISE', JSON.stringify(userLogin));
      state.userLogin = userLogin;
      state.account = userLogin.username; // 登录账号
    },
    [USER_SIGNOUT] (state) {
      window.sessionStorage.removeItem('CURR_USER_PRESCRIPTION_SUPERVISE');
      window.sessionStorage.removeItem('Global');
      state.userLogin = {};
      state.account = '';
      state.routeArr = [];
    },
    saveMenuList (state, payload) {
      state.menuList = payload.paras;
    },
    addRoute (state, routeObj) {
      if (routeObj.route.name === 'prescriptionListDetail') {
        state.routeArr.forEach((item, index) => {
          if (item.route.name === 'prescriptionListDetail') {
            item.route = routeObj.route;
          }
        });
      }

      for (var i = 0; i < state.routeArr.length; i++) {
        if (state.routeArr[i].route.meta.txt === routeObj.route.meta.txt) {
          break;
        }
      }
      // 记录新增路由
      if (i === state.routeArr.length || state.routeArr.length === 0) {
        let myroute = {};
        myroute.historyPath = [routeObj.route];
        myroute.route = routeObj.route;
        state.routeArr.push(myroute);
        // console.log(state.routeArr)
      } else {
        // 新增historyPath
        state.routeArr[i].historyPath.unshift(routeObj.route);
      }
    },
    reduceRoute (state, payload) {
      if (state.routeArr.length === 1 && state.routeArr[0].route.fullPath === '/visualizationIndex') {
        return false;
      }
      var deleteRoute = state.routeArr.splice(payload.paras.index, 1);// 删除路由并返回被删除路由
      // console.log(deleteRoute)
      if (state.routeArr.length > 0) {
        if (deleteRoute[0].route.meta.txt === payload.paras.vueParent.$route.meta.txt) { // 删除的是当前路由的话，跳转最右边路由
          payload.paras.vueParent.$router.push({path: state.routeArr[state.routeArr.length - 1].route.fullPath});
        } else { // 删除的不是当前路由的话，保持当前路由,不做任何处理
          // payload.paras.vueParent.$router.push({path: payload.paras.vueParent.$route.fullPath})
        }
      } else {
        payload.paras.vueParent.$router.push({name: 'index'});
      }
      // console.log(state.routeArr)
    },
    closeAllRoute (state, payload) {
      if (state.routeArr.length === 1) {
        return false;
      } else {
        state.routeArr = [];
      }
      payload.paras.vueParent.$router.push({name: 'index'});
      payload.paras.vueParent.$store.commit({// 当关闭所有时，当前路由是index，由于routeArr清空了，所以需要把当前路由加进去
        type: 'addRoute',
        route: payload.paras.vueParent.$route
      });
    },
    saveSession_isDislpayArrow (state, payload) {
      state.session_isDislpayArrow = payload.isDislpayArrow;
    }
  },
  actions: {}
};

var store = new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production', // 在非生产环境下，使用严格模式
  modules: {
    user
  }
});

// 读取./src/子路由配置
// import config  from '../../../../src/config/config'

// if (config.childStore) {
//      var child = require('../../../../src/config/store');
//     if (Array.isArray(child)) {
//         for (let i = 0; i < child.length; i++) {
//             store.registerModule(child[i].name, child[i].value)
//         }
//     }
// }

export default store;

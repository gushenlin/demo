import axios from 'axios';
import store from '../../store';
import qs from 'qs';
import Vue from 'vue';
import {MessageBox} from 'element-ui';

// axios.defaults.timeout = 2000;

// 默认情况下，axios将JavaScript对象序列化为JSON。 要以应用程序/ x-www-form-urlencoded格式发送数据，您可以使用以下选项之一。
// 可以使用qs库对数据进行编码

// http request 请求拦截器
// axios.interceptors.request.use(
//   config => {// 这里的config包含每次请求的内容,自定义请求头中不能有中文，需要用encodeURI()编码
//     if (store.getters.getToken) {
//       config.headers.post["Content-Type"]="application/json ;charset=utf-8";
//       config.headers.common.Accept = "application/json; charset=utf-8";
//       config.headers.common.token = store.state.token;
//       config.headers.Authorization = `Token ${store.getters.getToken}`;
//       config.headers['X-Token']='eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwOlwvXC9hcGkuamlhamlh'
//     }
//     return config;
//   },
//   err => {
//     return Promise.reject(err);
//   });

// 响应拦截器，验证权限
axios.interceptors.response.use(function (res) {
  let data = res.data;
  let _this = new Vue();
  // console.log(data)
  if (data.code == 101203) {
    MessageBox.confirm('登录超时，请重新登录！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
      showCancelButton: false
    }).then(() => {
      store.commit('USER_SIGNOUT');
      // 此系统退出，调用iam系统
      window.location.href = './login.html';
    }).catch((errors) => {
      store.commit('USER_SIGNOUT');
      // 此系统退出，调用iam系统
      window.location.href = './login.html';
    });
  } else if (data.code == 0 || typeof data.code == 'undefined') {
    return res;
  } else {
    _this.$notice(data.msg || data.message);
    return res;
  }
}, function (error) {
  return Promise.reject(error);
});
// axios.interceptors.response.use(
//   response => {
//     let data = response.data
//     //alert(JSON.stringify(data))
//     if (data.success) {
//       if (data.data && data.data.code && data.data.code == '103') {
//         window.sessionStorage.removeItem('USERLOGIN_BIREPORT2017');
//         utils.ssoLogout()
//       } else {
//         return Promise.resolve(response);
//       }
//     } else {
//       return Promise.resolve(response);
//     }
//   },
//   error => {
//     return Promise.reject(error)   // 返回接口返回的错误信息
//   })

export default {
  install: function (Vue, options) {
    Vue.prototype.$notice = function (msg, duration) {
      var messages = document.querySelectorAll('.el-message');
      if (messages) {
        Array.prototype.forEach.call(messages, function (message) {
          document.body.removeChild(message);
        });
      }

      this.$message({
        message: msg,
        duration: duration || 2500
      });
    };
    Vue.prototype.$axios = axios;
    Vue.prototype.$qs = qs;
    Vue.prototype.$warning = function () {

      // this.$alert('由于您长时间未操作，系统已自动退出，请重新登录', '提示', {
      //   confirmButtonText: '确定',
      //   showCancelButton: false,
      //   callback: action => {
      //     window.location.href = "./login.html?url=" + encodeURIComponent(window.location.href)
      //   }
      // });
    };
    Vue.prototype.$addRoute = function () {
      this.$store.commit({
        type: 'addRoute',
        route: this.$route
      });
    };
    Vue.prototype.historyGoBack = function (path) {
      if (typeof path === 'number') {
        path = 'index';
      }

      this.$router.push({
        path: path
      });
    };
    Vue.prototype.removeNullKey = function (obj, returnVal = 'obj') {
      let param = {};
      for (let key in obj) {
        if (obj[key]) {
          if (returnVal == 'obj') {
            param[key] = obj[key];
          } else if (returnVal == 'str') {
            param += key + ':' + obj[key] + ',';
          }
        }
      }
      return param;
    };

    Vue.prototype.toCustomString = function (date, option = 'time', divider = 'T') {
      if (!date) {
        return '';
      }
      console.log(typeof date, option);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      // 日期时间分隔符
      const DIVIDER = divider;

      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      hour = hour > 9 ? hour : '0' + hour;
      min = min > 9 ? min : '0' + min;
      sec = sec > 9 ? sec : '0' + sec;
      if (option === 'date') {
        return year + '-' + month + '-' + day;
      } else if (divider === ' ') {
        return year + '-' + month + '-' + day + DIVIDER + hour + '时' + min + '分' + sec + '秒';
      } else if (option === 'time') {
        return year + '-' + month + '-' + day + DIVIDER + hour + ':' + min + ':' + sec;
      }
    };

    Vue.prototype.$dateFormat = function (date, option = 'time') {
      if (!date) {
        return '';
      }
      console.log(typeof date, option);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let day = date.getDate();
      let hour = date.getHours();
      let min = date.getMinutes();
      let sec = date.getSeconds();
      // 日期时间分隔符

      month = month > 9 ? month : '0' + month;
      day = day > 9 ? day : '0' + day;
      hour = hour > 9 ? hour : '0' + hour;
      min = min > 9 ? min : '0' + min;
      sec = sec > 9 ? sec : '0' + sec;
      if (option === 'date') {
        return year + '-' + month + '-' + day;
      } else if (option === 'time') {
        return year + '-' + month + '-' + day + ' ' + hour + ':' + min + ':' + sec;
      }
    };

    // 获取今日和三个月前的date对象
    Vue.prototype.getDefaultTime = function () {
      let endTime = new Date();
      let startTime = new Date();
      startTime.setMonth(startTime.getMonth() - 3);
      endTime.setDate(endTime.getDate() + 1);
      return {
        startTime,
        endTime
      };
    };

    // 获取登陆信息id
    Vue.prototype.$getUserInfo = function () {
      let userInfo = JSON.parse(sessionStorage.getItem('userInfo'));
      if (userInfo) {
        return userInfo;
      }
    };

    // 下载文件，不兼容ie9
    Vue.prototype.$download = function (fileName, blob) {
      if (fileName) {
        let name = fileName.split('.');
        fileName = name[0] + '(' + this.toCustomString(new Date(), 'time', ' ') + ').' + name[1];
      }
      if ('download' in document.createElement('a')) { // 非IE下载
        const elink = document.createElement('a');
        elink.download = fileName;
        elink.style.display = 'none';
        elink.href = URL.createObjectURL(blob);
        document.body.appendChild(elink);
        elink.click();
        URL.revokeObjectURL(elink.href); // 释放URL 对象
        document.body.removeChild(elink);
      } else { // IE10+下载
        navigator.msSaveBlob(blob, fileName);
      }
    };
  }
};

/*eslint-disable*/
import axios from 'axios';
import store from '../../store';

import { MessageBox } from 'element-ui';
// 列表数据转换，显示字段和新增字段不一致情况下
const convert = function (data, showParas, showFlag, checkboxId) {
  var showList = data.showList = {};
  var dataList = data.dataList;
  showList.paras = showParas;
  showList.data = showFlag ? extract(showParas, true) : dataList;
  data.checkAll = checkboxId ? extract(showParas, false) : void 0;

  data.totolPage = Math.ceil(data.total / data.expectSize);

  function extract (paras, flag) {
    let item = [];
    if (flag) {
      for (let i = 0; i < dataList.length; i++) {
        let a = dataList[i];
        let b = {};
        for (let p in paras) {
          if (p in a) {
            b[p] = a[p];
          }
        }
        item.push(b);
      }
    } else {
      for (let i = 0; i < dataList.length; i++) {
        let a = dataList[i][checkboxId];
        if (a || a === 0) {
          item.push(a);
        }
      }
    }

    return item;
  }

  return data;
};

// 输入内容过滤xss
const xssFliter = {
  userNameFilter: function (userName, min, max) {
    var reg = /[\u4E00-\u9FA5]|[\uFE30-\uFFA0]/g;
    var reg2 = /[·【】；”“‘’，。、！￥……（）——{}：“《》？]/g;
    if (reg.test(userName) || reg2.test(userName)) {
      return {
        boo: false,
        errorTxt: '用户名不能含有中文'
      };
    } else if (userName.length < min || userName.length > max) {
      return {
        boo: false,
        errorTxt: '用户名长度为' + min + '-' + max + '个字符'
      };
    } else {
      return {
        boo: true,
        errorTxt: ''
      };
    }
  },
  commonFilter: function (value, min, max) {
    // console.log(  value.length < min )
    // console.log(  value.length> max )
    if (value.length < min || value.length > max) {
      return false;
    } else {
      return true;
    }
  },
  descFilter: function (value, min, max) {
    if (value.length > 20) {
      return false;
    } else {
      return true;
    }
  },
  numFilter: function (value, min, max) {
    var val = parseFloat(value);
    // console.log('parseFloat ' + val)
    // console.log( 'val < max && val > min  ' + (val < max && val > min ))
    if (!(val && val < max && val > min)) {
      return false;
    } else {
      return true;
    }
  },
  mobileFilter: function (mobile, min, max) {
    if (!RegExp('^0?(13|15|17|18|14)[0-9]{9}$').test(mobile) || mobile.length > 11) {
      return false;
    } else {
      return true;
    }
  },
  emailFilter: function (email, min, max) {
    var pattern = /^([a-zA-Z0-9_-])+([\w-\.]+)+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    if (!pattern.test(email) || email.length > 35) {
      return false;
    } else {
      return true;
    }
  },
  postCodeFilter: function (postCode, min, max) {
    if (/^[0-9]\d{5}$/.test(postCode)) {
      return true;
    } else {
      return false;
    }
  }
};

// 获取url参数
const getQuery = function (name) {
  const reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)');
  const r = window.location.search.substr(1).match(reg);
  if (r != null) return unescape(r[2]);
  return null;
};

// 时间格式转化
// 2014-12-03T03:01:00.000Z => 2014-12-03 03:01:00   或时间戳=> 2014-12-03 03:01:00
const dateTimeConvert = function (dateTime) {
  if (dateTime == '' || dateTime == null || dateTime == undefined) {
    return dateTime;
  }
  let date = new Date(dateTime).toLocaleDateString().replace(/\//g, '-');
  const a = date.split('-');
  date = a[0] + '-' + (a[1].length === 2 ? a[1] : ('0' + a[1].toString())) + '-' + (a[2].length === 2 ? a[2] : ('0' + a[2].toString()));
  const time = dateTime.toString().match(new RegExp(/\d{2}:\d{2}:\d{2}/));
  const actural = (time && time[0]) || '';

  return date + ' ' + actural;
};

// 时间格式转化
// 2014-12-03T03:01:00.000Z => 2014-12-03
const formateDate = function (date) {
  if (date == '' || date == null || date == undefined) {
    return date;
  }
  let year = new Date(date).getFullYear();
  let month = new Date(date).getMonth() + 1;
  let day = new Date(date).getDate();
  month = month > 9 ? month : '0' + month;
  day = day > 9 ? day : '0' + day;
  return year + '-' + month + '-' + day;
};

// vue的mixin混合
const mixin = {
  methods: {
    inputCheck (type, objName, property, error, min, max) {
      min = min || 0;
      max = max || 100000;
      var that = this;
      var val = objName ? that[objName][property] : that[property];

      if (type === 'num' && (/[0-9]/g).test(val)) {
        objName ? that[objName][property] = parseFloat(that[objName][property]) : that[property] = parseFloat(that[property]);
      }

      if (type === 'userName') {
        var check = xssFliter[type + 'Filter'](val, min, max);
        if (!check.boo) {
          that.checkError[error] = true;
          that.checkError[error + 'Txt'] = check.errorTxt;
          return false;
        } else {
          that.checkError[error] = false;
        }
      } else {
        if (!xssFliter[type + 'Filter'](val, min, max)) {
          that.checkError[error] = true;
          return false;
        } else {
          that.checkError[error] = false;
        }
      }

      return true;
    },
    confirm (txt) {
      this.$confirm(txt, '提示', {
        confirmButtonText: '我知道了',
        showCancelButton: false,
        closeOnClickModal: false,
        type: 'warning'
      }).catch(() => {

      });
    },
    warning (txt, url) {
      this.$confirm(txt, '提示', {
        confirmButtonText: '我知道了',
        showCancelButton: false,
        closeOnClickModal: false,
        type: 'warning',
        beforeClose: (action, instance, done) => {
          window.location.href = url;
          done();
        }
      }).then(() => {
        window.location.href = url;
      }).catch(() => {

      });
    }
  }
};

// 获取cookie
const getCookie = function (name) {
  let arr;
  let reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)');
  if ((arr = document.cookie.match(reg))) {
    return (arr[2]);
  } else {
    return null;
  }
};

// 设置cookie,增加到vue实例方便全局调用
const setCookie = function (cName, value, expiredays) {
  var exdate = new Date();
  exdate.setDate(exdate.getDate() + expiredays);
  document.cookie = cName + '=' + escape(value) + ((expiredays == null) ? '' : ';expires=' + exdate.toGMTString());
};

// 删除cookie
const delCookie = function (name) {
  var exp = new Date();
  exp.setTime(exp.getTime() - 1);
  var cval = getCookie(name);
  if (cval != null) { document.cookie = name + '=' + cval + ';expires=' + exp.toGMTString(); }
};

// js触发事件
const trigger = function (eventName, ClassOrId) {
// IE
  if (document.all) {
    document.querySelector(ClassOrId).click();
  }
  // 其它浏览器
  else {
    var e = document.createEvent('MouseEvents');
    e.initEvent(eventName, true, true); // 这里的eventName可以换成你想触发的行为
    document.querySelector(ClassOrId).dispatchEvent(e);// 这里的ClassOrId可以换成你想触发行为的DOM结点class或ID
  }
};

/**
 * Created by hh on 17/11/29.
 *深度克隆对象,最完整的deepclone，考虑了循环引用
 *@param {object} [obj] [需要深度克隆的对象]
 *@return {object} [newobj] [返回克隆后的新对象]
 */
// const deepClone = function (obj) {
//   var str, newobj = obj.constructor === Array ? [] : {};
//   if (typeof obj !== 'object') {
//     return;
//   } else if (window.JSON) {
//     str = JSON.stringify(obj); //序列化对象
//     newobj = JSON.parse(str); //还原
//   } else {
//     for (var i in obj) {
//       newobj[i] = typeof obj[i] === 'object' ? deepClone(obj[i]) : obj[i];
//     }
//   }
//   return newobj;
// }

const deepClone = function (obj, parent = null) {
  if (typeof obj !== 'object') {
    return obj;
  } else {
    // 创建一个新对象
    var result = obj.constructor === Array ? [] : {};
    var keys = Object.keys(obj);
    var key = null;
    var temp = null;
    var _parent = parent;
    // 该字段有父级则需要追溯该字段的父级
    while (_parent) {
      // 如果该字段引用了它的父级则循环引用
      if (_parent.originalParent === obj) {
        // 循环引用直接返回同级的新对象
        return _parent.currentParent;
      }
      _parent = _parent.parent;
    }
    for (let i = 0, len = keys.length; i < len; i++) {
      key = keys[i];
      temp = obj[key];
      // 如果字段的值也是一个对象
      if (temp && typeof temp === 'object') {
        // 递归执行深拷贝 将同级别的待拷贝对象与新对象传递给parent方便追溯循环引用
        result[key] = deepClone(temp, {
          originalParent: obj,
          currentParent: result,
          parent: parent
        });
      } else {
        result[key] = temp;
      }
    }
    return result;
  }
};

/**
 * Created by hh on 17/11/29.
 *定义一个排序比较器,降序函数，从大到小
 *@param {String} [propertyName] [属性名]
 *@return {Number}
 */
const compareDescending = function (prop1, prop2) {
  return function (obj1, obj2) {
    var val1 = obj1[prop1][prop2];
    var val2 = obj2[prop1][prop2];
    if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
      val1 = Number(val1);
      val2 = Number(val2);
    }
    if (val1 > val2) {
      return -1;
    } else if (val1 < val2) {
      return 1;
    } else {
      return 0;
    }
  };
};

/**
 * Created by hh on 17/11/29.
 *定义一个排序比较器,升序,从小到大Ascending
 *@param {String} [propertyName] [属性名]
 *@return {Number}
 */
const compareAscending = function (propertyName) {
  return function (object1, object2) {
    var value1 = Number(object1[propertyName]);
    var value2 = Number(object2[propertyName]);
    if (value2 < value1) {
      return 1;
    } else if (value2 > value1) {
      return -1;
    } else {
      return 0;
    }
  };
};

/**
 * Created by hh on 17/11/29.
 *对过长文字进行换行
 *@param {String，number} [val] [需要的整判断的参数] [n] [第几个位置换行]
 *@return {String} [返回str]
 */
const formatLongStr = function (val, n) {
  var str = '';
  if (val) {
    str = val.split('', 1);
    for (var i = 1; i < val.length; i++) {
      str += val[i];
      if (!(i % n)) {
        str += '\n';
      }
    }
  }
  return str;
};

/**
 * Created by hh on 17/12/20.
 *判空 公用方法
 *@param {String、undefined、null} [str] [需要的整判断的参数]
 *@return {String} [返回判断的str，如果str非法，则返回字符串0]
 */
const strIsNaN = function (str) {
  if (str) {
    return str;
  }
  return '0';
};

/**
 * Created by hh on 18/1/20.
 *获取之前N个月的第一天,为了兼容IE所以用/连接时间
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const getPreMonthStartDate = function (N) {
  var now = new Date(); // 当前日期
  var nowMonth = now.getMonth(); // 当前月
  var nowYear = now.getFullYear(); // 当前年
  var monthStartDate = new Date(nowYear, nowMonth - N, 1);
  return monthStartDate;
};

/**
 * Created by hh on 17/12/20.
 *获取当前月的第一天和最后一天,为了兼容IE所以用/连接时间
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const getFirstAndLastDate = function () {
  let date = new Date();
  let year = date.getFullYear();
  let month = (date.getMonth() + 1) < 10 ? '0' + (date.getMonth() + 1) : (date.getMonth() + 1);
  let day = new Date(year, month, 0);
  let firstdate = year + '/' + month + '/01' + ' 00:00:01';
  let lastdate = year + '/' + month + '/' + day.getDate() + ' 00:00:00';
  let firstAndLastDate = {
    firstdate: firstdate,
    lastdate: lastdate
  };
  return firstAndLastDate;
};

/**
 * Created by hh on 17/12/20.
 *权限认证，sso单点登录
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const ssoAuthCode = function () {
  return new Promise((resolve, reject) => {
    // 认证权限
    let Global = JSON.parse(sessionStorage.getItem('Global'));
    let authCode = getQuery('authCode');
    if (authCode == undefined || authCode == '' || authCode == null || authCode == 'null') { // 没有经过统一认证，返回单点登录首页
      window.location.href = Global.iam_sso_host + '/iam/oauth2/ssologin.htm?auto=1&response_type=code&client_id=' + Global.iam_clientid + '&redirect_uri=' + Global.iam_sso_redirect_uri + '&scope=get_user_info';
      return;
    }
    // ajax请求
    axios.get('/PresMon/sso/login?authCode=' + authCode).then((response) => {
      let data = response.data;
      if (data && data.success) {
        store.commit('USER_SIGNIN', {
          userName: data.result.userName,
          userId: data.result.userId,
          userCode: data.result.userCode
        });
        resolve(response);
      } else {
        ssoLogout();
      }
    }).catch((error) => {
      ssoLogout();
      reject(error);
    });
  });
};

/**
 * Created by hh on 18/01/03.
 *权限认证，退出
 *@param {} [] []
 *@return {Object} [返回对象]
 */
const ssoLogout = () => {
  let sessionToken = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin.data;
  axios.get('/peps/login/logout', {headers: {'Authorization': sessionToken}}).then(function (response) {
    let data = response.data;
    console.log(response);
    // return 0;
    if (data.code == 0) {
      // debugger
      store.commit('USER_SIGNOUT');
      // 此系统退出，调用iam系统
      window.location.href = './login.html';
    } else {
      MessageBox.confirm('系统错误，请联系系统管理员！', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        showCancelButton: false
      }).then(() => {
        // debugger
        store.commit('USER_SIGNOUT');
        // 此系统退出，调用iam系统
        window.location.href = './login.html';
      }).catch((errors) => {
        // debugger
        store.commit('USER_SIGNOUT');
        // 此系统退出，调用iam系统
        window.location.href = './login.html';
      });
    }
  }).catch(function (error) {
    console.log(error);
    MessageBox.confirm('系统错误，请联系系统管理员！', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      // debugger
      store.commit('USER_SIGNOUT');
      // 此系统退出，调用iam系统
      window.location.href = './login.html';
    }).catch((errors) => {
      // debugger
      store.commit('USER_SIGNOUT');
      // 此系统退出，调用iam系统
      window.location.href = './login.html';
    });
  });
};

// 菜单排序
const handleMenuList = (menuList) => {
  let handleAfrerMenuList = [];

  menuList.forEach((menuItem1) => {
    if (menuItem1.MENU_LEVEL == '2') {
      // debugger
      menuItem1.children = [];
      menuList.forEach((menuItem2) => {
        // debugger
        if (menuItem1.MENU_CODE === menuItem2.SUPERIOR_MENU) {
          menuItem1.children.push(menuItem2);
        }
      });
      menuItem1.children.sort(compareAscending('MENU_ORDER'));
      handleAfrerMenuList.push(menuItem1);
    }
  });
  handleAfrerMenuList.sort(compareAscending('MENU_ORDER'));
  return handleAfrerMenuList;
};

// 获取菜单列表
const loadMenuInfo = (ACCOUNT) => {
  return new Promise((resolve, reject) => {
    let Global = JSON.parse(sessionStorage.getItem('Global'));
    let params = {
      'ACCOUNT': ACCOUNT,
      'SYS_ID': '11' // 老基础支撑平台的菜单是01菜单
    };
    // console.log('发送' + JSON.stringify(params));
    axios({
      method: 'post',
      url: '/BasePlatServer/common/indexMenu?t=' + (+new Date()),
      data: params
    }).then(function (response) {
      let data = response.data;
      if (data.SYS_HEAD.RET_STATUS == 'S') {
        // console.log('成功' + JSON.stringify(data.BODY.data));
        let menuList = data.BODY.data;

        menuList = [
          {
            'ICO': '',
            'MENU_LEVEL': '1',
            'SUPERIOR_MENU': '00',
            'OPEN_MODE': '0',
            'MENU_NAME': 'XXXX',
            'MENU_ORDER': '1',
            'MENU_PATH': '',
            'MENU_CODE': '01'
          },
          {
            'ICO': 'departmentManager',
            'MENU_LEVEL': '2',
            'SUPERIOR_MENU': '01',
            'OPEN_MODE': '0',
            'MENU_NAME': 'XXXX平台业务监管',
            'MENU_ORDER': '1',
            'MENU_PATH': '',
            'MENU_CODE': '0101'
          },
          {
            'ICO': '',
            'MENU_LEVEL': '3',
            'SUPERIOR_MENU': '0101',
            'OPEN_MODE': '0',
            'MENU_NAME': '实时处方监管',
            'MENU_ORDER': '1',
            'MENU_PATH': '/prescriptionOverviewIndex',
            'MENU_CODE': '010101'
          },
          {
            'ICO': '',
            'MENU_LEVEL': '3',
            'SUPERIOR_MENU': '0101',
            'OPEN_MODE': '0',
            'MENU_NAME': '接入机构监管',
            'MENU_ORDER': '2',
            'MENU_PATH': '/hospitalStatisticsIndex',
            'MENU_CODE': '010102'
          },
          {
            'ICO': '',
            'MENU_LEVEL': '3',
            'SUPERIOR_MENU': '0101',
            'OPEN_MODE': '0',
            'MENU_NAME': '注册医生监管',
            'MENU_ORDER': '3',
            'MENU_PATH': '/doctorStatisticsIndex',
            'MENU_CODE': '010103'
          },
          {
            'ICO': '',
            'MENU_LEVEL': '3',
            'SUPERIOR_MENU': '0101',
            'OPEN_MODE': '0',
            'MENU_NAME': '处方患者监管',
            'MENU_ORDER': '4',
            'MENU_PATH': '/patientsStatisticsIndex',
            'MENU_CODE': '010104'
          },
          {
            'ICO': '',
            'MENU_LEVEL': '3',
            'SUPERIOR_MENU': '0101',
            'OPEN_MODE': '0',
            'MENU_NAME': '处方药店监管',
            'MENU_ORDER': '5',
            'MENU_PATH': '/pharmacyStatisticsIndex',
            'MENU_CODE': '010105'
          }
        ];

        if (menuList.length > 0) {
          let handleAfrerMenuList = handleMenuList(menuList);
          // console.log(JSON.stringify(handleAfrerMenuList));
          sessionStorage.setItem(Global.iam_clientid + '_MENULIST', JSON.stringify(handleAfrerMenuList));
          store.commit({
            type: 'saveMenuList',
            paras: handleAfrerMenuList
          });
          resolve(handleAfrerMenuList);
        } else {
          reject(new Error());
          MessageBox.confirm('无访问权限，请联系系统管理员！', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            showCancelButton: false
          }).then(() => {
            ssoLogout();
          }).catch((errors) => {
            ssoLogout();
            reject(errors);
          });
        }
      } else {
        MessageBox.confirm('系统错误，请联系系统管理员！', '提示', {
          confirmButtonText: '确定',
          type: 'warning',
          showCancelButton: false
        }).then(() => {
          ssoLogout();
        }).catch((errors) => {
          ssoLogout();
          reject(errors);
        });
      }
    });
  }).catch((errors) => {
    console.log(errors);
  });
};

const getOrgData = () => {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('ORGDATA') && sessionStorage.getItem('ORGDATA').length > 0) {
      resolve(JSON.parse(sessionStorage.getItem('ORGDATA')));
    } else {
      let CURR_USER = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE'));
      let Global = JSON.parse(sessionStorage.getItem('Global'));
      let params = {
        'ORG_CODE': 'ROOT_ORG',
        'esblover': false,
        'STATES': '0',
        'SERVICE_CODE': 'bull.MedCoreInterface.Core_Organization_Info',
        'CONSUMER_ID': CURR_USER.CONSUMER_ID
      };
      axios({
        method: 'post',
        url: Global.thirdServiceBaseURL + '/serviceProxy/servlet/?t=' + (+new Date()),
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}, // 以表单格式传递表单对象
        data: params
      }).then(function (response) {
        let data = response.data;
        if (data.SYS_HEAD.RET_STATUS == 'S') {
          let itemCache = [];
          let isHasAll = false;
          for (let i = 0, len = data.BODY.data.length; i < len; i++) {
            if (data.BODY.data[i].ORG_NAME === '全部') {
              isHasAll = true;
              itemCache.unshift({'code': data.BODY.data[i].ORG_CODE, 'desc': data.BODY.data[i].ORG_NAME});
            } else {
              itemCache.push({'code': data.BODY.data[i].ORG_CODE, 'desc': data.BODY.data[i].ORG_NAME});
            }
          }
          if (!isHasAll) {
            itemCache.unshift({'code': '', 'desc': '全部'});
          }
          sessionStorage.setItem('ORGDATA', JSON.stringify(itemCache));
          resolve(JSON.parse(sessionStorage.getItem('ORGDATA')));
          // console.log(itemCache)
        }
      });
    }
  }).catch((errors) => {
    console.log(errors);
  });
};

// 列表中删除某一条数据后，重新获取列表的第几页的数据
const getDelPageNumber = function (pageNo, pageSize, totalCount) {
  if (pageNo * pageSize >= totalCount) {
    if (pageSize == 1) {
      pageNo = pageNo - 1;
    } else {
      var lastRow = totalCount % pageSize;
      if (lastRow == 1) {
        pageNo = pageNo - 1;
      }
    }
  }
  if (pageNo <= 0) {
    pageNo = 1;
  }
  return pageNo;
};

// 获取当前年费
const getCurrentYear = function () {
  var now = new Date();
  return now.getFullYear();
};

// 业务时间处理为季度
const formatBusinessSeason = function (seasonCode) {
  if (seasonCode) {
    var year = seasonCode.substring(0, 4);
    var code = seasonCode.substring(4);
    if (code == '01') {
      return year + '年第一季度';
    } else if (code == '02') {
      return year + '年第二季度';
    } else if (code == '03') {
      return year + '年第三季度';
    } else if (code == '04') {
      return year + '年第四季度';
    }
  }
  return seasonCode;
};

// 季度处理为业务时间
const formatBusinessDate = function (season) {
  if (season) {
    var year = season.substring(0, 4);
    var seasonCode = season.substring(4);
    if (seasonCode == '年第一季度') {
      return year + '01';
    } else if (seasonCode == '年第二季度') {
      return year + '02';
    } else if (seasonCode == '年第三季度') {
      return year + '03';
    } else if (seasonCode == '年第四季度') {
      return year + '04';
    }
  }
  return season;
};

// 业务时间处理为上下半年
const formatBusinessYear = function (yearCode) {
  if (yearCode) {
    var year = yearCode.substring(0, 4);
    var code = yearCode.substring(4);
    if (code == '01') {
      return year + '年上半年';
    } else if (code == '02') {
      return year + '年下半年';
    }
  }
  return yearCode;
};

const containInArray = function (str, array, key) {
  if (key) {
    for (let i = 0, len = array.length; i < len; i++) {
      if (array[i][key] === str) {
        return true;
      }
    }
    return false;
  } else {
    for (let i = 0, len = array.length; i < len; i++) {
      if (array[i] === str) {
        return true;
      }
    }
    return false;
  }
};
const filterTable = function(row, column, cellValue){
  var defaultVaue = row[column.property] == null ? 0 : row[column.property];
  return defaultVaue;
}
export default {
  filterTable,
  convert,
  xssFliter,
  getQuery,
  dateTimeConvert,
  formateDate,
  mixin,
  getCookie,
  setCookie,
  delCookie,
  trigger,
  deepClone,
  compareAscending, // 升序
  compareDescending, // 降序
  formatLongStr,
  strIsNaN,
  getFirstAndLastDate,
  ssoAuthCode, // 权限认证并sso登陆
  ssoLogout, // 退出
  loadMenuInfo, // 获取菜单
  getOrgData, // 获取登陆账号的组织机构信息
  getPreMonthStartDate, // 获取之前N个月的第一天
  getDelPageNumber, // 删除某条数据后，需要获取哪一页的数据
  getCurrentYear, // 获得当前年费
  formatBusinessSeason, // 业务时间处理为季度
  formatBusinessDate, // 季度处理为业务时间
  formatBusinessYear, // 业务时间处理为上下半年
  handleMenuList, // 菜单排序
  containInArray// 字符串是否包含在数组中
};

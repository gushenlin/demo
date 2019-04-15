/*eslint-disable*/
/**
 *校验模块,提供常用的检验方法
 *该模块不依赖其它环境
 */

const validation = {};
// 校验是否为空
validation.checkNull = function (str) {
  if (str == null || str == undefined || str == '') {
    return true;
  } else {
    return false;
  }
};

// 只能是半角字符
var card = /^[\x00-\xff]*$/;
validation.checkCard = function (str) {
  return card.exec(str);
};

// 中文2-10 位 或者 英文 4-20 位
var name = /[a-zA-Z]{4,20}$|[\u4E00-\u9FA5\uf900-\ufa2d]{2,10}$/;
validation.checkName = function (str) {
  return name.exec(str);
};

// 中文  或者 英文
var names = /[a-zA-Z]{1,20}$|[\u4E00-\u9FA5\uf900-\ufa2d]{1,10}$/;
validation.checkNames = function (str) {
  return names.exec(str);
};

var name2 = /[a-zA-Z0-9.\u4e00-\u9fa5]$/;
validation.checkName2 = function (str) {
  return name2.exec(str);
};
// 中文和英文 5 位
var name3 = /^([a-zA-Z]|[\u4E00-\u9FA5\uf900-\ufa2d]){1,5}$/;
validation.checkName3 = function (str) {
  return name3.exec(str);
};

// 英文,数字
var spellNum = /[a-zA-Z0-9]{1,35}$|[0-9]{1-40}$|[a-zA-Z]{1,35}$/;
validation.checkSpellNum = function (str) {
  return spellNum.exec(str);
};

var spellNum2 = /[a-zA-Z0-9]*$/;
validation.checkSpellNum2 = function (str) {
  return spellNum2.exec(str);
};

// 英文
var spellNum3 = /[a-zA-Z]$/;
validation.checkSpellNum3 = function (str) {
  return spellNum3.exec(str);
};

// 验证 编码  数字,字母,下划线
var patrn = /^([a-zA-Z0-9-]){1,20}$/;
// var patrn = /^([a-zA-Z0-9-]){1,100}$/;
validation.checkCode = function (str) {
  return patrn.exec(str);
};

// 验证 编码  数字,字母,下划线,和 .
var dirpatrn = /^([a-zA-Z0-9-.+_]){1,100}$/;
validation.checkDirCode = function (str) {
  return dirpatrn.exec(str);
};

// 验证 编码  数字,字母,符号.+-
var pattern = /^([a-zA-Z0-9]|[.]|[+]|[-]){1,10}$/;
validation.checkPattern = function (str) {
  return pattern.exec(str);
};

// 验证 编码  20位 数字,字母
var pattern1 = /^[a-zA-Z0-9]{1,20}$/;
validation.checkPattern1 = function (str) {
  return pattern1.exec(str);
};

// 邮箱正则
var REG_EMAIL = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
// 验证邮箱地址
validation.checkEmail = function (str) {
  return REG_EMAIL.exec(str);
};

// 验证国内电话（支持分机号）
var REG_TEL = /^(0[0-9]{2,3}\-)?([1-9][0-9]{4,7})+(\-[0-9]{1,4})?$/;
validation.checkTel = function (str) {
  return REG_TEL.exec(str);
};

// 验证国内手机号
var REG_PHONE = /^(0|86|17951)?(13[0-9]|15[012356789]|18[0236789]|14[57])[0-9]{8}$/;
validation.checkPhone = function (str) {
  return REG_PHONE.exec(str);
};

// 验证整数
var REG_INTEGER = /^-?(([1-9]\d*)|0)$/;
validation.checkInteger = function (str) {
  return REG_INTEGER.exec(str);
};

// 验证整数和小数
var number = /(^[0-9]{1,8}$)|(^[0-9]{1,8}[\.]{1}[0-9]{1,2}$)/;
validation.checkNumber = function (str) {
  return number.exec(str);
};
// /(^[0-9]{1,2}$)|(^[0-9]{1,2}[\.]{1}[0-9]{1,2}$)/

// 验证邮编
var POSTCODE = /[0-9]{6}$/;
validation.checkPOSTCODE = function (str) {
  return POSTCODE.exec(str);
};

// 验证整数
var REG_INTEGER = /^-?(([1-9]\d*)|0)$/;
validation.checkInteger = function (str) {
  return REG_INTEGER.exec(str);
};

// 验证非负数（浮点数默认精确到4位）
validation.checkNonnegative = function (str, digit, decimal) {
  if (!decimal) {
    decimal = 4;
  }
  var REG_NONNEGATIVE = new RegExp('^(([1-9]\\d{0,' + digit + '})|0)(?:\\.\\d{0,' + decimal + '}$|$)?$');
  return REG_NONNEGATIVE.exec(str);
};

// 验证常用用户名（以字母开头，允许5-16字节，允许字母数字下划线）
var REG_USERNAME = /^[a-zA-Z][a-zA-Z0-9_]{4,15}$/;
validation.checkUserName = function (str) {
  return REG_USERNAME.exec(str);
};

// 验证工号 只能是 数字和 英文
var JOB_ID = /[a-zA-Z0-9]{4,15}$/;
validation.checkJOBID = function (str) {
  return JOB_ID.exec(str);
};

// 验证常用密码（允许6-18字节，允许字母数字下划线及特殊字符.@!$%*#）
var REG_PWD = /^([a-zA-Z0-9]|\.|@|\!|\$|%|\*|#){5,17}$/;
validation.checkPwd = function (str) {
  return REG_PWD.exec(str);
};

// 验证常用密码（必须包含字母和数字）
var REG_PWD2 = /^(?![^a-z]+$)(?!\D+$)/;
validation.checkPwd2 = function (str) {
  return REG_PWD2.exec(str);
};

// 验证身份证
//	var REG_IDCARD=/^\d{18}$|^\d{17,18}[A-Za-z]{1}$|^\d{15}$/;
var REG_IDCARD = /^[1-9]\d{5}[1-9]\d{3}((0[1-9])|(1[0-2]))(([0][1-9]|[1|2]\d)|3[0-1])\d{3}([0-9]|X)$/;
validation.checkIDCard = function (str) {
  return REG_IDCARD.exec(str);
};
var aCity = {
  11: '北京',
  12: '天津',
  13: '河北',
  14: '山西',
  15: '内蒙古',
  21: '辽宁',
  22: '吉林',
  23: '黑龙江',
  31: '上海',
  32: '江苏',
  33: '浙江',
  34: '安徽',
  35: '福建',
  36: '江西',
  37: '山东',
  41: '河南',
  42: '湖北',
  43: '湖南',
  44: '广东',
  45: '广西',
  46: '海南',
  50: '重庆',
  51: '四川',
  52: '贵州',
  53: '云南',
  54: '西藏',
  61: '陕西',
  62: '甘肃',
  63: '青海',
  64: '宁夏',
  65: '新疆',
  71: '台湾',
  81: '香港',
  82: '澳门',
  91: '国外',
};

function isCardID (sId) {
  var iSum = 0;
  var info = '';
  if (!/^\d{17}(\d|x)$/i.test(sId)) return '你输入的身份证长度或格式错误';
  sId = sId.replace(/x$/i, 'a');
  if (aCity[parseInt(sId.substr(0, 2))] == null) return '你的身份证地区非法';
  sBirthday = sId.substr(6, 4) + '-' + Number(sId.substr(10, 2)) + '-' + Number(sId.substr(12, 2));
  var d = new Date(sBirthday.replace(/-/g, '/'));
  if (sBirthday != (d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate())) return '身份证上的出生日期非法';
  for (var i = 17; i >= 0; i--) iSum += (Math.pow(2, i) % 11) * parseInt(sId.charAt(17 - i), 11);
  if (iSum % 11 != 1) return '你输入的身份证号非法';
  return true;// aCity[parseInt(sId.substr(0,2))]+","+sBirthday+","+(sId.substr(16,1)%2?"男":"女")
};

// 验证QQ号码
var REG_QQ = /^[1-9][0-9]{4,}$/;
validation.checkQQ = function (str) {
  return REG_QQ.exec(str);
};

// 验证真实姓名
var RealName = /[a-zA-Z]{2,20}$|[\u4E00-\u9FA5\uf900-\ufa2d]{2,18}$/;
validation.checkName = function (str) {
  return RealName.exec(str);
};

// 验证邮政编码
var REG_ZIPCODE = /^[1-9]\d{5}(?!\d)$/;
validation.checkZipCode = function (str) {
  return REG_ZIPCODE.exec(str);
};

// 验证是否包含HTML标记
var REG_HTML = /<(\S*?)[^>]*>.*?<\/\1>|<.*? \/>/;
validation.checkHTML = function (str) {
  return REG_HTML.exec(str);
};

// 验证网址URL
var REG_URL = /^[a-zA-z]+:\/\/[^\s]*$/;
var strRegexs = '^((https|http|ftp|rtsp|mms)?://)' +
  '?(([0-9a-z_!~*\'().&=+$%-]+: )?[0-9a-z_!~*\'().&=+$%-]+@)?' + // ftp的user@
  '(([0-9]{1,3}\.){3}[0-9]{1,3}' + // IP形式的URL- 199.194.52.184
  '|' + // 允许IP和DOMAIN（域名）
  '([0-9a-z_!~*\'()-]+\.)*' + // 域名- www.
  '([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.' + // 二级域名
  '[a-z]{2,6})' + // first level domain- .com or .museum
  '(:[0-9]{1,4})?' + // 端口- :80
  '((/?)|' + // a slash isn't required if there is no file name
  '(/[0-9a-z_!~*\'().;?:@&=+$,%#-]+)+/?)$';
validation.checkURL = function (str) {
  return REG_URL.exec(str);
};
// var URL=/^(http|www|ftp|https|)?(:\/\/)?(\\w+(-\\w+)*)(\\.(\\w+(-\\w+)*))*((:\\d+)?)(\/(\\w+(-\\w+)*))*(\\.?(\\w)*)(\\?)?(((\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*(\\w*%)*(\\w*\\?)*(\\w*:)*(\\w*\\+)*(\\w*\\.)*(\\w*&)*(\\w*-)*(\\w*=)*)*(\\w*)*)$/;

// 验证IP
var REG_IP = /^\d+\.\d+\.\d+\.\d+$/;
validation.checkIP = function (str) {
  return REG_IP.exec(str);
};

// 验证是否包含中文或中文字符
var REG_CHCHAR = /[^\x00-\xff]/;
validation.checkCHChar = function (str) {
  return REG_CHCHAR.exec(str);
};

// 验证VISA卡号
var REG_VISA = /^(4\d{12}(?:\d{3})?)$/;
validation.checkVISA = function (str) {
  return REG_VISA.exec(str);
};

// 验证是否有效日期格式，如2000(./- 年)1(01)(./- 月)1(01)(日)
var REG_DATE = /^(\d{4})(\.|\/|\-|\s|\u5E74)?(\d{1,2})(\.|\/|\-|\s|\u6708)?(\d{1,2})(\s|\u65E5)?$/;
validation.checkDate = function (str) {
  str = str.replace(REG_DATE, function () {
    return RegExp.$1 + '-' + (RegExp.$3.length == 1 ? '0' + RegExp.$3 : RegExp.$3) + '-' + (RegExp.$5.length == 1 ? '0' + RegExp.$5 : RegExp.$5);
  });
  return String(new Date(str)).toLowerCase() != 'invalid date';
};

// 验证是否有效时间格式，如23：59：59
var REG_TIME = /^(([0-1][0-9])|(2[0-3]))(:|：|\s)([0-5][0-9])(:|：|\s)([0-5][0-9])$/;
validation.checkTime = function (str) {
  str = str.replace(/^(\d+).*?(\d+).*?(\d+)$/, function () {
    return (RegExp.$1.length == 1 ? '0' + RegExp.$1 : RegExp.$1) + ':' + (RegExp.$2.length == 1 ? '0' + RegExp.$2 : RegExp.$2) + ':' + (RegExp.$3.length == 1 ? '0' + RegExp.$3 : RegExp.$3);
  });
  return REG_TIME.test(str);
};

// 验证科室编码 只能是 数字、英文 - 1-30位
var DEPARTMENT_CODE = /^[a-zA-Z0-9-.]{1,30}$/;
validation.checkDEPARTMENT_CODE = function (str) {
  return DEPARTMENT_CODE.exec(str);
};
// 验证科室编码 只能是 数字、英文 - 1-10位
var DISEASE_CODE = /^[a-zA-Z0-9-.]{1,10}$/;
validation.checkDISEASE_CODE = function (str) {
  return DISEASE_CODE.exec(str);
};

// 验证通用字典编码 只能是 数字、英文 - 1-10位
var GENERAL_CODE = /^[a-zA-Z0-9-.]{1,10}$/;
validation.checkGENERAL_CODE = function (str) {
  return GENERAL_CODE.exec(str);
};

// 验证药品代码 最大长度为20位数字,字母,-
var MEDICINE_CODE = /^[a-zA-Z0-9-]{1,20}$/;
validation.check_MEDICINE_CODE = function (str) {
  return MEDICINE_CODE.exec(str);
};

// 转换系数 最大长度为3位数字
var CONVERSION_RATIO_CODE = /^[0-9]{1,3}$/;
validation.check_CONVERSION_RATIO = function (str) {
  return CONVERSION_RATIO_CODE.exec(str);
};
// 英文名 最大长度为100位字母 空格
var CONVERSION_ENGLISH_NAME = /^[a-zA-Z ]{1,100}$/;
validation.check_ENGLISH_NAME = function (str) {
  return CONVERSION_ENGLISH_NAME.exec(str);
};

export default validation;

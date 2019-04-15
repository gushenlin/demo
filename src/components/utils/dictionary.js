/** dictionary utils */
import axios from 'axios';

const dictionaryCache = new Map();

// 病种情况统计中的类型visitType
dictionaryCache.set('VISUALIZATION_SELECT_TYPE', [
  {'code': '0', 'desc': '处方统计'},
  {'code': '1', 'desc': '药店处方'}
  // {'code': '2', 'desc': '处方药品'}
]);

// 平台端
// 医院管理 医院级别列表 hospitalLevelList
dictionaryCache.set('H_LEVEL', [
  {'code': '三级甲等', 'desc': '三级甲等'},
  {'code': '三级乙等', 'desc': '三级乙等'},
  {'code': '二级甲等', 'desc': '二级甲等'},
  {'code': '二级乙等', 'desc': '二级乙等'},
  {'code': '一级', 'desc': '一级'}
]);

// 异步获取的字典使用Promise

// 组织机构----健康档案中用的这个获取
const getOrgList = () => {
  return new Promise((resolve, reject) => {
    if (sessionStorage.getItem('ORGDATA') && sessionStorage.getItem('ORGDATA').length > 0) {
      resolve(JSON.parse(sessionStorage.getItem('ORGDATA')));
    } else {
      axios.get('/BIReport/hospitalServerController/getOrg.do').then((response) => {
        if (response.data.success && response.data.data) {
          let itemCache = [];
          for (let i = 0, len = response.data.data.length; i < len; i++) {
            if (response.data.data[i].ORG_NAME === '全部') {
              itemCache.unshift({'code': response.data.data[i].ORG_CODE, 'desc': response.data.data[i].ORG_NAME});
            } else {
              itemCache.push({'code': response.data.data[i].ORG_CODE, 'desc': response.data.data[i].ORG_NAME});
            }
          }
          sessionStorage.setItem('ORGDATA', JSON.stringify(itemCache));
          resolve(itemCache);
        }
      }).catch((error) => {
        reject(error);
      });
    }
  });
};

// 区域获取

const getRegionValue = () => {
  return new Promise((resolve, reject) => {
    this.userLogin = JSON.parse(sessionStorage.getItem('CURR_USER_PRESCRIPTION_SUPERVISE')).userLogin;
    this.token = this.userLogin.data;
    let provinceCode = JSON.parse(sessionStorage.getItem('userInfo')).provinceCode;
    let cityCode = JSON.parse(sessionStorage.getItem('userInfo')).cityCode;
    if (!provinceCode) {
      resolve(JSON.parse(sessionStorage.getItem('userInfo')));
    } else {
      axios({
        method: 'get',
        headers: {'Authorization': this.token},
        url: '/peps/management/regional/queryRegional?t=' + (+new Date()),
        params: {
          'areaLevel': 2,
          'parentcode': cityCode
        }
      }).then(function (response) {
        let data = response.data;
        if (data.code == 0) {
          let itemCache = [];
          for (let i = 0, len = data.data.length; i < len; i++) {
            itemCache.push({'code': data.data[i].countyCode, 'desc': data.data[i].countyName});
          }
          itemCache.unshift({'code': '', 'desc': '全市'});
          sessionStorage.setItem('REGION', JSON.stringify(itemCache));
          resolve(itemCache);
        }
        resolve(data);
      }).catch(function (error) {
        reject(error);
        console.log(error);
      });
    }
  });
};

export default {
  options: (categoryCode) => {
    return dictionaryCache.get(categoryCode);
  },
  getOrgList,
  getRegionValue
};

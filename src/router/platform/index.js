// 用户管理 模块
const platformUser = r => require.ensure([], () => r(require('packages/platform/platformUser')), 'platformUser');
// 监管机构管理
const platformOrganization = r => require.ensure([], () => r(require('packages/platform/platformOrganization')), 'platformOrganization');
// 药企管理
const platformDrug = r => require.ensure([], () => r(require('packages/platform/platformDrug')), 'platformDrug');

const platformHospital = r => require.ensure([], () => r(require('packages/platform/platformHospital')), 'platformHospital');

const routes = [
  {
    path: '/platformUser',
    name: 'platformUser',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '用户管理',
      flag: 'platformUser',
      belongToGroup: ''
    },
    component: platformUser
  }, {
    path: '/platformOrganization',
    name: 'platformOrganization',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '监管机构管理',
      flag: 'platformOrganization',
      belongToGroup: ''
    },
    component: platformOrganization
  }, {
    path: '/platformDrug',
    name: 'platformDrug',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '药企管理',
      flag: 'platformDrug',
      belongToGroup: ''
    },
    component: platformDrug
  }, {
    path: '/platformHospital',
    name: 'platformHospital',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医院管理',
      flag: 'platformHospital',
      belongToGroup: ''
    },
    component: platformHospital
  }
];

export default routes;

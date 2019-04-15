/* 药店端 */

// 处方取药
// 快捷取药 quickMedicine
const quickMedicine = r => require.ensure([], () => r(require('packages/pharmacy/quickMedicine')), 'quickMedicine');
const quickMedicineDetail = r => require.ensure([], () => r(require('packages/pharmacy/quickMedicineDetail')), 'quickMedicineDetail');

// 药品管理
// 医院药品目录 hospitalDrugDirectory
const hospitalDrugDirectory = r => require.ensure([], () => r(require('packages/pharmacy/hospitalDrugDirectory')), 'hospitalDrugDirectory');
// 药店通用目录
const drugstoreDirectory = r => require.ensure([], () => r(require('packages/pharmacy/drugstoreDirectory')), 'drugstoreDirectory');
// 药品对照 drugContrast
const drugContrast = r => require.ensure([], () => r(require('packages/pharmacy/drugContrast')), 'drugContrast');

// 处方管理
// 历史处方查询 historyPrescription
const historyPrescription = r => require.ensure([], () => r(require('packages/pharmacy/historyPrescription')), 'historyPrescription');
const historyPrescriptionDetail = r => require.ensure([], () => r(require('packages/pharmacy/historyPrescriptionDetail')), 'historyPrescriptionDetail');

// 数据统计
// 外延处方统计 extensionPrescription
const extensionPrescription = r => require.ensure([], () => r(require('packages/pharmacy/extensionPrescription')), 'extensionPrescription');
const extensionPrescriptionList = r => require.ensure([], () => r(require('packages/pharmacy/extensionPrescriptionList')), 'extensionPrescriptionList');
const extensionPrescriptionDetail = r => require.ensure([], () => r(require('packages/pharmacy/extensionPrescriptionDetail')), 'extensionPrescriptionDetail');
// 医生处方统计 doctorPrescription
const doctorPrescription = r => require.ensure([], () => r(require('packages/pharmacy/doctorPrescription')), 'doctorPrescription');
const doctorPrescriptionList = r => require.ensure([], () => r(require('packages/pharmacy/doctorPrescriptionList')), 'doctorPrescriptionList');
const doctorPrescriptionDetail = r => require.ensure([], () => r(require('packages/pharmacy/doctorPrescriptionDetail')), 'doctorPrescriptionDetail');

// 系统管理
// 用户管理 drugUser
const drugUser = r => require.ensure([], () => r(require('packages/pharmacy/drugUser')), 'drugUser');
// 角色管理 drugRole
const drugRole = r => require.ensure([], () => r(require('packages/pharmacy/drugRole')), 'drugRole');
// 药店管理 drugPharmacy
const drugPharmacy = r => require.ensure([], () => r(require('packages/pharmacy/drugPharmacy')), 'drugPharmacy');

const routes = [

  {
    path: '/hospitalDrugDirectory',
    name: 'hospitalDrugDirectory',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医院药品目录',
      flag: 'hospitalDrugDirectory',
      belongToGroup: 'pharmacy'
    },
    component: hospitalDrugDirectory
  },
  {
    path: '/drugstoreDirectory',
    name: 'drugstoreDirectory',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '药店通用目录',
      flag: 'drugstoreDirectory',
      belongToGroup: 'pharmacy'
    },
    component: drugstoreDirectory
  },
  {
    path: '/drugContrast',
    name: 'drugContrast',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '药品对照',
      flag: 'drugContrast',
      belongToGroup: 'pharmacy'
    },
    component: drugContrast
  },

  {
    path: '/historyPrescription',
    name: 'historyPrescription',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '历史处方查询',
      flag: 'historyPrescription',
      belongToGroup: 'pharmacy'
    },
    component: historyPrescription
  },
  {
    path: '/historyPrescriptionDetail',
    name: 'historyPrescriptionDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '历史处方查询',
      flag: 'historyPrescription',
      belongToGroup: 'pharmacy'
    },
    component: historyPrescriptionDetail
  },
  {
    path: '/quickMedicine',
    name: 'quickMedicine',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '快捷取药',
      flag: 'quickMedicine',
      belongToGroup: 'pharmacy'
    },
    component: quickMedicine
  },
  {
    path: '/quickMedicineDetail',
    name: 'quickMedicineDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '快捷取药',
      flag: 'quickMedicine',
      belongToGroup: 'pharmacy'
    },
    component: quickMedicineDetail
  },

  {
    path: '/extensionPrescription',
    name: 'extensionPrescription',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'extensionPrescription',
      belongToGroup: 'pharmacy'
    },
    component: extensionPrescription
  },
  {
    path: '/extensionPrescriptionDetail',
    name: 'extensionPrescriptionDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'extensionPrescription',
      belongToGroup: 'pharmacy'
    },
    component: extensionPrescriptionDetail
  },
  {
    path: '/extensionPrescriptionList',
    name: 'extensionPrescriptionList',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'extensionPrescription',
      belongToGroup: 'pharmacy'
    },
    component: extensionPrescriptionList
  },
  {
    path: '/doctorPrescription',
    name: 'doctorPrescription',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'doctorPrescription',
      belongToGroup: 'pharmacy'
    },
    component: doctorPrescription
  },
  {
    path: '/doctorPrescriptionDetail',
    name: 'doctorPrescriptionDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'doctorPrescription',
      belongToGroup: 'pharmacy'
    },
    component: doctorPrescriptionDetail
  },
  {
    path: '/doctorPrescriptionList',
    name: 'doctorPrescriptionList',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'doctorPrescription',
      belongToGroup: 'pharmacy'
    },
    component: doctorPrescriptionList
  },

  {
    path: '/drugUser',
    name: 'drugUser',
    meta: {
      requireAuth: true,
      isKeepAlive: false,
      txt: '用户管理',
      flag: 'drugUser',
      belongToGroup: 'pharmacy'
    },
    component: drugUser
  },
  {
    path: '/drugRole',
    name: 'drugRole',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '角色管理',
      flag: 'drugRole',
      belongToGroup: 'pharmacy'
    },
    component: drugRole
  },
  {
    path: '/drugPharmacy',
    name: 'drugPharmacy',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '药店管理',
      flag: 'drugPharmacy',
      belongToGroup: 'pharmacy'
    },
    component: drugPharmacy
  }

];

export default routes;

/* 医院端 */
// 基础信息维护：医生登记、药品目录
// 医生登记doctorRegistration
const doctorRegistration = r => require.ensure([], () => r(require('packages/hospital/doctorRegistration')), 'doctorRegistration');
// 药品目录drugCatalogue
const drugCatalogue = r => require.ensure([], () => r(require('packages/hospital/drugCatalogue')), 'drugCatalogue');
// 科室管理
const departmentMgt = r => require.ensure([], () => r(require('packages/hospital/departmentMgt')), 'departmentMgt');
// 处方管理：历史处方查询
// 历史处方查询hosHistoricalPrescription
const hosHistoricalPrescription = r => require.ensure([], () => r(require('packages/hospital/hosHistoricalPrescription')), 'hosHistoricalPrescription');
const hosHistoricalPrescriptionDetail = r => require.ensure([], () => r(require('packages/hospital/hosHistoricalPrescriptionDetail')), 'hosHistoricalPrescriptionDetail');
// 数据统计：外延处方统计、医生处方统计
// 外延处方统计eitaxyPrescription
const eitaxyPrescription = r => require.ensure([], () => r(require('packages/hospital/eitaxyPrescription')), 'eitaxyPrescription');
const eitaxyPrescriptionDetail = r => require.ensure([], () => r(require('packages/hospital/eitaxyPrescriptionDetail')), 'eitaxyPrescriptionDetail');
const eitaxyPrescriptionList = r => require.ensure([], () => r(require('packages/hospital/eitaxyPrescriptionList')), 'eitaxyPrescriptionList');
// 医生处方统计prescriptionStatistics
const prescriptionStatistics = r => require.ensure([], () => r(require('packages/hospital/prescriptionStatistics')), 'prescriptionStatistics');
const prescriptionStatisticsDetail = r => require.ensure([], () => r(require('packages/hospital/prescriptionStatisticsDetail')), 'prescriptionStatisticsDetail');
const prescriptionStatisticsList = r => require.ensure([], () => r(require('packages/hospital/prescriptionStatisticsList')), 'prescriptionStatisticsList');

const routes = [
  {
    path: '/doctorRegistration',
    name: 'doctorRegistration',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生登记',
      flag: 'doctorRegistration',
      belongToGroup: ''
    },
    component: doctorRegistration
  },
  {
    path: '/departmentMgt',
    name: 'departmentMgt',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '科室管理',
      flag: 'departmentMgt',
      belongToGroup: ''
    },
    component: departmentMgt
  },
  {
    path: '/drugCatalogue',
    name: 'drugCatalogue',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '药品目录',
      flag: 'drugCatalogue',
      belongToGroup: ''
    },
    component: drugCatalogue
  },
  {
    path: '/eitaxyPrescription',
    name: 'eitaxyPrescription',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'eitaxyPrescription',
      belongToGroup: ''
    },
    component: eitaxyPrescription
  },
  {
    path: '/eitaxyPrescriptionDetail',
    name: 'eitaxyPrescriptionDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'eitaxyPrescription',
      belongToGroup: ''
    },
    component: eitaxyPrescriptionDetail
  },
  {
    path: '/eitaxyPrescriptionList',
    name: 'eitaxyPrescriptionList',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '外延处方统计',
      flag: 'eitaxyPrescription',
      belongToGroup: ''
    },
    component: eitaxyPrescriptionList
  },
  {
    path: '/hosHistoricalPrescription',
    name: 'hosHistoricalPrescription',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '历史处方查询',
      flag: 'hosHistoricalPrescription',
      belongToGroup: ''
    },
    component: hosHistoricalPrescription
  },
  {
    path: '/hosHistoricalPrescriptionDetail',
    name: 'hosHistoricalPrescriptionDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '历史处方查询',
      flag: 'hosHistoricalPrescription',
      belongToGroup: ''
    },
    component: hosHistoricalPrescriptionDetail
  },
  {
    path: '/prescriptionStatistics',
    name: 'prescriptionStatistics',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'prescriptionStatistics',
      belongToGroup: ''
    },
    component: prescriptionStatistics
  },
  {
    path: '/prescriptionStatisticsDetail',
    name: 'prescriptionStatisticsDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'prescriptionStatistics',
      belongToGroup: ''
    },
    component: prescriptionStatisticsDetail
  },
  {
    path: '/prescriptionStatisticsList',
    name: 'prescriptionStatisticsList',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '医生处方统计',
      flag: 'prescriptionStatistics',
      belongToGroup: ''
    },
    component: prescriptionStatisticsList
  }
];

export default routes;

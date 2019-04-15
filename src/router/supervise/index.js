// 平台业务监管
const visualizationIndex = r => require.ensure([], () => r(require('packages/supervise/visualizationIndex')), 'visualizationIndex');
// 实时处方监管（处方总览）
const prescriptionOverviewIndex = r => require.ensure([], () => r(require('packages/supervise/prescriptionOverviewIndex')), 'prescriptionOverviewIndex');
// 接入机构监管
const hospitalStatisticsIndex = r => require.ensure([], () => r(require('packages/supervise/hospitalStatisticsIndex')), 'hospitalStatisticsIndex');
// 注册医生监管
const doctorStatisticsIndex = r => require.ensure([], () => r(require('packages/supervise/doctorStatisticsIndex')), 'doctorStatisticsIndex');
// 处方患者监管
const patientsStatisticsIndex = r => require.ensure([], () => r(require('packages/supervise/patientsStatisticsIndex')), 'patientsStatisticsIndex');
// 处方药店监管
const pharmacyStatisticsIndex = r => require.ensure([], () => r(require('packages/supervise/pharmacyStatisticsIndex')), 'pharmacyStatisticsIndex');

// 处方列表
const prescriptionList = r => require.ensure([], () => r(require('packages/supervise/prescriptionList')), 'prescriptionList');
const prescriptionListDetail = r => require.ensure([], () => r(require('packages/supervise/prescriptionListDetail')), 'prescriptionListDetail');
// const prescriptionDrugIndex = r => require.ensure([], () => r(require('packages/supervise/prescriptionDrugIndex')), 'prescriptionDrugIndex');

const routes = [
  {
    path: '/visualizationIndex',
    name: '/visualizationIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '平台业务监管',
      flag: 'visualizationIndex',
      belongToGroup: ''
    },
    component: visualizationIndex
  },
  {
    path: '/hospitalStatisticsIndex',
    name: 'hospitalStatisticsIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '接入机构监管',
      flag: 'hospitalStatisticsIndex',
      belongToGroup: ''
    },
    component: hospitalStatisticsIndex
  },
  {
    path: '/doctorStatisticsIndex',
    name: 'doctorStatisticsIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '注册医生监管',
      flag: 'doctorStatisticsIndex',
      belongToGroup: ''
    },
    component: doctorStatisticsIndex
  },
  {
    path: '/patientsStatisticsIndex',
    name: 'patientsStatisticsIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '处方患者监管',
      flag: 'patientsStatisticsIndex',
      belongToGroup: ''
    },
    component: patientsStatisticsIndex
  },
  {
    path: '/pharmacyStatisticsIndex',
    name: 'pharmacyStatisticsIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '处方药店监管',
      flag: 'pharmacyStatisticsIndex',
      belongToGroup: ''
    },
    component: pharmacyStatisticsIndex
  },
  {
    path: '/prescriptionOverviewIndex',
    name: 'prescriptionOverviewIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '实时处方监管',
      flag: 'prescriptionOverviewIndex',
      belongToGroup: ''
    },
    component: prescriptionOverviewIndex
  },
  {
    path: '/prescriptionList',
    name: 'prescriptionList',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '实时处方监管',
      flag: 'prescriptionList',
      belongToGroup: ''
    },
    component: prescriptionList
  },
  {
    path: '/prescriptionListDetail',
    name: 'prescriptionListDetail',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '实时处方监管',
      flag: 'prescriptionListDetail',
      belongToGroup: ''
    },
    component: prescriptionListDetail
  }
  // {
  //   path: '/prescriptionDrugIndex',
  //   name: '/prescriptionDrugIndex',
  //   meta: {
  //     requireAuth: true,
  //     isKeepAlive: true,
  //     txt: 'aaa',
  //     flag: 'prescriptionDrugIndex',
  //     belongToGroup: ''
  //   },
  //   component: prescriptionDrugIndex
  // }
];

export default routes;

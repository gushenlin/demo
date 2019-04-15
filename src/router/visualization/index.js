// XXXX业务监管（可视化管理平台总览）
const visualizationIndex = r => require.ensure([], () => r(require('packages/visualization/visualizationIndex')), 'visualizationIndex');
// 接入机构监管（医院机构统计）
const hospitalStatisticsIndex = r => require.ensure([], () => r(require('packages/visualization/hospitalStatisticsIndex')), 'hospitalStatisticsIndex');
// 注册医生监管（注册医生统计）
const doctorStatisticsIndex = r => require.ensure([], () => r(require('packages/visualization/doctorStatisticsIndex')), 'doctorStatisticsIndex');
// 处方患者监管（处方患者统计）
const patientsStatisticsIndex = r => require.ensure([], () => r(require('packages/visualization/patientsStatisticsIndex')), 'patientsStatisticsIndex');
// 处方药店监管（处方药店统计）
const pharmacyStatisticsIndex = r => require.ensure([], () => r(require('packages/visualization/pharmacyStatisticsIndex')), 'pharmacyStatisticsIndex');
// 处方药品监管（处方药品统计）
const prescriptionDrugIndex = r => require.ensure([], () => r(require('packages/visualization/prescriptionDrugIndex')), 'prescriptionDrugIndex');

const routes = [
  {
    path: '/visualizationIndex',
    name: 'visualizationIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: 'XXXX业务监管',
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
    path: '/prescriptionDrugIndex',
    name: 'prescriptionDrugIndex',
    meta: {
      requireAuth: true,
      isKeepAlive: true,
      txt: '处方药品监管',
      flag: 'prescriptionDrugIndex',
      belongToGroup: ''
    },
    component: prescriptionDrugIndex
  }];

export default routes;

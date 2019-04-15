// 首页
// 子路由
import hospital from './hospital';
import pharmacy from './pharmacy';
import platform from './platform';
import supervise from './supervise';

const index = r => require.ensure([], () => r(require('packages/index/index')), 'index');
// 404
const notFind = r => require.ensure([], () => r(require('packages/index/not-find')), 'notFind');

const routes = [
  {
    path: '/index',
    name: 'index',
    meta: {
      requireAuth: true,
      txt: '首页',
      flag: 'index',
      belongToGroup: ''
    },
    component: index
  },
  {
    path: '/',
    name: '/',
    meta: {
      requireAuth: true,
      txt: '/',
      flag: '/',
      belongToGroup: ''
    },
    component: index
  },
  {
    path: '*',
    name: 'notFind',
    meta: {
      requireAuth: true,
      txt: '找不到页面',
      flag: 'notFind',
      belongToGroup: ''
    },
    component: notFind
  }];

const route = routes.concat(hospital, pharmacy, platform, supervise);
export default route;

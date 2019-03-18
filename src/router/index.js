import Vue from 'vue';
import Router from 'vue-router';
import systemRoute from '../components';
import { version } from 'moment';

var Employee = systemRoute.Employee,
    Dept = systemRoute.Dept,
    Role = systemRoute.Role,
    BusinessDictionary = systemRoute.BusinessDictionary,
    CategoryManagement = systemRoute.CategoryManagement;
    Version = systemRoute.Version;
    Attendance = systemRoute.Attendance;

var getPage = function getPage(path) {
  return function () {
    return import('../views/' + path + '.vue');
  };
};

// 布局组件
var Layout = function Layout() {
  return import('../components/dev/layout.vue');
};
// 登陆组件
var Login = function Login() {
  return import('../components/dev/login');
};

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'a-system 装修管理'
    }
  }, {
    path: '/',
    component: Layout,
    children: [Employee, Dept, Role, BusinessDictionary, CategoryManagement,Version,Attendance, {
      path: "lab",
      component: getPage('lab/index'),
      meta: { title: '测试', icon: 'setthe', parent: '测试', code: 'housejoin_system' }
    }]
  }, {
    path: '*', // 如果找不到页面跳转到404
    redirect: '/'
  }]
});
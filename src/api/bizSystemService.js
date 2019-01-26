import _defineProperty from 'babel-runtime/helpers/defineProperty';

var _getUserDetail$getUse;

/**
 * @author 吴森
 * @description bizSystemService的url
 * @date 2018/7/7
 * @host 8011
 */
import { Api } from 'see-web-basic';
// import { baseURL } from '../../static/IPconfig'
var baseURL = window.g.ApiUrl;
var apiURL = {

  /**
   * @description  角色
   */

  //获取部门树列表
  getDeptList: '/rmdept/treeList',
  //获取某部门信息
  getDeptInfo: '/rmdept/info/',
  // 删除部门
  delDept: '/rmdept/delete',
  // 新增部门
  addDept: '/rmdept/save',
  // 更新部门
  updateDept: '/rmdept/update',
  //获取部门下的人员
  getEmployeePop: '/rmdept/getEmployeesByDeptId',
  // 获取当前用户可操作的系统/平台列表
  getsyslist: '/rmuserrole/syslist',
  //获取部门下的人员
  getRoleType: '/rmrole/roleTypeList',

  /**
   * @description  员工
   */

  //获取员工树列表
  getEmployeeList: '/rmemployee/list',
  //获取员工信息
  getEmployeeInfo: '/rmemployee/info/',
  // 删除员工
  delEmployee: '/rmemployee/delete',
  // 新增员工
  addEmployee: '/rmemployee/save',
  // 同步员工
  syncEmployee: '/rmemployee/synchronization',
  // 更新员工
  updateEmployee: '/rmemployee/update',
  // 恢复员工
  employeeRecover: '/rmemployee/recover',
  // 解锁
  unlockuser: '/rmemployee/unlockuser',
  // 锁定
  lockuser: '/rmemployee/lockuser',
  // 修改密码
  updatePassword: '/rmemployee/updatePassword',

  /**
  * @description  角色
  */

  //获取角色列表
  getRoleList: '/rmrole/list',
  //获取授权角色列表
  getAuthRoleList: '/rmrole/sourceRoleList',
  // 删除角色
  delRole: '/rmrole/delete',
  // 新增角色
  addRole: '/rmrole/save',
  // 更新角色
  updateRole: '/rmrole/update',
  // 给角色授权
  syncRole: '/rmrole/updateRoleResource'
};

export default (_getUserDetail$getUse = {
  /**
  * @description  用户
  */
  // 获取用户详情
  getUserDetail: function getUserDetail(params) {
    return Api.get(baseURL.bizSystemService + '/rmuserrole/getUserDetail', params);
  },

  // 获取用户权限
  getUserAuth: function getUserAuth(params) {
    return Api.get(baseURL.bizSystemService + '/rmuserrole/list/' + params);
  },

  /**
  * @description  部门
  */
  getDeptList: function getDeptList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getDeptList, params);
  },
  getDeptInfo: function getDeptInfo(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getDeptInfo + params);
  },
  delDept: function delDept(params) {
    return Api.del(baseURL.bizSystemService + apiURL.delDept, params);
  },
  addDept: function addDept(params) {
    return Api.post(baseURL.bizSystemService + apiURL.addDept, params);
  },
  updateDept: function updateDept(params) {
    return Api.post(baseURL.bizSystemService + apiURL.updateDept, params);
  },
  getEmployeePop: function getEmployeePop(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getEmployeePop, params);
  },
  getsyslist: function getsyslist(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getsyslist, params);
  },
  getRoleType: function getRoleType(params) {
    return Api.get(baseURL.bizSystemService + '/rmrole/roleTypeList', params);
  },

  /**
  * @description  员工
  */

  getEmployeeList: function getEmployeeList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getEmployeeList, params);
  },
  getEmployeeInfo: function getEmployeeInfo(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getEmployeeInfo + params);
  },
  delEmployee: function delEmployee(params) {
    return Api.del(baseURL.bizSystemService + apiURL.delEmployee, params);
  },
  authEmployee: function authEmployee(params) {
    return Api.post(baseURL.bizSystemService + '/rmemployee/newAuthorize', params);
  },
  addEmployee: function addEmployee(params) {
    return Api.post(baseURL.bizSystemService + apiURL.addEmployee, params);
  },
  syncEmployee: function syncEmployee(params) {
    return Api.post(baseURL.bizSystemService + apiURL.syncEmployee, params);
  },
  updateEmployee: function updateEmployee(params) {
    return Api.post(baseURL.bizSystemService + apiURL.updateEmployee, params);
  },
  employeeRecover: function employeeRecover(params) {
    return Api.post(baseURL.bizSystemService + apiURL.employeeRecover + '?phone=' + params.phone);
  },
  unlockuser: function unlockuser(params) {
    return Api.get(baseURL.bizSystemService + apiURL.unlockuser, params);
  },
  lockuser: function lockuser(params) {
    return Api.get(baseURL.bizSystemService + apiURL.lockuser, params);
  },
  updatePassword: function updatePassword(params) {
    return Api.post(baseURL.bizSystemService + apiURL.updatePassword, params);
  },

  //开放注册
  openRegistration: function openRegistration(params) {
    return Api.post(baseURL.bizSystemService + '/rmemployee/openRegistration', params);
  },
  //查询开放注册
  queryOpenRegistration: function queryOpenRegistration(params) {
    return Api.get(baseURL.bizSystemService + '/rmemployee/queryOpenRegistration', params);
  },

  /**
  * @description  角色
  */

  getRoleList: function getRoleList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getRoleList, params);
  },
  getAuthRoleList: function getAuthRoleList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getAuthRoleList, params);
  },
  /**
  * @description  版本更新
  */
  // 获取更新列表
  getVersionList(params) {
    return Api.get(baseURL.bizSystemService + '/versionupdating/list', params)
  },

}, _defineProperty(_getUserDetail$getUse, 'getRoleList', function getRoleList(params) {
  return Api.get(baseURL.bizSystemService + apiURL.getRoleList, params);
}), _defineProperty(_getUserDetail$getUse, 'delRole', function delRole(params) {
  return Api.del(baseURL.bizSystemService + apiURL.delRole, params);
}), _defineProperty(_getUserDetail$getUse, 'addRole', function addRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.addRole, params);
}), _defineProperty(_getUserDetail$getUse, 'updateRole', function updateRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.updateRole, params);
}), _defineProperty(_getUserDetail$getUse, 'syncRole', function syncRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.syncRole, params);
}), _defineProperty(_getUserDetail$getUse, 'getInfoRmDataAuth', function getInfoRmDataAuth(params) {
  return Api.get(baseURL.bizSystemService + '/rmdataauth/info', params);
}), _defineProperty(_getUserDetail$getUse, 'saveRmDataAuth', function saveRmDataAuth(params) {
  return Api.post(baseURL.bizSystemService + '/rmdataauth/save', params);
}), _defineProperty(_getUserDetail$getUse, 'getAllEmployees', function getAllEmployees(params) {
  return Api.get(baseURL.bizSystemService + '/rmemployee/getAllEmployees', params);
}), _defineProperty(_getUserDetail$getUse, 'getOrganaList', function getOrganaList(params) {
  return Api.get(baseURL.bizSystemService + '/rmorgtype/orgTypeTreeList', params);
}), _defineProperty(_getUserDetail$getUse, 'saveOrgType', function saveOrgType(params) {
  return Api.post(baseURL.bizSystemService + '/rmorgtype/save', params);
}), _defineProperty(_getUserDetail$getUse, 'updateOrgType', function updateOrgType(params) {
  return Api.post(baseURL.bizSystemService + '/rmorgtype/update', params);
}), _defineProperty(_getUserDetail$getUse, 'delOrgType', function delOrgType(params) {
  return Api.del(baseURL.bizSystemService + '/rmorgtype/delete', params);
}), _defineProperty(_getUserDetail$getUse, 'getNotReadMsg', function getNotReadMsg(params) {
  return Api.get(baseURL.bizSystemService + '/message/getNotReadMsg', params);
}), _defineProperty(_getUserDetail$getUse, 'getMsgList', function getMsgList(params) {
  return Api.get(baseURL.bizSystemService + '/message/list', params);
}), _defineProperty(_getUserDetail$getUse, 'sendMsg', function sendMsg(params) {
  return Api.post(baseURL.bizSystemService + '/message/sendMsg', params);
}), _defineProperty(_getUserDetail$getUse, 'updateMsg', function updateMsg(params) {
  return Api.post(baseURL.bizSystemService + '/message/updateMsg', params);
}), _getUserDetail$getUse);

function newFunction(params) {
  return Api.get(baseURL.codingService + apiURL.getRoleList, params);
}

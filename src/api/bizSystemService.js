import _defineProperty2 from 'babel-runtime/helpers/defineProperty';

var _getUserDetail$getUse;

import _defineProperty from 'babel-runtime/helpers/defineProperty';

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

  /**
   * @description  员工
   */
  //获取员工树列表
  fetchEmployeeList: '/rmemployee/employeeList',
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
  // 获取部门树列表
  getDeptList: function getDeptList(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/treeList', params);
  },

  // 获取固定人员下部门树列表
  getChildrenDept: function getChildrenDept(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/getChildrenDept', params);
  },


  //获取某部门信息
  getDeptInfo: function getDeptInfo(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/info/' + params);
  },

  // 删除部门
  delDept: function delDept(params) {
    return Api.del(baseURL.bizSystemService + '/rmdept/delete', params);
  },

  // 新增部门
  addDept: function addDept(params) {
    return Api.post(baseURL.bizSystemService + '/rmdept/save', params);
  },

  // 更新部门
  updateDept: function updateDept(params) {
    return Api.post(baseURL.bizSystemService + '/rmdept/update', params);
  },

  //获取部门下的人员
  getEmployeePop: function getEmployeePop(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/getEmployeesByDeptId', params);
  },

  // 获取当前用户可操作的系统/平台列表
  getsyslist: function getsyslist(params) {
    return Api.get(baseURL.bizSystemService + '/rmuserrole/syslist', params);
  },
  getRoleType: function getRoleType(params) {
    return Api.get(baseURL.bizSystemService + '/rmrole/roleTypeList', params);
  },

  // 根据一组部门id查询部门信息
  getDeptListDyDeptIds: function getDeptListDyDeptIds(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/deptList', params);
  },


  /**
  * @description  员工
  */
  //获取部门下的员工
  getEmployeesUserByDeptId: function getEmployeesUserByDeptId(params) {
    return Api.get(baseURL.bizSystemService + '/rmdept/getEmployeesUserByDeptId', params);
  },
  fetchEmployeeList: function fetchEmployeeList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.fetchEmployeeList, params);
  },
  getEmployeeList: function getEmployeeList(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getEmployeeList, params);
  },
  getEmployeeInfo: function getEmployeeInfo(params) {
    return Api.get(baseURL.bizSystemService + apiURL.getEmployeeInfo + params);
  },

  // 获取用户详情
  getEmployeeDetail: function getEmployeeDetail(params) {
    return Api.get(baseURL.bizSystemService + '/rmemployee/getUserDetail', params);
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
  lockuser (params) {
    return Api.get(baseURL.bizSystemService + apiURL.lockuser, params);
  },
  updatePassword (params) {
    return Api.post(baseURL.bizSystemService + apiURL.updatePassword, params);
  },

  //开放注册
  openRegistration (params) {
    return Api.post(baseURL.bizSystemService + '/rmemployee/openRegistration', params);
  },

  //查询开放注册
  queryOpenRegistration (params) {
    return Api.get(baseURL.bizSystemService + '/rmemployee/queryOpenRegistration', params);
  },

  // 根据一组用户ID查询用户信息
  getEmpListByUserIds (params) {
    return Api.get(baseURL.bizSystemService + '/rmemployee/empList', params);
  },
  // 批量保存数据权限
  rmdataauthBatchSave (params) {
    return Api.post(baseURL.bizSystemService + '/rmdataauth/batchSave', params)
  },
  // 查看自定义数据权限详细信息
  rmdataauthDataInfo (params) {
    return Api.get(baseURL.bizSystemService + '/rmdataauth/dataInfo', params)
  },
  // 下载中心列表
  downloadList (params) {
    return Api.get(baseURL.bizSystemService + '/download/list', params)
  },
  // 下载中心删除
  downloadDelete (params) {
    return Api.del(baseURL.bizSystemService + '/download/delete', params)
  },
  // 下载中心编辑
  downloadEdit (params) {
    return Api.post(baseURL.bizSystemService + '/download/edit', params)
  },
  // 下载中心编辑
  downloadDownloadFile (params) {
    return Api.get(baseURL.bizSystemService + '/download/downloadFile'+ params)
  },


  /**
  * @description  人员调动记录
  */
  // 保存人员调动记录
  saveTransfer(params) {
    return Api.post(baseURL.bizSystemService + '/rmemployeeransferrecord/save', params);
  }

}, _defineProperty2(_getUserDetail$getUse, 'saveTransfer', function saveTransfer(params) {
  return Api.post(baseURL.bizSystemService + '/rmemployeeransferrecord/save', params);
}), _defineProperty2(_getUserDetail$getUse, 'getTransferLog', function getTransferLog(params) {
  return Api.get(baseURL.bizSystemService + '/rmemployeeransferrecord/list', params);
}), _defineProperty2(_getUserDetail$getUse, 'getTransferDetail', function getTransferDetail(params) {
  return Api.get(baseURL.bizSystemService + '/rmemployeeransferrecord/detailInfo/' + params);
}), _defineProperty2(_getUserDetail$getUse, 'getRoleList', function getRoleList(params) {
  return Api.get(baseURL.bizSystemService + '/rmrole/list', params);
}), _defineProperty2(_getUserDetail$getUse, 'getAuthRoleList', function getAuthRoleList(params) {
  return Api.get(baseURL.bizSystemService + apiURL.getAuthRoleList, params);
}), _defineProperty2(_getUserDetail$getUse, 'delRole', function delRole(params) {
  return Api.del(baseURL.bizSystemService + apiURL.delRole, params);
}), _defineProperty2(_getUserDetail$getUse, 'addRole', function addRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.addRole, params);
}), _defineProperty2(_getUserDetail$getUse, 'updateRole', function updateRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.updateRole, params);
}), _defineProperty2(_getUserDetail$getUse, 'syncRole', function syncRole(params) {
  return Api.post(baseURL.bizSystemService + apiURL.syncRole, params);
}), _defineProperty2(_getUserDetail$getUse, 'getInfoRmDataAuth', function getInfoRmDataAuth(params) {
  return Api.get(baseURL.bizSystemService + '/rmdataauth/info', params);
}), _defineProperty2(_getUserDetail$getUse, 'saveRmDataAuth', function saveRmDataAuth(params) {
  return Api.post(baseURL.bizSystemService + '/rmdataauth/save', params);
}), _defineProperty2(_getUserDetail$getUse, 'getAllEmployees', function getAllEmployees(params) {
  return Api.get(baseURL.bizSystemService + '/rmemployee/getAllEmployees', params);
}), _defineProperty2(_getUserDetail$getUse, 'getOrganaList', function getOrganaList(params) {
  return Api.get(baseURL.bizSystemService + '/rmorgtype/orgTypeTreeList', params);
}), _defineProperty2(_getUserDetail$getUse, 'saveOrgType', function saveOrgType(params) {
  return Api.post(baseURL.bizSystemService + '/rmorgtype/save', params);
}), _defineProperty2(_getUserDetail$getUse, 'updateOrgType', function updateOrgType(params) {
  return Api.post(baseURL.bizSystemService + '/rmorgtype/update', params);
}), _defineProperty2(_getUserDetail$getUse, 'delOrgType', function delOrgType(params) {
  return Api.del(baseURL.bizSystemService + '/rmorgtype/delete', params);
}), _defineProperty2(_getUserDetail$getUse, 'getNotReadMsg', function getNotReadMsg(params) {
  return Api.get(baseURL.bizSystemService + '/message/getNotReadMsg', params);
}), _defineProperty2(_getUserDetail$getUse, 'getMsgList', function getMsgList(params) {
  return Api.get(baseURL.bizSystemService + '/message/list', params);
}), _defineProperty2(_getUserDetail$getUse, 'sendMsg', function sendMsg(params) {
  return Api.post(baseURL.bizSystemService + '/message/sendMsg', params);
}), _defineProperty2(_getUserDetail$getUse, 'updateMsg', function updateMsg(params) {
  return Api.post(baseURL.bizSystemService + '/message/updateMsg', params, { isShowMessage: false });
}), _defineProperty2(_getUserDetail$getUse, 'transmitMsg', function transmitMsg(params) {
  return Api.post(baseURL.bizSystemService + '/message/transmit', params);
}), _defineProperty2(_getUserDetail$getUse, 'clearMsg', function clearMsg(params) {
  return Api.get(baseURL.bizSystemService + '/message/clear', params);
}), _defineProperty2(_getUserDetail$getUse, 'delMsg', function delMsg(params) {
  return Api.del(baseURL.bizSystemService + '/message/delete', params);
}), _defineProperty2(_getUserDetail$getUse, 'getRecentlyRemind', function getRecentlyRemind(params) {
  return Api.get(baseURL.bizSystemService + '/message/getRecentlyRemind', params);
}), _defineProperty2(_getUserDetail$getUse, 'getFilterInfo', function getFilterInfo(params) {
  return Api.get(baseURL.bizSystemService + '/rmpagequerycondition/info', params);
}), _defineProperty2(_getUserDetail$getUse, 'saveFilter', function saveFilter(params) {
  return Api.post(baseURL.bizSystemService + '/rmpagequerycondition/save', params);
}), _getUserDetail$getUse);
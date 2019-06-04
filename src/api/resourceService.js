/**
 * @author 吴森
 * @description resourceService的url
 * @date 2018/7/7
 * @host 8013
 */

import { Api } from 'see-web-basic';
var baseURL = window.g.ApiUrl;

export default {
  /**
  * @description 数据权限 数据源
  */
  getDataSourceList: function getDataSourceList(params) {
    return Api.get(baseURL.resourceService + '/dataauthPageDataSource/listBySyscode', params);
  },
  getDataSourcePageList: function getDataSourcePageList(params) {
    return Api.get(baseURL.resourceService + '/dataauthPageDataSource/page', params);
  },


  /**
  * @description 数据权限 字段明细
  */

  //获取数据权限字段源列表
  getAuthFieldList: function getAuthFieldList(params) {
    return Api.get(baseURL.resourceService + '/dataauthField/list', params);
  },


  //数据源权限字段分页列表
  getAuthFieldPageList: function getAuthFieldPageList(params) {
    return Api.get(baseURL.resourceService + '/dataauthField/page', params);
  },


  /**
   * @desc 数据权限 角色管理 默认角色
   */

  //获取角色列表
  getDefaultRoleList: function getDefaultRoleList(params) {
    return Api.get(baseURL.resourceService + '/rmdefaultrole/defaultRoleList', params);
  },

  //获取默认角色默认数据权限详情
  getDefaultRoleInfo: function getDefaultRoleInfo(params) {
    return Api.get(baseURL.resourceService + '/rmdataauth/info', params);
  }
};
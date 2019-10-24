/*
 * @Author: web.王晓冬
 * @Date: 2019-07-12 15:26:00
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-24 17:56:11
 * @Description: 9013
 */
import { Api } from 'see-web-basic';
let baseURL = window.g && window.g.ApiUrl?window.g.ApiUrl : {}
if(!baseURL.resourceService){
    try{
        baseURL.resourceService = apisUrl + 'resource-service'
    }
    catch(err){
        baseURL.resourceService = '/apis/' + 'resource-service'
    }
}

export default {
  /**
  * @description 数据权限 数据源
  */
  getDataSourceList(params) {
    return Api.get(baseURL.resourceService + '/dataauthPageDataSource/listBySyscode', params);
  },
  getDataSourcePageList(params) {
    return Api.get(baseURL.resourceService + '/dataauthPageDataSource/page', params);
  },
  // 查看自定义数据权限详细信息
  rmdataauthDataInfo (params) {
    return Api.get(baseURL.resourceService + '/rmdataauth/dataInfo', params)
  },

  //获取当前公司套餐内所有限制操作的最大值
  getAllSourceMaxNum(params) {
    return Api.get(baseURL.resourceService + '/set/getAllSourceMaxNum', params)
  },


  /**
  * @description 数据权限 字段明细
  */

  //获取数据权限字段源列表
  getAuthFieldList(params) {
    return Api.get(baseURL.resourceService + '/dataauthField/list', params);
  },


  //数据源权限字段分页列表
  getAuthFieldPageList(params) {
    return Api.get(baseURL.resourceService + '/dataauthField/page', params);
  },


  /**
   * @desc 数据权限 角色管理 默认角色
   */

  //获取角色列表
  getDefaultRoleList(params) {
    return Api.get(baseURL.resourceService + '/rmdefaultrole/defaultRoleList', params);
  },

  //获取默认角色默认数据权限详情
  getDefaultRoleInfo(params) {
    return Api.get(baseURL.resourceService + '/rmdataauth/info', params);
  },
  dataauthPageDataSourceListAndFieldsBySyscode (params) {
    return Api.get(baseURL.resourceService + '/dataauthPageDataSource/listAndFieldsBySyscode', params)
  }
};
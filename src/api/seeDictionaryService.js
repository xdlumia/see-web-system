/*
 * @Author: web.王晓冬
 * @Date: 2019-05-14 18:07:48
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-24 17:58:19
 * @Description: file content
 */
import { Api } from 'see-web-basic';
let baseURL = window.g && window.g.ApiUrl?window.g.ApiUrl : {}
if(!baseURL.seeDataDictionaryService){
    try{
        baseURL.seeDataDictionaryService = apisUrl + 'see-data-dictionary-service'
    }
    catch(err){
        baseURL.seeDataDictionaryService = '/apis/' + 'see-data-dictionary-service'
    }
}

var apiURL = {
  /**
   * @description  业务字典管理
   */

  // 获取标签管理列表
  getDictionaryList: '/dictionary/list',
  // 获取标签值列表
  getDictionaryValueList: '/dictionary/valueList',
  // 删除标签
  delDictionary: '/dictionary/delete/',
  // 编辑标签
  editDictionary: '/dictionary/edit',

  /**
   * @description  数据字典公共接口
   */
  // 查询字典值详情
  getDicCommonInfo: '/dicCommon/info/',
  // 根据数据字典code查询值列表
  getDicCommonValueList: '/dicCommon/valueList/'
};

export default {
  /**
   * @description  业务字典
   */

  getDictionaryList: function getDictionaryList(params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDictionaryList, params);
  },
  getDictionaryValueList: function getDictionaryValueList(params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDictionaryValueList, params);
  },
  delDictionary: function delDictionary(params) {
    return Api.del(baseURL.seeDataDictionaryService + apiURL.delDictionary + params);
  },
  editDictionary: function editDictionary(params) {
    return Api.post(baseURL.seeDataDictionaryService + apiURL.editDictionary, params);
  },

  /**
   * @description  数据字典公共接口
   */
  getDicCommonInfo: function getDicCommonInfo(params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDicCommonInfo + params);
  },
  getDicCommonValueList: function getDicCommonValueList(params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDicCommonValueList + params);
  },
  getDictionaryValueTreeList: function(params) {
    return Api.get(baseURL.seeDataDictionaryService + '/dictionary/valueTreeList' , params);
  },
};
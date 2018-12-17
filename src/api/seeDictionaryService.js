import {Api} from 'see-web-basic'
let baseURL = window.g.ApiUrl

const apiURL = {
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
}

export default {
  /**
   * @description  业务字典
   */

  getDictionaryList (params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDictionaryList, params)
  },
  getDictionaryValueList (params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDictionaryValueList, params)
  },
  delDictionary (params) {
    return Api.del(baseURL.seeDataDictionaryService + apiURL.delDictionary + params)
  },
  editDictionary (params) {
    return Api.post(baseURL.seeDataDictionaryService + apiURL.editDictionary, params)
  },
  /**
   * @description  数据字典公共接口
   */
  getDicCommonInfo (params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDicCommonInfo + params)
  },
  getDicCommonValueList (params) {
    return Api.get(baseURL.seeDataDictionaryService + apiURL.getDicCommonValueList + params)
  }
}

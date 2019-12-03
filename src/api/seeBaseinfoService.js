/*
 * @Author: web.王晓冬
 * @Date: 2019-11-05 17:30:22
 * @LastEditors: 赵伦
 * @LastEditTime: 2019-12-03 17:49:50
 * @Description: file content
 */
/**
 * @author 王晓冬
 * @description seeBaseinfoService的url
 * @date 2019/5/31
 * @host 8301
 */

const MOCK_ADDRESS = '/mock/5d02f94b167fff36ccf077c6/seeBaseinfoService'
let _isMock = false
export default {
  __mockAddress: MOCK_ADDRESS,
  /* =============个人或者公司的默认城市设置start=========== */
  // 获得当前用户的默认城市
  cfgcitysettingGetDefaultCity: {
    'url': '/cfgcitysetting/getDefaultCity',
    'mock': _isMock
  },

  // 获取列表
  cfgcitysettingList: {
    'url': '/cfgcitysetting/list',
    'mock': _isMock
  },

  // 切换城市
  cfgcitysettingSave: {
    'url': '/cfgcitysetting/save',
    'mock': _isMock,
    'methods': 'post'
  },
  /* =============个人或者公司的默认城市设置end=========== */

  /* =============业务设置公共start=========== */
  // 获取城市列表
  commonGetAllCity: {
    'url': '/common/getAllCity',
    'mock': _isMock
  },

  // 获取区域列表
  commonGetArea: {
    'url': '/common/getArea',
    'mock': _isMock
  },

  // 根据区域ID获取城市ID
  commonGetCityIdByAreaId: {
    'url': '/common/getCityIdByAreaId',
    'mock': _isMock
  },

  // 根据区域ID获取城市名称
  commonGetCityNameByAreaId: {
    'url': '/common/getCityNameByAreaId',
    'mock': _isMock
  },

  // 获取省份列表
  commonGetProvinces: {
    'url': '/common/getProvinces',
    'mock': _isMock
  },
  /* =============业务设置公共end=========== */

  /* =============客户管理对外接口提供start=========== */
  // 获取区域列表
  customerGetArea: {
    'url': '/customer/getArea',
    'mock': _isMock
  },
  /* =============客户管理对外接口提供end=========== */

  /* =============企业Logo图片start=========== */
  // 新增/修改企业LOGO
  logoEditCompanyLogo: {
    'url': '/logo/editCompanyLogo',
    'mock': _isMock,
    'methods': 'post'
  },

  // 获取企业LOGO
  logoGetCompanyLogo: {
    'url': '/logo/getCompanyLogo/{sysCode}',
    'mock': _isMock
  },
  /* =============企业Logo图片end=========== */

  /* =============业务设置图片start=========== */
  // 获取图片配置列表
  picGetPicConfig: {
    'url': '/pic/getPicConfig',
    'mock': _isMock
  },

  // 获取单个图片配置信息
  picGetSinglePicConfig: {
    'url': '/pic/getSinglePicConfig',
    'mock': _isMock
  },

  // 恢复默认值
  picRecoverDefaultValue: {
    'url': '/pic/recoverDefaultValue',
    'mock': _isMock,
    'methods': 'post'
  },

  // 修改图片配置
  picUpdatePicConfig: {
    'url': '/pic/updatePicConfig',
    'mock': _isMock,
    'methods': 'post'
  },
  /* =============业务设置图片end=========== */

  /* =============文件压缩下载（日志和配置文件）start=========== */
  // 根据端口号压缩并下载指定类型文件
  runlogCompressAndDownload: {
    'url': '/ws/runlog/compressAndDownload',
    'mock': _isMock
  },
  /**
     * @description  企业设置
     */
  // 保存logo
  saveCompanyLogo: {
    url: '/logo/editCompanyLogo',
    methods: 'post'
  },
  // 获取用户权限
  getCompanyLogo: {
    url: '/logo/getCompanyLogo/{sysCode}'
  },
  /* =============文件压缩下载（日志和配置文件）end=========== */


  /* =============公司设置表start=========== */
  // 删除
  commoncorporationDelete: {
    'url': '/commoncorporation/delete',
    'mock': _isMock,
    'methods': 'delete'
  },

  // 查看详细信息
  commoncorporationInfo: {
    'url': '/commoncorporation/info/{id}',
    'mock': _isMock
  },

  // 获取列表
  commoncorporationList: {
    'url': '/commoncorporation/list',
    'mock': _isMock
  },

  // 逻辑删除
  commoncorporationLogicDelete: {
    'url': '/commoncorporation/logicDelete',
    'mock': _isMock,
    'methods': 'delete'
  },

  // 保存
  commoncorporationSave: {
    'url': '/commoncorporation/save',
    'mock': _isMock,
    'methods': 'post'
  },

  // 修改
  commoncorporationUpdate: {
    'url': '/commoncorporation/update',
    'mock': _isMock,
    'methods': 'post'
  },
  // 选择公司账号
  commoncorporationSelect: {
    'url': '/commoncorporation/select',
    'mock': _isMock,
    'methods': 'get'
  },
  // 选择公司发票账户和结算账户
  commoncorporationSelectForJxc: {
    'url': '/commoncorporation/selectForJxc',
    'mock': _isMock,
    'methods': 'get'
  },
  /* =============公司设置表end=========== */

  /* =============公司账户设置表start=========== */
  // 删除
  commoncorporationaccountDelete: {
    'url': '/commoncorporationaccount/delete',
    'mock': _isMock,
    'methods': 'delete'
  },

  // 查看详细信息
  commoncorporationaccountInfo: {
    'url': '/commoncorporationaccount/info/{id}',
    'mock': _isMock
  },

  // 获取列表
  commoncorporationaccountList: {
    'url': '/commoncorporationaccount/list',
    'mock': _isMock
  },

  // 逻辑删除
  commoncorporationaccountLogicDelete: {
    'url': '/commoncorporationaccount/logicDelete',
    'mock': _isMock,
    'methods': 'delete'
  },

  // 保存
  commoncorporationaccountSave: {
    'url': '/commoncorporationaccount/save',
    'mock': _isMock,
    'methods': 'post'
  },
  /**
   * @tag 公司账号设置
   * @description 启用禁用
   */
  commoncorporationUpdateState: {
      url: '/commoncorporation/updateState',
      methods: 'post',
      mock: false
  },

  // 修改
  commoncorporationaccountUpdate: {
    'url': '/commoncorporationaccount/update',
    'mock': _isMock,
    'methods': 'post'
  },
  // 获取公司账号
  getCompanyAccountList: {
    url: "/commoncorporation/select"
  },
  /* =============公司账户设置表end=========== */
  /* =============表单管理start=========== */
  // 获取表单列表
  formList: {
    'url': '/form/list/{catagoryCode}',
    'mock': false
  },

  // 获取表单相关所有信息
  formQueryCatagoryCodeForm: {
    'url': '/form/queryCatagoryCodeForm',
    'mock': false
  },
  /* =============表单管理end=========== */

  /* =============字段列表管理start=========== */
  // 删除字段
  formfieldsDeleteFormFields: {
    'url': '/formfields/deleteFormFields',
    'mock': false,
    'methods': 'delete'
  },

  // 获取表单全部字段列表
  formfieldsList: {
    'url': '/formfields/list/{formId}',
    'mock': false
  },

  // 获取表单全部字段列表
  formfieldsQueryFieldsByForm: {
    'url': '/formfields/queryFieldsByForm/{formCode}',
    'mock': false
  },

  // 根据表单id,获取类型分组字段列表
  formfieldsQueryFieldsTypeList: {
    'url': '/formfields/queryFieldsTypeList',
    'mock': false
  },

  // 添加字段
  formfieldsSaveFormFields: {
    'url': '/formfields/saveFormFields',
    'mock': false,
    'methods': 'post'
  },
  /* =============字段列表管理end=========== */

  /* =============模板管理start=========== */
  // 复制
  templateCopy: {
    'url': '/template/copy/{id}',
    'mock': false
  },

  // 删除
  templateDelete: {
    'url': '/template/delete',
    'mock': false,
    'methods': 'delete'
  },

  // 查看详细信息
  templateInfo: {
    'url': '/template/info/{id}',
    'mock': false
  },

  // 模板列表
  templateList: {
    'url': '/template/list/{formId}',
    'mock': false
  },

  // 保存
  templateSave: {
    'url': '/template/save',
    'mock': false,
    'methods': 'post'
  },

  // 修改
  templateUpdate: {
    'url': '/template/update',
    'mock': false,
    'methods': 'post'
  },

  // 查看自定义字段
  templateUserfields: {
    'url': '/template/userfields/{id}',
    'mock': false
  },
  /* =============模板管理end=========== */

  /* =============模板分类管理start=========== */
  // 删除模板类别
  templatecategoryDelete: {
    'url': '/templatecategory/delete',
    'mock': false,
    'methods': 'delete'
  },

  // 获取模板分类列表
  templatecategoryList: {
    'url': '/templatecategory/list',
    'mock': false
  },

  // 保存模板类别
  templatecategorySave: {
    'url': '/templatecategory/save',
    'mock': false,
    'methods': 'post'
  },
  /* =============模板分类管理end=========== */

  /* =============服务健康检查start=========== */
  // 检查服务健康状况
  healthCheck: {
    'url': '/ws/health/check',
    'mock': false
  },
  /* =============服务健康检查end=========== */
}
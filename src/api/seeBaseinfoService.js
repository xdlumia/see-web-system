const MOCK_ADDRESS = '/mock/5d02f94b167fff36ccf077c6/seeBaseinfoService'

// 8301 
export default {
  __mockAddress: MOCK_ADDRESS,
  /* =============个人或者公司的默认城市设置start=========== */
  // 获得当前用户的默认城市
  cfgcitysettingGetDefaultCity: {
    'url': '/cfgcitysetting/getDefaultCity',
    'mock': false
  },

  // 获取列表
  cfgcitysettingList: {
    'url': '/cfgcitysetting/list',
    'mock': false
  },

  // 切换城市
  cfgcitysettingSave: {
    'url': '/cfgcitysetting/save',
    'mock': false,
    'methods': 'post'
  },
  /* =============个人或者公司的默认城市设置end=========== */

  /* =============业务设置公共start=========== */
  // 获取城市列表
  commonGetAllCity: {
    'url': '/common/getAllCity',
    'mock': false
  },

  // 获取省_市/直辖市_区的二级列表全数据
  commonGetAllProvinceCityAreas: {
    'url': '/common/getAllProvinceCityAreas',
    'mock': false
  },

  // 获取区域列表
  commonGetArea: {
    'url': '/common/getArea',
    'mock': false
  },

  // 根据区域ID获取城市ID
  commonGetCityIdByAreaId: {
    'url': '/common/getCityIdByAreaId',
    'mock': false
  },

  // 根据区域ID获取城市名称
  commonGetCityNameByAreaId: {
    'url': '/common/getCityNameByAreaId',
    'mock': false
  },

  // 获取省份列表
  commonGetProvinces: {
    'url': '/common/getProvinces',
    'mock': false
  },
  /* =============业务设置公共end=========== */

  /* =============公司账号设置start=========== */
  // 删除
  commoncorporationDelete: {
    'url': '/commoncorporation/delete',
    'mock': false,
    'methods': 'delete'
  },

  // 查看详细信息
  commoncorporationInfo: {
    'url': '/commoncorporation/info/{id}',
    'mock': false
  },

  // 获取列表
  commoncorporationList: {
    'url': '/commoncorporation/list',
    'mock': false
  },

  // 逻辑删除
  commoncorporationLogicDelete: {
    'url': '/commoncorporation/logicDelete',
    'mock': false,
    'methods': 'delete'
  },

  // 保存
  commoncorporationSave: {
    'url': '/commoncorporation/save',
    'mock': false,
    'methods': 'post'
  },

  // 选择公司账号
  commoncorporationSelect: {
    'url': '/commoncorporation/select',
    'mock': false
  },

  // 选择公司发票账户和结算账户
  commoncorporationSelectForJxc: {
    'url': '/commoncorporation/selectForJxc',
    'mock': false
  },

  // 修改
  commoncorporationUpdate: {
    'url': '/commoncorporation/update',
    'mock': false,
    'methods': 'post'
  },
  /* =============公司账号设置end=========== */

  /* =============客户管理对外接口提供start=========== */
  // 获取区域列表
  customerGetArea: {
    'url': '/customer/getArea',
    'mock': false
  },
  /* =============客户管理对外接口提供end=========== */

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

  /* =============企业Logo图片start=========== */
  // 新增/修改企业LOGO
  logoEditCompanyLogo: {
    'url': '/logo/editCompanyLogo',
    'mock': false,
    'methods': 'post'
  },

  // 获取企业LOGO
  logoGetCompanyLogo: {
    'url': '/logo/getCompanyLogo/{sysCode}',
    'mock': false
  },
  /* =============企业Logo图片end=========== */

  /* =============业务设置图片start=========== */
  // 获取图片配置列表
  picGetPicConfig: {
    'url': '/pic/getPicConfig',
    'mock': false
  },

  // 获取单个图片配置信息
  picGetSinglePicConfig: {
    'url': '/pic/getSinglePicConfig',
    'mock': false
  },

  // 恢复默认值
  picRecoverDefaultValue: {
    'url': '/pic/recoverDefaultValue',
    'mock': false,
    'methods': 'post'
  },

  // 修改图片配置
  picUpdatePicConfig: {
    'url': '/pic/updatePicConfig',
    'mock': false,
    'methods': 'post'
  },
  /* =============业务设置图片end=========== */

  /* =============RocketMQ失败重试start=========== */
  // 重试失败消息
  rocketMQRetryFailedMessage: {
    'url': '/rocketMQ/retryFailedMessage/{className}',
    'mock': false,
    'methods': 'post'
  },
  /* =============RocketMQ失败重试end=========== */

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

  /* =============文件压缩下载（日志和配置文件）start=========== */
  // 根据端口号压缩并下载指定类型文件
  runlogCompressAndDownload: {
    'url': '/ws/runlog/compressAndDownload',
    'mock': false
  }
  /* =============文件压缩下载（日志和配置文件）end=========== */
}
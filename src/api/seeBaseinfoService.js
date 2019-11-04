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

  // 修改
  commoncorporationaccountUpdate: {
    'url': '/commoncorporationaccount/update',
    'mock': _isMock,
    'methods': 'post'
  },
  /* =============公司账户设置表end=========== */
}
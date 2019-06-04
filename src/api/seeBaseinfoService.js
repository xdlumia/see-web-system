/**
 * @author 王晓冬
 * @description seeBaseinfoService的url
 * @date 2019/5/31
 * @host 8301
 */

export default {
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
  }
}

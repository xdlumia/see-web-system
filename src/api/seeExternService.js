/**
 * @author 吴森
 * @description  see-extern-service 的url
 * @date 2018/7/10
 * @host 9024
 */

import {Api} from 'see-web-basic'
let baseURL = window.g.ApiUrl

const apiURL = {
  /**
   * @description  获取oss凭证信息
   */

  getOssTicket: '/oss/getOssTicket'
}




export default {
   /**
   * @description  获取oss凭证信息
   */

  getOssTicket () {
    return Api.get(baseURL.seeExternService + apiURL.getOssTicket)
  },
    //发送短信
  getSendVerifyCode(params) {
    return Api.get(baseURL.seeExternService + '/sms/sendVerifyCode' , params)
  },
  //短信验证
  getChecVerifyCodek(params) {
    return Api.get(baseURL.seeExternService + '/sms/checVerifyCodek' , params)
  }, 
}


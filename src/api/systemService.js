/**
 * @author 王晓冬
 * @description systemService的url
 * @date 2019/1/11
 * @host 9011
 */

import {Api} from 'see-web-basic'
let baseURL = window.g.ApiUrl


export default {
   /**
   * @description 业务平台
   */
    //  登录
    login (params) {
        return Api.post(baseURL.systemService + '/login/businessLogin', params,{isShowMessage:false})
    },
    //  登录
    getUserInfo (params) {
        return Api.get(baseURL.systemService + '/rmUser/userInfo', params)
    },
    updatePassword(params) {
        return Api.post(baseURL.systemService + '/rmUser/updateUserPwdAfterLogin', params)
    },

    /**
    * @description 业务平台
    */

    //  版本更新提醒
    versionRemind (params) {
        return Api.get(baseURL.systemService + '/versionupdating/remind', params,{isShowMessage:false})
    },

    /**
    * @description 考勤管理
    */

    // 获取考勤列表
    getLoginfoList (params) {
        return Api.get(baseURL.systemService + '/rmuserloginfo/list', params,)
    },
    // 获取考勤统计
    getLoginStats (params) {
        return Api.get(baseURL.systemService + '/rmuserloginfo/count', params,)
    },

}

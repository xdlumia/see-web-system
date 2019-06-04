/**
 * @author 王晓冬
 * @description systemService的url
 * @date 2019/1/11
 * @host 9011
 */

import { Api } from 'see-web-basic';
var baseURL = window.g.ApiUrl;

export default {
    /**
    * @description 业务平台
    */
    //  登录
    login: function login(params) {
        return Api.post(baseURL.systemService + '/login/businessLogin', params, { isShowMessage: false });
    },

    //  登录
    getUserInfo: function getUserInfo(params) {
        return Api.get(baseURL.systemService + '/rmUser/userInfo', params);
    },
    updatePassword: function updatePassword(params) {
        return Api.post(baseURL.systemService + '/rmUser/updateUserPwdAfterLogin', params);
    },

    //  登出
    logout: function logout(params) {
        return Api.get(baseURL.systemService + '/login/logout', params, { isShowMessage: false });
    },


    /**
    * @description 业务平台
    */

    //  版本更新提醒
    versionRemind: function versionRemind(params) {
        return Api.get(baseURL.systemService + '/versionupdating/remind', params, { isShowMessage: false });
    },


    /**
    * @description 考勤管理
    */

    // 获取考勤列表
    getLoginfoList: function getLoginfoList(params) {
        return Api.get(baseURL.systemService + '/rmuserloginfo/list', params);
    },

    // 获取考勤统计
    getLoginStats: function getLoginStats(params) {
        return Api.get(baseURL.systemService + '/rmuserloginfo/count', params);
    }
};
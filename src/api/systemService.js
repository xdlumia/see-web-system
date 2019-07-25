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
    },
    //获取公共token
    getPublicToken(params) {
        return Api.post(baseURL.systemService + '/ws/reqtoken', params, { isShowMessage: false });
    },
    //企业注册
    companyRegister(params) {
        return Api.post(baseURL.systemService + '/register/companyRegister', params);
    },
    //根据用户登录账号判断所在公司是否初始化
    getJudgeUserIsInit(params) {
        return Api.get(baseURL.systemService + '/register/judgeUserIsInit/'+ params);
    },
    // 会员中心充值记录
    rmpaymentrecordPayList(params) {
        return Api.get(baseURL.systemService + '/rmpaymentrecord/payList/', params);
    },
    // 企业支付信息接口
    companyGetCompanyResources(params) {
        return Api.get(baseURL.systemService + '/company/getCompanyResources/'+ params);
    },
    // 根据子系统编码查询充值套餐和套餐项目列表
    rmpaysetPaySetList(params) {
        return Api.get(baseURL.systemService + '/rmpayset/paySetList/'+ params);
    },

    
    //获取意见反馈列表
    getRmsuggestList(params) {
        return Api.get(baseURL.systemService + '/rmsuggestfeedbacktype/list' + params);
    },
    
    //保存反馈记录
    rmsuggestFeedBackRecord(params) {
        return Api.post(baseURL.systemService + '/rmsuggestfeedbackrecord/save', params);
    },
};
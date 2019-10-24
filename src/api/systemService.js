/*
 * @Author: web.王晓冬
 * @Date: 2019-08-05 15:49:47
 * @LastEditors: web.王晓冬
 * @LastEditTime: 2019-10-24 17:59:03
 * @Description: 9011
 */

import { Api } from 'see-web-basic';
let baseURL = window.g && window.g.ApiUrl?window.g.ApiUrl : {}
if(!baseURL.systemService){
    try{
        baseURL.systemService = apisUrl + 'system-service'
    }
    catch(err){
        baseURL.systemService = '/apis/' + 'system-service'
    }
}

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
    // 支付-for业务系统支付入口
    rmpaymentrecordPay(params) {
        return Api.post(baseURL.systemService + '/rmpaymentrecord/pay/', params);
    },

    
    //获取意见反馈列表
    getRmsuggestList(params) {
        return Api.get(baseURL.systemService + '/rmsuggestfeedbacktype/list/' + params);
    },
    
    //保存反馈记录
    rmsuggestFeedBackRecord(params) {
        return Api.post(baseURL.systemService + '/rmsuggestfeedbackrecord/save', params);
    },
     //查看sass平台设置的各种图片  （login_type 登录/注册 vip_center 会员中心 auth_setting 权限设置 guide_setting 引导图）
     getRmpicset(params) {
        return Api.get(baseURL.systemService + '/rmpicset/list', params);
    },
    
    //生成通讯签名
    getCreateSignature(params) {
        return Api.get(baseURL.systemService + '/rmmessage/createSignature', params);
    },
    
    //判断该菜单权限的引导图是否第一次访问
    getjudgeFirst(params) {
        return Api.get(baseURL.systemService + '/rmguidepicrecord/judgeFirst', params);
    },
    
    //重置引导图
    rmguidepicrecordReset(params) {
        return Api.post(baseURL.systemService + '/rmguidepicrecord/reset', params);
    },
    //获取sass所有客服
    getAdminList(params) {
        return Api.get(baseURL.systemService + '/admin/customerList', params);
    },
    //获取支付成功信息
    rmpaymentsuccessinfoInfo(params) {
        return Api.get(baseURL.systemService + '/rmpaymentsuccessinfo/info/' + params);
    }
};
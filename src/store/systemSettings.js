import api from 'see-web-basic/dist/api/index';
import local from 'see-web-basic/dist/utils/localStorage';

const store = {
    namespaced: true,
    state: {
        // 权限设置图片，目前用户阿尔法免费版权限弹框图片
        authSettingPic: '',
    },
    mutations: {
        // 设置权限设置图片
        setAuthSettingPic(state, pic) {
            state.authSettingPic = pic
        },
    },
    actions: {
        // 从接口获取权限设置图片
        async getAuthSettingPic({ state, commit }) {
            if (!state.authSettingPic) {
                let params = {
                    page: 1,
                    limit: 10,
                    type: 'auth_setting',
                    sysCode: local.fetch('userInfo') ? local.fetch('userInfo').syscode : 'asystem',
                }
                let { data } = await api.systemService.getRmpicset(params)
                let authPic = data[0] ? data[0].picUrl : ''
                commit('setAuthSettingPic', authPic);
            }
        }
    },
    getters: {
        systemCode(){
            let userInfo = local.fetch('userInfo')
            return userInfo?userInfo.syscode:''
        }
    }
}

export default store
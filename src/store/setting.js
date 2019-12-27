const store = {
  namespaced: true,
  state: {
    /**
    * @desc 设置里的用户信息
    * @author web-王晓冬
    **/
    userInfo:{},
  },
  mutations: {
    setUserInfo(state,obj){
      state.userInfo = JSON.parse(JSON.stringify(obj))
      // state.userInfo = obj
    },
  },
}

export default store

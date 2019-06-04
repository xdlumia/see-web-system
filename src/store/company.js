const store = {
  namespaced: true,
  state: {
    /**
    * @desc 公司信息
    * @author web-王晓冬
    **/
    companyInfo:{

    },
  },
  mutations: {
    companyInfo(state,companyObj){
      console.log(companyObj)
      state.companyInfo = companyObj
    },
  },
}

export default store

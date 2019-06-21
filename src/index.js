import './api';
import systemRoute from './components/';
import storeModules from './store/';
// 替换路由组件或增加
let systemRouteConfig = function(router,newComps=[]){
    if(arguments.length !==2 || !(arguments[1] instanceof Array)){
      console.error('systemRouteConfig方法必须传两个参数,第二个参数必须是数组')
      return false
    }
    let defaultSlot = router.component.defaultSlot // 默认组件
    let slotName = defaultSlot.map(item => item.componentName) // 获取默认的组件名称
    newComps.forEach((item) => {
      // 根据componentName 判断是否重复的名称
      let index = slotName.indexOf(item.componentName) //获取当前添加路由的下标
      if (index !== -1) {
        // 如果有相同的名称替换新的组件
        for(let key in defaultSlot[index] ){
          defaultSlot[index][key] = item[key] || defaultSlot[index][key]
        }
        router.component.components[item.componentName] = item.component
      } 
      else {
        if (!item.authorityCode || !item.label) {
          console.error(`businessSetting里${item.componentName}如果是新添加组件lable和authorityCode是必填项`)
        }
        defaultSlot.push(item)
      }
      router.component.components[item.componentName] = item.component
    })
    defaultSlot.sort((a, b) => a.sort - b.sort)
}
var systemStoreConfig = {
  install: function install(Vue) {
    Vue.mixin({
      beforeCreate: function beforeCreate() {
        var options = this.$options;
        // store injection
        if (options.store) {
          for (var module in storeModules) {
            options.store.registerModule(module, storeModules[module]);
          }
        }
      }
    });
  }
};

export { 
  // 供外部直接调用的,自定义字典
  systemRoute, systemStoreConfig ,systemRouteConfig
}
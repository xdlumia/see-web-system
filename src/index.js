/*
 * @Author: web.王晓冬
 * @Date: 2019-06-21 11:15:23
 * @LastEditors  : web.王晓冬
 * @LastEditTime : 2019-12-30 09:37:16
 * @Description: file content
 */
import './api';
import systemRoute from './components/';
import storeModules from './store/';
// 公共文件 暂未使用 后期可能需要 从经销存 front-psiweb 里 src/views/setting/覆盖当前
// import personalSetting from './components/settings/personal-setting'; // 个人设置
// import attendance from './components/settings/attendance'; // 考勤
// import handover from './components/settings/handover'; // 工作交接

// 替换路由组件或增加
let systemRouteConfig = function (router, newComps = []) {
  if (arguments.length !== 2 || !(arguments[1] instanceof Array)) {
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
      for (let key in defaultSlot[index]) {
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
  systemRoute, systemStoreConfig, systemRouteConfig
}
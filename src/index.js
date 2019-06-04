import './api';
import systemRoute from './components/';
import storeModules from './store/';

let systemStoreConfig = {
    install: (Vue) => {
      Vue.mixin({
        beforeCreate: function () {
          let options = this.$options
          // store injection
          if (options.store) {
            for (let module in storeModules) {
              options.store.registerModule(module, storeModules[module])
            }
          }
        }
      })
    }
  }
  

export {systemRoute,systemStoreConfig};
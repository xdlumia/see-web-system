import Vue from 'vue'
import Router from 'vue-router'
import systemRoute from '../components'

const {Employee, Dept, Role, BusinessDictionary} = systemRoute

const getPage = (path) => () =>
  import (`../views/${path}.vue`)

// 布局组件
const Layout = () =>
  import('../components/dev/layout.vue')
// 登陆组件
const Login = () =>
  import('../components/dev/login')

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [{
    path: '/login',
    name: 'login',
    component: Login,
    meta: {
      title: 'a-system 装修管理'
    }
  },
    {
      path: '/',
      component: Layout,
      children: [
        Employee,
        Dept,
        Role,
        BusinessDictionary,
        {
          path: "lab",
          component: getPage('lab/index'),
          meta: {title: '测试', icon: 'setthe', parent: '测试', code: 'housejoin_system'},
        }
      ]
    },
    {
      path: '*', // 如果找不到页面跳转到404
      redirect: '/'
    }
  ]
})

// // 系统设置
import Employee from './employee/index'; // 员工
import Dept from './dept/index'; // 部门
import Role from './role/index'; // 角色
import Org from './org/index'; //组织类型
const BusinessDictionary = () => import('./businessDictionary/index') // 业务字典
const CategoryManagement = () => import('./categoryManagement/index') // 类目管理

export default {
  BusinessDictionary: {
    path: '/system/businessDictionary', // 业务字典
    name: '/system/businessDictionary',
    component: BusinessDictionary,
    meta: {
      parent: '系统管理',
      title: '业务字典'
    }
  },
  Employee: {
    path: '/system/employee', // 员工管理
    name: '/system/employee',
    component: Employee,
    meta: {
      parent: '系统管理',
      title: '员工管理'
    }
  },
  Dept: {
    path: '/system/dept', // 部门管理
    name: '/system/dept',
    component: Dept,
    meta: {
      parent: '系统管理',
      title: '部门管理'
    }
  },
  Org: {
    path: '/system/org', // 组织类型管理
    name: '/system/org',
    component: Org,
    meta: {
      parent: '系统管理',
      title: '组织类型管理'
    }
  },
  Role: {
    path: '/system/role', // 角色管理
    name: '/system/role',
    component: Role,
    meta: {
      parent: '系统管理',
      title: '角色管理'
    }
  },
  CategoryManagement: {
    path: '/asistant/categoryManagement', // 类目管理
    name: '/asistant/categoryManagement',
    component: CategoryManagement,
    meta: {
      parent: '辅助管理',
      title: '物品类目'
    }
  }
};
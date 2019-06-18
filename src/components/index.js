// // 系统设置
var Employee = () => import('./employee/index'); // 员工
var Dept = () => import('./dept/index'); // 部门
var Role = () => import('./role/index'); // 角色
var Org = () => import('./org/index'); // 组织类型
var BusinessDictionary = () => import('./businessDictionary/index'); // 业务字典
var CategoryManagement = () => import('./categoryManagement/index'); // 类目管理
var BusinessSetting = () => import('./businessSetting/index'); // 业务设置
var Version = () => import('./version/index'); // 版本更新
var Attendance = () => import('./attendance/index'); // 考勤管理
var Ero404 = () => import('./common/404'); // 404
var Ero403 = () => import('./common/403'); // 403


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
  },
  BusinessSetting: {
    path: '/asistant/businessSetting', // 业务设置
    name: '/asistant/businessSetting',
    component: BusinessSetting,
    meta: {
      parent: '辅助管理',
      title: '物品类目'
    }
  },
  Version: {
    path: '/version', // 版本更新
    name: '/version',
    component: Version,
    meta: {
      parent: '辅助管理',
      title: '版本更新'
    }
  },
  Attendance: {
    path: '/attendance', // 考勤管理
    name: '/attendance',
    component: Attendance,
    meta: {
      parent: '更多应用',
      title: '考勤管理'
    }
  },
  Ero404: {
    path: '/404', // 404
    name: '/404',
    component: Ero404,
    meta: {
      title: '抱歉，您访问的页面不存在'
    }
  },
  Ero403: {
    path: '/403', // 403
    name: '/403',
    component: Ero403,
    meta: {
      title: '抱歉，您访问的页面不存在'
    }
  }
};